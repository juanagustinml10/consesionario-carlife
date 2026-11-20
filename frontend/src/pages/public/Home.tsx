import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  SearchX,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { Logo } from '@/components/shared/Logo';
import { BikeCard } from '@/components/public/BikeCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { bikesService } from '@/services/bikes';
import { BUSINESS, buildWhatsAppLink } from '@/lib/constants';
import heroDefinitiva from '@/assets/hero-definitiva.jpg';
import section04Hero2 from '@/assets/seccion-04-hero2.jpg';
import type { Bike } from '@/types';

const BRANDS = [
  'KTM', 'HUSQVARNA', 'GASGAS', 'BETA', 'SHERCO', 'HONDA', 'YAMAHA', 'KAWASAKI', 'SUZUKI',
];

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Bike[]>([]);
  const [latest, setLatest] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [latestError, setLatestError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const latestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react/set-state-in-effect -- reinicio del estado antes de cada carga
    setLoading(true);
    setFeaturedError(false);
    setLatestError(false);
    Promise.allSettled([
      bikesService.list({ featured: true, limit: 3 }),
      bikesService.list({ limit: 4 }),
    ]).then(([featuredRes, latestRes]) => {
      if (cancelled) return;
      // `Array.isArray` es la última línea de defensa: ninguna lista puede
      // llegar a undefined y romper el render con `featured.length`.
      const featuredList = featuredRes.status === 'fulfilled' ? featuredRes.value.data : null;
      const latestList = latestRes.status === 'fulfilled' ? latestRes.value.data : null;
      setFeatured(Array.isArray(featuredList) ? featuredList : []);
      setLatest(Array.isArray(latestList) ? latestList : []);
      setFeaturedError(!Array.isArray(featuredList));
      setLatestError(!Array.isArray(latestList));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => setReloadKey((key) => key + 1);
  const waGeneral = buildWhatsAppLink(BUSINESS.whatsappGeneralMessage);
  const scrollLatest = (direction: number) => {
    latestRef.current?.scrollBy({ left: direction * 380, behavior: 'smooth' });
  };

  return (
    <div className="bg-sf-black text-sf-white">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden border-b border-white/5 lg:min-h-[calc(100svh-4.5rem)]">
        {/* Fotografía protagonista: misma presencia y encuadre que el hero de referencia. */}
        <img
          src={heroDefinitiva}
          alt="Motocicleta sobre un camino de tierra — imagen del mundo off-road"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[78%_45%] sm:object-[74%_40%] lg:object-[70%_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sf-black via-sf-black/80 to-sf-black/5" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-sf-black via-sf-black/25 to-sf-black/40" aria-hidden="true" />

        <div className="container-sf relative flex flex-1 items-center py-14">
          <div className="max-w-3xl">
            <h1
              className="animate-hero-reveal font-display text-[clamp(2.1rem,10.5vw,2.75rem)] font-extrabold italic uppercase leading-[0.9] text-white sm:text-7xl lg:text-[5rem] xl:text-[5.5rem]"
              style={{ animationDelay: '0.15s' }}
            >
              Tu próxima<br />
              <span className="text-sf-red">moto</span><br />
              te está esperando.
            </h1>

            <p
              className="animate-hero-reveal mt-5 font-display text-base font-bold uppercase tracking-[0.35em] text-white/75 sm:text-lg"
              style={{ animationDelay: '0.28s' }}
            >
              {BUSINESS.tagline}
            </p>

            <p
              className="animate-hero-reveal mt-2 max-w-xl text-base leading-relaxed text-sf-ink-300"
              style={{ animationDelay: '0.36s' }}
            >
              Encontrá tu próxima moto entre nuestras opciones 0 km y usadas. Elegí la que va con vos.
            </p>

            <div
              className="animate-hero-reveal mt-7 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '0.48s' }}
            >
              <Link to="/motos" className="btn btn-red px-8 py-4 text-sm">
                Explorar motos
                <ArrowRight size={18} />
              </Link>
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-8 py-4 text-sm">
                <MessageCircle size={17} />
                Consultar por WhatsApp
              </a>
            </div>

            <div
              className="animate-hero-reveal mt-7 inline-flex items-center gap-2 rounded-full border border-sf-red/40 bg-black/60 px-4 py-2 backdrop-blur-sm"
              style={{ animationDelay: '0.55s' }}
            >
              <BadgeCheck size={15} className="text-sf-red-soft" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-100">
                0 km <span className="text-sf-red">/</span> Usadas
              </span>
            </div>
          </div>
        </div>

        {/* Franja multimarca a todo ancho, dentro del hero */}
        <div className="relative z-10 border-t border-white/10 bg-white py-3">
          <div className="overflow-hidden" aria-hidden="true">
            <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span key={i} className="font-display text-lg font-extrabold italic uppercase tracking-[0.18em] text-black/75 sm:text-xl">
                  {brand} <span className="ml-12 text-sf-red">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 01 / CATEGORÍAS — ÍNDICE EDITORIAL ============ */}
      <section className="bg-sf-paper text-sf-black">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="section-index !text-sf-red">01 / Catálogo</div>
              <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
                Elegí por<br /><span className="text-sf-red">donde arrancar</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-black/60">
                Dos maneras de encontrar tu próxima moto dentro del catálogo de SF MOTOS.
              </p>
              <div className="mt-8 hidden h-px w-full bg-black/10 lg:block" />
              <Link
                to="/motos"
                className="mt-6 hidden items-center gap-2 py-2 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-black/70 transition-colors hover:text-sf-red lg:inline-flex"
              >
                Ver catálogo completo <ArrowRight size={17} />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <Link
                to="/motos?condition=NUEVA"
                className="group flex min-h-[200px] items-center gap-5 border-t-[3px] border-sf-red bg-white px-6 py-7 transition-colors hover:bg-sf-black hover:text-white sm:gap-8 sm:px-9"
              >
                <span className="font-display text-6xl font-extrabold leading-none text-sf-red sm:text-8xl" aria-hidden="true">01</span>
                <span className="h-14 w-px shrink-0 bg-black/10 transition-colors group-hover:bg-white/20" aria-hidden="true" />
                <span className="flex-1">
                  <span className="micro-label text-sf-red">Catálogo 0 km</span>
                  <span className="mt-1 block font-display text-4xl font-extrabold uppercase leading-none sm:text-6xl">0 km</span>
                  <span className="mt-2 block max-w-[17rem] text-xs leading-relaxed text-black/55 transition-colors group-hover:text-gray-300">
                    Unidades 0 km disponibles en el catálogo.
                  </span>
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-sf-black text-white transition-colors group-hover:bg-sf-red sm:h-12 sm:w-12" aria-hidden="true">
                  <ArrowRight size={21} />
                </span>
              </Link>

              <Link
                to="/motos?condition=USADA"
                className="group flex min-h-[200px] items-center gap-5 border-t border-black/15 bg-sf-black px-6 py-7 text-white transition-colors hover:border-sf-red sm:gap-8 sm:px-9"
              >
                <span className="font-display text-6xl font-extrabold leading-none text-white/15 sm:text-8xl" aria-hidden="true">02</span>
                <span className="h-14 w-px shrink-0 bg-white/15" aria-hidden="true" />
                <span className="flex-1">
                  <span className="micro-label text-sf-red-soft">Catálogo usadas</span>
                  <span className="mt-1 block font-display text-4xl font-extrabold uppercase leading-none sm:text-6xl">Usadas</span>
                  <span className="mt-2 block max-w-[17rem] text-xs leading-relaxed text-gray-400">
                    Motos usadas publicadas con sus datos y fotos.
                  </span>
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 transition-colors group-hover:border-sf-red group-hover:bg-sf-red sm:h-12 sm:w-12" aria-hidden="true">
                  <ArrowRight size={21} />
                </span>
              </Link>

              <Link
                to="/motos"
                className="mt-4 flex items-center justify-between border border-black/15 px-6 py-4 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-black/70 transition-colors hover:border-sf-red hover:text-sf-red lg:hidden"
              >
                Ver catálogo completo <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 / DESTACADAS — GRID ASIMÉTRICO ============ */}
      <section className="bg-sf-black">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-index">02 / Selección SF MOTOS</div>
              <h2 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.86] text-white sm:text-8xl">
                Destacadas<span className="text-sf-red">.</span>
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden font-display text-7xl font-extrabold leading-none text-outline sm:block" aria-hidden="true">SF</span>
              <Link to="/motos?featured=true" className="btn btn-ghost px-6 py-3.5 text-xs">
                Ver todas <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className={i === 0 ? 'sm:col-span-2 lg:col-span-6' : 'lg:col-span-3'}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : featuredError ? (
            <ErrorState compact onRetry={retry} />
          ) : featured.length === 0 ? (
            <EmptyState
              icon={<BadgeCheck size={30} />}
              code="00"
              title={<>Sin destacadas</>}
              description="Todavía no hay motos destacadas publicadas."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
              {featured.map((bike, i) => (
                <div key={bike.id} className={i === 0 ? 'sm:col-span-2 lg:col-span-6' : 'lg:col-span-3'}>
                  <BikeCard bike={bike} feature={i === 0} className="h-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 03 / ÚLTIMOS INGRESOS — BANDA CLARA ============ */}
      <section className="bg-white text-sf-black">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="mb-9 flex flex-col gap-6 border-l-4 border-sf-red pl-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="micro-label text-sf-red">03 / Recién publicadas</div>
              <h2 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.01em] sm:text-7xl">
                Últimos ingresos
              </h2>
            </div>
            {!loading && !latestError && latest.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollLatest(-1)}
                  aria-label="Ver ingresos anteriores"
                  className="flex h-11 w-11 items-center justify-center bg-sf-black text-white transition-colors hover:bg-sf-red"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollLatest(1)}
                  aria-label="Ver más ingresos"
                  className="flex h-11 w-11 items-center justify-center bg-sf-black text-white transition-colors hover:bg-sf-red"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} tone="light" />)}
            </div>
          ) : latestError ? (
            <ErrorState compact onRetry={retry} />
          ) : latest.length === 0 ? (
            <EmptyState
              tone="light"
              icon={<SearchX size={30} />}
              code="00"
              title={<>Catálogo vacío</>}
              description="Todavía no hay motos publicadas en el catálogo."
            />
          ) : (
            <div ref={latestRef} className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
              {latest.slice(0, 4).map((bike) => (
                <div key={bike.id} className="w-[82vw] max-w-sm shrink-0 snap-start sm:w-[350px]">
                  <BikeCard bike={bike} tone="light" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 04 / EN MOVIMIENTO — COMPOSICIÓN INVERTIDA ============ */}
      <section className="bg-sf-panel">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="grid gap-0 lg:grid-cols-12 lg:items-stretch">
            <div className="relative isolate order-2 lg:order-1 lg:col-span-6 lg:py-8">
              <span className="pointer-events-none absolute -bottom-8 left-0 -z-10 select-none font-display text-[9rem] font-extrabold leading-none text-outline sm:text-[12rem]" aria-hidden="true">SF</span>
              <div className="section-index">04 / En movimiento</div>
              <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] text-white sm:text-6xl">
                Hecha para<br /><span className="text-sf-red">salir a andar</span>
              </h2>
              <div className="mt-6 h-[3px] w-20 bg-sf-red" aria-hidden="true" />
              <p className="mt-6 text-base leading-relaxed text-gray-300">
                En SF MOTOS trabajamos con motos 0 km y usadas. Mirá cada publicación, compará modelos y escribinos cuando quieras saber más.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Fotos y datos de cada unidad',
                  'Ficha individual con características',
                  'Comparador y favoritos',
                  BUSINESS.shippingLabel,
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-200">
                    <BadgeCheck size={18} className="shrink-0 text-sf-red" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/nosotros" className="mt-8 inline-flex items-center gap-2 border-b border-white/20 py-2 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-white transition-colors hover:border-sf-red hover:text-sf-red">
                Sobre la agencia <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative order-1 mb-9 lg:order-2 lg:col-span-6 lg:mb-0">
              <img
                src={section04Hero2}
                alt="Motocicleta en acción"
                loading="lazy"
                className="h-full min-h-[320px] w-full object-cover object-center sm:min-h-[460px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sf-black/70 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 bg-sf-red px-6 py-3">
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.28em] text-white">
                  {BUSINESS.tagline}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 / FINANCIACIÓN — PANEL DE CONSULTA ============ */}
      <section className="bg-sf-paper text-sf-black">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <div className="section-index !text-sf-red">05 / Comercial</div>
              <h2 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-[-0.02em] sm:text-8xl">
                Financiación
              </h2>
              <div className="mt-6 h-1 w-24 bg-sf-red" aria-hidden="true" />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-black/65">
                Las opciones de financiación se consultan directamente con nosotros. Escribinos y conversamos sobre cada operación: las condiciones se definen caso por caso.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="cut-corner-lg bg-sf-black p-7 text-white shadow-[0_24px_60px_-34px_rgba(0,0,0,0.65)] sm:p-9">
                <span className="micro-label text-sf-red-soft">Consultas</span>
                <p className="mt-3 font-display text-3xl font-extrabold uppercase leading-[0.95] sm:text-4xl">
                  Cada operación, conversada con nosotros.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <a
                    href={buildWhatsAppLink('Hola! Quisiera consultar por las opciones de financiación disponibles en SF MOTOS.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-red px-7 py-4 text-xs"
                  >
                    <Phone size={17} /> Consultar por WhatsApp
                  </a>
                  <Link to="/financiacion" className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 font-display text-xs font-extrabold uppercase tracking-[0.2em] text-white transition-colors hover:border-sf-red hover:text-sf-red-soft">
                    Ver detalles <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 / CONSULTAS Y ENVÍOS — FRANJA DE SERVICIO ============ */}
      <section className="diagonal-lines border-y border-white/10 bg-sf-black">
        <div className="container-sf py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="flex items-center gap-4 sm:gap-5 lg:col-span-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-sf-red text-white sm:h-20 sm:w-20">
                <MessageCircle size={32} />
              </div>
              <div>
                <div className="section-index">06 / Consultas</div>
                <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                  ¿Buscás <span className="text-sf-red">una moto</span>?
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Consultanos por disponibilidad, precios o envíos. Te respondemos por WhatsApp.
                </p>
              </div>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <a
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red px-7 py-4 text-xs"
              >
                Escribinos ahora <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 07 / UBICACIÓN Y CONTACTO — MAPA + PANEL SOLAPADO ============ */}
      <section className="bg-white text-sf-black">
        <div className="container-sf py-16 sm:py-20 lg:py-28">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-index !text-sf-red">07 / Ubicación y contacto</div>
              <h2 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.02em] sm:text-7xl">
                Vení a<br /><span className="text-sf-red">9 de Julio 119</span>
              </h2>
            </div>
            <p className="font-display text-lg font-semibold uppercase tracking-wider text-black/55">
              Juan B. Alberdi, Tucumán
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="border border-black/10 bg-sf-paper">
                <iframe
                  title="SF MOTOS — 9 de Julio 119, Juan B. Alberdi, Tucumán, Argentina"
                  src="https://www.google.com/maps?q=9+de+Julio+119+Juan+B.+Alberdi+Tucuman+Argentina&output=embed"
                  width="100%"
                  height="420"
                  className="block h-[300px] w-full sm:h-[420px] lg:h-[500px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="relative z-10 -mt-8 bg-sf-black p-7 text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.65)] sm:p-9 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:-ml-10 lg:p-10">
              <Logo onDark className="h-9" />
              <span className="micro-label mt-7 block text-sf-red-soft">{BUSINESS.name} / Contacto</span>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-sf-red" />
                  <span className="font-semibold">{BUSINESS.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle size={20} className="mt-0.5 shrink-0 text-sf-red" />
                  <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="inline-block py-1 font-semibold transition-colors hover:text-sf-red-soft">
                    {BUSINESS.phoneDisplay} <span className="text-gray-500">(WhatsApp)</span>
                  </a>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="btn btn-red px-6 py-4 text-xs">
                  <MapPin size={17} /> Abrir en Google Maps
                </a>
                <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-6 py-4 text-xs">
                  <Phone size={17} /> Escribinos ahora
                </a>
              </div>
              <p className="mt-8 border-t border-white/10 pt-5 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                {BUSINESS.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
