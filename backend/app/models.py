from sqlmodel import SQLModel, Field
from typing import Optional, List

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    price: float
    image_url: str
    category: str
