import type { BikeCondition, BikeStatus } from '@/types';

/** Formato monetario único para todo el frontend. */
export const formatPrice = (price: number, currency = 'ARS') =>
  `$${price.toLocaleString('es-AR')} ${currency}`;

/** Kilometraje: las unidades 0 km no declaran kilometraje en la API. */
export const formatMileage = (km: number | null | undefined) =>
  km == null ? '0 km' : `${km.toLocaleString('es-AR')} km`;

export const formatDisplacement = (cc: number | null | undefined) =>
  cc ? `${cc} cc` : 'A confirmar';

export const conditionLabel = (condition: BikeCondition) =>
  condition === 'NUEVA' ? '0 km' : 'Usada';

export const statusLabel = (status: BikeStatus) =>
  status === 'DISPONIBLE' ? 'Disponible' : status === 'RESERVADA' ? 'Reservada' : 'Vendida';

/** Convierte claves técnicas (ej. "front_suspension") en etiquetas legibles. */
export const featureLabel = (key: string) =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
