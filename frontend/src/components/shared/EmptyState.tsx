import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  code?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

/** Estado vacío con la misma voz visual en catálogo y favoritos. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  code,
  title,
  description,
  actions,
  tone = 'light',
  className,
}) => {
  const light = tone === 'light';
  return (
    <div
      className={cn(
        'relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden border px-6 py-16 text-center',
        light ? 'border-black/10 bg-white' : 'border-white/10 bg-cc-carbon',
        className,
      )}
    >
      {code && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-6 select-none font-display text-[12rem] font-bold leading-none sm:text-[18rem]',
            light ? 'text-outline-dark' : 'text-outline-light',
          )}
        >
          {code}
        </span>
      )}
      <div
        className={cn(
          'relative flex h-16 w-16 items-center justify-center border',
          light ? 'border-black/15 bg-cc-soft text-cc-black' : 'border-white/25 text-white',
        )}
      >
        {icon}
      </div>
      <h2 className={cn('relative mt-6 font-display text-3xl font-bold uppercase sm:text-5xl', light ? 'text-cc-black' : 'text-white')}>
        {title}
      </h2>
      <p className={cn('relative mt-3 max-w-md text-sm leading-relaxed', light ? 'text-black/55' : 'text-white/55')}>
        {description}
      </p>
      {actions && <div className="relative mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">{actions}</div>}
    </div>
  );
};
