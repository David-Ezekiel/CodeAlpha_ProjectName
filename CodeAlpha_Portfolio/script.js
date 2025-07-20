// Professional Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeSkillAnimations();
    initializeContactForm();
});

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 0.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after fade out animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 500);
}

// Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    
    // Enhanced navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Skill Animations
function initializeSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tags span');
    
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('skill-animate');
    });
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();
        if (!fullName || !email || !subject || !message) {
            alert('All fields are required.');
            return;
        }
        // Simulate sending the message with your email included
        const payload = {
            fullName,
            email,
            subject,
            message,
            to: 'davidoreezekiel@gmail.com'
        };
        alert('Message sent!\n\n' +
            'To: ' + payload.to + '\n' +
            'From: ' + payload.fullName + ' <' + payload.email + '>\n' +
            'Subject: ' + payload.subject + '\n' +
            'Message: ' + payload.message);
        form.reset();
    });
}