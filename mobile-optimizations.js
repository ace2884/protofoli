// Mobile Optimizations and Touch Gestures
class MobileOptimizations {
    constructor() {
        this.initTouchGestures();
        this.optimizeForAndroid();
        this.setupPerformanceOptimizations();
        this.initMobileNavigation();
    }

    initTouchGestures() {
        if (!window.portfolioConfig.isTouch) return;

        // Initialize Hammer.js for gesture recognition
        const heroSection = document.getElementById('home');
        const portfolioSection = document.getElementById('portfolio');

        if (heroSection) {
            const heroHammer = new Hammer(heroSection);
            
            // Swipe gestures
            heroHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            
            heroHammer.on('swipeup', () => {
                document.getElementById('about').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });

            heroHammer.on('swipedown', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Portfolio card interactions
        if (portfolioSection) {
            const cards = portfolioSection.querySelectorAll('.card');
            
            cards.forEach(card => {
                const cardHammer = new Hammer(card);
                
                cardHammer.on('press', (e) => {
                    this.showCardPreview(card);
                });

                cardHammer.on('tap', (e) => {
                    const link = card.querySelector('a');
                    if (link) {
                        window.open(link.href, '_blank');
                    }
                });
            });
        }

        // Pinch to zoom for images
        const images = document.querySelectorAll('.imageAboutPage, .card-img-top');
        images.forEach(img => {
            const imgHammer = new Hammer(img);
            imgHammer.get('pinch').set({ enable: true });
            
            let scale = 1;
            imgHammer.on('pinch', (e) => {
                scale = Math.max(1, Math.min(3, scale * e.scale));
                img.style.transform = `scale(${scale})`;
            });

            imgHammer.on('pinchend', () => {
                if (scale <= 1.1) {
                    scale = 1;
                    img.style.transform = 'scale(1)';
                }
            });
        });
    }

    optimizeForAndroid() {
        if (!window.portfolioConfig.isAndroid) return;

        // Android-specific optimizations
        document.body.style.overscrollBehavior = 'none';
        
        // Reduce animations for better performance
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .floating-shape,
                .particle-system {
                    display: none !important;
                }
                
                .hero-3d {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                * {
                    animation-duration: 0.5s !important;
                    transition-duration: 0.3s !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Android Chrome address bar handling
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
            vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    setupPerformanceOptimizations() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Debounced scroll handler
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
            
            const reduceMotionStyle = document.createElement('style');
            reduceMotionStyle.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(reduceMotionStyle);
        }
    }

    initMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggler = document.querySelector('.navbar-toggler');
        const navCollapse = document.querySelector('.navbar-collapse');

        if (navToggler && navCollapse) {
            // Enhanced mobile menu toggle
            navToggler.addEventListener('click', () => {
                navCollapse.classList.toggle('show');
                navToggler.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navCollapse.classList.contains('show')) {
                    navCollapse.classList.remove('show');
                    navToggler.classList.remove('active');
                }
            });

            // Close mobile menu when clicking nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        navCollapse.classList.remove('show');
                        navToggler.classList.remove('active');
                    }
                });
            });
        }

        // Smooth scrolling for mobile
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - (navbar.offsetHeight || 0);
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for mobile (reduced)
        if (window.portfolioConfig.isMobile) {
            const heroSection = document.getElementById('home');
            if (heroSection && scrolled < window.innerHeight) {
                heroSection.style.transform = `translateY(${rate * 0.3}px)`;
            }
        }
    }

    showCardPreview(card) {
        // Create modal for card preview
        const modal = document.createElement('div');
        modal.className = 'card-preview-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    ${card.innerHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Style the modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .card-preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                animation: modalFadeIn 0.3s ease forwards;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                padding: 20px;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                position: relative;
                transform: scale(0.7);
                animation: modalScaleIn 0.3s ease forwards;
            }
            
            .close-modal {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                color: #aaa;
            }
            
            @keyframes modalFadeIn {
                to { opacity: 1; }
            }
            
            @keyframes modalScaleIn {
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(modalStyle);

        // Close modal functionality
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyle);
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

// Vibration API for Android devices
class HapticFeedback {
    static vibrate(pattern = [100]) {
        if ('vibrate' in navigator && window.portfolioConfig.isAndroid) {
            navigator.vibrate(pattern);
        }
    }

    static lightTap() {
        this.vibrate([50]);
    }

    static mediumTap() {
        this.vibrate([100]);
    }

    static success() {
        this.vibrate([100, 50, 100]);
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.initMonitoring();
    }

    initMonitoring() {
        // Monitor FPS
        let frames = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Adjust quality based on FPS
                if (this.metrics.fps < 30 && window.portfolioConfig.performanceMode !== 'low') {
                    this.reduceTo30FPS();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();

        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memory = {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576)
                };
            }, 5000);
        }
    }

    reduceTo30FPS() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.7s !important;
                transition-duration: 0.4s !important;
            }
        `;
        document.head.appendChild(style);
        window.portfolioConfig.performanceMode = 'low';
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    if (window.portfolioConfig.isMobile || window.portfolioConfig.isTouch) {
        new MobileOptimizations();
        new PerformanceMonitor();

        // Add haptic feedback to buttons
        const buttons = document.querySelectorAll('button, .btn, .nav-link');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                HapticFeedback.lightTap();
            });
        });
    }
});