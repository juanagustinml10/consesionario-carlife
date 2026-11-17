import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const EXPLORE = [
  { label: 'Catálogo', to: '/motos' },
  { label: 'Motos 0 km', to: '/motos?condition=NUEVA' },
  { label: 'Motos usadas', to: '/motos?condition=USADA' },
  { label: 'Destacadas', to: '/motos?featured=true' },
  { label: 'Comparador', to: '/comparador' },
  { label: 'Favoritos', to: '/favoritos' },
];

const COMPANY = [
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Panel administrativo', to: '/admin/login' },
];

export const Footer: React.FC = () => (
  <footer className="relative border-t border-white/5 bg-black">
    {/* Línea superior roja sutil */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jay-red to-transparent opacity-70" />

    <div className="container-jay">
      <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="col-span-2 space-y-6 md:col-span-4">
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="inline-block">
            <Logo className="h-16 sm:h-20" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            Concesionaria oficial de motocicletas 0 km y usadas. Asesoramiento personalizado,
            precios transparentes y entrega inmediata.
          </p>
          <div className="flex gap-3">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition-colors hover:border-jay-red hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition-colors hover:border-jay-red hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3h3v4h-3c-1.1 0-2 .9-2 2v3h5l-.5 4H13v8h-4v-8H6v-4h3V9c0-2.76 2.24-5 5-5h1z" /></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition-colors hover:border-jay-red hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.85-.47-6.3a2.8 2.8 0 0 0-1.98-2C18.28 3.2 12 3.2 12 3.2s-6.28 0-8.55.5a2.8 2.8 0 0 0-1.98 2C1 8.15 1 12 1 12s0 3.85.47 6.3a2.8 2.8 0 0 0 1.98 2c2.27.5 8.55.5 8.55.5s6.28 0 8.55-.5a2.8 2.8 0 0 0 1.98-2c.47-2.45.47-6.3.47-6.3zM10.4 15.3V8.7l5.9 3.3-5.9 3.3z" /></svg>
            </a>
          </div>
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
          <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Empresa</h4>
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
              Av. Libertador 5400, CABA, Argentina
            </li>
            <li className="flex items-start gap-3">
              <Clock size={17} className="mt-0.5 shrink-0 text-jay-red" />
              Lun–Sáb: 9:00–19:00 · Dom: cerrado
            </li>
            <li className="flex items-start gap-3">
              <Phone size={17} className="mt-0.5 shrink-0 text-jay-red" />
              <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" className="break-all transition-colors hover:text-white">+54 9 11 1234-5678</a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0 text-jay-red" />
              <a href="mailto:ventas@jaymotos.com.ar" className="break-all transition-colors hover:text-white">ventas@jaymotos.com.ar</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Watermark */}
      <div className="pointer-events-none select-none overflow-hidden border-t border-white/5 pt-8" aria-hidden="true">
        <p className="whitespace-nowrap text-center font-display text-[18vw] font-extrabold italic leading-none tracking-tight text-white/[0.04] sm:text-[15vw] lg:text-[12rem]">
          JAY&nbsp;MOTOS
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-[11px] text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} JAY MOTOS — Concesionaria Digital · Todos los derechos reservados</p>
        <p className="text-center">Precios y fotos sujetos a confirmación en concesionaria · Imágenes ilustrativas</p>
      </div>
    </div>
  </footer>
);
