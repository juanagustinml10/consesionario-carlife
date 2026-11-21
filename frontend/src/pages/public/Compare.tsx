import * as React from 'react';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Scale, MessageCircle } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { EmptyState } from '@/components/shared/EmptyState';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { ConditionTag } from '@/components/public/BikeBadges';
import { buildWhatsAppLink } from '@/lib/constants';
import { getThumbnailUrl } from '@/lib/images';
import { conditionLabel, formatDisplacement, formatMileage, formatPrice, statusLabel } from '@/lib/format';
import { useCompareStore } from '@/stores/compare';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

type AttrKey = 'brand' | 'model' | 'year' | 'condition' | 'displacementCc' | 'mileageKm' | 'price' | 'status';

const ATTRS: Array<{ key: AttrKey; label: string }> = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'condition', label: 'Categoría' },
  { key: 'displacementCc', label: 'Cilindrada' },
  { key: 'mileageKm', label: 'Kilometraje' },
  { key: 'price', label: 'Precio' },
  { key: 'status', label: 'Disponibilidad' },
];

const renderValue = (bike: Bike, key: AttrKey): string => {
  switch (key) {
    case 'price': return formatPrice(bike.price, bike.currency);
    case 'condition': return conditionLabel(bike.condition);
    case 'brand': return bike.brand?.name ?? '—';
    case 'displacementCc': return formatDisplacement(bike.displacementCc);
    case 'mileageKm': return formatMileage(bike.mileageKm);
    case 'status': return statusLabel(bike.status);
    default: return String(bike[key] ?? '—');
  }
};

export const Compare: React.FC = () => {
  const bikes = useCompareStore((state) => state.bikes);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const whatsappLink = useCallback(() => {
    const detalle = bikes
      .map((bike) => `${bike.title} (${bike.year}) — ${formatPrice(bike.price, bike.currency)}`)
      .join('\n');
    return buildWhatsAppLink(`Hola SF MOTOS! Me interesan estas motos:\n${detalle}`);
  }, [bikes]);

  if (bikes.length === 0) {
    return (
      <div className="container-sf flex min-h-[75vh] items-center py-12 sm:py-16">
        <EmptyState
          icon={<Scale size={30} />}
          code="00"
          title={<>Comparador <span className="text-sf-red">vacío</span></>}
          description="Agregá hasta dos motos desde el catálogo y compará año, cilindrada, kilometraje y precio lado a lado."
          actions={
            <Link to="/motos" className="btn btn-red px-7 py-4 text-xs">
              Ir al catálogo <ChevronRight size={16} />
            </Link>
          }
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sf-black pb-16 text-sf-white">
      {/* 01 / Encabezado */}
      <PageIntro
        index="01"
        eyebrow="Decisión informada"
        title={<>Comparador</>}
        outline="VS"
        description={
          <p>
            {bikes.length} de 2 motos seleccionadas. Compará sus datos principales lado a lado y consultanos
            por la unidad que te interese.
          </p>
        }
        actions={
          <button type="button" onClick={clear} className="btn btn-ghost w-full px-5 py-3 text-xs sm:w-auto">
            <X size={15} /> Limpiar selección
          </button>
        }
      />

      {/* 02 / Tabla comparativa */}
      <section className="container-sf py-12 sm:py-16">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-xs font-extrabold tracking-[0.2em] text-sf-red">02</span>
          <span className="h-px w-10 bg-sf-red" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">Ficha comparativa</span>
        </div>

        <div className="panel relative overflow-x-auto">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-sf-red" aria-hidden="true" />
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="sticky left-0 z-10 bg-sf-surface px-5 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                  Característica
                </th>
                {bikes.map((bike) => (
                  <th key={bike.id} scope="col" className="min-w-[220px] px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden border border-white/10 bg-black">
                          {bike.images?.[0] ? (
                            <img src={getThumbnailUrl(bike.images[0].url)} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <ImagePlaceholder width={160} height={112} className="h-full w-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-display text-base font-bold uppercase leading-tight text-white">{bike.title}</p>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-sf-red-soft">{bike.brand?.name ?? ''}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(bike.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 text-gray-400 transition-colors hover:border-sf-red hover:bg-sf-red/10 hover:text-white"
                        aria-label={`Quitar ${bike.title} del comparador`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATTRS.map((attr, index) => {
                const values = bikes.map((bike) => renderValue(bike, attr.key));
                const allEqual = values.every((value) => value === values[0]);
                return (
                  <tr key={attr.label} className={cn('border-b border-white/5 last:border-0', index % 2 === 1 && 'bg-white/[0.02]')}>
                    <th scope="row" className="sticky left-0 z-10 bg-sf-surface px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      {attr.label}
                    </th>
                    {values.map((value, valueIndex) => (
                      <td key={valueIndex} className="px-5 py-4">
                        <span className={cn('font-display text-base font-bold uppercase leading-tight text-white', allEqual && 'text-gray-400')}>
                          {value}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-600">Deslizá horizontalmente para ver todas las columnas en pantallas chicas.</p>

        {/* Tarjetas grandes */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {bikes.map((bike) => (
            <article key={bike.id} className="panel group overflow-hidden">
              <div className="relative aspect-[16/10] bg-black">
                {bike.images?.[0] ? (
                  <img src={getThumbnailUrl(bike.images[0].url)} alt={bike.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                ) : (
                  <ImagePlaceholder width={640} height={400} label="Foto no disponible" className="h-full w-full" />
                )}
                <div className="absolute left-4 top-4">
                  <ConditionTag condition={bike.condition} overlay />
                </div>
              </div>
              <div className="border-t border-white/8 p-5">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-sf-red-soft">{bike.brand?.name}</p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-white">{bike.title}</h3>
                <p className="mt-2 font-display text-xl font-extrabold text-white">{formatPrice(bike.price, bike.currency)}</p>
                <Link to={`/motos/${bike.slug}`} className="mt-4 inline-flex items-center gap-1.5 border-b border-white/20 pb-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-300 transition-colors hover:border-sf-red hover:text-white">
                  Ver ficha completa <ChevronRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 03 / Cierre */}
      <section className="container-sf">
        <div className="relative overflow-hidden border border-sf-red/25 bg-sf-surface p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[10rem] font-extrabold leading-none text-outline sm:text-[14rem]" aria-hidden="true">SF</div>
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="section-index">Siguiente paso</span>
              <p className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
                ¿Ya te <span className="text-sf-red">decidiste?</span>
              </p>
              <p className="mt-2 text-sm text-gray-400">Consultanos disponibilidad de estas motos por WhatsApp.</p>
            </div>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-red w-full px-7 py-4 text-sm lg:w-auto">
              <MessageCircle size={18} /> Consultar por estas motos
            </a>
          </div>
        </div>
        <Link to="/motos" className="mt-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white">
          <ChevronLeft size={15} /> Volver al catálogo
        </Link>
      </section>
    </div>
  );
};
