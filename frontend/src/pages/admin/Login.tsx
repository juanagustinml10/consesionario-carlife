import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { authService } from '@/services/auth';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.login({
        email,
        password,
      });
      authService.setSession(
        { accessToken, refreshToken },
        { id: email, email, role: 'admin' },
      );
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('Credenciales inválidas. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-sf-black">
      <div className="track-lines relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-sf-border bg-sf-surface p-10 lg:flex xl:p-14">
        <div className="diagonal-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <Logo onDark className="h-12" />
        </div>

        <div className="relative max-w-lg">
          <span className="micro-label text-sf-red">Acceso restringido</span>
          <div className="race-rule my-6" />
          <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight text-white xl:text-6xl">
            Control de
            <br />
            <span className="text-sf-red">operaciones.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-sf-ink-400">
            Gestión interna de motocicletas, imágenes y publicaciones del catálogo
            de SF MOTOS.
          </p>
        </div>

        <div className="relative flex items-end justify-between border-t border-sf-border pt-5 font-mono text-[10px] uppercase tracking-widest text-sf-ink-600">
          <span>SF / ADMIN v1</span>
          <span>9 de Julio 119 · Tucumán</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sf-ink-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} /> Volver al sitio público
          </Link>

          <div className="border border-sf-border bg-sf-surface p-7 sm:p-10">
            <div className="border-l-2 border-sf-red pl-4">
              <span className="micro-label text-sf-red">Panel SF</span>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-white">
                Iniciar sesión
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-sf-ink-400">
              Ingresá con las credenciales administrativas para continuar.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 border-l-2 border-sf-red bg-sf-red/10 px-4 py-3 text-sm text-white"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-sf-ink-300"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sf-ink-500"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="admin@sfmotos.invalid"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full border border-sf-border-strong bg-sf-black pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-sf-ink-600 focus:border-sf-red"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-sf-ink-300"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sf-ink-500"
                  />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full border border-sf-border-strong bg-sf-black pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-sf-ink-600 focus:border-sf-red"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-red mt-2 w-full disabled:opacity-50"
              >
                {loading ? 'Ingresando…' : 'Ingresar al panel'}
              </button>
            </form>

            <p className="mt-8 border-t border-sf-border pt-5 text-center text-[11px] leading-relaxed text-sf-ink-500">
              Las credenciales se gestionan en el servidor. No compartas tu
              usuario ni contraseña.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
