/* FREQ AI — Main JavaScript */

// NAV — hamburger menu + active link
(function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href && (href === path ||
        (path.includes('platform') && href.includes('platform')) ||
        (path.includes('solutions') && href.includes('solutions')) ||
        (path.includes('about') && href.includes('about')) ||
        (path.includes('team') && href.includes('team')) ||
        (path.includes('contact') && href.includes('contact')))) {
      link.classList.add('active');
    }
  });
})();

// ACCORDION
(function() {
  document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const body = document.getElementById(trigger.getAttribute('aria-controls'));
      trigger.setAttribute('aria-expanded', (!isOpen).toString());
      if (body) body.classList.toggle('open', !isOpen);
    });
  });
})();

// CONTACT FORM
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const FORMSPREE_ID = '';
  const successEl = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    if (!name || !email || !message) {
      if (errorEl) { errorEl.style.display = 'block'; errorEl.textContent = 'Please fill in all required fields.'; }
      return;
    }
    if (FORMSPREE_ID) {
      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST', body: data, headers: { 'Accept': 'application/json' }
      }).then(function(r) {
        if (r.ok) { form.style.display = 'none'; if (successEl) successEl.style.display = 'block'; }
        else { if (errorEl) errorEl.style.display = 'block'; }
      }).catch(function() { if (errorEl) errorEl.style.display = 'block'; });
    } else {
      const subject = encodeURIComponent('FREQ AI Contact: ' + name);
      const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:info@freqai.io?subject=' + subject + '&body=' + body;
    }
  });
})();
