import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        # use a more realistic browser launch
        browser = await p.chromium.launch(headless=True, args=['--disable-blink-features=AutomationControlled'])
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 720}
        )
        page = await context.new_page()
        try:
            url = 'https://www.moncler.com/en-us/men/outerwear/short-down-jackets/maya-short-down-jacket-black-I20911A5360068950999.html'
            await page.goto(url, timeout=15000)
            html = await page.content()
            with open("product.html", "w") as f:
                f.write(html)
            print(await page.title())
        except Exception as e:
            print(f"Error: {e}")
        await browser.close()

asyncio.run(run())
