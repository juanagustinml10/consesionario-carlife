import * as React from 'react';
import { ChevronRight, Heart, Share2 } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

interface BikeCardProps {
  bike: Bike;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bike.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const addToCompare = useCompareStore((state) => state.add);
  const inCompare = useCompareStore((state) => state.isInCompare(bike.id));
  const canCompare = useCompareStore((state) => state.canAdd());
  const primaryImage = bike.images.find((img) => img.isPrimary) ?? bike.images[0];

  const whatsappMessage = `Hola JAY MOTOS, me interesa la moto ${bike.title} (${bike.year}). ¿Podrían darme más información?`;

  return (
    <article className="group relative overflow-hidden">
      <div className="aspect-video bg-jay-black/5 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={bike.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder width={600} height={400} label="Foto de prueba de la moto" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-jay-black/90 backdrop-blur text-jay-white text-xs font-semibold border border-white/20">
          {bike.condition === 'NUEVA' ? (
            <span className="flex items-center gap-1">0 km</span>
          ) : (
            <span className="flex items-center gap-1">Usada</span>
          )}
          {bike.status !== 'DISPONIBLE' && (
            <span
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                bike.status === 'VENDIDA'
                  ? 'bg-jay-red/10 text-jay-red border border-jay-red/30'
                  : 'bg-amber-100 text-amber-800 border border-amber/30'
              )}
            >
              {bike.status === 'RESERVADA' ? 'Reservada' : 'Vendida'}
            </span>
          )}
          {bike.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-jay-red text-jay-white text-[10px] font-bold uppercase tracking-wider border border-jay-red/30">
              Destacada
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{bike.price.toLocaleString('es-AR')}</span>
          <span className="text-sm text-jay-black/50">{bike.currency}</span>
        </div>
        <h3 className="mt-1 text-lg font-semibold leading-tight group-hover:text-jay-red transition-colors">
          {bike.title}
        </h3>
        <p className="mt-1 text-sm text-jay-black/60">
          {bike.brand?.name ?? ''} {bike.model} · {bike.year}{bike.displacementCc ? ` · ${bike.displacementCc}cc` : ''}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link to={`/motos/${bike.slug}`} className="flex items-center gap-1.5 text-sm font-medium text-jay-red hover:text-jay-black">
          Ver ficha <ChevronRight size={16} />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(bike.id)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={cn(
              'p-2 rounded-md transition-colors',
              isFavorite
                ? 'bg-jay-red text-jay-white'
                : 'bg-jay-black/5 text-jay-black hover:bg-jay-black hover:text-jay-white'
            )}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2} />
          </button>
          <button
            onClick={() => addToCompare(bike)}
            disabled={inCompare || !canCompare}
            aria-label={inCompare ? 'Ya está en el comparador' : 'Agregar al comparador'}
            className={cn(
              'p-2 rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none',
              inCompare
                ? 'bg-jay-red text-jay-white'
                : 'bg-jay-black/5 text-jay-black hover:bg-jay-black hover:text-jay-white'
            )}
            title={
              !canCompare && !inCompare
                ? 'Se pueden comparar hasta 2 motos'
                : inCompare
                  ? 'Ya agregada al comparador'
                  : 'Agregar al comparador'
            }
          >
            <Share2 size={18} />
          </button>
          <WhatsAppButton
            phone={import.meta.env.VITE_WHATSAPP_PHONE ?? ''}
            message={whatsappMessage}
            label="Consultar"
            className="hidden sm:flex p-2 rounded-md bg-jay-red text-jay-white hover:bg-black"
          />
        </div>
      </div>
    </article>
  );
};
