# Demo Sabor Cruceño

Landing de restaurante ficticio — portafolio Sala Cero.

## Ver local

```bash
cd gemini
python3 -m http.server 8080
```

Abrir **`http://localhost:8080/mockups/demo-restaurante/`**

> Servir desde `gemini/`, no desde esta subcarpeta sola — las imágenes están en `gemini/assets/`.

## Imágenes que necesita Gemini

| Archivo en `gemini/assets/` | Uso |
|---|---|
| `demo-restaurante-hero.webp` | Fondo hero |
| `demo-restaurante-saltena.webp` | Card menú |
| `demo-restaurante-silpancho.webp` | Card menú |
| `demo-restaurante-jugo.webp` | Card menú |

Prompt para Gemini: [`../../prompts/demo-restaurante-imagenes.md`](../../prompts/demo-restaurante-imagenes.md)

## Código

Hecho por dev (Cursor). Gemini **solo** genera las 4 imágenes.
