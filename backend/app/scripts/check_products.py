
from app.db import get_session
from app.models.product import Product

def show_products():
    for session in get_session():
        products = session.query(Product).all()
        for product in products:
            print(product.title, product.item_id)

if __name__ == "__main__":
    show_products()


# for qdrant check
# from qdrant_client import QdrantClient

# client = QdrantClient("localhost", port=6333)

# res = client.count(collection_name="products")
# print(f"Vectors stored in Qdrant: {res.count}")
