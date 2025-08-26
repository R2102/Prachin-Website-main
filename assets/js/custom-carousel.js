class CustomCarousel {
  constructor(element) {
    this.carousel = element;
    this.container = element.querySelector('.carousel-container');
    this.slides = element.querySelectorAll('.carousel-slide');
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.initializeCarousel();
    this.createNavigation();
    this.createDots();
    this.addEventListeners();
  }

  initializeCarousel() {
    this.container.style.transform = 'translateX(0)';
  }

  createNavigation() {
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    nav.innerHTML = `
      <button class="prev" aria-label="Previous slide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="next" aria-label="Next slide">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;
    this.carousel.appendChild(nav);

    nav.querySelector('.prev').addEventListener('click', () => this.prevSlide());
    nav.querySelector('.next').addEventListener('click', () => this.nextSlide());
  }

  createDots() {
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    
    for (let i = 0; i < this.slides.length; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(i));
      dots.appendChild(dot);
    }
    
    this.carousel.appendChild(dots);
  }

  addEventListeners() {
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

    window.addEventListener('resize', () => this.updateSlidePosition());
  }

  handleSwipe() {
    const difference = this.touchStartX - this.touchEndX;
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  updateSlidePosition() {
    const slideWidth = this.carousel.offsetWidth;
    this.container.style.transform = `translateX(-${slideWidth * this.currentIndex}px)`;
  }

  updateDots() {
    const dots = this.carousel.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlidePosition();
    this.updateDots();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlidePosition();
    this.updateDots();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlidePosition();
    this.updateDots();
  }
}

// Initialize all carousels on the page
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.custom-carousel');
  carousels.forEach(carousel => new CustomCarousel(carousel));
});

