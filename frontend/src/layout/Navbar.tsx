import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { Menu, X, Phone } from 'lucide-react';

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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-jay-black/95 backdrop-blur-md">
      <div className="container-jay">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" aria-label="JAY MOTOS — Inicio" className="shrink-0">
            <Logo className="h-12 sm:h-14 lg:h-[60px]" />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden items-center gap-5 min-[1440px]:gap-7 lg:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group relative whitespace-nowrap py-2 font-display text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors min-[1440px]:text-[12px] ${
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
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <a
              href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-red hidden px-4 py-2.5 text-[11px] md:inline-flex min-[1440px]:px-5"
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

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-jay-black">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5">
              <Logo className="h-10" />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-gray-300 hover:text-white" aria-label="Cerrar menú">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Navegación móvil">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-4 font-display text-base font-semibold uppercase tracking-[0.12em] transition-colors ${
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
              <p className="mt-4 text-center text-[11px] text-gray-500">{BUSINESS.address}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
