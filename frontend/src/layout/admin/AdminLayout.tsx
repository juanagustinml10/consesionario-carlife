import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Link } from '@/components/shared/Link';
import {
  LayoutDashboard,
  Motorbike,
  ChevronLeft,
  LogOut,
  User,
} from 'lucide-react';
import { authService } from '@/services/auth';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/admin/motos', label: 'Motocicletas', icon: <Motorbike size={20} /> },
];

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-jay-black text-jay-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-jay-black transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="block h-6 w-6 rounded bg-jay-red flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">
              JM
            </span>
            <span className="font-display text-xl font-bold tracking-tighter">JAY<span className="text-jay-red">MOTOS</span></span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-white hover:text-jay-red transition-colors"
            aria-label="Cerrar menú"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <nav className="mt-6 space-y-1 px-3">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => (window.innerWidth < 768 ? setSidebarOpen(false) : null)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
        <div className="mt-auto px-6 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={20} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-black/50 flex items-center justify-between px-6">
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <span>Panel administrativo — JAY MOTOS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5">
              <User size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-200">Administrador</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="container-jay"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};
