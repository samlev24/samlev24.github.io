document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    if (toggleDarkModeButton) {
        toggleDarkModeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Optional: Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                toggleDarkModeButton.textContent = '☀️'; // Sun icon for light mode
            } else {
                localStorage.setItem('theme', 'light');
                toggleDarkModeButton.textContent = '🌙'; // Moon icon for dark mode
            }
        });
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (toggleDarkModeButton) {
            toggleDarkModeButton.textContent = '☀️';
        }
    } else {
        // Default to light mode if no theme saved or saved theme is light
        if (toggleDarkModeButton) {
            toggleDarkModeButton.textContent = '🌙';
        }
    }

    // Typewriter effect for the hero section
    const typewriterText = "Cybersecurity Student | Tech Enthusiast | Problem Solver";
    const typewriterElement = document.getElementById('typewriter');
    let charIndex = 0;

    function type() {
        if (typewriterElement && charIndex < typewriterText.length) {
            typewriterElement.textContent += typewriterText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100); // Adjust typing speed here
        }
    }
    if (typewriterElement) { // Only run if the element exists
        type();
    }

    // Scroll Animations with Intersection Observer
    const animatedSections = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });
});
