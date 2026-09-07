(function () {
  "use strict";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function waLink(text) {
    return "https://wa.me/59175063505?text=" + encodeURIComponent(text);
  }

  function getMeta(productName) {
    if (window.SALA_CERO_PRODUCTOS && window.SALA_CERO_PRODUCTOS.byName[productName]) {
      return window.SALA_CERO_PRODUCTOS.byName[productName];
    }
    return null;
  }

  window.SalaCeroCatalogo = {
    render: function (root, catalog, opts) {
      if (!root || !catalog) return;
      opts = opts || {};
      var compact = !!opts.compact;
      var html = "";

      if (!compact) {
        html +=
          '<div class="catalog-included"><p><strong>Incluido en todo, sin cobrarlo aparte:</strong></p><ul>' +
          catalog.included.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") +
          "</ul></div>";
      }

      catalog.categories.forEach(function (cat) {
        html += '<section class="catalog-category" id="cat-' + esc(cat.id) + '">';
        html += '<div class="catalog-category-head"><h3>' + esc(cat.title) + "</h3>";
        html += "<p>" + esc(cat.description) + "</p></div>";
        html += '<div class="catalog-grid">';
        cat.products.forEach(function (p) {
          var meta = getMeta(p.name);
          html += '<article class="catalog-product">';
          if (meta && meta.image) {
            html += '<a class="catalog-product-img" href="./producto.html?slug=' + esc(meta.slug) + '">';
            html += '<img src="' + esc(meta.image) + '" alt="' + esc(p.name) + '" loading="lazy" width="400" height="240">';
            html += "</a>";
          }
          html += '<div class="catalog-product-top"><h4>';
          if (meta) {
            html += '<a href="./producto.html?slug=' + esc(meta.slug) + '">' + esc(p.name) + "</a>";
          } else {
            html += esc(p.name);
          }
          html += "</h4>";
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
          if (p.fix !== "—") html += "<div><dt>Arreglos post-entrega</dt><dd>desde " + esc(p.fix) + "</dd></div>";
          html += "</dl>";
          if (p.note) html += '<p class="catalog-note">' + esc(p.note) + "</p>";
          html += '<div class="catalog-product-actions">';
          if (meta) {
            html += '<a class="catalog-link" href="./producto.html?slug=' + esc(meta.slug) + '">Ver guía completa</a>';
            if (meta.demoUrl) {
              html += '<a class="catalog-link catalog-link-demo" href="' + esc(meta.demoUrl) + '" target="_blank" rel="noopener">Abrir demo</a>';
            }
          }
          if (!opts.hideWa && p.wa) {
            html += '<a class="catalog-wa" href="' + esc(waLink(p.wa)) + '" target="_blank" rel="noopener">Cotizar</a>';
          }
          html += "</div>";
          html += "</article>";
        });
        html += "</div></section>";
      });

      if (!compact && catalog.footnote) {
        html += '<p class="catalog-footnote">' + esc(catalog.footnote) + "</p>";
      }

      root.innerHTML = html;
    },
  };
})();
