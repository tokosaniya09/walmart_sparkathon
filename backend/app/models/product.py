from sqlalchemy import Column, String, Float, Boolean, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products_dresses'

    item_id = Column(String, primary_key=True)
    product_id = Column(String)
    title = Column(String)
    brand = Column(String)
    link = Column(String)
    main_image = Column(String)
    rating = Column(Float)
    ratings_total = Column(Integer)
    best_seller = Column(Boolean)
    sponsored = Column(Boolean)
