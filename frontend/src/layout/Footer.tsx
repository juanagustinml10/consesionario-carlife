import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { Phone, MapPin, Truck } from 'lucide-react';

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Motos', to: '/motos' },
  { label: 'Motos 0 KM', to: '/motos?condition=NUEVA' },
  { label: 'Motos usadas', to: '/motos?condition=USADA' },
  { label: 'Destacadas', to: '/motos?featured=true' },
  { label: 'Financiación', to: '/financiacion' },
  { label: 'Sobre nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Comparador', to: '/comparador' },
  { label: 'Favoritos', to: '/favoritos' },
];

export const Footer: React.FC = () => (
  <footer className="relative border-t border-white/5 bg-black">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jay-red to-transparent opacity-70" />

    <div className="container-jay py-8 md:py-10">
      {/* Fila principal */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        {/* Marca */}
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="shrink-0">
            <Logo className="h-11 sm:h-14" />
          </Link>
          <div className="space-y-1">
            <p className="font-display text-[10px] font-bold uppercase leading-none tracking-[0.3em] text-jay-red-soft">
              {BUSINESS.tagline}
            </p>
            <p className="max-w-[15rem] text-[11px] leading-snug text-gray-500">
              {BUSINESS.specialty}
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-400" aria-label="Enlaces del sitio">
          {LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contacto */}
        <div className="space-y-1.5 text-[11px] text-gray-400">
          <p className="flex items-start gap-2">
            <MapPin size={13} className="mt-0.5 shrink-0 text-jay-red" />
            <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              {BUSINESS.address}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Truck size={13} className="shrink-0 text-jay-red" />
            {BUSINESS.shippingLabel}
          </p>
          <a
            href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white transition-colors hover:text-jay-red-soft"
          >
            <Phone size={13} className="shrink-0 text-jay-red" />
            {BUSINESS.phoneDisplay} (WhatsApp)
          </a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="flex flex-col items-center justify-between gap-1.5 border-t border-white/5 pt-4 text-[9px] text-gray-600 sm:flex-row">
        <p>© {new Date().getFullYear()} {BUSINESS.name}</p>
        <p>Fotos: Jix31 (CC BY 4.0) · Tim Gotzkowsky (CC BY 3.0) · Precios y fotos sujetos a confirmación</p>
      </div>
    </div>
  </footer>
);
