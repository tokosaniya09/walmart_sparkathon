import requests

def main():
    query = input("Enter your product search query (e.g. sneakers): ")

    response = requests.post(
        "http://127.0.0.1:8000/api/search",
        data={"text": query}
    )

    if response.status_code == 200:
        products = response.json().get("products", [])
        if not products:
            print("No products found.")
            return

        print("\n🔍 Search Results:")
        for i, p in enumerate(products, 1):
            print(f"\n{i}. {p['name']}")
            print(f"   Description: {p['description']}")
            print(f"   Image URL:   {p['image_url']}")
            print(f"   Price:       {p['price']}")
            print(f"   Rating:      {p['rating']}")
    else:
        print(f"❌ Request failed with status {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    main()
