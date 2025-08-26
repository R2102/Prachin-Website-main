document.addEventListener('DOMContentLoaded', function() {
    // Function to populate variants in the widget section
    function populateVariants() {
        const variantsList = document.querySelector('.widget-certifications .list-unstyled');
        const specTabs = document.querySelectorAll('#parcrosSpecTabs .nav-link');
        
        // Clear existing variants
        const variantsSection = variantsList.querySelector('h6.sub-title');
        while (variantsSection.nextElementSibling) {
            variantsSection.nextElementSibling.remove();
        }

        // Add variants dynamically
        specTabs.forEach(tab => {
            const variantId = tab.getAttribute('data-bs-target').substring(1);
            const variantName = tab.textContent.trim();
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cert-item" style="cursor: pointer;" onclick="switchToSpecTab('${variantId}')">
                    <img src="../assets/images/icons/${variantId.includes('511') ? '1' : '2'}.png" alt="WHO-GMP" class="certificate-icon">
                    <span class="cert-title">${variantName}</span>
                </div>
            `;
            variantsList.insertBefore(li, variantsList.querySelector('h6.sub-title:last-of-type'));
        });
    }

    // Function to switch to specific specification tab and scroll
    window.switchToSpecTab = function(tabId) {
        const specSection = document.querySelector('#parcrosSpecContent').closest('.text-block');
        const targetTab = document.querySelector(`[data-bs-target="#${tabId}"]`);
        
        if (specSection) {
            // Scroll to specifications section with offset
            const offset = 100; // Adjust this value as needed
            const elementPosition = specSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        
        // Activate the tab and show content after scrolling
        setTimeout(() => {
            if (targetTab) {
                // Create a new tab instance
                const tab = new bootstrap.Tab(targetTab);
                
                // Show the tab
                tab.show();
                
                // Manually trigger the shown.bs.tab event to ensure content is updated
                targetTab.dispatchEvent(new Event('shown.bs.tab'));
                
                // Force content update by directly showing the target panel
                const targetPanelId = targetTab.getAttribute('data-bs-target');
                const targetPanel = document.querySelector(targetPanelId);
                if (targetPanel) {
                    document.querySelectorAll('.tab-pane').forEach(panel => {
                        panel.classList.remove('show', 'active');
                    });
                    targetPanel.classList.add('show', 'active');
                }
            }
        }, 500); // Wait for scroll to complete
    };

    // Initialize variants
    populateVariants();
});
