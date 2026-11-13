/* Contact enquiry form: frontend validation + honest mailto hand-off (this site has no mail backend). */
(function () {
  var form = document.getElementById('enquiry-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var TO = form.getAttribute('data-email');
  var TOPICS = { donation: 'Donation enquiry', sponsor: 'Sponsor a child', gift: 'Gift in kind', volunteer: 'Volunteer or partner' };

  var qs = new URLSearchParams(location.search);
  if (TOPICS[qs.get('topic')]) form.elements.topic.value = TOPICS[qs.get('topic')];

  var RULES = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
    phone: function (v) { v = v.trim(); if (!v) return ''; return /^[+()\d\s-]{7,18}$/.test(v) && v.replace(/\D/g, '').length >= 7 ? '' : 'Please enter a valid phone number, or leave it blank.'; },
    topic: function (v) { return v ? '' : 'Please choose a topic.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please write at least 10 characters.'; },
    consent: function (v, el) { return el.checked ? '' : 'Please confirm so we can reply to you.'; }
  };

  function setError(el, msg) {
    var box = document.getElementById(el.name + '-error');
    if (box) box.textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  }
  function check(el) { var msg = RULES[el.name](el.value, el); setError(el, msg); return !msg; }

  Object.keys(RULES).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener('blur', function () { check(el); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) check(el); });
    el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) check(el); });
  });

  function show(kind, html) { status.hidden = false; status.className = 'form-status ' + kind; status.innerHTML = html; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = Object.keys(RULES).map(function (n) { return form.elements[n]; }).filter(function (el) { return !check(el); });
    if (bad.length) {
      show('is-error', 'Please fix the ' + bad.length + ' highlighted field' + (bad.length > 1 ? 's' : '') + ' and try again.');
      status.setAttribute('role', 'alert');
      bad[0].focus();
      return;
    }
    var f = form.elements;
    var body = 'Name: ' + f.name.value.trim() + '\nEmail: ' + f.email.value.trim() + '\nPhone: ' + (f.phone.value.trim() || '-') + '\nTopic: ' + f.topic.value + '\n\n' + f.message.value.trim();
    var href = 'mailto:' + TO + '?subject=' + encodeURIComponent(f.topic.value + ' - ' + f.name.value.trim()) + '&body=' + encodeURIComponent(body);
    status.setAttribute('role', 'status');
    show('is-ok', 'Your enquiry is ready, but it has <strong>not been sent yet</strong>. This website cannot send messages by itself, so we are opening your email app with everything filled in. Please press <strong>Send</strong> there. If nothing opens, <a class="link" href="' + href + '">use this email link</a> or write to <a class="link" href="mailto:' + TO + '">' + TO + '</a>.');
    window.location.href = href;
  });
})();
