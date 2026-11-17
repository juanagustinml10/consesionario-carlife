import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Truck,
  Phone,
  BadgeCheck,
  MapPin,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BikeCard } from '@/components/public/BikeCard';
import { bikesService } from '@/services/bikes';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';
import betaPhoto from '@/assets/beta-300rr-freenduro.jpg';
import ktmPhoto from '@/assets/ktm-enduro-promo.jpg';
import type { Bike } from '@/types';

const BRANDS = [
  'KTM', 'HUSQVARNA', 'GASGAS', 'BETA', 'SHERCO', 'HONDA', 'YAMAHA', 'KAWASAKI', 'SUZUKI',
];

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Bike[]>([]);
  const [latest, setLatest] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

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

  const waGeneral = buildWhatsAppLink(BUSINESS.whatsappGeneralMessage);

  return (
    <div className="bg-jay-black text-jay-white">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[88svh] flex-col overflow-hidden border-b border-white/5 lg:min-h-[calc(100svh-6rem)]">
        {/* Fotografía real enduro (CC BY 4.0 — Jix31 · FREENDURO 2024) */}
        <img
          src={betaPhoto}
          alt="Beta RR enduro sobre colina con camino off-road — imagen ilustrativa del mundo enduro"
          className="absolute inset-0 h-full w-full object-cover object-[78%_38%] sm:object-[74%_30%] lg:object-[68%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jay-black via-jay-black/80 to-jay-black/5" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-jay-black via-jay-black/25 to-jay-black/40" aria-hidden="true" />

        <div className="container-jay relative flex flex-1 items-center py-14">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="font-display text-5xl font-extrabold italic uppercase leading-[0.9] text-white sm:text-7xl lg:text-[5.5rem] xl:text-[6rem]"
              >
                Tu próxima<br />
                <span className="text-jay-red">aventura</span><br />
                empieza acá
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28 }}
                className="mt-5 font-display text-base font-bold uppercase tracking-[0.35em] text-white/75 sm:text-lg"
              >
                {BUSINESS.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.36 }}
                className="mt-2 text-base text-gray-300"
              >
                Motos 0 km y usadas seleccionadas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.48 }}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/motos" className="btn btn-red px-8 py-4 text-sm">
                  Ver motos
                  <ArrowRight size={18} />
                </Link>
                <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-8 py-4 text-sm">
                  <Phone size={17} />
                  Contactar por WhatsApp
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-jay-red/40 bg-black/60 px-4 py-2 backdrop-blur"
              >
                <Truck size={15} className="text-jay-red-soft" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-100">
                  Envíos a todo el país
                </span>
              </motion.div>

            </div>
          </div>

          {/* Marcas referentes del off-road — franja blanca a todo ancho, visible dentro del hero */}
          <div className="relative z-10 border-t border-white/10 bg-white py-3">
            <div className="overflow-hidden" aria-hidden="true">
              <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
                {[...BRANDS, ...BRANDS].map((brand, i) => (
                  <span key={i} className="font-display text-lg font-extrabold italic uppercase tracking-[0.18em] text-black/75 sm:text-xl">
                    {brand} <span className="ml-12 text-jay-red">/</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
      </section>

      {/* ============ 0 KM / USADAS (Catálogo) ============ */}
      <section className="bg-jay-black">
        <div className="container-jay grid gap-4 py-10 sm:grid-cols-2 sm:py-14">
          <Link
            to="/motos?condition=NUEVA"
            className="group relative overflow-hidden rounded-2xl border border-jay-red/25 bg-gradient-to-br from-jay-red/15 via-jay-surface to-jay-surface p-6 transition-all hover:border-jay-red/60 sm:p-8"
          >
            <span className="eyebrow">Catálogo 0 km</span>
            <h2 className="mt-3 font-display text-6xl font-extrabold italic leading-none text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-7xl">
              0<br />KM
            </h2>
            <p className="mt-4 max-w-[16rem] text-sm text-gray-400">Últimas unidades 0 km seleccionadas por nosotros.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-jay-red-soft">
              Ver 0 km <ArrowRight size={15} />
            </span>
            <span className="pointer-events-none absolute -right-6 bottom-2 select-none font-display text-[7rem] font-extrabold italic leading-none text-white/[0.03] sm:text-[9rem]">0</span>
          </Link>

          <Link
            to="/motos?condition=USADA"
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.06] via-jay-surface to-jay-surface p-6 transition-all hover:border-white/20 sm:p-8"
          >
            <span className="eyebrow !text-gray-400">Usadas seleccionadas</span>
            <h2 className="mt-3 font-display text-6xl font-extrabold italic leading-none text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-7xl">
              USA<span className="text-jay-red">DAS</span>
            </h2>
            <p className="mt-4 max-w-[16rem] text-sm text-gray-400">Selección propia: unidades elegidas y verificadas por la agencia.</p>
            <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors group-hover:text-white">
              Ver usadas <ArrowRight size={15} />
            </span>
            <span className="pointer-events-none absolute -right-6 bottom-2 select-none font-display text-[7rem] font-extrabold italic leading-none text-white/[0.03] sm:text-[9rem]">U</span>
          </Link>
        </div>
      </section>

      {/* ============ DESTACADAS ============ */}
      <section className="border-t border-white/5 bg-jay-panel">
        <div className="container-jay py-14 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
            <div>
              <span className="eyebrow">Selección JAY MOTOS</span>
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

      {/* ============ ESPECIALISTAS EN MOTOS ============ */}
      <section className="relative overflow-hidden border-t border-white/5 bg-jay-panel">
        <img
          src={ktmPhoto}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_20%] opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jay-panel via-jay-panel/85 to-jay-panel/30" aria-hidden="true" />
        <div className="container-jay relative grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="eyebrow">Especialistas en motos</span>
            <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.88] text-white sm:text-7xl">
              En el enduro<br /><span className="text-jay-red">nos sentimos<br />en casa.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
              JAY MOTOS es una concesionaria multimarca con especial identidad en las motos enduro y off-road:
              las motos que amamos, las que conocemos y las que recomendamos. No somos una tienda generalista.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                'Concesionaria multimarca',
                'Especialidad en enduro y off-road',
                'Motos 0 km y usadas seleccionadas',
                'Envíos a todo el país',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-200">
                  <BadgeCheck size={18} className="shrink-0 text-jay-red" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/nosotros" className="btn btn-ghost mt-8 px-6 py-3.5 text-xs">
              Sobre la agencia <ChevronRight size={16} />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-jay-red/25 bg-black/70 p-8 backdrop-blur">
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-jay-red-soft">
                El eslogan es un compromiso
              </p>
              <p className="mt-3 font-display text-5xl font-extrabold italic uppercase leading-[0.9] text-white sm:text-6xl">
                FOR<br />RIDERS,<br /><span className="text-jay-red">BY<br />RIDERS.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINANCIACIÓN ============ */}
      <section className="border-t border-white/5 bg-jay-black">
        <div className="container-jay flex flex-col items-start justify-between gap-8 py-14 sm:py-16 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">JAY MOTOS · Comercial</span>
            <h2 className="mt-2 font-display text-6xl font-extrabold uppercase leading-[0.85] text-white sm:text-8xl">
              FINAN<span className="text-jay-red">CIA</span>CIÓN
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-300">
              Las opciones de financiación se consultan directamente con nosotros.
              Escribinos y armamos un esquema a medida de cada operación — sin vueltas.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto">
            <a href={buildWhatsAppLink('Hola! Quisiera consultar por las opciones de financiación disponibles en JAY MOTOS.')} target="_blank" rel="noopener noreferrer" className="btn btn-red px-8 py-4 text-sm">
              <Phone size={18} />
              Consultar por WhatsApp
            </a>
            <Link to="/financiacion" className="btn btn-ghost px-8 py-4 text-sm">
              Ver cómo funciona
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ENVÍOS A TODO EL PAÍS ============ */}
      <section className="relative overflow-hidden border-t border-white/5 bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_50%,rgba(227,38,54,0.16),transparent)]" aria-hidden="true" />
        <div className="container-jay relative flex flex-col items-center gap-6 py-12 text-center sm:py-16 lg:flex-row lg:justify-between lg:text-left">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-jay-red text-white sm:h-20 sm:w-20">
              <Truck size={34} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                Envíos a<br /><span className="text-jay-red">todo el país.</span>
              </h2>
              <p className="mt-2 max-w-xs text-xs text-gray-400 sm:text-sm">
                Coordinamos la entrega de tu moto a cualquier punto del territorio argentino.
              </p>
            </div>
          </div>
          <a href={buildWhatsAppLink('Hola! Quisiera coordinar el envío de una moto a mi localidad.')} target="_blank" rel="noopener noreferrer" className="btn btn-ghost shrink-0 px-7 py-4 text-xs">
            Coordinar mi envío
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* ============ SOBRE NOSOTROS ============ */}
      <section className="border-t border-white/5 bg-jay-panel">
        <div className="container-jay grid gap-10 py-14 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">Sobre nosotros</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] text-white sm:text-6xl">
              En JAY MOTOS compartimos<br /><span className="text-jay-red">la misma pasión<br />que vos.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="text-lg leading-relaxed text-gray-300">
              En JAY MOTOS compartimos la misma pasión que nuestros clientes. Somos una concesionaria
              multimarca dedicada a la venta de motocicletas 0 km y usadas seleccionadas.
              Creemos que cada moto representa una nueva aventura.
            </p>
            <p className="mt-5 font-display text-2xl font-extrabold italic uppercase leading-none text-white">
              FOR RIDERS,<br /><span className="text-jay-red">BY RIDERS.</span>
            </p>
            <Link to="/nosotros" className="mt-6 inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-white">
              Conocé la agencia <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ UBICACIÓN Y CONTACTO ============ */}
      <section className="border-t border-white/5 bg-jay-black">
        <div className="container-jay grid gap-8 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="eyebrow">Ubicación y contacto</span>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
              Vení a<br /><span className="text-jay-red">Corrientes 1440.</span>
            </h2>
            <ul className="mt-8 space-y-4 text-base text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-jay-red" />
                <span className="font-semibold text-white">{BUSINESS.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Truck size={20} className="mt-0.5 shrink-0 text-jay-red" />
                <span>{BUSINESS.shippingLabel}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="mt-0.5 shrink-0 text-jay-red" />
                <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="font-semibold text-white transition-colors hover:text-jay-red-soft">
                  {BUSINESS.phoneDisplay} <span className="text-gray-500">(WhatsApp)</span>
                </a>
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="btn btn-red px-7 py-4 text-xs">
                <MapPin size={17} />
                Abrir en Google Maps
              </a>
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-7 py-4 text-xs">
                <Phone size={17} />
                Escribinos ahora
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-card">
              {/* Mapa interactivo de Google Maps — Corrientes 1440, Tucumán, Argentina */}
              <iframe
                title="JAY MOTOS — Corrientes 1440, Tucumán, Argentina"
                src="https://www.google.com/maps?q=Corrientes+1440+Tucuman+Argentina&output=embed"
                width="100%"
                height="420"
                className="block h-[280px] w-full sm:h-[360px] lg:h-[440px]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Franja de identidad de marca */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-jay-surface px-5 py-4 sm:px-6">
                <Logo className="h-9 sm:h-11" />
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-jay-red-soft sm:text-xs">
                  For riders, by riders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Footer (cierre de la página) ============ */}
    </div>
  );
};
