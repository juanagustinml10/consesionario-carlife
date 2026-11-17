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
  size?: 'default' | 'large';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Cabecera de página reutilizable. Cada página elige tono, alineación,
 * palabra de fondo y contenido extra para construir una composición propia.
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
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b',
        light ? 'border-black/10 bg-[#f3f3f3] text-jay-black' : 'border-white/5 bg-jay-black text-white',
        className
      )}
    >
      {!light && <div className="radial-glow pointer-events-none absolute -right-40 -top-52 h-[36rem] w-[36rem] opacity-70" aria-hidden="true" />}
      {outline && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-[-0.3em] right-[-0.05em] hidden select-none font-display text-[15rem] font-extrabold italic leading-none lg:block xl:text-[20rem]',
            light ? 'text-outline-light' : 'text-outline'
          )}
        >
          {outline}
        </span>
      )}
      <div className={cn('container-jay relative py-14 sm:py-20', align === 'center' && 'text-center')}>
        <div className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
          {index && <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">{index}</span>}
          <span className={cn('h-px w-10 bg-jay-red')} />
          <span className={cn('font-display text-[10px] font-bold uppercase tracking-[0.35em]', light ? 'text-black/50' : 'text-gray-400')}>
            {eyebrow}
          </span>
        </div>
        <h1
          className={cn(
            'mt-4 font-display font-extrabold uppercase leading-[0.85]',
            size === 'large' ? 'text-6xl sm:text-8xl lg:text-9xl' : 'text-5xl sm:text-7xl',
            light ? 'text-jay-black' : 'text-white'
          )}
        >
          {title}
        </h1>
        {description && (
          <div className={cn('mt-5 max-w-2xl text-base leading-relaxed', align === 'center' && 'mx-auto', light ? 'text-black/60' : 'text-gray-400')}>
            {description}
          </div>
        )}
        {actions && <div className={cn('mt-7 flex flex-col gap-3 sm:flex-row', align === 'center' && 'sm:justify-center')}>{actions}</div>}
        {children}
      </div>
    </section>
  );
};
