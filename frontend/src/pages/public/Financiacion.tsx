import * as React from 'react';
import { Phone, Truck, MapPin, ChevronRight, BadgeCheck, MessageCircle, Wallet, FileCheck, HandCoins } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';

export const Financiacion: React.FC = () => {
  const consultar = () =>
    window.open(
      buildWhatsAppLink('Hola! Quisiera consultar por las opciones de financiación disponibles en JAY MOTOS.'),
      '_blank'
    );

  return (
    <div className="bg-jay-black text-jay-white">
      {/* Encabezado */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 bg-[radial-gradient(ellipse_60%_60%_at_70%_40%,rgba(227,38,54,0.22),transparent)]" aria-hidden="true" />
        <div className="container-jay relative py-16 text-center sm:py-24">
          <span className="eyebrow">JAY MOTOS · Comercial</span>
          <h1 className="mt-4 font-display text-7xl font-extrabold uppercase leading-[0.85] text-white sm:text-8xl lg:text-9xl">
            FINAN<span className="text-jay-red">CIA</span><br />CIÓN
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            Llevate tu moto hoy y consultá con nosotros las opciones de financiación disponibles.
            Cada operación se arma a medida de cada cliente.
          </p>
          <button onClick={consultar} className="btn btn-red mx-auto mt-8 px-8 py-4 text-sm">
            <Phone size={18} />
            Consultar por WhatsApp
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container-jay py-14 sm:py-20">
        <span className="eyebrow">Cómo funciona</span>
        <h2 className="mt-2 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
          Sin vueltas,<br /><span className="text-jay-red">sin letra chica.</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: <Wallet size={22} />,
              n: '01',
              title: 'Elegí tu moto',
              text: 'Navegá el catálogo completo y quedate con la que más te guste: 0 km o usada seleccionada.',
            },
            {
              icon: <FileCheck size={22} />,
              n: '02',
              title: 'Consultanos',
              text: 'Escribinos por WhatsApp con el modelo elegido y te contamos las opciones disponibles para tu caso.',
            },
            {
              icon: <HandCoins size={22} />,
              n: '03',
              title: 'Coordinamos la entrega',
              text: 'Definidos los detalles, coordinamos retirarla en concesionaria o el envío a todo el país.',
            },
          ].map((step) => (
            <div key={step.n} className="relative overflow-hidden rounded-2xl border border-white/5 bg-jay-surface p-6">
              <span className="pointer-events-none absolute right-4 top-2 select-none font-display text-6xl font-extrabold italic text-white/5">{step.n}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jay-red/15 text-jay-red-soft">
                {step.icon}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Franja envíos */}
      <section className="border-y border-white/5 bg-black">
        <div className="container-jay flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <Truck size={28} className="text-jay-red" />
            <div>
              <p className="font-display text-2xl font-extrabold uppercase text-white">Envíos a todo el país</p>
              <p className="text-xs text-gray-500">Corrientes 1440, Tucumán · coordinamos tu entrega</p>
            </div>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            <BadgeCheck size={16} className="text-jay-red" />
            Cobertura nacional
          </span>
        </div>
      </section>

      {/* CTA final */}
      <section className="container-jay py-14 text-center sm:py-20">
        <MapPin size={22} className="mx-auto text-jay-red" />
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
          La financiación<br />se arma <span className="text-jay-red">con vos.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
          Las condiciones se definen en cada operación. Escribinos y armamos la opción que mejor se adapte.
        </p>
        <button onClick={consultar} className="btn btn-red mx-auto mt-8 px-8 py-4 text-sm">
          <MessageCircle size={18} />
          Hablar con JAY MOTOS
        </button>
        <p className="mt-6 text-xs text-gray-600">
          Ubicación: {BUSINESS.address} · Te esperamos o enviamos tu moto.
        </p>
        <Link to="/motos" className="mt-8 inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-white">
          Ver catálogo <ChevronRight size={14} />
        </Link>
      </section>
    </div>
  );
};
