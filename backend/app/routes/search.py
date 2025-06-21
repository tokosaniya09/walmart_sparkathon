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
    print("✅ Received search request")
    print("📝 Text query:", text)
    if image:
        print("🖼️ Image received:", image.filename)
    else:
        print("🖼️ No image provided")
    text_embedding = generate_text_embedding(text)

    if image:
        image_bytes = await image.read()
        image_embedding = generate_image_embedding(image_bytes)
        final_embedding = [(t + i) / 2 for t, i in zip(text_embedding, image_embedding)]
    else:
        final_embedding = text_embedding

    matched_ids = search_qdrant(final_embedding)

    products = db.query(Product).filter(Product.id.in_(matched_ids)).all()

    result = [
        {
            "name": p.title,
            "description": p.description,
            "image_url": p.image_url,
            "product_url": "",
            "price": p.price,
            "rating": 4.5,
        }
        for p in products
    ]
    print("📦 Returning products:", result)
    return {"products": result}

    

