import * as React from 'react';
import { Heart, ArrowUpRight, Scale, MessageCircle } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { cn } from '@/lib/utils';
import { buildBikeWhatsAppLink } from '@/lib/constants';
import { formatDisplacement, formatMileage, formatPrice } from '@/lib/format';
import { ConditionTag, FeaturedTag, StatusTag } from '@/components/public/BikeBadges';
import type { Bike } from '@/types';

interface BikeCardProps {
  bike: Bike;
  className?: string;
  /** Las secciones claras de la home usan la variante light. */
  tone?: 'dark' | 'light';
  /** Tarjeta protagonista: imagen más ample y tipografía mayor. */
  feature?: boolean;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, className, tone = 'dark', feature = false }) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bike.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const addToCompare = useCompareStore((state) => state.add);
  const inCompare = useCompareStore((state) => state.isInCompare(bike.id));
  const canCompare = useCompareStore((state) => state.canAdd());
  const images = bike.images ?? [];
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];
  const whatsappLink = buildBikeWhatsAppLink(bike);
  const light = tone === 'light';

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border transition-all duration-500',
        light
          ? 'border-black/10 bg-white text-jay-black hover:border-jay-red/60 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]'
          : 'border-white/8 bg-jay-surface text-white hover:border-jay-red/50 hover:shadow-red',
        'hover:-translate-y-1',
        className
      )}
    >
      {/* Fotografía protagonista */}
      <div className={cn('relative overflow-hidden bg-black', feature ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]')}>
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={`${bike.brand?.name ?? ''} ${bike.model || bike.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder width={800} height={600} label="Foto no disponible" className="h-full w-full" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-jay-red/70" aria-hidden="true" />

        {/* Etiquetas */}
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <ConditionTag condition={bike.condition} overlay />
          {bike.featured && <FeaturedTag overlay />}
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(bike.id)}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/60 text-white backdrop-blur transition-colors hover:border-jay-red hover:bg-jay-red"
        >
          <Heart size={18} className={isFavorite ? 'fill-white stroke-white' : ''} strokeWidth={2} />
        </button>

        <div className="absolute bottom-4 left-4">
          <StatusTag status={bike.status} overlay />
        </div>
      </div>

      {/* Contenido */}
      <div className={cn('flex flex-1 flex-col p-5', feature && 'sm:p-7')}>
        <p className="font-display text-[10px] font-extrabold uppercase tracking-[0.3em] text-jay-red">
          {bike.brand?.name ?? 'JAY MOTOS'}
        </p>
        <Link to={`/motos/${bike.slug}`} className="mt-1.5 block">
          <h3 className={cn(
            'font-display font-extrabold uppercase italic leading-[0.95] line-clamp-2 transition-colors group-hover:text-jay-red',
            feature ? 'text-3xl sm:text-4xl' : 'text-2xl'
          )}>
            {bike.model || bike.title}
          </h3>
        </Link>
        <p className={cn('mt-2 text-xs', light ? 'text-black/55' : 'text-gray-400')}>
          {bike.year} · {formatDisplacement(bike.displacementCc)} · {formatMileage(bike.mileageKm)}
        </p>

        <div className={cn('mt-auto flex items-end justify-between gap-3 border-t pt-4', light ? 'border-black/10' : 'border-white/8')}>
          <div>
            <p className={cn('text-[9px] font-bold uppercase tracking-[0.25em]', light ? 'text-black/45' : 'text-gray-500')}>
              Precio publicado
            </p>
            <p className="mt-0.5 font-display text-2xl font-extrabold leading-none text-jay-red sm:text-3xl">
              {formatPrice(bike.price, bike.currency)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => addToCompare(bike)}
              disabled={inCompare || !canCompare}
              title={inCompare ? 'Ya está en el comparador' : 'Agregar al comparador'}
              aria-label={inCompare ? 'Ya está en el comparador' : 'Agregar al comparador'}
              className={cn(
                'flex h-9 w-9 items-center justify-center border transition-colors',
                inCompare
                  ? 'border-jay-red bg-jay-red text-white'
                  : light
                    ? 'border-black/15 text-black/60 hover:border-jay-red hover:text-jay-red disabled:opacity-30'
                    : 'border-white/12 text-gray-300 hover:border-jay-red hover:text-white disabled:opacity-30'
              )}
            >
              <Scale size={16} />
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar por WhatsApp"
              className={cn(
                'flex h-9 w-9 items-center justify-center border transition-colors',
                light
                  ? 'border-black/15 text-black/60 hover:border-jay-red hover:text-jay-red'
                  : 'border-white/12 text-gray-300 hover:border-jay-red hover:text-white'
              )}
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <Link
          to={`/motos/${bike.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-jay-red transition-colors hover:gap-2.5"
        >
          Ver ficha <ArrowUpRight size={15} />
        </Link>
      </div>

      <span className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-jay-red transition-all duration-500 group-hover:w-full" aria-hidden="true" />
    </article>
  );
};
