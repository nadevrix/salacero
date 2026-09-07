const ITEMS = [
  { id: 1, name: "Blazer Cashmere", price: 2400, img: "https://images.unsplash.com/photo-1594938298605-cd64d683eabc?w=500&q=80&fit=crop" },
  { id: 2, name: "Vestido Seda", price: 1800, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80&fit=crop" },
  { id: 3, name: "Bolso Cuero", price: 3200, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80&fit=crop" },
  { id: 4, name: "Zapato Oxford", price: 1650, img: "https://images.unsplash.com/photo-1614252238956-bcfd4f8d4e8e?w=500&q=80&fit=crop" },
];
let bag = [];

document.getElementById("grid").innerHTML = ITEMS.map(i => `
  <article class="item">
    <img src="${i.img}" alt="${i.name}" loading="lazy">
    <h3>${i.name}</h3>
    <p>Bs ${i.price.toLocaleString()}</p>
    <button type="button" data-id="${i.id}">Agregar a la bolsa</button>
  </article>
`).join("");

document.getElementById("grid").addEventListener("click", e => {
  if (!e.target.dataset.id) return;
  const item = ITEMS.find(x => x.id === Number(e.target.dataset.id));
  const ex = bag.find(b => b.id === item.id);
  if (ex) ex.qty++; else bag.push({ ...item, qty: 1 });
  render();
  document.getElementById("pro-cart").setAttribute("aria-hidden", "false");
});

function render() {
  const n = bag.reduce((a, b) => a + b.qty, 0);
  const t = bag.reduce((a, b) => a + b.price * b.qty, 0);
  document.getElementById("count").textContent = n;
  document.getElementById("total").textContent = "Bs " + t.toLocaleString();
  document.getElementById("items").innerHTML = bag.length ? bag.map(b =>
    `<li>${b.name} × ${b.qty} — Bs ${(b.price * b.qty).toLocaleString()}</li>`
  ).join("") : "<li class='empty'>Bolsa vacía</li>";
  document.getElementById("wa").href = "https://wa.me/59175063505?text=" + encodeURIComponent(
    "Pedido Atelier Premium:\n" + bag.map(b => `${b.name} x${b.qty}`).join("\n") + `\nTotal: Bs ${t}`
  );
}

document.getElementById("cart-btn").onclick = () => document.getElementById("pro-cart").setAttribute("aria-hidden", "false");
document.getElementById("close").onclick = () => document.getElementById("pro-cart").setAttribute("aria-hidden", "true");
