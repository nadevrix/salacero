(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var dropToggle = document.getElementById("nav-drop-toggle");
  var drop = document.getElementById("nav-drop");

  /* El encabezado arranca transparente sobre el hero y pasa a negro al bajar. */
  function syncHeader() {
    var solid = window.scrollY > 24 || document.body.classList.contains("nav-open");
    header.classList.toggle("is-solid", solid);
  }

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (!open) setDrop(false);
    syncHeader();
  }

  function setDrop(open) {
    drop.classList.toggle("is-open", open);
    dropToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  window.addEventListener("scroll", syncHeader, { passive: true });

  navToggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("is-open"));
  });

  dropToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setDrop(!drop.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  document.addEventListener("click", function (event) {
    if (!drop.contains(event.target) && event.target !== dropToggle) setDrop(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    setDrop(false);
    if (nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  /* El hero usa assets/hero.mp4 si existe; si no, se queda la foto con zoom. */
  function initHeroVideo() {
    var hero = document.getElementById("hero");
    var video = document.getElementById("hero-video");
    var controls = document.getElementById("hero-controls");
    var playBtn = document.getElementById("hero-play");
    var muteBtn = document.getElementById("hero-mute");
    if (!hero || !video) return;

    var source = video.querySelector("source");
    var dropped = false;

    function disable() {
      if (dropped) return;
      dropped = true;
      hero.classList.remove("has-video");
      controls.hidden = true;
      if (video.parentNode) video.parentNode.removeChild(video);
    }

    function enable() {
      hero.classList.add("has-video");
      controls.hidden = false;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        hero.classList.add("is-paused");
        return;
      }

      var attempt = video.play();
      if (attempt && attempt.catch) {
        attempt.catch(function () {
          hero.classList.add("is-paused");
        });
      }
    }

    video.addEventListener("loadedmetadata", enable, { once: true });
    video.addEventListener("error", disable);
    if (source) source.addEventListener("error", disable);

    video.addEventListener("play", function () {
      hero.classList.remove("is-paused");
      playBtn.setAttribute("aria-label", "Pausar video");
    });

    video.addEventListener("pause", function () {
      hero.classList.add("is-paused");
      playBtn.setAttribute("aria-label", "Reproducir video");
    });

    playBtn.addEventListener("click", function () {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });

    muteBtn.addEventListener("click", function () {
      video.muted = !video.muted;
      hero.classList.toggle("is-unmuted", !video.muted);
      muteBtn.setAttribute("aria-label", video.muted ? "Activar sonido" : "Silenciar video");
    });

    video.load();
  }

  /* El carrusel avanza solo, pero los puntos y el botón lo manejan a mano. */
  function initSlider() {
    var slider = document.getElementById("catering");
    var track = document.getElementById("slider-track");
    var dotsBox = document.getElementById("slider-dots");
    var playBtn = document.getElementById("slider-play");
    if (!slider || !track || !playBtn) return;

    var slides = track.querySelectorAll(".slide");
    var dots = dotsBox ? dotsBox.querySelectorAll(".slider-dot") : [];
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var delay = 5000;

    function render() {
      track.style.transform = "translateX(" + index * -100 + "%)";
      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function go(next) {
      index = (next + slides.length) % slides.length;
      render();
    }

    function stop() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    }

    function play() {
      stop();
      slider.classList.remove("is-paused");
      playBtn.setAttribute("aria-label", "Pausar carrusel");
      timer = window.setInterval(function () {
        go(index + 1);
      }, delay);
    }

    function pause() {
      stop();
      slider.classList.add("is-paused");
      playBtn.setAttribute("aria-label", "Reanudar carrusel");
    }

    /* Tras un salto manual se reinicia la cuenta, para no cortar la imagen recién puesta. */
    function jump(next) {
      go(next);
      if (timer !== null) play();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        jump(i);
      });
    });

    playBtn.addEventListener("click", function () {
      if (timer === null) {
        play();
      } else {
        pause();
      }
    });

    var startX = null;

    track.addEventListener(
      "touchstart",
      function (event) {
        startX = event.touches[0].clientX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      function (event) {
        if (startX === null) return;
        var moved = event.changedTouches[0].clientX - startX;
        if (Math.abs(moved) > 40) jump(index + (moved < 0 ? 1 : -1));
        startX = null;
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (!slider.classList.contains("is-paused")) {
        play();
      }
    });

    playBtn.hidden = false;
    if (dotsBox) dotsBox.hidden = false;
    render();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pause();
    } else {
      play();
    }
  }

  syncHeader();
  initHeroVideo();
  initSlider();
})();
