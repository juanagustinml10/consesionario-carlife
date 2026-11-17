import * as React from 'react';
import { ChevronRight, BadgeCheck, Truck, Bike } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { HeroBike } from '@/components/public/HeroBike';

const PILLARS = [
  { icon: <Bike size={22} />, title: 'Multimarca', text: 'No nos casamos con una sola marca: elegimos las mejores unidades de cada casa.' },
  { icon: <BadgeCheck size={22} />, title: 'Usadas seleccionadas', text: 'Cada usada pasa por nuestras manos antes de publicarse. Nada entra sin filtro.' },
  { icon: <Truck size={22} />, title: 'Envíos a todo el país', text: 'Coordinamos la entrega de tu moto en cualquier punto del territorio argentino.' },
];

export const About: React.FC = () => (
  <div className="bg-jay-black text-jay-white">
    {/* Hero institucional */}
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="container-jay relative grid min-h-[70vh] items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Sobre nosotros</span>
          <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.88] text-white sm:text-8xl">
            JAY<br /><span className="text-jay-red">MOTOS</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
            En JAY MOTOS compartimos la misma pasión que nuestros clientes.
          </p>
          <p className="mt-3 font-display text-2xl font-extrabold italic uppercase leading-none text-white sm:text-3xl">
            FOR RIDERS,<br /><span className="text-jay-red">BY RIDERS.</span>
          </p>
        </div>
        <HeroBike className="w-full max-w-xl justify-self-center" />
      </div>
    </section>

    {/* Texto institucional oficial */}
    <section className="border-b border-white/5 bg-jay-panel">
      <div className="container-jay max-w-3xl py-14 text-center sm:py-16">
        <p className="text-xl leading-relaxed text-gray-200 sm:text-2xl">
          Somos una concesionaria <strong className="text-white">multimarca</strong> dedicada a la venta de
          motocicletas <strong className="text-white">0 km y usadas seleccionadas</strong>.
          <br /><br />
          Creemos que <strong className="text-white">cada moto representa una nueva aventura</strong>.
        </p>
      </div>
    </section>

    {/* Pilares */}
    <section className="container-jay py-14 sm:py-20">
      <span className="eyebrow">Cómo trabajamos</span>
      <h2 className="mt-2 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
        Concesionaria<br /><span className="text-jay-red">multimarca.</span>
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/5 bg-jay-surface p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jay-red/15 text-jay-red-soft">
              {p.icon}
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold uppercase text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-white/5 bg-jay-panel">
      <div className="container-jay flex flex-col items-center justify-between gap-6 py-10 text-center sm:flex-row sm:text-left">
        <p className="max-w-md font-display text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl">
          Tu próxima aventura<br /><span className="text-jay-red">comienza acá.</span>
        </p>
        <Link to="/motos" className="btn btn-red shrink-0 px-8 py-4 text-xs">
          Ver catálogo <ChevronRight size={17} />
        </Link>
      </div>
    </section>
  </div>
);
