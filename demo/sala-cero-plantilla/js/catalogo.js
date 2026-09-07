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
          if (p.fix !== "—") html += "<div><dt>Arreglos post-entrega</dt><dd>desde " + esc(p.fix) + "</dd></div>";
          html += "</dl>";
          if (p.note) html += '<p class="catalog-note">' + esc(p.note) + "</p>";
          if (!opts.hideWa && p.wa) {
            html += '<a class="catalog-wa" href="' + esc(waLink(p.wa)) + '" target="_blank" rel="noopener">Cotizar por WhatsApp</a>';
          }
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
