import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  List,
  Motorbike,
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

const STAT_ICONS = [Motorbike, CheckCircle2, Clock3, CreditCard, Activity];
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
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-sf-border pb-6">
        <div>
          <span className="micro-label text-sf-red">Resumen general</span>
          <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-sf-ink-400">
            Estado de las publicaciones del catálogo SF MOTOS.
          </p>
        </div>
        <Link
          to="/admin/motos/nuevo"
          className="btn btn-red"
        >
          <Plus size={16} /> Nueva publicación
        </Link>
      </div>

      <div className="mb-9 grid grid-cols-2 gap-px border border-sf-border bg-sf-border lg:grid-cols-5">
        {STAT_LABELS.map((label, index) => {
          const Icon = STAT_ICONS[index];
          return (
            <Card key={label} className="border-0 bg-sf-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-bold uppercase leading-tight tracking-wider text-sf-ink-400">
                  {label}
                </p>
                <Icon size={17} className="shrink-0 text-sf-red" />
              </div>
              <p className="mt-5 font-display text-3xl leading-none text-white sm:text-4xl">
                {loading ? '--' : values[index] ?? '--'}
              </p>
              <div className="mt-4 h-px w-8 bg-sf-red/70" />
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Publicaciones recientes</CardTitle>
              <CardDescription className="mt-1">
                Últimas motocicletas cargadas en el sistema.
              </CardDescription>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-sf-ink-600">
              {recent.length.toString().padStart(2, '0')}
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-10 text-center text-sm text-sf-ink-500">Cargando…</p>
            ) : recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-sf-ink-500">
                No hay publicaciones recientes.
              </p>
            ) : (
              <div className="divide-y divide-sf-border">
                {recent.map((bike) => (
                  <div
                    key={bike.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-sf-border bg-sf-elevated">
                        <Motorbike size={18} className="text-sf-red" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {bike.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-sf-ink-500">
                          {new Date(bike.createdAt).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-sf-ink-400">
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
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sf-red transition-colors hover:text-white"
            >
              Ver todas <ArrowUpRight size={14} />
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
            <CardDescription className="mt-1">
              Operaciones frecuentes del panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              <Link
                to="/admin/motos/nuevo"
                className="group flex items-center gap-4 border border-sf-border bg-sf-elevated p-4 transition-colors hover:border-sf-red hover:bg-sf-red/5"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-sf-red text-white">
                  <Plus size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold text-white">
                  Publicar nueva motocicleta
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-sf-ink-500 transition-colors group-hover:text-sf-red"
                />
              </Link>
              <Link
                to="/admin/motos"
                className="group flex items-center gap-4 border border-sf-border bg-sf-elevated p-4 transition-colors hover:border-sf-red hover:bg-sf-red/5"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-sf-border-strong text-sf-ink-300">
                  <List size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold text-white">
                  Gestionar publicaciones existentes
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-sf-ink-500 transition-colors group-hover:text-sf-red"
                />
              </Link>
            </div>
          </CardContent>
          <CardFooter className="font-mono text-[10px] uppercase tracking-widest text-sf-ink-600">
            SF MOTOS / Panel interno
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
