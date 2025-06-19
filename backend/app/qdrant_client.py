import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv
from fastapi import HTTPException


load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "products"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=10.0
)

def search_qdrant(vector, top_k=10):
    try:
        search_result = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=vector,
            limit=top_k
        )
        product_ids = [hit.payload["product_id"] for hit in search_result]
        return product_ids
    except Exception as e:
        print("❌ Qdrant search failed:", e)
        raise HTTPException(status_code=500, detail="Vector search failed. Please check Qdrant connection or data.")

