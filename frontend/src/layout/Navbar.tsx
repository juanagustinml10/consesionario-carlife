import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BUSINESS } from '@/lib/constants';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/motos', label: 'Vehículos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(true);

  const isLinkActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const closeMenu = (restoreFocus: boolean) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const dialog = closeRef.current?.closest('[role="dialog"]') as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Si se rota la tablet o se agranda la ventana con el menú abierto,
    // el overlay se oculta por CSS: hay que cerrarlo también en estado.
    const mq = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => {
      if (mq.matches) closeMenu(false);
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    mq.addEventListener('change', onBreakpoint);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener('change', onBreakpoint);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (restoreFocusRef.current) trigger?.focus();
      restoreFocusRef.current = true;
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-cc-black transition-shadow duration-500',
        scrolled && 'shadow-[0_12px_30px_-26px_rgba(0,0,0,0.95)]',
      )}
    >
      <div className="container-cc relative z-10">
        <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-[4.75rem] lg:grid-cols-[1fr_auto_1fr]">
          <Link to="/" aria-label="CARLIFE — Inicio" className="flex min-h-11 shrink-0 items-center">
            <Logo onDark className="h-9 w-auto sm:h-10 lg:h-11" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <Link key={link.to} to={link.to} className="group relative py-2" aria-current={active ? 'page' : undefined}>
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300',
                      active ? 'text-white' : 'text-white/55 group-hover:text-cc-red-light',
                    )}
                  >
                    {link.label}
                  </span>
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-[2px] bg-cc-red transition-all duration-500',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <WhatsAppButton size="sm" label="Contacto" className="hidden px-5 lg:inline-flex" />
            <button
              ref={triggerRef}
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              <Menu size={25} />
            </button>
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] bg-cc-red transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="absolute inset-0 flex flex-col overflow-y-auto bg-cc-black"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
              <Logo onDark className="h-10 w-auto" />
              <button
                ref={closeRef}
                onClick={() => closeMenu(true)}
                className="flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 px-5 py-9" aria-label="Navegación móvil">
              <p className="eyebrow eyebrow-light mb-8">Navegación</p>
              <div className="flex flex-col">
                {NAV_LINKS.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => closeMenu(false)}
                    className="animate-fade-up flex min-h-14 items-center justify-between gap-3 border-b border-white/10 py-5"
                    style={{ animationDelay: `${50 + index * 45}ms` }}
                    aria-current={isLinkActive(link.to) ? 'page' : undefined}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="data-num text-[10px] text-white/35">0{index + 1}</span>
                      <span
                        className={cn(
                          'font-display text-3xl font-semibold uppercase tracking-[-0.045em]',
                          isLinkActive(link.to) ? 'text-white' : 'text-white/65',
                        )}
                      >
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight size={18} className="text-white/35" />
                  </Link>
                ))}
              </div>
            </nav>

            <div className="shrink-0 border-t border-white/10 p-5">
              <WhatsAppButton label="Consultar por WhatsApp" className="w-full py-4" />
              <p className="mt-5 truncate text-[10px] uppercase tracking-[0.14em] text-white/40">
                {BUSINESS.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
