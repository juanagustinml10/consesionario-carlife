import api from '@/lib/api';
import { requireObject } from '@/lib/api-response';
import type { AdminUser, AuthTokens } from '@/types';

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  login: async (input: LoginInput) => {
    const { data } = await api.post('/auth/login', input);
    const tokens = requireObject<AuthTokens>(data, 'respuesta de autenticación');
    if (typeof tokens.accessToken !== 'string') {
      throw new Error('La respuesta de autenticación no incluyó un token válido.');
    }
    return tokens;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    const tokens = requireObject<AuthTokens>(data, 'respuesta de autenticación');
    if (typeof tokens.accessToken !== 'string') {
      throw new Error('La respuesta de autenticación no incluyó un token válido.');
    }
    return tokens;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('carlife_access_token');
      localStorage.removeItem('carlife_refresh_token');
      localStorage.removeItem('carlife_user');
    }
  },

  getStoredUser: (): AdminUser | null => {
    const raw = localStorage.getItem('carlife_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },

  setSession: (tokens: AuthTokens, user: AdminUser) => {
    localStorage.setItem('carlife_access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('carlife_refresh_token', tokens.refreshToken);
    }
    localStorage.setItem('carlife_user', JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem('carlife_access_token');
    localStorage.removeItem('carlife_refresh_token');
    localStorage.removeItem('carlife_user');
  },

  isAuthenticated: () => !!localStorage.getItem('carlife_access_token'),
};
