const PRODUCTS = [
  { id: 1, name: "Polera Oversize", price: 95, cat: "ropa", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&fit=crop" },
  { id: 2, name: "Jean Slim", price: 180, cat: "ropa", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80&fit=crop" },
  { id: 3, name: "Zapatilla Street", price: 320, cat: "calzado", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80&fit=crop" },
  { id: 4, name: "Sandalia Verano", price: 140, cat: "calzado", img: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80&fit=crop" },
  { id: 5, name: "Gorra Logo", price: 65, cat: "accesorios", img: "https://images.unsplash.com/photo-1588850561407-ed78c036e952?w=500&q=80&fit=crop" },
  { id: 6, name: "Riñonera", price: 110, cat: "accesorios", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80&fit=crop" },
  { id: 7, name: "Hoodie Premium", price: 220, cat: "ropa", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80&fit=crop" },
  { id: 8, name: "Reloj Casual", price: 450, cat: "accesorios", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80&fit=crop" },
];

let order = [];
let activeCat = "all";

function render() {
  const q = document.getElementById("search").value.toLowerCase();
  const grid = document.getElementById("grid");
  grid.innerHTML = PRODUCTS.filter(p =>
    (activeCat === "all" || p.cat === activeCat) && p.name.toLowerCase().includes(q)
  ).map(p => {
    const inOrder = order.find(o => o.id === p.id);
    return `<article class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <span class="cat-label">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="price">Bs ${p.price}</p>
        <button type="button" data-add="${p.id}">${inOrder ? `En pedido (${inOrder.qty})` : "+ Agregar al pedido"}</button>
      </div>
    </article>`;
  }).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.add);
      const ex = order.find(o => o.id === id);
      if (ex) ex.qty++; else order.push({ ...PRODUCTS.find(p => p.id === id), qty: 1 });
      updateOrder();
      render();
    });
  });
}

function updateOrder() {
  const count = order.reduce((n, o) => n + o.qty, 0);
  const total = order.reduce((n, o) => n + o.price * o.qty, 0);
  document.getElementById("order-count").textContent = count;
  document.getElementById("order-summary").textContent = count + " producto" + (count !== 1 ? "s" : "");
  document.getElementById("order-total").textContent = "Bs " + total;
  document.getElementById("order-bar").hidden = count === 0;
  const text = order.map(o => `${o.name} x${o.qty} — Bs ${o.price * o.qty}`).join("\n") + `\nTotal: Bs ${total}`;
  document.getElementById("wa-link").href = "https://wa.me/59175063505?text=" + encodeURIComponent("Hola, quiero pedir:\n" + text);
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("filters").addEventListener("click", e => {
  if (e.target.dataset.cat) {
    activeCat = e.target.dataset.cat;
    document.querySelectorAll(".filters button").forEach(b => b.classList.toggle("active", b.dataset.cat === activeCat));
    render();
  }
});
render();
