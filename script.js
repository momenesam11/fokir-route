document.addEventListener('DOMContentLoaded', () => {
    // Scrollspy and smooth scrolling for navigation
    const sections = document.querySelectorAll('div[id]:not(.layer):not(.nav-container)'); // Selecting sections that have an ID
    const navLinks = document.querySelectorAll('.nav-container ul li a');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('nav-active')) {
                navMenu.classList.remove('nav-active');
            }
        });
    });

    // Smooth scrolling when clicking on a nav link (fallback if CSS scroll-behavior is not supported)
    // CSS scroll-behavior: smooth handles most cases, but this is a solid backup.

    // Intersection Observer for scroll animations (fading in elements)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                // Optional: Stop observing once it's visible if we only want animation once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach(el => elementObserver.observe(el));

    // Intersection Observer for the counter animation
    const counterElements = document.querySelectorAll('.counter');
    let counted = false;

    const startCounters = () => {
        counterElements.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                startCounters();
                counted = true;
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the numbers section is visible

    const numbersSection = document.querySelector('.numbers');
    if (numbersSection) {
        counterObserver.observe(numbersSection);
    }

    // Scrollspy functionality with scroll event listener for more precision
    window.addEventListener('scroll', () => {
        let currentId = '';

        // Find the matching section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset for fixed headers if any, or general visual alignment
            if (window.scrollY >= sectionTop - 150) {
                currentId = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        if (currentId) {
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.parentElement.classList.add('active');
                }
            });
        }
    });
});
