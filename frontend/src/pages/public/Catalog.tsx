import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, BadgeCheck, Frown } from 'lucide-react';
import { BikeCard } from '@/components/public/BikeCard';
import { bikesService, type BikeFilters } from '@/services/bikes';
import type { Bike, BikeCondition } from '@/types';
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
      ...(q.featured ? { featured: true } : {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    bikesService
      .listBrands()
      .then((list) => setBrands(list.map((b) => ({ id: b.id, name: b.name }))))
      .catch(() => {});
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

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    window.history.replaceState({}, '', window.location.pathname);
  };

  const hasActiveFilters = useMemo(() => {
    const keys: Array<keyof BikeFilters> = ['q', 'brand', 'model', 'year', 'condition', 'priceMin', 'priceMax', 'status', 'featured'];
    return keys.some((k) => filters[k] !== undefined && filters[k] !== null);
  }, [filters]);

  const filterPanel = (
    <div className="rounded-2xl border border-white/8 bg-jay-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          <SlidersHorizontal size={14} className="text-jay-red" />
          Filtros
        </span>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-jay-red-soft transition-colors hover:text-white">
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
        {/* Marca */}
        <div className="col-span-2 space-y-1.5 md:col-span-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500" htmlFor="f-marca">Marca</label>
          <select
            id="f-marca"
            value={filters.brand ?? ''}
            onChange={(e) => setFilter('brand', e.target.value || undefined)}
            className="w-full rounded-xl border border-white/10 bg-jay-elevated px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-jay-red"
          >
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Condición */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500" htmlFor="f-cond">Condición</label>
          <select
            id="f-cond"
            value={filters.condition ?? ''}
            onChange={(e) => setFilter('condition', e.target.value || undefined)}
            className="w-full rounded-xl border border-white/10 bg-jay-elevated px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-jay-red"
          >
            <option value="">Todas</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500" htmlFor="f-year">Año</label>
          <select
            id="f-year"
            value={String(filters.year ?? '')}
            onChange={(e) => setFilter('year', e.target.value || undefined)}
            className="w-full rounded-xl border border-white/10 bg-jay-elevated px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-jay-red"
          >
            <option value="">Cualquiera</option>
            {[...Array(12).keys()].map((i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        {/* Precio */}
        <div className="col-span-2 space-y-1.5 md:col-span-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Precio</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Desde"
              aria-label="Precio mínimo"
              value={filters.priceMin ?? ''}
              onChange={(e) => setFilter('priceMin', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-jay-elevated px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red"
            />
            <input
              type="number"
              placeholder="Hasta"
              aria-label="Precio máximo"
              value={filters.priceMax ?? ''}
              onChange={(e) => setFilter('priceMax', e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-jay-elevated px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red"
            />
          </div>
        </div>

        {/* Destacadas */}
        <div className="col-span-2 flex items-end md:col-span-2">
          <button
            onClick={() => setFilter('featured', !filters.featured)}
            aria-pressed={!!filters.featured}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.2em] transition-all',
              filters.featured
                ? 'border-jay-red bg-jay-red text-white'
                : 'border-white/10 text-gray-300 hover:border-jay-red hover:text-white'
            )}
          >
            <BadgeCheck size={15} />
            Destacadas
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-jay-black text-jay-white">
      {/* Header del catálogo */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-96 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(227,38,54,0.14),transparent)]" aria-hidden="true" />
        <div className="container-jay relative py-10 sm:py-14">
          <span className="eyebrow">Catálogo completo</span>
          <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-7xl">
            Encontrá<br />tu <span className="text-jay-red">próxima moto.</span>
          </h1>
          <p className="mt-4 text-sm text-gray-400">
            {loading ? 'Buscando...' : `${totalResults} moto${totalResults !== 1 ? 's' : ''} disponible${totalResults !== 1 ? 's' : ''}`}
          </p>

          {/* Buscador */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                placeholder="Marca, modelo, año, cilindrada..."
                aria-label="Buscar motocicletas"
                value={filters.q ?? ''}
                onChange={(e) => setFilter('q', e.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-jay-surface pl-12 pr-4 text-base text-white outline-none transition-colors placeholder:text-gray-600 focus:border-jay-red"
              />
            </div>
            <button
              onClick={() => setOpenFilters(!openFilters)}
              aria-expanded={openFilters}
              aria-controls="filtros-catalogo"
              className="btn btn-ghost h-14 px-6 text-xs md:hidden"
            >
              <SlidersHorizontal size={18} />
              {openFilters ? 'Ocultar' : 'Filtros'}
              <ChevronDown size={15} className={cn('transition-transform', openFilters && 'rotate-180')} />
            </button>
          </div>

          {/* Panel de filtros */}
          <div id="filtros-catalogo" className="mt-4">
            <div className="hidden md:block">{filterPanel}</div>
            <motion.div
              initial={false}
              animate={openFilters ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              {filterPanel}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="container-jay py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-jay-surface" />
            ))
          ) : bikes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
              <Frown size={36} className="text-gray-600" />
              <div>
                <p className="font-display text-2xl font-bold uppercase text-white">Sin resultados</p>
                <p className="mt-1 text-sm text-gray-500">Ninguna moto coincide con tu búsqueda. Probá con otros filtros.</p>
              </div>
              <button onClick={clearFilters} className="btn btn-red px-6 py-3 text-xs">
                <X size={15} /> Limpiar filtros
              </button>
            </div>
          ) : (
            bikes.map((bike) => <BikeCard key={bike.id} bike={bike} />)
          )}
        </div>

        {/* Paginación */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setFilter('page', page)}
                aria-current={page === filters.page ? 'page' : undefined}
                className={cn(
                  'h-11 w-11 rounded-xl font-display text-sm font-bold transition-all',
                  page === filters.page
                    ? 'bg-jay-red text-white shadow-red'
                    : 'border border-white/10 text-gray-400 hover:border-jay-red hover:text-white'
                )}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
