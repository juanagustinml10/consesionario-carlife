import * as React from 'react';
import { useState } from 'react';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';

import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Mail, Phone, MapPin } from 'lucide-react';

const CONTACTS = [
  { icon: <Phone size={20} />, label: 'WhatsApp', value: '+54 9 11 1234-5678', href: 'https://wa.me/5491112345678' },
  { icon: <Mail size={20} />, label: 'Email', value: 'ventas@jaymotos.com.ar', href: 'mailto:ventas@jaymotos.com.ar' },
  { icon: <MapPin size={20} />, label: 'Dirección', value: 'Av. Libertador 5400, CABA, Argentina' },
];

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-jay-white">
      <section className="py-20 lg:py-24">
        <div className="container-jay">
          {!sent ? (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-6 space-y-8">
                <h2 className="font-display text-3xl font-bold">Contactanos</h2>
                <p className="text-lg text-jay-black/60 leading-relaxed">
                  ¿Tenés preguntas sobre algún modelo, necesitás coordinar una prueba de manejo o querés reservar una moto?
                  Escríbinos y te respondemos a la brevedad.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-jay-black/70">Nombre y apellido</label>
                      <input
                        type="text"
                        required
                        className="w-full py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-jay-black/70">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-jay-black/70">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-jay-black/70">Mensaje</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full py-3.5 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                    />
                  </div>
                  <Button type="submit" variant="red" className="w-full">
                    Enviar consulta
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-6">
                  {CONTACTS.map((c, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-jay-black/5 flex items-center justify-center text-jay-black">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-jay-black/40 uppercase tracking-wider">{c.label}</p>
                        {c.href ? (
                          <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-sm text-jay-black hover:text-jay-red transition-colors block">
                            {c.value}
                          </a>
                        ) : (
                          <p className="text-sm text-jay-black">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 rounded-xl border border-jay-black/10 bg-jay-black/5">
                  <h3 className="font-bold mb-4">Consulta rápida por WhatsApp</h3>
                  <p className="text-sm text-jay-black/60 mb-4">
                    Guardá nuestro contacto y consultanos directamente desde tu celular.
                  </p>
                  <WhatsAppButton
                    phone="5491112345678"
                    message="Hola JAY MOTOS, vi su página web y me gustaría consultar sobre una moto."
                    label="Abrir WhatsApp"
                    className="w-full flex items-center justify-center gap-2"
                  />
                </div>

                <div>
                  <h3 className="font-bold mb-4">Síganos</h3>
                  <div className="flex gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-jay-black/40 hover:text-jay-red transition-colors" aria-label="Instagram">
                      <BrandIcon name="instagram" size={20} />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-jay-black/40 hover:text-jay-red transition-colors" aria-label="Facebook">
                      <BrandIcon name="facebook" size={20} />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-jay-black/40 hover:text-jay-red transition-colors" aria-label="Twitter">
                      <BrandIcon name="twitter" size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600">
                <Mail size={32} />
              </div>
              <h2 className="font-display text-3xl font-bold mb-4">Consulta enviada</h2>
              <p className="text-jay-black/60 mb-10">
                Gracias por contactar con JAY MOTOS. Te responderemos a la brevedad.
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black"
              >
                <XIcon size={16} /> Enviar otra consulta
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function BrandIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    instagram:
      'M12 2.16C6.47 2.16 2 6.63 2 12.16s4.47 10 10 10 10-4.47 10-10S17.53 2.16 12 2.16m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7',
    facebook: 'M22 12c0-5.52-4.48-10-10-10-2.93 0-5.66 1.28-7.66 3.22V5H8v6.22H6v5h2v5h5v-5h3.69l1-5H14v-2.67c0-2.66 1.56-4.22 4-4.22z',
    twitter: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 1v1.52A4.48 4.48 0 0 1 10 3.22a4.48 4.48 0 0 0-10.88 4.48 4.48 0 0 1-4.48-4.48v1.52A10.9 10.9 0 0 0 7.22 19c-1.16 0-2.17-.5-2.85-1.31v.12c0 3.43 1.87 6.54 4.72 8.32a10.1 10.1 0 0 1-4.93.51 10.1 10.1 0 0 1-5.11-1.42 18.8 18.8 0 0 0 5.54 10.45A10.3 10.3 0 0 1 4 22a10.3 10.3 0 0 1 5.24-1.88 18.5 18.5 0 0 0-2.29-.72v-.12c0-.32.03-.64.05-.96a10.335 10.335 0 0 1 6.8 10.1 10.335 10.335 0 0 1-10.34 10.1',
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

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
