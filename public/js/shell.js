/* Shared header/footer shell. Edit NAV / CONTACT / SOCIAL here once for all pages. */
(function () {
  var SITE = {
    name: 'Aarohan',
    full: 'Aarohan Child Welfare Trust',
    sub: 'Child Welfare Trust',
    tagline: 'Every Child Deserves a Brighter Tomorrow.'
  };

  var NAV = [
    { label: 'Home', children: [
      { label: 'Home 1', href: 'index.html' },
      { label: 'Home 2', href: 'home-2.html' }
    ] },
    { label: 'About', href: 'about.html' },
    { label: 'Our Work', href: 'our-work.html' },
    { label: 'Donate', href: 'donate.html' },
    { label: 'Contact', href: 'contact.html' }
  ];
  var CTA = { label: 'Donate', href: 'donate.html' };

  /* Fictional details – single source for the whole site. */
  var CONTACT = [
    { type: 'map-pin', text: '24, Lotus Garden Road, Adyar, Chennai, Tamil Nadu 600020, India' },
    { type: 'phone', text: '+91 98765 43210', href: 'tel:+919876543210' },
    { type: 'mail', text: 'hello@aarohantrust.org', href: 'mailto:hello@aarohantrust.org' }
  ];
  var SOCIAL = [
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/aarohantrust' },
    { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/aarohantrust' },
    { icon: 'x', label: 'X (Twitter)', href: 'https://x.com/aarohantrust' },
    { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@aarohantrust' },
    { icon: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/919876543210' }
  ];

  var SPRITE = 'assets/icons/sprite.svg';
  function icon(id, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#' + id + '"/></svg>';
  }

  function brand() {
    return '<a class="brand" href="index.html" aria-label="' + SITE.full + ' – home">' +
      '<svg class="brand-emblem" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><use href="' + SPRITE + '#emblem"/></svg>' +
      '<span class="brand-text"><span class="brand-name">' + SITE.name + '</span><span class="brand-sub">' + SITE.sub + '</span></span></a>';
  }

  function navList(mobile) {
    var uid = mobile ? 'm' : 'd';
    return NAV.map(function (n, i) {
      if (!n.children) return '<li><a class="nav-link" href="' + n.href + '" data-nav>' + n.label + '</a></li>';
      var id = 'dd-' + uid + i;
      return '<li class="dd"><button type="button" class="nav-link" data-dd aria-expanded="false" aria-controls="' + id + '">' + n.label + icon('chevron-down', 'chev') + '</button>' +
        '<div class="dd-panel" id="' + id + '" hidden>' +
        n.children.map(function (c) { return '<a href="' + c.href + '" data-nav>' + c.label + '</a>'; }).join('') +
        '</div></li>';
    }).join('');
  }

  function controls(extra) {
    return '<button type="button" class="icon-btn" data-action="theme" aria-label="Toggle light / dark theme" aria-pressed="false">' +
        icon('sun', 't-sun') + icon('moon', 't-moon') + '</button>' +
      '<button type="button" class="icon-btn" data-action="dir" aria-label="Switch text direction (LTR / RTL)" aria-pressed="false">' +
        '<span class="d-rtl">RTL</span><span class="d-ltr">LTR</span></button>' +
      '<a class="btn btn-secondary btn-sm' + (extra || '') + '" href="' + CTA.href + '">' + icon('heart', 'icon-fill') + CTA.label + '</a>';
  }

  function header() {
    return '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header" data-header><div class="container-x flex h-(--header-h) items-center justify-between gap-4">' +
      brand() +
      '<nav class="hidden lg:block" aria-label="Primary"><ul class="flex items-center gap-7">' + navList(false) + '</ul></nav>' +
      '<div class="hidden items-center gap-2 lg:flex">' + controls() + '</div>' +
      '<button type="button" class="icon-btn lg:hidden" data-menu-btn aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">' +
        icon('menu', 'm-open') + icon('close', 'm-close') + '</button>' +
      '</div>' +
      '<div class="mobile-menu lg:hidden" id="mobile-menu" hidden><div class="container-x py-4">' +
        '<nav aria-label="Mobile"><ul>' + navList(true) + '</ul></nav>' +
        '<div class="mt-5 flex flex-wrap items-center gap-3 pb-2">' + controls(' flex-1 min-w-40 btn-lg') + '</div>' +
      '</div></div></header>';
  }

  function footer() {
    var year = new Date().getFullYear();
    var flat = []; NAV.forEach(function (n) { (n.children || [n]).forEach(function (c) { flat.push(c); }); });
    var links = flat.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join('');
    var contact = '<div><h2 class="footer-title">Contact</h2><ul class="grid gap-3">' +
      CONTACT.map(function (c) {
        var inner = icon(c.type) + '<span>' + c.text + '</span>';
        return '<li class="flex items-start gap-3">' + (c.href ? '<a class="flex items-start gap-3" href="' + c.href + '">' + inner + '</a>' : inner) + '</li>';
      }).join('') + '</ul></div>';
    var social = '<ul class="mt-5 flex flex-wrap gap-3">' + SOCIAL.map(function (s) {
      return '<li><a class="social-btn" href="' + s.href + '" aria-label="' + s.label + '" target="_blank" rel="noopener noreferrer">' + icon(s.icon) + '</a></li>';
    }).join('') + '</ul>';
    return '<footer class="site-footer"><div class="container-x grid gap-10 py-14 sm:grid-cols-2 ' + 'lg:grid-cols-[1.4fr_1fr_1.2fr]' + '">' +
      '<div class="footer-brand">' + brand() + '<p class="mt-5 max-w-sm font-display text-xl" style="color:var(--footer-text)">' + SITE.tagline + '</p>' + social + '</div>' +
      '<div><h2 class="footer-title">Explore</h2><ul class="grid gap-2">' + links + '</ul></div>' + contact + '</div>' +
      '<div class="border-t" style="border-color:color-mix(in oklab,var(--footer-text) 18%,transparent)"><div class="container-x copyright py-5 text-sm" style="color:var(--footer-muted)">&copy; ' + year + ' ' + SITE.full + '. All rights reserved.</div></div></footer>' +
      '<button type="button" class="to-top" data-to-top aria-label="Scroll to top">' + icon('arrow-up') + '</button>';
  }

  /* Contact list for page sections: <ul data-contact></ul> */
  document.querySelectorAll('[data-contact]').forEach(function (el) {
    el.classList.add('contact-list');
    el.innerHTML = CONTACT.map(function (c) {
      var inner = icon(c.type) + '<span>' + c.text + '</span>';
      return '<li>' + (c.href ? '<a href="' + c.href + '">' + inner + '</a>' : inner) + '</li>';
    }).join('');
  });

  /* Social icon row for page sections: <ul data-social></ul> */
  document.querySelectorAll('[data-social]').forEach(function (el) {
    el.classList.add('flex', 'flex-wrap', 'gap-3');
    el.innerHTML = SOCIAL.map(function (s) {
      return '<li><a class="social-btn social-btn-page" href="' + s.href + '" aria-label="' + s.label + '" target="_blank" rel="noopener noreferrer">' + icon(s.icon) + '</a></li>';
    }).join('');
  });

  var h = document.querySelector('[data-shell="header"]');
  var f = document.querySelector('[data-shell="footer"]');
  if (h) h.outerHTML = header();
  if (f) f.outerHTML = footer();
})();
