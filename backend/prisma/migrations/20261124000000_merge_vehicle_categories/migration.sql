-- Unifica las categorías CAMIONETA y SUV en una sola: CAMIONETA_SUV
-- ("Camionetas/SUV" en la interfaz). No se elimina ninguna publicación:
-- las existentes se recategorizan y las que no tenían categoría siguen en NULL.
--
-- PostgreSQL no permite quitar valores de un enum, por eso se crea uno nuevo
-- con el mismo nombre y se copia el valor anterior con un mapeo explícito.

ALTER TYPE "VehicleCategory" RENAME TO "VehicleCategoryOld";

CREATE TYPE "VehicleCategory" AS ENUM ('AUTO', 'CAMIONETA_SUV');

ALTER TABLE "Bike" ADD COLUMN "vehicleCategoryNew" "VehicleCategory";

UPDATE "Bike"
SET "vehicleCategoryNew" = CASE
  WHEN "vehicleCategory"::text = 'AUTO' THEN 'AUTO'::"VehicleCategory"
  WHEN "vehicleCategory"::text IN ('CAMIONETA', 'SUV') THEN 'CAMIONETA_SUV'::"VehicleCategory"
  ELSE NULL
END;

-- El índice anterior se elimina junto con la columna original.
ALTER TABLE "Bike" DROP COLUMN "vehicleCategory";
ALTER TABLE "Bike" RENAME COLUMN "vehicleCategoryNew" TO "vehicleCategory";

DROP TYPE "VehicleCategoryOld";

CREATE INDEX "Bike_vehicleCategory_idx" ON "Bike"("vehicleCategory");
