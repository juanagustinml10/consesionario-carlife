import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Motorbike,
  CheckCircle,
  Clock,
  CreditCard,
  Activity,
  List,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { statsService } from '@/services/stats';

type Stat = {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ReactNode;
  color: 'red' | 'gray';
};

const STATS: Stat[] = [
  {
    label: 'Total de publicaciones',
    value: '--',
    icon: <Motorbike size={24} />,
    color: 'gray',
  },
  {
    label: 'Disponibles',
    value: '--',
    icon: <CheckCircle size={24} />,
    color: 'gray',
  },
  {
    label: 'Reservadas',
    value: '--',
    icon: <Clock size={24} />,
    color: 'gray',
  },
  {
    label: 'Vendidas',
    value: '--',
    icon: <CreditCard size={24} />,
    color: 'gray',
  },
  {
    label: 'Visitas totales',
    value: '--',
    icon: <Activity size={24} />,
    color: 'gray',
  },
];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    totalBikes: number;
    available: number;
    reserved: number;
    sold: number;
    featured: number;
    totalViews: number;
  } | null>(null);
  const [recent, setRecent] = useState<Array<{ id: string; title: string; status: string; views: number; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      statsService.getDashboardStats().catch(() => null),
      statsService.getRecentBikes().catch(() => null),
    ]).then(([statsRes, recentRes]) => {
      if (cancelled) return;
      setStats(statsRes ?? null);
      setRecent(recentRes ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const renderStat = (stat: Stat, idx: number) => {
    const values = stats
      ? [
          stats.totalBikes,
          stats.available,
          stats.reserved,
          stats.sold,
          stats.totalViews,
        ]
        : [null, null, null, null, null];
    return (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * idx }}
        className="rounded-2xl border border-white/8 bg-jay-surface shadow-card"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">{stat.label}</CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400">
            {stat.icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? '--' : values[idx] ?? '--'}
          </div>
        </CardContent>
      </motion.div>
    );
  };

  return (
    <div className="bg-transparent">
      <div className="container-jay">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Resumen del estado de las publicaciones de JAY MOTOS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
          {STATS.map((stat, i) => renderStat(stat, i))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/8 bg-jay-surface shadow-card">
            <CardHeader>
              <CardTitle>Publicaciones recientes</CardTitle>
              <CardDescription>
                Últimas motocicletas publicadas en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading || recent.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
                    {loading ? 'Cargando...' : 'No hay publicaciones recientes.'}
                  </div>
                ) : (
                  recent.map((bike) => (
                    <div key={bike.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                          <Motorbike size={18} className="text-gray-500" />

                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{bike.title}</p>
                          <p className="text-xs text-gray-500">{new Date(bike.createdAt).toLocaleDateString('es-AR')}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{bike.views} visitas</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link
                to="/admin/motos"
                className="text-xs font-medium text-jay-red hover:text-white transition-colors"
              >
                Ver todas las publicaciones
              </Link>
            </CardFooter>
          </div>

          <div className="rounded-2xl border border-white/8 bg-jay-surface shadow-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
              Accesos rápidos
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/motos/nuevo"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 hover:bg-transparent transition-colors text-gray-300"
              >
                <Motorbike size={18} className="text-jay-red" />
                <span>Publicar nueva motocicleta</span>
              </Link>
              <Link
                to="/admin/motos"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/8 hover:bg-transparent transition-colors text-gray-300"
              >
                <List size={18} />
                <span>Gestionar publicaciones existentes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
