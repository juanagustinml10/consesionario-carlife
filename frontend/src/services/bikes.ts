import api from '@/lib/api';
import type { Bike, PaginatedResponse, BikeCondition, BikeStatus } from '@/types';

export interface BikeFilters {
  q?: string;
  brand?: string;
  model?: string;
  year?: number;
  condition?: BikeCondition;
  displacementMin?: number;
  displacementMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: BikeStatus;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateBikeInput {
  title: string;
  brandId: string;
  model: string;
  year: number;
  condition: BikeCondition;
  displacementCc?: number | null;
  price: number;
  currency?: string;
  description?: string | null;
  status: BikeStatus;
  featured?: boolean;
}

export interface UpdateBikeInput extends Partial<CreateBikeInput> {}

const BASE = '/bikes';

export const bikesService = {
  /** Catálogo público con filtros y paginación */
  list: async (filters: BikeFilters = {}) => {
    const { data } = await api.get<PaginatedResponse<Bike>>(BASE, { params: filters });
    return data;
  },

  /** Ficha individual por slug */
  getBySlug: async (slug: string) => {
    const { data } = await api.get<Bike>(`${BASE}/slug/${slug}`);
    return data;
  },

  /** Detalle por ID (panel/admin) */
  getById: async (id: string) => {
    const { data } = await api.get<Bike>(`${BASE}/${id}`);
    return data;
  },

  /** Crear publicación (admin) */
  create: async (input: CreateBikeInput) => {
    const { data } = await api.post<Bike>(BASE, input);
    return data;
  },

  /** Editar publicación (admin) */
  update: async (id: string, input: UpdateBikeInput) => {
    const { data } = await api.patch<Bike>(`${BASE}/${id}`, input);
    return data;
  },

  /** Eliminar publicación (admin) */
  remove: async (id: string) => {
    const { data } = await api.delete<{ ok: boolean }>(`${BASE}/${id}`);
    return data;
  },

  /** Subir imágenes de una moto */
  uploadImages: async (bikeId: string, files: FileList | File[]) => {
    const formData = new FormData();
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    fileArray.forEach((file) => formData.append('images', file));
    const { data } = await api.post<{ images: Array<{ id: string; url: string }> }>(
      `${BASE}/${bikeId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  /** Establecer imagen principal */
  setPrimaryImage: async (bikeId: string, imageId: string) => {
    const { data } = await api.patch<Bike>(
      `${BASE}/${bikeId}/images/${imageId}/primary`
    );
    return data;
  },

  /** Eliminar una imagen */
  deleteImage: async (bikeId: string, imageId: string) => {
    const { data } = await api.delete<{ ok: boolean }>(
      `${BASE}/${bikeId}/images/${imageId}`
    );
    return data;
  },

  /** Registrar una visita/interés (público) */
  trackVisit: async (bikeId: string) => {
    await api.post(`/bikes/${bikeId}/visits`);
  },

  /** Marcas disponibles */
  listBrands: async () => {
    const { data } = await api.get<Array<{ id: string; name: string; slug: string }>>(
      '/brands'
    );
    return data;
  },
};
