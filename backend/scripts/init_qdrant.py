import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
# QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = "https://2d82c9c0-8526-4968-b9db-5763bf1ede84.europe-west3-0.gcp.cloud.qdrant.io"
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.Y3DsaOaEUI1AxFnKnVQXp9xNKFClKMhqIlY8BYaRZBw"
client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

collection_name = "products"

if not client.collection_exists(collection_name=collection_name):
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=512, distance=Distance.COSINE)
    )
    print(f"✅ Created Qdrant collection: {collection_name}")
else:
    print(f"⚠️ Collection '{collection_name}' already exists")
