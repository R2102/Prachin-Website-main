/**
 * Product Template System
 * This script enables dynamic loading of product data into the product template page.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get product and variant from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const variantId = urlParams.get('variant');
    
    if (productId) {
        loadProductData(productId, variantId);
    }
});

/**
 * Load product data based on product ID
 * @param {string} productId - The product identifier
 * @param {string} variantId - Optional variant identifier
 */
function loadProductData(productId, variantId) {
    // Fetch the product data JSON file
    fetch(`../assets/data/products/${productId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Product data not found');
            }
            return response.json();
        })
        .then(productData => {
            // Populate the page with product data
            populateProductPage(productData, variantId);
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            // You could show an error message on the page here
        });
}

/**
 * Populate the product page with the product data
 * @param {Object} productData - The product data object
 * @param {string} variantId - Optional variant identifier
 */
function populateProductPage(productData, variantId) {
    // Set page title
    document.title = `Prachin Pharmachem - ${productData.title}`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `Prachin Chemicals - ${productData.title} - ${productData.brandName}`);
    }
    
    // Update page header
    const categoryTitle = document.querySelector('.category-title');
    if (categoryTitle) {
        categoryTitle.textContent = productData.title;
    }
    
    // Update brand name
    const brandName = document.querySelector('.brand-name');
    if (brandName) {
        brandName.textContent = productData.brandName;
    }
    
    // Update breadcrumb
    const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbActive) {
        breadcrumbActive.textContent = productData.brandName;
    }
    
    // Update overview section
    const overviewSection = document.querySelector('.text-block-desc');
    if (overviewSection && productData.overview) {
        overviewSection.innerHTML = productData.overview;
    }
    
    // Update gallery images
    if (productData.gallery && productData.gallery.length > 0) {
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.innerHTML = '';
            carouselContainer.className = 'carousel-container photo-grid-item';
            
            productData.gallery.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                const img = document.createElement('img');
                img.src = image.url;
                img.alt = image.alt || productData.title + ' image ' + (index + 1);
                
                // Create wrapper anchor
                const wrapper = document.createElement('a');
                wrapper.href = image.url;
                wrapper.className = 'gallery-image';
                wrapper.appendChild(img);
                slide.appendChild(wrapper);
                
                carouselContainer.appendChild(slide);
            });
            
            // Reinitialize carousel
            const carousel = document.querySelector('.custom-carousel');
            if (carousel) {
                new CustomCarousel(carousel);
            }
            
            // Reinitialize Magnific Popup
            $('.photo-grid-item').magnificPopup({
                delegate: 'a.gallery-image',
                type: 'image',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                },
                image: {
                    titleSrc: function(item) {
                        return item.el.find('img').attr('alt') || '';
                    }
                }
            });
        }
    }
    
    // Update variants
    if (productData.variants && productData.variants.length > 0) {
        // Clear existing variants
        const variantsList = document.querySelector('.widget-certifications .list-unstyled');
        const variantsSection = variantsList.querySelector('h6.sub-title');
        
        // Remove existing variants
        while (variantsSection && variantsSection.nextElementSibling && 
               !variantsSection.nextElementSibling.classList.contains('sub-title')) {
            variantsSection.nextElementSibling.remove();
        }
        
        // Add variants dynamically
        productData.variants.forEach((variant, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cert-item" style="cursor: pointer;" onclick="switchToSpecTab('${variant.id}-spec')">
                    <img src="../assets/images/icons/${index % 2 + 1}.png" alt="${variant.name}" class="certificate-icon">
                    <span class="cert-title">${variant.name}</span>
                </div>
            `;
            variantsList.insertBefore(li, variantsList.querySelector('h6.sub-title:last-of-type'));
        });
        
        // Update specification tabs
        const specTabs = document.getElementById('parcrosSpecTabs');
        const specContent = document.getElementById('parcrosSpecContent');
        
        if (specTabs && specContent) {
            // Clear existing tabs and content
            specTabs.innerHTML = '';
            specContent.innerHTML = '';
            
            // Add new tabs and content
            productData.variants.forEach((variant, index) => {
                // Create tab
                const tabItem = document.createElement('li');
                tabItem.className = 'nav-item';
                tabItem.setAttribute('role', 'presentation');
                tabItem.innerHTML = `
                    <button class="nav-link ${index === 0 ? 'active' : ''}" 
                            id="${variant.id}-spec-tab" 
                            data-bs-toggle="tab" 
                            data-bs-target="#${variant.id}-spec" 
                            type="button" 
                            role="tab">
                        ${variant.name}
                    </button>
                `;
                specTabs.appendChild(tabItem);
                
                // Create content
                const contentPane = document.createElement('div');
                contentPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
                contentPane.id = `${variant.id}-spec`;
                contentPane.setAttribute('role', 'tabpanel');
                
                let specTable = `
                    <div class="table-responsive">
                        <table class="table parcros-spec-table">
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Specification</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                // Add specifications
                if (variant.specifications) {
                    variant.specifications.forEach(spec => {
                        specTable += `
                            <tr>
                                <td>${spec.parameter}</td>
                                <td>${spec.value}</td>
                            </tr>
                        `;
                    });
                }
                
                specTable += `
                            </tbody>
                        </table>
                    </div>
                `;
                
                contentPane.innerHTML = specTable;
                specContent.appendChild(contentPane);
            });
            
            // If a specific variant was requested, switch to it
            if (variantId) {
                setTimeout(() => {
                    switchToSpecTab(`${variantId}-spec`);
                }, 500);
            }
        }
    }
    
    // Update features
    if (productData.features && productData.features.length > 0) {
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid) {
            featuresGrid.innerHTML = '';
            
            productData.features.forEach(feature => {
                const featureCard = document.createElement('div');
                featureCard.className = 'feature-card';
                featureCard.innerHTML = `
                    <div class="feature-icon"></div>
                    <div class="feature-content">
                        <p class="feature-text">${feature}</p>
                    </div>
                `;
                featuresGrid.appendChild(featureCard);
            });
        }
    }
    
    // Update applications
    if (productData.applications && productData.applications.length > 0) {
        const appGrid = document.querySelector('.app-grid');
        if (appGrid) {
            appGrid.innerHTML = '';
            
            productData.applications.forEach(application => {
                const appCard = document.createElement('div');
                appCard.className = 'app-card';
                
                // Determine icons based on iconType
                let iconHtml = '';
                if (application.iconType === 'image') {
                    if (application.iconUrl) {
                        iconHtml += `<img src="${application.iconUrl}" alt="${application.title}" class="app-icon-img">`;
                    }
                    if (application.iconUrl2) {
                        iconHtml += `<img src="${application.iconUrl2}" alt="${application.title}" class="app-icon-img">`;
                    }
                } else if (application.iconType === 'fontawesome' && application.iconClass) {
                    iconHtml = `<i class="${application.iconClass}"></i>`;
                } else {
                    // Default icon if none specified
                    iconHtml = `<i class="fas fa-flask text-primary"></i>`;
                }
                
                appCard.innerHTML = `
                    <div class="app-icon">
                        ${iconHtml}
                    </div>
                    <h5 class="app-title">${application.title}</h5>
                    <p class="app-desc">${application.description}</p>
                `;
                appGrid.appendChild(appCard);
            });
        }
    }
    
    // Update brochure links
    if (productData.brochures) {
        const productBrochure = document.querySelector('.widget-download .btn-secondary');
        if (productBrochure && productData.brochures.product) {
            productBrochure.href = productData.brochures.product;
        }
        
        const companyBrochure = document.querySelector('.widget-download .btn-primary');
        if (companyBrochure && productData.brochures.company) {
            companyBrochure.href = productData.brochures.company;
        }
    }
    
    // Update certifications
    if (productData.certifications && productData.certifications.length > 0) {
        // Get the certifications list - specifically the one after the Certifications title
        const certSectionTitle = document.querySelector('.widget-certifications h6.sub-title:nth-of-type(2)');
        if (certSectionTitle && certSectionTitle.textContent.includes('Certifications')) {
            // Find the ul that follows this title
            const certificationsList = certSectionTitle.nextElementSibling;
            
            if (certificationsList && certificationsList.tagName === 'UL') {
                // Clear existing certifications
                certificationsList.innerHTML = '';
                
                // Add certifications dynamically
                productData.certifications.forEach(cert => {
                    const li = document.createElement('li');
                    
                    // Determine if certification has an icon or uses FontAwesome
                    let iconHtml = '';
                    if (cert.iconType === 'image' && cert.iconUrl) {
                        iconHtml = `<img src="${cert.iconUrl}" alt="${cert.name}" class="certificate-icon${cert.largeIcon ? ' large' : ''}">`;
                    } else if (cert.iconType === 'fontawesome' && cert.iconClass) {
                        iconHtml = `<i class="${cert.iconClass}"></i>`;
                    } else {
                        // Default icon if none specified
                        iconHtml = `<i class="fas fa-certificate text-primary"></i>`;
                    }
                    
                    li.innerHTML = `
                        <div class="cert-item">
                            ${iconHtml}
                            <span class="cert-title">${cert.name}</span>
                        </div>
                    `;
                    certificationsList.appendChild(li);
                });
                
                // Log for debugging
                console.log(`Added ${productData.certifications.length} certifications`);
            } else {
                console.error('Certifications list not found after the title');
            }
        } else {
            // Alternative approach if the specific title isn't found
            const certificationsList = document.querySelector('.widget-certifications .widget-content > ul.list-unstyled:last-of-type');
            if (certificationsList) {
                // Clear existing certifications
                certificationsList.innerHTML = '';
                
                // Add certifications dynamically
                productData.certifications.forEach(cert => {
                    const li = document.createElement('li');
                    
                    // Determine if certification has an icon or uses FontAwesome
                    let iconHtml = '';
                    if (cert.iconType === 'image' && cert.iconUrl) {
                        iconHtml = `<img src="${cert.iconUrl}" alt="${cert.name}" class="certificate-icon${cert.largeIcon ? ' large' : ''}">`;
                    } else if (cert.iconType === 'fontawesome' && cert.iconClass) {
                        iconHtml = `<i class="${cert.iconClass}"></i>`;
                    } else {
                        // Default icon if none specified
                        iconHtml = `<i class="fas fa-certificate text-primary"></i>`;
                    }
                    
                    li.innerHTML = `
                        <div class="cert-item">
                            ${iconHtml}
                            <span class="cert-title">${cert.name}</span>
                        </div>
                    `;
                    certificationsList.appendChild(li);
                });
                
                // Log for debugging
                console.log(`Added ${productData.certifications.length} certifications (alternative method)`);
            } else {
                console.error('Certifications list not found');
            }
        }
    }
}
