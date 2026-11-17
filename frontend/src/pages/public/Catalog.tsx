import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

import { BikeCard } from '@/components/public/BikeCard';
import { bikesService, type BikeFilters } from '@/services/bikes';
import type { BikeCondition } from '@/types';
import type { Bike } from '@/types';
import { cn } from '@/lib/utils';

const CONDITIONS: { value: BikeCondition; label: string }[] = [
  { value: 'NUEVA', label: '0 km' },
  { value: 'USADA', label: 'Usada' },
];

export const Catalog: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BikeFilters>({ page: 1, limit: 12 });
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [openFilters, setOpenFilters] = useState(false);

  const query = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  useEffect(() => {
    const q = Object.fromEntries(query.entries());
    setFilters({
      page: Number(q.page) || 1,
      limit: Number(q.limit) || 12,
      ...(q.q ? { q: q.q } : {}),
      ...(q.brand ? { brand: q.brand } : {}),
      ...(q.model ? { model: q.model } : {}),
      ...(q.year ? { year: Number(q.year) } : {}),
      ...(q.condition ? { condition: q.condition as BikeCondition } : {}),
      ...(q.priceMin ? { priceMin: Number(q.priceMin) } : {}),
      ...(q.priceMax ? { priceMax: Number(q.priceMax) } : {}),
    });
  }, []);

  const fetchBikes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bikesService.list(filters);
      setBikes(response.data);
      setMeta(response.meta);
    } catch {
      setBikes([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  useEffect(() => {
    bikesService.listBrands().then((list) => setBrands(list.map((b) => ({ id: b.id, name: b.name })))).catch(() => {});
  }, []);

  const totalResults = meta?.total ?? 0;

  const setFilter = (key: string, value: string | number | boolean | undefined) => {
    setFilters((prev: BikeFilters) => {
      const next = { ...prev, [key]: value, page: 1 };
      if (value === undefined) {
        delete (next as Record<string, unknown>)[key];
      }
      return next;
    });
  };

  const hasActiveFilters = useMemo(() => {
    const keys: Array<keyof BikeFilters> = ['q', 'brand', 'model', 'year', 'condition', 'priceMin', 'priceMax', 'status', 'featured'];
    return keys.some((k) => filters[k] !== undefined && filters[k] !== null);
  }, [filters]);

  return (
    <div className="bg-jay-white">
      <section className="border-b border-jay-black/5 bg-jay-white">
        <div className="container-jay py-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold">Catálogo de motocicletas</h1>
              <p className="text-sm text-jay-black/60">
                {totalResults} motocicleta{totalResults !== 1 ? 's' : ''} disponible{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-jay-black/40" />
                <input
                  type="search"
                  placeholder="Marca, modelo, año..."
                  value={filters.q ?? ''}
                  onChange={(e) => setFilter('q', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-all"
                />
              </div>
              <button
                onClick={() => setFilters((prev: BikeFilters) => ({ ...prev, page: 1 }))}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-jay-black text-white font-medium hover:bg-jay-red transition-colors"
              >
                <Search size={18} /> Buscar
              </button>
              <button
                onClick={() => setOpenFilters(!openFilters)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-jay-black/20 px-5 py-3 font-medium text-jay-black/70 transition-colors hover:bg-jay-black/5 md:hidden"
                aria-expanded={openFilters}
                aria-controls="catalogo-filtros"
              >
                <SlidersHorizontal size={18} />
                <span>{openFilters ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
                <ChevronDown size={16} className={`text-jay-black/40 transition-transform ${openFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros: colapsable en móvil, fijo en escritorio */}
      <section className="border-b border-jay-black/5 bg-jay-white/30">
        <div className="container-jay">
          <div className="hidden py-6 md:block">
            <FilterBar filters={filters} setFilter={setFilter} brands={brands} conditions={CONDITIONS} />
          </div>
          <motion.div
            initial={false}
            animate={openFilters ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="overflow-hidden border-t border-jay-black/5 md:hidden"
          >
          <div id="catalogo-filtros" className="py-6 md:hidden">
              <FilterBar filters={filters} setFilter={setFilter} brands={brands} conditions={CONDITIONS} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resultados */}
      <section className="py-16">
        <div className="container-jay">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Resultados</h2>
              <p className="text-sm text-jay-black/50">
                {loading ? 'Cargando...' : `${totalResults} encontrada${totalResults !== 1 ? 's' : ''}`}
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters({ page: 1, limit: 12 });
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="text-xs font-medium text-jay-red underline underline-offset-4 hover:text-jay-black"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 text-jay-black/40">
                Cargando motos...
              </div>
            ) : bikes.length === 0 ? (
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-20">
                <p className="text-jay-black/60">No se encontraron motos con esos filtros.</p>
                <button
                  onClick={() => {
                    setFilters({ page: 1, limit: 12 });
                    window.history.replaceState({}, '', window.location.pathname);
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-jay-red hover:text-jay-black"
                >
                  <X size={16} /> Limpiar todo
                </button>
              </div>
            ) : (
              bikes.map((bike) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * bikes.indexOf(bike) }}
                >
                  <BikeCard bike={bike} />
                </motion.div>
              ))
            )}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilter('page', page)}
                  className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
                    page === filters.page
                      ? 'bg-jay-black text-white border-jay-black'
                      : 'bg-white text-jay-black/70 border-jay-black/20 hover:bg-jay-black/5'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface FilterBarProps {
  filters: BikeFilters;
  setFilter: (key: string, value: string | number | boolean | undefined) => void;
  brands: Array<{ id: string; name: string }>;
  conditions: { value: BikeCondition; label: string }[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilter,
  brands,
  conditions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
      <div className="md:col-span-3 space-y-2">
        <label className="text-xs font-semibold text-jay-black/60 uppercase tracking-wider">Marca</label>
        <select
          value={filters.brand ?? ''}
          onChange={(e) => setFilter('brand', e.target.value || undefined)}
          className="w-full py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-xs font-semibold text-jay-black/60 uppercase tracking-wider">Condición</label>
        <select
          value={filters.condition ?? ''}
          onChange={(e) => setFilter('condition', e.target.value || undefined)}
          className="w-full py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
        >
          <option value="">Todas</option>
          {conditions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-xs font-semibold text-jay-black/60 uppercase tracking-wider">Año</label>
        <select
          value={String(filters.year ?? '')}
          onChange={(e) => setFilter('year', e.target.value || undefined)}
          className="w-full py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
        >
          <option value="">Cualquier año</option>
          {[...Array(11).keys()].map((i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <label className="text-xs font-semibold text-jay-black/60 uppercase tracking-wider">Precio</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Desde"
            value={filters.priceMin ?? ''}
            onChange={(e) => setFilter('priceMin', e.target.value === '' ? undefined : Number(e.target.value))}
            className="py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
          />
          <input
            type="number"
            placeholder="Hasta"
            value={filters.priceMax ?? ''}
            onChange={(e) => setFilter('priceMax', e.target.value === '' ? undefined : Number(e.target.value))}
            className="py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
          />
        </div>
      </div>

      <div className="md:col-span-3 flex items-end gap-2">
        <button
          onClick={() => setFilter('featured', !filters.featured)}
          className={cn(
            'w-full py-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2',
            filters.featured
              ? 'bg-jay-red border-jay-red text-white'
              : 'border-jay-black/20 text-jay-black/70 hover:bg-jay-black/5'
          )}
        >
          <FlameIcon /> {filters.featured ? 'Ocultar destacadas' : 'Solo destacadas'}
        </button>
      </div>
    </div>
  );
};

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 10.5A2.5 2.5 0 0 1 11 8c0-1.1 1.3-2 2.5-2 2.5 0 2.5 3 0 5-1-2-3-4-3.5-5" />
    </svg>
  );
}
