import { stitch } from "@google/stitch-sdk";
import * as fs from 'fs';

async function generateLuxuryUI() {
    try {
        console.log("Connecting to Google Stitch SDK...");
        // You would normally initialize the project with your ID: stitch.project("my-project")
        // The SDK automatically uses environment credentials or a mock for testing in restricted environments
        const project = stitch.project("global-price-compare");

        const prompt = `
        A luxury, high-end, mobile-first UI for a tool that compares Moncler jacket prices globally.
        The design should feature elegant typography (like serif headers and sans-serif body text),
        a sleek dark mode aesthetic with subtle white or gold accents, and a clean, minimalist modern layout.

        It must contain the following specific UI elements:
        1. A form section with two dropdown selects: 'Your Nationality' and 'Select Product'.
        2. A prominent 'Compare Prices' call to action button.
        3. A results section below the form that is hidden by default.
        4. In the results section, a highlighted 'Best Deal' card showing the cheapest option.
        5. In the results section, a data table (or a series of list cards suitable for mobile) displaying: Store Location, Local Price, Converted Base, Est. Tax Refund, Est. Import Duty, and Final Cost.

        Please generate the exact HTML and CSS required for this layout. Include necessary IDs and classes so I can attach my JavaScript logic.
        Use these IDs for the inputs: 'user_country', 'product_name', 'compare-form', 'results-container', 'best-deal', 'results-body'.
        `;

        console.log("Generating UI...");
        const screen = await project.generate(prompt, { device: "MOBILE" });

        console.log("Fetching HTML and CSS...");
        const html = await screen.getHtml();

        fs.writeFileSync('stitch_generated.html', html);
        console.log("Successfully wrote generated UI to stitch_generated.html");

    } catch (e) {
        console.error("Error generating UI with Google Stitch:", e);
        // Fallback for missing API Key/Auth in sandbox
        console.log("Generating mock luxury UI fallback...");
        const fallbackHtml = generateFallbackUI();
        fs.writeFileSync('stitch_generated.html', fallbackHtml);
    }
}

function generateFallbackUI() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moncler Global Price Comparison</title>
    <style>
        :root {
            --bg-dark: #121212;
            --surface-dark: #1e1e1e;
            --text-primary: #f5f5f5;
            --text-secondary: #aaaaaa;
            --accent-gold: #d4af37;
            --border-color: #333333;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .app-header {
            text-align: center;
            padding: 3rem 1.5rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        h1 {
            font-family: 'Didot', 'Bodoni MT', serif;
            font-weight: 400;
            font-size: 2rem;
            letter-spacing: 2px;
            margin: 0 0 0.5rem 0;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 0.85rem;
            color: var(--text-secondary);
            font-weight: 300;
            letter-spacing: 0.5px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-secondary);
        }

        select {
            appearance: none;
            background-color: var(--surface-dark);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 1rem;
            font-size: 1rem;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }

        select:focus {
            border-color: var(--accent-gold);
        }

        button {
            background-color: var(--text-primary);
            color: var(--bg-dark);
            border: none;
            padding: 1rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: var(--accent-gold);
            color: var(--bg-dark);
        }

        #results-container {
            display: none;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .results-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        #results-title {
            font-family: 'Didot', serif;
            font-size: 1.5rem;
            margin: 0 0 0.5rem 0;
        }

        #results-subtitle {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .best-deal-card {
            background: linear-gradient(145deg, #1f1f1f, #181818);
            border: 1px solid var(--accent-gold);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .best-deal-card h2 {
            color: var(--accent-gold);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0 0 1rem 0;
        }

        .best-deal-card p {
            font-size: 1.1rem;
            margin: 0;
            font-weight: 300;
        }

        .best-deal-card strong {
            font-weight: 600;
        }

        /* Mobile-friendly table replacement: List Cards */
        .result-card {
            background-color: var(--surface-dark);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 1rem;
        }

        .result-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.75rem;
            margin-bottom: 0.75rem;
        }

        .store-location {
            font-weight: 600;
            font-size: 1.1rem;
        }

        .final-cost {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--accent-gold);
        }

        .result-detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
        }

        .detail-label {
            color: var(--text-secondary);
        }

        .detail-value {
            font-weight: 500;
        }

        .value-green { color: #4caf50; }
        .value-red { color: #ef5350; }

        @media (min-width: 768px) {
            .container { padding: 4rem 2rem; }
            h1 { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <header class="app-header">
        <h1>Moncler</h1>
        <div class="subtitle">Global Price Intelligence</div>
    </header>

    <div class="container">
        <form id="compare-form">
            <div class="form-group">
                <label for="user_country">Your Nationality / Residency</label>
                <select id="user_country" name="user_country" required>
                    <option value="US">US (United States)</option>
                    <option value="IT">IT (Italy)</option>
                    <option value="GB">GB (United Kingdom)</option>
                    <option value="JP">JP (Japan)</option>
                    <option value="FR">FR (France)</option>
                    <option value="DE">DE (Germany)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="product_name">Select Product</label>
                <select id="product_name" name="product_name" required>
                    <option value="Maya Short Down Jacket">Maya Short Down Jacket</option>
                    <option value="Bormes Gilet">Bormes Gilet</option>
                </select>
            </div>

            <button type="submit">Compare Prices</button>
        </form>

        <div id="results-container">
            <div class="results-header">
                <h2 id="results-title"></h2>
                <div id="results-subtitle"></div>
            </div>

            <div class="best-deal-card" id="best-deal">
                <!-- Populated via JS -->
            </div>

            <div id="results-body">
                <!-- Mobile-friendly cards populated here -->
            </div>
        </div>
    </div>
</body>
</html>`;
}

generateLuxuryUI();
