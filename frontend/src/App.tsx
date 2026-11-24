import { useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Home } from '@/pages/public/Home';
import { Catalog } from '@/pages/public/Catalog';
import { BikeDetail } from '@/pages/public/BikeDetail';
import { Favorites } from '@/pages/public/Favorites';
import { Financiacion } from '@/pages/public/Financiacion';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';
import { Services } from '@/pages/public/Services';
import { NotFound } from '@/pages/public/NotFound';

import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Bikes } from '@/pages/admin/Bikes';
import { BikeForm } from '@/pages/admin/BikeForm';
import { AdminLayout } from '@/layout/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { PublicLayout } from '@/layout/PublicLayout';

/**
 * React Router conserva el scroll entre rutas. Al cambiar de sección hay que
 * volver arriba para que la página nueva arranque desde su principio (en vez
 * de quedar a la altura en la que se estaba en la anterior).
 * Se clave por pathname para no resetear al filtrar con query params.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Página pública — todas heredan Navbar + Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/motos" element={<Catalog />} />
        <Route path="/motos/:slug" element={<BikeDetail />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/financiacion" element={<Financiacion />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel administrativo */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="motos" element={<Bikes />} />
        <Route path="motos/nuevo" element={<BikeForm />} />
        <Route path="motos/:id/editar" element={<BikeForm />} />
      </Route>
    </Routes>
  </>
);
