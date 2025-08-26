/**
 * Product JSON Generator
 * This utility script helps generate JSON template files for all products
 * based on the data in product-data.js
 */

// Import the products data
import { products } from './product-data.js';

/**
 * Generate a basic JSON template for a product
 * @param {Object} product - The product object from product-data.js
 * @returns {Object} - A JSON template object for the product
 */
function generateProductTemplate(product) {
  // Convert product title to ID format (lowercase, hyphenated)
  const productId = product.title.toLowerCase().replace(/\s+/g, '-');
  
  // Extract brand name (if available) or use a placeholder
  const brandMatch = product.title.match(/\(([^)]+)\)/);
  const brandName = brandMatch ? brandMatch[1] : productId.toUpperCase();
  
  return {
    id: productId,
    title: product.title,
    brandName: brandName,
    category: product.category,
    subcategory: product.subcategory,
    overview: `${product.title} is a high-quality pharmaceutical excipient manufactured by Prachin Chemicals. Please update this overview with specific product information.`,
    gallery: [
      {
        url: product.image.replace('assets/', '../assets/'),
        alt: `${product.title} image 1`
      },
      {
        url: "../assets/images/gallery/1.jpg",
        alt: `${product.title} image 2`
      }
    ],
    variants: [
      {
        id: `${productId}-standard`,
        name: `${brandName} Standard Grade`,
        specifications: [
          {
            parameter: "Standards Compliance",
            value: "Meets industry standards"
          },
          {
            parameter: "Appearance",
            value: "White to off-white powder"
          },
          {
            parameter: "Loss on Drying",
            value: "<10%"
          }
        ]
      }
    ],
    features: [
      "High quality pharmaceutical grade material",
      "Consistent batch-to-batch quality",
      "Complies with regulatory standards"
    ],
    applications: [
      "Pharmaceutical formulations",
      "Tablet manufacturing",
      "Capsule production"
    ],
    brochures: {
      product: "#",
      company: "#"
    }
  };
}

/**
 * Generate JSON for all products and display in console
 * This function will output JSON templates for all products to the console
 * which can then be copied and saved as individual files
 */
function generateAllProductTemplates() {
  console.log('Generating JSON templates for all products...');
  
  products.forEach(product => {
    const template = generateProductTemplate(product);
    const productId = template.id;
    
    console.log(`\n\n// JSON template for ${product.title}`);
    console.log(`// Save this as: /assets/data/products/${productId}.json`);
    console.log(JSON.stringify(template, null, 2));
  });
  
  console.log('\n\nAll templates generated. Copy each template and save as a separate JSON file.');
}

// Execute the generator when the script is run
document.addEventListener('DOMContentLoaded', () => {
  // Add a button to the page to trigger the generation
  const adminSection = document.createElement('div');
  adminSection.style.padding = '20px';
  adminSection.style.margin = '20px';
  adminSection.style.border = '1px solid #ccc';
  adminSection.style.borderRadius = '5px';
  adminSection.style.display = 'none'; // Hidden by default
  
  adminSection.innerHTML = `
    <h3>Product JSON Generator</h3>
    <p>This tool will generate JSON templates for all products in the console.</p>
    <button id="generate-json" class="btn btn-primary">Generate JSON Templates</button>
  `;
  
  document.body.appendChild(adminSection);
  
  // Add a keyboard shortcut to show the admin section (Ctrl+Shift+J)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      adminSection.style.display = adminSection.style.display === 'none' ? 'block' : 'none';
    }
  });
  
  // Add click event to the button
  document.getElementById('generate-json').addEventListener('click', generateAllProductTemplates);
});