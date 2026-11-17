import * as React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder';
import { useCompareStore } from '@/stores/compare';
import type { Bike } from '@/types';

const ATTRS: Array<{ key: keyof Bike; label: string }> = [
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' },
  { key: 'condition', label: 'Condición' },
  { key: 'displacementCc', label: 'Cilindrada' },
  { key: 'price', label: 'Precio' },
  { key: 'status', label: 'Disponibilidad' },
];

export const Compare: React.FC = () => {
  const navigate = useNavigate();
  const bikes = useCompareStore((state) => state.bikes);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const handleWhatsApp = useCallback(() => {
    const phones = import.meta.env.VITE_WHATSAPP_PHONE ?? '';
    const text = bikes
      .map((b) => `${b.title} (${b.year}) - $${b.price.toLocaleString()}`)
      .join('%0A');
    const message = `Hola JAY MOTOS, me gustaría comparar estas motos:%0A${text}`;
    window.open(`https://wa.me/${phones}?text=${message}`, '_blank');
  }, [bikes]);

  if (bikes.length === 0) {
    return (
      <div className="bg-jay-white py-24">
        <div className="container-jay text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-jay-black/5 mb-6"
          >
            <X size={32} className="text-jay-black/40" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold mb-4">Comparador vacío</h2>
          <p className="text-jay-black/60 mb-10 max-w-md mx-auto">
            Agregá hasta dos motocicletas desde el catálogo para comparar sus características y precios lado a lado.
          </p>
          <Link
            to="/motos"
            className="inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black transition-colors"
          >
            Ir al catálogo <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jay-white">
      <section className="border-b border-jay-black/5 bg-jay-white">
        <div className="container-jay py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold">Comparador de motos</h1>
              <p className="text-sm text-jay-black/50">{bikes.length} de 2 seleccionadas</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleWhatsApp} className="flex-1 sm:flex-none">
                <Truck size={16} className="mr-2" />
                Consultar por estas motos
              </Button>
              <Button variant="outline" onClick={clear} size="sm" className="flex-1 sm:flex-none">
                Limpiar todo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-jay">
          <div className="overflow-x-auto border border-jay-black/10 rounded-xl bg-jay-white shadow-sm">
            <table className="w-full min-w-[620px] text-left border-collapse">
              <thead>
                <tr className="border-b border-jay-black/10 bg-jay-black/5">
                  <th className="py-5 px-6 text-sm font-semibold text-jay-black/50 uppercase tracking-wider">Característica</th>
                  {bikes.map((bike) => (
                    <th key={bike.id} className="py-5 px-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => remove(bike.id)}
                          className="h-6 w-6 rounded-full border border-jay-black/20 bg-jay-white text-[10px] font-bold text-jay-black hover:bg-jay-black/5 transition-colors"
                          aria-label="Quitar del comparador"
                        >
                          ✕
                        </button>
                        <div className="truncate max-w-[160px] font-bold text-jay-black">
                          {bike.title}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATTRS.map((attr) => {
                  const values = bikes.map((b) => {
                    const v = b[attr.key];
                    if (v === null || v === undefined) return '—';
                    if (attr.key === 'price') return `$${v.toLocaleString('es-AR')} ${b.currency}`;
                    if (attr.key === 'condition') return v === 'NUEVA' ? '0 km' : 'Usada';
                    if (attr.key === 'brand') return (b as any).brand?.name ?? v;
                    return String(v);
                  });
                  const allEqual = values.every((v) => v === values[0]);
                  return (
                    <tr key={attr.label} className="border-b border-jay-black/5 group hover:bg-jay-black/3 transition-colors">
                      <td className="py-5 px-6 text-sm font-medium text-jay-black/70">
                        {attr.label}
                      </td>
                      {values.map((value, i) => (
                        <td key={i} className="py-5 px-6 text-center text-sm text-jay-black/60">
                          <div className="flex items-center justify-center gap-2">
                            <span className={cn('font-medium', allEqual ? 'text-jay-black/50' : 'font-semibold text-jay-black')}>
                              {value}
                            </span>
                            {allEqual && (
                              <span className="text-[10px] text-green-600 flex items-center gap-1">
                                <ShieldCheck size={12} /> Igual
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bikes.map((bike) => (
              <div key={bike.id} className="flex flex-col gap-4">
                <div className="aspect-video bg-jay-black/5 rounded-xl overflow-hidden">
                  <ImagePlaceholder width={500} height={350} label={`Foto de prueba: ${bike.title}`} />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{bike.title}</h3>
                    <p className="text-sm text-jay-black/50">
                      {bike.brand?.name ?? ''} {bike.model} · {bike.year}
                    </p>
                  </div>
                  <span className="text-right">
                    {bike.price.toLocaleString('es-AR')} {bike.currency}
                  </span>
                </div>
                <p className="text-sm text-jay-black/60 line-clamp-3">
                  {bike.description ?? 'Sin descripción disponible.'}
                </p>
                <Link
                  to={`/motos/${bike.slug}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black transition-colors"
                >
                  Ver ficha <ChevronRightIcon size={16} />
                </Link>
              </div>
            ))}
          </div>

          {bikes.length > 0 && (
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="red" onClick={handleWhatsApp} className="flex-1">
                <Truck size={20} /> Consultar por estas motos
              </Button>
              <Button variant="outline" onClick={() => navigate('/motos')} className="flex-1">
                Volver al catálogo
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};


