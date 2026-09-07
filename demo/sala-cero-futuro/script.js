(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Scroll progress + nav */
  var nav = document.querySelector("[data-nav]");
  var progressBar = document.querySelector(".scroll-progress span");

  function onScroll() {
    var y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(y / max, 1) : 0;
    if (progressBar) progressBar.style.transform = "scaleX(" + ratio + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  toggle?.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
    if (mobileMenu) mobileMenu.hidden = open;
    document.body.classList.toggle("menu-open", !open);
  });
  mobileMenu?.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      toggle?.setAttribute("aria-expanded", "false");
      if (mobileMenu) mobileMenu.hidden = true;
      document.body.classList.remove("menu-open");
    });
  });

  /* Custom cursor */
  var cursor = document.querySelector(".cursor");
  if (cursor && finePointer && !reducedMotion) {
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    });
    function animateCursor() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll("a, button, [data-magnetic]").forEach(function (el) {
      el.addEventListener("pointerenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* Magnetic buttons */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.2;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.2;
        btn.style.transform = "translate(" + x + "px," + y + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5%" });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* Hero slideshow */
  var slides = document.querySelectorAll("[data-hero-slide]");
  var thumbs = document.querySelectorAll("[data-hero-go]");
  var currentSlide = 0;
  var slideTimer;

  function goSlide(n) {
    currentSlide = n;
    slides.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
    thumbs.forEach(function (t, i) { t.classList.toggle("is-active", i === n); });
  }

  function autoSlide() {
    if (reducedMotion) return;
    slideTimer = setInterval(function () {
      goSlide((currentSlide + 1) % slides.length);
    }, 6000);
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      clearInterval(slideTimer);
      goSlide(Number(thumb.dataset.heroGo));
      autoSlide();
    });
  });
  if (slides.length) autoSlide();

  /* Hero canvas — particle network */
  var canvas = document.querySelector("[data-hero-canvas]");
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext("2d");
    var colors = ["41,184,255", "130,72,255", "255,58,167", "255,146,30"];
    var w = 0, h = 0, nodes = [], raf = 0, visible = true;
    var mouse = { x: 0.5, y: 0.5 };

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(40, Math.round(w / 22));
      nodes = Array.from({ length: count }, function () {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var mx = mouse.x * w;
      var my = mouse.y * h;

      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        var dx = mx - n.x;
        var dy = my - n.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          n.x -= dx * 0.008;
          n.y -= dy * 0.008;
        }
      });

      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(130,72,255," + (1 - d / 140) * 0.25 + ")";
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(function (n) {
        var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        g.addColorStop(0, "rgba(" + n.color + ",0.8)");
        g.addColorStop(1, "rgba(" + n.color + ",0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      if (visible) raf = requestAnimationFrame(draw);
    }

    var hero = document.querySelector("[data-hero]");
    hero?.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    });

    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  }

  /* Parallax on immersive panels */
  if (!reducedMotion) {
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var factor = parseFloat(el.dataset.parallax) || 0.3;
      function updateParallax() {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - window.innerHeight / 2;
        var offset = center * factor * -0.15;
        el.querySelector("img").style.transform = "translateY(" + (-10 + offset) + "%)";
      }
      window.addEventListener("scroll", updateParallax, { passive: true });
      updateParallax();
    });
  }

  /* 3D tilt cards */
  if (finePointer && !reducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(800px) rotateY(" + (x * 8) + "deg) rotateX(" + (-y * 8) + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* Spotlight on service cards */
  document.querySelectorAll("[data-spotlight]").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", (e.clientX - rect.left) + "px");
      card.style.setProperty("--spot-y", (e.clientY - rect.top) + "px");
    });
  });

  /* Counter animation */
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 1800;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObs.observe(c); });
  }

  /* Horizontal scroll — wheel to horizontal */
  var horizontal = document.querySelector("[data-horizontal]");
  if (horizontal && finePointer) {
    horizontal.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        horizontal.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  /* Contact form → WhatsApp */
  var form = document.querySelector("[data-contact-form]");
  var formStatus = document.querySelector("[data-form-status]");
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var phone = form.dataset.whatsapp?.replace(/\D/g, "");
    var nombre = String(data.get("nombre") ?? "").trim();
    var email = String(data.get("email") ?? "").trim();
    var servicio = String(data.get("servicio") ?? "").trim();
    var mensaje = String(data.get("mensaje") ?? "").trim();
    var texto = [
      "Hola Sala Cero, soy " + nombre + ".",
      "Necesito: " + servicio + ".",
      "",
      mensaje,
      email ? "\nMi correo: " + email : "",
    ].filter(Boolean).join("\n");
    if (phone) {
      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
      if (formStatus) formStatus.textContent = "Abrimos WhatsApp con tu consulta lista.";
    }
  });

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
