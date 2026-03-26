import json
import random

# We will mock the scraped data since we are blocked by Akamai/Cloudflare on moncler.com
# The app logic will still be built to load data from this CSV/JSON, and the web app
# will use it to display the cheapest prices based on user nationality.

mock_data = [
    {
        "product_name": "Maya Short Down Jacket",
        "product_id": "I20911A5360068950999",
        "country": "US",
        "currency": "USD",
        "price": 1850.00
    },
    {
        "product_name": "Maya Short Down Jacket",
        "product_id": "I20911A5360068950999",
        "country": "IT",
        "currency": "EUR",
        "price": 1250.00
    },
    {
        "product_name": "Maya Short Down Jacket",
        "product_id": "I20911A5360068950999",
        "country": "GB",
        "currency": "GBP",
        "price": 1150.00
    },
    {
        "product_name": "Bormes Gilet",
        "product_id": "H20911A0014453333999",
        "country": "US",
        "currency": "USD",
        "price": 1200.00
    },
    {
        "product_name": "Bormes Gilet",
        "product_id": "H20911A0014453333999",
        "country": "IT",
        "currency": "EUR",
        "price": 850.00
    },
    {
        "product_name": "Bormes Gilet",
        "product_id": "H20911A0014453333999",
        "country": "GB",
        "currency": "GBP",
        "price": 790.00
    }
]

import pandas as pd

df = pd.DataFrame(mock_data)
df.to_csv('moncler_prices.csv', index=False)
print("Generated mock data in moncler_prices.csv")
