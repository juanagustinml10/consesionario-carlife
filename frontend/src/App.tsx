import { Routes, Route, Navigate } from 'react-router-dom';

import { Home } from '@/pages/public/Home';
import { Catalog } from '@/pages/public/Catalog';
import { BikeDetail } from '@/pages/public/BikeDetail';
import { Compare } from '@/pages/public/Compare';
import { Favorites } from '@/pages/public/Favorites';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';

import { Login } from '@/pages/admin/Login';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Bikes } from '@/pages/admin/Bikes';
import { BikeForm } from '@/pages/admin/BikeForm';
import { AdminLayout } from '@/layout/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

export const App = () => (
  <Routes>
    {/* Página pública */}
    <Route path="/" element={<Home />} />
    <Route path="/motos" element={<Catalog />} />
    <Route path="/motos/:slug" element={<BikeDetail />} />
    <Route path="/comparador" element={<Compare />} />
    <Route path="/favoritos" element={<Favorites />} />
    <Route path="/nosotros" element={<About />} />
    <Route path="/contacto" element={<Contact />} />

    {/* Panel administrativo */}
    <Route path="/admin/login" element={<Login />} />
    <Route
      path="/admin"
      element={
        <>
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        </>
      }
    >
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="motos" element={<Bikes />} />
      <Route path="motos/nuevo" element={<BikeForm />} />
      <Route path="motos/:id/editar" element={<BikeForm />} />
    </Route>
  </Routes>
);
