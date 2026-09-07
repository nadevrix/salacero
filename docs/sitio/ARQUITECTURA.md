# Arquitectura del sitio — Sala Cero

Documentación técnica de cómo está armada la web, qué falta y cómo mantenerla.

---

## 1. Resumen

| Aspecto | Detalle |
|---|---|
| Tipo | Sitio estático (SSG manual) — sin framework, sin build |
| Stack | HTML5 + CSS3 + JavaScript vanilla (ES2020+) |
| Tipografía | IBM Plex Sans Variable, autoalojada en `public/fonts/` |
| Hosting | [Render](https://sala-cero.onrender.com) — deploy en push a `main` |
| Tamaño | ~1 HTML principal + CSS + JS + imágenes WebP |

**Ventaja:** cero dependencias de producción, carga rápida, deploy trivial.  
**Desventaja:** un solo `index.html` de ~1000 líneas; catálogo de precios embebido en HTML.

---

## 2. Mapa de archivos

```
salacero/
├── index.html              # Página principal
├── privacidad.html
├── styles.css · script.js · site-config.js
├── public/                 # Assets públicos (logo, imágenes, fuentes)
├── docs/
│   └── sitio/              # Doc técnica (esta carpeta)
├── ../salacero-interno/    # Doc comercial — FUERA de Git (carpeta hermana)
├── marca/                  # Assets redes — NO se despliega
├── scripts/prepare-deploy.mjs
└── dist/                   # Generado por npm run build → Render publica esto
```

---

## 3. Flujo de datos y configuración

### 3.1 `site-config.js` — editar primero

Un solo archivo con datos que cambian:

```js
window.SALA_CERO = {
  siteUrl, email, phoneDisplay, phoneWa,
  city, social: { facebook, instagram, linkedin }
}
```

**Cuando compren dominio:** cambiar `siteUrl` y luego buscar/reemplazar en:
- `index.html` (canonical, og:url, schema.org)
- `sitemap.xml`
- `robots.txt`

> Hoy el schema y los enlaces del footer están duplicados en HTML y en `site-config.js`.
> Próximo paso opcional: generar schema desde JS al cargar (no crítico).

### 3.2 Catálogo de precios

Los 18+ productos viven como `<article class="price-card">` en `index.html` con **data attributes**:

| Atributo | Ejemplo | Uso |
|---|---|---|
| `data-producto` | Web Express | Título del modal |
| `data-precio` | Bs 990 | Precio mostrado |
| `data-entrega` | 2 días | Plazo |
| `data-mantenimiento` | Bs 70 | Plan mensual |
| `data-incluye` | Item1\|Item2 | Lista separada por `\|` |
| `data-wa` | Hola%20Sala%20Cero… | Mensaje WhatsApp prellenado |

`script.js` lee estos atributos y abre el `<dialog>` de ficha técnica.

**Para agregar un producto:** copiar un `<article class="price-card">` existente y cambiar los `data-*`.

### 3.3 Formulario de contacto

- Envía a **WhatsApp** (no hay backend)
- `data-whatsapp="59175063505"` en el `<form>`
- `script.js` construye el mensaje y abre `wa.me`

### 3.4 Imágenes

- Formato principal: **WebP**
- Rutas: `./public/images/*.webp`
- Prompts documentados en [`IMAGE_PROMPTS.md`](./IMAGE_PROMPTS.md)
- Hero precargado con `<link rel="preload">` para LCP

---

## 4. JavaScript — módulos en `script.js`

| Bloque | Líneas aprox. | Función |
|---|---|---|
| Capture mode | 1–5 | `?capture` para screenshots de marketing |
| Header + scroll | 7–23 | Barra de progreso, sombra al scroll |
| Menú móvil | 25–43 | Toggle + Escape |
| Reveal animations | 45–60 | IntersectionObserver |
| Hero parallax | 62–76 | Solo desktop, pointer fine |
| Partículas canvas | 78–146 | Animación hero (respeta reduced-motion) |
| Spotlight cards | 148–154 | Efecto luz en tarjetas |
| Formulario WA | 156–190 | Submit → WhatsApp |
| Año footer | 192–193 | `data-year` dinámico |
| Carrusel precios | 195–220 | Scroll horizontal por categoría |
| Modal ficha | 222–289 | Dialog con datos del producto |

**Sin bundler.** Todo corre en el navegador tal cual.

---

## 5. CSS — organización

| Sección | Contenido |
|---|---|
| `:root` | Variables de color, gradiente, `--max`, `--pad` |
| Layout | Header, hero, secciones `.section` |
| Componentes | `.button`, `.price-card`, `.service-card`, `.pd` (modal) |
| Animaciones | `.reveal`, ticker, partículas |
| Responsive | Breakpoints ~820px y ~640px |
| Legal | `.legal-page` para privacidad |

Dark mode fijo (`color-scheme: dark`). No hay tema claro.

---

## 6. SEO y datos estructurados

### Implementado (sept 2026)

- Meta description con ubicación + precio desde
- Keywords locales
- Geo tags (`geo.region`, `geo.placename`)
- Open Graph + Twitter Cards
- Schema.org `@graph`: `WebSite` + `Organization` + `ProfessionalService`
- `sameAs`: Facebook, Instagram, LinkedIn
- `openingHoursSpecification`: lun–sáb 08:00–20:00
- `sitemap.xml` con `/` y `/privacidad.html`
- Enlaces `rel="me"` en footer (verificación de identidad)

### Pendiente (requiere acción manual)

| Tarea | Quién | Costo |
|---|---|---|
| Google Search Console — verificar propiedad | Egnar | Gratis |
| Google Business Profile | Egnar | Gratis |
| Analítica (Plausible o GA4) | Dev | Gratis tier |
| Dominio propio + 301 desde Render | Rodrigo | ~Bs 120/año |
| Backlinks locales (directorios BO) | Marketing | Gratis |

---

## 7. Seguridad y headers

`render.yaml` define:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (sin cámara/mic/geo)
- Cache largo para imágenes

> `vercel.json` quedó del hosting anterior. No aplica en Render; no borrar hasta migrar definitivamente.

---

## 8. Desarrollo local

```bash
npm start          # python3 -m http.server 4173
npm run check      # node --check script.js && node --check site-config.js
```

Abrir `http://localhost:4173`

Modo captura para marketing: `?capture&section=hero`

---

## 9. Deploy

1. Push a `main` en GitHub (`nadevrix/salacero`)
2. Render ejecuta `npm run build` → genera `dist/` solo con archivos web
3. Render publica `dist/` (sin `docs/`, sin `.md` de estrategia)
4. URL: `https://sala-cero.onrender.com`

**Checklist pre-deploy:**

- [ ] `npm run check` sin errores
- [ ] Probar formulario → WhatsApp en móvil
- [ ] Probar modal de precios
- [ ] Links de redes abren correctamente

---

## 10. Deuda técnica conocida

| Problema | Impacto | Prioridad |
|---|---|---|
| `index.html` monolítico (~1000 líneas) | Difícil mantener precios | Media — OK hasta 30 productos |
| Precios duplicados en paquetes vs catálogo | Inconsistencias (corregido exportador) | Alta — revisar al cambiar precios |
| Mezcla tú/vos en copy | Marca inconsistente | Media |
| Sin analítica | No miden conversiones | Alta para post-primer-cliente |
| Sin tests automatizados | Regresiones manuales | Baja por ahora |
| Instagram `@salacerobo` (typo?) | Confusión de marca | Alta — renombrar cuando se pueda |
| Imágenes no versionadas en repo local | Puede faltar en clones nuevos | Verificar en GitHub |
| Catálogo solo en HTML | Agregar producto = editar HTML | Aceptable en fase 1 |

### Mejoras futuras (no esta semana)

1. Extraer precios a `precios.json` + render en JS
2. Landing `/demo-restaurante` separada para portafolio
3. Componentizar con Astro o 11ty si crece el sitio
4. CI con GitHub Action: `npm run check` + link checker

---

## 11. Cambios recientes (6 sept 2026)

- Creado `site-config.js` — configuración central
- Footer con Facebook, Instagram, LinkedIn
- Schema.org ampliado (`sameAs`, horarios, área servida)
- Meta SEO local (Santa Cruz, keywords, geo)
- `privacidad.html` + enlace en footer
- `site.webmanifest` con iconos
- `render.yaml` para headers en Render
- Formulario: opciones Web Express, catálogo, chatbot
- Título y OG orientados a conversión ("desde Bs 990")

---

## 12. Contacto en el sitio

| Canal | Valor | Quién responde |
|---|---|---|
| WhatsApp | +591 750 63505 | Egnar |
| Correo | salacero.bo@gmail.com | Egnar |
| Facebook | [Perfil](https://www.facebook.com/profile.php?id=61593645197844) | Marketing virtual |
| Instagram | [@salacerobo](https://www.instagram.com/salacerobo/) | Marketing virtual |
| LinkedIn | [/company/salacero](https://www.linkedin.com/company/salacero) | Marketing virtual |

Documentación de redes (interno): `../salacero-interno/REDES_SOCIALES.md` (carpeta fuera de Git).
