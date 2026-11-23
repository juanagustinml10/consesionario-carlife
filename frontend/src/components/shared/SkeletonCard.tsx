import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  tone?: 'dark' | 'light';
}

/** Esqueleto con la misma proporción que BikeCard. */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className, tone = 'light' }) => {
  const light = tone === 'light';
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse border', light ? 'border-black/10 bg-white' : 'border-white/10 bg-cc-carbon', className)}
    >
      <div className={cn('aspect-[4/3]', light ? 'bg-cc-soft' : 'bg-white/[0.06]')} />
      <div className="space-y-3 p-5">
        <div className={cn('h-2.5 w-20', light ? 'bg-black/10' : 'bg-white/10')} />
        <div className={cn('h-5 w-3/4', light ? 'bg-black/15' : 'bg-white/15')} />
        <div className={cn('h-3 w-1/2', light ? 'bg-black/10' : 'bg-white/10')} />
        <div className={cn('mt-5 flex items-center justify-between border-t pt-4', light ? 'border-black/10' : 'border-white/10')}>
          <div className={cn('h-7 w-28', light ? 'bg-black/15' : 'bg-white/15')} />
          <div className={cn('h-11 w-11', light ? 'bg-black/10' : 'bg-white/10')} />
        </div>
        <div className={cn('h-3 w-24', light ? 'bg-black/10' : 'bg-white/10')} />
      </div>
    </div>
  );
};
