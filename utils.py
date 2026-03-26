import requests

# Hardcoded exchange rates for sandbox stability to avoid API limit/network issues
EXCHANGE_RATES = {
    "USD": 1.0,
    "EUR": 1.08,  # 1 EUR = 1.08 USD
    "GBP": 1.26,  # 1 GBP = 1.26 USD
    "JPY": 0.0067 # 1 JPY = 0.0067 USD
}

def get_exchange_rate(from_currency, to_currency):
    """
    Get the exchange rate to convert from one currency to another.
    """
    if from_currency == to_currency:
        return 1.0

    rate_to_usd = EXCHANGE_RATES.get(from_currency)
    if not rate_to_usd:
        raise ValueError(f"Unsupported currency: {from_currency}")

    to_rate = EXCHANGE_RATES.get(to_currency)
    if not to_rate:
        raise ValueError(f"Unsupported currency: {to_currency}")
    rate_from_usd = 1 / to_rate

    return rate_to_usd * rate_from_usd

def convert_currency(amount, from_currency, to_currency):
    """
    Convert an amount from one currency to another.
    """
    rate = get_exchange_rate(from_currency, to_currency)
    return round(amount * rate, 2)

def calculate_adjusted_price(base_price, product_country, user_country, price_currency, user_currency):
    """
    Calculate the final price adjusted for estimated tax refunds and import duties.

    Simplified rules:
    - If user_country == product_country, no adjustments.
    - If buying from EU (e.g. IT) as a non-EU resident (e.g. US), apply an estimated 12% VAT refund.
    - If buying from UK as non-UK resident, apply an estimated 15% VAT refund.
    - If importing to US > $800 value, apply a 5% import duty (calculated on the final refunded value in USD).
    """
    # 1. First convert base price to USD to check import duty thresholds easily
    price_in_usd = convert_currency(base_price, price_currency, "USD")

    refund_pct = 0.0
    duty_pct = 0.0

    # Check VAT refunds
    if user_country != product_country:
        if product_country == "IT" and user_country not in ["IT", "FR", "DE"]: # simplistic EU check
            refund_pct = 0.12 # 12% VAT refund in Italy
        elif product_country == "GB":
            refund_pct = 0.15 # 15% VAT refund in UK
        elif product_country == "JP":
            refund_pct = 0.10 # 10% tax free Japan

    # Apply refund to get adjusted price in USD
    refunded_price_usd = price_in_usd * (1 - refund_pct)

    # Check Import Duties
    if user_country == "US" and user_country != product_country:
        if refunded_price_usd > 800:
            duty_pct = 0.05 # 5% generic duty on imports over $800 to US

    # Final adjusted price in USD
    final_price_usd = refunded_price_usd * (1 + duty_pct)

    # Convert final adjusted price back to user's currency
    final_price_user_curr = convert_currency(final_price_usd, "USD", user_currency)

    # Calculate savings/details
    refund_amount_user_curr = convert_currency(price_in_usd * refund_pct, "USD", user_currency)
    duty_amount_user_curr = convert_currency(refunded_price_usd * duty_pct, "USD", user_currency)

    return {
        "final_price": round(final_price_user_curr, 2),
        "base_price_user_curr": convert_currency(base_price, price_currency, user_currency),
        "refund_pct": refund_pct,
        "refund_amount": round(refund_amount_user_curr, 2),
        "duty_pct": duty_pct,
        "duty_amount": round(duty_amount_user_curr, 2)
    }
