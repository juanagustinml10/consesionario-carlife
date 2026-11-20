# SF MOTOS — Guía de despliegue

Arquitectura en producción: **SPA (Vite/React) en Cloudflare Pages** → **API Express en Vercel** → **PostgreSQL (Neon)**.

> Estado verificado el 20/11/2026: infraestructura propia de SF MOTOS configurada y funcionando. **Este archivo no contiene secretos.**

---

## 1. Producción

| Capa | Plataforma | Proyecto | URL |
| --- | --- | --- | --- |
| Repositorio | GitHub | `juanagustinml10/sf-motos` (público) | https://github.com/juanagustinml10/sf-motos |
| Frontend | Cloudflare Pages | `sf-motos` (rama `main`) | https://sf-motos.pages.dev |
| Backend | Vercel | `sf-motos` (cuenta `agustinmolina17`) | https://sf-motos-livid.vercel.app |
| Base de datos | Neon | proyecto configurado en Vercel | (solo cadenas Secret) |

Cloudflare Pages y Vercel despliegan automáticamente cada push a `main`. El frontend apunta a la API de Vercel mediante el fallback productivo en `frontend/src/lib/api.ts`; no hace falta definir `VITE_API_BASE_URL` en Pages.

### Verificación actual

```text
GET  https://sf-motos-livid.vercel.app/health            -> 200 {"ok":true,"service":"sfmotos-backend","db":"ok"}
GET  https://sf-motos-livid.vercel.app/api/bikes         -> 200 {"data":[],"meta":{...}}
GET  https://sf-motos-livid.vercel.app/api/bikes/brands  -> 200 []
POST https://sf-motos-livid.vercel.app/api/auth/login    -> 200 { accessToken, refreshToken }
GET  https://sf-motos.pages.dev                          -> 200 SPA de SF MOTOS
```

Las listas están vacías porque **todavía no se cargaron motocicletas**. Eso es un estado de datos, no un error de API.

---

## 2. Backend (Vercel)

`vercel.json` en la raíz define los servicios `backend` y `frontend` y los rewrites de `/health`, `/api/(.*)` y el catch-all. `backend/src/index.ts` exporta el app y evita `app.listen()` cuando `VERCEL=1`.

Build del backend: `prisma generate && tsc --noEmit` (el runtime usa `tsx`, no compila a `dist/`).

### Variables de entorno (production)

| Variable | Estado / valor |
| --- | --- |
| `DATABASE_URL` | Secret de Neon (pooled, hostname `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Secret de Neon (directo, sin `-pooler`) |
| `JWT_ACCESS_SECRET` | Secret aleatorio, propio de SF MOTOS |
| `JWT_REFRESH_SECRET` | Secret aleatorio, distinto del anterior |
| `JWT_ACCESS_TTL` | `900` |
| `JWT_REFRESH_TTL` | `604800` |
| `CORS_ORIGIN` | `https://sf-motos.pages.dev,https://sf-motos-livid.vercel.app` |
| `PUBLIC_BASE_URL` | `https://sf-motos-livid.vercel.app` |
| `STORAGE_DRIVER` | `db` (fotos en Neon; sin disco efímero) |
| `MAX_FILE_SIZE` | `4194304` |

Comandos útiles:

```bash
vercel env ls --project sf-motos
vercel env add NOMBRE --project sf-motos --environment production --value VALOR --yes --force
vercel logs --deployment <url-del-deploy>
vercel --prod --yes            # redeploy manual desde el working tree
```

### Almacenamiento de fotos

Con `STORAGE_DRIVER=db` los bytes se guardan en `BikeImage.data` (BYTEA) y se sirven por `GET /api/images/:key`. No requiere credenciales S3. `PUBLIC_BASE_URL` debe ser HTTPS y público: se usa para construir `BikeImage.url`.

---

## 3. Frontend (Cloudflare Pages)

- Root directory: `frontend` · Framework: Vite · Build: `npm run build` · Output: `dist`.
- Proyecto: `sf-motos`, cuenta `38903a9d035a6f38fbf883173b296d6e`.
- Dominio: `https://sf-motos.pages.dev`.
- `frontend/public/_redirects` contiene `/* /index.html 200` para que las rutas profundas recarguen sin 404.
- No hay secretos en el bundle: la única URL inyectada es la pública de la API.

---

## 4. Base de datos y migraciones

Migraciones versionadas en `backend/prisma/migrations`, **ya aplicadas en Neon y registradas en `_prisma_migrations`**:

- `20261116000000_init`
- `20261117000000_add_usage_hours_draft`
- `20261119000000_add_image_blobs`

Para una base nueva, ejecutar una sola vez con las cadenas directas disponibles:

```bash
cd backend
npx prisma migrate deploy   # usa DATABASE_URL_UNPOOLED
```

Nunca `db push` ni reiniciar el historial de migraciones.

### Usuario administrador

Existe un usuario `ADMIN` creado en Neon. Sus credenciales **no se versionan**; se entregaron fuera del repositorio. El panel está en `https://sf-motos.pages.dev/admin`. El registro público de administradores no existe (el alta es solo por seed/insercion controlada). Si se pierden las credenciales, crear otro admin con `backend/prisma/seed.ts` definiendo `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` localmente y ejecutando `npm run prisma:seed` **una sola vez**.

---

## 5. Seguridad y operación

- `.env`, `.env.*` (incluido `.env.production`) están ignorados; solo se versionan `.env.example`.
- El endpoint temporal `/__sql` usado para aplicar migraciones fue **eliminado del código y del runtime**, y su variable `MIGRATE_KEY` fue borrada de Vercel.
- Las sesiones usan JWT access + refresh con rotación y filas en `Session`. Los tokens viven en `localStorage`: migrarlos a cookies `HttpOnly`/`Secure` es una mejora pendiente.
- No hay rate limiting en `/api/auth/login`: recomendable antes de exponer demasiado el panel.
- Rotación de secretos JWT: generar valores nuevos, actualizarlos en Vercel y redesplegar. Esto invalida las sesiones activas.
- Antes de dar por terminado un cambio: `npm run build` en la raíz, `npx tsc --noEmit -p tsconfig.app.json` y `npm run lint` en `frontend`.
