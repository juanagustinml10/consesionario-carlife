import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { env } from '../config/env';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: Number(env.JWT_ACCESS_TTL),
    subject: payload.sub,
  });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: Number(env.JWT_REFRESH_TTL),
    subject: payload.sub,
  });

/**
 * Crea una sesión de refresco asociada al usuario y devuelve el par de tokens.
 */
export const createSession = async (
  userId: string,
  email: string,
  role: string,
): Promise<TokenPair> => {
  const payload: JwtPayload = { sub: userId, email, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date(Date.now() + Number(env.JWT_REFRESH_TTL) * 1000);

  await prisma.session.create({
    data: { userId, token: refreshToken, expiresAt },
  });

  return { accessToken, refreshToken };
};

/**
 * Valida un refresh token: firma JWT, sesión activa y no expirada.
 */
export const validateRefresh = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;

  const session = await prisma.session.findFirst({
    where: {
      token: refreshToken,
      userId: payload.sub,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  return { session, user: session.user, payload };
};

/**
 * Rota la sesión: invalida el refresh token actual y crea uno nuevo.
 */
export const rotateSession = async (
  refreshToken: string,
): Promise<{ pair: TokenPair; user: { id: string; email: string; role: string } } | null> => {
  const validated = await validateRefresh(refreshToken);
  if (!validated) return null;

  await prisma.session.delete({ where: { id: validated.session.id } });

  const pair = await createSession(
    validated.user.id,
    validated.user.email,
    validated.user.role,
  );

  return {
    pair,
    user: {
      id: validated.user.id,
      email: validated.user.email,
      role: validated.user.role,
    },
  };
};

export const revokeSession = async (refreshToken: string) => {
  await prisma.session.deleteMany({ where: { token: refreshToken } });
};

export const cleanupExpiredSessions = async () => {
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
};
