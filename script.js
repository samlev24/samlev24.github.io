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
    const bodyEl = document.body;
    const indexPageFooter = document.querySelector('body > main > footer'); // Specific to index.html structure

    if (savedTheme === 'dark') {
        bodyEl.classList.add('dark-mode');
        if (toggleDarkModeButton) toggleDarkModeButton.textContent = '☀️';
        if (indexPageFooter) indexPageFooter.classList.remove('light-mode'); // Dark theme means no light-mode class
    } else {
        bodyEl.classList.remove('dark-mode'); // Ensure it's not there if light saved
        if (toggleDarkModeButton) toggleDarkModeButton.textContent = '🌙';
        if (indexPageFooter) indexPageFooter.classList.add('light-mode'); // Light theme means add light-mode class
    }

    // Dark Mode Toggle Event Listener Adjustment
    if (toggleDarkModeButton) {
        toggleDarkModeButton.addEventListener('click', () => {
            bodyEl.classList.toggle('dark-mode');
            const isDarkMode = bodyEl.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            toggleDarkModeButton.textContent = isDarkMode ? '☀️' : '🌙';

            // Specifically toggle 'light-mode' class for index.html's footer
            if (indexPageFooter) {
                if (isDarkMode) {
                    indexPageFooter.classList.remove('light-mode');
                } else {
                    indexPageFooter.classList.add('light-mode');
                }
            }
        });
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

    // Typewriter effect for the hero section should be the last part of the existing JS (this comment is now above AOS.init)
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
    });
});
