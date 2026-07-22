const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('dw-theme');
if (savedTheme) root.dataset.theme = savedTheme;

toggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  if (theme === 'light') delete root.dataset.theme;
  else root.dataset.theme = theme;
  localStorage.setItem('dw-theme', theme);
});

document.querySelector('#year').textContent = new Date().getFullYear();
