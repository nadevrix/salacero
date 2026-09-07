/* ==========================================================================
   Maison Lumière — script.js
   ========================================================================== */

(function () {
  'use strict';

  /* ── UTILITIES ──────────────────────────────────────────────────────────── */

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  /* ── 1. NAV SCROLL BEHAVIOUR ────────────────────────────────────────────── */
  /* Adds `.scrolled` class to the header once past 15% of the hero height,
     switching the nav from transparent to solid charcoal. */

  function initNavScroll() {
    var header = $('#site-header');
    var hero   = $('#hero');

    function update() {
      var threshold = hero ? hero.offsetHeight * 0.15 : 80;
      header.classList.toggle('scrolled', window.scrollY > threshold);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 2. MOBILE NAV TOGGLE ───────────────────────────────────────────────── */

  function initMobileNav() {
    var toggle   = $('.nav-toggle');
    var navLinks = $('.nav-links');
    var links    = $$('.nav-link');

    function close() {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        close();
        toggle.focus();
      }
    });
  }

  /* ── 3. SCROLL FADE-IN (Intersection Observer) ──────────────────────────── */
  /* Animates every .fade-in element into view as it enters the viewport.
     Falls back to instant-visible if IntersectionObserver is unavailable. */

  function initScrollAnimations() {
    var elements = $$('.fade-in');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* fire once only */
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── 4. TESTIMONIALS CAROUSEL ───────────────────────────────────────────── */

  function initCarousel() {
    var track = $('#carousel-track');
    var dots  = $$('.dot');
    var total = dots.length;
    var current = 0;
    var timer   = null;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }

    function startAuto() {
      timer = setInterval(function () { goTo(current + 1); }, 4000);
    }

    function stopAuto() {
      clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.dataset.index, 10));
        stopAuto();
        startAuto();
      });
    });

    /* Pause autoplay on hover / focus so users can read comfortably */
    var wrapper = $('.carousel-wrapper');
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    wrapper.addEventListener('focusin',    stopAuto);
    wrapper.addEventListener('focusout',   startAuto);

    goTo(0);
    startAuto();
  }

  /* ── 5. FORM POPULATION ─────────────────────────────────────────────────── */
  /* Populates the guest count select (1–12) and time select (12:00–22:00
     in 30-minute steps). Also sets tomorrow as the minimum bookable date. */

  function populateFormSelects() {
    var timeSelect = $('#time');
    if (!timeSelect) return;

    for (var h = 11; h <= 22; h++) {
      var mins = ['00', '30'];
      for (var m = 0; m < mins.length; m++) {
        if (h === 11 && mins[m] === '00') continue;
        if (h === 22 && mins[m] === '30') break;
        var value = pad2(h) + ':' + mins[m];
        var tOpt  = document.createElement('option');
        tOpt.value       = value;
        tOpt.textContent = value;
        timeSelect.appendChild(tOpt);
      }
    }
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function formatTime12(hour, min) {
    var suffix = hour < 12 ? 'AM' : 'PM';
    var h      = hour > 12 ? hour - 12 : hour;
    return h + ':' + min + ' ' + suffix;
  }

  function toISO(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  /* ── 6. FORM VALIDATION ─────────────────────────────────────────────────── */

  var VALIDATORS = {
    fullName: {
      errorId: 'full-name-error',
      validate: function (v) {
        var s = v.trim();
        return s.length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/.test(s);
      },
      message: 'Ingresá tu nombre completo (mínimo 2 caracteres)'
    },
    phone: {
      errorId: 'phone-error',
      validate: function (v) {
        return /^[\+\d][\d\s\-\(\)]{6,18}$/.test(v.trim());
      },
      message: 'Ingresá un número de WhatsApp válido'
    },
    time: {
      errorId: 'time-error',
      validate: function (v) { return v !== ''; },
      message: 'Seleccioná un horario'
    },
    guests: {
      errorId: 'guests-error',
      validate: function (v) { return v !== ''; },
      message: 'Seleccioná tu zona de entrega'
    }
  };

  function validateField(input) {
    var spec = VALIDATORS[input.name];
    if (!spec) return true; /* optional field — always passes */

    var valid   = spec.validate(input.value);
    var errorEl = document.getElementById(spec.errorId);

    input.classList.toggle('invalid', !valid);
    input.classList.toggle('valid',    valid);

    if (errorEl) {
      errorEl.textContent = valid ? '' : spec.message;
    }
    return valid;
  }

  function initFormValidation() {
    var form   = $('#reservation-form');
    var inputs = $$('[required]', form);

    inputs.forEach(function (input) {
      /* Validate on blur only when the field has been touched */
      input.addEventListener('blur', function () {
        if (input.value !== '' || input.classList.contains('invalid')) {
          validateField(input);
        }
      });

      /* Clear error as the user types / changes a selection */
      input.addEventListener('input', function () {
        if (input.classList.contains('invalid')) validateField(input);
      });

      input.addEventListener('change', function () {
        if (input.classList.contains('invalid') || input.tagName === 'SELECT') {
          validateField(input);
        }
      });
    });
  }

  /* ── 7. FORM SUBMISSION ─────────────────────────────────────────────────── */

  function initFormSubmission() {
    var form          = $('#reservation-form');
    var successPanel  = $('#form-success');
    var successMsg    = $('#success-message');
    var makeAnotherBtn = $('#make-another-btn');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputs   = $$('[required]', form);
      var allValid = true;

      inputs.forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        var firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name   = $('#full-name').value.trim();
      var zone   = $('#guests').value;
      var timeStr = $('#time').value;
      var order  = $('#special-requests').value.trim();

      successMsg.textContent =
        'Gracias, ' + name + '. Recibimos tu pedido para ' + zone +
        ' a las ' + timeStr + '. Te escribimos por WhatsApp en breve para confirmar.';

      form.hidden         = true;
      successPanel.hidden = false;
      successPanel.focus();
    });

    /* Reset everything when the user wants to make another booking */
    makeAnotherBtn.addEventListener('click', function () {
      form.reset();

      $$('.form-input', form).forEach(function (el) {
        el.classList.remove('valid', 'invalid');
      });
      $$('.form-error', form).forEach(function (el) {
        el.textContent = '';
      });

      successPanel.hidden = true;
      form.hidden         = false;
      $('#full-name').focus();
    });
  }

  /* Formats "2026-06-15" → "Monday, 15 June 2026" */
  function formatDateDisplay(dateStr) {
    if (!dateStr) return dateStr;
    var parts = dateStr.split('-');
    var date  = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return date.toLocaleDateString('en-SG', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      year:    'numeric'
    });
  }

  /* Formats "19:30" → "7:30 PM" */
  function formatTime12Display(timeStr) {
    if (!timeStr) return timeStr;
    var parts  = timeStr.split(':');
    var h      = parseInt(parts[0], 10);
    var min    = parts[1];
    var suffix = h < 12 ? 'AM' : 'PM';
    var dh     = h > 12 ? h - 12 : h;
    return dh + ':' + min + ' ' + suffix;
  }

  /* ── 8. FOOTER YEAR ─────────────────────────────────────────────────────── */

  function initFooterYear() {
    var el = $('#copyright-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── 9. THEME TOGGLE ───────────────────────────────────────────────────── */

  function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var icon = btn.querySelector('.theme-icon');
    var STORAGE_KEY = 'sc-theme';

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      var isLight = theme === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      icon.textContent = isLight ? '☾' : '☀';
    }

    var saved = localStorage.getItem(STORAGE_KEY);
    var system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(saved || system);

    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* ── 10. WHATSAPP FAB ───────────────────────────────────────────────────── */

  function initWhatsAppFab() {
    var fab = document.getElementById('whatsapp-fab');
    if (!fab) return;
    fab.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { event_category: 'engagement' });
      }
    });
  }

  /* ── 11. CONTACT FORM ──────────────────────────────────────────────────── */

  function initContactForm() {
    var form       = document.getElementById('contact-form');
    var success    = document.getElementById('contact-success');
    var successMsg = document.getElementById('contact-success-message');
    var anotherBtn = document.getElementById('contact-another-btn');
    if (!form) return;

    var CONTACT_VALIDATORS = {
      contactName: {
        errorId:  'contact-name-error',
        validate: function (v) { return v.trim().length >= 2; },
        message:  'Please enter your full name (at least 2 characters).'
      },
      contactEmail: {
        errorId:  'contact-email-error',
        validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        message:  'Please enter a valid email address.'
      },
      contactSubject: {
        errorId:  'contact-subject-error',
        validate: function (v) { return v !== ''; },
        message:  'Please select a subject.'
      },
      contactMessage: {
        errorId:  'contact-message-error',
        validate: function (v) { return v.trim().length >= 10; },
        message:  'Please enter a message (at least 10 characters).'
      }
    };

    function validateContactField(input) {
      var rule    = CONTACT_VALIDATORS[input.name];
      if (!rule) return true;
      var errorEl = document.getElementById(rule.errorId);
      var valid   = rule.validate(input.value);
      if (errorEl) {
        errorEl.textContent = valid ? '' : rule.message;
      }
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      return valid;
    }

    Object.keys(CONTACT_VALIDATORS).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      el.addEventListener('blur', function () { validateContactField(el); });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validateContactField(el);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      Object.keys(CONTACT_VALIDATORS).forEach(function (name) {
        var el = form.elements[name];
        if (el && !validateContactField(el)) allValid = false;
      });
      if (!allValid) {
        var firstError = form.querySelector('[aria-invalid="true"]');
        if (firstError) firstError.focus();
        return;
      }

      var lead = {
        id:        Date.now(),
        timestamp: new Date().toISOString(),
        name:      form.elements.contactName.value.trim(),
        email:     form.elements.contactEmail.value.trim(),
        phone:     form.elements.contactPhone ? form.elements.contactPhone.value.trim() : '',
        subject:   form.elements.contactSubject.value,
        message:   form.elements.contactMessage.value.trim()
      };
      successMsg.textContent = 'Thank you, ' + lead.name + '. We have received your message and will be in touch within one business day.';
      form.hidden    = true;
      success.hidden = false;
      success.focus();
      triggerCelebration();
    });

    if (anotherBtn) {
      anotherBtn.addEventListener('click', function () {
        form.reset();
        Object.keys(CONTACT_VALIDATORS).forEach(function (name) {
          var el = form.elements[name];
          if (el) el.removeAttribute('aria-invalid');
          var rule = CONTACT_VALIDATORS[name];
          if (rule) {
            var errEl = document.getElementById(rule.errorId);
            if (errEl) errEl.textContent = '';
          }
        });
        form.hidden    = false;
        success.hidden = true;
        form.elements.contactName.focus();
      });
    }
  }

  /* ── 13. CELEBRATION ANIMATION ─────────────────────────────────────────── */

  function shadeColor(hex, amt) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16)         + amt));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    var b = Math.min(255, Math.max(0, (num & 0xff)        + amt));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function triggerCelebration() {
    var COLORS = [
      '#FFD600', /* vivid amber-gold   */
      '#FF1744', /* vivid red          */
      '#00E676', /* vivid green        */
      '#2979FF', /* vivid blue         */
      '#D500F9', /* vivid purple       */
      '#FF6D00', /* vivid orange       */
      '#F50057', /* vivid rose         */
      '#00E5FF', /* vivid cyan         */
      '#FFEA00', /* vivid yellow       */
      '#76FF03', /* vivid lime         */
      '#FF4081', /* hot pink           */
      '#1DE9B6'  /* vivid teal         */
    ];
    var SHAPES = ['2px', '50%', '3px 12px', '50% 10%'];

    var container = document.createElement('div');
    container.className = 'celebration-container';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);

    /* Confetti pieces — gradient + box-shadow for 3D depth */
    for (var i = 0; i < 90; i++) {
      var color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      var lighter = shadeColor(color,  75);
      var darker  = shadeColor(color, -65);
      var piece   = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText =
        'left:'               + (Math.random() * 100)                        + 'vw;'  +
        'background:linear-gradient(135deg,' + lighter + ',' + color + ',' + darker + ');' +
        'width:'              + (7  + Math.random() * 9)                     + 'px;'  +
        'height:'             + (12 + Math.random() * 10)                    + 'px;'  +
        'border-radius:'      + SHAPES[Math.floor(Math.random() * SHAPES.length)]    + ';'   +
        'box-shadow:2px 3px 4px rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,255,0.45);' +
        'animation-delay:'    + (Math.random() * 3.5)                        + 's;'   +
        'animation-duration:' + (5   + Math.random() * 3)                   + 's;'   +
        'transform:rotate('   + (Math.random() * 360)                       + 'deg);';
      container.appendChild(piece);
    }

    /* Balloons — radial-gradient sphere + shadow + knot child */
    for (var j = 0; j < 14; j++) {
      var bColor   = COLORS[Math.floor(Math.random() * COLORS.length)];
      var bLighter = shadeColor(bColor,  90);
      var bDarker  = shadeColor(bColor, -55);
      var balloon  = document.createElement('div');
      balloon.className = 'celebration-balloon';
      balloon.style.cssText =
        'left:'               + (3 + Math.random() * 94) + 'vw;'  +
        'background:radial-gradient(circle at 36% 32%,' + bLighter + ' 0%,' + bColor + ' 48%,' + bDarker + ' 100%);' +
        'box-shadow:-5px -5px 12px rgba(255,255,255,0.18) inset,5px 5px 18px rgba(0,0,0,0.28) inset,0 10px 24px rgba(0,0,0,0.22);' +
        'animation-delay:'    + (Math.random() * 2.5)    + 's;'   +
        'animation-duration:' + (7   + Math.random() * 4) + 's;';

      var knot = document.createElement('span');
      knot.className = 'balloon-knot';
      knot.style.background = bDarker;
      balloon.appendChild(knot);

      container.appendChild(balloon);
    }

    setTimeout(function () {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 14000);
  }

  /* ── 14. ELLIE FAQ CHATBOT ─────────────────────────────────────────────── */

  var ELLIE_FAQ = [
    /* ── General ── */
    { id: 'hours',
      keywords: ['hour', 'open', 'close', 'time', 'schedule', 'when', 'operating', 'timing', 'lunch', 'dinner'],
      question: 'What are your opening hours?',
      answer: 'We are open Tuesday–Friday: Lunch 11:30–14:00 & Dinner 17:30–22:00.\nSaturday–Sunday: Dinner only 17:30–22:30.\nWe are closed on Mondays.' },

    { id: 'location',
      keywords: ['where', 'address', 'location', 'duxton', 'find', 'directions', 'map', 'get there', 'mrt', 'bus'],
      question: 'Where are you located?',
      answer: '22 Duxton Hill, Singapore 089605.\nWe are a 5-minute walk from Tanjong Pagar MRT (Exit A). Street parking is available on Duxton Road.' },

    { id: 'parking',
      keywords: ['park', 'parking', 'car', 'drive', 'valet', 'carpark'],
      question: 'Is there parking available?',
      answer: 'Street parking is on Duxton Road and Duxton Plain Park. Tanjong Pagar Plaza car park is a short walk away. We recommend public transport — Tanjong Pagar MRT (Exit A) is just 5 minutes.' },

    { id: 'reservation',
      keywords: ['book', 'reserv', 'table', 'seat', 'walk-in', 'walkin', 'walk in'],
      question: 'How do I make a reservation?',
      answer: 'Book online via the Reservations section on our website, or call +65 6224 8899. We recommend booking at least 48 hours ahead, especially for weekends.' },

    { id: 'dress',
      keywords: ['dress', 'code', 'wear', 'attire', 'smart casual', 'formal', 'cloth', 'outfit'],
      question: 'Is there a dress code?',
      answer: 'We observe smart casual attire. Elegant casual clothing is always appreciated. Beachwear, sportswear, and flip-flops are not permitted.' },

    { id: 'dietary',
      keywords: ['vegan', 'vegetarian', 'halal', 'allerg', 'gluten', 'dietary', 'kosher', 'dairy', 'nut', 'intoleran', 'special diet'],
      question: 'Do you cater to dietary requirements?',
      answer: 'Yes! Please inform us of any dietary requirements or allergies when booking, or at least 24 hours before your visit. We accommodate most needs including vegetarian, gluten-free, and nut-free options. We are not currently halal-certified.' },

    { id: 'children',
      keywords: ['child', 'kid', 'baby', 'infant', 'highchair', 'toddler', 'family', 'little one'],
      question: 'Are children welcome?',
      answer: 'Children are warmly welcome! High chairs are available on request. Please mention this when booking so we can seat you comfortably.' },

    { id: 'group',
      keywords: ['group', 'large party', 'corporate', 'function', 'event', 'company', 'team', 'colleagues', 'big group'],
      question: 'Do you accommodate large group bookings?',
      answer: 'Yes — for groups of 10 or more, please contact us at +65 6224 8899 or reservations@kungfupanda.sg. Private dining rooms accommodate up to 30 guests.' },

    { id: 'payment',
      keywords: ['pay', 'payment', 'cash', 'card', 'visa', 'mastercard', 'amex', 'credit', 'debit', 'paynow', 'nets', 'apple pay', 'google pay'],
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, American Express, NETS, PayNow, Apple Pay, and Google Pay. Cash is also welcome.' },

    { id: 'wifi',
      keywords: ['wifi', 'wi-fi', 'internet', 'wireless', 'password', 'connect'],
      question: 'Is Wi-Fi available?',
      answer: 'Yes — complimentary Wi-Fi is available for all guests. Ask our staff for the access details when you are seated.' },

    /* ── Gift Cards ── */
    { id: 'giftcard-exists',
      keywords: ['gift card', 'gift voucher', 'voucher', 'gift certificate', 'present', 'give as gift'],
      question: 'Do you offer gift cards?',
      answer: 'Yes! Kungfu Panda gift cards are available in denominations of S$50, S$100, S$200, and S$500 — the perfect present for any occasion.' },

    { id: 'giftcard-purchase',
      keywords: ['buy gift', 'purchase gift', 'get gift card', 'order gift', 'how to buy'],
      question: 'How do I purchase a gift card?',
      answer: 'Gift cards are available in-restaurant, by phone (+65 6224 8899), or by email (reservations@kungfupanda.sg). Physical cards are issued in-restaurant; e-gift cards can be emailed directly to the recipient.' },

    { id: 'giftcard-expiry',
      keywords: ['gift card expir', 'voucher expir', 'gift expire', 'valid gift', 'how long gift'],
      question: 'Do gift cards expire?',
      answer: 'Gift cards are valid for 24 months from the date of purchase. No extensions are available, so please use them in good time!' },

    { id: 'giftcard-balance',
      keywords: ['gift card balance', 'check gift', 'remaining gift', 'how much gift', 'balance voucher'],
      question: 'How do I check my gift card balance?',
      answer: 'Call us on +65 6224 8899 or present your card in-restaurant and our team will check the remaining balance for you.' },

    { id: 'giftcard-use',
      keywords: ['use gift card', 'redeem gift', 'spend gift', 'gift card pay'],
      question: 'How do I use a gift card?',
      answer: 'Present your physical or e-gift card to our staff at payment. Gift cards are valid for dine-in only and cannot be exchanged for cash.' },

    /* ── Rewards Program ── */
    { id: 'rewards-exists',
      keywords: ['reward', 'loyalty', 'member', 'points', 'programme', 'program', 'panda reward'],
      question: 'Do you have a rewards / loyalty program?',
      answer: 'Yes! Panda Rewards is our free loyalty program. Earn 1 point per S$1 spent and enjoy exclusive perks including birthday privileges and priority reservations.' },

    { id: 'rewards-join',
      keywords: ['join reward', 'sign up reward', 'register reward', 'how to join', 'enroll', 'enrol', 'become member'],
      question: 'How do I join Panda Rewards?',
      answer: 'Sign up free at the restaurant or email rewards@kungfupanda.sg with your full name and contact details. Your card will be ready on your next visit.' },

    { id: 'rewards-earn',
      keywords: ['earn point', 'how many point', 'get point', 'accumulate', 'how point work'],
      question: 'How do I earn rewards points?',
      answer: 'Earn 1 point per S$1 spent on food and beverages during dine-in. Present your membership card when paying. Corkage fees and room hire do not earn points.' },

    { id: 'rewards-redeem',
      keywords: ['redeem', 'use point', 'spend point', 'reward voucher', 'convert point', 'cash point'],
      question: 'How do I redeem my rewards points?',
      answer: '100 points = S$5 dining credit. Present your card at payment and ask to redeem. Minimum redemption is 100 points (S$5).' },

    { id: 'rewards-expiry',
      keywords: ['point expir', 'reward expir', 'point expire', 'loyalty expir', 'point valid'],
      question: 'Do rewards points expire?',
      answer: 'Points are valid for 12 months from the date earned. They expire after 12 consecutive months of no earning or redeeming activity.' },

    { id: 'rewards-birthday',
      keywords: ['birthday', 'bday', 'birth day', 'anniversary reward', 'birthday benefit', 'birthday discount'],
      question: 'Are there birthday or anniversary benefits?',
      answer: 'Panda Rewards members receive a complimentary dessert and 10% off their birthday month (dine-in, member\'s table). Please mention this when reserving.' },

    /* ── Themed Party Arrangements ── */
    { id: 'themed-party',
      keywords: ['theme', 'themed party', 'private party', 'celebration', 'birthday party', 'anniversary party', 'event package', 'party arrangement'],
      question: 'Do you host themed dining events and private parties?',
      answer: 'Absolutely! We offer bespoke themed party arrangements for birthdays, anniversaries, corporate events, and special celebrations. Our events team curates décor, menu, and entertainment to suit your theme.' },

    { id: 'themed-packages',
      keywords: ['theme package', 'what package', 'party package', 'party option', 'available theme'],
      question: 'What themed packages are available?',
      answer: 'Our signature packages:\n🏮 Red Lantern — classic Chinese banquet with traditional décor\n🐼 Panda Party — fun, informal setup ideal for birthdays\n🎋 Garden of Serenity — elegant botanical theme with fresh florals\n🌟 Imperial Banquet — premium 10-course feast in a full private room\nCustom themes are also available — contact our events team to discuss.' },

    { id: 'themed-advance',
      keywords: ['how far advance', 'notice party', 'when to book party', 'book event', 'plan party', 'lead time'],
      question: 'How far in advance should I book a themed party?',
      answer: 'We recommend at least 2 weeks for standard arrangements and 4–6 weeks for bespoke or large events. Peak dates (Lunar New Year, Valentine\'s Day, year-end) fill up quickly.' },

    { id: 'themed-decorations',
      keywords: ['own decoration', 'bring decoration', 'external decorator', 'personal decoration', 'decorate'],
      question: 'Can I bring my own decorations?',
      answer: 'Yes, with prior approval. No open-flame candles (LED candles are fine), no loose confetti, and no adhesive directly on walls or furniture. Our team is happy to set up your decorations before guests arrive.' },

    { id: 'themed-minimum',
      keywords: ['minimum spend', 'minimum charge', 'private room charge', 'event cost', 'hire fee', 'room hire'],
      question: 'Is there a minimum spend for private events?',
      answer: 'Private dining starts with a minimum F&B spend of S$1,200 for a semi-private enclosure (up to 15 guests) and S$2,500 for the full private room (up to 30 guests). Room hire fees are waived when the minimum is met.' },

    { id: 'themed-cake',
      keywords: ['outside cake', 'own cake', 'bring cake', 'external cake', 'birthday cake', 'cake fee'],
      question: 'Can I bring an outside cake?',
      answer: 'Yes! A cake handling fee of S$30 applies (covers refrigeration, plating, and service). Please let us know in advance so we can prepare.' },

    /* ── Corkage Fee ── */
    { id: 'corkage-fee',
      keywords: ['corkage', 'bring wine', 'own wine', 'own bottle', 'byob', 'bring alcohol', 'bring bottle', 'bring my own'],
      question: 'What is your corkage fee?',
      answer: 'Corkage is S$45 per 750ml bottle of still wine, and S$55 per bottle of Champagne or sparkling wine. Spirits may not be brought from outside.' },

    { id: 'corkage-limit',
      keywords: ['how many bottle', 'bottle limit', 'maximum bottle', 'number of bottle', 'limit bottle'],
      question: 'Is there a limit on how many bottles I can bring?',
      answer: 'Up to 2 bottles per reservation (subject to corkage). For larger groups or private events, up to 4 bottles may be permitted — please check with our team.' },

    { id: 'corkage-type',
      keywords: ['what wine', 'type of wine', 'type alcohol', 'bring spirit', 'bring beer', 'beer corkage', 'spirit allowed'],
      question: 'What types of beverages can I bring?',
      answer: 'Still and sparkling wines only. Spirits, beer, and pre-mixed drinks may not be brought from outside. Our in-house wine and cocktail list is curated to complement our Hunan menu.' },

    { id: 'corkage-waive',
      keywords: ['waive corkage', 'no corkage', 'corkage free', 'corkage waiv', 'free corkage'],
      question: 'Can the corkage fee be waived?',
      answer: 'The corkage fee may be waived at management\'s discretion when a guest also purchases a bottle from our wine list. Please speak to our sommelier or host on the evening.' }
  ];

  function initEllieChatbot() {
    var panel       = document.getElementById('ellie-panel');
    var messages    = document.getElementById('ellie-messages');
    var input       = document.getElementById('ellie-input');
    var sendBtn     = document.getElementById('ellie-send-btn');
    var toggleBtn   = document.getElementById('ellie-toggle-btn');
    var minimizeBtn = document.getElementById('ellie-minimize-btn');
    var closeBtn    = document.getElementById('ellie-close-btn');
    if (!panel) return;

    var isOpen = false;

    function addBotMessage(text) {
      removeSuggestions();
      var bubble = document.createElement('div');
      bubble.className = 'ellie-bubble ellie-bubble--bot';
      /* Safely render \n as <br> without innerHTML on user content */
      var parts = text.split('\n');
      parts.forEach(function (part, idx) {
        bubble.appendChild(document.createTextNode(part));
        if (idx < parts.length - 1) bubble.appendChild(document.createElement('br'));
      });
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function addUserMessage(text) {
      removeSuggestions();
      var bubble = document.createElement('div');
      bubble.className = 'ellie-bubble ellie-bubble--user';
      bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeSuggestions() {
      var el = messages.querySelector('.ellie-suggestions');
      if (el) el.remove();
    }

    function showSuggestions(chips) {
      var row = document.createElement('div');
      row.className = 'ellie-suggestions';
      chips.forEach(function (label) {
        var btn = document.createElement('button');
        btn.className = 'ellie-suggestion';
        btn.textContent = label;
        btn.addEventListener('click', function () { handleUserInput(label); });
        row.appendChild(btn);
      });
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
    }

    function findAnswer(query) {
      var q = query.toLowerCase();
      var best = null;
      var bestScore = 0;
      ELLIE_FAQ.forEach(function (entry) {
        var score = 0;
        entry.keywords.forEach(function (kw) {
          if (q.indexOf(kw.toLowerCase()) !== -1) score++;
        });
        if (score > bestScore) { bestScore = score; best = entry; }
      });
      return bestScore > 0 ? best : null;
    }

    function handleUserInput(text) {
      var trimmed = text.trim();
      if (!trimmed) return;
      addUserMessage(trimmed);
      input.value = '';
      var match = findAnswer(trimmed);
      if (match) {
        addBotMessage(match.answer);
      } else {
        addBotMessage('I\'m not sure about that one — but our team would love to help! 🐼\nCall +65 6224 8899 or email reservations@kungfupanda.sg and we\'ll get back to you within one business day.');
      }
      showSuggestions(['Opening hours', 'Gift cards', 'Rewards program', 'Corkage fee', 'Party arrangements']);
    }

    function openPanel() {
      panel.hidden = false;
      isOpen = true;
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close Ellie chat');
      if (messages.children.length === 0) {
        addBotMessage('Hello, I\'m Ellie. How can I delight you today? 😊');
        showSuggestions(['Opening hours', 'Reservations', 'Gift cards', 'Corkage fee', 'Rewards program']);
      }
      setTimeout(function () { input.focus(); }, 80);
    }

    function closePanel() {
      panel.hidden = true;
      isOpen = false;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Chat with Ellie');
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', function () {
      if (isOpen) { closePanel(); } else { openPanel(); }
    });

    minimizeBtn.addEventListener('click', closePanel);

    closeBtn.addEventListener('click', function () {
      panel.hidden = true;
      isOpen = false;
      messages.innerHTML = '';   /* full reset — next open starts fresh */
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Chat with Ellie');
      toggleBtn.focus();
    });

    sendBtn.addEventListener('click', function () { handleUserInput(input.value); });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleUserInput(input.value); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closePanel();
    });
  }

  /* ── INIT ───────────────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initMobileNav();
    initScrollAnimations();
    initCarousel();
    populateFormSelects();
    initFormValidation();
    initFormSubmission();
    initFooterYear();
    initThemeToggle();
    initWhatsAppFab();
    initContactForm();
    initEllieChatbot();
  });

})();
