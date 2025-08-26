/*--------------------------
    Project Name: Prachin
    Version: 1.0
    Author: 7oorof
    Relase Date: Deceber 2022
---------------------------*/
/*---------------------------
      Table of Contents
    --------------------
    01- Pre Loading
    02- Mobile Menu
    03- Sticky Navbar
    04- Scroll Top Button
    05- Set Background-img to section 
    06- Add active class to accordions
    07- Open and Close Popup
    08- Increase and Decrease Input Value
    09- Load More Items
    10- Contact Form validation
    11- Slick Carousel
    12- Popup Video
    13- NiceSelect Plugin
    14- Range Slider
    15- image zoom
    16- counterUp
    17- portfolio Filtering and Sorting
      
 ----------------------------*/

$(function () {

    "use strict";

    // Global variables
    var $win = $(window);

    /*==========  Pre Loading   ==========*/
    setTimeout(function () {
        $(".preloader").fadeOut(500, function() {
            $(this).remove();
            // Sliders are now initialized after header content is loaded
        });
    }, );

    function initializeSliders() {
        $('.slick-carousel').slick({
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="icon-arrow-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="icon-arrow-right"></i></button>',
            dots: false,
            responsive: [{
                breakpoint: 992,
                settings: {
                    arrows: true,
                    dots: false
                }
            }]
        });

        $('.slider-has-navs').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToScroll: 1,
            slidesToShow: 1,
            arrows: true,
            dots: false,
            asNavFor: '.slider-nav-thumbnails',
        });

        $('.slider-nav-thumbnails').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 2,
            slidesToScroll: 1,
            asNavFor: '.slider-has-navs',
            dots: false,
            focusOnSelect: true,
            variableWidth: true
        });
    }

    /*==========   Mobile Menu   ==========*/
    // Handle mobile menu and mega dropdown interactions
    $(document).ready(function() {
        var $mobileMenu = $('.navbar-nav');
        var $navbarCollapse = $('.navbar-collapse');
        var $megaDropdown = $('.mega-dropdown-menu');
        var $hasDropdown = $('.has-dropdown');
        var $navbarToggler = $('.navbar-toggler');

        // Mobile menu toggle is handled by mobile-menu.js
        // This ensures consistent behavior and prevents conflicts

        // Close menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.navbar').length && $navbarCollapse.hasClass('menu-opened')) {
                $navbarCollapse.removeClass('menu-opened');
            $('.navbar-nav').removeClass('menu-opened');
                $navbarToggler.removeClass('actived');
            }
        });

        // Prevent menu close when clicking inside
        $navbarCollapse.on('click', function(e) {
            e.stopPropagation();
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if ($navbarCollapse.hasClass('menu-opened')) {
                if (!$mobileMenu.is(e.target) && 
                    $mobileMenu.has(e.target).length === 0 && 
                    !$(e.target).closest('.navbar-toggler').length) {
                    $navbarCollapse.removeClass('menu-opened');
            $('.navbar-nav').removeClass('menu-opened');
                }
            }
        });

        // Handle mega dropdown menu on desktop
        if ($(window).width() >= 1236) {
            $hasDropdown.hover(
                function() {
                    $(this).find('.mega-dropdown-menu').addClass('show');
                },
                function() {
                    $(this).find('.mega-dropdown-menu').removeClass('show');
                }
            );
        } else {
            // Handle mega dropdown on mobile
            $hasDropdown.on('click', function(e) {
                if ($(window).width() < 1236) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).find('.mega-dropdown-menu').toggleClass('show');
                    $(this).siblings().find('.mega-dropdown-menu').removeClass('show');
                }
            });

            // Close dropdowns when clicking outside
            $(document).on('click', function(e) {
                if (!$(e.target).closest('.has-dropdown').length) {
                    $('.mega-dropdown-menu').removeClass('show');
                }
            });
        }
    });


    /*==========   Sticky Navbar   ==========*/
    $win.on('scroll', function () {
        if ($win.width() >= 1236) {
            var $stickyNavbar = $('.sticky-navbar');
            if ($win.scrollTop() > 150) {
                $stickyNavbar.addClass('is-sticky');
            } else {
                $stickyNavbar.removeClass('is-sticky');
            }
        }
    });

    /*==========   Smooth Scroll to Contact   ==========*/
    $('.scroll-to-contact').on('click', function(e) {
        e.preventDefault();
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
            const headerHeight = $('.header').outerHeight() || 0;
            const offset = 100; // Additional offset for better positioning
            const elementPosition = $(contactSection).offset().top - headerHeight - offset;
            $('html, body').animate({
                scrollTop: elementPosition
            }, 800);
        } else {
            window.location.href = 'index.html#contact-section';
        }
    });

    // Handle scroll to contact section when page loads with hash
    if (window.location.hash === '#contact-section') {
        setTimeout(function() {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                const headerHeight = $('.header').outerHeight() || 0;
                const offset = 20;
                const elementPosition = $(contactSection).offset().top - headerHeight - offset;
                $('html, body').animate({
                    scrollTop: elementPosition
                }, 800);
            }
        }, 100); // Small delay to ensure page is fully loaded
    }

    /*==========   Scroll Top Button   ==========*/
    var $scrollTopBtn = $('#scrollTopBtn');
    // Show Scroll Top Button
    $win.on('scroll', function () {
        if ($(this).scrollTop() > 700) {
            $scrollTopBtn.addClass('actived');
        } else {
            $scrollTopBtn.removeClass('actived');
        }
    });
    // Animate Body after Clicking on Scroll Top Button
    $scrollTopBtn.on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    /*==========   Set Background-img to section   ==========*/
    $('.bg-img').each(function () {
        var imgSrc = $(this).children('img').attr('src');
        $(this).parent().css({
            'background-image': 'url(' + imgSrc + ')',
            'background-size': 'cover',
            'background-position': 'center',
        });
        $(this).parent().addClass('bg-img');
        if ($(this).hasClass('background-size-auto')) {
            $(this).parent().addClass('background-size-auto');
        }
        $(this).remove();
    });

    /*==========   Add active class to accordions   ==========*/
    $('.accordion-header').on('click', function () {
        $(this).parent('.accordion-item').toggleClass('opened');
        $(this).parent('.accordion-item').siblings().removeClass('opened');
    })
    $('.accordion-title').on('click', function (e) {
        e.preventDefault()
    });

    /*==========  Open and Close Popup   ==========*/
    // open Mini Popup
    function openMiniPopup(popupTriggerBtn, popup, cssClass) {
        $(popupTriggerBtn).on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass(cssClass);
            $(popup).toggleClass(cssClass);
        });
    }
    // open Popup
    function openPopup(popupTriggerBtn, popup, addedClass, removedClass) {
        $(popupTriggerBtn).on('click', function (e) {
            e.preventDefault();
            $(popup).toggleClass(addedClass, removedClass).removeClass(removedClass);
        });
    }
    // Close Popup
    function closePopup(closeBtn, popup, addedClass, removedClass) {
        $(closeBtn).on('click', function () {
            $(popup).removeClass(addedClass).addClass(removedClass);
        });
    }
    // close popup when clicking on an other place on the Document
    function closePopupFromOutside(popup, stopPropogationElement, popupTriggerBtn, removedClass, addedClass) {
        $(document).on('mouseup', function (e) {
            if (!$(stopPropogationElement).is(e.target) && !$(popupTriggerBtn).is(e.target) && $(stopPropogationElement).has(e.target).length === 0 && $(popup).has(e.target).length === 0) {
                $(popup).removeClass(removedClass).addClass(addedClass);
            }
        });
    }
    openMiniPopup('#miniPopup-departments-trigger-icon', '#miniPopup-departments', 'active') // Open miniPopup-language

    openPopup('.action-btn-search', '.search-popup', 'active', 'inActive') // Open sidenav popup
    closePopup('.search-popup-close', '.search-popup', 'active', 'inActive') // Close sidenav popup
    openPopup('.action-btn-cart', '.cart-minipopup', 'active', 'inActive') // Open Search popup
    closePopupFromOutside('.cart-minipopup', '.cart-minipopup', '.action-btn-cart', 'active');  // close popup when clicking on an other place on the Document

    /*==========   Increase and Decrease Input Value   ==========*/
    // Increase Value
    $('.increase-qty').on('click', function () {
        var $qty = $(this).parent().find('.qty-input');
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal)) {
            $qty.val(currentVal + 1);
        }
    });
    // Decrease Value
    $('.decrease-qty').on('click', function () {
        var $qty = $(this).parent().find('.qty-input');
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal) && currentVal > 1) {
            $qty.val(currentVal - 1);
        }
    });
    /*==========   Load More Items  ==========*/
    function loadMore(loadMoreBtn, loadedItem) {
        $(loadMoreBtn).on('click', function (e) {
            e.preventDefault();
            $(this).fadeOut();
            $(loadedItem).fadeIn();
        })
    }
    loadMore('#loadMoreTestimonials', '.testimonial-hidden > .testimonial-item');

    /*==========  Contact Form validation  ==========*/
    var contactForm = $("#contactForm"),
        contactResult = $('.contact-result');
    contactForm.validate({
        debug: false,
        submitHandler: function (contactForm) {
            $(contactResult, contactForm).html('Please Wait...');
            $.ajax({
                type: "POST",
                url: "assets/php/contact.php",
                data: $(contactForm).serialize(),
                timeout: 20000,
                success: function (msg) {
                    $(contactResult, contactForm).html('<div class="alert alert-success" role="alert"><strong>Thank you. We will contact you shortly.</strong></div>').delay(3000).fadeOut(2000);
                },
                error: $('.thanks').show()
            });
            return false;
        }
    });

    /*==========   Slick Carousel ==========*/
    // Initialize slider after a small delay to ensure content is loaded
    setTimeout(function() {
        $('.slick-carousel').slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="icon-arrow-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="icon-arrow-right"></i></button>',
        dots: false,
        responsive: [{
            breakpoint: 992,
            settings: {
                arrows: true,
                dots: false
            }
        }]
    });

    $('.slider-has-navs').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToScroll: 1,
        slidesToShow: 1,
        arrows: true,
        dots: false,
        asNavFor: '.slider-nav-thumbnails',
    });

    $('.slider-nav-thumbnails').slick({
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 2,
        slidesToScroll: 1,
        asNavFor: '.slider-has-navs',
        dots: false,
        focusOnSelect: true,
        variableWidth: true
    });
}, 500); // Add missing closing brace for setTimeout

    /*==========  Popup Video  ==========*/
    $('.popup-video').magnificPopup({
        mainClass: 'mfp-fade',
        removalDelay: 0,
        preloader: false,
        fixedContentPos: false,
        type: 'iframe',
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '</div>',
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                }
            },
            srcAction: 'iframe_src',
        }
    });
    $('.popup-gallery-item').magnificPopup({
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        }
    });

    /*==========  NiceSelect Plugin  ==========*/
    $('select').niceSelect();

    /*==========   Range Slider  ==========*/
    var $rangeSlider = $("#rangeSlider"),
        $rangeSliderResult = $("#rangeSliderResult");
    $rangeSlider.slider({
        range: true,
        min: 0,
        max: 300,
        values: [50, 200],
        slide: function (event, ui) {
            $rangeSliderResult.val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $rangeSliderResult.val("$" + $rangeSlider.slider("values", 0) + " - $" + $rangeSlider.slider("values", 1));

    /*==========  image zoom  ==========*/
    // [Zoom Effect on Hovering]
    $(".zoomin").imagezoomsl();


    /*==========   counterUp  ==========*/
    $(".counter").counterUp({
        delay: 10,
        time: 4000
    });

    /*========== portfolio Filtering and Sorting  ==========*/
    $("#filtered-items").mixItUp();
    $(".list-filter .filter").on("click", function (e) {
        e.preventDefault();
    });

});


// Mobile Menu is handled by mobile-menu.js

// Wait for header content to load before initializing mega menu
const headerContainer = document.querySelector('#header-container');
if (headerContainer) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.target.id === 'header-container') {
                initializeMegaMenu();
                observer.disconnect(); // Disconnect after initialization
            }
        });
    });
    
    observer.observe(headerContainer, {
        childList: true,
        subtree: true
    });
}

// Initialize mega menu after header is loaded
function initializeMegaMenu() {
    const megaMenu = {
        init: function() {
            // Initialize category items with a slight delay to ensure DOM is ready
            setTimeout(() => {
                const categoryItems = document.querySelectorAll('.category-item');
                const productLists = document.querySelectorAll('.product-list');
                const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

                // Show first category by default
                if (productLists.length > 0) {
                    productLists[0].classList.add('active');
                    categoryItems[0]?.classList.add('active');
                }

                // Remove existing event listeners before adding new ones
                categoryItems.forEach(item => {
                    const clonedItem = item.cloneNode(true);
                    item.parentNode.replaceChild(clonedItem, item);
                    clonedItem.addEventListener('click', this.handleCategory.bind(this));
                });

                // Mobile dropdown handling
                dropdownToggles.forEach(toggle => {
                    const clonedToggle = toggle.cloneNode(true);
                    toggle.parentNode.replaceChild(clonedToggle, toggle);
                    clonedToggle.addEventListener('click', this.handleMobileDropdown.bind(this));
                });
            }, 100);
        },

        handleCategory: function(e) {
            e.preventDefault();
            e.stopPropagation();

            const categoryItems = document.querySelectorAll('.category-item');
            const productLists = document.querySelectorAll('.product-list');
            const targetId = e.currentTarget.getAttribute('data-target');

            if (!targetId) return; // Guard against missing data-target

            // Update categories
            categoryItems.forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Update products with improved transition
            productLists.forEach(list => {
                const isTarget = list.id === `${targetId}-products`;
                list.style.transition = 'opacity 0.3s ease';
                
                if (isTarget) {
                    list.classList.add('active');
                    requestAnimationFrame(() => {
                        list.style.opacity = '1';
                    });
                } else {
                    list.classList.remove('active');
                    list.style.opacity = '0';
                }
            });
        },

        handleMobileDropdown: function(e) {
            if (window.innerWidth <= 1236) {
                e.preventDefault();
                e.stopPropagation();
                const dropdownMenu = e.currentTarget.nextElementSibling;
                dropdownMenu.classList.toggle('show');
            }
        }
    };

    // Initialize mega menu
    megaMenu.init();
}

// Also initialize on DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', initializeMegaMenu);


// Insert SVG icon into each marker
const svgIcon = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="pinBodyRed" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
                <stop offset="60%" stop-color="#ff6b6b"/>
                <stop offset="100%" stop-color="#b30000"/>
            </radialGradient>
            <radialGradient id="pinShadowRed" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#000" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <ellipse cx="18" cy="32" rx="8" ry="3" fill="url(#pinShadowRed)"/>
        <path d="M18 4C11.9249 4 7 8.92487 7 15C7 22.6274 16.12 30.24 17.41 31.29C17.76 31.57 18.24 31.57 18.59 31.29C19.88 30.24 29 22.6274 29 15C29 8.92487 24.0751 4 18 4Z" fill="url(#pinBodyRed)"/>
        <circle cx="18" cy="15" r="5" fill="#fff" opacity="0.9"/>
        <circle cx="18" cy="15" r="3" fill="#dc3545"/>
        <ellipse cx="16" cy="13" rx="1.2" ry="0.7" fill="#fff" opacity="0.7"/>
    </svg>
`;
// Red location icon SVG for popup
const popupLocationIcon = `<svg class="popup-location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" style="display:inline;vertical-align:middle;"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.02 11.54 7.32 11.8a1 1 0 0 0 1.36 0C13.98 22.54 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 13.5A4.5 4.5 0 1 1 12 6a4.5 4.5 0 0 1 0 9.5z" fill="#dc3545"/><circle cx="12" cy="11" r="2.5" fill="#dc3545"/></svg>`;

document.querySelectorAll('.location-marker').forEach(marker => {
  marker.innerHTML = svgIcon;
  marker.addEventListener('click', function(e) {
    e.stopPropagation();
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popupText');
    // Add icon before country name
    popupText.innerHTML = popupLocationIcon + this.getAttribute('data-location');
    popup.style.display = 'block';
    // Center popup horizontally above the marker
    // Wait for popup to render to get correct width/height
    setTimeout(() => {
      const left = this.offsetLeft + this.offsetWidth / 2 - popup.offsetWidth / 2;
      const top = this.offsetTop - popup.offsetHeight - 18;
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    }, 0);
    // Hide all easypin popovers if you have any
    document.querySelectorAll('.easypin-popover').forEach(pop => pop.style.display = 'none');
  });
});
// Hide popup when clicking outside
document.addEventListener('click', function(e) {
  document.getElementById('popup').style.display = 'none';
  document.querySelectorAll('.easypin-popover').forEach(pop => pop.style.display = 'none');
});