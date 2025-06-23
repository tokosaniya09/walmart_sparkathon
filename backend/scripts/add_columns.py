from sqlalchemy import text
from sqlmodel import Session
from app.db import engine

sql = """
ALTER TABLE product
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS item_type TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS material TEXT;
"""

def run():
    with Session(engine) as session:
        session.exec(text(sql))
        session.commit()
        print("✅ Columns added successfully!")

if __name__ == "__main__":
    run()
