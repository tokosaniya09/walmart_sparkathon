import requests
import json

API_KEY = "70F447D600604071BF55A39C454388D9"

def fetch_products(keyword, limit=1):
    params = {
        "api_key": API_KEY,
        "type": "search",
        "search_term": keyword,
        "sort_by": "best_seller"
    }
    r = requests.get("https://api.bluecartapi.com/request", params=params)
    print(f"Status code: {r.status_code}")
    try:
        data = r.json()

        if "search_results" not in data:
            print("No 'search_results' found in the API response.")
        elif not data["search_results"]:
            print("'search_results' is empty.")
        else:
            print("search_results[0] keys:", list(data["search_results"][0].keys()))
            print(json.dumps(results[0]['product'], indent=2))

# this upper line will help in knowing what fields for each category is present run this first by commenting
# out the def filter function once found the keys update the below function to achieve the required ones
        return data.get("search_results", [])[:limit]
    except Exception as e:
        print("Error parsing response:", e)
        return []


# def print_filtered_products(products):
#     for item in products:
#         filtered = {
#             "item_id": item.get("item_id"),
#             "product_id": item.get("product_id"),
#             "title": item.get("title"),
#             "image": item.get("image"),
#             "link": item.get("link")
#         }
#         print(json.dumps(filtered, indent=2))

if __name__ == "__main__":
    results = fetch_products("dresses")
    print_filtered_products(results)
