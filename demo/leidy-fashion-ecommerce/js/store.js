(function () {
  "use strict";

  var STORAGE_KEY = "leidy-fashion-cart-v1";

  var IMAGE_POOL = [
    "./assets/product-urban-tee-black.webp",
    "./assets/product-polo-color.webp",
    "./assets/product-tee-white.webp",
    "./assets/product-hoodie-gray.webp",
    "./assets/hero-chanez.webp",
  ];

  var PRODUCT_SEEDS = [
    { name: "Vestido Modelo Figura", type: "vestidos", category: "mujer", price: 120, mayor: 95 },
    { name: "Vestido Modelo Sol", type: "vestidos", category: "mujer", price: 115, mayor: 90 },
    { name: "Vestido rayas blanco y negro", type: "vestidos", category: "mujer", price: 110, mayor: 88 },
    { name: "Blusa bordada roja", type: "blusas", category: "mujer", price: 75, mayor: 60 },
    { name: "Vestido estampado dama", type: "vestidos", category: "mujer", price: 105, mayor: 85 },
    { name: "Blusa casual dama", type: "blusas", category: "mujer", price: 68, mayor: 55 },
    { name: "Vestido manga corta", type: "vestidos", category: "mujer", price: 98, mayor: 78 },
    { name: "Conjunto dama mayor", type: "conjuntos", category: "mujer", price: 140, mayor: 110 },
    { name: "Vestido tienda P-14", type: "vestidos", category: "mujer", price: 100, mayor: 80 },
    { name: "Blusa estampada color", type: "blusas", category: "mujer", price: 72, mayor: 58 },
    { name: "Vestido pack mayor x3", type: "conjuntos", category: "mujer", price: 280, mayor: 230 },
    { name: "Prenda surtida dama", type: "vestidos", category: "mujer", price: 90, mayor: 72 },
  ];

  var EDITIONS = ["Figura", "Sol", "Clásico", "Nuevo", "Tienda P-14", "Surtido"];

  function buildCatalog() {
    var products = [];
    for (var i = 1; i <= 36; i += 1) {
      var seed = PRODUCT_SEEDS[(i - 1) % PRODUCT_SEEDS.length];
      var edition = EDITIONS[(i - 1) % EDITIONS.length];
      var suffix = i > PRODUCT_SEEDS.length ? " · " + edition + " " + i : "";
      products.push({
        id: "ldy-" + i,
        name: seed.name + suffix,
        price: seed.price + ((i % 5) - 2) * 3,
        mayor: seed.mayor + ((i % 4) - 1) * 2,
        category: seed.category,
        type: seed.type,
        badge: i % 8 === 0 ? "Nuevo" : i % 11 === 0 ? "Oferta" : null,
        image: IMAGE_POOL[(i - 1) % IMAGE_POOL.length],
        sizes: ["S", "M", "L", "XL"],
        desc: "Prenda para damas · Leidy Fashion Bolivia · Ventas al por mayor y menor. Consultá tallas y colores por WhatsApp.",
      });
    }
    return products;
  }

  window.CHANEZ_PRODUCTS = buildCatalog();

  function getProducts() {
    return window.CHANEZ_PRODUCTS;
  }

  function findProduct(id) {
    return getProducts().find(function (p) {
      return p.id === id;
    });
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateCartBadges();
    renderOffcanvasCart();
  }

  function cartCount() {
    return readCart().reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function cartSubtotal() {
    return readCart().reduce(function (sum, item) {
      var product = findProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function updateCartBadges() {
    var count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(count);
    });
  }

  function renderOffcanvasCart() {
    var body = document.getElementById("offcanvas-cart-body");
    if (!body) return;

    var cart = readCart();
    if (!cart.length) {
      body.innerHTML =
        '<p class="text-muted">Tu bolsa está vacía.</p>' +
        '<a href="./index.html" class="btn btn-dark w-100">Seguir comprando</a>';
      return;
    }

    var items = cart
      .map(function (item) {
        var product = findProduct(item.id);
        if (!product) return "";
        return (
          '<li class="list-group-item d-flex gap-3 align-items-center lh-sm">' +
          '<img src="' + product.image + '" alt="">' +
          '<div class="flex-grow-1">' +
          '<h6 class="my-0 text-uppercase fs-6">' + product.name + "</h6>" +
          '<small class="text-body-secondary">Talla ' + item.size + " · x" + item.qty + "</small>" +
          "</div>" +
          "<strong>" + formatBs(product.price * item.qty) + "</strong></li>"
        );
      })
      .join("");

    body.innerHTML =
      '<ul class="list-group mb-3">' +
      items +
      '<li class="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>' +
      formatBs(cartSubtotal()) +
      "</strong></li></ul>" +
      '<a href="./carrito.html" class="btn btn-outline-dark w-100 mb-2">Ver carrito</a>' +
      '<a href="./checkout.html" class="btn btn-chanez w-100">Ir a pagar</a>';
  }

  function addToCart(id, size, qty) {
    var product = findProduct(id);
    if (!product) return false;
    if (!size) return false;
    qty = Math.max(1, parseInt(qty, 10) || 1);

    var cart = readCart();
    var key = id + "::" + size;
    var existing = cart.find(function (item) {
      return item.key === key;
    });

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key: key, id: id, size: size, qty: qty });
    }

    writeCart(cart);
    return true;
  }

  function updateQty(key, qty) {
    var cart = readCart()
      .filter(function (item) {
        if (item.key !== key) return true;
        return qty > 0;
      })
      .map(function (item) {
        if (item.key === key) item.qty = qty;
        return item;
      });
    writeCart(cart);
  }

  function removeItem(key) {
    writeCart(
      readCart().filter(function (item) {
        return item.key !== key;
      })
    );
  }

  function formatBs(amount) {
    return "Bs " + Math.max(0, amount).toFixed(0);
  }

  function productUrl(id) {
    return "./producto.html?id=" + encodeURIComponent(id);
  }

  function renderProductCard(product) {
    var badge = product.badge
      ? '<span class="badge badge-chanez product-badge">' + product.badge + "</span>"
      : "";

    return (
      '<div class="col-6 col-md-4 col-lg-3">' +
      '<div class="product-item image-zoom-effect link-effect h-100">' +
      '<div class="image-holder position-relative">' +
      badge +
      '<a href="' + productUrl(product.id) + '">' +
      '<img src="' + product.image + '" alt="' + product.name + '" class="product-image img-fluid" loading="lazy">' +
      "</a>" +
      '<div class="product-content">' +
      '<h5 class="text-uppercase fs-6 mt-3 mb-1">' +
      '<a href="' + productUrl(product.id) + '" class="text-dark text-decoration-none">' + product.name + "</a></h5>" +
      '<p class="small text-muted mb-2">' + product.type + " · " + product.category + "</p>" +
      '<button type="button" class="btn btn-link p-0 text-decoration-none text-dark text-uppercase small fw-semibold" data-quick-add="' + product.id + '">' +
      '<span data-after="Agregar">' + formatBs(product.price) + " · Mayor " + formatBs(product.mayor) + "</span></button>" +
      "</div></div></div></div>"
    );
  }

  function bindQuickAdd(root) {
    (root || document).querySelectorAll("[data-quick-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-quick-add");
        var product = findProduct(id);
        if (!product) return;
        addToCart(id, product.sizes[1] || product.sizes[0], 1);
        var offcanvasEl = document.getElementById("offcanvasCart");
        if (offcanvasEl && window.bootstrap) {
          window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).show();
        }
      });
    });
  }

  function initShopPage() {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;

    var filters = { category: "all", type: "all", q: "" };
    var countEl = document.getElementById("shop-count");

    function filteredProducts() {
      return getProducts().filter(function (p) {
        if (filters.category !== "all" && p.category !== filters.category) return false;
        if (filters.type !== "all" && p.type !== filters.type) return false;
        if (filters.q && p.name.toLowerCase().indexOf(filters.q) === -1) return false;
        return true;
      });
    }

    function renderGrid() {
      var products = filteredProducts();
      if (countEl) countEl.textContent = String(products.length) + " productos";
      grid.innerHTML =
        products.map(renderProductCard).join("") ||
        '<div class="col-12"><div class="empty-state"><p>No hay productos con esos filtros.</p></div></div>';
      bindQuickAdd(grid);
    }

    document.querySelectorAll("[data-filter-category]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) {
          filters.category = input.value;
          renderGrid();
        }
      });
    });

    document.querySelectorAll("[data-filter-type]").forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) {
          filters.type = input.value;
          renderGrid();
        }
      });
    });

    document.querySelectorAll("[data-filter-chip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chip = btn.getAttribute("data-filter-chip");
        filters.type = chip === "all" ? "all" : chip;
        document.querySelectorAll("[data-filter-chip]").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        var typeAll = document.getElementById("type-all");
        if (typeAll) typeAll.checked = filters.type === "all";
        renderGrid();
      });
    });

    var search = document.getElementById("shop-search");
    if (search) {
      search.addEventListener("input", function () {
        filters.q = search.value.trim().toLowerCase();
        renderGrid();
      });
    }

    renderGrid();
  }

  function initProductPage() {
    var root = document.getElementById("product-root");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var product = findProduct(id);

    if (!product) {
      root.innerHTML =
        '<div class="empty-state"><p>Producto no encontrado.</p><a href="./index.html" class="btn btn-chanez">Volver a la tienda</a></div>';
      return;
    }

    document.title = product.name + " — Leidy Fashion Bolivia";

    var sizesHtml = product.sizes
      .map(function (size, index) {
        return (
          '<button type="button" class="size-btn' +
          (index === 1 || product.sizes.length === 1 ? " active" : "") +
          '" data-size="' +
          size +
          '">' +
          size +
          "</button>"
        );
      })
      .join(" ");

    var related = getProducts()
      .filter(function (p) {
        return p.type === product.type && p.id !== product.id;
      })
      .slice(0, 4);

    root.innerHTML =
      '<nav aria-label="breadcrumb" class="mb-4"><ol class="breadcrumb">' +
      '<li class="breadcrumb-item"><a href="./index.html">Tienda</a></li>' +
      '<li class="breadcrumb-item active">' + product.name + "</li></ol></nav>" +
      '<div class="row g-5 align-items-start mb-5">' +
      '<div class="col-lg-6"><div class="pdp-gallery border"><img src="' + product.image + '" alt="' + product.name + '"></div></div>' +
      '<div class="col-lg-6">' +
      (product.badge ? '<span class="badge badge-chanez mb-2">' + product.badge + "</span>" : "") +
      '<p class="text-uppercase small text-muted mb-1">' + product.type + " · " + product.category + "</p>" +
      '<h1 class="display-6 text-uppercase fw-bold">' + product.name + "</h1>" +
      '<p class="text-muted">' + product.desc + "</p>" +
      '<p class="fs-3 fw-bold mb-0">' + formatBs(product.price) + '</p>' +
      '<p class="text-muted">Precio mayor: ' + formatBs(product.mayor) + "</p>" +
      '<div class="my-4"><label class="form-label fw-semibold text-uppercase small">Talla</label><div class="d-flex flex-wrap gap-2" id="size-list">' +
      sizesHtml +
      "</div></div>" +
      '<div class="mb-4"><label class="form-label fw-semibold text-uppercase small">Cantidad</label><div class="qty-control"><button type="button" id="qty-minus">−</button><input id="qty-input" type="number" min="1" value="1" aria-label="Cantidad"><button type="button" id="qty-plus">+</button></div></div>' +
      '<div class="d-flex flex-wrap gap-2">' +
      '<button type="button" class="btn btn-chanez btn-lg text-uppercase" id="add-to-cart">Agregar al carrito</button>' +
      '<a class="btn btn-outline-dark btn-lg text-uppercase" href="./carrito.html">Ver carrito</a>' +
      "</div></div></div>" +
      (related.length
        ? '<section class="border-top pt-5"><h2 class="h5 text-uppercase mb-4">También te puede gustar</h2><div class="row g-4">' +
          related.map(renderProductCard).join("") +
          "</div></section>"
        : "");

    var selectedSize = product.sizes[1] || product.sizes[0];
    var qtyInput = document.getElementById("qty-input");

    document.querySelectorAll("[data-size]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-size]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        selectedSize = btn.getAttribute("data-size");
      });
    });

    document.getElementById("qty-minus").addEventListener("click", function () {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
    });
    document.getElementById("qty-plus").addEventListener("click", function () {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) + 1);
    });

    document.getElementById("add-to-cart").addEventListener("click", function () {
      addToCart(product.id, selectedSize, qtyInput.value);
      window.location.href = "./carrito.html";
    });

    bindQuickAdd(root);
  }

  function initCartPage() {
    var root = document.getElementById("cart-root");
    if (!root) return;

    var cart = readCart();

    if (!cart.length) {
      root.innerHTML =
        '<div class="empty-state"><h2 class="h4 text-uppercase">Tu carrito está vacío</h2><p>Explorá la tienda y agregá productos.</p><a href="./index.html" class="btn btn-dark">Ir a la tienda</a></div>';
      return;
    }

    var rows = cart
      .map(function (item) {
        var product = findProduct(item.id);
        if (!product) return "";
        var line = product.price * item.qty;
        return (
          "<tr>" +
          '<td><img src="' + product.image + '" alt="" width="72" height="72" style="object-fit:cover;border-radius:6px"></td>' +
          "<td><strong class=\"text-uppercase\">" + product.name + "</strong><br><small class=\"text-muted\">Talla " + item.size + "</small></td>" +
          '<td><div class="qty-control"><button type="button" data-qty-minus="' + item.key + '">−</button><input value="' + item.qty + '" data-qty-input="' + item.key + '" aria-label="Cantidad"><button type="button" data-qty-plus="' + item.key + '">+</button></div></td>' +
          "<td>" + formatBs(product.price) + "</td>" +
          "<td><strong>" + formatBs(line) + "</strong></td>" +
          '<td><button class="btn btn-sm btn-link text-danger" data-remove="' + item.key + '">Quitar</button></td>' +
          "</tr>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="table-responsive bg-white border p-3">' +
      '<table class="table align-middle mb-0"><thead><tr><th></th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div><div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">' +
      '<a href="./index.html" class="btn btn-outline-dark">Seguir comprando</a>' +
      '<div class="text-end"><p class="mb-2">Subtotal: <strong id="cart-subtotal">' + formatBs(cartSubtotal()) + "</strong></p>" +
      '<a href="./checkout.html" class="btn btn-chanez btn-lg text-uppercase">Ir a pagar</a></div></div>';

    root.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeItem(btn.getAttribute("data-remove"));
        initCartPage();
      });
    });

    root.querySelectorAll("[data-qty-minus]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-qty-minus");
        var input = root.querySelector('[data-qty-input="' + key + '"]');
        updateQty(key, Math.max(1, parseInt(input.value, 10) - 1));
        initCartPage();
      });
    });

    root.querySelectorAll("[data-qty-plus]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-qty-plus");
        var input = root.querySelector('[data-qty-input="' + key + '"]');
        updateQty(key, parseInt(input.value, 10) + 1);
        initCartPage();
      });
    });
  }

  function initCheckoutPage() {
    var summary = document.getElementById("checkout-summary");
    var form = document.getElementById("checkout-form");
    if (!summary || !form) return;

    var cart = readCart();
    if (!cart.length) {
      summary.innerHTML =
        '<div class="empty-state"><p>No hay productos para pagar.</p><a href="./index.html" class="btn btn-dark">Ir a la tienda</a></div>';
      form.hidden = true;
      return;
    }

    var lines = cart
      .map(function (item) {
        var product = findProduct(item.id);
        if (!product) return "";
        return (
          '<li class="d-flex justify-content-between mb-2"><span class="small">' +
          product.name +
          " (" +
          item.size +
          ") x" +
          item.qty +
          '</span><strong class="small">' +
          formatBs(product.price * item.qty) +
          "</strong></li>"
        );
      })
      .join("");

    summary.innerHTML =
      '<div class="bg-white border p-4"><h2 class="h6 text-uppercase mb-3">Resumen del pedido</h2><ul class="list-unstyled mb-3">' +
      lines +
      '</ul><hr><div class="d-flex justify-content-between"><span>Total</span><strong id="checkout-total">' +
      formatBs(cartSubtotal()) +
      "</strong></div>" +
      '<p class="small text-muted mt-3 mb-0">Al confirmar se abre WhatsApp con tu pedido. En producción aquí irían pagos QR o tarjeta.</p></div>';

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.nombre.value.trim();
      var phone = form.elements.telefono.value.trim();
      var city = form.elements.ciudad.value.trim();
      var address = form.elements.direccion.value.trim();
      var payment = form.querySelector('input[name="pago"]:checked');
      if (!name || !phone || !city || !address || !payment) return;

      var details = cart
        .map(function (item) {
          var product = findProduct(item.id);
          if (!product) return "";
          return "- " + product.name + " (" + item.size + ") x" + item.qty + " = " + formatBs(product.price * item.qty);
        })
        .join("%0A");

      var msg =
        "Hola Leidy Fashion Bolivia, quiero confirmar mi pedido:%0A%0A" +
        details +
        "%0A%0ATotal: " +
        formatBs(cartSubtotal()) +
        "%0A%0ANombre: " +
        encodeURIComponent(name) +
        "%0ATel: " +
        encodeURIComponent(phone) +
        "%0ACiudad: " +
        encodeURIComponent(city) +
        "%0ADirección: " +
        encodeURIComponent(address) +
        "%0APago: " +
        encodeURIComponent(payment.value);

      window.open("https://wa.me/?text=" + msg, "_blank", "noopener,noreferrer");
    });

    document.querySelectorAll(".payment-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        document.querySelectorAll(".payment-pill").forEach(function (p) {
          p.classList.remove("active");
        });
        pill.classList.add("active");
        pill.querySelector("input").checked = true;
      });
    });
  }

  window.ChanezStore = {
    addToCart: addToCart,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    formatBs: formatBs,
    findProduct: findProduct,
    renderProductCard: renderProductCard,
  };

  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadges();
    renderOffcanvasCart();
    initShopPage();
    initProductPage();
    initCartPage();
    initCheckoutPage();
  });
})();
