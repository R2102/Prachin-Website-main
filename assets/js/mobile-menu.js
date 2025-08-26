// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarCollapse');
    
    // Early return if elements not found
    if (!navbarToggler || !navbarCollapse) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    document.body.appendChild(backdrop);

    // Toggle mobile menu - handle both click and touch events
    const toggleMenu = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Toggle the menu state
        if (navbarToggler && navbarCollapse) {
            const isOpening = !navbarCollapse.classList.contains('show');
            navbarToggler.classList.toggle('active', isOpening);
            navbarToggler.classList.toggle('mobile-menu-open', isOpening);
            navbarCollapse.classList.toggle('show', isOpening);
            navbarCollapse.classList.toggle('menu-opened', isOpening);
            backdrop.classList.toggle('show', isOpening);
            document.body.classList.toggle('mobile-menu-open', isOpening);
            
            // Force a reflow to ensure transitions work properly
            void navbarCollapse.offsetHeight;
            void backdrop.offsetHeight;
        }
    };
    
    // Add both click and touch event listeners with improved touch handling
    if (navbarToggler) {
        const handleTouchStart = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        };

        const handleClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        };

        navbarToggler.addEventListener('click', handleClick, { capture: true });
        navbarToggler.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    }

    // Close menu when clicking or touching outside
    const closeMenuOutside = function(e) {
        if ((!navbar.contains(e.target) || e.target === backdrop) && navbarCollapse.classList.contains('show')) {
            e.preventDefault();
            e.stopPropagation();
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.classList.remove('mobile-menu-open');
        }
    };
    
    // Add both click and touch event listeners for closing menu
    document.addEventListener('click', closeMenuOutside, { capture: true });
    document.addEventListener('touchstart', closeMenuOutside, { passive: false, capture: true });
    document.addEventListener('touchend', function(e) { 
        if ((!navbar.contains(e.target) || e.target === backdrop) && navbarCollapse.classList.contains('show')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle dropdown toggles
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-item-link');
        const menu = item.querySelector('.dropdown-menu, .mega-dropdown-menu');

        const handleDropdownToggle = function(e) {
            if (window.innerWidth <= 1236) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other open dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherMenu = otherItem.querySelector('.dropdown-menu, .mega-dropdown-menu');
                        if (otherMenu) {
                            otherMenu.classList.remove('show');
                            otherMenu.style.display = 'none';
                        }
                    }
                });

                if (menu) {
                    const isShowing = menu.classList.contains('show');
                    menu.classList.toggle('show');
                    menu.style.display = isShowing ? 'none' : 'block';
                }
            }
        };
        
        // Add both click and touch event listeners for dropdown toggles with improved touch handling
        link.addEventListener('click', handleDropdownToggle);
        link.addEventListener('touchstart', handleDropdownToggle, { passive: false });
        link.addEventListener('touchend', function(e) { e.preventDefault(); }, { passive: false });
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1236) {
            navbarToggler.classList.remove('active');
            navbarCollapse.classList.remove('show');
            backdrop.classList.remove('show');
            document.body.classList.remove('mobile-menu-open');
            document.querySelectorAll('.dropdown-menu.show, .mega-dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});

// Remove duplicate initialization since we already have the main initialization code above