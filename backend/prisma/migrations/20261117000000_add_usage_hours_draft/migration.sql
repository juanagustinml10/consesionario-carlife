-- Horas de uso: campo opcional y decimal, exclusivo de motocicletas usadas.
-- Las publicaciones existentes conservan NULL: no se inventan valores.
ALTER TABLE "Bike" ADD COLUMN "usageHours" DOUBLE PRECISION;

-- Estado de borrador: permite guardar una publicación sin exponerla en el catálogo público.
-- Requiere PostgreSQL 12+ para poder ejecutar ALTER TYPE ... ADD VALUE
-- dentro de la transacción con la que Prisma aplica la migración.
ALTER TYPE "BikeStatus" ADD VALUE IF NOT EXISTS 'BORRADOR';
