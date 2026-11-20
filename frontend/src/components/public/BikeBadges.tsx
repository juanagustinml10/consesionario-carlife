import * as React from 'react';
import { conditionLabel, statusLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BikeCondition, BikeStatus } from '@/types';

type Tone = 'dark' | 'light';

interface BadgeProps {
  overlay?: boolean;
  tone?: Tone;
}

export const ConditionTag: React.FC<BadgeProps & { condition: BikeCondition }> = ({ condition, overlay = false, tone = 'dark' }) => {
  const nueva = condition === 'NUEVA';
  return (
    <span
      className={cn(
        'tag',
        overlay
          ? nueva ? 'bg-sf-red text-white' : 'bg-white text-black'
          : nueva ? 'bg-sf-red text-white' : tone === 'light' ? 'bg-sf-black text-white' : 'bg-white text-black'
      )}
    >
      {conditionLabel(condition)}
    </span>
  );
};

export const StatusTag: React.FC<BadgeProps & { status: BikeStatus }> = ({ status, overlay = false, tone = 'dark' }) => {
  const dot =
    status === 'DISPONIBLE'
      ? 'bg-green-400'
      : status === 'RESERVADA'
        ? 'bg-amber-400'
        : status === 'BORRADOR'
          ? 'bg-gray-400'
          : 'bg-sf-red';
  return (
    <span
      className={cn(
        'tag',
        overlay
          ? 'bg-black/70 text-white backdrop-blur'
          : tone === 'light'
            ? 'border border-black/15 text-black/70'
            : 'border border-white/15 text-gray-300'
      )}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0', dot)} />
      {statusLabel(status)}
    </span>
  );
};

export const FeaturedTag: React.FC<BadgeProps> = ({ overlay = false, tone = 'dark' }) => (
  <span
    className={cn(
      'tag',
      overlay
        ? 'border border-sf-red/60 bg-black/70 text-sf-red-soft backdrop-blur'
        : tone === 'light'
          ? 'border border-sf-red/50 text-sf-red'
          : 'border border-sf-red/40 bg-sf-red/10 text-sf-red-soft'
    )}
  >
    Destacada
  </span>
);
