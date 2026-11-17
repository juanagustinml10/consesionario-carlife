import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  actionLabel?: string;
  actionTo?: string;
  index?: string;
  tone?: 'dark' | 'light';
  size?: 'default' | 'large';
}

/** Encabezado editorial reutilizable: marker numérico, título deportivo y acción opcional. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  actionLabel,
  actionTo,
  index,
  tone = 'dark',
  size = 'default',
}) => {
  const light = tone === 'light';
  return (
    <div className="mb-8 flex flex-col gap-5 border-t border-jay-red/60 pt-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          {index && <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">{index}</span>}
          <span className={cn('eyebrow', light && '!text-jay-red')}>{eyebrow}</span>
        </div>
        <h2 className={cn(
          'mt-2 font-display font-extrabold uppercase italic leading-[0.88]',
          size === 'large' ? 'text-5xl sm:text-7xl lg:text-8xl' : 'text-4xl sm:text-6xl',
          light ? 'text-jay-black' : 'text-white'
        )}>
          {title}
        </h2>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 border-b pb-1 font-display text-xs font-extrabold uppercase tracking-[0.2em] transition-colors',
            light
              ? 'border-black/20 text-black/70 hover:border-jay-red hover:text-jay-red'
              : 'border-white/20 text-gray-300 hover:border-jay-red hover:text-white'
          )}
        >
          {actionLabel} <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
};
