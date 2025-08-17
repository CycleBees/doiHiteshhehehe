// Anniversary Card Swiper
class CuteCardSwiper {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 8;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCardPositions();
        this.updateDots();
        this.preloadImages();
    }
    
    bindEvents() {
        // Touch events for swipe functionality
        const cardWrapper = document.querySelector('.card-wrapper');
        cardWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        cardWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Mouse events for desktop dragging
        cardWrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
        cardWrapper.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Navigation buttons
        document.querySelector('.prev-btn').addEventListener('click', () => this.previousCard());
        document.querySelector('.next-btn').addEventListener('click', () => this.nextCard());
        
        // Dot navigation
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToCard(index + 1));
        });
        
        // Prevent context menu on long touch
        cardWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    handleTouchStart(e) {
        if (this.isTransitioning) return;
        this.touchStartX = e.touches[0].clientX;
    }
    
    handleTouchEnd(e) {
        if (this.isTransitioning) return;
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }
    
    handleMouseDown(e) {
        if (this.isTransitioning) return;
        this.touchStartX = e.clientX;
        
        const handleMouseMove = (moveEvent) => {
            // Optional: Add visual feedback during drag
        };
        
        const handleMouseUpTemp = (upEvent) => {
            this.touchEndX = upEvent.clientX;
            this.handleSwipe();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUpTemp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUpTemp);
    }
    
    handleMouseUp(e) {
        if (this.isTransitioning) return;
        this.touchEndX = e.clientX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < this.minSwipeDistance) {
            return;
        }
        
        if (swipeDistance > 0) {
            // Swipe left - next card
            this.nextCard();
        } else {
            // Swipe right - previous card
            this.previousCard();
        }
    }
    
    handleKeyPress(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case ' ':
                e.preventDefault();
                this.nextCard();
                break;
            case 'Home':
                e.preventDefault();
                this.goToCard(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToCard(this.totalCards);
                break;
        }
    }
    
    nextCard() {
        if (this.isTransitioning) return;
        
        if (this.currentCard < this.totalCards) {
            this.goToCard(this.currentCard + 1);
        } else {
            // Loop back to first card
            this.goToCard(1);
        }
    }
    
    previousCard() {
        if (this.isTransitioning) return;
        
        if (this.currentCard > 1) {
            this.goToCard(this.currentCard - 1);
        } else {
            // Loop to last card
            this.goToCard(this.totalCards);
        }
    }
    
    goToCard(cardNumber) {
        if (this.isTransitioning || cardNumber === this.currentCard) return;
        
        this.isTransitioning = true;
        this.currentCard = cardNumber;
        
        this.updateCardPositions();
        this.updateDots();
        this.addCuteEffects();
        
        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    updateCardPositions() {
        const cards = document.querySelectorAll('.card');
        console.log(`Updating card positions. Current card: ${this.currentCard}, Total cards found: ${cards.length}`);
        
        cards.forEach((card, index) => {
            const cardNumber = index + 1;
            card.classList.remove('active', 'prev', 'next');
            
            if (cardNumber === this.currentCard) {
                card.classList.add('active');
                console.log(`Card ${cardNumber} set as active`);
            } else if (cardNumber < this.currentCard) {
                card.classList.add('prev');
            } else {
                card.classList.add('next');
            }
        });
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentCard);
        });
    }
    
    addCuteEffects() {
        // Add sparkle effect when changing cards
        this.createSparkles();
        
        // Add gentle vibration on mobile (if supported)
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
        }
    }
    
    createSparkles() {
        const sparkleContainer = document.querySelector('.swiper-container');
        const sparkles = ['✨', '💫', '⭐', '🌟', '💖', '🦋', '🌸'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.fontSize = (Math.random() * 0.5 + 0.8) + 'rem';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards';
                
                sparkleContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 100);
        }
    }
    
    preloadImages() {
        // Preload images for better performance
        const imageSources = ['1.PNG', '2.JPG'];
        imageSources.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Global functions for inline event handlers
function nextCard() {
    if (window.cardSwiper) {
        window.cardSwiper.nextCard();
    }
}

function previousCard() {
    if (window.cardSwiper) {
        window.cardSwiper.previousCard();
    }
}

function currentCard(cardNumber) {
    if (window.cardSwiper) {
        window.cardSwiper.goToCard(cardNumber);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0);
            }
        }
        
        .swiper-container {
            overflow: hidden;
        }
        
        /* Improved focus styles for accessibility */
        .nav-btn:focus,
        .dot:focus {
            outline: 3px solid rgba(214, 51, 132, 0.5);
            outline-offset: 3px;
        }
        
        /* Smooth transitions for better UX */
        .card {
            will-change: transform, opacity;
        }
        
        /* Loading state for images */
        .card-image {
            background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        
        .card-image.loaded {
            background: none;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the swiper
    window.cardSwiper = new CuteCardSwiper();
    
    // Force first card to be visible as fallback
    setTimeout(() => {
        const firstCard = document.querySelector('.card:first-child');
        if (firstCard && !firstCard.classList.contains('active')) {
            firstCard.classList.add('active');
            console.log('First card made active as fallback');
        }
    }, 100);
    
    // Add loading effect for images
    document.querySelectorAll('.card-image').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(145deg, #fce7f3, #f3e8ff)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #d63384; font-size: 2rem;">📷</span>';
        });
    });
    
    // Add loading effect for video and ensure sound is enabled
    document.querySelectorAll('.card-video').forEach(video => {
        // Ensure video has sound enabled
        video.muted = false;
        video.volume = 0.8; // Set to 80% volume
        
        video.addEventListener('error', function() {
            this.style.background = 'linear-gradient(145deg, #fce7f3, #f3e8ff)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #d63384; font-size: 2rem;">🎥</span>';
        });
        
        // Add click event to ensure video plays with sound
        video.addEventListener('click', function() {
            if (this.paused) {
                this.play().catch(console.error);
            } else {
                this.pause();
            }
        });
        
        // Ensure autoplay with sound works when video card is active
        video.addEventListener('loadedmetadata', function() {
            this.muted = false;
        });
    });
    
    // Add cute welcome message
    setTimeout(() => {
        console.log('💕 Welcome to your cute anniversary website! 💕');
        console.log('✨ Swipe, click, or use arrow keys to navigate ✨');
    }, 1000);
});

// Add service worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register service worker if the file exists
        fetch('/sw.js', { method: 'HEAD' })
            .then(() => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('🌟 Offline support enabled'))
                    .catch(() => {});
            })
            .catch(() => {});
    });
}

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

// Auto-progress feature (optional - uncomment to enable)
/*
let autoProgressTimer;
let autoProgressDelay = 5000; // 5 seconds

function startAutoProgress() {
    autoProgressTimer = setInterval(() => {
        if (window.cardSwiper && !window.cardSwiper.isTransitioning) {
            window.cardSwiper.nextCard();
        }
    }, autoProgressDelay);
}

function stopAutoProgress() {
    if (autoProgressTimer) {
        clearInterval(autoProgressTimer);
        autoProgressTimer = null;
    }
}

// Start auto-progress after a delay
setTimeout(startAutoProgress, 3000);

// Stop auto-progress on user interaction
['touchstart', 'mousedown', 'keydown'].forEach(event => {
    document.addEventListener(event, stopAutoProgress, { once: true });
});
*/