import * as React from 'react';
import { MessageCircle, Truck, MapPin, ChevronRight, Wallet, FileCheck, HandCoins } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';

const WHATSAPP_CONSULTA = buildWhatsAppLink(
  'Hola! Quisiera consultar por las opciones de financiación disponibles en SF MOTOS.'
);

const STEPS = [
  {
    icon: <Wallet size={22} />,
    n: '01',
    title: 'Elegí tu moto',
    text: 'Navegá el catálogo completo y quedate con la unidad que más te interese: 0 km o usada.',
  },
  {
    icon: <FileCheck size={22} />,
    n: '02',
    title: 'Consultanos',
    text: 'Escribinos por WhatsApp con el modelo elegido y te informamos las opciones disponibles para tu caso.',
  },
  {
    icon: <HandCoins size={22} />,
    n: '03',
    title: 'Coordinamos la entrega',
    text: 'Definidos los detalles, coordinamos la retirada en la concesionaria o la entrega.',
  },
];

export const Financiacion: React.FC = () => (
  <div className="bg-sf-black text-sf-white">
    {/* 01 / Encabezado */}
    <PageIntro
      index="01"
      eyebrow="SF MOTOS · Comercial"
      title={<span className="whitespace-nowrap">FINAN<span className="text-sf-red">CIA</span>CIÓN</span>}
      outline="FIN"
      align="center"
      size="large"
      description={
        <>
          <p>
            Consultanos por las opciones de financiación para la moto que te interesa. Cada operación se analiza
            por separado y las condiciones se confirman directamente con nosotros.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            No publicamos tasas, cuotas ni planes: la disponibilidad y las condiciones se informan al consultar.
          </p>
        </>
      }
      actions={
        <a href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer" className="btn btn-red px-8 py-4 text-sm">
          <MessageCircle size={18} /> Consultar por WhatsApp
        </a>
      }
    />

    {/* 02 / Cómo funciona */}
    <section className="container-sf py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-5 border-t border-sf-red/60 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-display text-xs font-extrabold tracking-[0.2em] text-sf-red">02</span>
          <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.88] text-white sm:text-7xl">
            Elegí, consultá<br /><span className="text-sf-red">y coordiná</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-gray-400">Tres pasos, sin letra chica: cada consulta se responde de forma personalizada.</p>
      </div>

      <div className="grid gap-px border border-white/8 bg-white/8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="group relative bg-sf-surface p-7">
            <span className="pointer-events-none absolute right-5 top-3 font-display text-6xl font-extrabold text-white/[0.04]">{step.n}</span>
            <div className="flex h-12 w-12 items-center justify-center border border-sf-red/40 text-sf-red-soft">
              {step.icon}
            </div>
            <p className="mt-6 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-sf-red">Paso {step.n}</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold uppercase text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.text}</p>
            <span className="mt-6 block h-[2px] w-8 bg-sf-red transition-all duration-300 group-hover:w-full" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>

    {/* 03 / Aviso honesto sobre condiciones */}
    <section className="bg-white text-sf-black">
      <div className="container-sf grid gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <span className="section-index">Aclaración</span>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] sm:text-7xl">
            Las condiciones<br /><span className="text-sf-red">se consultan</span>
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="text-xl leading-relaxed text-black/70">
            En SF MOTOS no publicamos tasas, cuotas ni planes predefinidos. La disponibilidad y las condiciones
            de cada operación se informan al consultar, porque dependen de la unidad y de cada caso.
          </p>
          <a
            href={WHATSAPP_CONSULTA}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 border-b border-sf-red pb-1 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-sf-red transition-colors hover:text-sf-black"
          >
            Abrir consulta por WhatsApp <ChevronRight size={15} />
          </a>
        </div>
      </div>
    </section>

    {/* 04 / Envíos y ubicación */}
    <section className="diagonal-lines border-y border-white/5 bg-sf-black">
      <div className="container-sf flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-sf-red/40 text-sf-red-soft sm:h-20 sm:w-20">
            <Truck size={32} />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold uppercase leading-none text-white sm:text-4xl">{BUSINESS.shippingLabel}</p>
            <p className="mt-2 text-xs text-gray-400">{BUSINESS.address} · coordinamos tu entrega</p>
          </div>
        </div>
        <span className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-gray-500">
          <MapPin size={16} className="text-sf-red" /> Tucumán, Argentina
        </span>
      </div>
    </section>

    {/* 05 / Cierre */}
    <section className="bg-sf-panel">
      <div className="container-sf flex flex-col items-start justify-between gap-8 py-16 sm:py-20 lg:flex-row lg:items-center">
        <div>
          <span className="section-index">Hablemos</span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.88] text-white sm:text-6xl">
            La financiación se consulta <span className="text-sf-red">con nosotros</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-gray-400">
            Ubicación: {BUSINESS.address}. Escribinos y te contamos qué opciones están disponibles.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <a href={WHATSAPP_CONSULTA} target="_blank" rel="noopener noreferrer" className="btn btn-red px-8 py-4 text-xs">
            <MessageCircle size={17} /> Hablar con SF MOTOS
          </a>
          <Link to="/motos" className="btn btn-ghost px-8 py-4 text-xs">Ver catálogo</Link>
        </div>
      </div>
    </section>
  </div>
);
