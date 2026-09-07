(function () {
  "use strict";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findPrice(catalogName) {
    if (!window.SALA_CERO_CATALOGO) return "";
    for (var i = 0; i < window.SALA_CERO_CATALOGO.categories.length; i++) {
      var products = window.SALA_CERO_CATALOGO.categories[i].products;
      for (var j = 0; j < products.length; j++) {
        if (products[j].name === catalogName) return products[j].price;
      }
    }
    return "";
  }

  function renderGrid(rootId, category) {
    var root = document.getElementById(rootId);
    if (!root || !window.SALA_CERO_PRODUCTOS) return;

    var items = Object.keys(window.SALA_CERO_PRODUCTOS.bySlug)
      .map(function (k) { return window.SALA_CERO_PRODUCTOS.bySlug[k]; })
      .filter(function (p) { return p.category === category; });

    var html = '<div class="showcase-grid">';
    items.forEach(function (p) {
      var price = findPrice(p.catalogName);
      html += '<a class="showcase-card reveal" href="./producto.html?slug=' + esc(p.slug) + '" data-tilt>';
      html += '<div class="showcase-card-img"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy"></div>';
      html += '<div class="showcase-card-body">';
      html += "<h3>" + esc(p.title) + "</h3>";
      html += "<p>" + esc(p.whatIs.substring(0, 90)) + "…</p>";
      if (price) html += '<span class="showcase-price">' + esc(price) + "</span>";
      if (p.demoUrl) html += '<span class="showcase-tag">Demo incluido</span>';
      html += "</div></a>";
    });
    html += "</div>";
    root.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid("showcase-web", "web");
    renderGrid("showcase-apps", "apps");
    renderGrid("showcase-sistemas", "sistemas");
    renderGrid("showcase-otros", "otros");
  });
})();
