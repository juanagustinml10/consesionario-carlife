import type { PaginatedResponse } from '@/types';

/**
 * La API puede responder HTML (por ejemplo si una URL de `VITE_API_BASE_URL`
 * apunta al propio SPA y el catch-all de Cloudflare devuelve index.html).
 * Validar en el límite de datos evita que un valor inesperado llegue al estado
 * de React y reviente un render con `undefined.length` o `undefined.map`.
 */
export class ApiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiResponseError';
  }
}

export const requireObject = <T>(value: unknown, label = 'respuesta'): T => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiResponseError(`La API devolvió un ${label} inválido.`);
  }
  return value as T;
};

export const requireArray = <T>(value: unknown, label = 'lista'): T[] => {
  if (!Array.isArray(value)) {
    throw new ApiResponseError(`La API devolvió una ${label} inválida.`);
  }
  return value as T[];
};

/** Valida el envelope paginado sin confiar en que `meta` esté completo. */
export const requirePaginated = <T>(value: unknown): PaginatedResponse<T> => {
  const body = requireObject<Record<string, unknown>>(value, 'listado');
  if (!Array.isArray(body.data)) {
    throw new ApiResponseError('La API devolvió un listado inválido.');
  }
  const meta = (
    body.meta !== null && typeof body.meta === 'object' ? body.meta : {}
  ) as Record<string, unknown>;
  return {
    data: body.data as T[],
    meta: {
      page: Number(meta.page) || 1,
      limit: Number(meta.limit) || body.data.length,
      total: Number(meta.total) || body.data.length,
      totalPages: Number(meta.totalPages) || 1,
    },
  };
};
