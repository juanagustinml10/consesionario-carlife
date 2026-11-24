import {
  DRIVE_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  VEHICLE_EQUIPMENT,
} from '@/lib/constants';
import type {
  BikeCondition,
  BikeStatus,
  DriveType,
  FuelType,
  TransmissionType,
  VehicleCategory,
} from '@/types';

/** Formato monetario único para todo el frontend. */
export const formatPrice = (price: number, currency = 'ARS') =>
  `$${price.toLocaleString('es-AR')} ${currency}`;

/** Kilometraje: cuando no hay dato se muestra "A confirmar". */
export const formatMileage = (km: number | null | undefined) =>
  km == null ? 'A confirmar' : `${km.toLocaleString('es-AR')} km`;

export const formatEngine = (engine: string | null | undefined) =>
  engine?.trim() || 'A confirmar';

export const formatPower = (hp: number | null | undefined) =>
  hp ? `${hp} CV` : 'A confirmar';

export const formatCount = (value: number | null | undefined) =>
  value == null ? 'A confirmar' : String(value);

export const conditionLabel = (_condition: BikeCondition) => 'Usado';

export const vehicleCategoryLabel = (category: VehicleCategory | null | undefined) =>
  VEHICLE_CATEGORIES.find((item) => item.value === category)?.label ?? 'Sin definir';

export const fuelLabel = (fuel: FuelType | null | undefined) =>
  FUEL_TYPES.find((item) => item.value === fuel)?.label ?? 'A confirmar';

export const transmissionLabel = (transmission: TransmissionType | null | undefined) =>
  TRANSMISSIONS.find((item) => item.value === transmission)?.label ?? 'A confirmar';

export const driveLabel = (drive: DriveType | null | undefined) =>
  DRIVE_TYPES.find((item) => item.value === drive)?.label ?? 'A confirmar';

export const statusLabel = (status: BikeStatus) =>
  status === 'BORRADOR'
    ? 'Borrador'
    : status === 'DISPONIBLE'
      ? 'Disponible'
      : status === 'RESERVADA'
        ? 'Reservada'
        : 'Vendida';

/** Etiqueta legible del equipamiento canónico; respeta las claves personalizadas. */
export const featureLabel = (key: string) =>
  VEHICLE_EQUIPMENT.find((item) => item.key === key)?.label ??
  key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
