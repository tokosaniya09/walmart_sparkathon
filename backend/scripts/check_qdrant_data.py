# app/scripts/check_qdrant_data.py
from app.qdrant_client import client, COLLECTION_NAME

def check_stored_vectors():
    print("🔍 Scanning stored vectors in Qdrant...")
    try:
        points, _ = client.scroll(
            collection_name=COLLECTION_NAME,
            limit=10,
            with_payload=True
        )
        for point in points:
            print("🧠 Vector ID:", point.id)
            print("📦 Payload:", point.payload)
            print("------")
    except Exception as e:
        print("❌ Error fetching data from Qdrant:", str(e))

if __name__ == "__main__":
    check_stored_vectors()
