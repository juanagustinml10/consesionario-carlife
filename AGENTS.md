# AGENTS.md — SF MOTOS

## Stack y disposición del repo

Monorepo simple **sin workspaces** (no hay `turborepo`/`nx`/workspaces de npm). Solo `package.json` en la raíz con scripts de conveniencia; las dependencias se instalan por carpeta.

| Carpeta | Rol | Tooling |
|---|---|---|
| `frontend/` | SPA pública + panel admin | React 19, Vite 8, TypeScript ~7.0.2, Tailwind v4 (`@theme` en `src/index.css`, **no** en `tailwind.config.js`), Framer Motion, Zustand (persist `localStorage`), React Router 7, Axios |
| `backend/` | API REST | Node ≥18 (probado Node 24), Express 4, TS 5.8 (typecheck only), Prisma 6, Zod, bcryptjs, JWT, Multer, Helmet |
| `scripts/dev.mjs` | Levanta backend + frontend juntos | Spawn directo de los binarios `node_modules/vite/bin/vite.js` y `node_modules/tsx/dist/cli.mjs` con `process.execPath` y **`shell: false`** (el harness no puede lanzar `npm.cmd`/`cmd.exe`) |

No hay CI, no hay Dockerfiles, no hay tests.

## Comandos que el agente debe recordar

### Levantar todo
```bash
npm run dev        # scripts/dev.mjs → backend (tsx watch src/index.ts :4000) + frontend (vite :5173)
npm run dev:frontend
npm run dev:backend
```
> **Windows + harness:** igual que `scripts/dev.mjs`, ejecutar si hace falta hacerlo manualmente: `node node_modules/vite/bin/vite.js` (frontend) y `node node_modules/tsx/dist/cli.mjs watch src/index.ts` (backend). `npm`/`npx` funcionan pero su shim `npm.cmd`/`cmd.exe` NO puede spawnearlo el harness (EINVAL/ENOENT).

### Compilar
```bash
npm run build            # raíz: frontend (tsc -b && vite build) → backend (tsc --noEmit && prisma generate)
npm --prefix frontend run build
npm --prefix backend run build
```
⚠️ **Gran trampa de entorno:** `backend` build falla con `EPERM` al renombrar `node_modules/.prisma/client/query_engine-windows.dll.node` si hay un dev server/tsx watch en ejecución (el query engine está cargado y bloqueado por Windows). **Detener el backend dev server antes de `prisma generate`.**

### Typecheck / lint
```bash
cd frontend && npx tsc --noEmit -p tsconfig.app.json   # el raíz NO resuelve tsc
cd frontend && npm run lint                             # oxlint, warnings OK, 0 errors esperados
cd backend && npx tsc --noEmit                          # solo typecheck; el runtime usa tsx
```
No existe `tsc` en el root; siempre invocarlo con `--prefix` o dentro de cada carpeta.

## Estado real (verificado) — no suponer

- **Producción funcionando (20/11/2026):** backend en Vercel (`https://sf-motos-livid.vercel.app`), frontend en Cloudflare Pages (`https://sf-motos.pages.dev`), base de datos en Neon con migraciones aplicadas. Detalle completo en `DEPLOYMENT.md`.
- **DB de producción operativa:** `/health`, `/api/bikes`, `/api/bikes/brands` y `/api/auth/login` devuelven 200. El catálogo está vacío porque todavía no se cargaron motocicletas; eso es estado de datos, no error de API.
- **`backend/.env` local sigue siendo placeholder:** los endpoints en `localhost:4000` no conectan a la DB real. No confundir el entorno local con producción.
- **Panel admin validado en vivo:** existe un usuario `ADMIN` en Neon y el login funciona contra la API de Vercel. Credenciales entregadas fuera del repo (nunca versionar).
- **Marcas cargadas:** la tabla `Brand` de Neon tiene las 9 marcas de la franja del home (`KTM`, `HUSQVARNA`, `GASGAS`, `BETA`, `SHERCO`, `HONDA`, `YAMAHA`, `KAWASAKI`, `SUZUKI`) con IDs `cuid` válidos para el formulario. No hay endpoint para crear marcas: se insertan directamente en `Brand`.
- **Frontend público muestra estados vacíos** por `catch → []` cuando la API falla — por diseño, no es un bug.
- **Procesos dev huérfanos** en puertos 4000/5173 pueden persistir entre sesiones y bloquear `prisma generate` — si `EPERM` en backend, matar el tsx watch y borrar los `*.tmp` de `backend/node_modules/.prisma/client`.

## Datos oficiales (no cambiar)

Nombre: **SF MOTOS** · Eslogan: **POTENCIA EN CADA ARRANQUE.** · Dirección: **9 de Julio 119, Juan B. Alberdi, Tucumán, Argentina** · WhatsApp/Tel: **3812011613** → `wa.me/5493812011613` · Actividad: venta de motocicletas 0 km y usadas.

**No inventar años, clientes, garantías, financiación, envíos, promociones ni especialidades no confirmadas.** Constantes centralizadas en `frontend/src/lib/constants.ts` (`BUSINESS`), no duplicar inline.

## Convenciones y trampas concretas

- **Alias `@` → `frontend/src`** (tsconfig.app.json + vite.config.ts). Usar `@/...` en imports, no relativos `../../`.
- **Tailwind v4:** los tokens/estilos viven en `src/index.css` (`@import "tailwindcss"` + `@theme { --color-sf-* }`). Edit `index.css`, no `tailwind.config.js` (ese archivo es legado de v3).
- **Logo oficial:** fuente original `LOGO SF MOTOS - copia.jpeg` (raíz, intacta). El web usa `frontend/public/logo/sf-motos-black.png` y `sf-motos-white.png` (variantes sobre fondo claro/oscuro), generadas con `py tools/sf-logo-assets.py` sin redibujar el trazo. **No redibujar, no recolorear, no inventar una variante SVG.** Si se quiere nueva versión, partir del JPEG original.
- **Créditos fotográficos a conservar** en footer: Beta RR Freenduro (CC BY 4.0, Jimmy Boakes / Jix31) y KTM forest (CC BY 3.0, Tim Gotzkowsky).
- **Rutas públicas deben quedar dentro de `<PublicLayout>`** (wrapper de `App.tsx` con Navbar + Outlet + Footer). No agregar `<Navbar>` manualmente en páginas públicas.
- **Panel admin:** `ProtectedRoute` lee `localStorage` (`sf_motos_access_token`); con el backend de Vercel autentica correctamente.
- **`.gitignore` excluye `backend/.env`**; solo `.env.example` (valores placeholder). **Nunca commitear `backend/.env`** ni credenciales.
- **Backend usa `tsx` en runtime** (no compila a `dist/` para ejecución); `tsc --noEmit` es solo validación de tipos. No esperes `dist/backend/serve.js`.
- **Windows paths con espacios** — siempre con comillas cuando toque fuera de los scripts; `dev.mjs` se resuelve relativa al repo, no al CWD.

## Verificación mínima antes de dar por terminado

1. `npm run build` (raíz) — si backend falla con EPERM, detener dev server y reintentar.
2. `cd frontend && npx tsc --noEmit -p tsconfig.app.json` — sin errores.
3. `cd frontend && npm run lint` — sin errores (warnings permitido).
4. Si tocaste backend data flow: verificar contra DB real u documentar que no fue verificado.
5. Rutas públicas siguen mostrando datos/vacío sin romper; en producción verificar `/health`, `/api/bikes`, `/api/bikes/brands` y login del admin.

## Repositorio remoto

`origin` apunta a `https://github.com/juanagustinml10/sf-motos.git` (repo público propio de SF MOTOS). El repositorio heredado de JAY MOTOS ya no está configurado. Formato de commits: `tipo(alcance): resumen en español`.

## Producción

Detalle y credenciales de operación en `DEPLOYMENT.md` (sin secretos en el repo). Frontend: Cloudflare Pages `sf-motos` → https://sf-motos.pages.dev. Backend: Vercel `sf-motos` → https://sf-motos-livid.vercel.app. DB: Neon con cadenas guardadas como Secret en Vercel. Ambos hosts despliegan automáticamente desde `main`. El endpoint temporal `/__sql` y su variable `MIGRATE_KEY` ya no existen: no reintroducirlos.
