# Prompt para Gemini — imágenes demo restaurante

**Contexto:** El HTML ya está hecho en `gemini/mockups/demo-restaurante/`.  
**Tu trabajo:** generar **4 imágenes** y guardarlas en `gemini/assets/` con estos nombres exactos.

**NO toques el HTML.** Solo imágenes.

---

## Prompt único (copiar todo a Antigravity)

```text
Trabajo: generar 4 imágenes para una web de restaurante boliviano ficticio "Sabor Cruceño" en Santa Cruz.

Estilo general para las 4:
- Premium dark food photography + subtle cinematic lighting
- Near-black backgrounds (#050509) where applicable
- Very subtle cyan-violet accent rim light (brand Sala Cero), but food looks warm and appetizing
- Realistic Latin American / Bolivian food, NOT generic US fast food
- NO text, NO logos, NO watermarks, NO people faces, NO hands

---

IMAGEN 1 — guardar como: demo-restaurante-hero.webp
Aspect ratio: 16:9 (1600x900)
Content: Wide hero shot for restaurant website. Appetizing Bolivian spread on dark table—golden salteña, grilled meat dish, fresh juice—warm food lighting, dark cinematic background, space on left side slightly darker for text overlay. Restaurant ambiance bokeh optional.

---

IMAGEN 2 — guardar como: demo-restaurante-saltena.webp
Aspect ratio: 4:3 (800x600)
Content: Single golden Bolivian salteña on dark slate plate, steam or freshness, close-up food photography, dark studio background, appetizing detail on crust.

---

IMAGEN 3 — guardar como: demo-restaurante-silpancho.webp
Aspect ratio: 4:3 (800x600)
Content: Silpancho-style Bolivian plate: breaded meat, rice, potato, fried egg on dark plate. Premium dark food photography, realistic portions, not restaurant chain generic.

---

IMAGEN 4 — guardar como: demo-restaurante-jugo.webp
Aspect ratio: 4:3 (800x600)
Content: Fresh tropical juice (passion fruit / tumbo style) in glass with condensation, fruit slice garnish, dark background, refreshing look.

---

Export format: WebP or PNG (prefer WebP).
Save to folder: gemini/assets/
Do not edit any HTML files.
```

---

## Después de generar

1. Verificar que los 4 archivos existen en `gemini/assets/`
2. Abrir en navegador:
   ```bash
   cd gemini/mockups/demo-restaurante && python3 -m http.server 8080
   ```
   → `http://localhost:8080`
3. Completar `gemini/entregas/2026-09-06-demo-restaurante.md` (copiar PLANTILLA.md)
4. Avisar al dev si se ve bien para mostrar en celular (presencial)

---

## Si una imagen falla

Regenerar solo esa con el bloque correspondiente (IMAGEN 1, 2, 3 o 4).

No inventar nombres nuevos — el HTML ya apunta a esos paths.
