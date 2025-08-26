# Dynamic Product Page System

## Overview

This document explains the dynamic product page system implemented for the Prachin Chemicals website. Instead of creating individual HTML files for each product, this system uses a single template file that loads product data from JSON files. This approach significantly reduces the effort required to add new products and ensures consistency across all product pages.

## How It Works

1. A single `product-template.html` file serves as the template for all product pages
2. Product data is stored in JSON files in the `assets/data/products/` directory
3. When a user visits a product page, the system loads the appropriate JSON file based on the URL parameter
4. The page is dynamically populated with the product data

## File Structure

- `/Products/product-template.html` - The main product page template
- `/assets/data/products/` - Directory containing all product JSON files
- `/assets/js/product-template.js` - JavaScript that handles loading and displaying product data
- `/assets/js/product-grid-dynamic.js` - Enhanced version of product-grid.js that links to the dynamic template

## Adding a New Product

To add a new product, follow these steps:

1. Create a new JSON file in the `/assets/data/products/` directory
2. Name the file with a unique product identifier (e.g., `product-name.json`)
3. Use the structure shown in the example below
4. Update the product-data.js file to include the new product in the list view (if needed)

## Product JSON Structure

Here's an example of the product JSON structure:

```json
{
  "id": "product-id",
  "title": "Product Title",
  "brandName": "BRAND NAME",
  "category": "Category",
  "subcategory": "Subcategory",
  "overview": "Product overview text goes here. This can include HTML formatting if needed.",
  "gallery": [
    {
      "url": "../assets/images/gallery/image1.jpg",
      "alt": "Image description"
    },
    {
      "url": "../assets/images/gallery/image2.jpg",
      "alt": "Image description"
    }
  ],
  "variants": [
    {
      "id": "variant-id",
      "name": "Variant Name",
      "specifications": [
        {
          "parameter": "Parameter Name",
          "value": "Parameter Value"
        },
        {
          "parameter": "Another Parameter",
          "value": "Another Value"
        }
      ]
    }
  ],
  "features": [
    "Feature 1 description",
    "Feature 2 description",
    "Feature 3 description"
  ],
  "applications": [
    "Application 1",
    "Application 2",
    "Application 3"
  ],
  "brochures": {
    "product": "path/to/product-brochure.pdf",
    "company": "path/to/company-brochure.pdf"
  }
}
```

## Updating the Product List

To ensure new products appear in the product list page:

1. Update the `product-data.js` file to include the new product
2. Make sure to use the same product ID in both the JSON file and the product-data.js entry

## Testing

To test a new product page:

1. Navigate to: `http://your-website.com/Products/product-template.html?product=product-id`
2. Replace `product-id` with the ID of your product (matching the JSON filename)
3. Verify that all product information displays correctly

## Troubleshooting

If a product page doesn't load correctly:

1. Check the browser console for JavaScript errors
2. Verify that the JSON file exists and has the correct name
3. Ensure the JSON file is properly formatted (valid JSON)
4. Check that all required fields are present in the JSON file