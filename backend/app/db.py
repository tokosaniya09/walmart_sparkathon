from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker  
from .config import settings

engine = create_engine(settings.POSTGRES_URL, echo=True)

# ✅ Correct factory setup
SessionLocal = sessionmaker(engine, class_=Session, expire_on_commit=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with SessionLocal() as session:
        yield session
