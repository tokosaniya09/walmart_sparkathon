# app/routes/search.py
from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.db import get_session as get_db
from app.models import Product
from app.utils.embed import generate_text_embedding, generate_image_embedding
from app.qdrant_client import search_qdrant

router = APIRouter()

@router.post("/api/search")
async def search_products(
    text: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    text_embedding = generate_text_embedding(text)

    if image:
        image_bytes = await image.read()
        image_embedding = generate_image_embedding(image_bytes)
        final_embedding = [(t + i) / 2 for t, i in zip(text_embedding, image_embedding)]
    else:
        final_embedding = text_embedding

    matched_ids = search_qdrant(final_embedding)

    products = db.query(Product).filter(Product.id.in_(matched_ids)).all()

    return {
        "products": [
            {
                "name": p.title,
                "description": p.description,
                "image_url": p.image_url,
                "product_url": "",
                "price": p.price,
                "rating": 4.5,  # placeholder
            }
            for p in products
        ]
    }


# from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# from app.utils.embed import generate_text_embedding, generate_image_embedding
# from app.db import get_session
# from app.models import Product
# from sqlalchemy.orm import Session
# from fastapi import Depends
# from typing import Optional
# import numpy as np
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import Filter, FieldCondition, MatchValue

# router = APIRouter()

# @router.post("/api/search")
# async def search_products(
#     text: str = Form(...),
#     image: Optional[UploadFile] = File(None),
#     db: Session = Depends(get_session),
# ):
#     try:
#         # Generate embeddings
#         text_embedding = generate_text_embedding(text)

#         image_embedding = None
#         if image:
#             image_embedding = generate_image_embedding(await image.read())

#         # Combine embeddings
#         if image_embedding is not None:
#             combined_embedding = (np.array(text_embedding) + np.array(image_embedding)) / 2
#         else:
#             combined_embedding = np.array(text_embedding)

#         # Qdrant search
#         qdrant = QdrantClient(url="http://localhost:6333")
#         hits = qdrant.search(
#             collection_name="products",
#             query_vector=combined_embedding.tolist(),
#             limit=10
#         )

#         product_ids = [hit.payload["product_id"] for hit in hits]

#         # Fetch from PostgreSQL
#         products = db.query(Product).filter(Product.id.in_(product_ids)).all()

#         return [product.dict() for product in products]

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
