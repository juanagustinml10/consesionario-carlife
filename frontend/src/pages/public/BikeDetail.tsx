import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight as ChevronRightIcon, Link as LinkIcon } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';

import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { BikeCard } from '@/components/public/BikeCard';
import { useFavoritesStore } from '@/stores/favorites';
import { useCompareStore } from '@/stores/compare';
import { bikesService } from '@/services/bikes';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

export const BikeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bike, setBike] = useState<Bike | null>(null);
  const [related, setRelated] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

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
      await bikesService.trackVisit(data.id);
      setBike(data);
      setActiveImage(0);

      const all = await bikesService.list({ limit: 20 });
      setRelated(all.data.filter((b) => b.id !== data.id).slice(0, 3));
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
      <div className="container-jay py-20">
        <p className="text-jay-black/40">Cargando ficha de la moto...</p>
      </div>
    );
  }
  if (!bike) {
    return (
      <div className="container-jay py-20 text-center">
        <h2 className="text-2xl font-bold">Moto no encontrada</h2>
        <p className="mt-2 text-jay-black/50">
          La publicación buscada no existe o ya no está disponible.
        </p>
        <Link
          to="/motos"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black"
        >
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const primaryImage = bike.images.find((img) => img.isPrimary) ?? bike.images[0];
  const whatsappMessage = `Hola JAY MOTOS, me interesa la moto "${bike.title}" (${bike.year}, ${bike.condition === 'NUEVA' ? '0 km' : 'usada'}). ¿Podrían darme más información y confirmar disponibilidad?`;

  return (
    <div className="bg-jay-white">
      <section className="border-b border-jay-black/5">
        <div className="container-jay py-6">
          <nav className="flex items-center gap-1 text-xs text-jay-black/50">
            <Link to="/motos" className="hover:text-jay-red transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-jay-black">{bike.title}</span>
          </nav>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="container-jay">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Galería */}
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-video relative bg-jay-black/5 rounded-2xl overflow-hidden shadow-lg">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={bike.title}
                    className="h-full w-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <ImagePlaceholder width={900} height={600} label={`Foto de prueba: ${bike.title}`} />
                )}
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % bike.images.length)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur text-jay-black hover:bg-white transition-colors"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRightIcon size={20} />
                </button>
                <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
                  {bike.images.map((_img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        activeImage === idx
                          ? 'border-jay-red bg-jay-red'
                          : 'border-white/60 bg-white/80 hover:border-jay-black/30'
                      }`}
                      aria-label={`Imagen ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {bike.images.slice(0, 4).map((_img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? 'border-jay-red'
                        : 'border-transparent hover:border-jay-black/30'
                    }`}
                  >
                    {bike.images[idx].url ? (
                      <img src={bike.images[idx].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlaceholder width={200} height={200} label="" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Ficha */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {bike.condition === 'NUEVA' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase">
                      0 km
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase">
                      Usada
                    </span>
                  )}
                  {bike.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-jay-red text-jay-white text-[10px] font-bold uppercase border border-jay-red/30">
                      Destacada
                    </span>
                  )}
                </div>
                <span
                  className={[
                    'inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider',
                    bike.status === 'DISPONIBLE'
                      ? 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : bike.status === 'RESERVADA'
                        ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                        : 'bg-jay-red/10 text-jay-red border border-jay-red/30',
                  ].join(' ')}
                >
                  {bike.status === 'DISPONIBLE' ? 'Disponible' : bike.status === 'RESERVADA' ? 'Reservada' : 'Vendida'}
                </span>
                <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">
                  {bike.title}
                </h1>
                <p className="mt-1 text-lg text-jay-black/60">
                  {bike.brand?.name ?? ''} {bike.model} · {bike.year}{bike.displacementCc ? ` · ${bike.displacementCc} cc` : ''}
                </p>
              </div>

              <div className="bg-jay-black/5 p-6 rounded-xl border border-jay-black/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-3xl font-bold">
                    {bike.price.toLocaleString('es-AR')}
                  </span>
                  <span className="text-sm font-medium text-jay-black/60">{bike.currency}</span>
                </div>
                <p className="text-sm text-jay-black/50">
                  Precio lista publicado por JAY MOTOS. Consultar por financiación directamente en concesionaria.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WhatsAppButton
                  phone={import.meta.env.VITE_WHATSAPP_PHONE ?? ''}
                  message={whatsappMessage}
                  label="Consultar por WhatsApp"
                  className="w-full flex items-center justify-center gap-2 bg-jay-red text-white hover:bg-black"
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LinkIcon size={20} /> Compartir
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(bike.id)}
                  className="flex items-center gap-2 rounded-lg border border-jay-black/20 px-4 py-3 text-sm font-medium transition-colors hover:bg-jay-black/5"
                >
                  <Heart filled={isFavorite} />{' '}
                  {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </button>
                <button
                  onClick={() => addToCompare(bike)}
                  disabled={inCompare || !canCompare}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
                    inCompare
                      ? 'bg-jay-red border-jay-red text-white'
                      : 'border-jay-black/20 text-jay-black/70 hover:bg-jay-black/5'
                  )}
                >
                  <CompareIcon /> {inCompare ? 'En comparador' : 'Comparar'}
                </button>
              </div>

              {bike.description && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-jay-black/40 mb-3">
                    Detalles
                  </h3>
                  <p className="text-sm text-jay-black/60 leading-relaxed whitespace-pre-line">
                    {bike.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-jay-black/40 mb-3">
                  Características
                </h3>
                <ul className="grid grid-cols-2 gap-3 text-sm text-jay-black/60">
                  {(bike.features ?? []).map((f) => (
                    <li key={f.id} className="flex justify-between border-b border-jay-black/5 pb-1.5 last:border-0">
                      <span>{f.key}</span>
                      <span className="font-medium text-jay-black">{f.value}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-b border-jay-black/5 pb-1.5 last:border-0">
                    <span>Año</span>
                    <span className="font-medium text-jay-black">{bike.year}</span>
                  </li>
                  <li className="flex justify-between border-b border-jay-black/5 pb-1.5 last:border-0">
                    <span>Condición</span>
                    <span className="font-medium text-jay-black">
                      {bike.condition === 'NUEVA' ? '0 km' : 'Usada'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relacionadas */}
      <section className="py-20 border-t border-jay-black/5">
        <div className="container-jay">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl font-bold">Te puede interesar</h2>
            <Link to="/motos" className="text-sm font-medium text-jay-red hover:text-jay-black">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((b) => (
              <div key={b.id}>
                <BikeCard bike={b} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

function handleCopy() {
  navigator.clipboard.writeText(window.location.href);
  alert('Enlace copiado al portapapeles');
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-colors"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5 0-5.5-4.5-9.5-7-9.5-2.5 0-7 4-7 9.5 0 2.3 1.5 4.04 3 5.5" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4v12h-4z" />
      <path d="M3 16h4v4H3z" />
      <path d="M9 3h6v16H9z" />
    </svg>
  );
}
