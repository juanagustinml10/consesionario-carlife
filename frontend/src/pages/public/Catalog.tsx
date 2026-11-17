import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  SearchX,
} from 'lucide-react';
import { BikeCard } from '@/components/public/BikeCard';
import { PageIntro } from '@/components/public/PageIntro';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { bikesService, type BikeFilters } from '@/services/bikes';
import type { Bike, BikeCondition, BikeStatus } from '@/types';
import { cn } from '@/lib/utils';

const CONDITIONS: { value: BikeCondition; label: string }[] = [
  { value: 'NUEVA', label: '0 km' },
  { value: 'USADA', label: 'Usada' },
];

const STATUSES: { value: BikeStatus; label: string }[] = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'RESERVADA', label: 'Reservada' },
  { value: 'VENDIDA', label: 'Vendida' },
];

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'anio-desc' | 'anio-asc' | 'marca-asc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'anio-desc', label: 'Año: más nuevo' },
  { value: 'anio-asc', label: 'Año: más antiguo' },
  { value: 'marca-asc', label: 'Marca A–Z' },
];

const PAGE_SIZE = 12;
const FETCH_LIMIT = 100;

const sortBikes = (items: Bike[], key: SortKey): Bike[] => {
  const sorted = [...items];
  switch (key) {
    case 'precio-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'precio-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'anio-desc': return sorted.sort((a, b) => b.year - a.year);
    case 'anio-asc': return sorted.sort((a, b) => a.year - b.year);
    case 'marca-asc': return sorted.sort((a, b) => (a.brand?.name ?? '').localeCompare(b.brand?.name ?? '', 'es'));
    default: return sorted; // relevancia: orden del servidor (destacadas y más recientes primero)
  }
};

const isSortKey = (value: string | null): value is SortKey =>
  SORT_OPTIONS.some((option) => option.value === value);

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // La URL es la fuente de verdad: los links del navbar y el historial funcionan
  // incluso cuando ya estamos en /motos (antes el useEffect inicial no se repetía).
  const filters = useMemo<BikeFilters>(() => {
    const value = (key: string) => searchParams.get(key) ?? undefined;
    const q = value('q');
    const brand = value('brand');
    const condition = value('condition');
    const status = value('status');
    const year = Number(value('year'));
    const priceMin = Number(value('priceMin'));
    const priceMax = Number(value('priceMax'));
    return {
      ...(q ? { q } : {}),
      ...(brand ? { brand } : {}),
      ...(condition === 'NUEVA' || condition === 'USADA' ? { condition } : {}),
      ...(status === 'DISPONIBLE' || status === 'RESERVADA' || status === 'VENDIDA' ? { status } : {}),
      ...(value('year') && Number.isInteger(year) ? { year } : {}),
      ...(value('priceMin') && Number.isFinite(priceMin) ? { priceMin } : {}),
      ...(value('priceMax') && Number.isFinite(priceMax) ? { priceMax } : {}),
      ...(searchParams.get('featured') === 'true' ? { featured: true } : {}),
    };
  }, [searchParams]);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sortParam = searchParams.get('sort');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'relevancia';

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void, resetPage = true) => {
      const next = new URLSearchParams(searchParams);
      mutate(next);
      if (resetPage) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const setFilter = (key: string, value?: string | number | boolean) => {
    updateParams((params) => {
      if (value === undefined || value === '' || value === false) params.delete(key);
      else params.set(key, String(value));
    });
  };

  const clearFilters = () => setSearchParams(new URLSearchParams(), { replace: true });

  const goToPage = (nextPage: number) => {
    if (nextPage === page) return;
    updateParams((params) => params.set('page', String(nextPage)), false);
    document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setSearchInput(filters.q ?? '');
  }, [filters.q]);

  // Búsqueda con debounce para no disparar una request por tecla.
  useEffect(() => {
    const query = searchInput.trim();
    if (query === (filters.q ?? '')) return;
    const timer = window.setTimeout(() => setFilter('q', query || undefined), 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    bikesService
      // Traemos el conjunto filtrado completo (máx. 100) para que el orden sea global.
      .list({ ...filters, page: 1, limit: FETCH_LIMIT })
      .then(({ data }) => {
        if (cancelled) return;
        const sorted = sortBikes(data, sort);
        const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
        if (page > pages) {
          updateParams((params) => params.set('page', String(pages)), false);
          return;
        }
        setBikes(sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
        setTotal(sorted.length);
        setTotalPages(pages);
      })
      .catch(() => {
        if (cancelled) return;
        setBikes([]);
        setTotal(0);
        setTotalPages(1);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page, reloadKey]);

  useEffect(() => {
    bikesService
      .listBrands()
      .then((list) => setBrands(list.map((b) => ({ id: b.id, name: b.name }))))
      .catch(() => {});
  }, []);

  const hasActiveFilters = useMemo(() => {
    const keys: Array<keyof BikeFilters> = ['q', 'brand', 'model', 'year', 'condition', 'priceMin', 'priceMax', 'status', 'featured'];
    return keys.some((key) => filters[key] !== undefined && filters[key] !== null);
  }, [filters]);

  const renderFilterPanel = (prefix: string) => (
    <div className="panel relative p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-jay-red" aria-hidden="true" />
      <div className="mb-5 flex items-center justify-between border-b border-white/8 pb-4">
        <span className="flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-[0.22em] text-white">
          <SlidersHorizontal size={15} className="text-jay-red" />
          Filtros
        </span>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-widest text-jay-red-soft transition-colors hover:text-white">
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-12">
        <div className="col-span-2 space-y-2 md:col-span-3">
          <label className="field-label" htmlFor={`${prefix}-marca`}>Marca</label>
          <select id={`${prefix}-marca`} value={filters.brand ?? ''} onChange={(e) => setFilter('brand', e.target.value || undefined)} className="field">
            <option value="">Todas</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-categoria`}>Categoría</label>
          <select id={`${prefix}-categoria`} value={filters.condition ?? ''} onChange={(e) => setFilter('condition', e.target.value || undefined)} className="field">
            <option value="">Todas</option>
            {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-estado`}>Estado</label>
          <select id={`${prefix}-estado`} value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value || undefined)} className="field">
            <option value="">Todos</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="col-span-2 space-y-2 md:col-span-3">
          <label className="field-label" htmlFor={`${prefix}-precio-min`}>Precio</label>
          <div className="grid grid-cols-2 gap-2">
            <input id={`${prefix}-precio-min`} type="number" min={0} placeholder="Desde" aria-label="Precio mínimo" value={filters.priceMin ?? ''} onChange={(e) => setFilter('priceMin', e.target.value === '' ? undefined : Number(e.target.value))} className="field" />
            <input type="number" min={0} placeholder="Hasta" aria-label="Precio máximo" value={filters.priceMax ?? ''} onChange={(e) => setFilter('priceMax', e.target.value === '' ? undefined : Number(e.target.value))} className="field" />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-anio`}>Año</label>
          <select id={`${prefix}-anio`} value={filters.year ?? ''} onChange={(e) => setFilter('year', e.target.value || undefined)} className="field">
            <option value="">Cualquiera</option>
            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex items-end md:col-span-12 md:w-64">
          <button
            type="button"
            onClick={() => setFilter('featured', !filters.featured)}
            aria-pressed={!!filters.featured}
            className={cn(
              'flex h-12 w-full items-center justify-center gap-2 border font-display text-xs font-extrabold uppercase tracking-[0.2em] transition-colors',
              filters.featured
                ? 'border-jay-red bg-jay-red text-white'
                : 'border-white/15 text-gray-300 hover:border-jay-red hover:text-white'
            )}
          >
            <BadgeCheck size={16} />
            Solo destacadas
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-jay-black text-jay-white">
      <PageIntro
        index="01"
        eyebrow="Inventario JAY MOTOS"
        title={<>Encontrá<br />tu <span className="text-jay-red">próxima moto.</span></>}
        outline="MOTOS"
        description={
          <p aria-live="polite">
            {loading
              ? 'Buscando motos...'
              : error
                ? 'No se pudo cargar el catálogo'
                : `${total} moto${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`}
          </p>
        }
      >
        {/* Buscador */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-jay-red" aria-hidden="true" />
            <input
              type="search"
              placeholder="Marca, modelo, año, cilindrada..."
              aria-label="Buscar motocicletas"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="field h-14 pl-12 text-base"
            />
          </div>
          <button
            type="button"
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
          <div className="hidden md:block">{renderFilterPanel('desktop')}</div>
          <motion.div
            initial={false}
            animate={openFilters ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pt-1">{renderFilterPanel('movil')}</div>
          </motion.div>
        </div>
      </PageIntro>

      {/* Resultados */}
      <section id="resultados" className="scroll-mt-24 bg-[#f3f3f3] text-jay-black">
        <div className="container-jay py-12 sm:py-16">
          <div className="mb-8 flex flex-col gap-5 border-t border-jay-red/60 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-index">Resultados</span>
              <p className="mt-3 font-display text-3xl font-extrabold uppercase italic leading-none sm:text-4xl">
                {error ? 'Sin conexión' : `Mostrando ${bikes.length} de ${total}`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="ordenar" className="field-label !text-black/50">Ordenar por</label>
              <select
                id="ordenar"
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="h-11 border border-black/15 bg-white px-4 font-display text-xs font-bold uppercase tracking-wider text-jay-black outline-none transition-colors focus:border-jay-red sm:min-w-[190px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} tone="light" />)}
            </div>
          ) : error ? (
            <ErrorState
              tone="light"
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          ) : bikes.length === 0 ? (
            <EmptyState
              tone="light"
              icon={<SearchX size={30} />}
              code="00"
              title={<>Sin resultados<span className="text-jay-red">.</span></>}
              description="Ninguna moto coincide con tu búsqueda. Probá con otros filtros."
              actions={hasActiveFilters ? (
                <button type="button" onClick={clearFilters} className="btn btn-red px-6 py-3 text-xs">
                  <X size={15} /> Limpiar filtros
                </button>
              ) : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bikes.map((bike) => <BikeCard key={bike.id} bike={bike} tone="light" />)}
            </div>
          )}

          {/* Paginación */}
          {!error && !loading && totalPages > 1 && (
            <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Paginación del catálogo">
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-black/45">
                Página {page} de {totalPages}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Página anterior"
                  className="flex h-11 w-11 items-center justify-center border border-black/15 text-black/60 transition-colors hover:border-jay-red hover:text-jay-red disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => goToPage(number)}
                    aria-current={number === page ? 'page' : undefined}
                    className={cn(
                      'h-11 w-11 font-display text-sm font-extrabold transition-colors',
                      number === page
                        ? 'bg-jay-red text-white'
                        : 'border border-black/15 text-black/60 hover:border-jay-red hover:text-jay-red'
                    )}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Página siguiente"
                  className="flex h-11 w-11 items-center justify-center border border-black/15 text-black/60 transition-colors hover:border-jay-red hover:text-jay-red disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
};
