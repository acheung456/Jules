import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto('https://www.moncler.com/en-us/', timeout=10000)
            html = await page.content()
            with open("moncler.html", "w") as f:
                f.write(html)
        except Exception as e:
            print(f"Error: {e}")
        await browser.close()

asyncio.run(run())
