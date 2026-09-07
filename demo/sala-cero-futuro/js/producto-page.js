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

  function findCatalogProduct(name) {
    if (!window.SALA_CERO_CATALOGO) return null;
    for (var i = 0; i < window.SALA_CERO_CATALOGO.categories.length; i++) {
      var cat = window.SALA_CERO_CATALOGO.categories[i];
      for (var j = 0; j < cat.products.length; j++) {
        if (cat.products[j].name === name) return cat.products[j];
      }
    }
    return null;
  }

  function render() {
    var root = document.getElementById("producto-root");
    if (!root || !window.SALA_CERO_PRODUCTOS) return;

    var slug = new URLSearchParams(window.location.search).get("slug");
    var producto = slug ? window.SALA_CERO_PRODUCTOS.bySlug[slug] : null;

    if (!producto) {
      root.innerHTML =
        '<div class="producto-not-found"><h1>Producto no encontrado</h1><p><a href="./index.html">Volver al inicio</a></p></div>';
      document.title = "Producto no encontrado — Sala Cero";
      return;
    }

    var catalog = findCatalogProduct(producto.catalogName);
    document.title = producto.title + " — Sala Cero";

    var html = "";

    html += '<section class="producto-hero">';
    html += '<div class="producto-hero-bg"><img src="' + esc(producto.image) + '" alt=""></div>';
    html += '<div class="producto-hero-inner reveal is-visible">';
    html += '<span class="tag">' + esc(producto.category === "web" ? "Web" : producto.category === "apps" ? "App móvil" : producto.category === "sistemas" ? "Sistema" : "Servicio") + "</span>";
    html += "<h1>" + esc(producto.title) + "</h1>";
    if (catalog) html += '<p class="producto-price">Desde ' + esc(catalog.price) + " · " + esc(catalog.delivery) + "</p>";
    html += '<div class="producto-actions">';
    if (producto.demoUrl) {
      html += '<a href="' + esc(producto.demoUrl) + '" class="btn btn-primary" target="_blank" rel="noopener">Abrir demo en vivo</a>';
    }
    if (catalog && catalog.wa) {
      html += '<a href="' + esc(waLink(catalog.wa)) + '" class="btn btn-ghost" target="_blank" rel="noopener">Cotizar por WhatsApp</a>';
    }
    html += "</div></div></section>";

    html += '<div class="producto-body">';

    html += '<section class="producto-block reveal"><h2>¿Qué es esto?</h2><p>' + esc(producto.whatIs) + "</p></section>";

    html += '<section class="producto-block reveal"><h2>¿Por qué elegir este producto?</h2><p>' + esc(producto.whyChoose) + "</p></section>";

    html += '<section class="producto-block reveal"><h2>Pros de elegir esto</h2><ul class="producto-list">';
    producto.pros.forEach(function (pro) {
      html += "<li>" + esc(pro) + "</li>";
    });
    html += "</ul></section>";

    if (producto.sections.length) {
      html += '<section class="producto-block reveal"><h2>¿Por qué tiene cada sección?</h2><div class="producto-sections">';
      producto.sections.forEach(function (sec) {
        html += '<article class="producto-section-card"><h3>' + esc(sec.title) + "</h3><p>" + esc(sec.why) + "</p></article>";
      });
      html += "</div></section>";
    }

    if (catalog) {
      html += '<section class="producto-block reveal"><h2>Datos del catálogo</h2>';
      html += '<dl class="producto-meta">';
      html += "<div><dt>Precio</dt><dd>" + esc(catalog.price) + "</dd></div>";
      html += "<div><dt>Entrega</dt><dd>" + esc(catalog.delivery) + "</dd></div>";
      html += "<div><dt>Mantenimiento</dt><dd>" + esc(catalog.maintenance) + (catalog.maintenance !== "—" ? "/mes" : "") + "</dd></div>";
      html += "<div><dt>Servidor</dt><dd>" + esc(catalog.server) + "</dd></div>";
      html += "</dl>";
      if (catalog.includes.length) {
        html += '<ul class="producto-list" style="margin-top:1rem">';
        catalog.includes.forEach(function (i) { html += "<li>" + esc(i) + "</li>"; });
        html += "</ul>";
      }
      html += "</section>";
    }

    if (producto.demoUrl && producto.category === "apps") {
      html += '<section class="producto-block reveal"><h2>Vista previa móvil</h2>';
      html += '<p style="color:var(--muted);margin-bottom:0">Plantilla de referencia — en reuniones podemos mostrarla en celular o empaquetarla en Expo Go.</p>';
      html += '<div class="producto-demo-frame producto-demo-frame-mobile"><iframe src="' + esc(producto.demoUrl) + '" title="Demo móvil" loading="lazy"></iframe></div>';
      html += '<p class="producto-expo">Para probar en <strong>Expo Go</strong>: instalá la app (Android/iOS) y pedinos el enlace del build de demostración. <a href="https://expo.dev/go" target="_blank" rel="noopener">Descargar Expo Go →</a></p>';
      html += "</section>";
    } else if (producto.demoUrl) {
      html += '<section class="producto-block reveal"><h2>Vista previa del demo</h2>';
      html += '<p style="color:var(--muted);margin-bottom:0">Plantilla de referencia — así podría verse tu versión personalizada.</p>';
      html += '<div class="producto-demo-frame"><iframe src="' + esc(producto.demoUrl) + '" title="Demo ' + esc(producto.title) + '" loading="lazy"></iframe></div>';
      html += "</section>";
    }

    html += "</div>";
    root.innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
