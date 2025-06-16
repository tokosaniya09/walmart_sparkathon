from sqlmodel import SQLModel
from app.models import Product
from app.db import engine

print("Using DB:", engine.url)

def init_db():
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Done!")

if __name__ == "__main__":
    init_db()
