import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  alt?: string;
  onDark?: boolean;
}

/**
 * Logo oficial de JAY MOTOS.
 * PNG con fondo transparente generado desde el JPEG original
 * (conserva diseño, letras, trazos blancos y detalles rojos).
 * Mantener siempre las proporciones originales (~1274x274).
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  alt = 'JAY MOTOS — Concesionaria Multimarca',
}) => (
  <img
    src="/logo/logo-jaymotos-transparent.png"
    alt={alt}
    width={1274}
    height={274}
    className={cn('h-auto w-auto select-none object-contain', className)}
    draggable={false}
  />
);
