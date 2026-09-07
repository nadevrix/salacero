(function () {
  "use strict";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.SalaCeroCatalogo = {
    render: function (root, catalog, opts) {
      if (!root || !catalog) return;
      opts = opts || {};
      var html = "";

      catalog.categories.forEach(function (cat) {
        html += '<section class="catalog-category">';
        html += '<div class="catalog-category-head"><h3>' + esc(cat.title) + "</h3>";
        html += "<p>" + esc(cat.description) + "</p></div>";
        html += '<div class="catalog-grid">';
        cat.products.forEach(function (p) {
          html += '<article class="catalog-product">';
          html += '<div class="catalog-product-top"><h4>' + esc(p.name) + "</h4>";
          html += '<p class="catalog-price">' + esc(p.price) + "</p></div>";
          html += "<p class=\"catalog-desc\">" + esc(p.desc) + "</p>";
          if (p.includes.length) {
            html += "<ul class=\"catalog-includes\">" + p.includes.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
          }
          html += '<dl class="catalog-meta">';
          html += "<div><dt>Entrega</dt><dd>" + esc(p.delivery) + "</dd></div>";
          html += "<div><dt>Mantenimiento</dt><dd>" + esc(p.maintenance) + (p.maintenance !== "—" ? "/mes" : "") + "</dd></div>";
          html += "<div><dt>Servidor</dt><dd>" + esc(p.server) + (p.server !== "—" && p.server !== "Bs 0" ? "/mes" : "") + "</dd></div>";
          html += "<div><dt>Plan código QR</dt><dd>" + esc(p.code) + "</dd></div>";
          if (p.fix !== "—") html += "<div><dt>Arreglos</dt><dd>desde " + esc(p.fix) + "</dd></div>";
          html += "</dl>";
          if (p.note) html += '<p class="catalog-note">' + esc(p.note) + "</p>";
          html += "</article>";
        });
        html += "</div></section>";
      });

      root.innerHTML = html;
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var c = window.SALA_CERO_CATALOGO;
    if (!c) return;
    var inc = document.getElementById("included-list");
    if (inc) inc.innerHTML = c.included.map(function (i) { return "<li>" + i + "</li>"; }).join("");
    var foot = document.getElementById("footnote");
    if (foot) foot.textContent = c.footnote;
    SalaCeroCatalogo.render(document.getElementById("catalog-root"), c, { hideWa: true });
  });
})();
