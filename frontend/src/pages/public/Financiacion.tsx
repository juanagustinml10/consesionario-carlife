import * as React from 'react';
import { Check, FileText, Truck, Wallet } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { Reveal } from '@/components/shared/Reveal';
import { BUSINESS } from '@/lib/constants';

const WHATSAPP_MESSAGE = BUSINESS.financingMessage;

const STEPS = [
  {
    icon: <Wallet size={22} strokeWidth={1.5} />,
    n: '01',
    title: 'Elegí el vehículo',
    text: 'Recorré el catálogo y quedate con el auto usado que mejor se ajuste a lo que buscás.',
  },
  {
    icon: <FileText size={22} strokeWidth={1.5} />,
    n: '02',
    title: 'Consultanos',
    text: 'Escribinos por WhatsApp con el vehículo elegido y te informamos las opciones disponibles para tu caso.',
  },
  {
    icon: <Check size={22} strokeWidth={1.5} />,
    n: '03',
    title: 'Coordinamos la entrega',
    text: 'Definidos los detalles, coordinamos la retirada en la concesionaria o la forma de entrega.',
  },
];

export const Financiacion: React.FC = () => (
  <div className="bg-white text-cc-black">
    <PageIntro
      eyebrow="CARLIFE · Créditos prendarios"
      title={<>Créditos<br />prendarios</>}
      description={
        <>
          <p>{BUSINESS.financingMessage}</p>
          <p className="mt-3 text-xs text-cc-gray">
            No publicamos tasas, cuotas ni planes predefinidos: la disponibilidad y las condiciones se informan al consultar.
          </p>
        </>
      }
      actions={
        <WhatsAppButton size="lg" message={WHATSAPP_MESSAGE} label="Consultar por WhatsApp" className="px-8" />
      }
    />

    <section className="section-white">
      <div className="container-cc py-20 sm:py-28">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 border-t border-black/15 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow eyebrow-dark">Cómo funciona</span>
              <h2 className="display-lg mt-5 text-cc-black">Elegí, consultá y coordiná</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cc-gray">
              Tres pasos, sin letra chica: cada consulta se responde de forma personalizada.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px border border-cc-paper bg-cc-paper md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.n} delay={index * 90}>
              <article className="group relative h-full bg-white p-7 transition-colors hover:bg-cc-soft">
                <span className="data-num pointer-events-none absolute right-5 top-4 text-6xl text-black/[0.05]">{step.n}</span>
                <div className="flex h-12 w-12 items-center justify-center border border-black/25 text-cc-black">
                  {step.icon}
                </div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.28em] text-cc-gray">Paso {step.n}</p>
                <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-cc-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/55">{step.text}</p>
                <span className="mt-7 block h-px w-8 bg-cc-red transition-all duration-500 group-hover:w-full" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section-light">
      <div className="container-cc grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow eyebrow-dark">Aclaración</span>
          <h2 className="display-lg mt-5 text-cc-black">Las opciones se consultan</h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
          <p className="font-display text-2xl leading-snug text-black/75 sm:text-3xl">
            En CARLIFE no publicamos tasas, cuotas ni planes predefinidos. La disponibilidad de los créditos
            prendarios se informa al consultar, porque depende del vehículo y de cada caso.
          </p>
          <WhatsAppButton
            message={WHATSAPP_MESSAGE}
            label="Abrir consulta por WhatsApp"
            className="mt-8 px-7"
          />
        </Reveal>
      </div>
    </section>

    <section className="section-carbon relative overflow-hidden border-y border-white/10">
      <img
        src="/images/service-envios.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="photo absolute inset-0 h-full w-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cc-carbon via-cc-carbon/90 to-cc-carbon/50" aria-hidden="true" />
      <div className="container-cc relative flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/25 text-white sm:h-20 sm:w-20">
            <Truck size={32} strokeWidth={1.4} />
          </div>
          <div>
            <p className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-white sm:text-4xl">
              {BUSINESS.shippingLabel}
            </p>
            <p className="mt-2 text-xs text-white/50">{BUSINESS.address} · coordinamos tu entrega</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Yerba Buena, Tucumán</span>
      </div>
    </section>

    <section className="section-white">
      <div className="container-cc flex flex-col items-start justify-between gap-8 py-16 sm:py-24 lg:flex-row lg:items-center">
        <div>
          <span className="eyebrow eyebrow-dark">Hablemos</span>
          <h2 className="display-lg mt-5 max-w-2xl text-cc-black">Los créditos prendarios se consultan con nosotros</h2>
          <p className="mt-5 max-w-md text-sm text-cc-gray">
            Ubicación: {BUSINESS.address}. Escribinos y te contamos qué opciones están disponibles.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <WhatsAppButton size="lg" message={WHATSAPP_MESSAGE} label="Hablar con CARLIFE" className="px-8" />
          <Link to="/motos" className="btn btn-outline-dark btn-lg px-8">Ver catálogo</Link>
        </div>
      </div>
    </section>
  </div>
);
