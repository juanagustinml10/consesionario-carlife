import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  SearchX,
  Truck,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { SectionHeading } from '@/components/public/SectionHeading';
import { WhatsAppButton, WhatsAppIcon } from '@/components/shared/WhatsAppButton';
import { Reveal } from '@/components/shared/Reveal';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { bikesService } from '@/services/bikes';
import { BUSINESS } from '@/lib/constants';
import type { Bike } from '@/types';

// Sección 05 (experiencia) desactivada temporalmente. Se conserva el JSX y la
// ruta /nosotros para volver a activarla cuando se necesite.
const SHOW_EXPERIENCE_SECTION = false;

const SERVICES = [
  {
    index: '01',
    title: 'Créditos prendarios',
    text: BUSINESS.financingMessage,
    image: '/images/service-financiacion.webp',
    message: BUSINESS.financingMessage,
  },
  {
    index: '02',
    title: 'Permutas',
    text: 'Tu próximo vehículo puede empezar con el que ya tenés.',
    image: '/images/service-permutas.webp',
    message: 'Hola! Quisiera consultar por permutas en CARLIFE.',
  },
  {
    index: '03',
    title: 'Consignaciones',
    text: 'Nos encargamos de publicar y comercializar tu vehículo.',
    image: '/images/service-consignaciones.webp',
    message: 'Hola! Quisiera consultar por consignaciones en CARLIFE.',
  },
  {
    index: '04',
    title: 'Envíos a todo el país',
    text: 'Coordinamos la entrega según tu ubicación.',
    image: '/images/service-envios.webp',
    message: 'Hola! Quisiera consultar por envíos a todo el país en CARLIFE.',
  },
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
      bikesService.list({ featured: true, condition: 'USADA', limit: 3 }),
      bikesService.list({ condition: 'USADA', limit: 4 }),
    ]).then(([featuredRes, latestRes]) => {
      if (cancelled) return;
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
  const scrollLatest = (direction: number) => {
    latestRef.current?.scrollBy({ left: direction * 390, behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-cc-black">
      {/* ============ HERO ============ */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <div className="container-cc">
            <p className="hero__eyebrow animate-fade-up">
              <span className="hero__eyebrow-rule" aria-hidden="true" />
              <span className="hero__eyebrow-desktop">CARLIFE · YERBA BUENA</span>
              <span className="hero__eyebrow-mobile">
                CARLIFE <span className="hero__eyebrow-place">· YERBA BUENA</span>
              </span>
            </p>
            <h1 id="hero-title" className="hero__title animate-fade-up" style={{ animationDelay: '0.07s' }}>
              <span className="hero__title-desktop">
                <span>TU PRÓXIMO <span className="text-cc-metal">AUTO</span></span>
                <span>COMIENZA</span>
                <span className="hero__title-accent">AQUÍ.</span>
              </span>
              <span className="hero__title-mobile">
                <span>TU PRÓXIMO</span>
                <span><span className="text-cc-metal">AUTO</span> COMIENZA</span>
                <span className="hero__title-accent">AQUÍ.</span>
              </span>
            </h1>
            <p className="hero__description animate-fade-up" style={{ animationDelay: '0.14s' }}>
              <span className="hero__description-desktop">
                {BUSINESS.slogan} En CARLIFE trabajamos con autos usados seleccionados.
              </span>
              <span className="hero__description-mobile">{BUSINESS.slogan}</span>
            </p>
            <div className="hero__actions animate-fade-up" style={{ animationDelay: '0.21s' }}>
              <Link to="/motos" className="btn btn-dark">
                EXPLORAR VEHÍCULOS <ArrowRight size={15} />
              </Link>
              <WhatsAppButton label="CONSULTAR POR WHATSAPP" />
            </div>
          </div>
        </div>

        <div className="hero__media">
          <picture className="hero__picture">
            <source media="(max-width: 767px)" srcSet="/images/hero-panoramic-mobile.webp" type="image/webp" />
            <img
              src="/images/hero-panoramic-desktop.webp"
              alt="Automóvil deportivo moderno en vista de tres cuartos delantero"
              width={2400}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="hero__image"
            />
          </picture>
        </div>

        <div className="hero__bar">
          <div className="container-cc flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>AUTOS USADOS</span><span className="hero__dot">/</span>
              <span>DISPONIBLES</span><span className="hero__dot">/</span>
              <span>PERMUTAS</span><span className="hero__dot">/</span>
              <span>CONSIGNACIONES</span>
            </p>
            <p className="hidden text-[9px] normal-case tracking-normal text-cc-metal lg:block">
              Imagen: Audi RS 6 Avant (2024) · Wikimedia Commons · CC0
            </p>
          </div>
        </div>
      </section>

      {/* ============ 01 / INVENTARIO ============ */}
      <section className="section-white">
        <div className="container-cc py-24 sm:py-32 lg:py-40">
          <Reveal>
            <div className="mb-12">
              <span className="eyebrow eyebrow-dark">Inventario</span>
              <h2 className="display-lg mt-6 max-w-2xl">
                Empezá por lo que <span className="text-cc-metal">buscás</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <Link
              to="/motos"
              className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-cc-black p-7 sm:min-h-[360px] sm:p-10"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-cc-red" aria-hidden="true" />
              <div className="flex items-start justify-between gap-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
                  Acceso al catálogo
                </p>
                <span className="font-display text-5xl font-bold leading-none tracking-[-0.09em] text-white/10 sm:text-7xl" aria-hidden="true">
                  01
                </span>
              </div>
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <p className="font-display text-3xl font-bold uppercase leading-none tracking-[-0.06em] text-white sm:text-6xl">
                    Ver vehículos <span className="break-words">seleccionados</span>
                  </p>
                  <p className="mt-4 max-w-md text-xs leading-relaxed text-white/65">
                    Explorá las unidades disponibles con sus fotos y datos.
                  </p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-cc-red text-cc-red transition-colors group-hover:border-white group-hover:bg-white group-hover:text-cc-black sm:h-12 sm:w-12">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <span
                className="absolute bottom-0 left-0 h-1 w-12 bg-cc-red transition-all duration-500 group-hover:w-full"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 02 / DESTACADOS ============ */}
      <section className="section-light">
        <div className="container-cc py-24 sm:py-32 lg:py-40">
          <Reveal>
            <SectionHeading
              eyebrow="Selección CARLIFE"
              title={<>Destacados</>}
              actionLabel="Ver todos"
              actionTo="/motos?featured=true"
              tone="light"
            />
          </Reveal>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredError ? (
            <ErrorState compact onRetry={retry} />
          ) : featured.length === 0 ? (
            <EmptyState
              icon={<BadgeCheck size={30} strokeWidth={1.5} />}
              code="00"
              title={<>Sin destacados</>}
              description="Todavía no hay vehículos destacados publicados."
              tone="light"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((bike, index) => (
                <Reveal key={bike.id} delay={index * 80}>
                  <BikeCard bike={bike} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 03 / ÚLTIMOS INGRESOS ============ */}
      <section className="section-white">
        <div className="container-cc py-24 sm:py-32 lg:py-40">
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 border-t border-black/15 pt-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow eyebrow-dark">Recién publicados</span>
                <h2 className="display-lg mt-6">Últimos ingresos</h2>
              </div>
              {!loading && !latestError && latest.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollLatest(-1)}
                    aria-label="Ver ingresos anteriores"
                    className="flex h-11 w-11 items-center justify-center border border-black/20 text-black/60 transition-colors hover:border-black hover:text-black"
                  >
                    <ChevronLeft size={19} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollLatest(1)}
                    aria-label="Ver más ingresos"
                    className="flex h-11 w-11 items-center justify-center border border-black/20 text-black/60 transition-colors hover:border-black hover:text-black"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : latestError ? (
            <ErrorState compact onRetry={retry} />
          ) : latest.length === 0 ? (
            <EmptyState
              icon={<SearchX size={30} strokeWidth={1.5} />}
              code="00"
              title={<>Catálogo vacío</>}
              description="Todavía no hay vehículos publicados en el catálogo."
              tone="light"
            />
          ) : (
            <div ref={latestRef} className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0">
              {latest.slice(0, 4).map((bike) => (
                <div key={bike.id} className="w-[84vw] max-w-sm shrink-0 snap-start sm:w-[340px]">
                  <BikeCard bike={bike} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 04 / SERVICIOS ============ */}
      <section className="section-dark">
        <div className="container-cc py-24 sm:py-32 lg:py-40">
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="eyebrow eyebrow-light">Servicios</span>
                <h2 className="display-lg mt-6 max-w-3xl text-white">
                  Todo lo que necesitás, <span className="text-white/40">en un mismo lugar</span>
                </h2>
              </div>
              <Link
                to="/servicios"
                className="group inline-flex min-h-11 shrink-0 items-center gap-3 self-start border-b border-white/30 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65 transition-colors hover:border-white hover:text-white lg:self-auto lg:pb-2"
              >
                Ver todos los servicios
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => (
              <Reveal key={service.title} delay={index * 70}>
                <div className="group flex h-full flex-col bg-cc-black p-6 transition-colors hover:bg-cc-carbon">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-cc-graphite">
                    <img
                      src={service.image}
                      alt={`Servicio de ${service.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="mt-7 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">{service.index}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold uppercase leading-tight tracking-[-0.04em] text-white">{service.title}</h3>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-white/55">{service.text}</p>
                  <WhatsAppButton
                    message={service.message}
                    label="Consultar"
                    size="sm"
                    className="mt-7 w-full"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 05 / EXPERIENCIA (oculta temporalmente) ============ */}
      {SHOW_EXPERIENCE_SECTION && (
      <section className="section-soft">
        <div className="container-cc grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center lg:gap-20 lg:py-40">
          <Reveal className="lg:col-span-7">
            <div className="image-zoom aspect-[4/3] bg-cc-carbon sm:aspect-[16/10]">
              <img
                src="/images/editorial-coupe.webp"
                alt="Automóvil en una escena editorial"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5">
            <span className="eyebrow eyebrow-dark">CARLIFE</span>
            <h2 className="display-lg mt-6">
              Información clara, decisiones <span className="text-cc-metal">simples</span>
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-cc-slate">
              En CARLIFE trabajamos con autos usados seleccionados. Mirá cada publicación, guardá tus favoritos y escribinos cuando quieras saber más.
            </p>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                'Fotos y datos de cada unidad',
                'Ficha individual con características',
                'Favoritos para volver después',
                BUSINESS.shippingLabel,
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-black/10 pb-3 text-xs leading-relaxed text-cc-slate">
                  <BadgeCheck size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-cc-metal" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/nosotros"
              className="group mt-10 inline-flex items-center gap-3 border-b border-black/25 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cc-slate transition-colors hover:border-black hover:text-black"
            >
              Sobre la concesionaria <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
      )}

      {/* ============ 06 / FINANCIACIÓN ============ */}
      <section className="section-white">
        <div className="container-cc grid gap-10 py-24 sm:py-32 lg:grid-cols-12 lg:items-center lg:gap-20 lg:py-40">
          <Reveal className="min-w-0 lg:col-span-7">
            <span className="eyebrow eyebrow-dark">Créditos prendarios</span>
            <h2 className="display-xl mt-7">Créditos prendarios</h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-cc-slate">
              {BUSINESS.financingMessage}
            </p>
            <p className="mt-5 max-w-md border-l-2 border-cc-red pl-4 text-xs leading-relaxed text-cc-metal">
              Consultanos directamente para conocer las opciones disponibles para tu caso.
            </p>
          </Reveal>
          <Reveal delay={100} className="flex min-w-0 flex-col justify-center bg-cc-carbon p-7 text-white sm:p-10 lg:col-span-5">
            <span className="eyebrow eyebrow-light">Hablemos</span>
            <p className="mt-6 font-display text-2xl font-semibold uppercase leading-tight tracking-[-0.045em]">
              Consultá por créditos prendarios
            </p>
            <WhatsAppButton
              size="lg"
              label="Consultar por WhatsApp"
              message={BUSINESS.financingMessage}
              className="mt-8 w-full"
            />
            <Link to="/financiacion" className="btn btn-outline mt-3 w-full">
              Ver detalles <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 07 / UBICACIÓN Y CONTACTO ============ */}
      <section className="section-light">
        <div className="container-cc py-24 sm:py-32 lg:py-40">
          <Reveal>
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="eyebrow eyebrow-dark">Ubicación y contacto</span>
                <h2 className="display-lg mt-6">
                  Vení a vernos a <span className="text-cc-metal">Yerba Buena</span>
                </h2>
              </div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-cc-metal">
                Tucumán, Argentina · {BUSINESS.shippingLabel}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-0 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-7">
              <div className="border border-black/10 bg-white p-2">
                <iframe
                  title={`Mapa de CARLIFE — ${BUSINESS.address}`}
                  src={BUSINESS.mapsEmbed}
                  width="100%"
                  height="420"
                  className="block h-[300px] w-full sm:h-[420px] lg:h-[500px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal delay={100} className="relative z-10 lg:col-span-5">
              <div className="border border-white/10 bg-cc-black p-7 shadow-card sm:p-10">
                <p className="eyebrow eyebrow-light">CARLIFE / Contacto</p>
                <ul className="mt-8 space-y-6 text-sm text-white/75">
                  <li className="flex items-start gap-4">
                    <MapPin size={19} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/40" />
                    <span className="font-medium leading-relaxed">{BUSINESS.address}</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <WhatsAppIcon size={19} className="mt-0.5 text-white/50" />
                    <a
                      href={`https://wa.me/${BUSINESS.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-medium transition-colors hover:text-white"
                    >
                      <span className="data-num">{BUSINESS.phoneDisplay}</span> <span className="text-white/45">(WhatsApp)</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <Truck size={19} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/40" />
                    <span className="font-medium">{BUSINESS.shippingLabel}</span>
                  </li>
                </ul>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a href={BUSINESS.addressLink} target="_blank" rel="noopener noreferrer" className="btn btn-light px-6">
                    <MapPin size={15} /> Cómo llegar
                  </a>
                  <WhatsAppButton label="Escribinos" className="px-6" />
                </div>
                <p className="mt-10 border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                  {BUSINESS.tagline}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
