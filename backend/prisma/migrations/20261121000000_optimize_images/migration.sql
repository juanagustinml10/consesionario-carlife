-- Optimización de imágenes: miniaturas WebP para listados y dimensiones efectivas.
-- Todas las columnas son opcionales: las filas existentes conservan su imagen
-- completa y la ruta pública usa la miniatura solo cuando está disponible.
ALTER TABLE "BikeImage"
    ADD COLUMN "thumbnailData" BYTEA,
    ADD COLUMN "thumbnailMimeType" TEXT,
    ADD COLUMN "thumbnailSizeBytes" INTEGER,
    ADD COLUMN "thumbnailChecksum" TEXT,
    ADD COLUMN "width" INTEGER,
    ADD COLUMN "height" INTEGER;
