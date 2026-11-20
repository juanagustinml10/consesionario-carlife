import * as React from 'react';
import { useState } from 'react';
import { Phone, MapPin, Truck, CheckCircle, Send, MessageCircle, ArrowUpRight, Navigation } from 'lucide-react';
import { PageIntro } from '@/components/public/PageIntro';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';

interface ConsultaForm {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const EMPTY_FORM: ConsultaForm = { nombre: '', email: '', telefono: '', mensaje: '' };

/** Arma el texto de la consulta sin enviarlo a ningún servidor. */
const buildConsultaMessage = (form: ConsultaForm) => [
  `Hola SF MOTOS! Mi nombre es ${form.nombre.trim()}.`,
  `Email: ${form.email.trim()}`,
  form.telefono.trim() ? `Teléfono: ${form.telefono.trim()}` : '',
  '',
  'Consulta:',
  form.mensaje.trim(),
].filter((line, index) => index === 0 || line !== '').join('\n');

// Mismo embed que ya usa la Home, para que el mapa se comporte igual en todo el sitio.
const MAPS_EMBED = 'https://www.google.com/maps?q=9+de+Julio+119+Juan+B.+Alberdi+Tucuman+Argentina&output=embed';

export const Contact: React.FC = () => {
  const [form, setForm] = useState<ConsultaForm>(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const waGeneral = buildWhatsAppLink(BUSINESS.whatsappGeneralMessage);

  const update = (key: keyof ConsultaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No hay backend de contacto: preparamos el mensaje en WhatsApp para que
    // el usuario lo envíe desde su propia app. Nunca simulamos un envío real.
    window.open(buildWhatsAppLink(buildConsultaMessage(form)), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="bg-sf-black text-sf-white">
      {/* 01 / Encabezado */}
      <PageIntro
        index="01"
        eyebrow="Contacto · SF MOTOS"
        title={<>Hablemos<br /><span className="text-sf-red">en la calle</span></>}
        outline="HOLA"
        description={
          <>
            <p>Escribinos, vení a la concesionaria o hablemos por WhatsApp. Estamos en {BUSINESS.address}.</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} className="text-sf-red" /> Tucumán, Argentina · {BUSINESS.shippingLabel}
            </p>
          </>
        }
      />

      {/* 02 / Formulario + puntos de contacto */}
      <section className="track-lines">
        <div className="container-sf grid gap-8 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
          {/* Formulario */}
          <div className="lg:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="font-display text-xs font-extrabold tracking-[0.2em] text-sf-red">02</span>
              <span className="h-px w-10 bg-sf-red" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">Escribinos</span>
            </div>

            <div className="panel relative p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-sf-red" aria-hidden="true" />

              {sent ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-green-400/40 bg-green-400/10 text-green-400">
                    <CheckCircle size={34} />
                  </div>
                  <h2 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                    Consulta <span className="text-sf-red">preparada</span>
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
                    Abrimos WhatsApp con los datos que ingresaste. Revisá la ventana nueva y enviá el mensaje
                    para que podamos responderte.
                  </p>
                  <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <a href={buildWhatsAppLink(buildConsultaMessage(form))} target="_blank" rel="noopener noreferrer" className="btn btn-red px-6 py-3 text-xs">
                      <MessageCircle size={16} /> Abrir WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => { setForm(EMPTY_FORM); setSent(false); }}
                      className="btn btn-ghost px-6 py-3 text-xs"
                    >
                      Escribir otra consulta
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-start gap-3 border border-white/10 bg-sf-elevated/60 p-4">
                    <MessageCircle size={18} className="mt-0.5 shrink-0 text-sf-red" />
                    <p className="text-xs leading-relaxed text-gray-400">
                      Este formulario prepara tu consulta en WhatsApp. No envía datos a un servidor: el mensaje se envía
                      cuando lo confirmás en la app.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="field-label">Nombre y apellido</label>
                      <input id="nombre" required autoComplete="name" placeholder="Juan Pérez" value={form.nombre} onChange={update('nombre')} className="field" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="field-label">Email</label>
                      <input id="email" required type="email" autoComplete="email" placeholder="juan@email.com" value={form.email} onChange={update('email')} className="field" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefono" className="field-label">Teléfono (opcional)</label>
                    <input id="telefono" type="tel" autoComplete="tel" placeholder="381 ..." value={form.telefono} onChange={update('telefono')} className="field" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mensaje" className="field-label">¿Qué moto buscás?</label>
                    <textarea
                      id="mensaje"
                      required
                      rows={5}
                      placeholder="Quiero información sobre una moto publicada..."
                      value={form.mensaje}
                      onChange={update('mensaje')}
                      className="field h-auto resize-y py-4 leading-relaxed"
                    />
                  </div>
                  <button type="submit" className="btn btn-red flex w-full items-center justify-center gap-2 py-4 text-sm">
                    <Send size={17} />
                    Preparar consulta en WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contacto directo + mapa */}
          <div className="space-y-5 lg:col-span-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="font-display text-xs font-extrabold tracking-[0.2em] text-sf-red">03</span>
              <span className="h-px w-10 bg-sf-red" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">Encontranos</span>
            </div>

            {/* WhatsApp destacado */}
            <div className="relative overflow-hidden bg-sf-red p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[10rem] font-extrabold leading-none text-white/10" aria-hidden="true">
                WA
              </div>
              <div className="relative">
                <MessageCircle size={30} className="text-white" />
                <p className="mt-5 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Canal directo</p>
                <p className="mt-1 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                  WhatsApp
                </p>
                <p className="mt-3 text-sm text-white/85">{BUSINESS.phoneDisplay}</p>
                <a
                  href={waGeneral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-6 py-4 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-sf-red transition-colors hover:bg-transparent hover:text-white"
                >
                  Abrir WhatsApp ahora <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* Dirección + mapa */}
            <div className="panel">
              <div className="flex items-start gap-3 border-b border-white/8 p-5">
                <MapPin size={19} className="mt-0.5 shrink-0 text-sf-red" />
                <div>
                  <p className="field-label">Concesionaria</p>
                  <p className="mt-1 font-display text-xl font-bold uppercase leading-tight text-white">{BUSINESS.address}</p>
                </div>
              </div>
              <iframe
                title="Mapa de SF MOTOS en 9 de Julio 119, Juan B. Alberdi, Tucumán"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-56 w-full border-0 grayscale contrast-125 sm:h-64"
              />
              <a
                href={BUSINESS.addressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 border-t border-white/8 px-5 py-4 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors hover:text-white"
              >
                <span className="flex items-center gap-2"><Navigation size={15} className="text-sf-red" /> Abrir en Google Maps</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            {/* Datos secundarios */}
            <div className="grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2">
              <div className="flex items-start gap-3 bg-sf-surface p-5">
                <Truck size={19} className="shrink-0 text-sf-red" />
                <div>
                  <p className="field-label">Envíos</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-300">{BUSINESS.shippingLabel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-sf-surface p-5">
                <Phone size={19} className="shrink-0 text-sf-red" />
                <div>
                  <p className="field-label">Teléfono</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-300">{BUSINESS.phoneDisplay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
