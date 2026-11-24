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

/** Encabezado de sección: una sola etiqueta, un título fuerte y una acción. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  actionLabel,
  actionTo,
  tone = 'light',
  size = 'default',
}) => {
  const light = tone === 'light';
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-7 sm:mb-14 sm:flex-row sm:items-end sm:justify-between',
      )}
    >
      <div>
        <span className={cn('eyebrow', light ? 'eyebrow-dark' : 'eyebrow-light')}>{eyebrow}</span>
        <h2
          className={cn(
            'mt-5 font-display font-bold uppercase',
            size === 'large' ? 'text-5xl sm:text-7xl lg:text-8xl' : 'text-4xl sm:text-6xl',
            light ? 'text-cc-black' : 'text-white',
          )}
        >
          {title}
        </h2>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className={cn(
            'group inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b pb-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors sm:self-auto',
            light
              ? 'border-black/25 text-cc-slate hover:border-black hover:text-black'
              : 'border-white/30 text-white/65 hover:border-white hover:text-white',
          )}
        >
          {actionLabel}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
};
