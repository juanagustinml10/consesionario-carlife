import * as React from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * Estado de error honesto: la API puede no responder y nunca debemos
 * transformar ese fallo en "no hay resultados" ni en datos inventados.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'No pudimos cargar la información',
  message = 'No pudimos conectarnos con el servidor en este momento. Intentá de nuevo en unos instantes.',
  onRetry,
  compact = false,
  tone = 'dark',
  className,
}) => {
  const light = tone === 'light';
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center border border-dashed text-center',
        light ? 'border-black/15 bg-white/60' : 'border-white/10 bg-jay-surface/40',
        compact ? 'gap-3 px-5 py-8' : 'gap-4 px-6 py-16',
        className
      )}
    >
      <CircleAlert size={compact ? 26 : 36} className={cn('shrink-0 text-jay-red', !light && 'text-jay-red-soft')} aria-hidden="true" />
      <div>
        <p className={cn('font-display font-bold uppercase', compact ? 'text-lg' : 'text-2xl', light ? 'text-jay-black' : 'text-white')}>
          {title}
        </p>
        <p className={cn('mx-auto mt-1 max-w-md text-sm leading-relaxed', light ? 'text-black/55' : 'text-gray-400')}>{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 border px-5 py-3 font-display text-xs font-bold uppercase tracking-widest transition-colors',
            light
              ? 'border-jay-black/70 text-jay-black hover:border-jay-red hover:text-jay-red'
              : 'btn btn-ghost'
          )}
        >
          <RefreshCw size={15} />
          Reintentar
        </button>
      )}
    </div>
  );
};
