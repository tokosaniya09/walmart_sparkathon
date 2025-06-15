from app.models.product import Product
from app.db import create_db_and_tables, engine

print("Using DB:", engine.url)

def main():
    print(" Creating tables...")
    create_db_and_tables()
    print(" Done!")

if __name__ == "__main__":
    main()
