import * as React from 'react';
import { conditionLabel, statusLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BikeCondition, BikeStatus } from '@/types';

type Tone = 'dark' | 'light';

interface BadgeProps {
  overlay?: boolean;
  tone?: Tone;
}

/** Etiquetas claras y legibles, pensadas para tarjetas de fondo blanco. */
export const ConditionTag: React.FC<BadgeProps & { condition: BikeCondition }> = ({ condition }) => (
  <span className={cn('tag', 'tag-solid')}>{conditionLabel(condition)}</span>
);

export const StatusTag: React.FC<BadgeProps & { status: BikeStatus }> = ({ status, overlay = false, tone = 'light' }) => {
  const dot =
    status === 'DISPONIBLE'
      ? overlay || tone === 'light' ? 'bg-cc-black' : 'bg-white'
      : status === 'RESERVADA'
        ? 'bg-cc-metal'
        : 'bg-cc-metal/60';
  return (
    <span
      className={cn(
        'tag',
        overlay
          ? 'tag-white shadow-sm'
          : tone === 'dark'
            ? 'border-white/20 text-white/75'
            : 'tag-dark',
      )}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0', dot)} />
      {statusLabel(status)}
    </span>
  );
};

export const FeaturedTag: React.FC<BadgeProps> = ({ overlay = false, tone = 'light' }) => (
  <span
    className={cn(
      'tag',
      overlay ? 'tag-white shadow-sm' : tone === 'dark' ? 'border-white/25 text-white/80' : 'tag-dark',
    )}
  >
    Destacado
  </span>
);
