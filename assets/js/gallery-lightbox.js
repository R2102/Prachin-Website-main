document.addEventListener('DOMContentLoaded', () => {
    // Initialize Magnific Popup for popup gallery items
    $('.popup-gallery-item').magnificPopup({
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

    // Wrap images in anchor tags if they aren't already
    const wrapImagesInAnchors = () => {
        const images = document.querySelectorAll('.photo-grid-item img, .media-img img');
        images.forEach(img => {
            if (img.parentElement.tagName !== 'A') {
                const wrapper = document.createElement('a');
                wrapper.href = img.src;
                wrapper.className = 'gallery-image';
                img.parentElement.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
        });
    };

    // Initialize image wrapping
    wrapImagesInAnchors();

    // Initialize Magnific Popup for photo grid and media images
    $('.photo-grid-item, .media-img').magnificPopup({
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
});