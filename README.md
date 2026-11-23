# CARLIFE — Plataforma web

Sitio público y panel administrativo para **CARLIFE**: catálogo de autos usados,
fichas de detalle, comparador, favoritos, consultas por WhatsApp y gestión
privada de publicaciones e imágenes.

**Datos oficiales:** Aconquija 1727, Yerba Buena, Tucumán, Argentina · WhatsApp/Tel
381 361-4178 · `Vehículos seleccionados en Yerba Buena.` · `Confianza, Trayectoria y Renovación.`
No se inventan garantías, tasas, cuotas, entidades ni condiciones de financiación.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite 8 + TypeScript, Tailwind CSS v4, Zustand, Axios, React Router 7, Lucide |
| Backend | Node.js ≥ 18 + Express 4 + TypeScript (runtime con `tsx`) |
| ORM / DB | Prisma 6 + PostgreSQL (Neon recomendado) |
| Autenticación | JWT access + refresh con sesiones en DB y contraseñas hasheadas con bcryptjs |
| Validación | Zod |
| Imágenes | Multer + Sharp; WebP full/thumbnail con almacenamiento en DB en producción |

> El diseño visual es propio de CARLIFE: paleta blanco/rojo/negro, tipografía
> condensada y geometría recta.

## Estructura

```text
.
├── frontend/                 # SPA pública + panel admin
│   ├── public/logo/          # variantes generadas desde el JPEG oficial de CARLIFE
│   ├── public/favicon.png    # isotipo en rojo
│   └── src/
│       ├── components/       # ui/, shared/, public/, admin/
│       ├── pages/            # public/, admin/
│       ├── layout/           # PublicLayout, Navbar, Footer, admin/AdminLayout
│       ├── services/         # clientes API (bikes, auth, stats)
│       ├── stores/           # favoritos y comparador (localStorage)
│       └── lib/constants.ts  # datos oficiales de CARLIFE
├── backend/                  # API REST
│   ├── src/                  # app, config, middleware, routes, controllers, services
│   ├── prisma/               # schema, migrations, seed
│   └── .env.example
├── tools/carlife-logo-assets.py # genera los assets del logotipo sin redibujarlo
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

- `GET /health` (verifica Express y DB)
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
| `CORS_ORIGIN` | Orígenes permitidos del frontend CARLIFE |
| `STORAGE_DRIVER` | `local` (desarrollo) o `db` (producción) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credenciales iniciales del admin |

## Aclaraciones

- El catálogo público muestra únicamente autos usados. Los valores internos del enum
  `BikeCondition` se conservan por compatibilidad con la API y la base de datos.
- La financiación se comunica como créditos prendarios; no se publican tasas, cuotas,
  entidades ni condiciones no confirmadas.
- Las imágenes sin foto muestran un marcador "Foto no disponible", nunca ejemplos
  presentados como stock real.
- Favoritos y comparador persisten solo en `localStorage` del navegador.
- No se implementó calculadora de financiación ni de permuta.

El detalle de despliegue y las tareas externas pendientes están en `DEPLOYMENT.md`.
