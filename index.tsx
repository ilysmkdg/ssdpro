/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Static product data based on user request.
const products = [
    {
        name: "SAMSUNG 990 PRO SSD 2TB NVMe M.2 PCIe Gen4, M.2 2280 Internal Solid State Hard Drive, Seq. Read Speeds Up to 7,450 MB/s for High End Computing, Gaming, and Heavy Duty Workstations, MZ-V9P2T0B/AM",
        price: "Harga -33% $133.49",
        imageUrl: "https://m.media-amazon.com/images/I/71OWtcxKgvL._AC_SX466_.jpg",
        amazonLink: "https://amzn.to/48nLiwM"
    },
    {
        name: "Samsung 990 EVO Plus SSD 1TB, PCIe Gen 4x4, Gen 5x2 M.2 2280, Speeds Up-to 7,250 MB/s, Upgrade Storage for PC/Laptops, HMB Technology and Intelligent Turbowrite 2.0, (MZ-V9S1T0B/AM)",
        price: "Harga $69.29",
        imageUrl: "https://m.media-amazon.com/images/I/61ciknSL0lL._AC_SX466_.jpg",
        amazonLink: "https://amzn.to/4mZxNaf"
    },
    {
        name: "WD_BLACK 2TB SN7100 NVMe Internal Gaming SSD Solid State Drive - Gen4 PCIe, M.2 2280, Up to 7,250 MB/s - WDS200T4X0E [New Version]",
        price: "Harga -19% $129.99",
        imageUrl: "https://m.media-amazon.com/images/I/516yn6znnLL._AC_SX466_.jpg",
        amazonLink: "https://amzn.to/3IVoF8v"
    },
    {
        name: "WD_BLACK 8TB SN850X NVMe Internal Gaming Solid State Drive with Heatsink - Works with PlayStation 5, Gen4 PCIe, M.2 2280, Up to 7,200 MB/s - WDS800T2XHE",
        price: "Harga -42% $543.99",
        imageUrl: "https://m.media-amazon.com/images/I/61ZtVwUbNLL._AC_SX466_.jpg",
        amazonLink: "https://amzn.to/4nNUhfA"
    }
];

/**
 * Parses the price from a string like "Harga -33% $133.49".
 * @param {string} priceString The original price string.
 * @returns {string | null} The price as a string number, or null if not found.
 */
function parsePrice(priceString) {
    const match = priceString.match(/\$(\d+\.?\d*)/);
    return match ? match[1] : null;
}

/**
 * Extracts the brand name from the product name string.
 * @param {string} name The product name.
 * @returns {string} The brand name.
 */
function extractBrand(name) {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('samsung')) {
        return 'Samsung';
    }
    if (lowerCaseName.includes('wd_black')) {
        return 'WD_BLACK';
    }
    return 'Unknown';
}


/**
 * Generates and injects JSON-LD structured data for products into the document head.
 */
function generateStructuredData() {
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": products.map((product, index) => {
            const price = parsePrice(product.price);
            return {
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "image": product.imageUrl,
                    "description": product.name, // Using name as description for simplicity
                    "brand": {
                        "@type": "Brand",
                        "name": extractBrand(product.name)
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": product.amazonLink,
                        "priceCurrency": "USD",
                        "price": price,
                        "availability": "https://schema.org/InStock",
                        "seller": {
                            "@type": "Organization",
                            "name": "Amazon"
                        }
                    }
                }
            };
        })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(itemList);
    document.head.appendChild(script);
}

/**
 * Formats the price string to include a styled discount badge if present.
 * @param {string} priceString The original price string (e.g., "Harga -33% $133.49").
 * @returns {string} HTML string for the formatted price.
 */
function formatPrice(priceString) {
    const cleanedPrice = priceString.replace('Harga', '').trim();
    const parts = cleanedPrice.split(' ');

    // Check if the first part is a discount percentage
    if (parts.length > 1 && parts[0].includes('%')) {
        const discount = parts[0];
        const price = parts.slice(1).join(' ');
        return `<span class="discount">${discount}</span> ${price}`;
    }

    return cleanedPrice;
}


/**
 * Renders the product grid from the static product data.
 */
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = `<p>No products available at the moment.</p>`;
        return;
    }

    let productHTML = '';
    products.forEach(product => {
        productHTML += `
            <article class="product-item">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <a href="${product.amazonLink}" target="_blank" rel="noopener noreferrer" class="buy-button">Buy on Amazon</a>
            </article>
        `;
    });

    productGrid.innerHTML = productHTML;
}

// Initial render and SEO data injection.
// The script is loaded as a module at the end of the <body>, which ensures the DOM is ready.
renderProducts();
generateStructuredData();
