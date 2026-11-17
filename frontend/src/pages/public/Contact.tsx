import * as React from 'react';
import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-jay-black text-jay-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-96 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(227,38,54,0.15),transparent)]" aria-hidden="true" />
        <div className="container-jay relative py-12 sm:py-16">
          <span className="eyebrow">Contacto</span>
          <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-[0.88] text-white sm:text-7xl">
            Hablemos<br /><span className="text-jay-red">en la calle.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-gray-400">
            Escribinos por el formulario, vení a la concesionaria o contanos qué moto buscás por WhatsApp.
          </p>
        </div>
      </section>

      <section className="container-jay grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
        {/* Formulario */}
        <div className="lg:col-span-7">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/8 bg-jay-surface p-12 text-center">
              <CheckCircle size={48} className="text-green-400" />
              <h2 className="mt-5 font-display text-3xl font-bold uppercase text-white">Consulta enviada</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                Gracias por contactar con JAY MOTOS. Te respondemos dentro del mismo día hábil.
              </p>
              <button onClick={() => setSent(false)} className="btn btn-ghost mt-6 px-6 py-3 text-xs">
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="nombre" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Nombre y apellido</label>
                  <input id="nombre" required placeholder="Juan Pérez" className="h-13 w-full rounded-xl border border-white/10 bg-jay-surface px-4 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email</label>
                  <input id="email" required type="email" placeholder="juan@email.com" className="h-13 w-full rounded-xl border border-white/10 bg-jay-surface px-4 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="telefono" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Teléfono</label>
                <input id="telefono" type="tel" placeholder="+54 9 11 ..." className="h-13 w-full rounded-xl border border-white/10 bg-jay-surface px-4 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="mensaje" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">¿Qué estás buscando?</label>
                <textarea id="mensaje" required rows={4} placeholder="Quiero una 0 km con entrega inmediata..." className="w-full rounded-xl border border-white/10 bg-jay-surface p-4 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red" />
              </div>
              <button type="submit" className="btn btn-red w-full py-4 text-sm">
                <Send size={17} />
                Enviar consulta
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-white/8">
            <div className="flex h-44 flex-col justify-center bg-jay-surface p-6">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-jay-red-soft"><MapPin size={13} /> Concesionaria</p>
              <p className="mt-3 font-display text-2xl font-bold uppercase leading-tight text-white">Av. Libertador 5400<br />CABA, Argentina</p>
              <a
                href="https://maps.google.com/?q=Av.+Libertador+5400+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </div>

          <ul className="space-y-4 rounded-2xl border border-white/8 bg-jay-surface p-6 text-sm text-gray-300">
            <li className="flex items-start gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-jay-red" />Lun–Sáb: 9:00–19:00 · Dom: cerrado</li>
            <li className="flex items-start gap-3"><Phone size={18} className="mt-0.5 shrink-0 text-jay-red" />+54 9 11 1234-5678</li>
            <li className="flex items-start gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-jay-red" />ventas@jaymotos.com.ar</li>
          </ul>

          <WhatsAppButton
            phone="5491112345678"
            message="Hola JAY MOTOS, vi su página web y me gustaría consultar sobre una moto."
            label="Abrir WhatsApp ahora"
            className="btn btn-red flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-sm"
          />
        </div>
      </section>
    </div>
  );
};
