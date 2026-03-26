import asyncio
from playwright.async_api import async_playwright, expect

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_timeout(500)

        # Verify page loaded
        await expect(page.locator("h1")).to_have_text("Global Price Comparison")

        # Select US as user country
        await page.locator("#user_country").select_option("US")

        # Select product
        await page.locator("#product_name").select_option("Bormes Gilet")

        # Click Compare
        await page.locator("button[type='submit']").click()
        await page.wait_for_timeout(500)

        # Verify results appear
        await expect(page.locator("#results-title")).to_contain_text("Price Comparison for Bormes Gilet")
        await expect(page.locator("#best-deal h2")).to_contain_text("Best Deal Found")

        # Verify a table row with the lowest price (GB should be cheapest for Bormes Gilet if US user)
        # We just check the results are populated.
        rows = await page.locator("#results-body tr").count()
        assert rows > 0, "No results rows found"

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
