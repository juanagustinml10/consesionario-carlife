import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/layout/Navbar';
import { Footer } from '@/layout/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';

/**
 * Layout de las rutas públicas.
 * Renderiza Navbar arriba, el contenido de la ruta en medio y Footer como cierre real de la página.
 */
export const PublicLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cc-black focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
    >
      Saltar al contenido principal
    </a>
    <Navbar />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton floating variant="icon" ariaLabel="Consultar por WhatsApp" />
  </div>
);
