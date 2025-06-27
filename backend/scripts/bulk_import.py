import os
import time
import requests
from uuid import uuid4
from dotenv import load_dotenv
from tqdm import tqdm
from sqlmodel import Session
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct
from sentence_transformers import SentenceTransformer

from app.db import engine
from app.models import Product

load_dotenv()

API_KEY = os.getenv("BLUECART_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "products"
TRACK_FILE = "processed_categories.txt"

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

CATEGORIES = [
    "scarf", "hat", "beanie", "gloves", "boots", "sneakers", "sandals", "loafers", "heels", "flip flops",
    "diapers", "baby wipes", "baby formula", "baby lotion", "baby shampoo", "stroller", "car seat",
    "baby bottle", "pacifier", "baby food", "bib", "onesie", "baby blanket", "crib", "toddler shoes",
    "toys", "teething ring", "rattle", "baby monitor", "baby swing", "diaper bag", "potty seat",
    "shampoo", "conditioner", "face wash", "face cream", "sunscreen", "moisturizer", "deodorant", "toothpaste",
    "toothbrush", "mouthwash", "razor", "shaving cream", "perfume", "body wash", "lip balm", "mascara",
    "eyeliner", "nail polish", "foundation", "face mask", "makeup remover", "makeup brush", "hair brush",
    "sofa", "couch", "bed frame", "mattress", "nightstand", "coffee table", "chair", "ottoman", "TV stand",
    "bookshelf", "lamp", "rug", "pillow", "blanket", "duvet", "sheet set", "mirror", "clock",
    "laundry basket", "storage bin", "trash can", "ironing board", "shelf liner", "wall decor",
    "knife set", "frying pan", "saucepan", "non-stick pan", "spatula", "blender", "juicer", "toaster", "coffee maker",
    "microwave", "kettle", "rice cooker", "pressure cooker", "slow cooker", "baking tray", "measuring cup",
    "mixing bowl", "cutting board", "dish rack", "water bottle", "thermos", "lunch box", "coffee mug",
    "dish soap", "laundry detergent", "fabric softener", "disinfectant spray", "glass cleaner", "mop",
    "broom", "vacuum cleaner", "floor cleaner", "toilet cleaner", "air freshener", "sponge", "duster",
    "trash bags", "paper towels", "toilet paper", "scrub brush", "gloves", "lint roller", "plunger",
    "milk", "bread", "eggs", "cheese", "yogurt", "cereal", "oats", "flour", "sugar", "salt", "pasta",
    "noodles", "rice", "lentils", "beans", "ketchup", "mayonnaise", "peanut butter", "jam", "cookies",
    "chips", "crackers", "frozen pizza", "frozen vegetables", "soda", "juice", "tea", "coffee",
    "vitamin C", "multivitamin", "protein powder", "omega 3", "hand sanitizer", "thermometer",
    "first aid kit", "bandaid", "pain reliever", "cough syrup", "allergy medicine", "glucose monitor",
    "heating pad", "blood pressure monitor", "weight scale", "face mask", "eye drops", "inhaler",
    "screwdriver", "drill", "hammer", "wrench", "pliers", "saw", "nails", "screws", "tape measure",
    "toolbox", "flashlight", "ladder", "extension cord", "duct tape", "sandpaper", "level", "paint roller",
    "car tire", "motor oil", "car battery", "air freshener car", "windshield wiper", "car charger",
    "car cover", "jumper cables", "car vacuum", "seat cover", "steering wheel cover", "tire inflator",
    "dog food", "cat food", "pet bed", "pet bowl", "leash", "collar", "pet shampoo", "litter box",
    "dog toy", "cat toy", "scratching post", "pet carrier", "grooming brush", "dog treats",
    "video game", "gaming laptop", "gaming mouse", "controller", "PS5", "Xbox Series X", "Nintendo Switch",
    "gaming chair", "gamepad", "gaming monitor", "joystick", "gaming keyboard", "VR controller",
    "notebook", "pen", "pencil", "stapler", "eraser", "highlighter", "printer paper", "sticky notes",
    "file folder", "binder", "tape", "glue", "scissors", "desk organizer", "whiteboard", "marker", "tent", "sleeping bag", "flashlight", "cooler", "backpack", "hiking boots", "fishing rod", "yoga mat", "dumbbells", "jump rope", "treadmill", "bike", "helmet", "sports shoes", "christmas tree", "holiday lights", "halloween costume", "pumpkin decor", "gift wrap", "greeting card", "balloon set", "party hats", "cake topper", "candles", "easter eggs", "new year confetti","batteries", "light bulb", "sewing kit", "fan", "dehumidifier", "alarm clock", "key holder", "phone stand"
] 


def fetch_products(category: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": category
    }
    try:
        response = requests.get(url, params=params)
        return response.json().get("search_results", [])
    except Exception as e:
        print(f"❌ Error fetching category '{category}': {e}")
        return []


def process_product(item, category: str):
    p = item.get("product", {})
    o = item.get("offers", {}).get("primary", {})
    if not p or not o:
        return None, None

    title = p.get("title")
    description = f"Rating: {p.get('rating', 'N/A')} stars ({p.get('ratings_total', 0)} reviews)"
    price = float(o.get("price", 0))
    image_url = p.get("main_image") or (p.get("images") or [None])[0]

    if not title or not image_url:
        return None, None

    product = Product(
        title=title,
        description=description,
        price=price,
        image_url=image_url,
        category=category.title(),
        sub_category=None,
        item_type=None,
        color=None,
        material=None,
        rating=p.get("rating")
    )

    # Embedding input tuned for semantic search
    embed_input = (
        f"Category: {category}. Title: {title}. Description: {description}."
    )
    vector = model.encode(embed_input).tolist()

    return product, vector


def load_processed():
    if os.path.exists(TRACK_FILE):
        with open(TRACK_FILE, "r") as f:
            return set(line.strip() for line in f.readlines())
    return set()


def save_processed(category):
    with open(TRACK_FILE, "a") as f:
        f.write(category + "\n")


def main():
    processed = load_processed()
    print(f"📂 Processed categories: {(processed)}")
    pending = [cat for cat in CATEGORIES if cat not in processed]
    print(f"📦 Remaining categories: {len(pending)}")

    with Session(engine) as session:
        for category in pending:
            print(f"\n🔍 Fetching category: {category}")
            results = fetch_products(category)

            inserted = 0
            for item in tqdm(results, desc=f"Inserting {category}", ncols=100):
                if inserted >= 25:
                    break

                product, vector = process_product(item, category)

                if product and vector:
                    try:
                        session.add(product)
                        session.commit()
                    except Exception as e:
                        print(f"❌ DB commit failed: {e}")
                        session.rollback()
                        continue

                    try:
                        point = PointStruct(
                            id=str(uuid4()),
                            vector=vector,
                            payload={
                                "product_id": product.id,
                                "title": product.title,
                                "category": product.category,
                                "description": product.description,
                                "rating": product.rating,
                                "image_url": product.image_url,
                            }
                        )
                        client.upsert(collection_name=COLLECTION_NAME, points=[point])
                    except Exception as e:
                        print(f"❌ Qdrant insert failed: {e}")
                        continue

                    inserted += 1

            save_processed(category)
            print(f"✅ Inserted {inserted} products for {category}")
            time.sleep(1)

    print("🏁 All categories completed.")


if __name__ == "__main__":
    main()
