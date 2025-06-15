from fastapi import APIRouter, UploadFile, Form, File, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.product import Product
from app.services.embedding_service import EmbeddingService
from app.services.qdrant_service import QdrantService
import shutil

router = APIRouter()
embedder = EmbeddingService()
qdrant = QdrantService()

@router.post("/add_product/")
def add_product(
    title: str = Form(...),
    image_url: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    db: Session = Depends(get_db)
):
    # Save to Postgres
    product = Product(title=title, image_url=image_url, category=category, price=price)
    db.add(product)
    db.commit()
    db.refresh(product)

    # Create and store embedding
    embedding = embedder.get_combined_embedding(image_url, title)
    qdrant.add_product_embedding(product.id, embedding)

    return {"status": "Product added successfully", "product_id": product.id}

@router.post("/search/")
def search_products(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    db: Session = Depends(get_db)
):
    temp_path = f"/tmp/{image.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Embed and search
    embedding = embedder.get_combined_embedding(temp_path, prompt)
    matched_ids = qdrant.search_similar(embedding)

    # Get full product info
    results = db.query(Product).filter(Product.id.in_(matched_ids)).all()
    return results
