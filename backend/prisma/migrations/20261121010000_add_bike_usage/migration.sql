-- CreateEnum
CREATE TYPE "BikeUsage" AS ENUM ('ENDURO_CROSS', 'RUTA');

-- AlterTable: NULL representa "sin definir" en las publicaciones ya existentes.
ALTER TABLE "Bike" ADD COLUMN "usage" "BikeUsage";

-- CreateIndex
CREATE INDEX "Bike_usage_idx" ON "Bike"("usage");
