// DETASCO - cookie / local storage notice (ID/EN)
// The site only stores the visitor's language and theme choice in the browser
// (localStorage). There are no tracking, analytics or advertising cookies.
// If analytics or ads are added later, update the text below and ask for consent first.
(function () {
  var KEY = 'detasco-cookie-notice';

  try {
    if (localStorage.getItem(KEY) === '1') return;
  } catch (e) { /* storage blocked: still show the notice */ }

  var TEXT = {
    id: {
      label: 'Pemberitahuan cookie',
      msg: 'Situs ini menyimpan pilihan bahasa dan tema Anda di perangkat Anda. Kami tidak menggunakan cookie pelacak atau iklan.',
      btn: 'Mengerti'
    },
    en: {
      label: 'Cookie notice',
      msg: 'This site stores your language and theme choice on your device. We do not use tracking or advertising cookies.',
      btn: 'Got it'
    }
  };

  function currentLang() {
    var l = (window.DetascoI18n && window.DetascoI18n.getLang && window.DetascoI18n.getLang()) || 'id';
    return TEXT[l] ? l : 'id';
  }

  function build() {
    var box = document.createElement('div');
    box.id = 'cookieNotice';
    box.setAttribute('role', 'region');
    box.setAttribute('data-no-i18n', '');
    box.className = 'fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:max-w-md rounded-xl bg-detasco-cardBg border border-detasco-borderGold shadow-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-300';

    var p = document.createElement('p');
    p.className = 'leading-relaxed flex-1';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'shrink-0 px-4 py-2 rounded-lg bg-detasco-gold text-black font-bold uppercase tracking-wider hover:bg-detasco-goldHover transition';

    function render() {
      var t = TEXT[currentLang()];
      box.setAttribute('aria-label', t.label);
      p.textContent = t.msg;
      btn.textContent = t.btn;
    }
    render();

    btn.addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
      box.remove();
    });

    box.appendChild(p);
    box.appendChild(btn);
    document.body.appendChild(box);

    if (window.DetascoI18n && window.DetascoI18n.onLangChange) {
      window.DetascoI18n.onLangChange(render);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
