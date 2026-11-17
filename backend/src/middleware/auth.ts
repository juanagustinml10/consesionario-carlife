import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express';
import { env } from '../config/env';

/**
 * Middleware de autenticación por JWT (access token).
 * Espera el token en el header Authorization: Bearer <token>.
 */
export const authenticateAccess = (
  req: AuthenticatedRequest,
  res: { status: (code: number) => { send: (body: unknown) => void }; json: (body: unknown) => void },
  next: () => void,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Token de acceso requerido' });
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      sub: string;
      email: string;
      role: string;
    };
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).send({ message: 'Token de acceso inválido o expirado' });
  }
};
