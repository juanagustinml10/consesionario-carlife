# JAY MOTOS — Concesionaria Digital

Plataforma web para la concesionaria de motocicletas **JAY MOTOS**: catálogo público de motos **0 km y usadas**, ficha individual, comparador, favoritos, consultas por WhatsApp y panel administrativo privado para gestionar las publicaciones.

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Frontend | React 18 + Vite + TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Axios, React Router, Lucide Icons |
| Backend | Node.js + Express + TypeScript |
| ORM / Base de datos | Prisma + PostgreSQL |
| Autenticación | JWT (access + refresh) con sesiones en base de datos, bcryptjs |
| Validación | Zod |
| Subida de imágenes | Multer (disco local en esta etapa; preparado para S3/Neon Storage) |

## Estructura del monorepo

```
consesionaria motos/
├── frontend/                 # Aplicación pública + panel admin (SPA)
│   ├── src/
│   │   ├── components/       # ui/ (Button, Card…), shared/, public/, admin/
│   │   ├── pages/            # public/ (Home, Catalog, BikeDetail, Compare, Favorites, About, Contact)
│   │   │                       admin/ (Login, Dashboard, Bikes, BikeForm)
│   │   ├── layout/           # Navbar, Footer, admin/AdminLayout
│   │   ├── services/         # Clientes API (bikes, auth, stats) con Axios
│   │   ├── stores/           # Zustand (favoritos, comparador) con persistencia localStorage
│   │   ├── hooks/, lib/, types/, assets/
│   │   └── main.tsx, App.tsx
│   ├── .env.example
│   ├── tailwind.config.js, postcss.config.js
│   └── vite.config.ts        # Alias "@" -> src, proxy /api -> localhost:4000
│
└── backend/                  # API REST
    ├── src/
    │   ├── config/env.ts     # Entorno validado con Zod
    │   ├── lib/prisma.ts
    │   ├── middleware/       # auth (JWT), asyncHandler, error handler
    │   ├── routes/           # /api/auth, /api/bikes, /api/stats
    │   ├── controllers/, services/
    │   └── app.ts, index.ts
    ├── prisma/
    │   ├── schema.prisma     # Brand, Bike, BikeImage, BikeFeature, BikeVisit, AdminUser, Session
    │   └── seed.ts           # Crea el admin inicial desde variables de entorno
    └── .env.example
```

## Requisitos

- Node.js ≥ 18 (probado con Node 24)
- Una base de datos **PostgreSQL** accesible (local, Neon o cualquier proveedor compatible)

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editá .env con los valores reales (DATABASE_URL, secretos JWT, CORS_ORIGIN…)
npx prisma migrate dev --name init   # crea las tablas
npm run prisma:seed                  # crea el administrador inicial (usa SEED_ADMIN_*)
npm run dev                          # http://localhost:4000
```

Endpoints principales:

- `GET /health`
- `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `POST /api/auth/register`
- `GET /api/bikes` (filtros: `q`, `brand`, `model`, `year`, `condition`, `priceMin`, `priceMax`, `status`, `featured`, `page`, `limit`)
- `GET /api/bikes/slug/:slug`, `GET /api/bikes/:id`
- `POST /api/bikes` (auth), `PATCH /api/bikes/:id` (auth), `DELETE /api/bikes/:id` (auth)
- `POST /api/bikes/:id/images` (auth, multipart `images[]`)
- `PATCH /api/bikes/:id/images/:imageId/primary` (auth), `DELETE /api/bikes/:id/images/:imageId` (auth)
- `POST /api/bikes/:id/visits` (pública, contabiliza visita)
- `GET /api/stats/dashboard`, `GET /api/stats/recent-bikes` (auth)
- `GET /api/bikes/brands`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                        # http://localhost:5173
```

### 3. Compilar

```bash
npm run build                      # en la raíz compila frontend y backend
```

## Variables de entorno (backend `.env`)

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (default 4000) |
| `PUBLIC_BASE_URL` | URL pública del backend (para URLs de archivos) |
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secretos de firma JWT (generar valores aleatorios) |
| `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` | Duración en segundos (900 / 604800 por defecto) |
| `CORS_ORIGIN` | Origen permitido (el del frontend) |
| `UPLOAD_DIR` | Carpeta de subidas (servida en `/uploads`) |
| `MAX_FILE_SIZE` | Tamaño máximo por imagen en bytes |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credenciales del administrador inicial para el seed |

**Importante:** `.env` nunca debe subirse a control de versiones. Los valores de ejemplo en `.env.example` son ficticios.

## Aclaraciones de esta primera etapa

- No hay datos ficticios cargados como publicaciones reales: el catálogo arranca vacío hasta que el panel admin publique motos. Las imágenes de marcador de posición están claramente etiquetadas como "Foto de prueba".
- Favoritos y comparador persisten en `localStorage` del navegador (funcionalidad del lado del cliente; no requieren cuenta).
- El panel administrativo requiere un usuario admin creado vía seed (`SEED_ADMIN_*`) o registrado por un endpoint de registro existente.
- La autenticación del frontend usa JWT access + refresh con rotación y persistencia en `localStorage`.
- No se implementó calculadora de financiación ni de permuta (fuera de alcance).
- Las visitas se contabilizan mediante `POST /api/bikes/:id/visits`.

## Próximos pasos

1. Diseño visual completo e integración con el backend real (datos de motos y fotos reales).
2. Módulo de fotografías definitivo (o almacenamiento S3/Neon Storage) y CDN.
3. Dashboard admin completo: edición masiva, destacadas, estados, historial.
4. Buscador avanzado con full-text search y autocompletado.
5. Tests E2E (Playwright) y de integración (Vitest + Supertest).
6. Despliegue: frontend (Vercel/Netlify), backend (contenedor/VM), base de datos Neon PostgreSQL.
