import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-silver focus-visible:ring-offset-2 focus-visible:ring-offset-cc-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-cc-white text-cc-black hover:bg-cc-silver',
        outline: 'border border-white/25 bg-transparent text-white hover:border-white hover:bg-white/10',
        secondary: 'bg-cc-graphite text-white hover:bg-cc-slate',
        ghost: 'text-white/65 hover:bg-white/10 hover:text-white',
        destructive: 'bg-cc-silver text-cc-black hover:bg-cc-white',
        link: 'text-white/70 underline-offset-4 hover:text-white hover:underline',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4',
        lg: 'h-12 px-7',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = 'Button';

export { Button };
export default Button;
