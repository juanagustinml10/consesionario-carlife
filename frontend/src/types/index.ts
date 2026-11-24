/**
 * Tipos del dominio del catálogo de vehículos (contrato de la API).
 * Estos tipos reflejan el contrato de la API del backend.
 */

/** Condición del vehículo */
export type BikeCondition = 'NUEVA' | 'USADA';

/** Tipo de vehículo; null en publicaciones anteriores al campo. */
export type VehicleCategory = 'AUTO' | 'CAMIONETA_SUV';

/** Combustible declarado del vehículo. */
export type FuelType = 'NAFTA' | 'DIESEL' | 'HIBRIDO' | 'ELECTRICO' | 'GNC' | 'OTRO';

/** Tipo de caja. */
export type TransmissionType = 'MANUAL' | 'AUTOMATICA';

/** Tracción. `X2`/`X4` equivalen a 4x2 y 4x4 en la interfaz. */
export type DriveType = 'X2' | 'X4' | 'DELANTERA' | 'TRASERA' | 'INTEGRAL';

/** Estado de disponibilidad de la publicación */
export type BikeStatus = 'BORRADOR' | 'DISPONIBLE' | 'RESERVADA' | 'VENDIDA';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  createdAt: string;
}

export interface BikeImage {
  id: string;
  url: string;
  /** Miniatura opcional; si no viene se deriva de `url` (ver getThumbnailUrl). */
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  isPrimary: boolean;
  order: number;
  createdAt: string;
}

export interface BikeFeature {
  id: string;
  key: string;
  value: string;
}

export interface Bike {
  id: string;
  slug: string;
  title: string;
  brandId: string;
  brand?: Brand;
  model: string;
  version: string | null;
  year: number;
  vehicleCategory: VehicleCategory | null;
  condition: BikeCondition;
  color: string | null;
  fuel: FuelType | null;
  transmission: TransmissionType | null;
  drive: DriveType | null;
  engine: string | null;
  powerHp: number | null;
  doors: number | null;
  seats: number | null;
  mileageKm: number | null;
  financingAvailable: boolean;
  price: number;
  currency: string;
  description: string | null;
  status: BikeStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  images: BikeImage[];
  features: BikeFeature[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface WhatsAppContact {
  phone: string;
  message: string;
}
