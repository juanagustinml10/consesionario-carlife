# Migraciones de JAY MOTOS

## Pendiente de aplicar: `20261117000000_add_usage_hours_draft`

Esta migración:

1. Agrega `Bike.usageHours` (`DOUBLE PRECISION`, nullable) para guardar las **horas de uso** de motocicletas usadas. Las filas existentes quedan en `NULL`: no se inventan valores.
2. Agrega el valor `BORRADOR` al enum `BikeStatus`, para poder guardar publicaciones sin exponerlas en el catálogo público.

**No fue aplicada** porque el `backend/.env` de este entorno tiene un `DATABASE_URL` placeholder y la base de datos no está operativa. Tampoco se modificó ningún dato existente.

### Cómo aplicarla

Con un `DATABASE_URL` real configurado en `backend/.env`:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

> En Windows, si hay un `tsx watch` corriendo, `prisma generate` puede fallar con `EPERM` porque el query engine está bloqueado. Detené el backend dev server antes de generar el cliente.

Si se quiere crear la migración desde cero en otra máquina (en vez de usar el SQL incluido):

```bash
cd backend
npx prisma migrate dev --name add_usage_hours_draft
```

### Comportamiento después de aplicarla

- Las motos con `usageHours` **mayor a 0** y condición `USADA` muestran el dato en la ficha pública.
- `NULL`, `0` y motos `NUEVA` nunca muestran el campo.
- Las publicaciones `BORRADOR` no aparecen en el catálogo ni se pueden abrir por slug o por ID público; sí se ven y se pueden editar desde el panel administrativo (endpoints autenticados).
