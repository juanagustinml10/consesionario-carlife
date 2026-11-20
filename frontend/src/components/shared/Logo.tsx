import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  alt?: string;
  /** true cuando el logo se apoya sobre fondo oscuro: usa la versión blanca. */
  onDark?: boolean;
  /** Sólo el isotipo SF, para espacios reducidos (favicon, avatar, etc.). */
  icon?: boolean;
}

const ASSETS = {
  dark: { light: '/logo/sf-motos-black.png', dark: '/logo/sf-motos-white.png', width: 653, height: 350 },
  icon: { light: '/logo/sf-motos-icon.png', dark: '/logo/sf-motos-icon-white.png', width: 653, height: 653 },
} as const;

/**
 * Logo oficial de SF MOTOS.
 * Se generó desde el JPEG original conservando trazos y proporciones: la
 * versión "black" va sobre fondos claros y la "white" sobre fondos oscuros.
 * No se redibuja ni se reemplaza por texto.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  alt = 'SF MOTOS',
  onDark = false,
  icon = false,
}) => {
  const set = icon ? ASSETS.icon : ASSETS.dark;
  const src = onDark ? set.dark : set.light;

  return (
    <img
      src={src}
      alt={alt}
      width={set.width}
      height={set.height}
      className={cn('h-auto w-auto select-none object-contain', className)}
      draggable={false}
    />
  );
};
