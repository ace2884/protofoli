// Enhanced Navigation and Portfolio Functionality
class PortfolioNavigation {
    constructor() {
        this.header = document.querySelector('.navbar');
        this.backToTop = document.getElementById('backToTop');
        this.skillCards = document.querySelectorAll('.skill-card-3d');
        this.projectFilters = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card-3d');
        
        this.initNavigation();
        this.initSkillCards();
        this.initProjectFilters();
        this.initContactForm();
        this.initBackToTop();
    }

    initNavigation() {
        // Enhanced navbar scroll effect
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Navbar dark effect
            if (scrollTop >= 100) {
                this.header.classList.add('navbarDark');
            } else {
                this.header.classList.remove('navbarDark');
            }
            
            // Back to top button
            if (scrollTop > 300) {
                this.backToTop.classList.add('show');
            } else {
                this.backToTop.classList.remove('show');
            }
            
            // Parallax effect for sections
            this.updateParallax(scrollTop);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - (this.header.offsetHeight || 80);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    updateParallax(scrollTop) {
        // Subtle parallax effects for performance
        if (!window.portfolioConfig.isMobile) {
            const heroSection = document.getElementById('home');
            if (heroSection && scrollTop < window.innerHeight) {
                heroSection.style.transform = `translateY(${scrollTop * 0.3}px)`;
            }
        }
    }

    initSkillCards() {
        // Intersection Observer for skill animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        this.skillCards.forEach(card => {
            observer.observe(card);
        });
    }

    initProjectFilters() {
        if (!this.projectFilters.length) return;

        this.projectFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter
                this.projectFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                const filterValue = filter.getAttribute('data-filter');
                this.filterProjects(filterValue);
            });
        });
    }

    // New: smooth horizontal scrolling controls for projects
    initProjectScrolling() {
        const scrollContainer = document.getElementById('projectsScroll');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!scrollContainer) return;

        const scrollAmount = 340; // width of item + gap

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }

        // Optional: mouse drag to scroll
        let isDown = false, startX, scrollLeft;
        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.classList.add('active-drag');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener('mouseleave', () => { isDown = false; scrollContainer.classList.remove('active-drag'); });
        scrollContainer.addEventListener('mouseup', () => { isDown = false; scrollContainer.classList.remove('active-drag'); });
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1; // scroll-fast
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    }

    filterProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.querySelector('.btn-submit-3d');
        const successMessage = document.getElementById('successMessage');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Add loading state
            submitBtn.classList.add('loading');
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            form.style.display = 'none';
            successMessage.classList.add('show');
            
            // Reset form after 5 seconds
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                form.style.display = 'block';
                successMessage.classList.remove('show');
                form.reset();
            }, 5000);
        });

        // Enhanced form interactions
        const formInputs = form.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    initBackToTop() {
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Cursor Trail Effect (Desktop only)
class CursorTrail {
    constructor() {
        if (window.portfolioConfig.isMobile) return;
        
        this.trails = [];
        this.trailCount = 10;
        this.createTrails();
        this.bindEvents();
    }

    createTrails() {
        for (let i = 0; i < this.trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                background: radial-gradient(circle, rgba(255,107,107,${1 - i * 0.1}), rgba(255,165,0,${0.8 - i * 0.08}));
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.trails.forEach((trail, index) => {
                setTimeout(() => {
                    trail.x = e.clientX;
                    trail.y = e.clientY;
                    trail.element.style.left = trail.x + 'px';
                    trail.element.style.top = trail.y + 'px';
                }, index * 20);
            });
        });
    }
}

// Page Transitions
class PageTransitions {
    constructor() {
        this.initPageLoad();
        this.initSectionTransitions();
    }

    initPageLoad() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Trigger entrance animations
            setTimeout(() => {
                this.triggerEntranceAnimations();
            }, 500);
        });
    }

    triggerEntranceAnimations() {
        const heroText = document.querySelectorAll('.animate-text, .animate-text-delay');
        heroText.forEach((text, index) => {
            setTimeout(() => {
                text.style.animationPlayState = 'running';
            }, index * 200);
        });
    }

    initSectionTransitions() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    new PortfolioNavigation();
    new PageTransitions();
    
    // Initialize cursor trail for desktop
    if (!window.portfolioConfig.isMobile) {
        new CursorTrail();
    }
        // Initialize project scrolling (buttons + drag)
        const nav = new PortfolioNavigation();
        nav.initProjectScrolling();
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .section-visible {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    body.loaded .loading-screen {
        opacity: 0;
        pointer-events: none;
    }
`;
document.head.appendChild(animationStyles);