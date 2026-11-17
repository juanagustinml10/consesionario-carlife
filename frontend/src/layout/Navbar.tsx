import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from '@/components/shared/Link';
import { Menu, X, Scale, Phone } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/motos', label: 'Catálogo' },
  { to: '/comparador', label: 'Comparador' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const favoriteCount = useFavoritesStore((state) => state.ids.length);

  // Cierra el menú móvil con Escape y bloquea el scroll del body
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
    <nav className="sticky top-0 z-50 border-b border-jay-black/5 bg-jay-white/90 backdrop-blur-md">
      <div className="container-jay">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-jay-red text-[10px] font-black uppercase tracking-tighter text-white">
              JM
            </span>
            <span className="font-display text-xl font-bold tracking-tighter">
              JAY<span className="text-jay-red">MOTOS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-jay-black/70 transition-colors hover:text-jay-red py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/motos?featured=true"
              className="ml-2 text-sm font-medium text-jay-red transition-colors hover:text-jay-black py-2"
            >
              Destacadas
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/comparador"
              className="rounded-lg p-2 text-jay-black/60 transition-colors hover:text-jay-red"
              aria-label="Comparador"
            >
              <Scale size={22} />
            </Link>
            <Link
              to="/favoritos"
              className="relative rounded-lg p-2 text-jay-black/60 transition-colors hover:text-jay-red"
              aria-label="Favoritos"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5 0-5.5-4.5-9.5-7-9.5-2.5 0-7 4-7 9.5 0 2.3 1.5 4.04 3 5.5" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-jay-red text-[10px] font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-jay-black lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil a pantalla completa */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-xs border-l border-white/10 bg-jay-black text-jay-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <span className="font-display text-lg font-bold">
                JAY<span className="text-jay-red">MOTOS</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/80 transition-colors hover:text-white"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-xl px-4 py-3.5 text-base font-medium text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/motos?featured=true"
                onClick={() => setOpen(false)}
                className="flex items-center rounded-xl px-4 py-3.5 text-base font-medium text-jay-red transition-colors hover:bg-white/5"
              >
                Destacadas
              </Link>
            </nav>
            <div className="border-t border-white/10 p-6">
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-jay-red px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-black"
              >
                <Phone size={20} /> WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
