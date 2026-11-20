import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { ArrowUpRight, LockKeyhole, MapPin, MessageCircle } from 'lucide-react';

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
  <footer className="relative overflow-hidden border-t border-white/10 bg-sf-black">
    <div className="h-[3px] w-full bg-sf-red" aria-hidden="true" />
    <div className="track-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

    <div className="container-sf relative py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Link to="/" aria-label="SF MOTOS — Inicio" className="inline-block">
            <Logo onDark className="h-12 w-auto sm:h-14" />
          </Link>
          <p className="mt-6 micro-label text-sf-red-soft">{BUSINESS.tagline}</p>
          <div className="mt-4 h-[2px] w-12 bg-sf-red" aria-hidden="true" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            {BUSINESS.specialty}
          </p>
          <a
            href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-red mt-7 px-5"
          >
            <MessageCircle size={16} />
            Escribinos
          </a>
        </div>

        <nav className="lg:col-span-3" aria-label="Enlaces del sitio">
          <p className="micro-label mb-6 text-gray-500">Navegación</p>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                >
                  <span className="h-[2px] w-2 bg-sf-red transition-all group-hover:w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="micro-label mb-6 text-gray-500">Contacto</p>
          <ul className="space-y-5 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-sf-red" />
              <a
                href={BUSINESS.addressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1 transition-colors hover:text-white"
              >
                <span>{BUSINESS.address}</span>
                <ArrowUpRight size={13} className="shrink-0" />
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle size={16} className="mt-0.5 shrink-0 text-sf-red" />
              <a
                href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {BUSINESS.phoneDisplay} · WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs text-gray-500">© {CURRENT_YEAR} {BUSINESS.name} · {BUSINESS.tagline}</p>
          <Link
            to="/admin/login"
            className="mt-4 inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 py-2 text-[11px] text-gray-400 transition-colors hover:border-sf-red hover:text-white"
          >
            <LockKeyhole size={13} className="shrink-0 text-sf-red-soft" aria-hidden="true" />
            Acceso administrativo
          </Link>
        </div>
        <p className="max-w-2xl text-xs leading-relaxed text-gray-600 lg:text-right">
          Fotos: Beta RR Freenduro — Jimmy Boakes / Jix31 (CC BY 4.0) · KTM forest — Tim Gotzkowsky (CC BY 3.0). Precios y condiciones sujetos a confirmación.
        </p>
      </div>
    </div>
  </footer>
);
