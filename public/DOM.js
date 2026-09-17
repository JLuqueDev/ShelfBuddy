//
// DOM MANIPULATION
//

const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

// dark/ligth mode toggler
themeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    
    if (bodyElement.classList.contains('dark-mode')) {
        themeToggleBtn.innerText = '☀️ Ligth mode';
        themeToggleBtn.classList.replace('btn-outline-secondary', 'btn-outline-ligth');
    } else {
        themeToggleBtn.innerText = '🌙 Dark mode';
        themeToggleBtn.classList.replace('btn-outline-ligth', 'btn-outline-secondary');
    }
});