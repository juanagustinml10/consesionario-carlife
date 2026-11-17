# JAY MOTOS — Guía de despliegue

Arquitectura: **Cloudflare Pages** (SPA) → **Vercel Functions** (API Express) → **Neon** (PostgreSQL).
Repo: `https://github.com/juanagustinml10/jay-motos` · rama `main`.

> Los valores entre `<...>` son placeholders. No hay dominios ni secretos reales en este archivo.

---

## 1. Backend en Vercel

| Ajuste | Valor |
| --- | --- |
| Root Directory | `backend` |
| Framework Preset | Other |
| Install Command | `npm install` |
| Build Command | `npm run build` (ya declarado en `backend/vercel.json`) |
| Node.js | 22.x (`engines: >=20`) |
| Output Directory | no aplica: Vercel detecta Express automáticamente |

Vercel detecta la app Express en `src/app.ts` / `src/index.ts` (ambos exportan el app por default)
y la empaqueta como una única Function. No hacen falta rewrites: todas las rutas llegan a Express,
así que `/api/auth/login`, `/api/bikes` y `/health` funcionan sin cambios.

`npm run build` ejecuta `tsc --noEmit` y `prisma generate`.

### Variables de entorno obligatorias en Vercel

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | Cadena **pooled** de Neon (hostname con `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Cadena **directa** de Neon (sin `-pooler`); la exige `directUrl` en `schema.prisma` |
| `JWT_ACCESS_SECRET` | Aleatorio, propio de producción |
| `JWT_REFRESH_SECRET` | Aleatorio, distinto del anterior |
| `PUBLIC_BASE_URL` | `https://<proyecto-backend>.vercel.app` |
| `CORS_ORIGIN` | `https://<proyecto-frontend>.pages.dev` (y el dominio custom, separado por coma) |
| `STORAGE_DRIVER` | `s3` |
| `STORAGE_S3_BUCKET` | Nombre del bucket |
| `STORAGE_PUBLIC_BASE_URL` | URL pública del bucket/CDN |
| `AWS_ACCESS_KEY_ID` | Credencial del bucket |
| `AWS_SECRET_ACCESS_KEY` | Credencial del bucket |
| `AWS_ENDPOINT_URL_S3` | Endpoint S3 (R2: `https://<account>.r2.cloudflarestorage.com`) |
| `AWS_REGION` | `auto` para R2; la región real para AWS |

Opcionales: `JWT_ACCESS_TTL=900`, `JWT_REFRESH_TTL=604800`, `MAX_FILE_SIZE=4194304`.
**No configurar** `SEED_ADMIN_*` en Vercel: el administrador ya existe en Neon y el seed no se ejecuta en deploy.

### Almacenamiento de fotos

Vercel no tiene disco persistente: `STORAGE_DRIVER=local` solo sirve para desarrollo.
Usar un bucket S3-compatible con lectura pública (por ejemplo Cloudflare R2). El bucket debe:

- permitir `PUT`/`DELETE` con la credencial configurada;
- servir objetos públicamente en `STORAGE_PUBLIC_BASE_URL/<archivo>`;
- tener CORS que permita `GET` desde `https://<proyecto-frontend>.pages.dev`.

Las URLs de las imágenes se guardan completas en `BikeImage.url`, así que no hace falta migrar datos.
Neon Object Storage **no está disponible** en la región actual del proyecto (`sa-east-1`).

### Verificación posterior al deploy

```text
GET https://<proyecto-backend>.vercel.app/health          -> 200 { "ok": true, "db": "ok" }
GET https://<proyecto-backend>.vercel.app/api/bikes/brands -> 200 (9 marcas)
```

El límite de body de Vercel Functions es ~4.5 MB; por eso `MAX_FILE_SIZE=4194304`.

### Si Vercel falla con `ERR_MODULE_NOT_FOUND`

Síntoma: `Cannot find module '/var/task/.../src/config/env' imported from '.../src/app.js'`.

Causa: el backend es ESM (`"type": "module"`) y Vercel transpila cada `.ts` a `.js` sin
hacer bundling. Node ESM no resuelve imports relativos sin extensión, por lo que
`./config/env` no existe: el archivo generado se llama `env.js`.

Estado actual: **corregido**. Todos los imports relativos usan extensión `.js`
(`./config/env.js`, `./routes/index.js`, etc.) y `tsconfig.json` usa
`module`/`moduleResolution: NodeNext` para que el typecheck detecte regresiones.
`tsx` sigue resolviendo esos specifiers a los `.ts` en desarrollo.

La ruta `/var/task/backend/...` del error también indica que Vercel puede estar usando
el repo como Root Directory. Confirmar en el dashboard que **Root Directory = `backend`**;
`backend/vercel.json` solo se aplica con esa configuración.

---

## 2. Frontend en Cloudflare Pages

| Ajuste | Valor |
| --- | --- |
| Repositorio | `juanagustinml10/jay-motos` |
| Rama de producción | `main` |
| Root directory | `frontend` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 20 o superior |

Variable de entorno de **build** (no de runtime):

```text
VITE_API_BASE_URL=https://<proyecto-backend>.vercel.app
```

El código agrega `/api` automáticamente si falta, así que el frontend llama a:

```text
https://<proyecto-backend>.vercel.app/api/...
```

No hace falta configurar un proxy: el backend responde CORS para el origen de Pages.
`frontend/public/_redirects` ya contiene `/* /index.html 200`, necesario para que rutas como
`/motos/:slug` y `/admin/dashboard` recarguen sin 404.

Si se agrega un dominio propio, sumarlo también a `CORS_ORIGIN` en Vercel.

---

## 3. Seguridad y operación

- `.env`, `.env.*` (incluido `.env.production`) están ignorados; solo se versionan `.env.example`.
- No hay credenciales en el frontend: `VITE_*` solo contiene la URL pública de la API.
- El registro público de administradores fue eliminado; el alta es únicamente por seed local.
- Las sesiones usan JWT access + refresh con rotación y filas en `Session`.
  Los tokens viven en `localStorage`: conviene migrarlos a cookies `HttpOnly`/`Secure` en una etapa posterior.
- No hay rate limiting en `/api/auth/login`: recomendable antes de exponer el panel a Internet.
- `npm audit` reporta avisos altos en `prisma`/`@prisma/config`→`deepmerge-ts` y en `zod` 3.
  El fix de `zod` es un cambio major; no se aplicó en esta preparación.

### Migraciones

Las dos migraciones (`20261116000000_init` y `20261117000000_add_usage_hours_draft`)
ya están aplicadas en la branch `production` de Neon y versionadas en el repo.
El deploy no ejecuta migraciones ni seed. Si se apuntara a otra DB:

```bash
cd backend
npx prisma migrate deploy   # usa DATABASE_URL_UNPOOLED
```

Nunca `db push` ni reinicio del historial de migraciones.
