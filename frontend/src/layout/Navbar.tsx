import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { Menu, X, MessageCircle } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/motos', label: 'Catálogo' },
  { to: '/motos?condition=NUEVA', label: 'Motos 0 km' },
  { to: '/motos?condition=USADA', label: 'Motos usadas' },
  { to: '/financiacion', label: 'Financiación' },
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // NavLink solo compara el pathname: las rutas con query (?condition=...)
  // deben distinguirse para no marcar tres ítems como activos a la vez.
  const isLinkActive = (to: string) => {
    const [path, query = ''] = to.split('?');
    const samePath = path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`);
    if (!samePath) return false;
    if (!query) return true;
    const expected = new URLSearchParams(query);
    const actual = new URLSearchParams(location.search);
    return Array.from(expected.entries()).every(([key, value]) => actual.get(key) === value);
  };

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-jay-black/95 backdrop-blur-md">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-jay-red to-transparent opacity-60" aria-hidden="true" />
      <div className="container-jay">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="shrink-0">
            <Logo className="h-11 sm:h-12 lg:h-[52px]" />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden items-center gap-4 min-[1440px]:gap-6 lg:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={() =>
                  `group relative whitespace-nowrap py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors min-[1440px]:text-xs ${
                    isLinkActive(link.to) ? 'text-jay-red-soft' : 'text-gray-400 hover:text-white'
                  }`
                }
                aria-current={isLinkActive(link.to) ? 'page' : undefined}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-jay-red transition-all duration-300 ${
                    isLinkActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <a
              href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-red hidden px-4 py-2.5 text-[11px] md:inline-flex min-[1440px]:px-5"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
            <button
              ref={triggerRef}
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-gray-200 transition-colors hover:text-white lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-jay-black shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5">
              <Logo className="h-10" />
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-gray-300 transition-colors hover:text-white"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="scrollbar-none flex-1 overflow-y-auto p-4" aria-label="Navegación móvil">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={() =>
                      `rounded-xl px-4 py-3.5 font-display text-base font-semibold uppercase tracking-[0.12em] transition-colors ${
                        isLinkActive(link.to)
                          ? 'bg-jay-red/10 text-jay-red-soft'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    aria-current={isLinkActive(link.to) ? 'page' : undefined}
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
                <MessageCircle size={18} />
                Consultar por WhatsApp
              </a>
              <p className="mt-4 text-center text-[11px] text-gray-500">{BUSINESS.address}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
