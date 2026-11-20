import betaPhoto from '@/assets/beta-300rr-freenduro.jpg';
import { cn } from '@/lib/utils';

interface HeroBikeProps {
  className?: string;
  /** Carga prioritaria sólo para la imagen del hero principal. */
  priority?: boolean;
}

/**
 * Fotografía editorial usada en el hero y en la sección institucional.
 * Es una motocicleta de enduro en un camino de montaña (Beta RR Freenduro,
 * foto de Jimmy Boakes / Jix31, CC BY 4.0). Se muestra como imagen editorial:
 * no representa una unidad publicada ni disponible en el catálogo de SF MOTOS.
 */
export const HeroBike = ({ className, priority = false }: HeroBikeProps) => (
  <img
    src={betaPhoto}
    alt="Motocicleta de enduro en un camino de montaña"
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
    className={cn('block h-full w-full object-cover', className)}
  />
);
