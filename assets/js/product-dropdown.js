document.addEventListener('DOMContentLoaded', function() {
    const productDropdown = document.getElementById('productDropdown');
    const productMenu = document.getElementById('productMenu');
    const selectedProducts = document.getElementById('selectedProducts');
    let selectedItems = new Set();

    // Toggle dropdown
    productDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        productMenu.classList.toggle('show');
    });

    // Handle item selection
    const items = productMenu.querySelectorAll('.product-dropdown-item');
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const value = this.getAttribute('data-value');
            
            if (selectedItems.has(value)) {
                selectedItems.delete(value);
                this.classList.remove('selected');
            } else {
                selectedItems.add(value);
                this.classList.add('selected');
            }
            updateSelectedProducts();
            productMenu.classList.remove('show'); // Close dropdown after selection
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!productMenu.contains(e.target) && !productDropdown.contains(e.target)) {
            productMenu.classList.remove('show');
        }
    });

    function updateSelectedProducts() {
        selectedProducts.innerHTML = '';
        selectedItems.forEach(product => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                ${product}
                <span class="remove-item" data-product="${product}">×</span>
            `;
            selectedProducts.appendChild(item);
        });

        // Update dropdown text
        productDropdown.textContent = selectedItems.size > 0 
            ? `${selectedItems.size} products selected` 
            : 'Select Products*';

        // Handle remove buttons
        const removeButtons = selectedProducts.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const product = this.getAttribute('data-product');
                selectedItems.delete(product);
                const productItem = Array.from(items)
                    .find(item => item.getAttribute('data-value') === product);
                if (productItem) {
                    productItem.classList.remove('selected');
                }
                updateSelectedProducts();
            });
        });
    }
});