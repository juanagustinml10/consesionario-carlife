import * as React from 'react';
import { ArrowRight, BadgeCheck, Truck, Bike, MapPin } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { HeroBike } from '@/components/public/HeroBike';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';
import ktmPhoto from '@/assets/ktm-enduro-promo.jpg';

const PILLARS = [
  { icon: <Bike size={24} />, title: 'Multimarca', text: 'No nos casamos con una sola marca: elegimos las mejores unidades de cada casa.', n: '01' },
  { icon: <BadgeCheck size={24} />, title: 'Usadas seleccionadas', text: 'Cada usada pasa por nuestras manos antes de publicarse. Nada entra sin filtro.', n: '02' },
  { icon: <Truck size={24} />, title: 'Envíos a todo el país', text: 'Coordinamos la entrega de tu moto en cualquier punto del territorio argentino.', n: '03' },
];

export const About: React.FC = () => (
  <div className="bg-jay-black text-jay-white">
    {/* 01 / Hero institucional */}
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="radial-glow pointer-events-none absolute -right-40 -top-52 h-[36rem] w-[36rem] opacity-60" aria-hidden="true" />
      <span className="pointer-events-none absolute -left-8 bottom-[-0.2em] select-none font-display text-[13rem] font-extrabold italic leading-none text-outline sm:text-[20rem]" aria-hidden="true">JAY</span>
      <div className="container-jay relative grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">01</span>
            <span className="h-px w-10 bg-jay-red" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400">Sobre nosotros</span>
          </div>
          <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.82] text-white sm:text-8xl lg:text-9xl">
            JAY<br /><span className="text-jay-red">MOTOS</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-gray-300">
            En JAY MOTOS compartimos la misma pasión que vos por las motos.
          </p>
          <div className="mt-8 border-l-2 border-jay-red pl-5">
            <p className="font-display text-3xl font-extrabold italic uppercase leading-[0.9] text-white sm:text-4xl">
              FOR RIDERS,<br /><span className="text-jay-red">BY RIDERS.</span>
            </p>
          </div>
          <a
            href={buildWhatsAppLink(BUSINESS.whatsappGeneralMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-red mt-8 px-7 py-4 text-xs"
          >
            Hablemos por WhatsApp <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative lg:col-span-6">
          <div className="border border-white/10 bg-jay-surface/40 p-4 sm:p-6">
            <div className="border border-jay-red/30">
              <HeroBike className="w-full" />
            </div>
          </div>
          <div className="absolute -bottom-3 left-4 flex items-center gap-3 bg-jay-red px-4 py-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white sm:left-8">
            Enduro / Off-road <span className="h-1 w-1 bg-white" /> Multimarca
          </div>
        </div>
      </div>
    </section>

    {/* 02 / Texto institucional oficial */}
    <section className="bg-white text-jay-black">
      <div className="container-jay grid gap-8 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="section-index">Nuestra mirada</span>
          <p className="mt-5 font-display text-5xl font-extrabold italic uppercase leading-[0.85] text-jay-red sm:text-6xl">Más que motos</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="text-2xl leading-relaxed text-black/75 sm:text-3xl">
            Somos una concesionaria <strong className="text-jay-black">multimarca</strong> dedicada a la venta de
            motocicletas <strong className="text-jay-black">0 km y usadas seleccionadas</strong>.
          </p>
          <p className="mt-6 text-2xl leading-relaxed text-black/75 sm:text-3xl">
            Creemos que <strong className="text-jay-red">cada moto representa una nueva aventura</strong>.
          </p>
          <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6">
            <MapPin size={20} className="shrink-0 text-jay-red" />
            <span className="font-display text-lg font-bold uppercase tracking-[0.15em]">{BUSINESS.address}</span>
          </div>
        </div>
      </div>
    </section>

    {/* 03 / Pilares */}
    <section className="container-jay py-16 sm:py-24">
      <div className="mb-10 flex flex-col gap-5 border-t border-jay-red/60 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">02</span>
          <h2 className="mt-3 font-display text-5xl font-extrabold uppercase italic leading-[0.88] text-white sm:text-7xl">
            Cómo <span className="text-jay-red">trabajamos</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-gray-400">La especialidad no es un eslogan: está en cada elección del catálogo.</p>
      </div>
      <div className="grid gap-px border border-white/8 bg-white/8 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="group relative bg-jay-surface p-7 transition-colors hover:bg-jay-elevated">
            <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-extrabold italic text-white/5">{p.n}</span>
            <div className="flex h-12 w-12 items-center justify-center border border-jay-red/40 text-jay-red-soft">
              {p.icon}
            </div>
            <h3 className="mt-6 font-display text-2xl font-extrabold uppercase text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.text}</p>
            <span className="mt-6 block h-[2px] w-8 bg-jay-red transition-all duration-300 group-hover:w-full" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>

    {/* 04 / Fotografía protagonista */}
    <section className="relative overflow-hidden border-y border-white/5">
      <img src={ktmPhoto} alt="Moto de enduro en un camino de montaña" loading="lazy" className="h-full min-h-[320px] w-full object-cover object-[70%_20%] sm:min-h-[480px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-jay-black via-jay-black/60 to-transparent" aria-hidden="true" />
      <div className="container-jay relative flex min-h-[320px] flex-col justify-center py-14 sm:min-h-[480px]">
        <span className="pointer-events-none absolute -left-4 top-4 select-none font-display text-8xl font-extrabold italic leading-none text-outline sm:text-[12rem]" aria-hidden="true">RIDE</span>
        <div className="relative max-w-lg">
          <span className="section-index">Especialidad</span>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] text-white sm:text-7xl">
            Enduro<br /><span className="text-jay-red">& off-road</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-200">
            Concesionaria multimarca con especial identidad en las motos enduro y off-road: las motos que amamos, las que conocemos y las que recomendamos.
          </p>
        </div>
      </div>
    </section>

    {/* 05 / Cierre */}
    <section className="bg-jay-panel">
      <div className="container-jay flex flex-col items-start justify-between gap-8 py-14 sm:py-20 lg:flex-row lg:items-center">
        <div>
          <span className="section-index">Tu próxima aventura</span>
          <p className="mt-4 font-display text-4xl font-extrabold uppercase italic leading-[0.88] text-white sm:text-6xl">
            Empieza <span className="text-jay-red">acá</span>
          </p>
          <p className="mt-3 max-w-md text-sm text-gray-400">{BUSINESS.specialty} · {BUSINESS.shippingLabel}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <Link to="/motos" className="btn btn-red px-8 py-4 text-xs">Ver catálogo <ArrowRight size={16} /></Link>
          <Link to="/contacto" className="btn btn-ghost px-8 py-4 text-xs">Contactanos</Link>
        </div>
      </div>
    </section>
  </div>
);
