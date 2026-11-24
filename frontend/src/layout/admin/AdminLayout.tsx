import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  CarFront,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { authService } from '@/services/auth';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Panel', icon: LayoutDashboard, index: '01' },
  { to: '/admin/motos', label: 'Vehículos', icon: CarFront, index: '02' },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-cc-black text-white">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-cc-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[17rem] max-w-[85vw] flex-col border-r border-white/10 bg-cc-carbon transition-transform duration-200 md:relative md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            to="/admin/dashboard"
            className="flex min-h-11 items-center gap-3"
            aria-label="CARLIFE — Panel administrativo"
          >
            <Logo onDark className="h-10" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center text-white/50 transition-colors hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <span className="eyebrow eyebrow-light">Sistema interno</span>
          <p className="display-sm mt-2">Panel de control</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="eyebrow eyebrow-light mb-3 px-3">Navegación</p>
          <div className="space-y-1">
            {ADMIN_NAV.map(({ to, label, icon: Icon, index }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 border-l-2 px-3 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                    isActive
                      ? 'border-cc-red bg-cc-red/10 pl-[10px] text-white'
                      : 'border-transparent text-white/50 hover:bg-white/[0.06] hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{label}</span>
                <span className="data-num text-[10px] text-white/35 group-hover:text-white/70">{index}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-3 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            ← Ver sitio público
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-white/10 px-3 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-cc-carbon px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex min-h-11 min-w-11 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
              <span className="hidden sm:inline">Panel administrativo <span className="text-white/25">/</span> </span>CARLIFE
            </span>
          </div>
          <Link
            to="/admin/motos/nuevo"
            aria-label="Nuevo vehículo"
            title="Nuevo vehículo"
            className="btn btn-light h-9 px-4"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nuevo vehículo</span>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container-cc !px-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
