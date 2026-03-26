import csv
import random

def mock_scrape_moncler():
    """
    Simulates scraping moncler.com since they have strict anti-bot measures.
    In a real scenario, this would use Playwright to navigate the site, bypass Cloudflare/Akamai,
    find products, switch regions, and record prices.
    Here we generate a fallback mock data CSV for the app to work with.
    """
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
            "product_name": "Maya Short Down Jacket",
            "product_id": "I20911A5360068950999",
            "country": "JP",
            "currency": "JPY",
            "price": 240000.00
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

    with open('moncler_prices.csv', 'w', newline='') as csvfile:
        fieldnames = ['product_name', 'product_id', 'country', 'currency', 'price']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in mock_data:
            writer.writerow(row)
    print("Scraped mock data written to moncler_prices.csv")

if __name__ == "__main__":
    mock_scrape_moncler()
