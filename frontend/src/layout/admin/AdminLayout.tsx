import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Motorbike,
  Menu,
  Plus,
  LogOut,
  X,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { authService } from '@/services/auth';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Panel', icon: LayoutDashboard, index: '01' },
  { to: '/admin/motos', label: 'Motocicletas', icon: Motorbike, index: '02' },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-sf-black text-white">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] max-w-[85vw] flex-col border-r border-sf-border bg-sf-surface transition-transform duration-200 md:relative md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-sf-border px-5">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
            aria-label="SF MOTOS — Panel administrativo"
          >
            <Logo onDark className="h-9" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-sf-ink-400 transition-colors hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <div className="border-b border-sf-border px-5 py-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-sf-red">
            Sistema interno
          </span>
          <p className="mt-1 font-display text-xl uppercase tracking-wide text-white">
            Panel de control
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-sf-ink-500">
            Navegación
          </p>
          <div className="space-y-1">
            {ADMIN_NAV.map(({ to, label, icon: Icon, index }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-l-2 border-sf-red bg-sf-red/10 pl-[10px] text-white'
                      : 'border-l-2 border-transparent text-sf-ink-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{label}</span>
                <span className="font-mono text-[10px] text-sf-ink-600 group-hover:text-sf-red">
                  {index}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="shrink-0 border-t border-sf-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-sf-ink-400 transition-colors hover:text-white"
          >
            ← Ver sitio público
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-sf-border px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sf-ink-400 transition-colors hover:bg-sf-red/10 hover:text-white"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-sf-border bg-sf-black px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-sf-ink-300 transition-colors hover:text-white md:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <span className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-sf-ink-400">
              Panel administrativo <span className="text-sf-red">/</span> SF MOTOS
            </span>
          </div>
          <Link
            to="/admin/motos/nuevo"
            className="inline-flex h-9 shrink-0 items-center gap-2 bg-sf-red px-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ff2e37]"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nueva moto</span>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container-sf !px-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
