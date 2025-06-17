import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("BLUECART_API_KEY")  

def fetch_bluecart_search(search_term: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": search_term,
        # "sort_by": "best seller",        # optional
        # "customer_zipcode": "77001",     # optional
    }
    resp = requests.get(url, params=params)
    print("🔗 URL:", resp.url)
    print("🧾 Status Code:", resp.status_code)
    try:
        data = resp.json()
        print("✅ JSON Response Keys:", list(data.keys()))
        # Print first product for inspection:
        first = data.get("search_results", [])[0]
        print("🏷️ First product snippet:\n", first)
    except Exception:
        print("❌ Failed to parse JSON. Raw response:")
        print(resp.text)

if __name__ == "__main__":
    query = input("Enter search term: ")
    fetch_bluecart_search(query)
import requests
from app.models import Product
from app.db import engine
from sqlmodel import Session
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("BLUECART_API_KEY")

def fetch_products_from_bluecart(search_term: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": search_term
    }

    response = requests.get(url, params=params)
    print("🔗 URL:", response.url)
    print("🧾 Status Code:", response.status_code)

    try:
        data = response.json()
        results = data.get("search_results", [])
        return results
    except Exception:
        print("❌ Could not parse JSON")
        print(response.text)
        return []

def save_to_db(results):
    with Session(engine) as session:
        for item in results:
            p = item.get("product", {})
            o = item.get("offers", {}).get("primary", {})
            if not p or not o:
                continue

            product = Product(
                title=p.get("title", "No Title"),
                description=f"Rating: {p.get('rating', 'N/A')} stars ({p.get('ratings_total', 0)} reviews)",
                price=float(o.get("price", 0)),
                image_url=p.get("link", ""),
                category="Misc"
            )
            session.add(product)
        session.commit()
        print(f"✅ Saved {len(results)} products to DB.")

if __name__ == "__main__":
    query = input("🔍 Enter product keyword to search: ")
    print("⏳ Fetching from BlueCart...")
    results = fetch_products_from_bluecart(query)
    if results:
        save_to_db(results)
    else:
        print("❌ No results found.")
