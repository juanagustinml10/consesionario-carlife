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

/**
 * Cabecera de página reutilizable. Cada página elige tono, alineación,
 * palabra de fondo y contenido extra para construir una composición propia.
 * La variante compact mantiene la identidad pero reduce la altura y el título.
 */
export const PageIntro: React.FC<PageIntroProps> = ({
  index,
  eyebrow,
  title,
  description,
  actions,
  outline,
  tone = 'dark',
  align = 'left',
  size = 'default',
  className,
  children,
}) => {
  const light = tone === 'light';
  const compact = size === 'compact';

  const titleSize = compact
    ? 'mt-2 text-3xl leading-[0.95] sm:text-4xl lg:text-5xl'
    : size === 'large'
      ? 'mt-4 text-6xl leading-[0.85] sm:text-8xl lg:text-9xl'
      : 'mt-4 text-5xl leading-[0.85] sm:text-7xl';

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b',
        light ? 'border-black/10 bg-sf-paper text-sf-black' : 'border-white/5 bg-sf-black text-white',
        className
      )}
    >
      {!light && <div className="radial-glow pointer-events-none absolute -right-40 -top-52 h-[36rem] w-[36rem] opacity-70" aria-hidden="true" />}
      {outline && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-[-0.3em] right-[-0.05em] hidden select-none font-display font-extrabold leading-none lg:block',
            compact ? 'text-[9rem] opacity-60 xl:text-[13rem]' : 'text-[15rem] xl:text-[20rem]',
            light ? 'text-outline-light' : 'text-outline'
          )}
        >
          {outline}
        </span>
      )}
      <div className={cn('container-sf relative', compact ? 'py-6 sm:py-8' : 'py-14 sm:py-20', align === 'center' && 'text-center')}>
        <div className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
          {index && (
            <span className={cn(
              'font-display',
              compact ? 'text-[10px] font-bold tracking-[0.18em] text-sf-red/90' : 'text-xs font-extrabold tracking-[0.2em] text-sf-red'
            )}>
              {index}
            </span>
          )}
          <span className={cn('h-px bg-sf-red', compact ? 'w-6 opacity-70' : 'w-10')} />
          <span className={cn(
            'font-display font-bold uppercase',
            compact
              ? 'text-[9px] tracking-[0.28em] text-gray-500'
              : cn('text-[10px] tracking-[0.35em]', light ? 'text-black/50' : 'text-gray-400')
          )}>
            {eyebrow}
          </span>
        </div>
        <h1
          className={cn(
            'font-display font-extrabold uppercase',
            titleSize,
            light ? 'text-sf-black' : 'text-white'
          )}
        >
          {title}
        </h1>
        {description && (
          <div className={cn(
            'max-w-2xl leading-relaxed',
            compact ? 'mt-2 text-sm' : 'mt-5 text-base',
            align === 'center' && 'mx-auto',
            light ? 'text-black/60' : 'text-gray-400'
          )}>
            {description}
          </div>
        )}
        {actions && <div className={cn('flex flex-col gap-3 sm:flex-row', compact ? 'mt-5' : 'mt-7', align === 'center' && 'sm:justify-center')}>{actions}</div>}
        {children}
      </div>
    </section>
  );
};
