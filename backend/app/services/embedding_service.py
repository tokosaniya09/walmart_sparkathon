import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests
from io import BytesIO

class EmbeddingService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def get_image_embedding(self, image_url_or_file):
        # support both file (user upload) and URL (stored product)
        if isinstance(image_url_or_file, str):
            image = Image.open(BytesIO(requests.get(image_url_or_file).content)).convert("RGB")
        else:
            image = Image.open(image_url_or_file).convert("RGB")

        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            img_emb = self.model.get_image_features(**inputs)
        return img_emb.cpu().numpy()[0]

    def get_text_embedding(self, text: str):
        inputs = self.processor(text=[text], return_tensors="pt").to(self.device)
        with torch.no_grad():
            txt_emb = self.model.get_text_features(**inputs)
        return txt_emb.cpu().numpy()[0]

    def get_combined_embedding(self, image, text):
        img_emb = self.get_image_embedding(image)
        txt_emb = self.get_text_embedding(text)
        combined = (img_emb + txt_emb) / 2  # simple average
        return combined
