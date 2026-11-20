import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  tone?: 'dark' | 'light';
}

/** Esqueleto con la misma proporción que BikeCard, para estados de carga consistentes. */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className, tone = 'dark' }) => {
  const light = tone === 'light';
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse border',
        light ? 'border-black/5 bg-white' : 'border-white/5 bg-sf-surface',
        className
      )}
    >
      <div className={cn('aspect-[4/3]', light ? 'bg-black/[0.04]' : 'bg-white/[0.04]')} />
      <div className="space-y-3 p-5">
        <div className={cn('h-2.5 w-20', light ? 'bg-black/[0.06]' : 'bg-white/[0.06]')} />
        <div className={cn('h-5 w-3/4', light ? 'bg-black/[0.08]' : 'bg-white/[0.08]')} />
        <div className={cn('h-3 w-1/2', light ? 'bg-black/[0.05]' : 'bg-white/[0.05]')} />
        <div className={cn('mt-5 flex items-center justify-between border-t pt-4', light ? 'border-black/5' : 'border-white/5')}>
          <div className={cn('h-7 w-28', light ? 'bg-black/[0.08]' : 'bg-white/[0.08]')} />
          <div className={cn('h-9 w-20', light ? 'bg-black/[0.05]' : 'bg-white/[0.05]')} />
        </div>
        <div className={cn('h-3 w-24', light ? 'bg-black/[0.05]' : 'bg-white/[0.05]')} />
      </div>
    </div>
  );
};
