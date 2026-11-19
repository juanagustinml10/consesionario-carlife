-- Almacenamiento binario de imágenes en Neon (BYTEA).
-- Todas las columnas son opcionales: las filas existentes conservan su URL
-- (local/S3) y siguen funcionando sin backfill ni borrado de datos.
ALTER TABLE "BikeImage"
    ADD COLUMN "data" BYTEA,
    ADD COLUMN "mimeType" TEXT,
    ADD COLUMN "sizeBytes" INTEGER,
    ADD COLUMN "checksum" TEXT,
    ADD COLUMN "storageKey" TEXT,
    ADD COLUMN "legacyUrl" TEXT;

-- La clave pública es opaca y única; se genera en la aplicación, no en la BD.
CREATE UNIQUE INDEX "BikeImage_storageKey_key" ON "BikeImage"("storageKey");
