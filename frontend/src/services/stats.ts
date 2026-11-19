import api from '@/lib/api';
import { requireArray, requireObject } from '@/lib/api-response';

export interface DashboardStats {
  totalBikes: number;
  available: number;
  reserved: number;
  sold: number;
  featured: number;
  totalViews: number;
}

export interface RecentBike {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
}

export const statsService = {
  /** Estadísticas del panel administrativo */
  getDashboardStats: async () => {
    const { data } = await api.get('/stats/dashboard');
    return requireObject<DashboardStats>(data, 'estadística');
  },

  /** Publicaciones recientes del admin */
  getRecentBikes: async () => {
    const { data } = await api.get('/stats/recent-bikes');
    return requireArray<RecentBike>(data, 'lista de publicaciones');
  },
};
