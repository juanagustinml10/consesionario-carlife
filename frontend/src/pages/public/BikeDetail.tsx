import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronRight,
  Phone,
  Share2,
  Heart,
  Scale,
  Fuel,
  Gauge,
  Calendar,
  Tag,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { BikeCard } from '@/components/public/BikeCard';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';
import { buildWhatsAppLink, BUSINESS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const BikeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bike, setBike] = useState<Bike | null>(null);
  const [related, setRelated] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const bikeId = bike?.id ?? slug ?? '';
  const isFavorite = useFavoritesStore((state) => state.isFavorite(bikeId));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);
  const addToCompare = useCompareStore((state) => state.add);
  const inCompare = useCompareStore((state) => state.isInCompare(bikeId));
  const canCompare = useCompareStore((state) => state.canAdd());

  const loadBike = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await bikesService.getBySlug(slug);
      bikesService.trackVisit(data.id).catch(() => {});
      setBike(data);
      setActiveImage(0);

      const all = await bikesService.list({ limit: 8 });
      setRelated(all.data.filter((b) => b.id !== data.id).slice(0, 4));
    } catch {
      setBike(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadBike();
  }, [loadBike]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-jay-black text-gray-500">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-jay-red" />
          <p className="mt-4 text-sm uppercase tracking-widest">Cargando ficha...</p>
        </div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-jay-black text-center">
        <p className="font-display text-6xl font-extrabold uppercase text-white/10">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase text-white">Moto no encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">La publicación buscada no existe o ya no está disponible.</p>
        <Link to="/motos" className="btn btn-red mt-6 px-6 py-3 text-xs">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const images = bike.images.length > 0 ? bike.images : [];
  const currentImage = images[activeImage] ?? images[0];
  const whatsappMessage = `Hola! Estoy interesado en la ${bike.brand?.name ?? ''} ${bike.title} que vi publicada en JAY MOTOS. ¿Me podrían brindar más información?`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: bike.title, text: whatsappMessage, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // compartir cancelado
    }
  };

  return (
    <div className="min-h-screen bg-jay-black pb-16 text-jay-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container-jay flex h-12 items-center gap-2 overflow-x-auto text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          <Link to="/motos" className="shrink-0 transition-colors hover:text-white">Catálogo</Link>
          <span className="text-gray-700">/</span>
          <span className="shrink-0 text-gray-300">{bike.brand?.name ?? 'Moto'}</span>
          <span className="text-gray-700">/</span>
          <span className="truncate text-white">{bike.title}</span>
        </div>
      </div>

      <div className="container-jay grid gap-8 py-8 lg:grid-cols-12 lg:gap-10 lg:py-12">
        {/* ===== Galería ===== */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-black">
            <div className="aspect-[4/3] sm:aspect-[16/11]">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={bike.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlaceholder width={1200} height={900} label="Foto de prueba de la moto" className="h-full w-full" />
              )}
            </div>
            <button
              onClick={() => setActiveImage((i) => (i + 1) % images.length)}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-jay-red"
              aria-label="Siguiente fotografía"
            >
              <ChevronRight size={22} />
            </button>
            <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
              {activeImage + 1} / {images.length || 1}
            </span>
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Fotografía ${i + 1}`}
                  aria-current={i === activeImage ? 'true' : undefined}
                  className={cn(
                    'h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition-all',
                    i === activeImage ? 'border-jay-red opacity-100' : 'border-white/10 opacity-50 hover:opacity-80'
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Acciones secundarias */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toggleFavorite(bike.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all',
                isFavorite ? 'border-jay-red bg-jay-red/15 text-jay-red-soft' : 'border-white/10 text-gray-300 hover:border-white/25 hover:text-white'
              )}
            >
              <Heart size={16} className={isFavorite ? 'fill-jay-red text-jay-red' : ''} />
              {isFavorite ? 'En favoritos' : 'Guardar'}
            </button>
            <button
              onClick={() => addToCompare(bike)}
              disabled={inCompare || !canCompare}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40',
                inCompare ? 'border-jay-red bg-jay-red text-white' : 'border-white/10 text-gray-300 hover:border-white/25 hover:text-white'
              )}
            >
              <Scale size={16} />
              {inCompare ? 'En comparador' : 'Comparar'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 transition-all hover:border-white/25 hover:text-white"
            >
              <Share2 size={16} />
              {copied ? '¡Copiado!' : 'Compartir'}
            </button>
          </div>
        </div>

        {/* ===== Ficha ===== */}
        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'rounded-md px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.25em]',
              bike.condition === 'NUEVA' ? 'bg-jay-red text-white' : 'bg-white/90 text-black'
            )}>
              {bike.condition === 'NUEVA' ? '0 km' : 'Usada'}
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-300">
              <span className={cn(
                'h-1.5 w-1.5 rounded-full',
                bike.status === 'DISPONIBLE' ? 'bg-green-400 animate-pulse' : bike.status === 'RESERVADA' ? 'bg-amber-400' : 'bg-jay-red'
              )} />
              {bike.status === 'DISPONIBLE' ? 'Disponible' : bike.status === 'RESERVADA' ? 'Reservada' : 'Vendida'}
            </span>
            {bike.featured && (
              <span className="rounded-md border border-jay-red/40 bg-jay-red/10 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-jay-red-soft">
                Destacada
              </span>
            )}
          </div>

          <p className="mt-5 font-display text-xs font-bold uppercase tracking-[0.3em] text-jay-red-soft">
            {bike.brand?.name ?? 'JAY MOTOS'}
          </p>
          <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
            {bike.model || bike.title}
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            {bike.title}
          </p>

          {/* Precio */}
          <div className="mt-6 border-y border-white/8 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Precio final</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-6xl font-extrabold leading-none text-white">
                {bike.price.toLocaleString('es-AR')}
              </span>
              <span className="font-display text-xl font-bold text-jay-red-soft">{bike.currency}</span>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">Precio de lista publicado por la concesionaria. Consultá por las opciones de financiación disponibles.</p>
          </div>

          {/* Consulta WhatsApp */}
          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-red mt-6 flex w-full items-center justify-center gap-2 py-4 text-sm"
          >
            <Phone size={20} />
            Consultar disponibilidad
          </a>
          <p className="mt-2 text-center text-[11px] text-gray-500">Te esperamos en {BUSINESS.address}</p>

          {/* Especificaciones */}
          <div className="mt-7">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Especificaciones</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { icon: <Calendar size={17} />, label: 'Año', value: String(bike.year) },
                { icon: <Gauge size={17} />, label: 'Cilindrada', value: bike.displacementCc ? `${bike.displacementCc} cc` : '—' },
                { icon: <Fuel size={17} />, label: 'Kilómetros', value: bike.mileageKm != null ? `${bike.mileageKm.toLocaleString('es-AR')} km` : '0 km' },
                { icon: <Tag size={17} />, label: 'Condición', value: bike.condition === 'NUEVA' ? 'Nueva' : 'Usada' },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl border border-white/8 bg-jay-surface p-3">
                  <div className="text-jay-red-soft">{spec.icon}</div>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">{spec.label}</p>
                  <p className="mt-0.5 font-display text-base font-bold text-white">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          {bike.description && (
            <div className="mt-7">
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Descripción</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-300">{bike.description}</p>
            </div>
          )}

          {/* Garantía */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-jay-red/20 bg-jay-red/5 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-jay-red" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Compra con respaldo</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Motos 0 km y usadas seleccionadas por la concesionaria. Compra con respaldo directo de JAY MOTOS.
              </p>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-600">
            <Clock size={12} /> Publicada el {new Date(bike.createdAt).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>

      {/* Relacionadas */}
      {related.length > 0 && (
        <div className="border-t border-white/5">
          <div className="container-jay py-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">También te puede interesar</span>
                <h2 className="mt-1 font-display text-3xl font-extrabold uppercase italic text-white sm:text-4xl">
                  Similares<span className="text-jay-red">.</span>
                </h2>
              </div>
              <Link to="/motos" className="hidden items-center gap-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white sm:inline-flex">
                Ver catálogo <ChevronRight size={14} />
              </Link>
            </div>
            <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {related.map((b) => (
                <div key={b.id} className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-72 lg:w-auto lg:max-w-none">
                  <BikeCard bike={b} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
