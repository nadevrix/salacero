# Gemini — zona creativa 🎨

**Solo Antigravity / Gemini trabaja acá.**  
Creatividad sí · código de producción **no**.

---

## Reglas (leer antes de tocar nada)

### ✅ Gemini SÍ puede

- Generar **imágenes** y guardarlas en `assets/`
- Escribir **ideas** en `ideas/` (markdown, moodboards, copy)
- Armar **mockups HTML** solo dentro de `mockups/` (experimentos)
- Completar la **plantilla de entrega** en `entregas/`
- Usar los prompts de `prompts/`

### ❌ Gemini NO puede

- Editar `index.html`, `styles.css`, `script.js` ni nada en la **raíz**
- Editar `public/` directamente (pasar assets por revisión humana)
- Hacer push / deploy / “integrar ya” sin que un dev lo revise
- Instalar dependencias ni crear `package.json` nuevos
- Refactorizar “para mejorar” — rompe cosas

> Si el código de Gemini fuera bueno, no existiría esta carpeta.

---

## Estructura

```
gemini/
├── README.md              ← estás acá
├── prompts/               ← prompts listos para copiar
├── assets/                ← imágenes generadas (PNG, WebP, JPG)
├── ideas/                 ← ideas de diseño, copy, layouts (solo .md)
├── mockups/               ← HTML/CSS experimental (sandbox)
└── entregas/              ← qué entregaste y dónde está
```

**Nada de esta carpeta se publica en la web.** El deploy solo sube `dist/`.

---

## Flujo de trabajo

```
1. Leo el prompt en prompts/
2. Genero imagen → guardo en assets/nombre-descriptivo.webp
3. (Opcional) Escribo idea en ideas/2026-09-06-titulo.md
4. Lleno entregas/ con lo que hice
5. Aviso al equipo por WhatsApp — NO mergeo solo
```

Un dev (Cursor / vos) revisa y, si sirve, mueve a `public/images/` o usa en demo.

---

## Marca — recordatorio rápido

| Elemento | Valor |
|---|---|
| Fondo | `#050509` near-black |
| Acentos | cyan `#29b8ff`, violet `#8248ff`, magenta `#ff3aa7` |
| Estilo | dark-glass, premium, cinematic 3D |
| Ciudad | Santa Cruz de la Sierra, Bolivia |
| Evitar | texto en imagen, logos ajenos, stock photo genérico |

Prompts completos: [`prompts/marketing.md`](./prompts/marketing.md)

---

## Prioridad esta semana

1. `assets/demo-restaurante-hero.webp` (16:9)
2. `assets/demo-restaurante-platos.webp`
3. `assets/ig-post-01-brand.webp` … hasta `ig-post-09-cta.webp` (1:1)
4. `assets/facebook-portada.webp` (820×312)
5. (Opcional) ideas en `ideas/demo-restaurante-layout.md`

---

## Mockups HTML

Si Gemini quiere proponer un front, que cree **solo** archivos nuevos en `mockups/`, por ejemplo:

```
mockups/demo-restaurante/index.html
mockups/demo-restaurante/styles.css
```

Autocontenido. Sin imports del sitio principal. Sin frameworks raros.  
Un dev revisa → si está bien, se adapta al repo real.

---

## Nombres de archivo

```
assets/demo-restaurante-hero.webp
assets/demo-tienda-hero.webp
assets/ig-post-01-brand.webp
assets/facebook-portada.webp
assets/reel-01-storyboard.png
```

Minúsculas, guiones, sin espacios, sin `final_final_v2`.

---

## Contacto

Dudas de negocio → Egnar (WhatsApp)  
Pasar a producción → dev full stack (no Gemini)
