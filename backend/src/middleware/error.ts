import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isProduction } from '../config/env.js';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Middleware centralizado de manejo de errores.
 * Devuelve respuestas JSON consistentes sin exponer detalles internos en producción.
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Multer lanza su propio error antes de que storage.service pueda validar el tamaño.
  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      message: 'La imagen supera el tamaño máximo permitido',
      statusCode: 413,
    });
  }

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

  const requestedStatus = err.statusCode ?? 500;
  const statusCode = requestedStatus >= 400 && requestedStatus <= 599 ? requestedStatus : 500;
  const isClientError = statusCode < 500;

  // En producción los errores 5xx se registran con todo su detalle en Runtime Logs,
  // pero el cliente solo recibe un mensaje genérico (puede contener hosts o SQL).
  const message =
    isClientError || !isProduction
      ? err.message || (isClientError ? 'Solicitud inválida' : 'Error interno del servidor')
      : 'Error interno del servidor';

  if (!isClientError) {
    console.error(`[error] ${req.method} ${req.originalUrl} -> ${statusCode}`, err);
  }

  return res.status(statusCode).json({
    message,
    statusCode,
    ...(isClientError && err.errors ? { errors: err.errors } : {}),
  });
};
