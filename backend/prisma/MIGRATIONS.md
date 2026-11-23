# Migraciones de CARLIFE

## Estado actual

Las migraciones están versionadas en `backend/prisma/migrations` y aplicadas en la
base de producción (Neon). Para levantar un entorno nuevo, configurar `DATABASE_URL`
y `DATABASE_URL_UNPOOLED` y ejecutar `prisma migrate deploy`.

La migración `20261119000000_add_image_blobs` es aditiva: agrega `data` (BYTEA),
`mimeType`, `sizeBytes`, `checksum`, `storageKey` (único) y `legacyUrl` a `BikeImage`.
No modifica ni borra filas existentes.

## Conexión

`schema.prisma` usa dos cadenas:

- `DATABASE_URL`: endpoint **pooled** de Neon (hostname con `-pooler`). La usa la
  aplicación en runtime.
- `DATABASE_URL_UNPOOLED`: endpoint **directo** (sin `-pooler`), declarado como
  `directUrl` en el bloque `datasource`. Lo usa el CLI de Prisma para migraciones.

## Comandos

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

## Comportamiento de las columnas agregadas

- Las publicaciones con `usageHours` **mayor a 0** muestran el dato en la ficha pública.
- `NULL` y `0` se consideran "sin dato" y nunca se muestran como horas cargadas.
- Las publicaciones `BORRADOR` no aparecen en el catálogo ni se pueden abrir por
  slug o por ID público; sí se ven y se pueden editar desde el panel
  administrativo (endpoints autenticados).
