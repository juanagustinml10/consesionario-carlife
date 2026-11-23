import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageIntroProps {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  outline?: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center';
  size?: 'default' | 'large' | 'compact';
  className?: string;
  children?: React.ReactNode;
}

/** Cabecera editorial reutilizable para las páginas públicas. */
export const PageIntro: React.FC<PageIntroProps> = ({
  eyebrow,
  title,
  description,
  actions,
  tone = 'light',
  align = 'left',
  size = 'default',
  className,
  children,
}) => {
  const light = tone === 'light';
  const compact = size === 'compact';

  const titleSize = compact
    ? 'mt-6 text-4xl sm:text-6xl lg:text-7xl'
    : size === 'large'
      ? 'mt-7 text-5xl sm:text-7xl lg:text-[7.5rem]'
      : 'mt-7 text-5xl sm:text-7xl lg:text-[7rem]';

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b pt-28 sm:pt-36',
        light ? 'border-black/10 bg-cc-soft text-cc-black' : 'border-white/10 bg-cc-black text-white',
        className,
      )}
    >
      <div className={cn('container-cc relative', compact ? 'pb-10 sm:pb-12' : 'pb-16 sm:pb-24', align === 'center' && 'text-center')}>
        <span className={cn('eyebrow', light ? 'eyebrow-dark' : 'eyebrow-light')}>{eyebrow}</span>

        <h1 className={cn('font-display font-bold uppercase', titleSize)}>{title}</h1>

        {description && (
          <div
            className={cn(
              'max-w-2xl leading-relaxed',
              compact ? 'mt-5 text-sm' : 'mt-8 text-base',
              align === 'center' && 'mx-auto',
              light ? 'text-cc-slate' : 'text-white/60',
            )}
          >
            {description}
          </div>
        )}

        {actions && (
          <div
            className={cn(
              'flex flex-col gap-3 sm:flex-row',
              compact ? 'mt-7' : 'mt-10',
              align === 'center' && 'sm:justify-center',
            )}
          >
            {actions}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
