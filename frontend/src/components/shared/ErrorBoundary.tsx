import * as React from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Red de seguridad ante errores de render no previstos: evita que la SPA
 * quede con el `<div id="root">` vacío (pantalla negra) y muestra una salida
 * clara. El error original se registra en consola; no se silencia.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('JAY MOTOS — error de render:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-jay-black px-6 py-16 text-center text-jay-white">
        <Logo className="h-12" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center border border-jay-red/40 bg-jay-red/5 text-jay-red-soft">
          <CircleAlert size={32} />
        </div>
        <p className="mt-6 font-display text-[10px] font-bold uppercase tracking-[0.35em] text-jay-red-soft">
          JAY MOTOS
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase italic leading-[0.9] sm:text-6xl">
          Algo salió <span className="text-jay-red">mal.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
          No pudimos mostrar esta página. Recargá para intentarlo de nuevo o volvé al inicio del sitio.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-red px-7 py-4 text-xs"
          >
            <RefreshCw size={16} /> Recargar página
          </button>
          <a href="/" className="btn btn-ghost px-7 py-4 text-xs">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }
}
