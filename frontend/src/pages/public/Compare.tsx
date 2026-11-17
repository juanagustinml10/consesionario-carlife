import * as React from 'react';
import { useCallback } from 'react';
import { ChevronRight, X, Scale, ShieldCheck, Truck } from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { BUSINESS } from '@/lib/constants';
import { useCompareStore } from '@/stores/compare';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

type AttrKey = 'brand' | 'model' | 'year' | 'condition' | 'displacementCc' | 'mileageKm' | 'price' | 'status';

const ATTRS: Array<{ key: AttrKey; label: string }> = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'condition', label: 'Condición' },
  { key: 'displacementCc', label: 'Cilindrada' },
  { key: 'mileageKm', label: 'Kilometraje' },
  { key: 'price', label: 'Precio' },
  { key: 'status', label: 'Disponibilidad' },
];

const renderValue = (bike: Bike, key: AttrKey): string => {
  switch (key) {
    case 'price':
      return `$${bike.price.toLocaleString('es-AR')} ${bike.currency}`;
    case 'condition':
      return bike.condition === 'NUEVA' ? '0 km' : 'Usada';
    case 'brand':
      return bike.brand?.name ?? '—';
    case 'displacementCc':
      return bike.displacementCc ? `${bike.displacementCc} cc` : '—';
    case 'mileageKm':
      return bike.mileageKm != null ? `${bike.mileageKm.toLocaleString('es-AR')} km` : '0 km';
    case 'status':
      return bike.status === 'DISPONIBLE' ? 'Disponible' : bike.status === 'RESERVADA' ? 'Reservada' : 'Vendida';
    default:
      return String(bike[key] ?? '—');
  }
};

export const Compare: React.FC = () => {
  const bikes = useCompareStore((state) => state.bikes);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const handleWhatsApp = useCallback(() => {
    const phones = BUSINESS.whatsappNumber;
    const text = bikes
      .map((b) => `${b.title} (${b.year}) - $${b.price.toLocaleString('es-AR')} ${b.currency}`)
      .join('%0A');
    window.open(`https://wa.me/${phones}?text=Hola%20JAY%20MOTOS,%20me%20interesan%20estas%20motos:%0A${text}`, '_blank');
  }, [bikes]);

  if (bikes.length === 0) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-jay-black px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-jay-red/30 bg-jay-red/10">
          <Scale size={34} className="text-jay-red" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
          Comparador<br /><span className="text-jay-red">vacío.</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
          Agregá dos motos desde el catálogo y compará año, cilindrada, kilometraje y precio lado a lado.
        </p>
        <Link to="/motos" className="btn btn-red mt-8 px-7 py-4 text-xs">
          Ir al catálogo <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jay-black pb-16 text-jay-white">
      {/* Header */}
      <section className="border-b border-white/5 bg-jay-panel">
        <div className="container-jay flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="eyebrow">Decisión informada</span>
            <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-[0.9] text-white sm:text-5xl">
              Comparador<span className="text-jay-red">.</span>
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {bikes.length} de 2 motos seleccionadas
            </p>
          </div>
          <button
            onClick={clear}
            className="btn btn-ghost px-5 py-3 text-xs"
          >
            <X size={15} />
            Limpiar selección
          </button>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="container-jay py-8">
        <div className="overflow-x-auto rounded-2xl border border-white/8 bg-jay-surface">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">Característica</th>
                {bikes.map((bike) => (
                  <th key={bike.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-bold uppercase leading-tight text-white">{bike.title}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-jay-red-soft">{bike.brand?.name ?? ''}</p>
                      </div>
                      <button
                        onClick={() => remove(bike.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:border-jay-red hover:text-white"
                        aria-label="Quitar del comparador"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATTRS.map((attr, i) => {
                const values = bikes.map((b) => renderValue(b, attr.key));
                const allEqual = values.every((v) => v === values[0]);
                return (
                  <tr key={attr.label} className={cn('border-b border-white/5 last:border-0', i % 2 === 1 && 'bg-white/[0.02]')}>
                    <td className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      {attr.label}
                    </td>
                    {values.map((value, i2) => (
                      <td key={i2} className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-display text-base font-bold uppercase leading-tight text-white', allEqual && 'text-gray-400')}>
                            {value}
                          </span>
                          {allEqual && i2 === 0 && <ShieldCheck size={13} className="text-green-400" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tarjetas grandes */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {bikes.map((bike) => (
            <div key={bike.id} className="card-surface overflow-hidden">
              <div className="aspect-[16/10] bg-black">
                {bike.images[0] ? (
                  <img src={bike.images[0].url} alt={bike.title} className="h-full w-full object-cover" />
                ) : (
                  <ImagePlaceholder width={640} height={400} label="Foto de prueba de la moto" className="h-full w-full" />
                )}
              </div>
              <div className="p-5">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.25em] text-jay-red-soft">{bike.brand?.name}</p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-white">{bike.title}</h3>
                <p className="mt-2 font-display text-xl font-extrabold text-white">
                  ${bike.price.toLocaleString('es-AR')} <span className="text-xs text-gray-500">{bike.currency}</span>
                </p>
                <Link to={`/motos/${bike.slug}`} className="mt-4 inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-jay-red-soft hover:text-white">
                  Ver ficha completa <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-jay">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-jay-red/25 bg-gradient-to-r from-jay-red/15 via-jay-surface to-jay-surface p-6 sm:flex-row sm:p-8">
          <div className="text-center sm:text-left">
            <p className="font-display text-2xl font-extrabold uppercase leading-none text-white sm:text-3xl">¿Ya te decidiste?</p>
            <p className="mt-1.5 text-sm text-gray-400">Consultanos disponibilidad de estas motos por WhatsApp.</p>
          </div>
          <button onClick={handleWhatsApp} className="btn btn-red w-full px-7 py-4 text-sm sm:w-auto">
            <Truck size={18} />
            Consultar por estas motos
          </button>
        </div>
      </section>
    </div>
  );
};
