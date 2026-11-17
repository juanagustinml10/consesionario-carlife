import * as React from 'react';
import { Heart, ChevronRight, Scale, Phone } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { cn } from '@/lib/utils';
import type { Bike } from '@/types';

interface BikeCardProps {
  bike: Bike;
  className?: string;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, className }) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bike.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const addToCompare = useCompareStore((state) => state.add);
  const inCompare = useCompareStore((state) => state.isInCompare(bike.id));
  const canCompare = useCompareStore((state) => state.canAdd());
  const primaryImage = bike.images.find((img) => img.isPrimary) ?? bike.images[0];

  const whatsappMessage = `Hola JAY MOTOS, me interesa la moto ${bike.title} (${bike.year}). ¿Podrían darme más información?`;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-jay-surface transition-all duration-300 hover:-translate-y-1 hover:border-jay-red/40 hover:shadow-red',
        className
      )}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={bike.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <ImagePlaceholder width={600} height={450} label="Foto de prueba de la moto" className="h-full w-full" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-jay-surface via-jay-surface/20 to-transparent" />

        {/* Chips superiores */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className={cn(
            'rounded-md px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em]',
            bike.condition === 'NUEVA' ? 'bg-jay-red text-white' : 'bg-white/90 text-black'
          )}>
            {bike.condition === 'NUEVA' ? '0 km' : 'Usada'}
          </span>
          {bike.featured && (
            <span className="rounded-md border border-jay-red/40 bg-black/70 px-2 py-1 font-display text-[9px] font-bold uppercase tracking-[0.25em] text-jay-red-soft backdrop-blur">
              Destacada
            </span>
          )}
        </div>

        {/* Favorito */}
        <button
          onClick={() => toggleFavorite(bike.id)}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-all hover:scale-110 hover:bg-black/80"
        >
          <Heart
            size={19}
            className={isFavorite ? 'fill-jay-red stroke-jay-red' : 'stroke-white'}
            strokeWidth={2}
          />
        </button>

        {/* Estado */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-200 backdrop-blur">
            <span className={cn(
              'h-1.5 w-1.5 rounded-full',
              bike.status === 'DISPONIBLE' ? 'bg-green-400 animate-pulse' : bike.status === 'RESERVADA' ? 'bg-amber-400' : 'bg-jay-red'
            )} />
            {bike.status === 'DISPONIBLE' ? 'Disponible' : bike.status === 'RESERVADA' ? 'Reservada' : 'Vendida'}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-jay-red-soft">
          {bike.brand?.name ?? 'JAY MOTOS'}
        </p>
        <Link to={`/motos/${bike.slug}`} className="mt-1 block">
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-white line-clamp-2 min-h-[2.4rem]">
            {bike.model || bike.title}
          </h3>
        </Link>
        <p className="mt-1.5 text-xs text-gray-400">
          {bike.year} · {bike.displacementCc ? `${bike.displacementCc} cc` : 'Cilindrada a confirmar'}{bike.mileageKm != null ? ` · ${bike.mileageKm.toLocaleString('es-AR')} km` : ''}
        </p>

        {/* Precio + acciones */}
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Precio</p>
            <p className="font-display text-2xl font-extrabold leading-none text-white">
              {bike.price.toLocaleString('es-AR')}
              <span className="ml-1 text-xs font-bold text-gray-400">{bike.currency}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCompare(bike)}
              disabled={inCompare || !canCompare}
              title={inCompare ? 'Ya está en el comparador' : 'Agregar al comparador'}
              aria-label={inCompare ? 'Ya está en el comparador' : 'Agregar al comparador'}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border transition-all',
                inCompare
                  ? 'border-jay-red bg-jay-red text-white'
                  : 'border-white/10 text-gray-300 hover:border-jay-red hover:text-white disabled:opacity-30'
              )}
            >
              <Scale size={17} />
            </button>
            <a
              href={`https://wa.me/5491112345678?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar por WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-300 transition-all hover:border-jay-red hover:text-white"
            >
              <Phone size={17} />
            </a>
          </div>
        </div>

        <Link
          to={`/motos/${bike.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-jay-red-soft transition-colors hover:text-white"
        >
          Ver ficha <ChevronRight size={15} />
        </Link>
      </div>
    </article>
  );
};
