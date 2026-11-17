import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';

import { Mail, Lock, Motorbike } from 'lucide-react';
import { authService } from '@/services/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.login({
        email,
        password,
      });
      // El backend devuelve también el usuario autenticado; por ahora se guarda un perfil mínimo.
      authService.setSession(
        { accessToken, refreshToken },
        { id: email, email, role: 'admin' }
      );
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Credenciales inválidas. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-jay-black">
      <div className="hidden lg:flex lg:w-1/2 bg-jay-red/10 items-center justify-center p-12">
        <div className="text-center">
          <div className="h-12 w-12 rounded bg-jay-red flex items-center justify-center text-white font-black text-lg uppercase tracking-tighter mx-auto mb-4">
            JM
          </div>
          <h2 className="font-display text-3xl font-bold text-jay-white">
            JAY<span className="text-jay-red">MOTOS</span>
          </h2>
          <p className="mt-3 text-gray-400">
            Panel de administración de la concesionaria
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-jay-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 text-jay-black/50 hover:text-jay-red transition-colors">
            <Motorbike size={18} />
            Volver al sitio público
          </Link>

          <div className="rounded-xl border border-jay-black/10 bg-jay-white p-8 md:p-12 shadow-lg">
            <h2 className="font-display text-2xl font-bold mb-2">Iniciar sesión</h2>
            <p className="text-sm text-jay-black/60 mb-8">
              Acceso exclusivo al panel administrativo de JAY MOTOS.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg border border-jay-red/30 bg-jay-red/5 text-jay-red text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-jay-black/70">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jay-black/30" />
                  <input
                    type="email"
                    required
                    placeholder="admin@jaymotos.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-jay-black/70">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jay-black/30" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="red"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Ingresar al panel'}
              </Button>
            </form>

            <p className="mt-8 text-xs text-jay-black/40 text-center">
              Las credenciales se gestionan mediante variables de entorno del
              servidor. No compartas tu usuario ni contraseña.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
