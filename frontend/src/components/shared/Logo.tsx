import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  alt?: string;
  /** true cuando el logo se apoya sobre fondo oscuro: usa la versión blanca. */
  onDark?: boolean;
  /** Sólo el isotipo, para espacios reducidos (favicon, panel, etc.). */
  icon?: boolean;
}

const ASSETS = {
  wordmark: {
    light: '/logo/carlife-dark.png',
    dark: '/logo/carlife-light.png',
    width: 983,
    height: 214,
  },
  icon: {
    light: '/logo/carlife-mark.png',
    dark: '/logo/carlife-mark-light.png',
    width: 128,
    height: 128,
  },
} as const;

/**
 * Logotipo oficial de CARLIFE.
 * Se deriva del JPEG original conservando el trazo y las proporciones: se
 * calcula una máscara de alfa y se tiñe con los colores de la paleta
 * (blanco, rojo y negro). No se redibuja ni se reemplaza por texto.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  alt = 'CARLIFE',
  onDark = false,
  icon = false,
}) => {
  const set = icon ? ASSETS.icon : ASSETS.wordmark;
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
