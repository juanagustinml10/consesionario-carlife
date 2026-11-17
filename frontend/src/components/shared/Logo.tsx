import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * Logo oficial de JAY MOTOS.
 * Archivo preparado desde el JPEG original (negro normalizado) para fundido perfecto con fondos oscuros.
 * No deformar ni recortar: usar siempre manteniendo la proporción original (~1282x282).
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  alt = 'JAY MOTOS — Concesionaria Oficial',
}) => (
  <img
    src="/logo/logo-jaymotos-web.jpg"
    alt={alt}
    className={cn('w-auto select-none object-contain', className)}
    draggable={false}
  />
);
