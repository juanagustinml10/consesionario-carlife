import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BUSINESS } from '@/lib/constants';
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
    <div className="flex min-h-screen bg-cc-black text-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-cc-carbon p-10 lg:flex xl:p-14">
        <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 diagonal-lines opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/[0.04] blur-[120px]" aria-hidden="true" />

        <div className="relative">
          <Logo onDark className="h-14 lg:h-16" />
        </div>

        <div className="relative max-w-lg">
          <span className="eyebrow eyebrow-light">Acceso restringido</span>
          <div className="my-6 h-px w-full bg-white/15" />
          <h1 className="display-lg">
            Control de<br />operaciones.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
            Gestión interna de vehículos, imágenes y publicaciones del catálogo de {BUSINESS.name}.
          </p>
        </div>

        <div className="relative flex items-end justify-between border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <span>{BUSINESS.name} / Admin</span>
          <span>{BUSINESS.address}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} /> Volver al sitio público
          </Link>

          <div className="relative border border-white/10 bg-cc-carbon p-7 shadow-card sm:p-10">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-cc-red" aria-hidden="true" />
            <div className="border-l-2 border-cc-red pl-4">
              <span className="eyebrow eyebrow-light">Panel interno</span>
              <h2 className="display-md mt-3">Iniciar sesión</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Ingresá con las credenciales administrativas para continuar.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 border-l-2 border-white bg-white/[0.06] px-4 py-3 text-sm text-white"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="field-label mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="admin@carlife.invalid"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="field h-12 pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="field-label mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="field h-12 pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-light mt-2 w-full py-3 disabled:opacity-50"
              >
                {loading ? 'Ingresando…' : 'Ingresar al panel'}
              </button>
            </form>

            <p className="mt-8 border-t border-white/10 pt-5 text-center text-[11px] leading-relaxed text-white/40">
              Las credenciales se gestionan en el servidor. No compartas tu usuario ni contraseña.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
