import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BUSINESS } from '@/lib/constants';
import { WhatsAppButton, WhatsAppIcon } from '@/components/shared/WhatsAppButton';
import { ArrowUpRight, MapPin, Truck } from 'lucide-react';

const LINKS = [
  { label: 'Vehículos', to: '/motos' },
  { label: 'Usados', to: '/motos?condition=USADA' },
  { label: 'Disponibles', to: '/motos?status=DISPONIBLE' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Créditos prendarios', to: '/financiacion' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Favoritos', to: '/favoritos' },
];

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-cc-red bg-cc-black text-white">
      <div className="container-cc pb-32 pt-16 sm:pb-24 sm:pt-20 lg:py-24">
        <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-12 lg:gap-10 lg:pb-20">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link to="/" aria-label="CARLIFE — Inicio" className="inline-flex min-h-11 items-center">
              <Logo onDark className="h-10 w-auto sm:h-12" />
            </Link>
            <p className="mt-8 max-w-md font-display text-2xl font-semibold uppercase leading-[1.1] tracking-[-0.045em] text-white sm:text-3xl">
              {BUSINESS.slogan}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
              {BUSINESS.institutional}. Autos usados seleccionados, financiación mediante créditos prendarios y atención directa por WhatsApp.
            </p>
            <WhatsAppButton label="Escribinos" className="mt-8 px-7" />
          </div>

          <nav className="lg:col-span-3" aria-label="Enlaces del sitio">
            <p className="eyebrow eyebrow-light mb-7">Navegación</p>
            <ul className="grid grid-cols-1 gap-x-5 gap-y-1 min-[380px]:grid-cols-2 min-[380px]:gap-y-3.5">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex min-h-11 items-center gap-1 text-sm text-white/60 transition-colors hover:text-cc-red-light"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-60 transition-opacity lg:opacity-0 lg:group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="eyebrow eyebrow-light mb-7">Contacto</p>
            <ul className="space-y-5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-cc-red" />
                <a
                  href={BUSINESS.addressLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-start gap-1 transition-colors hover:text-white"
                >
                  <span>{BUSINESS.address}</span>
                  <ArrowUpRight size={13} className="shrink-0" />
                </a>
              </li>
              <li className="flex items-start gap-3">
                <WhatsAppIcon size={17} className="mt-0.5 text-cc-red" />
                <a
                  href={BUSINESS.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-white"
                >
                  <span className="data-num">{BUSINESS.phoneDisplay}</span> · WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Truck size={17} className="mt-0.5 shrink-0 text-cc-red" />
                <span>{BUSINESS.shippingLabel}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-7 pt-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-white/40">
              © {CURRENT_YEAR} {BUSINESS.name} · {BUSINESS.tagline}
            </p>
            <Link
              to="/admin"
              className="group mt-2 inline-flex min-h-11 items-center gap-1 text-xs uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-cc-red-light"
            >
              Acceso administrativo
              <ArrowUpRight size={12} className="opacity-60 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
