import * as React from 'react';
import { useEffect, useState } from 'react';
import { Heart, Trash2, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { PageIntro } from '@/components/public/PageIntro';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { useFavoritesStore } from '@/stores/favorites';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';

export const Favorites: React.FC = () => {
  const ids = useFavoritesStore((state) => state.ids);
  const clear = useFavoritesStore((state) => state.clear);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react/set-state-in-effect -- reinicio del estado antes de cada carga
    setLoading(true);
    setError(false);
    bikesService
      .list({ limit: 100 })
      .then(({ data }) => {
        if (cancelled) return;
        setBikes(Array.isArray(data) ? data.filter((bike) => ids.includes(bike.id)) : []);
      })
      .catch(() => {
        if (cancelled) return;
        setBikes([]);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, reloadKey]);

  const favoriteBikes = ids.map((id) => bikes.find((bike) => bike.id === id)).filter(Boolean) as Bike[];

  if (ids.length === 0) {
    return (
      <div className="container-jay flex min-h-[75vh] items-center py-12 sm:py-16">
        <EmptyState
          icon={<Heart size={30} />}
          code="00"
          title={<>Aún no hay <span className="text-jay-red">favoritos</span></>}
          description="Tocá el corazón en las motos que te gusten y guardalas aquí para compararlas o consultarlas después."
          actions={
            <Link to="/motos" className="btn btn-red px-7 py-4 text-xs">
              Explorar catálogo <ChevronRight size={16} />
            </Link>
          }
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jay-black pb-16 text-jay-white">
      {/* 01 / Encabezado */}
      <PageIntro
        index="01"
        eyebrow="Tu garaje digital"
        title={<>Favoritos</>}
        outline="GARAGE"
        description={
          <p>
            {ids.length} moto{ids.length !== 1 ? 's' : ''} guardada{ids.length !== 1 ? 's' : ''} en este dispositivo.
            Vas a poder compararlas o consultarlas cuando quieras.
          </p>
        }
        actions={
          <button type="button" onClick={clear} className="btn btn-ghost w-full px-5 py-3 text-xs sm:w-auto">
            <Trash2 size={15} /> Vaciar favoritos
          </button>
        }
      />

      {/* 02 / Listado */}
      <section className="container-jay py-12 sm:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">02</span>
          <span className="h-px w-10 bg-jay-red" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">Motos guardadas</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => <SkeletonCard key={index} />)}
          </div>
        ) : error ? (
          <ErrorState
            title="No pudimos cargar tus favoritos"
            message="Las motos guardadas están en este dispositivo, pero no pudimos consultar sus datos. Intentá de nuevo."
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        ) : favoriteBikes.length === 0 ? (
          <EmptyState
            icon={<SearchX size={30} />}
            code="404"
            title={<>Ya no están <span className="text-jay-red">publicadas</span></>}
            description="No encontramos las motos guardadas en el catálogo actual. Pueden haber dejado de estar publicadas."
            actions={
              <Link to="/motos" className="btn btn-red px-7 py-4 text-xs">
                Ver catálogo actual <ChevronRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBikes.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}

        <Link to="/motos" className="mt-10 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white">
          <ChevronLeft size={15} /> Volver al catálogo
        </Link>
      </section>
    </div>
  );
};
