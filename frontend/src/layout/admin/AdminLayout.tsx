import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Link } from '@/components/shared/Link';
import {
  LayoutDashboard,
  Motorbike,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { authService } from '@/services/auth';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/admin/motos', label: 'Motocicletas', icon: <Motorbike size={20} /> },
];

export const AdminLayout: React.FC = () => {
  // En desktop el sidebar siempre visible (md:), en mobile se abre con el botón hamburguesa
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-jay-black text-jay-white">
      {/* Overlay (solo mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: fijo en mobile, estático en desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-jay-black transition-transform duration-300 md:relative md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-jay-red text-[10px] font-black uppercase tracking-tighter text-white">
              JM
            </span>
            <span className="font-display text-xl font-bold tracking-tighter">
              JAY<span className="text-jay-red">MOTOS</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-white/80 transition-colors hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-jay-red text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-4 py-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={20} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido + top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/50 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-white/80 transition-colors hover:text-white md:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
            <span className="hidden text-sm text-gray-400 md:inline">Panel administrativo — JAY MOTOS</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <User size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-200">Administrador</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container-jay !px-0"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};
