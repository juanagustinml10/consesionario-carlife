import * as React from 'react';
import { Link } from '@/components/shared/Link';
import { Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Catálogo', to: '/motos' },
  { label: 'Motos destacadas', to: '/motos?featured=true' },
  { label: 'Comparador', to: '/comparador' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
  { label: 'Panel administrativo', to: '/admin/login' },
];

const CONTACT_INFO = [
  { icon: <Phone size={18} />, label: 'Consultas por WhatsApp', href: 'https://wa.me', target: '_blank' },
  { icon: <Mail size={18} />, label: 'ventas@jaymotos.com.ar', href: 'mailto:ventas@jaymotos.com.ar' },
  { icon: <MapPin size={18} />, label: 'Av. Libertador 5400, CABA, Argentina' },
];

function BrandIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    instagram:
      'M12 2.16C6.47 2.16 2 6.63 2 12.16s4.47 10 10 10 10-4.47 10-10S17.53 2.16 12 2.16m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7',
    facebook: 'M22 12c0-5.52-4.48-10-10-10-2.93 0-5.66 1.28-7.66 3.22V5H8v6.22H6v5h2v5h5v-5h3.69l1-5H14v-2.67c0-2.66 1.56-4.22 4-4.22z',
    twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 1v1.52A4.48 4.48 0 0 1 10 3.22a4.48 4.48 0 0 0-10.88 4.48 4.48 4.48 0 0 1-4.48-4.48v1.52A10.9 10.9 0 0 0 7.22 19c-1.16 0-2.17-.5-2.85-1.31v.12c0 3.43 1.87 6.54 4.72 8.32a10.1 10.1 0 0 1-4.93.51 10.1 10.1 0 0 1-5.11-1.42 18.8 18.8 0 0 0 5.54 10.45A10.3 10.3 0 0 1 4 22a10.3 10.3 0 0 1 5.24-1.88 18.5 18.5 0 0 0-2.29-.72v-.12c0-.32.03-.64.05-.96a10.335 10.335 0 0 1 6.8 10.1 10.335 10.335 0 0 1-10.34 10.1',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths[name] ?? '' }}
    />
  );
}

export const Footer: React.FC = () => (
  <footer className="border-t border-jay-black/5 bg-jay-black text-jay-white">
    <div className="container-jay py-12 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <span className="block h-6 w-6 rounded bg-jay-red flex items-center justify-center text-[10px] font-black uppercase tracking-tighter mb-3">JM</span>
          <span className="font-display text-xl font-bold tracking-tighter">JAY<span className="text-jay-red">MOTOS</span></span>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Concesionaria oficial de motocicletas 0 km y usadas. Asesoramiento profesional y atención personalizada.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Explorar</h4>
          <ul className="space-y-3">
            {FOOTER_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-sm text-gray-300 hover:text-jay-red transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Contacto</h4>
          <ul className="space-y-3">
            {CONTACT_INFO.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                {item.icon}
                {item.href ? (
                  <a href={item.href} target={item.target} rel="noopener noreferrer" className="hover:text-jay-red transition-colors">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Síganos</h4>
          <div className="flex gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-jay-red transition-colors" aria-label="Instagram">
              <BrandIcon name="instagram" size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-jay-red transition-colors" aria-label="Facebook">
              <BrandIcon name="facebook" size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-jay-red transition-colors" aria-label="Twitter">
              <BrandIcon name="twitter" size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <span>JAY MOTOS — Concesionaria Digital. Todos los derechos reservados.</span>
        <span>Las fotografías y precios son referenciales y están sujetos a confirmación en concesionaria.</span>
      </div>
    </div>
  </footer>
);
