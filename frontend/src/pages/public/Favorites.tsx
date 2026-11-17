import * as React from 'react';
import { useEffect, useState } from 'react';
import { ChevronLeft, Heart } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { useFavoritesStore } from '@/stores/favorites';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';

export const Favorites: React.FC = () => {
  const ids = useFavoritesStore((state) => state.ids);
  const clear = useFavoritesStore((state) => state.clear);

  const [bikes, setBikes] = useState<Record<string, Bike>>({});

  // Cargar los datos reales de cada moto favorita desde el catálogo
  useEffect(() => {
    let cancelled = false;
    bikesService
      .list({ limit: 100 })
      .then(({ data }) => {
        if (cancelled) return;
        const next: Record<string, Bike> = {};
        data.forEach((b) => {
          if (ids.includes(b.id)) next[b.id] = b;
        });
        setBikes(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const favoriteBikes = ids.map((id) => bikes[id]).filter(Boolean) as Bike[];

  if (ids.length === 0) {
    return (
      <div className="bg-jay-white py-24">
        <div className="container-jay text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jay-black/5 mb-6">
            <Heart size={32} className="text-jay-black/40" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Sin favoritos todavía</h2>
          <p className="text-jay-black/60 mb-10 max-w-md mx-auto">
            Dale al corazón en las motos que te gusten para guardarlas aquí y consultarlas después.
          </p>
          <Link
            to="/motos"
            className="inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black transition-colors"
          >
            Ir al catálogo <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jay-white">
      <section className="border-b border-jay-black/5 bg-jay-white">
        <div className="container-jay py-6">
          <h1 className="font-display text-2xl font-bold">Tus favoritos</h1>
          <p className="text-sm text-jay-black/50">
            {favoriteBikes.length} motocicleta{favoriteBikes.length !== 1 ? 's' : ''} guardada{favoriteBikes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-jay">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={clear}
              disabled={favoriteBikes.length === 0}
              className="text-sm font-medium text-jay-red hover:text-jay-black underline underline-offset-4 disabled:opacity-50"
            >
              <XIcon size={16} /> Vaciar favoritos
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
