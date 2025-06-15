from sqlmodel import SQLModel, create_engine, Session
from .config import settings

engine = create_engine(settings.POSTGRES_URL, echo=True)
SessionLocal = Session(engine)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
