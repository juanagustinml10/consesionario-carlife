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

/** Estado vacío con la misma voz visual en catálogo, comparador y favoritos. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  code,
  title,
  description,
  actions,
  tone = 'dark',
  className,
}) => {
  const light = tone === 'light';
  return (
    <div
      className={cn(
        'relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center',
        light ? 'panel-light' : 'panel',
        className
      )}
    >
      {code && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-4 select-none font-display text-[11rem] font-extrabold italic leading-none sm:text-[16rem]',
            light ? 'text-outline-light' : 'text-outline'
          )}
        >
          {code}
        </span>
      )}
      <div className={cn('relative flex h-16 w-16 items-center justify-center border', light ? 'border-jay-red/40 text-jay-red' : 'border-jay-red/40 text-jay-red-soft bg-jay-red/5')}>
        {icon}
      </div>
      <h2 className={cn('relative mt-6 font-display text-4xl font-extrabold uppercase italic leading-[0.9] sm:text-5xl', light ? 'text-jay-black' : 'text-white')}>
        {title}
      </h2>
      <p className={cn('relative mt-3 max-w-md text-sm leading-relaxed', light ? 'text-black/55' : 'text-gray-400')}>
        {description}
      </p>
      {actions && <div className="relative mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">{actions}</div>}
    </div>
  );
};
