(function () {
  "use strict";

  var SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="cart" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2s-.9-2-2-2M1 2v2h2l3.6 7.59l-1.35 2.44C5.01 14.37 5.48 15 6.21 15H19v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12L7.5 11h11.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 22.96 3H5.21l-.94-2H1m16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2s2-.9 2-2s-.9-2-2-2"/></symbol>' +
    '<symbol id="search" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/></symbol>' +
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
        "🇧🇴 Envíos a toda Bolivia · 📦 Mayor y menor · 📍 Feria Barrio Lindo · Pasillo 8 · " +
        '<a href="https://wa.me/59169297946" target="_blank" rel="noopener">WhatsApp 69297946</a>' +
        "</div></div>" +
        '<nav class="navbar navbar-expand-lg navbar-dark navbar-chanez sticky-top">' +
        '<div class="container-fluid px-3 px-lg-4">' +
        '<a class="navbar-brand brand-lockup d-flex align-items-center gap-2" href="./index.html" aria-label="CHANEZ STORE inicio">' +
        '<span class="brand-mark" aria-hidden="true"><span class="brand-mark-top">CHANEZ</span><span class="brand-mark-bottom">STORE</span></span>' +
        '<span class="brand-name d-none d-md-block"><strong>CHANEZ STORE</strong><small class="d-block text-muted-brand">@chanez_store · Ropa urbana</small></span>' +
        "</a>" +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#chanezNav" aria-controls="chanezNav" aria-expanded="false" aria-label="Menú">' +
        '<span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse" id="chanezNav">' +
        '<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3 text-uppercase fs-6">' +
        '<li class="nav-item"><a class="nav-link' + activeClass(page, "shop") + '" href="./index.html">Tienda</a></li>' +
        '<li class="nav-item"><a class="nav-link' + activeClass(page, "cart") + '" href="./carrito.html">Carrito</a></li>' +
        '<li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">Bolsa (<span data-cart-count>0</span>)</a></li>' +
        '<li class="nav-item"><a class="btn btn-chanez btn-sm ms-lg-2" href="https://wa.me/59169297946" target="_blank" rel="noopener">Pedir por WhatsApp</a></li>' +
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
