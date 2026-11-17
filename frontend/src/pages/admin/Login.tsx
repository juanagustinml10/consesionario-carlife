import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';

import { Mail, Lock, Motorbike } from 'lucide-react';
import { authService } from '@/services/auth';
import { Logo } from '@/components/shared/Logo';

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
      <div className="relative hidden items-center justify-center overflow-hidden bg-black lg:flex lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 diagonal-lines" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(227,38,54,0.18),transparent)]" aria-hidden="true" />
        <div className="relative text-center">
          <Logo className="mx-auto h-24" />
          <p className="mt-6 font-display text-xs font-bold uppercase tracking-[0.35em] text-gray-500">
            Panel de administración
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-jay-black p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 text-gray-500 hover:text-jay-red transition-colors">
            <Motorbike size={18} />
            Volver al sitio público
          </Link>

          <div className="rounded-2xl border border-white/8 bg-jay-surface p-8 shadow-card md:p-10">
            <h2 className="font-display text-2xl font-bold mb-2">Iniciar sesión</h2>
            <p className="text-sm text-gray-400 mb-8">
              Acceso exclusivo al panel administrativo de JAY MOTOS.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg border border-jay-red/30 bg-jay-red/5 text-jay-red text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="admin@jaymotos.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
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

            <p className="mt-8 text-xs text-gray-500 text-center">
              Las credenciales se gestionan mediante variables de entorno del
              servidor. No compartas tu usuario ni contraseña.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
