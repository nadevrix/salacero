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

  /* Pestañas del menú: solo existen en menu.html. */
  function initMenuTabs() {
    var tabs = document.querySelectorAll(".menu-tab");
    if (!tabs.length) return;

    function select(target) {
      tabs.forEach(function (tab) {
        var on = tab === target;
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (panel) panel.hidden = !on;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var step = 0;
        if (event.key === "ArrowRight") step = 1;
        if (event.key === "ArrowLeft") step = -1;
        if (!step) return;

        event.preventDefault();
        var i = Array.prototype.indexOf.call(tabs, tab);
        var next = tabs[(i + step + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });

    select(tabs[0]);
  }

  /* El clic en el ::backdrop llega al propio dialog, así que hay que medirlo. */
  function closeOnOutside(sheet, close) {
    sheet.addEventListener("cancel", close);

    sheet.addEventListener("click", function (event) {
      if (event.target !== sheet) return;
      var box = sheet.getBoundingClientRect();
      var fuera =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (fuera) close();
    });
  }

  /* La hoja informativa se abre sola al entrar, una vez por sesión. */
  function initNewsletter() {
    var sheet = document.getElementById("news");
    if (!sheet || typeof sheet.showModal !== "function") return;

    var form = document.getElementById("news-form");
    var body = document.getElementById("news-body");
    var done = document.getElementById("news-done");
    var closeBtn = document.getElementById("news-close");
    var doneBtn = document.getElementById("news-done-close");
    var openBtn = document.getElementById("news-open");
    var footerRow = document.getElementById("footer-news");
    var key = "sabor-cruceno-boletin";

    /* En modo privado el almacenamiento lanza, y no vale romper la página por eso. */
    function wasSeen() {
      try {
        return window.sessionStorage.getItem(key) === "1";
      } catch (error) {
        return false;
      }
    }

    function markSeen() {
      try {
        window.sessionStorage.setItem(key, "1");
      } catch (error) {
        /* Sin almacenamiento la hoja vuelve a aparecer, que es el mal menor. */
      }
    }

    function open() {
      if (sheet.open) return;
      body.hidden = false;
      done.hidden = true;
      form.reset();
      sheet.showModal();
      document.body.classList.add("news-open");
    }

    function close() {
      markSeen();
      document.body.classList.remove("news-open");
      if (sheet.open) sheet.close();
    }

    closeBtn.addEventListener("click", close);
    doneBtn.addEventListener("click", close);

    closeOnOutside(sheet, close);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      markSeen();
      body.hidden = true;
      done.hidden = false;
      done.focus();
    });

    /* El botón del pie es opcional: la hoja puede vivir en una página sin él. */
    if (openBtn && footerRow) {
      openBtn.addEventListener("click", open);
      footerRow.hidden = false;
    }

    if (!wasSeen()) window.setTimeout(open, 1100);
  }

  /* Página de pedidos: el carrito vive en el navegador y termina en un WhatsApp. */
  function initOrder() {
    var page = document.getElementById("pedido");
    if (!page) return;

    var KEY = "sabor-cruceno-pedido";
    var WA = "https://wa.me/59170000000?text=";

    var bar = document.getElementById("cartbar");
    var barCount = document.getElementById("cartbar-count");
    var barTotal = document.getElementById("cartbar-total");
    var sheet = document.getElementById("cart");
    var list = document.getElementById("cart-list");
    var empty = document.getElementById("cart-empty");
    var totalBox = document.getElementById("cart-total");
    var note = document.getElementById("cart-note");
    var send = document.getElementById("cart-send");
    var etaTime = document.getElementById("order-eta-time");
    var etaLabel = document.getElementById("order-eta-label");
    var rail = document.getElementById("rail");
    var railBtns = document.getElementById("rail-btns");
    var prev = document.getElementById("rail-prev");
    var next = document.getElementById("rail-next");
    var modes = page.querySelectorAll(".order-mode");
    var items = [];

    function load() {
      try {
        var raw = window.localStorage.getItem(KEY);
        var saved = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(saved)) return [];
        /* Lo guardado puede ser de una versión vieja del menú, así que se filtra. */
        return saved.filter(function (item) {
          return item && item.id && item.qty > 0 && isFinite(item.price);
        });
      } catch (error) {
        return [];
      }
    }

    function save() {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(items));
      } catch (error) {
        /* Sin almacenamiento el pedido dura lo que dure la pestaña. */
      }
    }

    function money(value) {
      return "Bs " + value;
    }

    function count() {
      return items.reduce(function (n, item) {
        return n + item.qty;
      }, 0);
    }

    function sum() {
      return items.reduce(function (n, item) {
        return n + item.qty * item.price;
      }, 0);
    }

    function isDelivery() {
      var on = page.querySelector(".order-mode.is-active");
      return !!on && on.getAttribute("data-mode") === "delivery";
    }

    function waLink() {
      var lines = items.map(function (item) {
        return item.qty + " x " + item.name + " — " + money(item.qty * item.price);
      });
      var text =
        "Hola Sabor Cruceño, " +
        (isDelivery() ? "quiero delivery" : "quiero retirar en el local") +
        ".\n\n" +
        lines.join("\n") +
        "\n\nTotal: " +
        money(sum());
      return WA + encodeURIComponent(text);
    }

    function stepper(label, aria, action) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cart-step";
      btn.textContent = label;
      btn.setAttribute("aria-label", aria);
      btn.addEventListener("click", action);
      return btn;
    }

    function row(item, i) {
      var li = document.createElement("li");
      li.className = "cart-item";

      var text = document.createElement("div");
      var name = document.createElement("p");
      name.className = "cart-item-name";
      name.textContent = item.name;
      var unit = document.createElement("p");
      unit.className = "cart-item-price";
      unit.textContent = money(item.price) + " c/u";
      text.appendChild(name);
      text.appendChild(unit);

      var qty = document.createElement("div");
      qty.className = "cart-qty";
      qty.appendChild(
        stepper("−", "Quitar uno de " + item.name, function () {
          bump(i, -1);
        })
      );
      var num = document.createElement("span");
      num.textContent = item.qty;
      qty.appendChild(num);
      qty.appendChild(
        stepper("+", "Agregar uno de " + item.name, function () {
          bump(i, 1);
        })
      );

      li.appendChild(text);
      li.appendChild(qty);
      return li;
    }

    function render() {
      var n = count();

      bar.hidden = n === 0;
      barCount.textContent = n === 1 ? "1 ítem" : n + " ítems";
      barTotal.textContent = money(sum());

      list.innerHTML = "";
      items.forEach(function (item, i) {
        list.appendChild(row(item, i));
      });

      list.hidden = n === 0;
      empty.hidden = n > 0;
      send.hidden = n === 0;
      totalBox.textContent = money(sum());
      send.href = waLink();
      note.textContent = isDelivery()
        ? "Delivery en Equipetrol y zonas cercanas. El costo se confirma por WhatsApp."
        : "Retiro en Av. San Martín, Equipetrol.";

      save();
    }

    function bump(i, step) {
      items[i].qty += step;
      if (items[i].qty < 1) items.splice(i, 1);
      render();
    }

    function add(dish) {
      var id = dish.getAttribute("data-id");
      var found = null;
      items.forEach(function (item) {
        if (item.id === id) found = item;
      });

      if (found) {
        found.qty += 1;
      } else {
        items.push({
          id: id,
          name: dish.getAttribute("data-name"),
          price: Number(dish.getAttribute("data-price")),
          qty: 1
        });
      }

      render();
    }

    function openCart() {
      /* Sin soporte de dialog el pedido igual se puede enviar. */
      if (typeof sheet.showModal !== "function") {
        window.open(waLink(), "_blank", "noopener");
        return;
      }
      if (sheet.open) return;
      sheet.showModal();
      document.body.classList.add("news-open");
    }

    function closeCart() {
      document.body.classList.remove("news-open");
      if (sheet.open) sheet.close();
    }

    function railEnds() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }

    page.querySelectorAll(".dish-add").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dish = btn.closest(".dish");
        if (!dish) return;
        add(dish);
        dish.classList.add("is-added");
        window.setTimeout(function () {
          dish.classList.remove("is-added");
        }, 900);
      });
    });

    modes.forEach(function (btn) {
      btn.addEventListener("click", function () {
        modes.forEach(function (other) {
          var on = other === btn;
          other.classList.toggle("is-active", on);
          other.setAttribute("aria-pressed", on ? "true" : "false");
        });
        etaTime.textContent = isDelivery() ? "40 min" : "25 min";
        etaLabel.textContent = isDelivery() ? "a tu puerta" : "listo para retirar";
        render();
      });
    });

    document.getElementById("cart-open").addEventListener("click", openCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    document.getElementById("cart-clear").addEventListener("click", function () {
      items = [];
      render();
    });
    closeOnOutside(sheet, closeCart);

    prev.addEventListener("click", function () {
      rail.scrollBy({ left: rail.clientWidth * -0.8, behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      rail.scrollBy({ left: rail.clientWidth * 0.8, behavior: "smooth" });
    });
    rail.addEventListener("scroll", railEnds, { passive: true });
    window.addEventListener("resize", railEnds);

    items = load();
    railBtns.hidden = false;
    railEnds();
    render();
  }

  syncHeader();
  initHeroVideo();
  initSlider();
  initMenuTabs();
  initNewsletter();
  initOrder();
})();
