import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const html = readFileSync(`${root}/index.html`, "utf8");

const sections = [
  { id: "web", title: "Páginas y tiendas web", desc: "Se ven desde cualquier navegador. Vos comprás tu dominio donde quieras y nosotros lo configuramos sin costo." },
  { id: "sistemas", title: "Sistemas para tu negocio", desc: "Se usan desde el navegador o instalados en Windows, Linux y Mac. Empezás por la base y sumás solo los módulos que necesitás." },
  { id: "apps", title: "Apps móviles", desc: "Android y iOS. Publicar en las tiendas tiene su propio costo, que se paga a Apple y Google: unos $99 al año y $25 una sola vez." },
  { id: "otros", title: "Otros", desc: "Chatbots, automatización con inteligencia artificial y el paquete completo para vender al exterior." },
];

const blocks = html.split(/<div class="price-row" id="fila-/).slice(1);
const catalog = {
  included: [
    "6 meses de garantía: si algo deja de funcionar, lo arreglamos sin costo",
    "Capacitación a tu equipo",
    "Configuración de tu dominio",
    "Publicación y puesta en marcha",
  ],
  footnote:
    "El servidor y el mantenimiento son planes aparte y opcionales. Si preferís poner tu propio servidor, lo configuramos sin costo. Todo lo que quieras agregar después de la entrega se cotiza antes de empezar, con precio cerrado y aprobado por escrito.",
  contact: {
    phone: "+591 750 63505",
    email: "salacero.bo@gmail.com",
    city: "Santa Cruz de la Sierra, Bolivia",
    site: "https://sala-cero.onrender.com/",
  },
  categories: [],
};

for (const block of blocks) {
  const catId = block.match(/^(\w+)/)[1];
  const cat = sections.find((s) => s.id === catId);
  const products = [];
  const re = /<article class="price-card"[\s\S]*?<\/article>/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const art = m[0];
    const get = (attr) => {
      const r = art.match(new RegExp(`data-${attr}="([^"]*)"`));
      return r ? r[1] : "";
    };
    products.push({
      name: get("producto"),
      price: get("precio"),
      server: get("servidor") || "—",
      maintenance: get("mantenimiento") || "—",
      code: get("codigo") || "—",
      delivery: get("entrega"),
      desc: get("desc"),
      fix: get("arreglo") || "—",
      note: get("nota") || "",
      includes: get("incluye").split("|").filter(Boolean),
      wa: get("wa") ? decodeURIComponent(get("wa")) : "",
    });
  }
  catalog.categories.push({ id: cat.id, title: cat.title, description: cat.desc, products });
}

const out = `/**\n * Catálogo oficial Sala Cero — sincronizado desde index.html\n * Regenerar: npm run catalogo:sync\n */\nwindow.SALA_CERO_CATALOGO = ${JSON.stringify(catalog, null, 2)};\n`;

writeFileSync(`${root}/catalogo-sala-cero.js`, out);
writeFileSync(`${root}/public/catalogo-sala-cero.js`, out);
writeFileSync(`${root}/demo/sala-cero-plantilla/catalogo-sala-cero.js`, out);
writeFileSync(`${root}/demo/sala-cero-futuro/catalogo-sala-cero.js`, out);
console.log("Catálogo sincronizado:", catalog.categories.reduce((n, c) => n + c.products.length, 0), "productos");
