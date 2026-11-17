import * as React from 'react';
import { useState } from 'react';
import { Link } from '@/components/shared/Link';
import { Menu, Search, Phone } from 'lucide-react';
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

  return (
    <nav className="sticky top-0 z-50 border-b border-jay-black/5 bg-jay-white/80 backdrop-blur-md">
      <div className="container-jay">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="block h-6 w-6 rounded bg-jay-red flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
              JM
            </span>
            <span className="font-display text-xl font-bold tracking-tighter">JAY<span className="text-jay-red">MOTOS</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-jay-black/70 transition-colors hover:text-jay-red"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/motos?featured=true"
              className="ml-4 text-sm font-medium text-jay-red hover:text-jay-black transition-colors"
            >
              Destacadas
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 text-jay-black"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
            <Link to="/comparador" className="text-jay-black/60 hover:text-jay-red transition-colors" aria-label="Comparador">
              <Search size={20} />
            </Link>
            <Link to="/favoritos" className="relative text-jay-black/60 hover:text-jay-red transition-colors" aria-label="Favoritos">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5 0-5.5-4.5-9.5-7-9.5-2.5 0-7 4-7 9.5 0 2.3 1.5 4.04 3 5.5" />
                {favoriteCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-jay-red text-[10px] font-bold text-jay-white">
                    {favoriteCount}
                  </span>
                )}
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-jay-white border-b border-jay-black/5">
          <div className="container-jay px-4 pb-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-jay-black/70 hover:bg-jay-black/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-jay-black/10">
              <p className="mb-3 text-xs font-semibold text-jay-black/40 uppercase tracking-wider">Contacto</p>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-jay-red hover:bg-jay-black/5 rounded-lg transition-colors block">
                <Phone size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
