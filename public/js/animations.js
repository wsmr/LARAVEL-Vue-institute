// Animations and Interactions for DIE Website
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupLoadingAnimations();
        this.setupCourseAnimations();
        this.setupNavigationEffects();
    }

    setupScrollAnimations() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .course-card, h2, h3').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.feature-card, .course-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addHoverGlow(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverGlow(card);
            });
        });

        // Button hover effects
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addButtonHover(button);
            });

            button.addEventListener('mouseleave', () => {
                this.removeButtonHover(button);
            });
        });
    }

    addHoverGlow(element) {
        element.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
        element.style.transform = 'translateY(-8px) scale(1.02)';
    }

    removeHoverGlow(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }

    addButtonHover(button) {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    }

    removeButtonHover(button) {
        button.style.transform = '';
        button.style.boxShadow = '';
    }

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupLoadingAnimations() {
        // Page load animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.animateHeroText();
        });

        // Loading spinner for dynamic content
        this.createLoadingSpinner();
    }

    animateHeroText() {
        const heroTitle = document.querySelector('#home h1');
        const heroDescription = document.querySelector('#home p');
        const heroButtons = document.querySelectorAll('#home button');

        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                heroTitle.style.transition = 'all 1s ease-out';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 300);
        }

        if (heroDescription) {
            heroDescription.style.opacity = '0';
            heroDescription.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroDescription.style.transition = 'all 1s ease-out';
                heroDescription.style.opacity = '1';
                heroDescription.style.transform = 'translateY(0)';
            }, 600);
        }

        heroButtons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.8s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 900 + (index * 200));
        });
    }

    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 hidden';
        spinner.innerHTML = `
            <div class="relative">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div class="mt-4 text-center text-gray-600 dark:text-gray-300">Loading...</div>
            </div>
        `;
        document.body.appendChild(spinner);
    }

    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    setupCourseAnimations() {
        // Animate course cards when they come into view
        const courseObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('slide-in-up');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        // Observe course cards
        setTimeout(() => {
            document.querySelectorAll('.course-card').forEach(card => {
                courseObserver.observe(card);
            });
        }, 1000);
    }

    setupNavigationEffects() {
        const nav = document.querySelector('nav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (nav) {
                if (currentScrollY > 100) {
                    nav.classList.add('nav-scrolled');
                } else {
                    nav.classList.remove('nav-scrolled');
                }

                // Hide/show nav on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    // Utility animation methods
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    fadeOut(element, duration = 500) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    slideIn(element, direction = 'left', duration = 500) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.transition = `transform ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, 10);
    }

    bounce(element, intensity = 10) {
        element.style.animation = `bounce-${intensity} 0.6s ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
    }

    stopPulse(element) {
        element.style.animation = '';
    }

    // Create floating particles effect
    createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'fixed inset-0 pointer-events-none z-0';
        particlesContainer.id = 'floating-particles';
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 bg-blue-400 rounded-full opacity-20';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animation = 'float 10s ease-in-out infinite';
            
            particlesContainer.appendChild(particle);
        }
        
        document.body.appendChild(particlesContainer);
    }

    // Typewriter effect
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Glitch effect
    glitchEffect(element, duration = 2000) {
        element.classList.add('glitch');
        
        setTimeout(() => {
            element.classList.remove('glitch');
        }, duration);
    }
}

// CSS animations (to be added to the stylesheet)
const animationStyles = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }

    .slide-in-up {
        animation: slideInUp 0.6s ease-out forwards;
    }

    .nav-scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .dark .nav-scrolled {
        background-color: rgba(31, 41, 55, 0.95);
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }

    @keyframes bounce-10 {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }

    .glitch {
        animation: glitch 0.3s ease-in-out infinite;
    }

    @keyframes glitch {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(-2px, -2px);
        }
        60% {
            transform: translate(2px, 2px);
        }
        80% {
            transform: translate(2px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }

    .loaded {
        overflow-x: hidden;
    }

    nav {
        transition: all 0.3s ease-in-out;
    }
`;

// Add animation styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    
    // Create floating particles effect
    setTimeout(() => {
        window.animationManager.createFloatingParticles();
    }, 2000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}

