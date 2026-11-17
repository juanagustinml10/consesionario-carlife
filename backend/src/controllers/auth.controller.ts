import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  comparePassword,
  createSession,
  revokeSession,
  rotateSession,
} from '../services/auth.service.js';
import prisma from '../lib/prisma.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    const err: any = new Error('Credenciales inválidas');
    err.statusCode = 401;
    throw err;
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { accessToken, refreshToken } = await createSession(user.id, email, user.role);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };

  const result = await rotateSession(refreshToken);
  if (!result) {
    const err: any = new Error('Sesión inválida o expirada');
    err.statusCode = 401;
    throw err;
  }

  res.json({
    accessToken: result.pair.accessToken,
    refreshToken: result.pair.refreshToken,
    user: result.user,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await revokeSession(refreshToken);
  }
  res.json({ ok: true });
});
