# SF MOTOS — Guía de despliegue

Arquitectura prevista: **SPA (Vite/React)** → **API Express** → **PostgreSQL (Neon)**.
El repositorio conserva la configuración de Vercel Services y Cloudflare Pages del
proyecto original; **debe vincularse a proyectos/cuentas propias de SF MOTOS** antes de
cualquier deploy. Este archivo no contiene secretos.

> Estado actual: **sin infraestructura de SF MOTOS configurada**. No hay base de datos,
> dominios ni secretos propios. Las URLs de abajo son plantillas, no producciones verificadas.

---

## 1. Pendiente de configuración externa

| Ítem | Acción |
| --- | --- |
| Repositorio remoto | Crear el repo GitHub de SF MOTOS y reemplazar `origin` (hoy apunta al proyecto heredado). |
| PostgreSQL / Neon | Crear proyecto y branch propios. Obtener cadenas pooled (`DATABASE_URL`) y directa (`DATABASE_URL_UNPOOLED`). |
| Secretos JWT | Generar `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` aleatorios y distintos. |
| Usuario admin | Definir `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` propios y ejecutar el seed **una sola vez**. |
| Backend | Crear proyecto de Vercel (u otro host Node) e inyectar las variables de entorno. |
| Frontend | Crear proyecto de Cloudflare Pages (u otro host estático) con `VITE_API_BASE_URL` apuntando a la API de SF MOTOS. |
| CORS | Sumar el dominio público del frontend a `CORS_ORIGIN`. |
| Dominio propio | Configurar DNS y sumarlo a CORS; no reutilizar dominios del proyecto anterior. |

---

## 2. Backend

`vercel.json` en la raíz define dos servicios (`backend` y `frontend`) y rewrites para
`/health`, `/api/(.*)` y el catch-all. `backend/src/index.ts` exporta el app y evita
`app.listen()` cuando `VERCEL=1`.

Build: `npm run build` en `backend` → `prisma generate && tsc --noEmit`.

### Variables de entorno

| Variable | Valor |
| --- | --- |
| `PORT` | `4000` (solo local) |
| `PUBLIC_BASE_URL` | URL HTTPS pública de la API SF MOTOS; requerida si `STORAGE_DRIVER=db` |
| `DATABASE_URL` | Cadena **pooled** de Neon (hostname con `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Cadena **directa** de Neon (sin `-pooler`); la exige `directUrl` en `schema.prisma` |
| `JWT_ACCESS_SECRET` | Aleatorio, propio de SF MOTOS |
| `JWT_REFRESH_SECRET` | Aleatorio, distinto del anterior |
| `JWT_ACCESS_TTL` | `900` |
| `JWT_REFRESH_TTL` | `604800` |
| `CORS_ORIGIN` | Origen(es) públicos del frontend de SF MOTOS, separados por coma |
| `STORAGE_DRIVER` | `local` en desarrollo; `db` en producción sin disco persistente |
| `UPLOAD_DIR` | `./uploads` (solo con `local`) |
| `MAX_FILE_SIZE` | `4194304` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Solo para el alta inicial del administrador |

**No configurar** `SEED_ADMIN_*` en un deploy si el usuario ya existe: el seed no se
ejecuta automáticamente.

### Almacenamiento de fotos

Con `STORAGE_DRIVER=db` los bytes se guardan en `BikeImage.data` (BYTEA) y se sirven por
`GET /api/images/:key`. No requiere credenciales S3. `PUBLIC_BASE_URL` debe ser HTTPS y
público: se usa para construir `BikeImage.url`. La validación de entorno rechaza
`localhost` con este driver.

### Verificación posterior al deploy

Reemplazar `<API_URL>` por la URL real de SF MOTOS:

```text
GET <API_URL>/health           -> 200 { "ok": true, "db": "ok" }
GET <API_URL>/api/bikes        -> 200 JSON
GET <API_URL>/api/bikes/brands -> 200 JSON
GET <API_URL>/                 -> SPA del frontend (si comparten dominio)
```

`/health` solo confirma que Express responde: **no prueba que la API de datos funcione**.
Si `/api/bikes` devuelve 500, revisar `DATABASE_URL`, migraciones y permisos de red.

---

## 3. Frontend

Root directory: `frontend` · Framework: Vite · Build: `npm run build` · Output: `dist`.

Variable de **build**:

```text
VITE_API_BASE_URL=<API_URL>
```

El agrega `/api` automáticamente si falta. `frontend/public/_redirects` contiene
`/* /index.html 200` para que las rutas profundas recarguen sin 404.

---

## 4. Migraciones

Las migraciones versionadas en `backend/prisma/migrations` son:

- `20261116000000_init`
- `20261117000000_add_usage_hours_draft`
- `20261119000000_add_image_blobs`

**No están aplicadas en ninguna base de SF MOTOS.** contra la DB propia:

```bash
cd backend
npx prisma migrate deploy   # usa DATABASE_URL_UNPOOLED
```

Nunca `db push` ni reiniciar el historial de migraciones. El seed se ejecuta aparte
según `backend/prisma/MIGRATIONS.md`.

---

## 5. Seguridad y operación

- `.env`, `.env.*` (incluido `.env.production`) están ignorados; solo se versionan `.env.example`.
- No hay credenciales en el frontend: `VITE_*` solo contiene la URL pública de la API.
- El registro público de administradores fue eliminado; el alta es únicamente por seed.
- Las sesiones usan JWT access + refresh con rotación y filas en `Session`. Los tokens
  viven en `localStorage`: migrarlos a cookies `HttpOnly`/`Secure` en una etapa posterior.
- No hay rate limiting en `/api/auth/login`: recomendable antes de exponer el panel a Internet.
- Antes de publicar, ejecutar `npm run build` en la raíz y verificar que no queden
  referencias al proyecto anterior.
