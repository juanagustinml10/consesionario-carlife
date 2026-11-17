import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Flame,
  ShieldCheck,
  Truck,
  Phone,
  CircleGauge,
  BadgeCheck,
  Timer,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { HeroBike } from '@/components/public/HeroBike';
import { BikeCard } from '@/components/public/BikeCard';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';

const BRANDS = [
  'YAMAHA', 'HONDA', 'KAWASAKI', 'SUZUKI', 'BMW', 'KTM', 'DUCATI', 'TRIUMPH', 'APRILIA', 'HARLEY-DAVIDSON', 'ROYAL ENFIELD', 'ZONTES',
];

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Bike[]>([]);
  const [latest, setLatest] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      bikesService.list({ featured: true, limit: 3 }),
      bikesService.list({ limit: 6 }),
    ]).then(([featuredRes, latestRes]) => {
      if (cancelled) return;
      if (featuredRes.status === 'fulfilled') setFeatured(featuredRes.value.data);
      if (latestRes.status === 'fulfilled') setLatest(latestRes.value.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-jay-black text-jay-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 diagonal-lines" aria-hidden="true" />
        <div className="absolute -right-40 top-0 h-full w-3/4 bg-[radial-gradient(ellipse_70%_80%_at_70%_50%,rgba(227,38,54,0.28),transparent_70%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-jay-black via-jay-black/70 to-transparent" aria-hidden="true" />
        {/* Marca de agua */}
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-0 select-none font-display text-[22vw] font-extrabold italic leading-none text-white/[0.025] sm:text-[16vw] lg:text-[13rem]">
          MOTOS
        </span>

        <div className="container-jay relative">
          <div className="grid min-h-[92svh] grid-cols-1 items-center gap-8 pb-16 pt-8 md:min-h-[88svh] lg:grid-cols-12 lg:gap-6 lg:pb-10 lg:pt-6">
            {/* Texto */}
            <div className="relative z-10 lg:col-span-6 xl:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-10 bg-jay-red" />
                <span className="eyebrow">Concesionaria oficial</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-4 font-display text-[3.4rem] font-extrabold italic uppercase leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-[6.2rem] xl:text-[7rem]"
              >
                El rugido
                <br />
                <span className="text-jay-red">perfecto</span>
                <br />
                <span className="text-white/90">te espera</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="mt-5 max-w-md text-base leading-relaxed text-gray-300 sm:text-lg"
              >
                Motos 0 km y usadas, revisión técnica certificada y la atención que tu pasión merece.
                Probá, consultá y llevate tu moto con JAY MOTOS.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Link to="/motos" className="btn btn-red px-7 py-4 text-sm">
                  Explorar catálogo
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost px-7 py-4 text-sm"
                >
                  <Phone size={17} />
                  WhatsApp directo
                </a>
              </motion.div>

              {/* Indicadores */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                {[
                  { value: '200+', label: 'motos entregadas' },
                  { value: '10+', label: 'años de trayectoria' },
                  { value: '12+', label: 'marcas oficiales' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-extrabold italic text-white sm:text-4xl">
                      {stat.value}
                    </span>
                    <span className="max-w-[7.5rem] text-[10px] font-semibold uppercase leading-tight tracking-wider text-gray-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Arte */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center lg:col-span-6"
            >
              <HeroBike className={`w-full max-w-2xl ${reduceMotion ? '' : 'animate-[float_5s_ease-in-out_infinite]'}`} />
              {/* Chips flotantes */}
              <div className="absolute left-0 top-8 hidden rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur md:block">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-jay-red-soft"><Timer size={13} /> Entrega inmediata</p>
                <p className="mt-1 text-xs text-gray-400">0 km con stock real</p>
              </div>
              <div className="absolute bottom-16 right-0 hidden rounded-xl border border-white/10 bg-black/70 px-4 py-3 backdrop-blur md:block">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-jay-red-soft"><ShieldCheck size={13} /> Garantía oficial</p>
                <p className="mt-1 text-xs text-gray-400">Revisión técnica certificada</p>
              </div>
              <p className="absolute bottom-0 right-1 text-[9px] uppercase tracking-[0.25em] text-gray-600">
                Imagen ilustrativa
              </p>
            </motion.div>
          </div>
        </div>

        {/* Franja resumen inferior */}
        <div className="relative border-t border-white/5 bg-black/60 backdrop-blur">
          <div className="container-jay flex h-12 items-center justify-between overflow-hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            <span className="flex items-center gap-2"><CircleGauge size={14} className="text-jay-red" /> Prueba de manejo</span>
            <span className="hidden items-center gap-2 sm:flex"><BadgeCheck size={14} className="text-jay-red" /> Publicaciones verificadas</span>
            <span className="hidden items-center gap-2 md:flex"><ShieldCheck size={14} className="text-jay-red" /> Compra con respaldo</span>
            <span className="flex items-center gap-2"><Flame size={14} className="text-jay-red" /> Stock real</span>
          </div>
        </div>
      </section>

      {/* ============ MARCAS (marquee) ============ */}
      <section className="border-b border-white/5 bg-white py-4" aria-hidden="true">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className="font-display text-lg font-extrabold italic uppercase tracking-[0.18em] text-black/75 sm:text-xl">
                {brand} <span className="ml-12 text-jay-red">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 0 KM / USADAS ============ */}
      <section className="bg-jay-black">
        <div className="container-jay grid gap-4 py-10 sm:grid-cols-2 sm:py-14">
          <Link
            to="/motos?condition=NUEVA"
            className="group relative overflow-hidden rounded-2xl border border-jay-red/25 bg-gradient-to-br from-jay-red/15 via-jay-surface to-jay-surface p-6 transition-all hover:border-jay-red/60 sm:p-8"
          >
            <span className="eyebrow">Entrega inmediata</span>
            <h2 className="mt-3 font-display text-6xl font-extrabold italic leading-none text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-7xl">
              0<br />KM
            </h2>
            <p className="mt-4 max-w-[16rem] text-sm text-gray-400">Las últimas unidades de las marcas líderes, con garantía oficial.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-jay-red-soft">
              Ver 0 km <ArrowRight size={15} />
            </span>
            <span className="pointer-events-none absolute -right-6 bottom-2 font-display text-[7rem] font-extrabold italic leading-none text-white/[0.03] sm:text-[9rem]">0</span>
          </Link>

          <Link
            to="/motos?condition=USADA"
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.06] via-jay-surface to-jay-surface p-6 transition-all hover:border-white/20 sm:p-8"
          >
            <span className="eyebrow !text-gray-400">Revisadas y certificadas</span>
            <h2 className="mt-3 font-display text-6xl font-extrabold italic leading-none text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-7xl">
              USA<span className="text-jay-red">DAS</span>
            </h2>
            <p className="mt-4 max-w-[16rem] text-sm text-gray-400">Selección propia revisada por mecánicos certificados. Fotos reales del ejemplar.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors group-hover:text-white">
              Ver usadas <ArrowRight size={15} />
            </span>
            <span className="pointer-events-none absolute -right-6 bottom-2 font-display text-[7rem] font-extrabold italic leading-none text-white/[0.03] sm:text-[9rem]">U</span>
          </Link>
        </div>
      </section>

      {/* ============ DESTACADAS ============ */}
      <section className="border-t border-white/5 bg-jay-panel">
        <div className="container-jay py-14 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <span className="eyebrow">Elegidas por nosotros</span>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
                Destacadas<span className="text-jay-red">.</span>
              </h2>
            </div>
            <Link to="/motos?featured=true" className="hidden items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white sm:inline-flex">
              Ver todas <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-jay-surface" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
              Aún no hay motos destacadas. Volvé pronto.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ ÚLTIMOS INGRESOS ============ */}
      <section className="border-t border-white/5 bg-jay-black">
        <div className="container-jay py-14 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Recién publicadas</span>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase italic leading-[0.9] text-white sm:text-6xl">
                Últimos ingresos<span className="text-jay-red">.</span>
              </h2>
            </div>
            <Link to="/motos" className="hidden items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white sm:inline-flex">
              Ver catálogo <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-jay-surface" />
              ))}
            </div>
          ) : latest.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
              Todavía no hay motos publicadas. Volvé pronto.
            </div>
          ) : (
            <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {latest.slice(0, 4).map((bike) => (
                <div key={bike.id} className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-80 lg:w-auto lg:max-w-none">
                  <BikeCard bike={bike} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ POR QUÉ JAY MOTOS ============ */}
      <section className="border-t border-white/5 bg-jay-panel">
        <div className="container-jay py-14 sm:py-20">
          <span className="eyebrow">Por qué elegirnos</span>
          <h2 className="mt-2 max-w-3xl font-display text-4xl font-extrabold uppercase italic leading-[0.95] text-white sm:text-6xl">
            Comprar tu moto<br />
            <span className="text-jay-red">sin sorpresas.</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Truck size={22} />, title: 'Entrega inmediata', text: 'Stock real de unidades 0 km y usadas, listas para salir del concesionario.' },
              { icon: <ShieldCheck size={22} />, title: 'Revisión certificada', text: 'Cada usada pasa por una revisión de 120 puntos antes de publicarse.' },
              { icon: <CircleGauge size={22} />, title: 'Precios transparentes', text: 'El precio publicado es el precio de lista. Sin costos ocultos.' },
              { icon: <BadgeCheck size={22} />, title: 'Respaldo oficial', text: 'Marcas oficiales, garantía y repuestos con el respaldar de JAY MOTOS.' },
            ].map((r) => (
              <div key={r.title} className="rounded-2xl border border-white/5 bg-jay-surface p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jay-red/15 text-jay-red-soft">
                  {r.icon}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-white">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative overflow-hidden border-t border-white/5 bg-jay-red">
        <div className="absolute inset-0 diagonal-lines opacity-60" aria-hidden="true" />
        <div className="container-jay relative py-14 text-center sm:py-20">
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/80">Comparador inteligente</span>
          <h2 className="mx-auto mt-3 max-w-4xl font-display text-5xl font-extrabold italic uppercase leading-[0.88] text-white sm:text-7xl">
            Compará, elegí<br />y llevate tu moto
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85">
            Seleccioná hasta dos motos, compará sus especificaciones lado a lado y consultanos directo por WhatsApp.
          </p>
          <Link to="/comparador" className="btn mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-white transition-transform hover:scale-105">
            Abrir comparador <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
