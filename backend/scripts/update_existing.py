from sqlmodel import Session, select
from app.db import engine
from app.models import Product
from tqdm import tqdm

from app.utils.product_classify import classify_product_fields  # From Step 3

def enrich_products():
    with Session(engine) as session:
        products = session.exec(select(Product)).all()

        for product in tqdm(products):
            try:
                enriched = classify_product_fields(product.title, product.description)
                product.sub_category = enriched.get("sub_category")
                product.item_type = enriched.get("item_type")
                product.color = enriched.get("color")
                product.material = enriched.get("material")
                session.add(product)
            except Exception as e:
                print(f"⚠️ Skipped: {product.title} → {e}")

        session.commit()
        print("✅ Enrichment completed!")

if __name__ == "__main__":
    enrich_products()
