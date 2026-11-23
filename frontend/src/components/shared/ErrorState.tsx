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

/** Estado de error honesto: nunca convertimos un fallo de API en datos inventados. */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'No pudimos cargar la información',
  message = 'No pudimos conectarnos con el servidor en este momento. Intentá de nuevo en unos instantes.',
  onRetry,
  compact = false,
  tone = 'light',
  className,
}) => {
  const light = tone === 'light';
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center border border-dashed text-center',
        light ? 'border-black/20 bg-white' : 'border-white/20 bg-cc-carbon',
        compact ? 'gap-3 px-5 py-8' : 'gap-4 px-6 py-16',
        className,
      )}
    >
      <CircleAlert
        size={compact ? 26 : 36}
        className={cn('shrink-0', light ? 'text-black/45' : 'text-white/50')}
        aria-hidden="true"
      />
      <div>
        <p
          className={cn(
            'font-display font-bold uppercase',
            compact ? 'text-lg' : 'text-2xl',
            light ? 'text-cc-black' : 'text-white',
          )}
        >
          {title}
        </p>
        <p className={cn('mx-auto mt-2 max-w-md text-sm leading-relaxed', light ? 'text-black/55' : 'text-white/55')}>
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-2 border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors',
            light
              ? 'border-black/30 text-cc-black hover:bg-cc-black hover:text-white'
              : 'border-white/40 text-white hover:bg-white hover:text-cc-black',
          )}
        >
          <RefreshCw size={15} />
          Reintentar
        </button>
      )}
    </div>
  );
};
