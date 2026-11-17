import api from '@/lib/api';

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
    const { data } = await api.get<DashboardStats>('/stats/dashboard');
    return data;
  },

  /** Publicaciones recientes del admin */
  getRecentBikes: async () => {
    const { data } = await api.get<Array<RecentBike>>('/stats/recent-bikes');
    return data;
  },
};
