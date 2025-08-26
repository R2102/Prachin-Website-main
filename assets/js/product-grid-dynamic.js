/**
 * Enhanced Product Grid with Dynamic Template Support
 * This is an enhanced version of the original product-grid.js that supports
 * the dynamic product template system.
 */

import { products as defaultProducts } from './product-data.js';

export function createProductCard(product) {
  // Generate the product page URL using the dynamic template
  // The product ID is passed as a URL parameter
  const productId = product.id || product.title.toLowerCase().replace(/\s+/g, '-');
  const productPageUrl = `Products/product-template.html?product=${productId}`;
    
  return `
    <div class="col-sm-6 col-md-4 col-lg-4" style="padding: 15px">
      <div class="product-item">
        <div class="product-img">
          <a href="${productPageUrl}">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </a>
        </div>
        <div class="product-info">
          <h6 class="product-title mb-10"><a href="${productPageUrl}">${product.title}</a></h6>
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid() {
  const productContainer = document.querySelector('.shop .row.g-4');
  if (!productContainer) return;

  // Check if we have products in localStorage
  let allProducts = defaultProducts;
  const savedProducts = localStorage.getItem('prachinProducts');
  
  if (savedProducts) {
    try {
      // Use the products from localStorage instead of the default ones
      allProducts = JSON.parse(savedProducts);
    } catch (e) {
      console.error('Error parsing saved products:', e);
    }
  }

  const productCards = allProducts.map(product => createProductCard(product)).join('');
  productContainer.innerHTML = productCards;
}

document.addEventListener('DOMContentLoaded', renderProductGrid);