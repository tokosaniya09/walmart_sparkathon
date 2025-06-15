from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(host="localhost", port=6333)
        self.collection_name = "products"
        self.ensure_collection()

    def ensure_collection(self):
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=512, distance=Distance.COSINE)
            )

    def add_product_embedding(self, product_id, embedding):
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(id=int(product_id), vector=embedding, payload={"product_id": product_id})
            ]
        )

    def search_similar(self, embedding, top_k=5):
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            limit=top_k
        )
        return [hit.payload["product_id"] for hit in results]
