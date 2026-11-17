import * as React from 'react';
import { ShieldCheck, Truck, Flame, ChevronRight } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { HeroBike } from '@/components/public/HeroBike';

const VALUES = [
  { icon: <ShieldCheck size={22} />, title: 'Transparencia total', text: 'Precio publicado es precio de lista. Sin costos ocultos ni sorpresas en la entrega.' },
  { icon: <Flame size={22} />, title: 'Pasión genuina', text: 'Vivimos sobre dos ruedas: te asesoramos según tu uso real, tu estatura y tu presupuesto.' },
  { icon: <Truck size={22} />, title: 'Entrega inmediata', text: 'Motos 0 km con stock real y usadas con revisión técnica certificada.' },
];

const STATS = [
  { value: '10+', label: 'años en el mercado' },
  { value: '200+', label: 'motos entregadas' },
  { value: '12+', label: 'marcas oficiales' },
];

export const About: React.FC = () => (
  <div className="bg-jay-black text-jay-white">
    {/* Hero */}
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(227,38,54,0.22),transparent)]" aria-hidden="true" />
      <div className="container-jay relative grid min-h-[70vh] items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Nosotros</span>
          <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.88] text-white sm:text-8xl">
            JAY<br /><span className="text-jay-red">MOTOS</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
            Somos la concesionaria donde pasión y confianza van de la mano. Desde hace más de una década,
            ayudamos a miles de personas a encontrar la moto perfecta: 0 km o usada, pero siempre con
            respaldo, revisión técnica y precio honesto.
          </p>
          <Link to="/motos" className="btn btn-red mt-8 px-7 py-4 text-xs">
            Explorar catálogo <ChevronRight size={16} />
          </Link>
        </div>
        <HeroBike className="w-full max-w-xl justify-self-center" />
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-white/5 bg-black">
      <div className="container-jay grid grid-cols-3 divide-x divide-white/5 py-10 text-center">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-4">
            <p className="font-display text-4xl font-extrabold italic text-white sm:text-6xl">{stat.value}</p>
            <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.18em] text-gray-500 sm:text-[11px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Valores */}
    <section className="container-jay py-14 sm:py-20">
      <span className="eyebrow">Lo que nos define</span>
      <h2 className="mt-2 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
        Más que una<br /><span className="text-jay-red">concesionaria.</span>
      </h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl border border-white/5 bg-jay-surface p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jay-red/15 text-jay-red-soft">
              {v.icon}
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold uppercase text-white">{v.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);
