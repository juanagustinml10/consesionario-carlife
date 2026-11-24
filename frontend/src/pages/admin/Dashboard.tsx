import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  List,
  Plus,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { statsService } from '@/services/stats';

type StatsResponse = {
  totalBikes: number;
  available: number;
  reserved: number;
  sold: number;
  featured: number;
  totalViews: number;
};

type RecentBike = {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
};

const STAT_ICONS = [CarFront, CheckCircle2, Clock3, CreditCard, Activity];
const STAT_LABELS = [
  'Total de publicaciones',
  'Disponibles',
  'Reservadas',
  'Vendidas',
  'Visitas totales',
];

export const Dashboard = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recent, setRecent] = useState<RecentBike[]>([]);
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

  const values = stats
    ? [
        stats.totalBikes,
        stats.available,
        stats.reserved,
        stats.sold,
        stats.totalViews,
      ]
    : Array.from({ length: 5 }, () => null);

  return (
    <div>
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-6">
        <div>
          <span className="eyebrow eyebrow-light">Resumen general</span>
          <h1 className="display-md mt-3">Dashboard</h1>
          <p className="mt-3 text-sm text-white/55">
            Estado de las publicaciones del catálogo CARLIFE.
          </p>
        </div>
        <Link to="/admin/motos/nuevo" className="btn btn-light">
          <Plus size={16} /> Nueva publicación
        </Link>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-5">
        {STAT_LABELS.map((label, index) => {
          const Icon = STAT_ICONS[index];
          return (
            <Card key={label} className="border-0 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="micro-label min-w-0 break-words">{label}</p>
                <Icon size={17} className="shrink-0 text-white/45" />
              </div>
              <p className="data-num mt-5 text-3xl leading-none sm:text-4xl">
                {loading ? '--' : values[index] ?? '--'}
              </p>
              <div className="mt-4 h-px w-8 bg-white/60" />
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Publicaciones recientes</CardTitle>
              <CardDescription className="mt-2">
                Últimos vehículos cargados en el sistema.
              </CardDescription>
            </div>
            <span className="data-num text-[10px] text-white/40">
              {recent.length.toString().padStart(2, '0')}
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-10 text-center text-sm text-white/50">Cargando…</p>
            ) : recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/50">
                No hay publicaciones recientes.
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {recent.map((bike) => (
                  <div
                    key={bike.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-cc-black">
                        <CarFront size={18} className="text-white/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {bike.title}
                        </p>
                        <p className="data-num mt-0.5 text-[11px] text-white/45">
                          {new Date(bike.createdAt).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <span className="data-num shrink-0 text-[11px] text-white/45">
                      {bike.views} vistas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link
              to="/admin/motos"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Ver todas <ArrowUpRight size={14} />
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
            <CardDescription className="mt-2">
              Operaciones frecuentes del panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              <Link
                to="/admin/motos/nuevo"
                className="group flex items-center gap-4 border border-white/10 bg-cc-black p-4 transition-colors hover:border-white/40"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-white text-cc-black">
                  <Plus size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold text-white">
                  Publicar nuevo vehículo
                </span>
                <ArrowUpRight size={16} className="text-white/45 transition-colors group-hover:text-white" />
              </Link>
              <Link
                to="/admin/motos"
                className="group flex items-center gap-4 border border-white/10 bg-cc-black p-4 transition-colors hover:border-white/40"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/70">
                  <List size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold text-white">
                  Gestionar publicaciones existentes
                </span>
                <ArrowUpRight size={16} className="text-white/45 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </CardContent>
          <CardFooter className="data-num text-[10px] uppercase tracking-widest text-white/40">
            CARLIFE / Panel interno
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
