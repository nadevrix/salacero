# Entrega — demo restaurante imágenes

- **Fecha:** 6 septiembre 2026
- **Responsable:** Gemini / Antigravity
- **Tarea:** 4 imágenes para `mockups/demo-restaurante/`

## Archivos creados

| Archivo | Tamaño | Dimensiones | Veredicto |
|---|---|---|---|
| `assets/demo-restaurante-hero.webp` | 53 KB | 1376×768 | ✅ Usable |
| `assets/demo-restaurante-saltena.webp` | 74 KB | 1200×896 | ✅ Excelente |
| `assets/demo-restaurante-silpancho.webp` | 72 KB | 1200×896 | ✅ Excelente |
| `assets/demo-restaurante-jugo.webp` | 46 KB | 1200×896 | ✅ Usable |

## Qué hizo bien

- [x] Los **4 nombres** coinciden con lo que pide el HTML
- [x] **No tocó** `index.html` ni código de producción
- [x] Estilo dark premium coherente entre platos
- [x] Salteña y silpancho se ven **muy creíbles** para Santa Cruz
- [x] Jugo maracuyá encaja con "Jugo natural" del menú
- [x] Pesos razonables para web (47–76 KB)

## Observaciones

- Hero: varios items en mesa (no solo una salteña) — funciona igual para fondo
- Hero pedido 16:9 1600×900; entregó 1376×768 — aceptable
- No completó plantilla de entrega (este archivo lo llena el dev post-revisión)

## Revisión humana

- [x] Dev revisó calidad de imagen
- [ ] Marketing probó en celular (presencial)
- [ ] Aprobado para deploy público

## Cómo ver la demo completa

```bash
cd gemini
python3 -m http.server 8080
```

Abrir: `http://localhost:8080/mockups/demo-restaurante/`

(No servir solo desde `demo-restaurante/` — las rutas `../../assets/` no cargan.)
