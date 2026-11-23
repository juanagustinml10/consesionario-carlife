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
      <div className="container-cc flex min-h-[75vh] items-center py-12 sm:py-16">
        <EmptyState
          icon={<Heart size={30} strokeWidth={1.5} />}
          code="00"
          title={<>Aún no hay favoritos</>}
          description="Tocá el corazón en los vehículos que te gusten y guardalos aquí para consultarlos después."
          actions={
            <Link to="/motos" className="btn btn-dark px-7">
              Explorar catálogo <ChevronRight size={16} />
            </Link>
          }
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-cc-black">
      <PageIntro
        index="01"
        eyebrow="Tu selección"
        title={<>Favoritos</>}
        outline="GARAGE"
        description={
          <p>
            {ids.length} vehículo{ids.length !== 1 ? 's' : ''} guardado{ids.length !== 1 ? 's' : ''} en este dispositivo.
            Vas a poder consultarlos cuando quieras.
          </p>
        }
        actions={
          <button type="button" onClick={clear} className="btn btn-outline-dark w-full px-5 sm:w-auto">
            <Trash2 size={15} /> Vaciar favoritos
          </button>
        }
      />

      <section className="container-cc py-12 sm:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="data-num text-xs text-cc-gray">02</span>
          <span className="h-px w-10 bg-black/20" />
          <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Vehículos guardados</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => <SkeletonCard key={index} />)}
          </div>
        ) : error ? (
          <ErrorState
            title="No pudimos cargar tus favoritos"
            message="Los vehículos guardados están en este dispositivo, pero no pudimos consultar sus datos. Intentá de nuevo."
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        ) : favoriteBikes.length === 0 ? (
          <EmptyState
            icon={<SearchX size={30} strokeWidth={1.5} />}
            code="404"
            title={<>Ya no están publicados</>}
            description="No encontramos los vehículos guardados en el catálogo actual. Pueden haber dejado de estar publicados."
            actions={
              <Link to="/motos" className="btn btn-dark px-7">
                Ver catálogo actual <ChevronRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBikes.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}

        <Link to="/motos" className="mt-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cc-gray transition-colors hover:text-black">
          <ChevronLeft size={15} /> Volver al catálogo
        </Link>
      </section>
    </div>
  );
};
