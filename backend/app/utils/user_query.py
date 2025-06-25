import os
from typing import Optional
from PIL import Image
import torch
import io
from qdrant_client import QdrantClient
from transformers import BlipProcessor, BlipForConditionalGeneration, CLIPProcessor, CLIPModel

# Load environment variables if needed
from dotenv import load_dotenv
load_dotenv()

# Qdrant client init (host/port should be set in .env)
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "products")

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# Load BLIP for image captioning
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Load CLIP for embeddings
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

def generate_caption(image: Image.Image) -> str:
    inputs = blip_processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    caption = blip_processor.decode(output[0], skip_special_tokens=True)
    return caption

def generate_clip_text_embedding(text: str):
    inputs = clip_processor(text=text, return_tensors="pt", padding=True)
    with torch.no_grad():
        features = clip_model.get_text_features(**inputs)
    return features[0].detach().numpy()

def handle_user_query(query_text: Optional[str] = None, image_bytes: Optional[bytes] = None, limit: int = 10):
    final_query_text = ""

    # Handle image captioning if image provided
    if image_bytes:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        caption = generate_caption(image)
        final_query_text = caption
        if query_text:
            final_query_text += f" {query_text}"
    elif query_text:
        final_query_text = query_text
    else:
        raise ValueError("At least one of query_text or image_bytes must be provided")

    # Generate embedding from final query
    query_embedding = generate_clip_text_embedding(final_query_text)

    # Search Qdrant
    search_results = client.search(
        collection_name=QDRANT_COLLECTION,
        query_vector=query_embedding,
        limit=limit
    )

    # Collect product metadata
    matched_products = []
    for result in search_results:
        matched_products.append({
            "id": result.id,
            "score": result.score,
            "payload": result.payload
        })

    return matched_products

# Example usage:
# with open("sample_image.jpg", "rb") as f:
#     image_bytes = f.read()
# results = handle_user_query(query_text="leather bag", image_bytes=image_bytes)
# print(results)
# Or for text-only: handle_user_query(query_text="red shoes")