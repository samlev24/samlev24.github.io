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
    // const indexPageFooter = document.querySelector('body > main > footer'); // Specific to index.html structure - REMOVED

    if (savedTheme === 'dark') {
        bodyEl.classList.add('dark-mode');
        if (toggleDarkModeButton) toggleDarkModeButton.textContent = '☀️';
        // if (indexPageFooter) indexPageFooter.classList.remove('light-mode'); // Dark theme means no light-mode class - REMOVED
    } else {
        bodyEl.classList.remove('dark-mode'); // Ensure it's not there if light saved
        if (toggleDarkModeButton) toggleDarkModeButton.textContent = '🌙';
        // if (indexPageFooter) indexPageFooter.classList.add('light-mode'); // Light theme means add light-mode class - REMOVED
    }

    // Dark Mode Toggle Event Listener Adjustment
    if (toggleDarkModeButton) {
        toggleDarkModeButton.addEventListener('click', () => {
            bodyEl.classList.toggle('dark-mode');
            const isDarkMode = bodyEl.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            toggleDarkModeButton.textContent = isDarkMode ? '☀️' : '🌙';

            // Specifically toggle 'light-mode' class for index.html's footer - REMOVED
            // if (indexPageFooter) {
            //     if (isDarkMode) {
            //         indexPageFooter.classList.remove('light-mode');
            //     } else {
            //         indexPageFooter.classList.add('light-mode');
            //     }
            // }
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

const dot = document.querySelector('.cursor-dot');
const glow = document.querySelector('.cursor-glow');

// Helper function to determine if a color is light or dark
function isLight(color) {
  if (!color || typeof color !== 'string') {
    return false; // Default to dark if color is invalid
  }

  let r, g, b, a;

  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) {
      return false; // Invalid format
    }
    r = parseInt(match[1]);
    g = parseInt(match[2]);
    b = parseInt(match[3]);
    a = match[4] ? parseFloat(match[4]) : 1;

    if (a === 0) {
      // If fully transparent, behavior depends on what's behind it.
      // For simplicity, assume it's on a default light background or check body.
      // This part might need refinement based on actual page structure.
      // For now, let's check body's actual background.
      const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
      return isLight(bodyBgColor); // Recursive call, ensure base case
    }
  } else if (color.startsWith('#')) {
    // Basic hex support
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    if (hex.length !== 6) {
      return false; // Invalid hex
    }
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Could be a named color, 'transparent', etc.
    // Handling all named colors is complex; for now, default or consider it dark.
    // 'transparent' should ideally check parent or body.
    if (color === 'transparent') {
        const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
        return isLight(bodyBgColor);
    }
    return false; // Default for unhandled formats
  }

  // Calculate perceived brightness (standard formula)
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
  return brightness > 186; // Threshold for light color (0-255 range)
}

document.addEventListener('mousemove', e => {
  const { clientX: x, clientY: y } = e;

  // Update cursor position
  if (dot) {
    dot.style.left = (x - 8) + 'px'; // 8px is half of dot's width/height
    dot.style.top = (y - 8) + 'px';
  }
  if (glow) {
    glow.style.left = (x - 20) + 'px'; // 20px is half of glow's width/height
    glow.style.top = (y - 20) + 'px';
  }

  // Change cursor color based on background
  let elementUnderCursor = document.elementFromPoint(x, y);
  let bgColor;

  if (elementUnderCursor) {
    // Check the element itself or its parents if transparent
    while (elementUnderCursor &&
           (window.getComputedStyle(elementUnderCursor).backgroundColor === 'rgba(0, 0, 0, 0)' ||
            window.getComputedStyle(elementUnderCursor).backgroundColor === 'transparent')) {
        if (elementUnderCursor.parentElement === document.documentElement) { // Reached body/html
            elementUnderCursor = document.body; // Default to body
            break;
        }
        elementUnderCursor = elementUnderCursor.parentElement;
        if (!elementUnderCursor) { // Should not happen if we stop at body
            elementUnderCursor = document.body; // Fallback
            break;
        }
    }
    bgColor = window.getComputedStyle(elementUnderCursor).backgroundColor;
  } else {
    // Fallback to body background if no specific element is found (e.g., over scrollbar)
    bgColor = window.getComputedStyle(document.body).backgroundColor;
  }

  // Ensure dot and glow exist before trying to modify classList
  if (dot && glow) {
    if (isLight(bgColor)) {
      dot.classList.add('cursor-dark');
      // As per instruction, only dot changes color for now
      // glow.classList.add('cursor-dark');
    } else {
      dot.classList.remove('cursor-dark');
      // glow.classList.remove('cursor-dark');
    }
  }
});