import * as React from 'react';
import {
  buildBikeWhatsAppLink,
  buildWhatsAppLink,
  BUSINESS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

/** Icono oficial de WhatsApp, dibujado con la marca como `currentColor`. */
export const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    className={cn('shrink-0', className)}
  >
    <path d="M12.04 2C6.5 2 2 6.48 2 11.98c0 1.76.46 3.48 1.34 5L2 22l5.16-1.32a10 10 0 0 0 4.88 1.25h.01c5.53 0 10.03-4.48 10.03-10.02C22.08 6.48 17.58 2 12.04 2Zm0 18.05a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.06.78.82-2.98-.2-.31a8.28 8.28 0 0 1-1.27-4.42c0-4.59 3.76-8.32 8.38-8.32a8.36 8.36 0 0 1 8.38 8.32c0 4.6-3.77 8.27-8.42 8.27Zm4.6-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.17 1.75 2.67 4.24 3.74.59.25 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
  </svg>
);

type BikeRef = Parameters<typeof buildBikeWhatsAppLink>[0];

interface WhatsAppButtonProps {
  /** Mensaje libre. Se usa cuando no se pasa `bike`. */
  message?: string;
  /** Vehículo consultado: genera el mensaje predefinido con marca y modelo. */
  bike?: BikeRef;
  label?: string;
  className?: string;
  /** `icon` para botones compactos cuadrados (tarjetas, flotante). */
  variant?: 'solid' | 'icon';
  size?: 'sm' | 'default' | 'lg';
  /** Botón flotante fijo, con el mismo tratamiento rojo de la paleta. */
  floating?: boolean;
  ariaLabel?: string;
}

/**
 * Único punto de entrada para las acciones de WhatsApp.
 * Centraliza el número oficial, el mensaje y el estilo rojo de CARLIFE.
 */
export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  bike,
  label = 'Consultar por WhatsApp',
  className,
  variant = 'solid',
  size = 'default',
  floating = false,
  ariaLabel,
}) => {
  const href = bike
    ? buildBikeWhatsAppLink(bike)
    : buildWhatsAppLink(message ?? BUSINESS.whatsappGeneralMessage);
  const iconOnly = variant === 'icon';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? label}
      title={ariaLabel ?? label}
      className={cn(
        'btn',
        iconOnly ? 'btn-whatsapp-icon' : 'btn-whatsapp',
        iconOnly && !floating && 'is-square',
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        floating && 'btn-whatsapp-float',
        className,
      )}
    >
      <WhatsAppIcon size={size === 'lg' ? 19 : iconOnly ? 20 : 17} />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
};
