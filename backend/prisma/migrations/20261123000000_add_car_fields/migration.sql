-- Migración aditiva: agrega los campos de autos usados sin tocar ni borrar
-- las columnas del proyecto original (usage, displacementCc, usageHours...).
-- Los enums son nullable para que las publicaciones existentes sigan vigentes.

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('AUTO', 'CAMIONETA', 'SUV');
CREATE TYPE "FuelType" AS ENUM ('NAFTA', 'DIESEL', 'HIBRIDO', 'ELECTRICO', 'GNC', 'OTRO');
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATICA');
CREATE TYPE "DriveType" AS ENUM ('X2', 'X4', 'DELANTERA', 'TRASERA', 'INTEGRAL');

-- AlterTable
ALTER TABLE "Bike"
  ADD COLUMN "vehicleCategory" "VehicleCategory",
  ADD COLUMN "version" TEXT,
  ADD COLUMN "color" TEXT,
  ADD COLUMN "fuel" "FuelType",
  ADD COLUMN "transmission" "TransmissionType",
  ADD COLUMN "drive" "DriveType",
  ADD COLUMN "engine" TEXT,
  ADD COLUMN "powerHp" INTEGER,
  ADD COLUMN "doors" INTEGER,
  ADD COLUMN "seats" INTEGER,
  ADD COLUMN "financingAvailable" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Bike_vehicleCategory_idx" ON "Bike"("vehicleCategory");
