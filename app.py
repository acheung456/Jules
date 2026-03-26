import os
import pandas as pd
from flask import Flask, render_template, request, jsonify
from utils import calculate_adjusted_price, convert_currency

app = Flask(__name__)

# Basic currency mapping for countries used in the app
COUNTRY_CURRENCY_MAP = {
    "US": "USD",
    "IT": "EUR",
    "GB": "GBP",
    "JP": "JPY",
    "FR": "EUR",
    "DE": "EUR"
}

# Ensure the mock data exists, if not generate it
if not os.path.exists("moncler_prices.csv"):
    import subprocess
    subprocess.run(["python", "scraper/scraper.py"])

@app.route("/", methods=["GET"])
def index():
    df = pd.read_csv("moncler_prices.csv")
    products = df['product_name'].unique()
    countries = list(COUNTRY_CURRENCY_MAP.keys())
    return render_template("index.html", products=products, countries=countries)

@app.route("/results", methods=["GET"])
def results():
    user_country = request.args.get("user_country")
    product_name = request.args.get("product_name")

    if not user_country or not product_name:
        return "Missing parameters", 400

    user_currency = COUNTRY_CURRENCY_MAP.get(user_country, "USD")

    df = pd.read_csv("moncler_prices.csv")

    # Filter by selected product
    df_product = df[df['product_name'] == product_name]

    if df_product.empty:
        return "Product not found", 404

    results_data = []

    for index, row in df_product.iterrows():
        base_price = row['price']
        product_country = row['country']
        price_currency = row['currency']

        # Calculate adjustments
        adjustments = calculate_adjusted_price(
            base_price, product_country, user_country, price_currency, user_currency
        )

        final_price = adjustments["final_price"]
        base_price_user_curr = adjustments["base_price_user_curr"]
        refund_amount = adjustments["refund_amount"]
        duty_amount = adjustments["duty_amount"]

        results_data.append({
            "product_country": product_country,
            "product_currency": price_currency,
            "original_price": base_price,
            "base_price_converted": base_price_user_curr,
            "tax_refund": refund_amount,
            "import_duty": duty_amount,
            "final_price": final_price,
            "user_currency": user_currency
        })

    # Sort results by lowest final price
    results_sorted = sorted(results_data, key=lambda x: x['final_price'])

    cheapest = results_sorted[0]

    return render_template(
        "results.html",
        product_name=product_name,
        user_country=user_country,
        user_currency=user_currency,
        results=results_sorted,
        cheapest=cheapest
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000)
