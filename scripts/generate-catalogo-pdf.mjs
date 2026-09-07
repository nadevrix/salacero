import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const htmlPath = `${root}/public/catalogo-sala-cero.html`;
const pdfPublic = `${root}/public/catalogo-sala-cero.pdf`;
const pdfDemo = `${root}/demo/sala-cero-plantilla/catalogo-sala-cero.pdf`;
const pdfFuturo = `${root}/demo/sala-cero-futuro/catalogo-sala-cero.pdf`;

if (!existsSync(htmlPath)) {
  console.error("Falta public/catalogo-sala-cero.html — ejecutá npm run catalogo:sync primero");
  process.exit(1);
}

const chrome = ["/usr/bin/chromium", "/usr/bin/google-chrome", "/usr/bin/chromium-browser"].find(existsSync);
if (!chrome) {
  console.error("No se encontró Chromium/Chrome para generar PDF");
  process.exit(1);
}

const url = "file://" + htmlPath;
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--print-to-pdf=" + pdfPublic,
  "--print-to-pdf-no-header",
  url,
];

const r = spawnSync(chrome, args, { encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(r.status || 1);
}

copyFileSync(pdfPublic, pdfDemo);
copyFileSync(pdfPublic, pdfFuturo);
console.log("PDF generado:", pdfPublic);
console.log("Copiado a demo:", pdfDemo);
console.log("Copiado a futuro:", pdfFuturo);
