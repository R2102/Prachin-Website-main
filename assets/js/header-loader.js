document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('../assets/templates/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                
                // Initialize mobile menu
                if (typeof initializeMobileMenu === 'function') {
                    initializeMobileMenu();
                }
                // Initialize mega menu after header is loaded
                if (typeof initializeMegaMenu === 'function') {
                    initializeMegaMenu();
                }
                // Initialize sliders after header content is loaded
                if (typeof initializeSliders === 'function') {
                    initializeSliders();
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }
});