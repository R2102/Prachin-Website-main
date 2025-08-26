/**
 * Media Library Filtering Functionality
 * This script handles the filtering functionality for the media library page.
 * When a user clicks on a filter button, it shows only the media items that match the selected category.
 * It also updates the page title to reflect the selected category.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get all filter buttons and media items
  const filterButtons = document.querySelectorAll('.media-filter-btn');
  const mediaFilterLinks = document.querySelectorAll('.media-filter-link');
  const mediaItems = document.querySelectorAll('.media-item');
  const pageTitleHeading = document.querySelector('.pagetitle-heading');
  const pageTitleDesc = document.querySelector('.pagetitle-desc');

  // Function to filter and sort events
  function filterEvents() {
    const upcomingEventsList = document.querySelector('#upcoming-events .event-list');
    const pastEventsList = document.querySelector('#past-events .event-list');
    const allEventsList = document.querySelector('#all-events .event-list');
    const sidebarEventsList = document.querySelector('.widget-posts .widget-content');
    if (!upcomingEventsList || !pastEventsList || !allEventsList || !sidebarEventsList) return;

    // Get all events from the single list
    const allEvents = Array.from(allEventsList.querySelectorAll('.event'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter and sort upcoming events
    const upcomingEvents = allEvents
      .filter(event => {
        const dateStr = event.querySelector('time').getAttribute('datetime');
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() >= today.getTime();
      })
      .sort((a, b) => {
        const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
        const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
        return dateA - dateB;
      });

    // Filter and sort past events
    const pastEvents = allEvents
      .filter(event => {
        const dateStr = event.querySelector('time').getAttribute('datetime');
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() < today.getTime();
      })
      .sort((a, b) => {
        const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
        const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
        return dateB - dateA; // Reverse chronological order
      });

    // Clear existing lists
    upcomingEventsList.innerHTML = '';
    pastEventsList.innerHTML = '';

    // Add events to their respective lists
    upcomingEvents.forEach(event => {
      upcomingEventsList.appendChild(event.cloneNode(true));
      
      // Create and add event to sidebar widget
      const eventDate = new Date(event.querySelector('time').getAttribute('datetime'));
      const eventTitle = event.querySelector('.title').textContent;
      const eventLocation = event.querySelector('.location span').textContent;
      
      const sidebarEvent = document.createElement('div');
      sidebarEvent.className = 'upcoming-event';
      sidebarEvent.innerHTML = `
        <div class="event-date">${eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <h6 class="event-title">${eventTitle}</h6>
        <p class="event-location"><i class="icon-location"></i> ${eventLocation}</p>
      `;
      
      sidebarEventsList.appendChild(sidebarEvent);
    });

    pastEvents.forEach(event => {
      pastEventsList.appendChild(event.cloneNode(true));
    });

    // Log for debugging
    console.log('Today:', today);
    console.log('Upcoming Events:', upcomingEvents.length);
    console.log('Past Events:', pastEvents.length);
  }

  // Call filter function when the page loads
  filterEvents();
  
  // Category titles and descriptions
  const categoryTitles = {
    
    'photos': 'PHOTO GALLERY',
    'videos': 'VIDEO LIBRARY',
    'events': 'EVENT COVERAGE',
    'press': 'PRESS RELEASES'
  };
  
  const categoryDescriptions = {
    'photos': 'A closer look at the infrastructure and Prachin moments.',
    'videos': ' Explore key processes and memorable moments in motion.',
    'events': 'Explore the past, present and upcoming events.',
    'press': 'Read our latest press releases and company announcements.'
  };
  
  // Function to filter media items based on category
  function filterMediaItems(category) {
    // Update page title and description
    pageTitleHeading.textContent = categoryTitles[category] || 'MEDIA LIBRARY';
    pageTitleDesc.textContent = categoryDescriptions[category] || 'Explore our company photos, videos, and upcoming events.';
    
    // Update breadcrumb
    const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
    if (breadcrumbActive) {
      breadcrumbActive.textContent = categoryTitles[category] || 'Photo Library';
    }
    
    // Filter media items
    mediaItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (category === 'all' || itemCategory === category) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
  
  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the filter value from the button's data attribute
      const filterValue = this.getAttribute('data-filter');
      
      // Filter the media items
      filterMediaItems(filterValue);
    });
  });
  
  // Add click event listeners to filter links in page title
  mediaFilterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const filterValue = this.getAttribute('data-filter');
      
      // Find and click the corresponding filter button
      filterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === filterValue) {
          button.click();
        }
      });
    });
  });
  
  // Initialize with 'all' filter
  filterMediaItems('photogrid');
});