import api from '@/lib/api';
import type { AdminUser, AuthTokens } from '@/types';

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  login: async (input: LoginInput) => {
    const { data } = await api.post<AuthTokens>('/auth/login', input);
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('jay_motors_access_token');
      localStorage.removeItem('jay_motors_refresh_token');
      localStorage.removeItem('jay_motors_user');
    }
  },

  getStoredUser: (): AdminUser | null => {
    const raw = localStorage.getItem('jay_motors_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },

  setSession: (tokens: AuthTokens, user: AdminUser) => {
    localStorage.setItem('jay_motors_access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('jay_motors_refresh_token', tokens.refreshToken);
    }
    localStorage.setItem('jay_motors_user', JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem('jay_motors_access_token');
    localStorage.removeItem('jay_motors_refresh_token');
    localStorage.removeItem('jay_motors_user');
  },

  isAuthenticated: () => !!localStorage.getItem('jay_motors_access_token'),
};
