(function () {
  "use strict";

  var STORAGE_KEY = "chanez-cart-v1";

  var IMAGE_POOL = [
    "./assets/product-urban-tee-black.webp",
    "./assets/product-polo-color.webp",
    "./assets/product-tee-white.webp",
    "./assets/product-hoodie-gray.webp",
    "./assets/hero-chanez.webp",
  ];

  var PRODUCT_SEEDS = [
    { name: "Polera urbana negra", type: "poleras", category: "hombre", subtype: "poleras", price: 45, mayor: 35 },
    { name: "Polo casual surtido", type: "polos", category: "mujer", subtype: "polos", price: 55, mayor: 42 },
    { name: "Polera blanca deportiva", type: "poleras", category: "hombre", subtype: "poleras", price: 40, mayor: 32 },
    { name: "Buzo urbano gris", type: "buzos", category: "hombre", subtype: "buzos", price: 85, mayor: 68 },
    { name: "Short cargo street", type: "shorts", category: "hombre", subtype: "shorts", price: 65, mayor: 52 },
    { name: "Gorra snapback logo", type: "accesorios", category: "unisex", subtype: "gorras", price: 35, mayor: 28 },
    { name: "Polera oversize print", type: "poleras", category: "mujer", subtype: "poleras", price: 48, mayor: 38 },
    { name: "Polo clásico mujer", type: "polos", category: "mujer", subtype: "polos", price: 50, mayor: 38 },
    { name: "Buzo crop premium", type: "buzos", category: "mujer", subtype: "buzos", price: 78, mayor: 62 },
    { name: "Jogger urban fit", type: "shorts", category: "unisex", subtype: "shorts", price: 72, mayor: 58 },
    { name: "Mochila urbana daypack", type: "accesorios", category: "unisex", subtype: "mochilas", price: 95, mayor: 78 },
    { name: "Cartera street crossbody", type: "accesorios", category: "mujer", subtype: "carteras", price: 68, mayor: 54 },
    { name: "Cinturón canvas logo", type: "accesorios", category: "unisex", subtype: "cinturones", price: 32, mayor: 24 },
    { name: "Maleta travel cabin", type: "accesorios", category: "unisex", subtype: "maletas", price: 180, mayor: 145 },
    { name: "Equipo de entrenamiento pack", type: "accesorios", category: "unisex", subtype: "entrenamiento", price: 88, mayor: 70 },
    { name: "Billetera slim logo", type: "accesorios", category: "unisex", subtype: "billeteras", price: 28, mayor: 22 },
    { name: "Guantes gym grip", type: "accesorios", category: "unisex", subtype: "guantes", price: 42, mayor: 34 },
    { name: "Colchoneta training fold", type: "accesorios", category: "unisex", subtype: "colchonetas", price: 55, mayor: 44 },
    { name: "Medias street pack x6", type: "accesorios", category: "unisex", subtype: "medias", price: 30, mayor: 24 },
    { name: "Zapatilla urbana runner", type: "calzado", category: "hombre", subtype: "zapatillas", price: 210, mayor: 170 },
    { name: "Sandalia verano mujer", type: "calzado", category: "mujer", subtype: "sandalias", price: 75, mayor: 58 },
  ];

  var EDITIONS = ["Core", "Street", "Pro", "Essential", "Limited", "Classic"];
  var COLORS = ["negro", "gris", "blanco", "azul", "rosa", "beige"];

  function buildCatalog() {
    var products = [];
    for (var i = 1; i <= 72; i += 1) {
      var seed = PRODUCT_SEEDS[(i - 1) % PRODUCT_SEEDS.length];
      var edition = EDITIONS[(i - 1) % EDITIONS.length];
      var suffix = i > PRODUCT_SEEDS.length ? " · " + edition + " " + i : "";
      products.push({
        id: "chz-" + i,
        name: seed.name + suffix,
        price: seed.price + ((i % 5) - 2) * 3,
        mayor: seed.mayor + ((i % 4) - 1) * 2,
        category: seed.category,
        type: seed.type,
        subtype: seed.subtype || seed.type,
        color: COLORS[(i - 1) % COLORS.length],
        brand: "CHANEZ",
        badge: i % 4 !== 0 ? "Nuevo" : null,
        image: IMAGE_POOL[(i - 1) % IMAGE_POOL.length],
        sizes: seed.type === "accesorios" ? ["Única"] : ["S", "M", "L", "XL", "XXL"],
        desc: "Prenda urbana CHANEZ STORE. Stock sujeto a disponibilidad en Feria Barrio Lindo. Consultá tallas por WhatsApp.",
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
    renderMiniCart();
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

  function productCartTitle(product) {
    return ("CHANEZ " + product.name + " " + product.category).toUpperCase();
  }

  function formatBsMini(amount) {
    var parts = Math.max(0, Number(amount) || 0).toFixed(2).split(".");
    var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return intPart + "," + parts[1] + " Bs.";
  }

  function openMiniCart() {
    var cart = document.getElementById("mini-cart");
    var btn = document.getElementById("nav-cart-toggle");
    if (!cart) return;
    cart.hidden = false;
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  function closeMiniCart() {
    var cart = document.getElementById("mini-cart");
    var btn = document.getElementById("nav-cart-toggle");
    if (!cart) return;
    cart.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function showCartToast(name) {
    var toast = document.getElementById("cart-toast");
    if (!toast) return;
    toast.innerHTML =
      '<span class="cart-toast-check" aria-hidden="true">✓</span> Añadiste ' +
      name +
      " a tu carrito.";
    toast.hidden = false;
    clearTimeout(showCartToast.timer);
    showCartToast.timer = setTimeout(function () {
      toast.hidden = true;
    }, 4000);
  }

  function bindMiniCartActions(root) {
    root.querySelectorAll("[data-cart-qty]").forEach(function (input) {
      input.addEventListener("change", function () {
        updateQty(input.getAttribute("data-cart-qty"), Math.max(1, parseInt(input.value, 10) || 1));
      });
    });
    root.querySelectorAll("[data-cart-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeItem(btn.getAttribute("data-cart-remove"));
      });
    });
  }

  function renderMiniCart() {
    var body = document.getElementById("mini-cart-body");
    if (!body) return;

    var cart = readCart();
    var count = cartCount();
    var countLabel = count === 1 ? "1 Producto en el carrito" : count + " Productos en el carrito";

    if (!cart.length) {
      body.innerHTML =
        '<div class="mini-cart-head"><span>0 Productos en el carrito</span><strong>Subtotal del carrito: 0,00 Bs.</strong></div>' +
        '<p class="mini-cart-empty">Tu carrito está vacío.</p>' +
        '<div class="mini-cart-footer"><a class="mini-cart-edit" href="./carrito.html">Ver y editar carrito</a></div>';
      return;
    }

    var items = cart
      .map(function (item) {
        var product = findProduct(item.id);
        if (!product) return "";
        return (
          '<div class="mini-cart-item">' +
          '<img src="' + product.image + '" alt="">' +
          '<div class="mini-cart-item-info">' +
          '<p class="mini-cart-item-name">' + productCartTitle(product) + "</p>" +
          '<p class="mini-cart-item-price">' + formatBsMini(product.price * item.qty) + "</p>" +
          '<div class="mini-cart-item-actions">' +
          '<label>Cantidad: <input type="number" min="1" value="' +
          item.qty +
          '" data-cart-qty="' +
          item.key +
          '"></label>' +
          '<a class="mini-cart-icon" href="./carrito.html" aria-label="Editar carrito"><svg width="16" height="16"><use href="#gear"></use></svg></a>' +
          '<button type="button" class="mini-cart-icon" data-cart-remove="' +
          item.key +
          '" aria-label="Quitar del carrito"><svg width="16" height="16"><use href="#trash"></use></svg></button>' +
          "</div></div></div>"
        );
      })
      .join("");

    body.innerHTML =
      '<div class="mini-cart-head"><span>' +
      countLabel +
      "</span><strong>Subtotal del carrito: " +
      formatBsMini(cartSubtotal()) +
      "</strong></div>" +
      '<a class="mini-cart-checkout" href="./checkout.html">Finaliza tu compra</a>' +
      '<div class="mini-cart-list">' +
      items +
      "</div>" +
      '<div class="mini-cart-footer"><a class="mini-cart-edit" href="./carrito.html">Ver y editar carrito</a></div>';

    bindMiniCartActions(body);
  }

  function bindMiniCartToggle() {
    var wrap = document.querySelector(".nav-cart-wrap");
    var btn = document.getElementById("nav-cart-toggle");
    var cart = document.getElementById("mini-cart");
    if (!wrap || !btn || !cart) return;

    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (cart.hidden) openMiniCart();
      else closeMiniCart();
    });
    cart.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    document.addEventListener("click", function (event) {
      if (!wrap.contains(event.target)) closeMiniCart();
    });
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
    showCartToast(productCartTitle(product));
    openMiniCart();
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

  function formatBsCard(amount) {
    return Math.max(0, amount).toFixed(0) + " Bs.";
  }

  function productUrl(id) {
    return "./producto.html?id=" + encodeURIComponent(id);
  }

  function renderProductCard(product) {
    var badge = product.badge
      ? '<span class="product-badge-nuevo">' + product.badge + "</span>"
      : "";
    var title = ("CHANEZ " + product.name + " " + product.category).toUpperCase();

    return (
      '<div class="col-6 col-md-4 d-flex">' +
      '<article class="product-item w-100">' +
      '<a class="product-item-link" href="' + productUrl(product.id) + '">' +
      '<div class="image-holder">' +
      badge +
      '<img src="' + product.image + '" alt="' + product.name + '" class="product-image" loading="lazy">' +
      "</div>" +
      '<div class="product-content">' +
      "<h5>" + title + "</h5>" +
      '<p class="product-price-main">' + formatBsCard(product.price) + "</p>" +
      "</div></a>" +
      '<button type="button" class="btn-card-comprar" data-quick-add="' + product.id + '">Comprar</button>' +
      "</article></div>"
    );
  }

  function bindQuickAdd(root) {
    (root || document).querySelectorAll("[data-quick-add]").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var id = btn.getAttribute("data-quick-add");
        var product = findProduct(id);
        if (!product) return;
        addToCart(id, product.sizes[1] || product.sizes[0], 1);
      });
    });
  }

  function initShopPage() {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;

    var filters = {
      category: "all",
      type: "all",
      subtype: "all",
      color: "all",
      size: "all",
      brand: "all",
      price: "all",
      q: "",
    };
    var countEl = document.getElementById("shop-count");
    var pageSizeEl = document.getElementById("shop-page-size");
    var paginationEl = document.getElementById("shop-pagination");
    var pageSize = pageSizeEl ? parseInt(pageSizeEl.value, 10) || 12 : 12;
    var currentPage = 1;

    function priceInRange(price, range) {
      if (range === "0-50") return price <= 50;
      if (range === "50-100") return price > 50 && price <= 100;
      if (range === "100-200") return price > 100 && price <= 200;
      if (range === "200+") return price > 200;
      return true;
    }

    function matchesFilters(product, skip) {
      if (skip !== "category" && filters.category !== "all" && product.category !== filters.category) return false;
      if (skip !== "type" && filters.type !== "all" && product.type !== filters.type) return false;
      if (skip !== "subtype" && filters.subtype !== "all" && product.subtype !== filters.subtype) return false;
      if (skip !== "color" && filters.color !== "all" && product.color !== filters.color) return false;
      if (skip !== "size" && filters.size !== "all" && product.sizes.indexOf(filters.size) === -1) return false;
      if (skip !== "brand" && filters.brand !== "all" && product.brand !== filters.brand) return false;
      if (skip !== "price" && filters.price !== "all" && !priceInRange(product.price, filters.price)) return false;
      if (filters.q && product.name.toLowerCase().indexOf(filters.q) === -1) return false;
      return true;
    }

    function filteredProducts() {
      return getProducts().filter(function (product) {
        return matchesFilters(product);
      });
    }

    function facetCount(skip, testFn) {
      return getProducts().filter(function (product) {
        return matchesFilters(product, skip) && testFn(product);
      }).length;
    }

    function filterOption(ribbon, value, label, count, selected) {
      return (
        '<button type="button" class="shop-filter-option' +
        (selected ? " is-active" : "") +
        '" data-ribbon="' +
        ribbon +
        '" data-value="' +
        value +
        '">' +
        label +
        ' <span class="shop-filter-count">(' +
        count +
        ")</span></button>"
      );
    }

    function renderOptions(menuKey, skip, ribbon, selected, options) {
      var menu = document.querySelector('[data-filter-menu="' + menuKey + '"]');
      if (!menu) return;
      menu.innerHTML = options
        .map(function (option) {
          var count = facetCount(skip, option.test);
          var isSelected = selected === option.value;
          if (count === 0 && !isSelected) return "";
          return filterOption(ribbon, option.value, option.label, count, isSelected);
        })
        .join("");
    }

    function renderFilterMenus() {
      renderOptions("category", "subtype", "subtype", filters.subtype, [
        { value: "poleras", label: "Poleras", test: function (p) { return p.subtype === "poleras"; } },
        { value: "polos", label: "Polos", test: function (p) { return p.subtype === "polos"; } },
        { value: "buzos", label: "Buzos", test: function (p) { return p.subtype === "buzos"; } },
        { value: "shorts", label: "Shorts", test: function (p) { return p.subtype === "shorts"; } },
        { value: "mochilas", label: "Mochilas", test: function (p) { return p.subtype === "mochilas"; } },
        { value: "carteras", label: "Bolsos y Carteras", test: function (p) { return p.subtype === "carteras"; } },
        { value: "billeteras", label: "Billeteras", test: function (p) { return p.subtype === "billeteras"; } },
        { value: "maletas", label: "Maletas", test: function (p) { return p.subtype === "maletas"; } },
        { value: "gorras", label: "Gorras", test: function (p) { return p.subtype === "gorras"; } },
        { value: "cinturones", label: "Cinturones", test: function (p) { return p.subtype === "cinturones"; } },
        { value: "entrenamiento", label: "Equipo de entrenamiento", test: function (p) { return p.subtype === "entrenamiento"; } },
        { value: "guantes", label: "Guantes", test: function (p) { return p.subtype === "guantes"; } },
        { value: "colchonetas", label: "Colchonetas", test: function (p) { return p.subtype === "colchonetas"; } },
        { value: "medias", label: "Medias", test: function (p) { return p.subtype === "medias"; } },
        { value: "zapatillas", label: "Zapatillas", test: function (p) { return p.subtype === "zapatillas"; } },
        { value: "sandalias", label: "Sandalias", test: function (p) { return p.subtype === "sandalias"; } },
      ]);

      renderOptions("color", "color", "color", filters.color, [
        { value: "negro", label: "Negro", test: function (p) { return p.color === "negro"; } },
        { value: "gris", label: "Gris", test: function (p) { return p.color === "gris"; } },
        { value: "blanco", label: "Blanco", test: function (p) { return p.color === "blanco"; } },
        { value: "azul", label: "Azul", test: function (p) { return p.color === "azul"; } },
        { value: "rosa", label: "Rosa", test: function (p) { return p.color === "rosa"; } },
        { value: "beige", label: "Beige", test: function (p) { return p.color === "beige"; } },
      ]);

      renderOptions("size", "size", "size", filters.size, [
        { value: "S", label: "S", test: function (p) { return p.sizes.indexOf("S") !== -1; } },
        { value: "M", label: "M", test: function (p) { return p.sizes.indexOf("M") !== -1; } },
        { value: "L", label: "L", test: function (p) { return p.sizes.indexOf("L") !== -1; } },
        { value: "XL", label: "XL", test: function (p) { return p.sizes.indexOf("XL") !== -1; } },
        { value: "XXL", label: "XXL", test: function (p) { return p.sizes.indexOf("XXL") !== -1; } },
        { value: "Única", label: "Única", test: function (p) { return p.sizes.indexOf("Única") !== -1; } },
      ]);

      renderOptions("gender", "category", "category", filters.category, [
        { value: "hombre", label: "Hombre", test: function (p) { return p.category === "hombre"; } },
        { value: "mujer", label: "Mujer", test: function (p) { return p.category === "mujer"; } },
        { value: "unisex", label: "Unisex", test: function (p) { return p.category === "unisex"; } },
      ]);

      renderOptions("brand", "brand", "brand", filters.brand, [
        { value: "CHANEZ", label: "CHANEZ", test: function (p) { return p.brand === "CHANEZ"; } },
      ]);

      renderOptions("ropa", "type", "type", filters.type, [
        { value: "poleras", label: "Poleras", test: function (p) { return p.type === "poleras"; } },
        { value: "polos", label: "Polos", test: function (p) { return p.type === "polos"; } },
        { value: "buzos", label: "Buzos", test: function (p) { return p.type === "buzos"; } },
        { value: "shorts", label: "Shorts", test: function (p) { return p.type === "shorts"; } },
      ]);

      renderOptions("accesorios", "subtype", "subtype", filters.subtype, [
        { value: "mochilas", label: "Mochilas", test: function (p) { return p.subtype === "mochilas"; } },
        { value: "carteras", label: "Bolsos y Carteras", test: function (p) { return p.subtype === "carteras"; } },
        { value: "billeteras", label: "Billeteras", test: function (p) { return p.subtype === "billeteras"; } },
        { value: "maletas", label: "Maletas", test: function (p) { return p.subtype === "maletas"; } },
        { value: "gorras", label: "Gorras", test: function (p) { return p.subtype === "gorras"; } },
        { value: "cinturones", label: "Cinturones", test: function (p) { return p.subtype === "cinturones"; } },
        { value: "entrenamiento", label: "Equipo de entrenamiento", test: function (p) { return p.subtype === "entrenamiento"; } },
        { value: "guantes", label: "Guantes", test: function (p) { return p.subtype === "guantes"; } },
        { value: "colchonetas", label: "Colchonetas", test: function (p) { return p.subtype === "colchonetas"; } },
        { value: "medias", label: "Medias", test: function (p) { return p.subtype === "medias"; } },
      ]);

      renderOptions("price", "price", "price", filters.price, [
        { value: "0-50", label: "Hasta 50 Bs.", test: function (p) { return p.price <= 50; } },
        { value: "50-100", label: "51 a 100 Bs.", test: function (p) { return p.price > 50 && p.price <= 100; } },
        { value: "100-200", label: "101 a 200 Bs.", test: function (p) { return p.price > 100 && p.price <= 200; } },
        { value: "200+", label: "Más de 200 Bs.", test: function (p) { return p.price > 200; } },
      ]);
    }

    function renderPagination(pages) {
      if (!paginationEl) return;
      var html = "";
      var i;
      for (i = 1; i <= pages; i += 1) {
        html +=
          '<button type="button" class="shop-page-btn' +
          (i === currentPage ? " active" : "") +
          '" data-page="' +
          i +
          '">' +
          i +
          "</button>";
      }
      if (currentPage < pages) {
        html +=
          '<button type="button" class="shop-page-btn" data-page="' +
          (currentPage + 1) +
          '" aria-label="Siguiente">&gt;</button>';
      }
      paginationEl.innerHTML = html;
      paginationEl.querySelectorAll("[data-page]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          currentPage = parseInt(btn.getAttribute("data-page"), 10) || 1;
          renderGrid();
          var catalog = document.getElementById("tienda");
          if (catalog) catalog.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function renderGrid() {
      var products = filteredProducts();
      var pages = Math.max(1, Math.ceil(products.length / pageSize));
      if (currentPage > pages) currentPage = pages;
      var start = (currentPage - 1) * pageSize;
      var pageItems = products.slice(start, start + pageSize);
      if (countEl) countEl.textContent = String(products.length) + " productos";
      grid.innerHTML =
        pageItems.map(renderProductCard).join("") ||
        '<div class="col-12"><div class="empty-state"><p>No hay productos con esos filtros.</p></div></div>';
      bindQuickAdd(grid);
      renderPagination(pages);
      renderFilterMenus();
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
        currentPage = 1;
        document.querySelectorAll("[data-filter-chip]").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        renderGrid();
      });
    });

    function applyRibbonFilter(option) {
      var key = option.getAttribute("data-ribbon");
      var value = option.getAttribute("data-value");
      if (!key) return;
      filters[key] = filters[key] === value ? "all" : value;
      if (key === "subtype") {
        var accessoryTypes = {
          mochilas: 1,
          carteras: 1,
          billeteras: 1,
          maletas: 1,
          gorras: 1,
          cinturones: 1,
          entrenamiento: 1,
          guantes: 1,
          colchonetas: 1,
          medias: 1,
        };
        var clothingTypes = { poleras: 1, polos: 1, buzos: 1, shorts: 1 };
        var footwearTypes = { zapatillas: 1, sandalias: 1 };
        if (filters.subtype === "all") {
          filters.type = "all";
        } else if (accessoryTypes[filters.subtype]) {
          filters.type = "accesorios";
        } else if (clothingTypes[filters.subtype]) {
          filters.type = filters.subtype;
        } else if (footwearTypes[filters.subtype]) {
          filters.type = "calzado";
        }
      }
      if (key === "type") filters.subtype = "all";
      currentPage = 1;
      renderGrid();
    }

    document.querySelectorAll(".shop-filter-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var item = btn.closest(".shop-filter-item");
        if (!item) return;
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".shop-filter-item.open").forEach(function (el) {
          el.classList.remove("open");
        });
        if (!isOpen) item.classList.add("open");
      });
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest(".shop-filter-item")) return;
      document.querySelectorAll(".shop-filter-item.open").forEach(function (el) {
        el.classList.remove("open");
      });
    });

    document.querySelectorAll(".shop-filter-menu").forEach(function (menu) {
      menu.addEventListener("click", function (event) {
        event.stopPropagation();
        var option = event.target.closest("[data-ribbon]");
        if (option) applyRibbonFilter(option);
        var item = menu.closest(".shop-filter-item");
        if (item) item.classList.remove("open");
      });
    });

    function applySearch(value) {
      filters.q = value.trim().toLowerCase();
      currentPage = 1;
      renderGrid();
    }

    var search = document.getElementById("shop-search");
    var navSearch = document.getElementById("nav-search");
    if (search) {
      search.addEventListener("input", function () {
        applySearch(search.value);
        if (navSearch) navSearch.value = search.value;
      });
    }
    if (navSearch) {
      navSearch.addEventListener("input", function () {
        applySearch(navSearch.value);
        if (search) search.value = navSearch.value;
      });
      if (navSearch.form) {
        navSearch.form.addEventListener("submit", function (event) {
          event.preventDefault();
        });
      }
    }

    document.querySelectorAll("[data-nav-category], [data-nav-type], [data-nav-subtype], [data-nav-q]").forEach(function (link) {
      link.addEventListener("click", function () {
        filters.category = link.getAttribute("data-nav-category") || "all";
        filters.type = link.getAttribute("data-nav-type") || "all";
        filters.subtype = link.getAttribute("data-nav-subtype") || "all";
        filters.q = (link.getAttribute("data-nav-q") || "").toLowerCase();
        filters.color = "all";
        filters.size = "all";
        filters.brand = "all";
        filters.price = "all";
        currentPage = 1;
        renderGrid();
      });
    });

    if (pageSizeEl) {
      pageSizeEl.addEventListener("change", function () {
        pageSize = parseInt(pageSizeEl.value, 10) || 12;
        currentPage = 1;
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

    document.title = product.name + " — CHANEZ STORE";

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

    document.getElementById("add-to-cart").addEventListener("click", function (event) {
      event.stopPropagation();
      addToCart(product.id, selectedSize, qtyInput.value);
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
        "Hola CHANEZ STORE, quiero confirmar mi pedido:%0A%0A" +
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

      window.open("https://wa.me/59169297946?text=" + msg, "_blank", "noopener,noreferrer");
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
    renderMiniCart();
    bindMiniCartToggle();
    initShopPage();
    initProductPage();
    initCartPage();
    initCheckoutPage();
  });
})();
