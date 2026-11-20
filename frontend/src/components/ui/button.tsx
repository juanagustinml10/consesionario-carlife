import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-red focus-visible:ring-offset-2 focus-visible:ring-offset-sf-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-sf-red text-white hover:bg-[#ff2e37]',
        outline:
          'border border-sf-border-strong bg-transparent text-white hover:border-sf-red hover:bg-sf-red/10 hover:text-white',
        secondary: 'bg-white text-sf-black hover:bg-sf-ink-100',
        ghost: 'text-sf-ink-300 hover:bg-white/5 hover:text-white',
        destructive: 'bg-sf-red text-white hover:bg-[#ff2e37]',
        link: 'text-sf-red underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-7 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button };
export default Button;
