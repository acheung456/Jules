import unittest
from app import app
from utils import convert_currency, calculate_adjusted_price

class TestPriceComparisonApp(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Global Price Comparison', response.data)

    def test_results_page_missing_params(self):
        response = self.app.get('/results')
        self.assertEqual(response.status_code, 400)

    def test_results_page_success(self):
        # We assume "Maya Short Down Jacket" and "US" exist in the mock data map
        response = self.app.get('/results?user_country=US&product_name=Maya+Short+Down+Jacket')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Price Comparison for Maya Short Down Jacket', response.data)
        self.assertIn(b'Best Deal Found', response.data)

    def test_currency_conversion(self):
        # Test basic conversion with our hardcoded rates
        # 1 EUR = 1.08 USD
        self.assertEqual(convert_currency(100, "EUR", "USD"), 108.0)
        # 100 USD to EUR = 100 / 1.08
        self.assertEqual(convert_currency(108, "USD", "EUR"), 100.0)

    def test_tax_refund_logic_us_buying_in_it(self):
        # US user buying in IT (EUR)
        # Base price 1000 EUR
        base_price_eur = 1000.0
        # 1000 EUR = 1080 USD

        # calculate_adjusted_price(base_price, product_country, user_country, price_currency, user_currency)
        adj = calculate_adjusted_price(base_price_eur, "IT", "US", "EUR", "USD")

        # 12% discount applies since US != IT (and US not in IT/FR/DE)
        # Refund pct should be 0.12
        self.assertEqual(adj["refund_pct"], 0.12)

        # 1080 USD * 0.12 = 129.6
        self.assertAlmostEqual(adj["refund_amount"], 129.6, places=1)

        # Refunded price in USD = 1080 - 129.6 = 950.4
        # Duty checks: > 800 USD gets 5% duty.
        # 950.4 > 800, so duty applies.
        # Duty = 950.4 * 0.05 = 47.52
        self.assertEqual(adj["duty_pct"], 0.05)
        self.assertAlmostEqual(adj["duty_amount"], 47.52, places=1)

        # Final price = 950.4 + 47.52 = 997.92
        self.assertAlmostEqual(adj["final_price"], 997.92, places=1)

    def test_tax_refund_logic_us_buying_in_us(self):
        # US user buying in US (USD)
        # No refund, no duty
        adj = calculate_adjusted_price(1000.0, "US", "US", "USD", "USD")
        self.assertEqual(adj["refund_pct"], 0.0)
        self.assertEqual(adj["duty_pct"], 0.0)
        self.assertEqual(adj["final_price"], 1000.0)

if __name__ == '__main__':
    unittest.main()
