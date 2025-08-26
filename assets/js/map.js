// Initialize the map
function initDistributionMap() {
    // Get screen width for responsive adjustments
    const screenWidth = window.innerWidth;
    let initialZoom = screenWidth < 576 ? 1 : screenWidth < 768 ? 2 : 3;

    // Company location (Prachin Chemicals)
    const companyLocation = {
        lat: 23.1019,
        lng: 72.6737
    };

    // Modern dark theme map styles
    const mapStyles = [
        {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ saturation: -70 }, { lightness: -10 }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#1a2634' }]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#2c3e50' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#34495e' }]
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#2c3e50' }]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2c3e50' }]
        },
        {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ color: '#2c3e50' }]
        },
        {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
        }
    ];

    // Initialize map
    const map = new google.maps.Map(document.getElementById('distribution-map'), {
        zoom: initialZoom,
        center: companyLocation,
        styles: mapStyles,
        minZoom: 1,
        maxZoom: 18,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });


    // Custom marker icons using Font Awesome
    const companyIcon = {
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABoUlEQVR4nO2XIUhDURSGb5vsnIfBsiUNNrHtnOdEMIg4TQpGBaMGmxaTzSAmg9gMGgUtBufunUnNap9hS2qf5cmCgoPd+57bg3vgfXDSO3D/j3PPhadURkZGRr+YcHjMMEa9qk5BWflMfQomrQIhzCufqZWCafsEcEX5jKb8gk3AcH5d+YxhXLUKEG4pnzEUbNgnEOwqnzEE2/YJwL7yGc24Z58AHimf0QwHjgmcKp/RhMeOCVwonzEMZ44JXCufMQyXjme0lsrBzUpxprVYqPbbrwlv7VcInlIJ3loqRp3qt18TPDiu0GsqwV0Ccfs147Fjid9SCd4rUNJ+Q9iwCWiCz1SCdwdK2v+DIfiwCjB+qSS0KoXZ5lKx7gryWwn7u88zjG3HFYpuxlUuvkDc4AMq4wjfqSoFI6IFauWhUdkCBBOiBXQYhP8WiO5zf2rQ300cAYI50QKGcVm2QAnWZAsQbopeYsP5HdkClODH3kcBTXgoW4DhRPYSM57LFiC4ki3AeCdbgOBR9BIbxhfZAoQN2QIM78IFsB1bICMjQ4nhG49/nLqsEGQyAAAAAElFTkSuQmCC',
        scaledSize: new google.maps.Size(screenWidth < 576 ? 24 : 40, screenWidth < 576 ? 24 : 40),
        anchor: new google.maps.Point(12, 12)
    };

    const distributionIcon = {
        
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4klEQVR4nO2WS0tbURDHrxsfG4uufKSJZ4wL3Uk/gf0Kgmtt99KVEUVcmswYwS+hm2IFN0q/QUWqopC6qBozE3wgiuIDlCvnig+Mvefcm2u68Q+zyWXmx3/OzBDHedc/FMvmG1Wm8EWRzANJDpDPvSDJKZQfQIWB+MRugxOVYtl8nUIZVcinQOL6B5+oDI/onLKgHzO7LYD8ywwsid+Q5ngoaDK9F1MohRBQLxTJXkc23xq8vSQrYaFPcF5OjG/XWoMBZaxc6GMgD9u6bbQbJNvgE6tpV8Rfo4M+uC72W4C9PfUbmmtAHtIT7009ccr7zT9nzuZ9/xhalyrJIU4ZXOfMjpHP/IrEpw6aX+YkcL/J1zHymQVYrvyK6Pa+zNH76v/GcmEEA/JO4FYjDxtyts2OSeaMw0WcCjJcQPzdCG6jYl/U66RQeo3g5PRWjUI5jA7K+13jG9VGcORHxOZ4PMp1q4DkZ/lQWdS1ngpbKDl9VA8ka2W0eDP0P5IOvZ/I6yGcrr6274EE6eMPQLxg7ZRkXnfLiUSuWwXI34Dk0sflBRAPBn5TGyXS0qmvUCmU/+pvzluqfVI+AfHtM+hNcrLQ7VRCCmX22VWacSoloOLnB3B7pthTMbBzf2CWQh2I/607rU4U2yW5HvgAAAAASUVORK5CYII=',
        scaledSize: new google.maps.Size(screenWidth < 576 ? 20 : 24, screenWidth < 576 ? 20 : 24),
        anchor: new google.maps.Point(10, 10)
    };

    // Add company marker with animation
    const companyMarker = new google.maps.Marker({
        position: companyLocation,
        map: map,
        icon: companyIcon,
        title: 'Prachin Chemicals Headquarters',
        animation: google.maps.Animation.DROP
    });

    const companyInfoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius: 8px;"><strong style="color: #205781; font-size: 14px;">Prachin Chemicals Headquarters</strong><br><span style="color: #666;">Gujarat, India</span></div>',
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(-130, -50),
        animation: {
            duration: 200,
            easing: 'easeOutCubic'
        },
        maxWidth: 220,
        minWidth: 120,
        backgroundColor: 'transparent',
        borderRadius: '12px',
        padding: '0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.5,
        arrowStyle: { display: 'none' }
    });

    // Hide info window arrow
    const infoWindowStyle = document.createElement('style');
    infoWindowStyle.textContent = '.gm-style .gm-style-iw-tc { display: none !important; }';
    document.head.appendChild(infoWindowStyle);

    companyMarker.addListener('click', () => {
        companyInfoWindow.open(map, companyMarker);
    });

    // Distribution locations
    const distributionLocations = [
        { lat: 51.5074, lng: -0.1278, name: 'United Kingdom' },
        { lat: 52.5200, lng: 13.4050, name: 'Germany' },
        { lat: 48.8566, lng: 2.3522, name: 'France' },
        { lat: 40.7128, lng: -74.0060, name: 'United States' },
        { lat: 35.6762, lng: 139.6503, name: 'Japan' },
        { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
        { lat: -33.8688, lng: 151.2093, name: 'Australia' },
        { lat: 25.2048, lng: 55.2708, name: 'UAE' },
        { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' }
    ];

    // Add distribution markers
    distributionLocations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: distributionIcon,
            title: location.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 8px 12px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-radius: 6px;"><span style="color: #205781; font-size: 13px; font-weight: 500;">${location.name}</span></div>`,
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-60, -25),
            animation: {
                duration: 200,
                easing: 'easeOutCubic'
            },
            maxWidth: 200,
            minWidth: 120,
            backgroundColor: 'transparent',
            borderRadius: '8px',
            padding: '0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1.5,
            arrowStyle: { display: 'none' }
        });

        let timeout;
        marker.addListener('mouseover', () => {
            clearTimeout(timeout);
            if (!infoWindow.getMap()) {
                infoWindow.open(map, marker);
            }
        });

        marker.addListener('mouseout', () => {
            timeout = setTimeout(() => infoWindow.close(), 300);
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newZoom = newWidth < 576 ? 1 : newWidth < 768 ? 2 : 3;
        map.setZoom(newZoom);
        map.setCenter(companyLocation);
    });
}

// Load Google Maps API and initialize map
function loadGoogleMaps() {
    // Check if map container exists
    if (!document.getElementById('distribution-map')) {
        console.error('Map container not found');
        return;
    }

    // Add error handling for API loading
    window.gm_authFailure = function() {
        const mapDiv = document.getElementById('distribution-map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 12px;"><h3>Map Loading Error</h3><p>We\'re having trouble loading Google Maps. Please try again later.</p></div>';
        }
        console.error('Google Maps authentication failed');
    };

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8&callback=initDistributionMap';
    script.async = true;
    script.defer = true;

    // Add error handling for script loading
    script.onerror = function() {
        const mapDiv = document.getElementById('distribution-map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 12px;"><h3>Map Loading Error</h3><p>Unable to load Google Maps. Please check your internet connection and try again.</p></div>';
        }
        console.error('Failed to load Google Maps API');
    };

    document.head.appendChild(script);
}

// Create and inject map styles
function injectMapStyles() {
    const mapStyles = `
        #distribution-map {
            height: 500px;
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transition: all 0.3s ease;
            touch-action: pan-x pan-y;
            -webkit-overflow-scrolling: touch;
            -webkit-tap-highlight-color: transparent;
        }

        .map-section {
            padding: 80px 0;
            background: linear-gradient(to bottom, #f8f9fa, #ffffff);
        }

        .map-section .section-title {
            margin-bottom: 40px;
            text-align: center;
            color: #2c3e50;
            font-weight: 600;
            font-size: clamp(24px, 4vw, 32px);
        }

        .map-section .section-desc {
            text-align: center;
            max-width: 800px;
            margin: 0 auto 40px;
            color: #5a6c7d;
            line-height: 1.6;
            font-size: clamp(14px, 3vw, 16px);
            padding: 0 15px;
        }

        .gm-style .gm-style-iw-c {
            padding: 4px 8px !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            opacity: 0;
            transform: translateY(-15px);
            animation: fadeInInfoWindow 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            max-width: none !important;
            margin-top: 0 !important;
        }

        .gm-style .gm-style-iw-t button {
            display: none !important;
        }

        @keyframes fadeInInfoWindow {
            0% {
                opacity: 0;
                transform: translateY(-8px) scale(0.98);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .gm-style .gm-style-iw-t::after {
            background: rgba(255, 255, 255, 0.98) !important;
            box-shadow: -2px 2px 2px 0 rgba(0, 0, 0, 0.1) !important;
            margin-top: -2px !important;
        }

        .gm-style .gm-style-iw-d {
            overflow: hidden !important;
            max-height: none !important;
        }

        .gm-style .gm-style-iw-d div {
            color: #2c3e50;
            font-weight: 600;
            font-size: clamp(13px, 2.5vw, 15px);
            text-align: center;
        }

        @media (max-width: 992px) {
            #distribution-map {
                height: 450px;
            }
            .map-section {
                padding: 70px 0;
            }
        }

        @media (max-width: 768px) {
            #distribution-map {
                height: 400px;
            }
            .map-section {
                padding: 60px 0;
            }
        }

        @media (max-width: 576px) {
            #distribution-map {
                height: 300px;
            }
            .map-section {
                padding: 40px 0;
            }
        }

        @media (hover: none) {
            .company-marker:hover,
            .distribution-marker:hover {
                transform: none;
            }
            .leaflet-container {
                -webkit-tap-highlight-color: transparent;
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);
}

// Initialize map when DOM is loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadGoogleMaps();
    injectMapStyles();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        loadGoogleMaps();
        injectMapStyles();
    });
}