import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// En producción VITE_API_BASE_URL apunta al dominio de Vercel. El default
// relativo /api evita dejar un localhost hardcodeado en el bundle.
const configuredBase = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');
const API_BASE_URL = configuredBase.endsWith('/api') ? configuredBase : `${configuredBase}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Adjunta el token de acceso en cada petición
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jay_motors_access_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de respuestas: renueva token automáticamente ante 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('jay_motors_refresh_token');
          if (!refreshToken) {
            throw new Error('No hay token de actualización');
          }

          const { data } = await api.post<{ accessToken: string }>(
            '/auth/refresh',
            { refreshToken }
          );

          const newToken = data.accessToken;
          localStorage.setItem('jay_motors_access_token', newToken);
          processQueue(null, newToken);
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('jay_motors_access_token');
          localStorage.removeItem('jay_motors_refresh_token');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (token) {
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
        }
        return api(originalRequest);
      });
    }

    // Limpieza de sesión ante 401 persistente
    if (error.response?.status === 401) {
      localStorage.removeItem('jay_motors_access_token');
      localStorage.removeItem('jay_motors_refresh_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
