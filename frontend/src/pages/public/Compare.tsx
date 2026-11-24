import * as React from 'react';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Scale } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { PageIntro } from '@/components/public/PageIntro';
import { EmptyState } from '@/components/shared/EmptyState';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { ConditionTag } from '@/components/public/BikeBadges';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { getThumbnailUrl } from '@/lib/images';
import { conditionLabel, formatDisplacement, formatMileage, formatPrice, statusLabel, usageLabel } from '@/lib/format';
import { useCompareStore } from '@/stores/compare';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

type AttrKey = 'brand' | 'model' | 'year' | 'condition' | 'usage' | 'displacementCc' | 'mileageKm' | 'price' | 'status';

const ATTRS: Array<{ key: AttrKey; label: string }> = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'condition', label: 'Categoría' },
  { key: 'usage', label: 'Uso' },
  { key: 'displacementCc', label: 'Motor' },
  { key: 'mileageKm', label: 'Kilometraje' },
  { key: 'price', label: 'Precio' },
  { key: 'status', label: 'Disponibilidad' },
];

const renderValue = (bike: Bike, key: AttrKey): string => {
  switch (key) {
    case 'price': return formatPrice(bike.price, bike.currency);
    case 'condition': return conditionLabel(bike.condition);
    case 'usage': return usageLabel(bike.usage);
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

  const whatsappMessage = useCallback(() => {
    const detalle = bikes
      .map((bike) => `${bike.title} (${bike.year}) — ${formatPrice(bike.price, bike.currency)}`)
      .join('\n');
    return `Hola CARLIFE! Me interesan estos vehículos:\n${detalle}`;
  }, [bikes]);

  if (bikes.length === 0) {
    return (
      <div className="container-cc flex min-h-[75vh] items-center py-12 sm:py-16">
        <EmptyState
          icon={<Scale size={30} strokeWidth={1.5} />}
          code="00"
          title={<>Comparador vacío</>}
          description="Agregá hasta dos vehículos desde el catálogo y compará año, motor, kilometraje y precio lado a lado."
          actions={
            <Link to="/motos" className="btn btn-dark px-7">
              Ir al catálogo <ChevronRight size={16} />
            </Link>
          }
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 text-cc-black">
      <PageIntro
        index="01"
        eyebrow="Decisión informada"
        title={<>Comparador</>}
        outline="VS"
        description={
          <p>
            {bikes.length} de 2 vehículos seleccionados. Compará sus datos principales lado a lado y consultanos
            por la unidad que te interese.
          </p>
        }
        actions={
          <button type="button" onClick={clear} className="btn btn-outline-dark w-full px-5 sm:w-auto">
            <X size={15} /> Limpiar selección
          </button>
        }
      />

      <section className="container-cc py-12 sm:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="data-num text-xs text-cc-gray">02</span>
          <span className="h-px w-10 bg-black/20" />
          <span className="eyebrow eyebrow-dark !gap-0 !before:hidden">Ficha comparativa</span>
        </div>

        <div className="panel-light relative overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-cc-paper">
                <th scope="col" className="sticky left-0 z-10 bg-white px-3 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-cc-gray sm:px-5">
                  Característica
                </th>
                {bikes.map((bike) => (
                  <th key={bike.id} scope="col" className="min-w-[260px] px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden border border-cc-paper bg-cc-soft">
                          {bike.images?.[0] ? (
                            <img src={getThumbnailUrl(bike.images[0].url)} alt="" className="photo h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <ImagePlaceholder width={160} height={112} className="h-full w-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-display text-base font-bold uppercase leading-tight tracking-tight text-cc-black">{bike.title}</p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-cc-gray">{bike.brand?.name ?? ''}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(bike.id)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/20 text-cc-gray transition-colors hover:border-black hover:text-black"
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
                  <tr key={attr.label} className={cn('border-b border-cc-paper last:border-0', index % 2 === 1 && 'bg-cc-soft')}>
                    <th scope="row" className={cn('sticky left-0 z-10 px-3 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-cc-gray sm:px-5', index % 2 === 1 ? 'bg-cc-soft' : 'bg-white')}>
                      {attr.label}
                    </th>
                    {values.map((value, valueIndex) => (
                      <td key={valueIndex} className="px-5 py-4">
                        <span className={cn('text-sm font-semibold text-cc-black/85', allEqual && 'text-cc-black/35')}>
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
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-cc-gray">Deslizá horizontalmente para ver todas las columnas en pantallas chicas.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {bikes.map((bike) => (
            <article key={bike.id} className="group card-vehicle">
              <div className="relative aspect-[16/10] bg-cc-soft">
                {bike.images?.[0] ? (
                  <img src={getThumbnailUrl(bike.images[0].url)} alt={bike.title} className="photo h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
                ) : (
                  <ImagePlaceholder width={640} height={400} label="Foto no disponible" className="h-full w-full" />
                )}
                <div className="absolute left-4 top-4">
                  <ConditionTag condition={bike.condition} overlay />
                </div>
              </div>
              <div className="border-t border-cc-paper p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cc-gray">{bike.brand?.name}</p>
                <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-cc-black">{bike.title}</h3>
                <p className="data-num mt-3 text-2xl text-cc-black">{formatPrice(bike.price, bike.currency)}</p>
                <Link to={`/motos/${bike.slug}`} className="mt-5 inline-flex items-center gap-1.5 border-b border-black/25 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black/65 transition-colors hover:border-black hover:text-black">
                  Ver ficha completa <ChevronRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-cc pb-4">
        <div className="relative overflow-hidden border border-cc-paper bg-cc-soft p-6 sm:p-9">
          <div className="pointer-events-none absolute inset-0 grid-lines-dark opacity-70" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="eyebrow eyebrow-dark">Siguiente paso</span>
              <p className="display-lg mt-5 text-cc-black">¿Ya te <span className="text-black/35">decidiste?</span></p>
              <p className="mt-3 text-sm text-cc-gray">Consultanos disponibilidad de estos vehículos por WhatsApp.</p>
            </div>
            <WhatsAppButton
              message={whatsappMessage()}
              label="Consultar por estos vehículos"
              size="lg"
              className="w-full px-7 sm:w-auto"
            />
          </div>
        </div>
        <Link to="/motos" className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cc-gray transition-colors hover:text-black">
          <ChevronLeft size={15} /> Volver al catálogo
        </Link>
      </section>
    </div>
  );
};
