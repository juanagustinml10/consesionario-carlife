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
 * quede con el `<div id="root">` vacío y muestra una salida clara.
 * El error original se registra en consola; no se silencia.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('CARLIFE — error de render:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cc-black px-6 py-16 text-center text-white">
        <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />
        <Logo onDark className="relative h-14" />
        <div className="relative mt-10 flex h-16 w-16 items-center justify-center border border-white/25 text-white">
          <CircleAlert size={32} strokeWidth={1.5} />
        </div>
        <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-white/45">
          CARLIFE
        </p>
        <h1 className="relative mt-3 font-display text-4xl font-bold uppercase leading-[0.9] sm:text-6xl">
          Algo salió <span className="text-white/40">mal</span>
        </h1>
        <p className="relative mt-4 max-w-md text-sm leading-relaxed text-white/55">
          No pudimos mostrar esta página. Recargá para intentarlo de nuevo o volvé al inicio del sitio.
        </p>
        <div className="relative mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-light px-7"
          >
            <RefreshCw size={16} /> Recargar página
          </button>
          <a href="/" className="btn btn-outline px-7">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }
}
