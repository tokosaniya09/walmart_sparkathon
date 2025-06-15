import requests
from app.config import settings

def fetch_products_from_bluecart(query: str):
    url = "https://api.bluecartapi.com/request"
    params = {
        "api_key": settings.BLUECART_API_KEY,
        "type": "search",
        "search_term": query,
        "amazon_domain": "amazon.com"
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "search_results" in data.get("search_results", {}):
        return data["search_results"]
    return []
