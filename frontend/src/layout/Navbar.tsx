import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { Menu, X, Scale, Phone, MapPin, Truck } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/motos', label: 'Motos' },
  { to: '/financiacion', label: 'Financiación' },
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const favoriteCount = useFavoritesStore((state) => state.ids.length);
  const compareCount = useCompareStore((state) => state.bikes.length);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra superior fina — escritorio */}
      <div className="hidden border-b border-white/5 bg-black lg:block">
        <div className="container-jay flex h-10 items-center justify-between text-[11px] tracking-wide text-gray-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-jay-red" />
              {BUSINESS.address}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-jay-red-soft">
              <Truck size={12} />
              {BUSINESS.shippingLabel}
            </span>
          </div>
          <a
            href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold text-gray-200 transition-colors hover:text-white"
          >
            <Phone size={12} className="text-jay-red" />
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <nav className="border-b border-white/5 bg-jay-black/90 backdrop-blur-xl">
        <div className="container-jay">
          <div className="flex h-16 items-center justify-between gap-3 md:h-[72px] lg:h-20 xl:gap-6">
            {/* Logo */}
            <Link to="/" aria-label="JAY MOTOS — Inicio" className="shrink-0">
              <Logo className="h-11 w-auto sm:h-12 lg:h-16" />
            </Link>

            {/* Navegación desktop */}
            <div className="hidden items-center gap-5 lg:flex min-[1440px]:gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group relative whitespace-nowrap py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors min-[1440px]:text-[13px] ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-jay-red transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </Link>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/comparador"
                className="relative rounded-lg p-2.5 text-gray-300 transition-colors hover:text-white"
                aria-label="Comparador"
                title="Comparador"
              >
                <Scale size={22} />
                {compareCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-jay-red text-[10px] font-bold text-white">
                    {compareCount}
                  </span>
                )}
              </Link>
              <Link
                to="/favoritos"
                className="relative rounded-lg p-2.5 text-gray-300 transition-colors hover:text-white"
                aria-label="Favoritos"
                title="Favoritos"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5 0-5.5-4.5-9.5-7-9.5-2.5 0-7 4-7 9.5 0 2.3 1.5 4.04 3 5.5" />
                </svg>
                {favoriteCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-jay-red text-[10px] font-bold text-white">
                    {favoriteCount}
                  </span>
                )}
              </Link>
              <a
                href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red hidden px-4 py-2.5 text-[11px] min-[1440px]:px-5 md:inline-flex"
              >
                <Phone size={14} />
                Consultar
              </a>
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg p-2 text-gray-200 lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu size={26} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Panel móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-jay-black">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5">
              <Logo className="h-10" />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-gray-300 hover:text-white" aria-label="Cerrar menú">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">Navegación</p>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3.5 font-display text-base font-semibold uppercase tracking-[0.12em] transition-colors ${
                        isActive ? 'bg-jay-red/10 text-jay-red-soft' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="shrink-0 border-t border-white/5 p-5">
              <a
                href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red w-full py-4 text-sm"
              >
                <Phone size={18} />
                Consultar por WhatsApp
              </a>
              <p className="mt-4 text-center text-[11px] text-gray-500">
                {BUSINESS.address} · {BUSINESS.shippingLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
