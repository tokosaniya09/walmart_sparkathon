# app/routes/search.py
from fastapi import APIRouter, UploadFile, File, Form,Query, Depends
from sqlalchemy.orm import Session
from sqlmodel import select
from sqlalchemy import text
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
    # print("✅ Received search request")
    # print("📝 Text query:", text)
    # if image:
    #     print("🖼️ Image received:", image.filename)
    # else:
    #     print("🖼️ No image provided")

    text_embedding = generate_text_embedding(text)
    print("🔍 Text Embedding:", text_embedding[:5], "...")

    if image:
        image_bytes = await image.read()
        image_embedding = generate_image_embedding(image_bytes)
        final_embedding = [(t + i) / 2 for t, i in zip(text_embedding, image_embedding)]
    else:
        final_embedding = text_embedding

    matched_ids = search_qdrant(final_embedding)
    print("🧠 Qdrant Matched IDs:", matched_ids)

    products = db.query(Product).filter(Product.id.in_(matched_ids)).all()

    result = [
        {
            "name": p.title,
            "description": p.description,
            "image_url": p.image_url,
            "product_url": "",
            "price": p.price,
            "rating": p.rating,
        }
        for p in products
    ]
    print("📦 Returning products:", result)
    return {"products": result}

    

@router.get("/api/search-suggestions")
def search_suggestions(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT DISTINCT suggestion FROM (
                    SELECT category AS suggestion FROM product
                    WHERE LOWER(category) LIKE :q AND category IS NOT NULL
                    UNION
                    SELECT sub_category AS suggestion FROM product
                    WHERE LOWER(sub_category) LIKE :q AND sub_category IS NOT NULL
                ) AS suggestions
                LIMIT 10;
            """),
            {"q": f"{q.lower()}%"}
        )
        suggestions = [row[1] for row in result]
        return {"suggestions": suggestions}
    except Exception as e:
        print("❌ Error in search_suggestions:", str(e))
        return {"suggestions": []}

    # # Case-insensitive, startswith query
    # result = db.execute(
    #     text("SELECT title FROM products WHERE LOWER(title) LIKE :q LIMIT 10"),
    #     {"q": f"{q.lower()}%"}

    #     # text("SELECT name FROM products WHERE LOWER(name) LIKE :q LIMIT 10"),
    #     # {"q": f"{q.lower()}%"}
    # )
    # suggestions = [row[0] for row in result]
    # return {"suggestions": suggestions}