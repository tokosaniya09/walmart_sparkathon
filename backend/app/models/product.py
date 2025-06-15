from sqlalchemy import Column, Integer, String, Float, DateTime, text
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String)
    category = Column(String)
    brand = Column(String)
    price = Column(Float)
    image_url = Column(String)
    source_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
