# SF MOTOS — Plataforma web

Sitio público y panel administrativo para **SF MOTOS**: catálogo de motocicletas 0 km y
usadas, fichas de detalle, comparador, favoritos, consultas por WhatsApp y gestión
privada de publicaciones e imágenes.

**Datos oficiales:** 9 de Julio 119, Juan B. Alberdi, Tucumán, Argentina · WhatsApp/Tel
381 201-1613 · `POTENCIA EN CADA ARRANQUE.` No se inventan garantías, financiación,
promociones, envíos ni especialidades no confirmadas.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite 8 + TypeScript, Tailwind CSS v4, Zustand, Axios, React Router 7, Lucide |
| Backend | Node.js ≥ 18 + Express 4 + TypeScript (runtime con `tsx`) |
| ORM / DB | Prisma 6 + PostgreSQL (Neon recomendado) |
| Autenticación | JWT access + refresh con sesiones en DB y contraseñas hasheadas con bcryptjs |
| Validación | Zod |
| Imágenes | Multer; `local` en desarrollo, `db` (BYTEA en Postgres) para producción |

> El diseño visual es propio de SF MOTOS: paleta negro/rojo/blanco, tipografía
> condensada y geometría recta. No se usa Framer Motion.

## Estructura

```text
.
├── frontend/                 # SPA pública + panel admin
│   ├── public/logo/          # variantes SF generadas desde el JPEG oficial
│   └── src/
│       ├── components/       # ui/, shared/, public/, admin/
│       ├── pages/            # public/, admin/
│       ├── layout/           # PublicLayout, Navbar, Footer, admin/AdminLayout
│       ├── services/         # clientes API (bikes, auth, stats)
│       ├── stores/           # favoritos y comparador (localStorage)
│       └── lib/constants.ts  # datos oficiales de SF MOTOS
├── backend/                  # API REST
│   ├── src/                  # app, config, middleware, routes, controllers, services
│   ├── prisma/               # schema, migrations, seed
│   └── .env.example
├── scripts/dev.mjs           # levanta backend + frontend juntos
└── vercel.json               # configuración de servicios/rewrites (si se usa Vercel)
```

## Puesta en marcha

```bash
npm install
npm run dev
# backend: http://localhost:4000 · frontend: http://localhost:5173
```

Si preferís hacerlo por separado:

```bash
cd backend
cp .env.example .env
# Editá .env con tu propia PostgreSQL y secretos
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run dev

cd ../frontend
cp .env.example .env
npm install
npm run dev
```

> En Windows con este harness, si hace falta lanzar manualmente:
> `node node_modules/tsx/dist/cli.mjs watch src/index.ts` en `backend` y
> `node node_modules/vite/bin/vite.js` en `frontend`.

## Compilación y chequeos

```bash
npm run build
cd frontend && npx tsc --noEmit -p tsconfig.app.json
cd frontend && npm run lint
cd backend && npx tsc --noEmit
```

Si `prisma generate` falla con `EPERM` en Windows, detené el dev server del backend:
el query engine queda bloqueado.

## Endpoints principales

- `GET /health` (solo verifica que Express esté vivo)
- `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- `GET /api/bikes` con filtros `q`, `brand`, `model`, `year`, `condition`, `priceMin`,
  `priceMax`, `status`, `featured`, `page`, `limit`
- `GET /api/bikes/slug/:slug`, `GET /api/bikes/:id`, `GET /api/bikes/brands`
- `POST /api/bikes`, `PATCH /api/bikes/:id`, `DELETE /api/bikes/:id` (auth)
- `POST /api/bikes/:id/images` (auth, multipart `images[]`)
- `PATCH /api/bikes/:id/images/:imageId/primary`, `DELETE /api/bikes/:id/images/:imageId` (auth)
- `POST /api/bikes/:id/visits` (público)
- `GET /api/stats/dashboard`, `GET /api/stats/recent-bikes` (auth)

## Variables de entorno

Ver `backend/.env.example` y `frontend/.env.example`. Nunca commitear `.env`.

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Cadenas pooled y directa de tu propia Neon/Postgres |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secretos aleatorios y distintos |
| `PUBLIC_BASE_URL` | URL HTTPS pública de la API, necesaria con `STORAGE_DRIVER=db` |
| `CORS_ORIGIN` | Orígenes permitidos del frontend SF |
| `STORAGE_DRIVER` | `local` (desarrollo) o `db` (producción) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credenciales iniciales del admin |

## Estado actual

- El rediseño visual y funcional está implementado en código.
- **No hay base de datos de SF MOTOS configurada**: sin `DATABASE_URL` real, `/api/bikes`
  y `/api/bikes/brands` devuelven error y el sitio público muestra estados vacíos.
- El panel admin no fue validado end-to-end contra una DB real.
- `origin` todavía apunta al repositorio heredado; ver `DEPLOYMENT.md` antes de publicar.

## Aclaraciones

- No hay datos ficticios cargados como publicaciones reales; el catálogo arranca vacío.
- Las imágenes sin foto muestran un marcador "Foto no disponible", nunca ejemplos
  presentados como stock real.
- Favoritos y comparador persisten solo en `localStorage` del navegador.
- No se implementó calculadora de financiación ni de permuta.

El detalle de despliegue y las tareas externas pendientes están en `DEPLOYMENT.md`.
