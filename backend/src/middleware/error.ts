import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Middleware centralizado de manejo de errores.
 * Devuelve respuestas JSON consistentes sin exponer detalles internos en producción.
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || 'Error interno del servidor';

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.');
      errors[path] = [...(errors[path] ?? []), issue.message];
    }
    return res.status(400).json({ message: 'Error de validación', statusCode: 400, errors });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'Ya existe un registro con ese valor único',
        statusCode: 409,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Registro no encontrado', statusCode: 404 });
    }
  }

  console.error(err);
  res.status(statusCode).json({ message, statusCode });
};
