import * as React from 'react';
import {
  NavLink as RRNavLink,
  type NavLinkProps,
  type NavLinkRenderProps,
} from 'react-router-dom';

/**
 * Enlace de navegación interno basado en React Router.
 * Envuelve NavLink para conservar el estilo de `active` en toda la app.
 */
type LinkProps = Omit<NavLinkProps, 'className'> & {
  className?: string | ((props: { isActive: boolean }) => string | undefined);
};

export const Link: React.FC<LinkProps> = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ className, children, to, ...props }, ref) => {
  return (
    <RRNavLink
      ref={ref}
      to={to}
      className={({ isActive }: NavLinkRenderProps) =>
        typeof className === 'function' ? className({ isActive }) : className
      }
      {...props}
    >
      {children}
    </RRNavLink>
  );
});
Link.displayName = 'Link';
