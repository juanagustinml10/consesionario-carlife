import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/layout/Navbar';
import { Footer } from '@/layout/Footer';

/**
 * Layout de las rutas públicas.
 * Renderiza Navbar arriba, el contenido de la ruta en medio y Footer como cierre real de la página.
 */
export const PublicLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-jay-black">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
