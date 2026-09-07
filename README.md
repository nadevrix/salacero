# Sala Cero — sitio web

Landing estática en producción: <https://sala-cero.onrender.com>

## Vista local

```bash
npm start
```

Abre `http://localhost:4173`.

## Documentación

| Qué | Dónde |
|---|---|
| Doc técnica (arquitectura, deploy) | [`docs/sitio/`](./docs/sitio/) — en Git |
| **Doc interna (estrategia, ventas, CHANEZ, redes)** | **`../salacero-interno/`** — fuera de Git, al lado de este repo |

> La doc interna no va a GitHub ni a Render. Cada integrante debe tener la carpeta
> `salacero-interno` en su máquina (copiar desde Drive o repo privado aparte).

## Deploy

Push a `main` → Render ejecuta `npm run build` → publica solo `dist/` (HTML, CSS, JS, `public/`).

## Antes de cambiar dominio o contacto

Editar `site-config.js` y buscar la URL antigua en `index.html`, `sitemap.xml`, `robots.txt`
y el schema JSON-LD.

Detalle completo: [`docs/sitio/ARQUITECTURA.md`](./docs/sitio/ARQUITECTURA.md)

## Zona Gemini (creatividad)

Imágenes, ideas y mockups experimentales: [`gemini/README.md`](./gemini/README.md)  
**No toca código de producción.**
