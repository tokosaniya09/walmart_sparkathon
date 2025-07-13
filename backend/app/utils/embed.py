# app/utils/embed.py

from sentence_transformers import SentenceTransformer
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import io

# BGE for text
text_model = SentenceTransformer("BAAI/bge-large-en-v1.5")

# CLIP for image
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def generate_text_embedding(text: str):
    embedding = text_model.encode(text, normalize_embeddings=True)
    return embedding.tolist()

def generate_image_embedding(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = clip_processor(images=image, return_tensors="pt")

    with torch.no_grad():
        image_features = clip_model.get_image_features(**inputs)
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)

    vec = image_features[0].detach().cpu().numpy().tolist()

    # Pad to 1024 dimensions to match BGE
    padded = vec + [0.0] * (1024 - len(vec))
    return padded

