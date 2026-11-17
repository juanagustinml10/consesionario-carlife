import type { Request, Response, NextFunction } from 'express';

/**
 * Envuelve handlers async para reenviar errores automáticamente al middleware de errores.
 * Evita bloques try/catch repetidos en cada ruta.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
