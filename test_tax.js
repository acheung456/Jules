
        // Mock Database
        const mockData = [
            // Maya Short Down Jacket
            { product_name: "Maya Short Down Jacket", image_url: "static/images/maya-short-down-jacket.svg", country: "US", currency: "USD", price: 1850.00 },
            { product_name: "Maya Short Down Jacket", image_url: "static/images/maya-short-down-jacket.svg", country: "IT", currency: "EUR", price: 1250.00 },
            { product_name: "Maya Short Down Jacket", image_url: "static/images/maya-short-down-jacket.svg", country: "GB", currency: "GBP", price: 1150.00 },
            { product_name: "Maya Short Down Jacket", image_url: "static/images/maya-short-down-jacket.svg", country: "JP", currency: "JPY", price: 240000.00 },
            // Bormes Gilet
            { product_name: "Bormes Gilet", image_url: "static/images/bormes-gilet.svg", country: "US", currency: "USD", price: 1200.00 },
            { product_name: "Bormes Gilet", image_url: "static/images/bormes-gilet.svg", country: "IT", currency: "EUR", price: 850.00 },
            { product_name: "Bormes Gilet", image_url: "static/images/bormes-gilet.svg", country: "GB", currency: "GBP", price: 790.00 },
            // Montbeliard Short Down Jacket
            { product_name: "Montbeliard Short Down Jacket", image_url: "static/images/montbeliard-short-down-jacket.svg", country: "US", currency: "USD", price: 2150.00 },
            { product_name: "Montbeliard Short Down Jacket", image_url: "static/images/montbeliard-short-down-jacket.svg", country: "IT", currency: "EUR", price: 1550.00 },
            { product_name: "Montbeliard Short Down Jacket", image_url: "static/images/montbeliard-short-down-jacket.svg", country: "GB", currency: "GBP", price: 1400.00 },
            // Grenoble Hintertux Ski Jacket
            { product_name: "Grenoble Hintertux Ski Jacket", image_url: "static/images/hintertux-short-down-jacket.svg", country: "US", currency: "USD", price: 2450.00 },
            { product_name: "Grenoble Hintertux Ski Jacket", image_url: "static/images/hintertux-short-down-jacket.svg", country: "IT", currency: "EUR", price: 1800.00 },
            { product_name: "Grenoble Hintertux Ski Jacket", image_url: "static/images/hintertux-short-down-jacket.svg", country: "GB", currency: "GBP", price: 1650.00 },
            // Logo Wool Beanie
            { product_name: "Logo Wool Beanie", image_url: "static/images/wool-beanie.svg", country: "US", currency: "USD", price: 345.00 },
            { product_name: "Logo Wool Beanie", image_url: "static/images/wool-beanie.svg", country: "IT", currency: "EUR", price: 250.00 },
            { product_name: "Logo Wool Beanie", image_url: "static/images/wool-beanie.svg", country: "GB", currency: "GBP", price: 230.00 }
        ];

        document.getElementById('user_country').addEventListener('change', function(e) {
            const taxGroup = document.getElementById('sales-tax-group');
            if (e.target.value === 'US') {
                taxGroup.style.display = 'flex';
            } else {
                taxGroup.style.display = 'none';
            }
        });

        // Currency Mapping & Exchange Rates
        const COUNTRY_CURRENCY_MAP = {
            "US": "USD", "IT": "EUR", "GB": "GBP", "JP": "JPY", "FR": "EUR", "DE": "EUR"
        };
        const EXCHANGE_RATES = {
            "USD": 1.0, "EUR": 1.08, "GBP": 1.26, "JPY": 0.0067
        };

        function getExchangeRate(fromCurrency, toCurrency) {
            if (fromCurrency === toCurrency) return 1.0;
            const rateToUsd = EXCHANGE_RATES[fromCurrency];
            const toRate = EXCHANGE_RATES[toCurrency];
            if (!rateToUsd || !toRate) return 1.0; // fallback
            const rateFromUsd = 1 / toRate;
            return rateToUsd * rateFromUsd;
        }

        function convertCurrency(amount, fromCurrency, toCurrency) {
            const rate = getExchangeRate(fromCurrency, toCurrency);
            return amount * rate;
        }

        function calculateAdjustedPrice(basePrice, productCountry, userCountry, priceCurrency, userCurrency, usSalesTaxPct = 0) {
            const priceInUsd = convertCurrency(basePrice, priceCurrency, "USD");

            let refundPct = 0.0;
            let dutyPct = 0.0;
            let salesTaxPct = 0.0;

            if (userCountry !== productCountry) {
                if (productCountry === "IT" && !["IT", "FR", "DE"].includes(userCountry)) {
                    refundPct = 0.12;
                } else if (productCountry === "GB") {
                    refundPct = 0.15;
                } else if (productCountry === "JP") {
                    refundPct = 0.10;
                }
            }

            const refundedPriceUsd = priceInUsd * (1 - refundPct);

            if (userCountry === "US" && userCountry !== productCountry) {
                if (refundedPriceUsd > 800) {
                    dutyPct = 0.05;
                }
            } else if (userCountry === "US" && productCountry === "US") {
                salesTaxPct = usSalesTaxPct / 100;
            }

            let finalPriceUsd = refundedPriceUsd * (1 + dutyPct);
            finalPriceUsd = finalPriceUsd * (1 + salesTaxPct);

            const finalPriceUserCurr = convertCurrency(finalPriceUsd, "USD", userCurrency);
            const basePriceUserCurr = convertCurrency(basePrice, priceCurrency, userCurrency);
            const refundAmountUserCurr = convertCurrency(priceInUsd * refundPct, "USD", userCurrency);
            const dutyAmountUserCurr = convertCurrency(refundedPriceUsd * dutyPct, "USD", userCurrency);
            const salesTaxAmountUserCurr = convertCurrency(refundedPriceUsd * salesTaxPct, "USD", userCurrency);

            return {
                final_price: finalPriceUserCurr.toFixed(2),
                base_price_user_curr: basePriceUserCurr.toFixed(2),
                refund_amount: refundAmountUserCurr.toFixed(2),
                duty_amount: dutyAmountUserCurr.toFixed(2),
                sales_tax_amount: salesTaxAmountUserCurr.toFixed(2)
            };
        }

        document.getElementById('compare-form').addEventListener('submit', function(e) {
            e.preventDefault();

            try {
                const userCountry = document.getElementById('user_country').value;
                const productName = document.getElementById('product_name').value;
                const usSalesTax = parseFloat(document.getElementById('sales_tax').value) || 0;
                const userCurrency = COUNTRY_CURRENCY_MAP[userCountry];

                const productData = mockData.filter(item => item.product_name === productName);

                if (productData.length === 0) return;

                let resultsData = productData.map(item => {
                    const adj = calculateAdjustedPrice(item.price, item.country, userCountry, item.currency, userCurrency, usSalesTax);
                    return {
                        product_country: item.country,
                        product_currency: item.currency,
                        original_price: item.price.toFixed(2),
                        base_price_converted: adj.base_price_user_curr,
                        tax_refund: adj.refund_amount,
                        import_duty: adj.duty_amount,
                        sales_tax: adj.sales_tax_amount,
                        final_price: adj.final_price,
                        final_price_num: parseFloat(adj.final_price)
                    };
                });

                // Sort by lowest price
                resultsData.sort((a, b) => a.final_price_num - b.final_price_num);

                // Update UI
                document.getElementById('results-title').textContent = productName;
                document.getElementById('results-subtitle').innerHTML = `Refined for <strong>${userCountry}</strong> | ${userCurrency}`;

                // Set image
                const productImage = document.getElementById('product-image');
                const productImageContainer = document.getElementById('product-image-container');
                if (productData[0] && productData[0].image_url) {
                    productImage.src = productData[0].image_url;
                    productImage.alt = productName;
                    productImageContainer.style.display = 'block';
                } else {
                    productImageContainer.style.display = 'none';
                }

                const cheapest = resultsData[0];
                document.getElementById('best-deal').innerHTML = `
                    <h2>Top Recommendation</h2>
                    <p>Acquire in <strong>${cheapest.product_country}</strong> for <strong>${userCurrency} ${cheapest.final_price}</strong></p>
                `;

                const tbody = document.getElementById('results-body');
                tbody.innerHTML = '';

                resultsData.forEach(item => {
                    // Generate a mobile-friendly luxury card for each result instead of a row
                    const card = document.createElement('div');
                    card.className = 'result-card';
                    card.innerHTML = `
                        <div class="result-card-header">
                            <span class="store-location">${item.product_country} Boutique</span>
                            <span class="final-cost">${item.final_price} ${userCurrency}</span>
                        </div>
                        <div class="result-detail-row">
                            <span class="detail-label">Local Price</span>
                            <span class="detail-value value-primary">${item.original_price} ${item.product_currency}</span>
                        </div>
                        <div class="result-detail-row">
                            <span class="detail-label">Converted Base</span>
                            <span class="detail-value value-primary">${item.base_price_converted} ${userCurrency}</span>
                        </div>
                        <div class="result-detail-row">
                            <span class="detail-label">Est. Tax Refund</span>
                            <span class="detail-value value-green">-${item.tax_refund} ${userCurrency}</span>
                        </div>
                        <div class="result-detail-row">
                            <span class="detail-label">Est. Import Duty</span>
                            <span class="detail-value ${parseFloat(item.import_duty) > 0 ? 'value-red' : 'value-primary'}">+${item.import_duty} ${userCurrency}</span>
                        </div>
                        ${parseFloat(item.sales_tax) > 0 ? `
                        <div class="result-detail-row">
                            <span class="detail-label">Local Sales Tax</span>
                            <span class="detail-value value-red">+${item.sales_tax} ${userCurrency}</span>
                        </div>
                        ` : ''}
                    `;
                    tbody.appendChild(card);
                });

                document.getElementById('results-container').style.display = 'block';

                // Smooth scroll to results
                document.getElementById('results-container').scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                console.error("Error generating results:", err);
            }
        });
