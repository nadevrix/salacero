import { cpSync, mkdirSync, rmSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const dist = `${root}/dist`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const files = [
  "index.html",
  "privacidad.html",
  "styles.css",
  "script.js",
  "site-config.js",
  "robots.txt",
  "sitemap.xml",
];

for (const file of files) {
  cpSync(`${root}/${file}`, `${dist}/${file}`);
}

cpSync(`${root}/public`, `${dist}/public`, { recursive: true });

// Demo restaurante (portafolio — no incluye docs internos)
const demoSrc = `${root}/gemini/mockups/demo-restaurante`;
const demoDest = `${dist}/demo/restaurante`;
const assetsSrc = `${root}/gemini/assets`;
const demoImages = [
  "demo-restaurante-hero.webp",
  "demo-restaurante-saltena.webp",
  "demo-restaurante-silpancho.webp",
  "demo-restaurante-jugo.webp",
];

mkdirSync(`${demoDest}/assets`, { recursive: true });
cpSync(`${demoSrc}/index.html`, `${demoDest}/index.html`);
cpSync(`${demoSrc}/styles.css`, `${demoDest}/styles.css`);

for (const img of demoImages) {
  cpSync(`${assetsSrc}/${img}`, `${demoDest}/assets/${img}`);
}

// Mantener assets en el mockup para preview local
const mockupAssets = `${demoSrc}/assets`;
mkdirSync(mockupAssets, { recursive: true });
for (const img of demoImages) {
  cpSync(`${assetsSrc}/${img}`, `${mockupAssets}/${img}`);
}

// Demo restaurante — plantilla profesional
const demoProSrc = `${root}/gemini/mockups/demo-restaurante-pro`;
const demoProDest = `${dist}/demo/restaurante-pro`;

cpSync(demoProSrc, demoProDest, { recursive: true });

// Demo CHANEZ STORE (catálogo ropa)
const chanezSrc = `${root}/gemini/mockups/demo-chanez`;
const chanezDest = `${dist}/demo/chanez-store`;
cpSync(chanezSrc, chanezDest, { recursive: true });

// Demo CHANEZ e-commerce (tienda + carrito + checkout)
const chanezEcomSrc = `${root}/gemini/mockups/demo-chanez-ecommerce`;
const chanezEcomDest = `${dist}/demo/chanez-ecommerce`;
cpSync(chanezEcomSrc, chanezEcomDest, { recursive: true });

// Demo JEANS CLASICON e-commerce
const jeansEcomSrc = `${root}/gemini/mockups/demo-jeans-clasicon-ecommerce`;
const jeansEcomDest = `${dist}/demo/jeans-clasicon-ecommerce`;
cpSync(jeansEcomSrc, jeansEcomDest, { recursive: true });

// Demo LEIDY FASHION e-commerce
const leidyEcomSrc = `${root}/gemini/mockups/demo-leidy-fashion-ecommerce`;
const leidyEcomDest = `${dist}/demo/leidy-fashion-ecommerce`;
cpSync(leidyEcomSrc, leidyEcomDest, { recursive: true });

// Demo Sala Cero — plantilla premium (experimento A/B)
cpSync(`${root}/demo/sala-cero-plantilla`, `${dist}/demo/sala-cero-plantilla`, { recursive: true });

// Demo Sala Cero — versión futurista interactiva
cpSync(`${root}/demo/sala-cero-futuro`, `${dist}/demo/sala-cero-futuro`, { recursive: true });
