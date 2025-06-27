import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BLUECART_API_KEY")

def fetch_products(category: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": category
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("search_results", [])
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def main():
    category = input("🔍 Enter category to test: ").strip()
    products = fetch_products(category)

    if not products:
        print("⚠️ No products found.")
        return

    for i, product in enumerate(products[:1]):  # Limit to 2
        # print(f"\n📦 Product {i+1}:")
        print(product)

if __name__ == "__main__":
    main()
