import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { MessageCircle, MapPin, Truck, ArrowUpRight, LockKeyhole } from 'lucide-react';

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/motos' },
  { label: 'Motos 0 km', to: '/motos?condition=NUEVA' },
  { label: 'Motos usadas', to: '/motos?condition=USADA' },
  { label: 'Financiación', to: '/financiacion' },
  { label: 'Sobre nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Favoritos', to: '/favoritos' },
];

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => (
  <footer className="relative overflow-hidden border-t border-white/8 bg-black">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jay-red to-transparent opacity-70" aria-hidden="true" />
    <span className="pointer-events-none absolute -bottom-14 right-0 select-none font-display text-[18rem] font-extrabold italic leading-none text-outline sm:text-[26rem]" aria-hidden="true">
      JAY
    </span>

    <div className="container-jay relative py-12 md:py-16">
      {/* Fila principal */}
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        {/* Marca */}
        <div className="md:col-span-4">
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="inline-block">
            <Logo className="h-11 sm:h-12" />
          </Link>
          <p className="mt-5 font-display text-[10px] font-bold uppercase leading-none tracking-[0.28em] text-jay-red-soft">
            {BUSINESS.tagline}
          </p>
          <p className="mt-3 max-w-[18rem] text-[11px] leading-relaxed text-gray-500">
            {BUSINESS.specialty}
          </p>
          <div className="mt-6 h-[2px] w-10 bg-jay-red" aria-hidden="true" />
        </div>

        {/* Navegación */}
        <nav className="md:col-span-4" aria-label="Enlaces del sitio">
          <p className="mb-4 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">Navegación</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-[11px] text-gray-400 sm:grid-cols-3 md:grid-cols-2">
            {LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="group inline-flex items-center gap-1.5 transition-colors hover:text-white">
                <span className="h-1 w-1 shrink-0 bg-jay-red/60 transition-all group-hover:w-2" aria-hidden="true" />
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Contacto */}
        <div className="md:col-span-4">
          <p className="mb-4 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">Contacto</p>
          <ul className="space-y-4 text-[11px] text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin size={14} className="mt-0.5 shrink-0 text-jay-red" />
              <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 transition-colors hover:text-white">
                <span>{BUSINESS.address}</span>
                <ArrowUpRight size={12} className="shrink-0" />
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Truck size={14} className="mt-0.5 shrink-0 text-jay-red" />
              {BUSINESS.shippingLabel}
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle size={14} className="mt-0.5 shrink-0 text-jay-red" />
              <a
                href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {BUSINESS.phoneDisplay} (WhatsApp)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 text-[10px] leading-relaxed text-gray-600 sm:flex-row sm:text-left">
        <div>
          <p>© {CURRENT_YEAR} {BUSINESS.name} · {BUSINESS.tagline}</p>
          <Link
            to="/admin/login"
            className="mt-3 inline-flex min-h-10 w-fit items-center gap-2 rounded-md border border-white/12 bg-white/[0.02] px-3 py-2 text-[11px] font-medium text-gray-400 transition-colors hover:border-jay-red/50 hover:bg-jay-red/5 hover:text-white"
          >
            <LockKeyhole size={13} className="shrink-0 text-jay-red-soft" aria-hidden="true" />
            Acceso administrativo
          </Link>
        </div>
        <p className="max-w-2xl text-center sm:text-right">
          Fotos: Beta RR Freenduro — Jimmy Boakes / Jix31 (CC BY 4.0) · KTM forest — Tim Gotzkowsky (CC BY 3.0). Precios y condiciones sujetos a confirmación.
        </p>
      </div>
    </div>
  </footer>
);
