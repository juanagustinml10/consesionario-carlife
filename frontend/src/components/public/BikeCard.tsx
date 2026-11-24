import * as React from 'react';
import { ArrowUpRight, Heart, Scale } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { cn } from '@/lib/utils';
import { fuelLabel, formatMileage, formatPrice, vehicleCategoryLabel } from '@/lib/format';
import { getThumbnailUrl } from '@/lib/images';
import { ConditionTag, FeaturedTag, StatusTag } from '@/components/public/BikeBadges';
import type { Bike } from '@/types';

interface BikeCardProps {
  bike: Bike;
  className?: string;
  /** Las tarjetas son claras por defecto en todo el sitio. */
  tone?: 'dark' | 'light';
  /** Tarjeta protagonista: imagen más amplia y tipografía mayor. */
  feature?: boolean;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, className, tone = 'light', feature = false }) => {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bike.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const inCompare = useCompareStore((state) => state.isInCompare(bike.id));
  const addToCompare = useCompareStore((state) => state.add);
  const removeFromCompare = useCompareStore((state) => state.remove);
  const canAdd = useCompareStore((state) => state.canAdd);

  const images = bike.images ?? [];
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];
  const light = tone === 'light';

  const toggleCompare = () => {
    if (inCompare) removeFromCompare(bike.id);
    else if (canAdd()) addToCompare(bike);
  };

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col transition-colors duration-300',
        light
          ? 'card-vehicle text-cc-black'
          : 'border border-white/12 bg-cc-carbon text-white',
        className,
      )}
    >
      <div className={cn('image-zoom relative overflow-hidden bg-cc-paper', feature ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        {primaryImage ? (
          <img
            src={getThumbnailUrl(primaryImage.url)}
            alt={`${bike.brand?.name ?? ''} ${bike.model || bike.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder width={800} height={600} label="Foto no disponible" className="h-full w-full" />
        )}

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <ConditionTag condition={bike.condition} overlay />
          {bike.featured && <FeaturedTag overlay />}
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={toggleCompare}
            aria-label={inCompare ? 'Quitar del comparador' : 'Agregar al comparador'}
            aria-pressed={inCompare}
            title="Comparar"
            className={cn(
              'flex h-10 w-10 items-center justify-center border bg-white/95 transition-colors',
              inCompare
                ? 'border-cc-black bg-cc-black text-white'
                : 'border-black/10 text-cc-black hover:bg-cc-black hover:text-white',
            )}
          >
            <Scale size={16} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(bike.id)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={isFavorite}
            className={cn(
              'flex h-10 w-10 items-center justify-center border bg-white/95 transition-colors',
              isFavorite
                ? 'border-cc-black bg-cc-black text-white'
                : 'border-black/10 text-cc-black hover:bg-cc-black hover:text-white',
            )}
          >
            <Heart size={16} className={isFavorite ? 'fill-current' : ''} strokeWidth={1.7} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <StatusTag status={bike.status} overlay />
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col p-5 sm:p-6', feature && 'sm:p-7')}>
        <div className="flex items-baseline justify-between gap-3">
          <p className={cn('text-[10px] font-bold uppercase tracking-[0.22em]', light ? 'text-cc-metal' : 'text-white/45')}>
            {bike.brand?.name ?? 'CARLIFE'}
          </p>
          <span className={cn('data-num text-xs', light ? 'text-cc-metal' : 'text-white/45')}>{bike.year}</span>
        </div>

        <Link to={`/motos/${bike.slug}`} className="mt-1 inline-flex min-h-11 items-center">
          <h3
            className={cn(
              'break-words font-display font-bold uppercase leading-[0.98] tracking-[-0.045em] transition-colors duration-300',
              feature ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
              light ? 'text-cc-black group-hover:text-cc-metal' : 'text-white group-hover:text-white/70',
            )}
          >
            {bike.model || bike.title}
          </h3>
        </Link>

        <p className={cn('mt-2 truncate text-xs', light ? 'text-cc-metal' : 'text-white/50')}>
          {bike.title}
        </p>

        <div className={cn('mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs', light ? 'text-cc-slate' : 'text-white/55')}>
          <span>{vehicleCategoryLabel(bike.vehicleCategory)}</span>
          <span aria-hidden="true" className={cn('h-1 w-1', light ? 'bg-black/20' : 'bg-white/30')} />
          <span>{bike.fuel ? fuelLabel(bike.fuel) : 'Combustible a confirmar'}</span>
          <span aria-hidden="true" className={cn('h-1 w-1', light ? 'bg-black/20' : 'bg-white/30')} />
          <span>{formatMileage(bike.mileageKm)}</span>
        </div>

        <div className={cn('mt-auto flex items-end justify-between gap-3 border-t pt-5', light ? 'border-cc-paper' : 'border-white/12')}>
          <div className="min-w-0">
            <p className={cn('text-[9px] font-bold uppercase tracking-[0.2em]', light ? 'text-cc-metal' : 'text-white/40')}>
              Precio publicado
            </p>
            <p className={cn('data-num mt-1.5 break-words text-2xl leading-none', feature && 'sm:text-3xl', light ? 'text-cc-black' : 'text-white')}>
              {formatPrice(bike.price, bike.currency)}
            </p>
          </div>
          <WhatsAppButton
            bike={bike}
            variant="icon"
            ariaLabel={`Consultar por WhatsApp sobre ${bike.brand?.name ?? ''} ${bike.model || bike.title}`}
            className="h-11 min-h-11 w-11 min-w-11"
          />
        </div>

        <Link
          to={`/motos/${bike.slug}`}
          className={cn(
            'mt-3 inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors sm:mt-5',
            light ? 'text-cc-black hover:text-cc-metal' : 'text-white/60 hover:text-white',
          )}
        >
          Ver ficha <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
};
