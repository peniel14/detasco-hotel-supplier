// DETASCO - Light/Dark Theme Toggle (shared by index.html & katalog.html)
(function () {
  var STORAGE_KEY = 'detasco-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    if (theme === 'light') {
      html.classList.add('light-mode');
    } else {
      html.classList.remove('light-mode');
    }
    document.querySelectorAll('[data-theme-label]').forEach(function (el) {
      el.textContent = theme === 'light' ? 'Gelap' : 'Terang';
    });
  }

  var initialTheme = getStoredTheme() || 'dark';
  applyTheme(initialTheme);

  window.DetascoTheme = {
    get: function () {
      return getStoredTheme() || 'dark';
    },
    toggle: function () {
      var next = window.DetascoTheme.get() === 'light' ? 'dark' : 'light';
      storeTheme(next);
      applyTheme(next);
      return next;
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.DetascoTheme.toggle();
      });
    });
  });
})();
