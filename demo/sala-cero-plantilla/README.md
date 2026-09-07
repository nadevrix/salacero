# Demo Sala Cero — versión plantilla

Experimento A/B: ¿puede una web hecha **100% con plantilla premium** competir con el sitio custom de Sala Cero?

## Plantilla elegida

**[FoxyMoron Agency](https://github.com/stackmasteraliza/agency-template)** (MIT)

| Criterio | Por qué esta |
|----------|----------------|
| Tema oscuro nativo | Encaja con `#050509` y el logo gradiente |
| Agencia creativa / digital | Mismo rubro que Sala Cero |
| HTML estático | Sin build, igual que el resto del repo |
| Animaciones incluidas | Preloader, cursor custom, scroll reveal, marquee |
| Secciones completas | Hero, servicios, portafolio, contacto, formulario |

Alternativas evaluadas: Monoline (ThemeWagon), Flare, Graxpo — FoxyMoron ganó por tema oscuro + densidad de secciones out-of-the-box.

## Qué se personalizó

- Logo real (`logo-sala-cero.svg`)
- Paleta → gradiente cyan/violeta/magenta/naranja (`sala-cero-theme.css`)
- Textos, precios y WhatsApp reales
- Portafolio enlaza a demos existentes (CHANEZ, restaurante, etc.)
- Formulario abre WhatsApp con mensaje armado

## Imágenes

| Uso | Fuente actual | Mejorar con Gemini |
|-----|---------------|-------------------|
| Hero principal | Gemini | ✅ En uso |
| Hero secundario | Unsplash (local) | ✅ Reemplazó Gemini con texto legible |
| About / equipo | Gemini | ✅ En uso |
| Servicios web | Gemini | ✅ En uso |
| Servicios software/apps | Unsplash (local) | ✅ Descargadas al repo |
| Demos portafolio | Unsplash + restaurante propio | ✅ Sin marcas de prospectos |

### Prompts sugeridos (Gemini / Antigravity)

```
Hero Sala Cero: cinematic dark digital studio, near-black #050509, electric cyan and violet glow, developer workspace with floating UI panels, Santa Cruz tech vibe, no text, no logos, 16:9
```

```
About team: diverse young developers collaborating in modern dark office, warm screen light, professional but approachable, Bolivia/Latin America feel, no readable text, 4:3
```

## Preview local

```bash
cd gemini/mockups/demo-sala-cero-template && python3 -m http.server 8090
```

## Producción

`/demo/sala-cero-plantilla/`

## Comparar

- **Sitio original (custom):** `/`
- **Esta versión (plantilla):** `/demo/sala-cero-plantilla/`
