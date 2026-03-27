import asyncio
from playwright.async_api import async_playwright, expect

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_timeout(500)

        # Verify page loaded
        await expect(page.locator("h1")).to_have_text("MONCLER", ignore_case=True)

        # Select US as user country
        await page.locator("#user_country").select_option("US")

        # Select product
        await page.locator("#product_name").select_option("Bormes Gilet")

        # Click Compare
        await page.evaluate('document.getElementById("compare-form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));')
        await page.wait_for_timeout(500)

        # Verify results appear
        await expect(page.locator("#results-title")).to_contain_text("Bormes Gilet")
        await expect(page.locator("#results-container")).to_be_visible()

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
