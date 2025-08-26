document.addEventListener('DOMContentLoaded', function() {
  const markers = document.querySelectorAll('.location-marker');
  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popupText');
  // Function to position popup
  function positionPopup(marker) {
    const markerRect = marker.getBoundingClientRect();
    const mapContainer = document.querySelector('.map-container');
    const containerRect = mapContainer.getBoundingClientRect();

    const markerCenterX = markerRect.left + (markerRect.width / 2);
    const markerCenterY = markerRect.top;

    popup.style.left = `${markerCenterX - containerRect.left}px`;
    popup.style.top = `${markerCenterY - containerRect.top - 40}px`;
  }

  // Add event listeners to markers
  markers.forEach(marker => {
    marker.addEventListener('mouseenter', function() {
      const location = this.getAttribute('data-location');
      popupText.textContent = location;
      popup.style.display = 'block';
      positionPopup(this);
    });

    marker.addEventListener('mouseleave', function() {
      popup.style.display = 'none';
    });

    // Touch device support
    marker.addEventListener('touchstart', function(e) {
      e.preventDefault();
      const location = this.getAttribute('data-location');
      popupText.textContent = location;
      popup.style.display = 'block';
      positionPopup(this);
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (popup.style.display === 'block') {
        const activeMarker = document.querySelector('.location-marker:hover');
        if (activeMarker) {
          positionPopup(activeMarker);
        }
      }
    }, 250);
  });
});
