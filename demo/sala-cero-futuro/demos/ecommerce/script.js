const PRODUCTS = [
  { id: 1, name: "Zapatilla Runner Pro", price: 650, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80&fit=crop", cat: "calzado" },
  { id: 2, name: "Reloj Smart Fit", price: 890, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80&fit=crop", cat: "accesorios" },
  { id: 3, name: "Audífonos Wireless X", price: 420, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80&fit=crop", cat: "audio" },
  { id: 4, name: "Mochila Urban", price: 280, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80&fit=crop", cat: "accesorios" },
  { id: 5, name: "Camiseta Premium", price: 120, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&fit=crop", cat: "ropa" },
  { id: 6, name: "Gorra Classic", price: 85, img: "https://images.unsplash.com/photo-1588850561407-ed78c036e952?w=500&q=80&fit=crop", cat: "ropa" },
];

let cart = [];

function renderProducts(filter = "") {
  const grid = document.getElementById("product-grid");
  const q = filter.toLowerCase();
  grid.innerHTML = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).map(p => `
    <article class="product-card">
      <img src="${p.img}" alt="${p.name}" loading="lazy" width="400" height="400">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">Bs ${p.price}</p>
        <button type="button" class="btn btn-add" data-id="${p.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("");
  grid.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const item = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCart();
  openCart();
}

function updateCart() {
  const count = cart.reduce((n, c) => n + c.qty, 0);
  const total = cart.reduce((n, c) => n + c.price * c.qty, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = "Bs " + total;
  document.getElementById("cart-items").innerHTML = cart.length ? cart.map(c => `
    <li>
      <img src="${c.img}" alt="" width="48" height="48">
      <div><strong>${c.name}</strong><br>Bs ${c.price} × ${c.qty}</div>
      <button type="button" data-remove="${c.id}" aria-label="Quitar">✕</button>
    </li>
  `).join("") : "<li class='empty'>Carrito vacío</li>";
  document.getElementById("cart-items").querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      cart = cart.filter(c => c.id !== Number(btn.dataset.remove));
      updateCart();
    });
  });
  const waText = cart.map(c => `${c.name} x${c.qty} (Bs ${c.price * c.qty})`).join("%0A");
  document.getElementById("checkout-wa").href = waText
    ? `https://wa.me/59175063505?text=${encodeURIComponent("Hola, quiero comprar:%0A" + cart.map(c => `${c.name} x${c.qty}`).join("%0A") + "%0ATotal: Bs " + total)}`
    : "#";
}

function openCart() {
  document.getElementById("cart-panel").setAttribute("aria-hidden", "false");
  document.getElementById("cart-overlay").hidden = false;
}
function closeCart() {
  document.getElementById("cart-panel").setAttribute("aria-hidden", "true");
  document.getElementById("cart-overlay").hidden = true;
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);
document.getElementById("search").addEventListener("input", e => renderProducts(e.target.value));
renderProducts();
