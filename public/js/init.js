/* Applies the saved theme/direction. Runs before first paint (no flash) and is re-run by main.js
   whenever the page is restored from the back/forward cache or another tab changes the preference. */
(function () {
  function apply() {
    var d = document.documentElement, t, r;
    try { t = localStorage.getItem('aarohan-theme'); r = localStorage.getItem('aarohan-dir'); } catch (e) {}
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    d.setAttribute('data-theme', t);
    d.setAttribute('dir', r === 'rtl' ? 'rtl' : 'ltr');
  }
  window.__applyPrefs = apply;
  apply();
})();
