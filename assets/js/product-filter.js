import { products as defaultProducts } from './product-data.js';
import { createProductCard } from './product-grid-dynamic.js';

// Get all products (including those from localStorage)
function getAllProducts() {
  // Check if we have products in localStorage
  const savedProducts = localStorage.getItem('prachinProducts');
  
  if (savedProducts) {
    try {
      // Use the products from localStorage instead of the default ones
      return JSON.parse(savedProducts);
    } catch (e) {
      console.error('Error parsing saved products:', e);
    }
  }
  
  return defaultProducts;
}

// Category-Subcategory relationship map
const categorySubcategoryMap = {
  excipients: ['Superdisintegrants & Disintegrants', 'Binders & Fillers', 'Lubricants', 'Stabilizers & Thickening Agents', 'Food & Nutra Supplements'],
  'api-intermediates-vitamins': ['API', 'Intermediates', 'Vitamins']
};

// Function to update subcategory checkboxes based on selected categories
function updateSubcategoryCheckboxes() {
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
    .map(checkbox => checkbox.value);
  const subcategoryCheckboxes = document.querySelectorAll('input[name="subcategory"]');

  subcategoryCheckboxes.forEach(checkbox => {
    const subcategory = checkbox.value;
    const isEnabled = selectedCategories.length === 0 || 
      selectedCategories.some(category => {
        const validSubcategories = categorySubcategoryMap[category];
        return validSubcategories && validSubcategories.includes(subcategory);
      });

    checkbox.disabled = !isEnabled;
    if (!isEnabled) {
      checkbox.checked = false;
    }
    checkbox.parentElement.classList.toggle('disabled', !isEnabled);
  });
}

// Product filtering functionality
function filterProducts() {
  const searchQuery = document.getElementById('productSearch').value.toLowerCase();
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
    .map(checkbox => checkbox.value);
  const selectedSubcategories = Array.from(document.querySelectorAll('input[name="subcategory"]:checked'))
    .map(checkbox => checkbox.value);

  const allProducts = getAllProducts();
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategories.length === 0 || 
      (selectedCategories.includes('api-intermediates-vitamins') && product.category === 'API, Intermediates & Vitamins') ||
      (selectedCategories.includes('excipients') && product.category === 'Excipients');
    const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory);
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const productContainer = document.getElementById('productsContainer');
  productContainer.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Check for subcategory parameter in URL
  const subcategoryParam = getUrlParameter('subcategory');
  if (subcategoryParam) {
    const subcategoryCheckbox = document.querySelector(`input[name="subcategory"][value="${subcategoryParam}"]`);
    if (subcategoryCheckbox) {
      subcategoryCheckbox.checked = true;
    }
  }

  // Search input event listener
  const searchInput = document.getElementById('productSearch');
  searchInput.addEventListener('input', filterProducts);

  // Category checkbox event listeners
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateSubcategoryCheckboxes();
      filterProducts();
    });
  });

  // Subcategory checkbox event listeners
  const subcategoryCheckboxes = document.querySelectorAll('input[name="subcategory"]');
  subcategoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
  });

  // Initial setup
  updateSubcategoryCheckboxes();
  filterProducts();
});