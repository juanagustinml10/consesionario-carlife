import * as React from 'react';
import { useEffect, useState } from 'react';
import { Heart, Trash2, ChevronRight } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { useFavoritesStore } from '@/stores/favorites';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';

export const Favorites: React.FC = () => {
  const ids = useFavoritesStore((state) => state.ids);
  const clear = useFavoritesStore((state) => state.clear);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    bikesService
      .list({ limit: 100 })
      .then(({ data }) => {
        if (cancelled) return;
        setBikes(data.filter((b) => ids.includes(b.id)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const favoriteBikes = ids.map((id) => bikes.find((b) => b.id === id)).filter(Boolean) as Bike[];

  if (ids.length === 0) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-jay-black px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-jay-red/30 bg-jay-red/10">
          <Heart size={34} className="text-jay-red" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
          Aún no hay<br /><span className="text-jay-red">favoritos.</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
          Tocá el corazón en las motos que te gusten y guardalas aquí para compararlas o consultarlas después.
        </p>
        <Link to="/motos" className="btn btn-red mt-8 px-7 py-4 text-xs">
          Explorar catálogo <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jay-black pb-16 text-jay-white">
      <section className="border-b border-white/5 bg-jay-panel">
        <div className="container-jay flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Tu garaje digital</span>
            <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
              Favoritos<span className="text-jay-red">.</span>
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {favoriteBikes.length} moto{favoriteBikes.length !== 1 ? 's' : ''} guardada{favoriteBikes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={clear} className="btn btn-ghost px-5 py-3 text-xs">
            <Trash2 size={15} />
            Vaciar favoritos
          </button>
        </div>
      </section>

      <section className="container-jay py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-jay-surface" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBikes.map((bike) => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}
      </section>
    </div>
  );
};
