(function () {
  "use strict";

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="cart" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.44C5.01 14.37 5.48 15 6.21 15H19v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12L7.5 11h11.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 22.96 3H5.21l-.94-2H1m16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></symbol>' +
    '<symbol id="search" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></symbol>' +
    '<symbol id="envelope" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5L4 8V6l8 5l8-5z"/></symbol>' +
    '<symbol id="facebook" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9c1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12H17l-.4 3h-2.6v7A10 10 0 0 0 22 12"/></symbol>' +
    '<symbol id="instagram" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-5 3.5A4.5 4.5 0 1 1 7.5 12A4.5 4.5 0 0 1 12 7.5m0 2A2.5 2.5 0 1 0 14.5 12A2.5 2.5 0 0 0 12 9.5M17.5 6.8a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/></symbol>' +
    '<symbol id="whatsapp" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2m5.83 14.24c-.24.68-1.42 1.3-1.97 1.34c-.5.04-1.13.06-1.82-.11c-.42-.11-.96-.31-1.65-.61c-2.9-1.25-4.79-4.18-4.93-4.38c-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.36c.24-.26.53-.33.71-.33h.51c.16 0 .38-.06.59.45c.22.53.74 1.82.8 1.95c.07.13.11.28.02.46c-.09.17-.13.28-.26.43c-.13.15-.27.33-.39.44c-.13.13-.26.26-.11.51c.15.24.67 1.11 1.44 1.8c.99.89 1.83 1.17 2.09 1.3c.26.13.41.11.56-.06c.16-.18.67-.78.85-1.05c.17-.26.35-.22.59-.13c.24.09 1.52.72 1.78.85c.26.13.43.2.5.31c.07.11.07.64-.17 1.32"/></symbol>' +
    '<symbol id="trash" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.5-9h1v8h-1zm4 0h1v8h-1zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></symbol>' +
    '<symbol id="gear" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54A.49.49 0 0 0 13.9 2h-3.8a.49.49 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.7 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.82 14.16a.5.5 0 0 0-.12.64l1.92 3.32c.13.23.4.32.64.22l2.39-.96c.5.39 1.04.7 1.63.94l.36 2.54c.05.24.25.42.49.42h3.8c.24 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.23.1.51 0 .64-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.6A3.6 3.6 0 1 1 15.6 12 3.6 3.6 0 0 1 12 15.6"/></symbol>' +
    "</svg>";

  function link(label, attrs) {
    return (
      '<a class="nav-mega-link" href="./index.html#tienda" ' +
      attrs +
      '><span aria-hidden="true">›</span>' +
      label +
      "</a>"
    );
  }

  function col(title, items) {
    return '<div class="nav-mega-col"><h4>' + title + "</h4>" + items.join("") + "</div>";
  }

  function megaItem(label, attrs, columns) {
    return (
      '<li class="nav-item nav-item-mega">' +
      '<a class="nav-link" href="./index.html#tienda" ' +
      attrs +
      ">" +
      label +
      ' <span class="nav-caret" aria-hidden="true">▾</span></a>' +
      '<div class="nav-mega">' +
      columns.join("") +
      "</div></li>"
    );
  }

  window.ChanezLayout = {
    mount: function (page) {
      var root = document.getElementById("chanez-chrome");
      if (!root) return;

      root.innerHTML =
        SVG +
        '<header class="chanez-header">' +
        '<div class="chanez-topbar">' +
        '<div class="chanez-topbar-inner">' +
        '<div class="chanez-topbar-links">' +
        '<a href="./index.html#tienda">¿Cómo comprar?</a>' +
        '<a href="./index.html#tienda">Contáctanos</a>' +
        "</div>" +
        '<div class="chanez-topbar-links">' +
        '<a href="./index.html#tienda">Gift Card</a>' +
        '<a href="./index.html#tienda">Iniciar sesión</a>' +
        "</div></div></div>" +
        '<nav class="navbar navbar-expand-lg navbar-dark navbar-chanez">' +
        '<div class="navbar-chanez-inner">' +
        '<a class="navbar-brand brand-wordmark" href="./index.html" aria-label="CHANEZ STORE inicio">chanez</a>' +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#chanezNav" aria-controls="chanezNav" aria-expanded="false" aria-label="Menú">' +
        '<span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse" id="chanezNav">' +
        '<ul class="navbar-nav chanez-nav-links">' +
        megaItem("Marcas", "", [
          col("Marcas", [
            link("CHANEZ", 'data-nav-q="chanez"'),
            link("Street", 'data-nav-q="street"'),
            link("Core", 'data-nav-q="core"'),
            link("Limited", 'data-nav-q="limited"'),
          ]),
        ]) +
        megaItem("Hombre", 'data-nav-category="hombre"', [
          col("Vestuario", [
            link("Poleras", 'data-nav-category="hombre" data-nav-type="poleras"'),
            link("Polos", 'data-nav-category="hombre" data-nav-type="polos"'),
            link("Camisas", 'data-nav-category="hombre" data-nav-type="poleras"'),
            link("Chaquetas y sweaters", 'data-nav-category="hombre" data-nav-type="buzos"'),
            link("Polerones y canguros", 'data-nav-category="hombre" data-nav-type="buzos"'),
            link("Pantalones", 'data-nav-category="hombre" data-nav-type="shorts"'),
            link("Shorts", 'data-nav-category="hombre" data-nav-type="shorts"'),
            link("Calzas", 'data-nav-category="hombre" data-nav-type="shorts"'),
            link("Medias", 'data-nav-category="hombre" data-nav-type="accesorios" data-nav-subtype="medias"'),
          ]),
          col("Calzado", [
            link("Zapatillas", 'data-nav-category="hombre" data-nav-type="calzado" data-nav-subtype="zapatillas"'),
            link("Zapatos", 'data-nav-category="hombre" data-nav-type="calzado" data-nav-subtype="zapatos"'),
            link("Botines y botas", 'data-nav-category="hombre" data-nav-type="calzado" data-nav-subtype="botas"'),
            link("Sandalias", 'data-nav-category="hombre" data-nav-type="calzado" data-nav-subtype="sandalias"'),
            link("Calzado de seguridad", 'data-nav-category="hombre" data-nav-type="calzado" data-nav-subtype="seguridad"'),
          ]),
        ]) +
        megaItem("Mujer", 'data-nav-category="mujer"', [
          col("Vestuario", [
            link("Poleras", 'data-nav-category="mujer" data-nav-type="poleras"'),
            link("Polos", 'data-nav-category="mujer" data-nav-type="polos"'),
            link("Camisas", 'data-nav-category="mujer" data-nav-type="poleras"'),
            link("Blusas", 'data-nav-category="mujer" data-nav-type="polos"'),
            link("Chaquetas y sweaters", 'data-nav-category="mujer" data-nav-type="buzos"'),
            link("Polerones y canguros", 'data-nav-category="mujer" data-nav-type="buzos"'),
            link("Pantalones", 'data-nav-category="mujer" data-nav-type="shorts"'),
            link("Shorts", 'data-nav-category="mujer" data-nav-type="shorts"'),
            link("Calzas", 'data-nav-category="mujer" data-nav-type="shorts"'),
            link("Medias", 'data-nav-category="mujer" data-nav-type="accesorios" data-nav-subtype="medias"'),
          ]),
          col("Calzado", [
            link("Zapatillas", 'data-nav-category="mujer" data-nav-type="calzado" data-nav-subtype="zapatillas"'),
            link("Zapatos", 'data-nav-category="mujer" data-nav-type="calzado" data-nav-subtype="zapatos"'),
            link("Botines y botas", 'data-nav-category="mujer" data-nav-type="calzado" data-nav-subtype="botas"'),
            link("Sandalias", 'data-nav-category="mujer" data-nav-type="calzado" data-nav-subtype="sandalias"'),
          ]),
        ]) +
        megaItem("Accesorios", 'data-nav-type="accesorios"', [
          col("Accesorios", [
            link("Mochilas", 'data-nav-type="accesorios" data-nav-subtype="mochilas"'),
            link("Carteras", 'data-nav-type="accesorios" data-nav-subtype="carteras"'),
            link("Gorras", 'data-nav-type="accesorios" data-nav-subtype="gorras"'),
            link("Cinturones", 'data-nav-type="accesorios" data-nav-subtype="cinturones"'),
            link("Maletas", 'data-nav-type="accesorios" data-nav-subtype="maletas"'),
            link("Equipo de entrenamiento", 'data-nav-type="accesorios" data-nav-subtype="entrenamiento"'),
          ]),
        ]) +
        megaItem("Iconics", "", [
          col("Iconics", [
            link("Street", 'data-nav-q="street"'),
            link("Limited", 'data-nav-q="limited"'),
            link("Classic", 'data-nav-q="classic"'),
            link("Pro", 'data-nav-q="pro"'),
          ]),
        ]) +
        "</ul>" +
        '<div class="chanez-nav-tools">' +
        '<form class="nav-search" role="search" action="./index.html" method="get">' +
        '<svg class="nav-search-icon" width="16" height="16" aria-hidden="true"><use href="#search"></use></svg>' +
        '<input id="nav-search" type="search" name="q" placeholder="¿Qué estás buscando?" aria-label="Buscar productos" />' +
        "</form>" +
        '<div class="nav-cart-wrap">' +
        '<button type="button" class="nav-cart-btn" id="nav-cart-toggle" aria-expanded="false" aria-controls="mini-cart" aria-label="Abrir carrito">' +
        '<svg width="22" height="22" aria-hidden="true"><use href="#cart"></use></svg>' +
        '<span class="nav-cart-badge" data-cart-count>0</span>' +
        "</button>" +
        '<div class="mini-cart" id="mini-cart" hidden>' +
        '<div id="mini-cart-body"></div>' +
        "</div></div>" +
        "</div></div></div></nav></header>" +
        '<div class="cart-toast" id="cart-toast" hidden></div>' +
        '<a href="https://wa.me/59169297946" target="_blank" rel="noopener" class="whatsapp-float-btn" aria-label="Pedir por WhatsApp">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.707 1.916.807 2.05c.1.133 1.392 2.123 3.372 2.977.471.203.84.324 1.127.416.474.152.905.13 1.246.08.38-.058 1.17-.478 1.338-.94.167-.462.167-.858.118-.94-.049-.082-.181-.132-.378-.231z"/></svg></a>';

      var links = root.querySelectorAll(".chanez-nav-links > .nav-item > .nav-link");
      links.forEach(function (navLink) {
        navLink.addEventListener("click", function (event) {
          links.forEach(function (item) {
            item.classList.remove("active");
          });
          navLink.classList.add("active");
          if (window.matchMedia("(max-width: 991.98px)").matches && navLink.parentElement.classList.contains("nav-item-mega")) {
            event.preventDefault();
            var item = navLink.parentElement;
            var open = item.classList.contains("open");
            root.querySelectorAll(".nav-item-mega.open").forEach(function (el) {
              el.classList.remove("open");
            });
            if (!open) item.classList.add("open");
          }
        });
      });
      root.querySelectorAll(".nav-mega-link").forEach(function (megaLink) {
        megaLink.addEventListener("click", function () {
          links.forEach(function (item) {
            item.classList.remove("active");
          });
          var parentItem = megaLink.closest(".nav-item-mega");
          if (parentItem) {
            var topLink = parentItem.querySelector(".nav-link");
            if (topLink) topLink.classList.add("active");
            parentItem.classList.remove("open");
          }
        });
      });
    },
    mountFooter: function () {
      var root = document.getElementById("chanez-footer");
      if (!root) return;
      root.innerHTML =
        '<div class="footer-cta">' +
        '<div class="footer-cta-inner">' +
        '<a class="footer-cta-item" href="./index.html#tienda"><span class="brand-wordmark">chanez</span><span>Gift Cards</span></a>' +
        '<a class="footer-cta-item" href="https://wa.me/59169297946" target="_blank" rel="noopener"><svg width="18" height="18" aria-hidden="true"><use href="#whatsapp"></use></svg><span>Nuestro WhatsApp</span></a>' +
        '<a class="footer-cta-item" href="mailto:info@chanezstore.bo"><svg width="18" height="18" aria-hidden="true"><use href="#envelope"></use></svg><span>Escríbenos: info@chanezstore.bo</span></a>' +
        '<div class="footer-cta-item footer-cta-social"><span>Síguenos</span>' +
        '<a href="https://www.tiktok.com/@chanez_store" target="_blank" rel="noopener" aria-label="Facebook"><svg width="18" height="18"><use href="#facebook"></use></svg></a>' +
        '<a href="https://www.tiktok.com/@chanez_store" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18"><use href="#instagram"></use></svg></a>' +
        "</div></div></div>" +
        '<footer class="site-footer-chanez">' +
        '<div class="footer-columns">' +
        '<div class="footer-col"><h3>Atención al cliente</h3><a href="./index.html#tienda">¿Cómo comprar?</a><a href="./index.html#tienda">Código promocional</a></div>' +
        '<div class="footer-col"><h3>Legal</h3><a href="./index.html#tienda">Términos y condiciones</a><a href="./index.html#tienda">Políticas de envío</a><a href="./index.html#tienda">Políticas de cambio</a><a href="./index.html#tienda">Políticas de privacidad</a></div>' +
        '<div class="footer-col"><h3>¿Tienes dudas?</h3><a href="./index.html#tienda">Guía de tallas</a><a href="./index.html#tienda">Plazos de envío</a><a href="./index.html#tienda">Sobre la Gift Card</a></div>' +
        '<div class="footer-col"><h3>Contáctate con nosotros</h3><p>Agrégame: <a href="https://wa.me/59169297946" target="_blank" rel="noopener">+591 69297946</a></p><p>Escríbenos: <a href="mailto:info@chanezstore.bo">info@chanezstore.bo</a></p><a href="./index.html#tienda">Sobre nosotros</a></div>' +
        '<div class="footer-col"><h3>Recibe ofertas especiales</h3>' +
        '<form class="footer-newsletter" id="footer-newsletter">' +
        '<label class="footer-newsletter-field"><svg width="16" height="16" aria-hidden="true"><use href="#envelope"></use></svg>' +
        '<input type="email" name="email" placeholder="Correo Electronico" required aria-label="Correo electrónico"></label>' +
        '<button type="submit">Suscribirse</button></form>' +
        '<div class="footer-pay-row"><span>QR</span><span>Visa</span><span>MC</span><span>Efectivo</span></div>' +
        "</div></div></footer>" +
        '<div class="footer-copy">Copyright © 2026 CHANEZ STORE</div>';

      var form = document.getElementById("footer-newsletter");
      if (form) {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          form.reset();
        });
      }
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page") || "shop";
    window.ChanezLayout.mount(page);
    window.ChanezLayout.mountFooter();
  });
})();
