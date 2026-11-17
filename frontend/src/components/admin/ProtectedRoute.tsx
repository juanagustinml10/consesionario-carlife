import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/auth';

/**
 * Ruta protegida del panel administrativo.
 * Si no hay sesión activa, redirige al login guardando la URL de destino.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
