// Fade-in Effect
document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll('.fade-in');
    faders.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = "translateY(20px)";
        setTimeout(() => {
            element.style.transition = "all 1s ease-out";
            element.style.opacity = 1;
            element.style.transform = "translateY(0)";
        }, 200);
    });
});

// Dark Mode Toggle
const toggleButton = document.getElementById('toggle-dark-mode');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = "☀️"; // Switch to Light Mode icon
    } else {
        toggleButton.textContent = "🌙"; // Switch to Dark Mode icon
    }
});

// Typewriter Effect (for subtitle)
const typewriterText = [
    "Passionate about Cybersecurity",
    "Creative Problem Solver",
    "Lifelong Learner"
];

let currentTextIndex = 0;
let currentCharIndex = 0;
const typewriterElement = document.getElementById('typewriter');

function type() {
    if (currentCharIndex < typewriterText[currentTextIndex].length) {
        typewriterElement.textContent += typewriterText[currentTextIndex].charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (currentCharIndex > 0) {
        typewriterElement.textContent = typewriterText[currentTextIndex].substring(0, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(erase, 50);
    } else {
        currentTextIndex = (currentTextIndex + 1) % typewriterText.length;
        setTimeout(type, 500);
    }
}

document.addEventListener("DOMContentLoaded", type);
