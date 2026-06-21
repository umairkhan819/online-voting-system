const html = document.documentElement;

function applyTheme(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return; // id not added to HTML yet

  if (theme === 'dark') {
    html.classList.add('dark');
    toggleBtn.setAttribute('data-lucide', 'sun');
  } else {
    html.classList.remove('dark');
    toggleBtn.setAttribute('data-lucide', 'moon');
  }
  lucide.createIcons(); // re-render icon (this replaces the element!)
}

// On page load: read saved theme and apply it
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

// On click: use delegation so it works even after the icon element is replaced
document.addEventListener('click', (e) => {
  const clickedToggle = e.target.closest('#theme-toggle');
  if (!clickedToggle) return;

  const isDark = html.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});