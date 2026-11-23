import * as React from 'react';
import { useState } from 'react';
import { ArrowUpRight, CheckCircle, MapPin, Navigation, Phone, Send, Truck } from 'lucide-react';
import { PageIntro } from '@/components/public/PageIntro';
import { WhatsAppButton, WhatsAppIcon } from '@/components/shared/WhatsAppButton';
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
  `Hola! Mi nombre es ${form.nombre.trim()}.`,
  `Email: ${form.email.trim()}`,
  form.telefono.trim() ? `Teléfono: ${form.telefono.trim()}` : '',
  '',
  'Consulta:',
  form.mensaje.trim(),
].filter((line, index) => index === 0 || line !== '').join('\n');

export const Contact: React.FC = () => {
  const [form, setForm] = useState<ConsultaForm>(EMPTY_FORM);
  const [sent, setSent] = useState(false);

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
    <div className="bg-white text-cc-black">
      <PageIntro
        eyebrow="Contacto · CARLIFE"
        title={<>Hablemos<br />en la calle</>}
        description={
          <>
            <p>Escribinos, vení a la concesionaria o hablemos por WhatsApp. Estamos en {BUSINESS.address}.</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-cc-gray">
              <MapPin size={14} /> Tucumán, Argentina · {BUSINESS.shippingLabel}
            </p>
          </>
        }
      />

      <section className="section-white">
        <div className="container-cc grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <div className="mb-6">
              <span className="eyebrow eyebrow-dark">Escribinos</span>
            </div>

            <div className="panel-light relative p-6 sm:p-9">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-cc-black" aria-hidden="true" />

              {sent ? (
                <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-black/20 text-cc-black">
                    <CheckCircle size={34} strokeWidth={1.5} />
                  </div>
                  <h2 className="display-md mt-6 text-cc-black">Consulta preparada</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-cc-gray">
                    Abrimos WhatsApp con los datos que ingresaste. Revisá la ventana nueva y enviá el mensaje para que podamos responderte.
                  </p>
                  <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <WhatsAppButton
                      message={buildConsultaMessage(form)}
                      label="Abrir WhatsApp"
                      className="px-6"
                    />
                    <button
                      type="button"
                      onClick={() => { setForm(EMPTY_FORM); setSent(false); }}
                      className="btn btn-outline-dark px-6"
                    >
                      Escribir otra consulta
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
                  <div className="flex items-start gap-3 border border-cc-paper bg-cc-soft p-4">
                    <WhatsAppIcon size={18} className="mt-0.5 text-cc-gray" />
                    <p className="text-xs leading-relaxed text-black/60">
                      Este formulario prepara tu consulta en WhatsApp. No envía datos a un servidor: el mensaje se envía cuando lo confirmás en la app.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="field-label">Nombre y apellido</label>
                      <input id="nombre" required autoComplete="name" placeholder="Juan Pérez" value={form.nombre} onChange={update('nombre')} className="field field-light" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="field-label">Email</label>
                      <input id="email" required type="email" autoComplete="email" placeholder="juan@email.com" value={form.email} onChange={update('email')} className="field field-light" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefono" className="field-label">Teléfono (opcional)</label>
                    <input id="telefono" type="tel" autoComplete="tel" placeholder="381 ..." value={form.telefono} onChange={update('telefono')} className="field field-light" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mensaje" className="field-label">¿Qué vehículo buscás?</label>
                    <textarea
                      id="mensaje"
                      required
                      rows={5}
                      placeholder="Quiero información sobre un vehículo publicado..."
                      value={form.mensaje}
                      onChange={update('mensaje')}
                      className="field field-light h-auto resize-y py-4 leading-relaxed"
                    />
                  </div>
                  <button type="submit" className="btn btn-whatsapp w-full py-4">
                    <Send size={17} />
                    Preparar consulta en WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-5">
            <div className="mb-6">
              <span className="eyebrow eyebrow-dark">Encontranos</span>
            </div>

            <div className="overflow-hidden border border-white/10 bg-cc-black p-7 text-white sm:p-8">
              <div>
                <WhatsAppIcon size={30} className="text-white" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Canal directo</p>
                <p className="display-md mt-2 text-white">WhatsApp</p>
                <p className="data-num mt-3 text-lg text-white/80">{BUSINESS.phoneDisplay}</p>
                <WhatsAppButton label="Abrir WhatsApp ahora" className="mt-6 w-full" />
              </div>
            </div>

            <div className="panel-light">
              <div className="flex items-start gap-3 border-b border-cc-paper p-5">
                <MapPin size={19} className="mt-0.5 shrink-0 text-cc-gray" />
                <div>
                  <p className="field-label">Concesionaria</p>
                  <p className="mt-1 font-display text-base font-bold uppercase leading-tight tracking-tight text-cc-black">{BUSINESS.address}</p>
                </div>
              </div>
              <iframe
                title={`Mapa de ${BUSINESS.name} — ${BUSINESS.address}`}
                src={BUSINESS.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="photo-soft h-56 w-full border-0 sm:h-64"
              />
              <a
                href={BUSINESS.addressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 border-t border-cc-paper px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black/65 transition-colors hover:text-black"
              >
                <span className="flex items-center gap-2"><Navigation size={15} /> Abrir en Google Maps</span>
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="grid gap-px border border-cc-paper bg-cc-paper sm:grid-cols-2">
              <div className="flex items-start gap-3 bg-white p-5">
                <Truck size={19} className="shrink-0 text-cc-gray" />
                <div>
                  <p className="field-label">Envíos</p>
                  <p className="mt-1 text-xs leading-relaxed text-black/60">{BUSINESS.shippingLabel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-5">
                <Phone size={19} className="shrink-0 text-cc-gray" />
                <div>
                  <p className="field-label">Teléfono</p>
                  <p className="data-num mt-1 text-xs text-black/60">{BUSINESS.phoneDisplay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
