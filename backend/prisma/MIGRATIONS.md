# Migraciones de JAY MOTOS

## Estado actual: aplicadas ✅

Las dos migraciones están aplicadas y verificadas en la base de datos de Neon
(proyecto `jay-motos`, branch `production`, base `neondb`). `prisma migrate status`
informa `Database schema is up to date!`.

Orden de aplicación:

1. `20261116000000_init` — migración baseline. Crea los enums `BikeCondition` y
   `BikeStatus` (sin `BORRADOR`), las tablas `Brand`, `Bike`, `BikeImage`,
   `BikeFeature`, `BikeVisit`, `AdminUser` y `Session`, sus índices y foreign keys.
   **No incluye** `usageHours` ni `BORRADOR`: esos cambios pertenecen a la
   migración siguiente.
2. `20261117000000_add_usage_hours_draft` — agrega `Bike.usageHours`
   (`DOUBLE PRECISION`, nullable) y el valor `BORRADOR` al enum `BikeStatus`.
   Las filas existentes conservan `NULL`: no se inventan valores.

La baseline se generó con `prisma migrate diff --from-empty` desde un esquema
sin esos dos cambios, y se verificó que `baseline + migración existente` produce
exactamente el `schema.prisma` actual. No se borró ni modificó ninguna migración
previa.

### Conexión

`schema.prisma` usa dos cadenas:

- `DATABASE_URL`: endpoint **pooled** de Neon (hostname con `-pooler`). La usa la
  aplicación en runtime.
- `DATABASE_URL_UNPOOLED`: endpoint **directo** (sin `-pooler`), declarado como
  `directUrl` en el bloque `datasource`. Lo usa el CLI de Prisma para migraciones.

### Comandos

Para aplicar migraciones en otro entorno con la DB ya configurada:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

> En Windows, si hay un `tsx watch` corriendo, `prisma generate` puede fallar con
> `EPERM` porque el query engine está bloqueado. Detené el backend dev server
> antes de generar el cliente.

No usar `db push` ni reiniciar el historial de migraciones: las migraciones son
la fuente de verdad del esquema.

### Comportamiento de las columnas agregadas

- Las motos con `usageHours` **mayor a 0** y condición `USADA` muestran el dato en
  la ficha pública.
- `NULL`, `0` y motos `NUEVA` nunca muestran el campo.
- Las publicaciones `BORRADOR` no aparecen en el catálogo ni se pueden abrir por
  slug o por ID público; sí se ven y se pueden editar desde el panel
  administrativo (endpoints autenticados).
