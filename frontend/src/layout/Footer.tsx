import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { Phone, MapPin, Truck } from 'lucide-react';

const EXPLORE = [
  { label: 'Catálogo', to: '/motos' },
  { label: 'Motos 0 KM', to: '/motos?condition=NUEVA' },
  { label: 'Motos usadas', to: '/motos?condition=USADA' },
  { label: 'Destacadas', to: '/motos?featured=true' },
  { label: 'Financiación', to: '/financiacion' },
  { label: 'Comparador', to: '/comparador' },
  { label: 'Favoritos', to: '/favoritos' },
];

const COMPANY = [
  { label: 'Sobre nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Panel administrativo', to: '/admin/login' },
];

export const Footer: React.FC = () => (
  <footer className="relative border-t border-white/5 bg-black">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jay-red to-transparent opacity-70" />

    <div className="container-jay">
      <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-12 md:py-14">
        <div className="col-span-2 space-y-5 md:col-span-4">
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="inline-block">
            <Logo className="h-14 sm:h-16" />
          </Link>
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-jay-red-soft">
            {BUSINESS.tagline}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            {BUSINESS.specialty}
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Explorar</h4>
          <ul className="space-y-2.5">
            {EXPLORE.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-sm text-gray-300 transition-colors hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Agencia</h4>
          <ul className="space-y-2.5">
            {COMPANY.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-sm text-gray-300 transition-colors hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4">
          <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Concesionaria</h4>
          <ul className="space-y-3.5 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-jay-red" />
              <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {BUSINESS.address}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Truck size={17} className="mt-0.5 shrink-0 text-jay-red" />
              {BUSINESS.shippingLabel}
            </li>
            <li className="flex items-start gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-jay-red" />
              <a href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                {BUSINESS.phoneDisplay} (WhatsApp)
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Watermark */}
      <div className="pointer-events-none select-none overflow-hidden border-t border-white/5 pt-8" aria-hidden="true">
        <p className="whitespace-nowrap text-center font-display text-[16vw] font-extrabold italic leading-none tracking-tight text-white/[0.04] sm:text-[13vw] lg:text-[11rem]">
          FOR RIDERS
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-[10px] leading-relaxed text-gray-600 md:flex-row">
        <p>© {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.tagline}</p>
        <p className="text-center">
          Foto hero: Tim Gotzkowsky · CC BY 3.0 · Precios y fotos sujetos a confirmación en concesionaria
        </p>
      </div>
    </div>
  </footer>
);
