/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — script.js (Warm Theme)
   1. Navigation (scroll + hamburger)
   2. Active Nav Link
   3. Intersection Observer (scroll animations)
   4. Counter Animation
   5. Contact Form
   6. Init
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. NAVIGATION
───────────────────────────────────────────── */
function initNavigation() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll: frosted nav
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNavLink();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ─────────────────────────────────────────────
   2. ACTIVE NAV LINK
───────────────────────────────────────────── */
function updateActiveNavLink() {
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const offset = 120;

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─────────────────────────────────────────────
   3. INTERSECTION OBSERVER — Scroll animations
───────────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter if this card contains a stat
        const statNumber = entry.target.querySelector('.stat-number[data-target]');
        if (statNumber) animateCounter(statNumber);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   4. COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const startTs  = performance.now();

  function step(timestamp) {
    const elapsed  = timestamp - startTs;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────
   5. CONTACT FORM
───────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const rules = [
    {
      id:      'name',
      errorId: 'name-error',
      validate: v => v.trim().length >= 2,
      msg:     'Please enter your name (at least 2 characters).',
    },
    {
      id:      'email',
      errorId: 'email-error',
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg:     'Please enter a valid email address.',
    },
    {
      id:      'message',
      errorId: 'message-error',
      validate: v => v.trim().length >= 10,
      msg:     'Please enter a message (at least 10 characters).',
    },
  ];

  // Live validation on blur
  rules.forEach(({ id, errorId, validate, msg }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errorId);
    if (!input || !err) return;

    input.addEventListener('blur', () => {
      if (!validate(input.value)) {
        err.textContent = msg;
        input.classList.add('invalid');
      } else {
        err.textContent = '';
        input.classList.remove('invalid');
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('invalid') && validate(input.value)) {
        document.getElementById(errorId).textContent = '';
        input.classList.remove('invalid');
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;

    rules.forEach(({ id, errorId, validate, msg }) => {
      const input = document.getElementById(id);
      const err   = document.getElementById(errorId);
      if (!input || !err) return;

      if (!validate(input.value)) {
        err.textContent = msg;
        input.classList.add('invalid');
        if (isValid) input.focus();
        isValid = false;
      } else {
        err.textContent = '';
        input.classList.remove('invalid');
      }
    });

    if (!isValid) return;

    // Build mailto link
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const body    = `${message}\n\n—\nFrom: ${name}\nEmail: ${email}`;
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const mailBody = encodeURIComponent(body);

    window.location.href = `mailto:thaisserpachaves@gmail.com?subject=${subject}&body=${mailBody}`;

    // Show success
    if (success) {
      success.classList.add('visible');
      form.querySelector('.btn').style.display = 'none';
    }

    // Reset after delay
    setTimeout(() => {
      form.reset();
      if (success) {
        success.classList.remove('visible');
        form.querySelector('.btn').style.display = '';
      }
    }, 5000);
  });
}

/* ─────────────────────────────────────────────
   6. INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initContactForm();
  updateActiveNavLink();
});
