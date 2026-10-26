// Restores the visitor's saved theme before the first paint to avoid a flash.
// External file (not inline) so the site CSP can drop script-src 'unsafe-inline'.
try {
  var stored = localStorage.getItem("theme");
  var prefersDark =
    !stored && window.matchMedia("(prefers-color-scheme: light)").matches === false;
  var isDark = stored ? stored === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", isDark);
} catch (error) {}
