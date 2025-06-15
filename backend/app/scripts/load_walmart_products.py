import requests
from app.db import get_session
from app.services.embedding_service import EmbeddingService
from app.services.qdrant_service import QdrantService
from app.models.product import Product
from sqlalchemy.orm import Session



API_KEY = "70F447D600604071BF55A39C454388D9"
embedder = EmbeddingService()
qdrant = QdrantService()

def fetch_products(keyword, limit=3):
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": keyword,
        "sort_by": "best_seller"
    }
    r = requests.get("https://api.bluecartapi.com/request", params=params)
    data = r.json()
    return data.get("search results", [])[:limit]

def load_products_to_db(db: Session, keyword):
    items = fetch_products(keyword)
    for item in items:
        prod = item.get("product", {})

        product = Product(
            item_id=prod.get("item_id"),
            product_id=prod.get("product_id"),
            title=prod.get("title", "Unknown Title"),
            brand=prod.get("brand", "Unknown Brand"),
            link=prod.get("link", ""),
            main_image=prod.get("main_image") or "",  # fallback if image missing
            rating=prod.get("rating", 0.0),
            ratings_total=prod.get("ratings_total", 0),
            best_seller=prod.get("best_seller", False),
            sponsored=prod.get("sponsored", False)
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        # Embed image + title
        embedding = embedder.get_combined_embedding(product.main_image, product.title)
        qdrant.add_product_embedding(product.item_id, embedding)

        print(f" Added '{product.title}' (ID: {product.item_id})")


def main():
    from app.db import SessionLocal
    with SessionLocal() as db:
        load_products_to_db(db, "dresses")
        
        # Add more categories as needed

if __name__ == "__main__":
    main()
