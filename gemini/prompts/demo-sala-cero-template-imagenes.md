# Imágenes — Demo Sala Cero plantilla

**Proyecto:** mockup A/B en `gemini/mockups/demo-sala-cero-template/`  
**Plantilla base:** FoxyMoron Agency (tema oscuro)  
**Objetivo:** reemplazar fotos Unsplash por imágenes propias estilo Sala Cero.

> **Importante:** las demos de tiendas (CHANEZ, Jeans, Leidy) son **prospectos para reuniones**, no clientes pagos. No generar imágenes con esas marcas ni usarlas como “portafolio vendido”.

---

## Reglas globales (aplicar a TODAS las imágenes)

```text
Brand: Sala Cero, digital studio, Santa Cruz de la Sierra, Bolivia.
Palette: near-black #050509, cyan #29b8ff, violet #8248ff, magenta #ff3aa7, orange #ff921e.
Style: cinematic dark-glass 3D, premium tech studio, not cartoon, not generic corporate stock.
Constraints: NO text, NO logos, NO watermarks, NO readable UI text, NO brand trademarks (WhatsApp, Apple, Google, Meta, etc.).
Output: photorealistic or high-end 3D render, web-ready, export WebP preferred.
```

**Carpeta de salida:** `gemini/assets/`  
**Nombres:** minúsculas, guiones, exactamente como indica la tabla.

---

## Checklist de entrega (6 imágenes)

| # | Archivo de salida | Ratio | Usado en |
|---|-------------------|-------|----------|
| 1 | `demo-sala-cero-hero-main.webp` | 16:9 | Hero caja grande |
| 2 | `demo-sala-cero-hero-secondary.webp` | 4:3 | Hero caja chica |
| 3 | `demo-sala-cero-equipo.webp` | 4:3 | Sección Nosotros |
| 4 | `demo-sala-cero-servicio-web.webp` | 16:9 | Tarjeta servicio web |
| 5 | `demo-sala-cero-servicio-software.webp` | 16:9 | Tarjeta servicio software |
| 6 | `demo-sala-cero-servicio-apps.webp` | 16:9 | Tarjeta servicio apps |

**Ya existe — NO regenerar:**  
`portfolio-restaurante.webp` (demo ficticio Sabor Cruceño, copiado de otro mockup).

**NO generar:** imágenes de tiendas de ropa con nombre de cliente (CHANEZ, Jeans Clasicon, Leidy Fashion).

---

## Prompts individuales

### 1 — Hero principal
**→ `demo-sala-cero-hero-main.webp` · 16:9**

Premium hero for a digital development studio in Santa Cruz, Bolivia. Developer workspace at night: multiple monitors showing abstract code and wireframes (unreadable blur), mechanical keyboard, dark desk. Near-black background #050509 with subtle cyan and violet rim lighting on screens and edges. Floating glass UI panels with soft glow. Cinematic, moody, high-end agency feel. Wide composition with subject slightly right, negative space on left for headline overlay. No faces clearly visible, no text, no logos.

### 2 — Hero secundario
**→ `demo-sala-cero-hero-secondary.webp` · 4:3**

Close-up premium shot: laptop showing abstract analytics dashboard with colorful charts and graphs (all numbers and labels blurred/unreadable). Dark environment, cyan-violet reflection on glass surface. Santa Cruz digital agency aesthetic, dark-glass style. Shallow depth of field. No text, no logos, no real app brands.

### 3 — Equipo / Nosotros
**→ `demo-sala-cero-equipo.webp` · 4:3**

Young diverse Latin American tech team collaborating around a table with laptops in a modern dark office. Warm screen glow on faces, professional but approachable, startup energy. Near-black walls with subtle cyan and magenta accent lights. 4-6 people, casual smart dress, Santa Cruz Bolivia vibe. Candid meeting moment, not cheesy stock handshake. No readable text on screens, no logos on clothing.

### 4 — Servicio web
**→ `demo-sala-cero-servicio-web.webp` · 16:9**

Abstract premium web design concept: responsive website layouts floating in 3D dark space, desktop tablet and phone frames with glowing wireframes inside (unreadable). Cyan to violet gradient edge lights on #050509 background. E-commerce and landing page mood without specific brands. Dark-glass cinematic. No text, no logos.

### 5 — Servicio software
**→ `demo-sala-cero-servicio-software.webp` · 16:9**

Business software visualization: central glowing dashboard hub connected to smaller panels (inventory, orders, CRM icons as abstract shapes only). Dark near-black studio background, data streams in cyan and violet. Modular SaaS aesthetic for small businesses in Bolivia. Premium 3D render, not clipart. No readable text, no logos.

### 6 — Servicio apps
**→ `demo-sala-cero-servicio-apps.webp` · 16:9**

Two smartphones floating in dark cinematic space showing abstract mobile app interfaces (blurred UI, no readable text). iOS and Android mood without Apple or Google logos. Soft magenta and orange accent glow, dark-glass reflections. App development studio hero image. Premium, minimal, no text, no logos.

---

## Orden de trabajo

1. Hero main → Equipo → Servicios (4, 5, 6) → Hero secondary

## Al terminar

1. Guardar los 6 archivos en `gemini/assets/`
2. Completar `gemini/entregas/` con lista de archivos generados
3. Avisar al dev para integrar en `mockups/demo-sala-cero-template/index.html`

---

## Regenerar (prompts más específicos)

### hero-secondary — REHACER
**→ `demo-sala-cero-hero-secondary.webp` · 4:3**

```text
Close-up of a MacBook-style laptop on a black glass desk, screen showing ONLY abstract blurred colorful charts — no readable numbers, no axis labels, no words at all. Heavy gaussian blur on all UI content. Dark room, rim light cyan #29b8ff and violet #8248ff on keyboard edges. Reflection on desk. Premium SaaS mood. Photorealistic. CRITICAL: zero legible text anywhere on screen.
```

### servicio-software — REHACER
**→ `demo-sala-cero-servicio-software.webp` · 16:9**

```text
Isometric 3D business software hub on pure near-black #050509 background. Central glowing hexagon processor connected by cyan and violet light pipes to 5 floating glass panels. Panels show ONLY abstract icons (box shape, people silhouettes, chart bars) — NO English words, NO labels, NO letters. Colors: cyan #29b8ff, violet #8248ff, subtle magenta. Clean premium render, not cluttered. CRITICAL: no text anywhere in image.
```

### servicio-apps — OPCIONAL (mejorar)
**→ `demo-sala-cero-servicio-apps.webp` · 16:9**

```text
Two modern smartphones floating on near-black #050509 background (NOT pink nebula, NOT space galaxy). Screens show heavily blurred colorful app tiles, no readable icons or text. Rim lighting cyan and violet matching brand. Minimal dark-glass studio, subtle floor reflection. Premium app development agency. No Apple logo, no text.
```
