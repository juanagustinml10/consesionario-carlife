import prisma from '../lib/prisma';

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
  createdAt: Date;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [totalBikes, byStatus, featured, totalViews] = await Promise.all([
    prisma.bike.count(),
    prisma.bike.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.bike.count({ where: { featured: true } }),
    prisma.bike.aggregate({ _sum: { views: true } }),
  ]);

  const counts: Record<string, number> = {};
  for (const item of byStatus) {
    counts[item.status] = item._count.status;
  }

  return {
    totalBikes,
    available: counts.DISPONIBLE ?? 0,
    reserved: counts.RESERVADA ?? 0,
    sold: counts.VENDIDA ?? 0,
    featured,
    totalViews: Number(totalViews._sum.views ?? 0),
  };
};

export const getRecentBikes = async (): Promise<RecentBike[]> => {
  return prisma.bike.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      views: true,
      createdAt: true,
    },
  });
};
