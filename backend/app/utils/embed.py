# app/utils/embed.py
from sentence_transformers import SentenceTransformer
from PIL import Image
import torch
from torchvision import transforms
import io

text_model = SentenceTransformer("clip-ViT-B-32")
image_model = text_model  # same model supports both

def generate_text_embedding(text: str):
    return text_model.encode(text).tolist()

def generate_image_embedding(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    preprocess = transforms.Compose([
        transforms.Resize(224, interpolation=transforms.InterpolationMode.BICUBIC),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=(0.48145466, 0.4578275, 0.40821073),
                             std=(0.26862954, 0.26130258, 0.27577711))
    ])
    image_tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        embedding = image_model.encode(image_tensor, convert_to_numpy=True)
    return embedding[0].tolist()


# from PIL import Image
# from transformers import CLIPProcessor, CLIPModel
# import torch
# import io

# model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
# processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# def generate_text_embedding(text: str):
#     inputs = processor(text=[text], return_tensors="pt", padding=True)
#     outputs = model.get_text_features(**inputs)
#     return outputs[0].detach().numpy().tolist()

# def generate_image_embedding(image_bytes: bytes):
#     image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
#     inputs = processor(images=image, return_tensors="pt")
#     outputs = model.get_image_features(**inputs)
#     return outputs[0].detach().numpy().tolist()
