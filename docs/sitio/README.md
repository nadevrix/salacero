# Documentación del sitio web — Sala Cero

Guías técnicas para quien mantiene o modifica la landing en producción.

**Esta carpeta puede compartirse** con colaboradores externos (freelance, dev nuevo)
sin exponer estrategia comercial.

---

## Índice

| Documento | Contenido |
|---|---|
| [`ARQUITECTURA.md`](./ARQUITECTURA.md) | Estructura de archivos, JS, SEO, deploy |
| [`MANTENIMIENTO.md`](./MANTENIMIENTO.md) | Checklist mensual para clientes en mantenimiento |
| [`IMAGE_PROMPTS.md`](./IMAGE_PROMPTS.md) | Prompts e imágenes de la marca en la web |

---

## Archivos de la web (raíz del repo)

```
index.html          Landing principal
privacidad.html     Aviso de privacidad
styles.css          Estilos
script.js           Interacciones
site-config.js      URL, teléfono, redes (editar al cambiar dominio)
public/             Logo, favicon, fuentes, imágenes WebP
```

## Comandos

```bash
npm start           # Vista local en :4173
npm run check       # Verificar sintaxis JS
npm run build       # Generar dist/ (lo que sube Render)
```

Producción: <https://sala-cero.onrender.com>

---

Estrategia y ventas (equipo): carpeta **`../salacero-interno/`** (fuera de este repo Git).
