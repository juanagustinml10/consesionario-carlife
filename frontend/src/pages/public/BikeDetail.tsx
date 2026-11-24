import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Fuel,
  Gauge,
  Heart,
  Phone,
  Route,
  Share2,
  Tag,
  Timer,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { ConditionTag, FeaturedTag, StatusTag } from '@/components/public/BikeBadges';
import { SectionHeading } from '@/components/public/SectionHeading';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFavoritesStore } from '@/stores/favorites';
import { bikesService } from '@/services/bikes';
import { getThumbnailUrl } from '@/lib/images';
import type { Bike } from '@/types';
import { BUSINESS } from '@/lib/constants';
import {
  conditionLabel,
  featureLabel,
  formatDisplacement,
  formatMileage,
  formatPrice,
  formatUsageHours,
  usageLabel,
} from '@/lib/format';
import { cn } from '@/lib/utils';

export const BikeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bike, setBike] = useState<Bike | null>(null);
  const [related, setRelated] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const bikeId = bike?.id ?? slug ?? '';
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bikeId));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  const loadBike = useCallback(async () => {
    if (!slug) return;
    // eslint-disable-next-line react/set-state-in-effect -- reinicio del estado antes de cada carga
    setLoading(true);
    setError(false);
    setNotFound(false);
    try {
      const data = await bikesService.getBySlug(slug);
      bikesService.trackVisit(data.id).catch(() => {});
      setBike(data);
      setActiveImage(0);

      try {
        const all = await bikesService.list({ condition: 'USADA', limit: 8 });
        const relatedList = Array.isArray(all.data) ? all.data : [];
        setRelated(relatedList.filter((item) => item.id !== data.id).slice(0, 4));
      } catch {
        setRelated([]);
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      setBike(null);
      setRelated([]);
      if (status === 404) setNotFound(true);
      else setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect -- carga asíncrona de la ficha
    loadBike();
  }, [loadBike, reloadKey]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-white" role="status">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin border-2 border-black/10 border-t-black" />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.32em] text-cc-gray">Cargando ficha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-cc flex min-h-[70vh] flex-col justify-center py-20">
        <ErrorState title="No pudimos cargar la ficha" onRetry={() => setReloadKey((key) => key + 1)} />
        <Link to="/motos" className="btn btn-outline-dark mx-auto mt-6 px-6">
          <ChevronLeft size={15} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  if (!bike || notFound) {
    return (
      <div className="container-cc flex min-h-[70vh] items-center py-20">
        <EmptyState
          icon={<CarIcon size={30} strokeWidth={1.5} />}
          code="404"
          title={<>Vehículo no encontrado</>}
          description="La publicación buscada no existe o ya no está disponible."
          actions={
            <Link to="/motos" className="btn btn-dark px-6">
              Volver al catálogo
            </Link>
          }
          className="w-full"
        />
      </div>
    );
  }

  const images = bike.images ?? [];
  const features = bike.features ?? [];
  const currentImage = images[activeImage] ?? images[0];
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: bike.title, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // El usuario canceló el diálogo de compartir.
    }
  };

  // null y 0 se consideran "sin dato": nunca se muestran como horas cargadas.
  const usageHours = formatUsageHours(bike.usageHours);
  const specs = [
    { icon: <Calendar size={18} strokeWidth={1.6} />, label: 'Año', value: String(bike.year) },
    { icon: <Gauge size={18} strokeWidth={1.6} />, label: 'Motor', value: formatDisplacement(bike.displacementCc) },
    { icon: <Fuel size={18} strokeWidth={1.6} />, label: 'Kilómetros', value: formatMileage(bike.mileageKm) },
    ...(usageHours ? [{ icon: <Timer size={18} strokeWidth={1.6} />, label: 'Horas de uso', value: usageHours }] : []),
    ...(bike.usage ? [{ icon: <Route size={18} strokeWidth={1.6} />, label: 'Uso', value: usageLabel(bike.usage) }] : []),
    { icon: <Tag size={18} strokeWidth={1.6} />, label: 'Categoría', value: conditionLabel(bike.condition) },
  ];

  return (
    <div className="min-h-screen bg-white text-cc-black">
      <div className="border-b border-cc-paper bg-cc-soft pt-24">
        <nav className="container-cc flex min-h-14 flex-wrap items-center gap-x-2 gap-y-1 overflow-visible py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-cc-gray sm:h-14 sm:flex-nowrap sm:gap-x-3 sm:overflow-x-auto sm:py-0" aria-label="Ruta de navegación">
          <Link to="/motos" className="inline-flex min-h-11 shrink-0 items-center transition-colors hover:text-cc-black">Catálogo</Link>
          <span className="hidden text-black/25 sm:inline">/</span>
          <span className="hidden shrink-0 sm:inline">{bike.brand?.name ?? 'Vehículo'}</span>
          <span className="hidden text-black/25 sm:inline">/</span>
          <span className="min-w-0 break-words text-cc-black/75 sm:truncate">{bike.title}</span>
        </nav>
      </div>

      <section className="relative overflow-hidden bg-white">
        <div className="container-cc relative grid min-w-0 gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="min-w-0 lg:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="data-num text-xs text-cc-gray">01</span>
              <span className="h-px w-10 bg-black/20" />
              <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Galería</span>
            </div>
            <div className="relative overflow-hidden border border-cc-paper bg-cc-soft">
              <div className="aspect-[4/3] bg-cc-soft sm:aspect-[16/11]">
                {currentImage ? (
                  <img
                    key={currentImage.id}
                    src={currentImage.url}
                    alt={`${bike.brand?.name ?? ''} ${bike.model || bike.title} — vista ${activeImage + 1}`}
                    fetchPriority="high"
                    className="photo-soft h-full w-full object-contain"
                  />
                ) : (
                  <ImagePlaceholder width={1200} height={900} label="Foto no disponible" className="h-full w-full" />
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center border border-black/10 bg-white/95 text-cc-black shadow-sm transition-colors hover:bg-cc-black hover:text-white"
                    aria-label="Siguiente fotografía"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center border border-black/10 bg-white/95 text-cc-black shadow-sm transition-colors hover:bg-cc-black hover:text-white"
                    aria-label="Fotografía anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                </>
              )}
              <span className="data-num pointer-events-none absolute bottom-4 right-4 border border-black/10 bg-white/95 px-3 py-2 text-[11px] font-bold tracking-[0.18em] text-cc-black shadow-sm">
                {images.length ? `${String(activeImage + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}` : 'Sin fotos'}
              </span>
            </div>

            {images.length > 1 && (
              <div className="scrollbar-none mt-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Ver fotografía ${i + 1}`}
                    aria-current={i === activeImage ? 'true' : undefined}
                    className={cn(
                      'image-zoom h-20 w-28 shrink-0 border transition-all',
                      i === activeImage ? 'border-cc-black opacity-100' : 'border-cc-paper opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={getThumbnailUrl(img.url)} alt="" className="photo h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggleFavorite(bike.id)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors',
                  isFavorite
                    ? 'border-cc-black bg-cc-black text-white'
                    : 'border-black/20 text-black/65 hover:border-black hover:text-black'
                )}
              >
                <Heart size={16} className={isFavorite ? 'fill-current stroke-current' : ''} strokeWidth={1.7} />
                {isFavorite ? 'En favoritos' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex min-h-11 items-center gap-2 border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/65 transition-colors hover:border-black hover:text-black"
              >
                <Share2 size={16} strokeWidth={1.7} />
                {copied ? '¡Copiado!' : 'Compartir'}
              </button>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2">
              <ConditionTag condition={bike.condition} />
              <StatusTag status={bike.status} />
              {bike.featured && <FeaturedTag />}
            </div>

            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.3em] text-cc-gray">
              {bike.brand?.name ?? 'CARLIFE'}
            </p>
            <h1 className="mt-3 break-words font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.045em] text-cc-black sm:text-6xl lg:text-7xl">
              {bike.model || bike.title}
            </h1>
            <p className="mt-3 text-sm text-cc-gray">{bike.title}</p>

            <div className="relative mt-8 border-y border-cc-paper bg-white py-7 pl-6 pr-5">
              <div className="absolute inset-y-0 left-0 w-[2px] bg-cc-black" aria-hidden="true" />
              <p className="field-label">Precio publicado</p>
              <p className="data-num mt-2 break-words text-4xl leading-none text-cc-black sm:text-5xl">
                {formatPrice(bike.price, bike.currency)}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-cc-gray">
                Precio informado por la concesionaria. Consultanos por disponibilidad y condiciones de esta unidad.
              </p>
            </div>

            <WhatsAppButton bike={bike} size="lg" label="Consultar disponibilidad" className="mt-6 w-full" />
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-[11px] text-cc-gray">
              <Phone size={13} /> Te esperamos en {BUSINESS.address}
            </p>

            <div className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <span className="data-num text-xs text-cc-gray">02</span>
                <span className="h-px w-10 bg-black/20" />
                <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Datos principales</span>
              </div>
              <div className={cn('grid grid-cols-2 gap-px border border-cc-paper bg-cc-paper sm:grid-cols-3 lg:grid-cols-2', usageHours ? 'xl:grid-cols-5' : 'xl:grid-cols-4')}>
                {specs.map((spec) => (
                  <div key={spec.label} className="min-w-0 bg-white p-4">
                    <div className="text-cc-gray">{spec.icon}</div>
                    <p className="field-label mt-3 !text-[9px]">{spec.label}</p>
                    <p className="data-num mt-1 text-base text-cc-black">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div className="mt-12">
                <div className="mb-5 flex items-center gap-3">
                  <span className="data-num text-xs text-cc-gray">03</span>
                  <span className="h-px w-10 bg-black/20" />
                  <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Equipamiento</span>
                </div>
                <dl className="border border-cc-paper">
                  {features.map((feature, index) => (
                    <div key={feature.id} className={cn('flex items-center justify-between gap-4 px-4 py-3', index % 2 === 1 && 'bg-cc-soft')}>
                      <dt className="text-xs text-cc-gray">{featureLabel(feature.key)}</dt>
                      <dd className="min-w-0 break-words text-right text-sm font-semibold uppercase text-cc-black">{feature.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {bike.description && (
              <div className="mt-12">
                <div className="mb-5 flex items-center gap-3">
                  <span className="data-num text-xs text-cc-gray">04</span>
                  <span className="h-px w-10 bg-black/20" />
                  <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Descripción</span>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-black/65">{bike.description}</p>
              </div>
            )}

            <div className="mt-12 flex items-start gap-3 border border-cc-paper bg-cc-soft p-5">
              <WhatsAppIconDetail />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cc-black">
                  Consultá las condiciones de esta unidad
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cc-gray">
                  Las características y condiciones de cada vehículo se confirman al consultar. Escribinos por WhatsApp para recibir la información disponible.
                </p>
              </div>
            </div>

            <div className="mt-4 border-l-2 border-cc-red bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-cc-black">Créditos prendarios</p>
              <p className="mt-2 text-xs leading-relaxed text-cc-gray">{BUSINESS.financingMessage}</p>
              <Link
                to="/financiacion"
                className="mt-4 inline-flex min-h-11 items-center gap-2 self-start text-[10px] font-bold uppercase tracking-[0.2em] text-cc-red-dark transition-colors hover:text-cc-red"
              >
                Ver financiación <ArrowRight size={14} />
              </Link>
            </div>

            <p className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cc-gray">
              <Clock size={12} /> Publicada el {new Date(bike.createdAt).toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-light">
          <div className="container-cc py-16 sm:py-24">
            <SectionHeading
              index="05"
              eyebrow="También te puede interesar"
              title={<>Similares</>}
              actionLabel="Ver catálogo"
              actionTo="/motos"
              tone="light"
            />
            <div className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {related.map((item) => (
                <div key={item.id} className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-72 lg:w-auto lg:max-w-none">
                  <BikeCard bike={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="bg-white py-10">
        <div className="container-cc">
          <Link
            to="/motos"
            className="group inline-flex min-h-11 items-center gap-2 self-start border-b border-black/25 pb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-black/60 transition-colors hover:border-black hover:text-black"
          >
            <ChevronLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

/** Icono de WhatsApp en tono oscuro para el aviso de la ficha. */
const WhatsAppIconDetail: React.FC = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" className="mt-0.5 shrink-0 text-cc-gray">
    <path d="M12.04 2C6.5 2 2 6.48 2 11.98c0 1.76.46 3.48 1.34 5L2 22l5.16-1.32a10 10 0 0 0 4.88 1.25h.01c5.53 0 10.03-4.48 10.03-10.02C22.08 6.48 17.58 2 12.04 2Zm0 18.05a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.06.78.82-2.98-.2-.31a8.28 8.28 0 0 1-1.27-4.42c0-4.59 3.76-8.32 8.38-8.32a8.36 8.36 0 0 1 8.38 8.32c0 4.6-3.77 8.27-8.42 8.27Zm4.6-6.2c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.12-.56.12-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.17 1.75 2.67 4.24 3.74.59.25 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
  </svg>
);
