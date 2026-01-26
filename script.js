// ===================================
// Click and Drag to Scroll (Desktop Only)
// ===================================

let isDragging = false;
let startY = 0;
let startX = 0;
let scrollTop = 0;
let hasMoved = false;

// Only enable on desktop (screen width > 768px)
// This ensures mobile devices use native touch scrolling
const isTouchDevice = window.innerWidth <= 768;

if (!isTouchDevice) {
    document.body.classList.add('grabbable');
    
    document.addEventListener('mousedown', (e) => {
        // Don't interfere with links, buttons, or interactive elements
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
            e.target.closest('a') || e.target.closest('button') ||
            e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        isDragging = true;
        hasMoved = false;
        startY = e.clientY;
        startX = e.clientX;
        scrollTop = window.pageYOffset;
        document.body.classList.add('grabbing');
        document.body.classList.remove('grabbable');
        
        // Prevent text selection
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaY = startY - e.clientY;
        const deltaX = startX - e.clientX;
        
        // Only start scrolling if moved more than 5px (prevents accidental drags)
        if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
            hasMoved = true;
            e.preventDefault();
            
            const walk = deltaY * 2; // Multiply by 2 for faster scrolling
            window.scrollTo(0, scrollTop + walk);
        }
    });
    
    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            document.body.classList.remove('grabbing');
            document.body.classList.add('grabbable');
        }
    };
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);
    
    // Prevent click events if we dragged
    document.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            hasMoved = false;
        }
    }, true);
}

// ===================================
// Intersection Observer for Scroll Animations
// ===================================

// Initialize Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with reveal class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

// ===================================
// Navigation Scroll Effect
// ===================================

const nav = document.getElementById('main-nav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolling down
    if (scrollTop > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// ===================================
// Active Navigation Link on Scroll
// ===================================

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const updateActiveLink = () => {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveLink);

// ===================================
// Smooth Scroll for Navigation Links
// ===================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Parallax Effect for Hero Section
// ===================================

const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;
    
    if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
    }
});

// ===================================
// Stagger Animation for Experience Highlights
// ===================================

const experienceItems = document.querySelectorAll('.experience-item');

const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger stagger animation for list items
            const highlights = entry.target.querySelectorAll('.experience-highlights li');
            highlights.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

experienceItems.forEach(item => experienceObserver.observe(item));

// ===================================
// Stagger Animation for Skills
// ===================================

const skillCategories = document.querySelectorAll('.skill-category');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger stagger animation for skill items
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 80);
            });
        }
    });
}, observerOptions);

skillCategories.forEach(category => skillObserver.observe(category));

// ===================================
// Performance Optimization
// ===================================

// Debounce scroll events
let scrollTimeout;
const debounceScroll = (callback, delay = 10) => {
    return () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(callback, delay);
    };
};

// Use passive event listeners for better performance
window.addEventListener('scroll', debounceScroll(() => {
    updateActiveLink();
}), { passive: true });

// ===================================
// Loading Animation
// ===================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero title on load
    const heroTitle = document.querySelector('.hero-title-line');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animate hero description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroDescription.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 500);
    }
});

// ===================================
// Contact Form Submission
// ===================================

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').textContent = 'Sending...';
        formStatus.className = 'form-status';
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                // Error
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Oops! Something went wrong. Please try again.';
            }
        } catch (error) {
            // Network error
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Network error. Please check your connection and try again.';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.querySelector('.submit-text').textContent = 'Send Message';
        }
    });
}

// ===================================
// Mobile Menu Toggle (for smaller screens)
// ===================================

// Create mobile menu button
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navContent = document.querySelector('.nav-content');
        
        // Check if menu button already exists
        if (!document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.classList.add('mobile-menu-btn');
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-label', 'Toggle menu');
            
            navContent.appendChild(menuBtn);
            
            menuBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.toggle('mobile-active');
                menuBtn.innerHTML = navLinks.classList.contains('mobile-active') ? '✕' : '☰';
            });
        }
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', debounceScroll(createMobileMenu, 200));
