import os
import requests
from dotenv import load_dotenv
from tqdm import tqdm
from sqlmodel import Session
from app.db import engine
from app.models import Product
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct
from sentence_transformers import SentenceTransformer
import uuid
from app.utils.product_classify import classify_product_fields

load_dotenv()

API_KEY = os.getenv("BLUECART_API_KEY") 
QDRANT_URL = os.getenv("QDRANT_URL") 
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") 
COLLECTION_NAME = "products"

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
model = SentenceTransformer("clip-ViT-B-32")

CATEGORIES = [
    "shampoo", "dress", "shirt", "laptop", "earrings", "sofa", "curtains", "phone",
    "jacket", "toys", "makeup", "mirror", "bed", "table", "camera", "headphones",
    "watch", "wallet", "backpack", "sneakers"
]

def fetch_products(category: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": category
    }
    try:
        resp = requests.get(url, params=params)
        data = resp.json()
        return data.get("search_results", [])
    except Exception:
        print(f"❌ Error fetching for {category}")
        return []

def process_product(item, category):
    p = item.get("product", {})
    o = item.get("offers", {}).get("primary", {})
    if not p or not o:
        return None, None

    title = p.get("title", "No Title")
    description = f"Rating: {p.get('rating', 'N/A')} stars ({p.get('ratings_total', 0)} reviews)"
    price = float(o.get("price", 0))
    image_url = p.get("main_image") or p.get("link", "")

    # 🔍 Auto-classify
    try:
        enriched = classify_product_fields(title, description)
    except Exception as e:
        print(f"❌ Classification failed for '{title}': {e}")
        enriched = {}


    product = Product(
        title=title,
        description=description,
        price=price,
        image_url=image_url,
        category=category.title(),
        sub_category=enriched.get("sub_category"),
        item_type=enriched.get("item_type"),
        color=enriched.get("color"),
        material=enriched.get("material")
    )

    embed_input = f"{title}. {description}. "
    vector = model.encode(embed_input).tolist()

    return product, vector

def main():
    all_products = []

    with Session(engine) as session:
        for category in CATEGORIES:
            print(f"\n🔍 Fetching category: {category}")
            results = fetch_products(category)

            for item in tqdm(results, desc=f"Inserting {category}", ncols=90):
                product, vector = process_product(item, category)
                if product and vector:
                    session.add(product)
                    session.flush()  # get auto-generated ID

                    point = PointStruct(
                        id=str(uuid.uuid4()),
                        vector=vector,
                        payload={
                            "title": product.title,
                            "category": product.category,
                            "description": product.description,
                            "product_id": product.id
                        }
                    )
                    client.upsert(collection_name=COLLECTION_NAME, points=[point])
        session.commit()
        print("✅ All data saved to PostgreSQL and Qdrant.")

if __name__ == "__main__":
    main()
