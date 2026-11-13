/* Global behaviour: theme, direction, menu, dropdowns, scroll-to-top. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function syncPressed() {
    document.querySelectorAll('[data-action="theme"]').forEach(function (b) { b.setAttribute('aria-pressed', root.dataset.theme === 'dark'); });
    document.querySelectorAll('[data-action="dir"]').forEach(function (b) { b.setAttribute('aria-pressed', root.dir === 'rtl'); });
  }
  syncPressed();

  /* ---- Dropdowns (click only) ---- */
  function closeDropdowns(except) {
    document.querySelectorAll('[data-dd][aria-expanded="true"]').forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      document.getElementById(b.getAttribute('aria-controls')).hidden = true;
    });
  }

  /* ---- Menu ---- */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('menu-open', open);
    menuBtn.querySelector('.m-open').style.display = open ? 'none' : '';
    menuBtn.querySelector('.m-close').style.display = open ? '' : 'none';
    if (!open) closeDropdowns();
  }
  if (menuBtn) menuBtn.querySelector('.m-close').style.display = 'none';

  document.addEventListener('click', function (e) {
    var t = e.target;
    var dd = t.closest('[data-dd]');
    if (dd) {
      var open = dd.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(dd);
      dd.setAttribute('aria-expanded', open);
      document.getElementById(dd.getAttribute('aria-controls')).hidden = !open;
      return;
    }
    var act = t.closest('[data-action]');
    if (act) {
      if (act.dataset.action === 'theme') {
        var th = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = th; save('aarohan-theme', th);
      } else if (act.dataset.action === 'dir') {
        var dr = root.dir === 'rtl' ? 'ltr' : 'rtl';
        root.dir = dr; save('aarohan-dir', dr);
      }
      syncPressed();
      return;
    }
    if (t.closest('[data-menu-btn]')) { setMenu(menu.hidden); return; }
    if (t.closest('[data-to-top]')) { window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' }); return; }
    if (menu && !menu.hidden && t.closest('#mobile-menu a')) setMenu(false);
    /* A dropdown link navigates away: close its panel first so a back/forward-cache restore never shows it open. */
    if (t.closest('.dd-panel a')) closeDropdowns();
    if (!t.closest('.dd')) closeDropdowns();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDd = document.querySelector('[data-dd][aria-expanded="true"]');
    if (openDd) { closeDropdowns(); openDd.focus(); return; }
    if (menu && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });

  document.addEventListener('focusin', function (e) {
    if (!e.target.closest('.dd')) closeDropdowns();
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  /* ---- Active link ---- */
  var norm = function (p) { p = (p || '').split('/').pop().replace(/\.html$/, ''); return p || 'index'; };
  var here = norm(location.pathname);
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (norm(a.getAttribute('href')) === here) {
      a.setAttribute('aria-current', 'page');
      var dd = a.closest('.dd');
      if (dd) dd.querySelector('[data-dd]').setAttribute('aria-current', 'page');
    }
  });

  /* ---- Scroll to top ---- */
  var topBtn = document.querySelector('[data-to-top]');
  function onScroll() { if (topBtn) topBtn.classList.toggle('is-visible', window.scrollY > 500); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll (opt-in via .reveal) ---- */
  var items = document.querySelectorAll('.reveal');
  if (items.length && 'IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (i) { io.observe(i); });
  } else { items.forEach(function (i) { i.classList.add('is-in'); }); }

  /* ---- Page restored from the back/forward cache, or preference changed in another tab ----
     In those cases no script re-runs, so the frozen page could show a stale theme/direction
     or a leftover open menu/dropdown. Re-read the saved preferences and reset transient UI. */
  function resync() {
    if (window.__applyPrefs) window.__applyPrefs();
    syncPressed();
  }
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    resync();
    setMenu(false);
    closeDropdowns();
    onScroll();
  });
  window.addEventListener('storage', function (e) {
    if (e.key === null || e.key === 'aarohan-theme' || e.key === 'aarohan-dir') resync();
  });
})();
