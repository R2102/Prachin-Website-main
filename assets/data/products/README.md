# Product JSON Files

This directory contains JSON files for all products displayed on the Prachin Chemicals website. Each product has its own JSON file named after the product's ID (typically a lowercase, hyphenated version of the product name).

## File Structure

Each product JSON file follows this structure:

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
        }
      ]
    }
  ],
  "features": [
    "Feature 1 description",
    "Feature 2 description"
  ],
  "applications": [
    "Application 1",
    "Application 2"
  ],
  "brochures": {
    "product": "path/to/product-brochure.pdf",
    "company": "path/to/company-brochure.pdf"
  }
}
```

## Adding New Products

1. Create a new JSON file named after your product ID (e.g., `product-name.json`)
2. Follow the structure above, filling in all relevant information
3. Place any product images in the appropriate image directories
4. The product will automatically appear in the product list and be accessible via the dynamic product template system

## Generating Product JSON Files

You can use the product-json-generator.js utility to help generate template JSON files for new products based on the data in product-data.js.