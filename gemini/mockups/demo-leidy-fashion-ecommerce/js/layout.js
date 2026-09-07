(function () {
  "use strict";

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="cart" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.44C5.01 14.37 5.48 15 6.21 15H19v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12L7.5 11h11.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 22.96 3H5.21l-.94-2H1m16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></symbol>' +
    "</svg>";

  function activeClass(page, target) {
    return page === target ? " active fw-bold" : "";
  }

  window.ChanezLayout = {
    mount: function (page) {
      var root = document.getElementById("chanez-chrome");
      if (!root) return;

      root.innerHTML =
        SVG +
        '<div class="chanez-topbar py-2"><div class="container text-center small">' +
        "🇧🇴 Bolivia · 👗 Prendas para damas · 📦 Mayor y menor · Tienda P-14 · " +
        '<a href="https://wa.link/8039at" target="_blank" rel="noopener">WhatsApp Leidy Fashion</a>' +
        "</div></div>" +
        '<nav class="navbar navbar-expand-lg navbar-dark navbar-chanez sticky-top">' +
        '<div class="container-fluid px-3 px-lg-4">' +
        '<a class="navbar-brand brand-lockup d-flex align-items-center gap-2" href="./index.html" aria-label="Leidy Fashion Bolivia inicio">' +
        '<img class="brand-avatar" src="./assets/logo-leidy-fashion.svg" alt="" width="48" height="48">' +
        '<span class="brand-name d-none d-md-block"><strong>Leidy Fashion</strong><small class="d-block text-muted-brand">@leidy_fashion_bolivia · Prendas para damas</small></span>' +
        "</a>" +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#chanezNav" aria-controls="chanezNav" aria-expanded="false" aria-label="Menú">' +
        '<span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse" id="chanezNav">' +
        '<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3 text-uppercase fs-6">' +
        '<li class="nav-item"><a class="nav-link' + activeClass(page, "shop") + '" href="./index.html">Tienda</a></li>' +
        '<li class="nav-item"><a class="nav-link' + activeClass(page, "cart") + '" href="./carrito.html">Carrito</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">Bolsa (<span data-cart-count>0</span>)</a></li>' +
        '<li class="nav-item"><a class="btn btn-chanez btn-sm ms-lg-2" href="https://wa.link/8039at" target="_blank" rel="noopener">Pedir por WhatsApp</a></li>' +
        "</ul></div></div></nav>" +
        '<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart" aria-labelledby="offcanvasCartLabel">' +
        '<div class="offcanvas-header border-bottom"><h5 class="offcanvas-title text-uppercase" id="offcanvasCartLabel">Tu bolsa</h5>' +
        '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button></div>' +
        '<div class="offcanvas-body" id="offcanvas-cart-body"><p class="text-muted">Cargando carrito…</p></div></div>';
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page") || "shop";
    window.ChanezLayout.mount(page);
  });
})();
