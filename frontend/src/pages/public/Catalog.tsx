import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { BikeCard } from '@/components/public/BikeCard';
import { PageIntro } from '@/components/public/PageIntro';
import { Reveal } from '@/components/shared/Reveal';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { bikesService, type BikeFilters } from '@/services/bikes';
import type { Bike, BikeStatus, VehicleCategory } from '@/types';
import { cn } from '@/lib/utils';
import { MODEL_YEARS, VEHICLE_CATEGORIES } from '@/lib/constants';

/** Misma fuente de verdad que el panel: solo Autos y Camionetas/SUV. */
const CATEGORIES = VEHICLE_CATEGORIES;

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
    default: return sorted;
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
  // incluso cuando ya estamos en /motos.
  const filters = useMemo<BikeFilters>(() => {
    const value = (key: string) => searchParams.get(key) ?? undefined;
    const q = value('q');
    const brand = value('brand');
    const model = value('model');
    const condition = value('condition');
    const category = value('category');
    const status = value('status');
    const year = Number(value('year'));
    const priceMin = Number(value('priceMin'));
    const priceMax = Number(value('priceMax'));
    return {
      ...(q ? { q } : {}),
      ...(brand ? { brand } : {}),
      ...(model ? { model } : {}),
      ...(condition === 'USADA' ? { condition } : {}),
      ...(CATEGORIES.some((item) => item.value === category)
        ? { category: category as VehicleCategory }
        : {}),
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
    [searchParams, setSearchParams],
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
      .list({ ...filters, condition: 'USADA', page: 1, limit: FETCH_LIMIT })
      .then(({ data }) => {
        if (cancelled) return;
        const sorted = sortBikes(Array.isArray(data) ? data : [], sort);
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
    const keys: Array<keyof BikeFilters> = ['q', 'brand', 'model', 'year', 'category', 'condition', 'priceMin', 'priceMax', 'status', 'featured'];
    return keys.some((key) => filters[key] !== undefined && filters[key] !== null);
  }, [filters]);

  const renderFilterPanel = (prefix: string) => (
    <div className="panel-light relative p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-cc-paper pb-4">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cc-black">
          <SlidersHorizontal size={15} className="text-cc-gray" />
          Filtros
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="-mr-2 inline-flex min-h-11 items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cc-gray transition-colors hover:text-cc-black"
          >
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6 xl:grid-cols-12">
        <div className="col-span-2 space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-marca`}>Marca</label>
          <select id={`${prefix}-marca`} value={filters.brand ?? ''} onChange={(e) => setFilter('brand', e.target.value || undefined)} className="field field-light">
            <option value="">Todas</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="col-span-2 space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-modelo`}>Modelo</label>
          <input
            id={`${prefix}-modelo`}
            type="text"
            placeholder="Ej.: Corolla"
            value={filters.model ?? ''}
            onChange={(e) => setFilter('model', e.target.value.trim() || undefined)}
            className="field field-light"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-categoria`}>Tipo de vehículo</label>
          <select id={`${prefix}-categoria`} value={filters.category ?? ''} onChange={(e) => setFilter('category', e.target.value || undefined)} className="field field-light">
            <option value="">Todos</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-estado`}>Estado</label>
          <select id={`${prefix}-estado`} value={filters.status ?? ''} onChange={(e) => setFilter('status', e.target.value || undefined)} className="field field-light">
            <option value="">Todos</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="col-span-2 space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-precio-min`}>Precio</label>
          <div className="grid grid-cols-2 gap-2">
            <input id={`${prefix}-precio-min`} type="number" min={0} placeholder="Desde" aria-label="Precio mínimo" value={filters.priceMin ?? ''} onChange={(e) => setFilter('priceMin', e.target.value === '' ? undefined : Number(e.target.value))} className="field field-light" />
            <input type="number" min={0} placeholder="Hasta" aria-label="Precio máximo" value={filters.priceMax ?? ''} onChange={(e) => setFilter('priceMax', e.target.value === '' ? undefined : Number(e.target.value))} className="field field-light" />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="field-label" htmlFor={`${prefix}-anio`}>Año</label>
          <select id={`${prefix}-anio`} value={filters.year ?? ''} onChange={(e) => setFilter('year', e.target.value || undefined)} className="field field-light">
            <option value="">Cualquiera</option>
            {MODEL_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div className="col-span-2 flex items-end md:col-span-6 md:w-64 xl:col-span-12">
          <button
            type="button"
            onClick={() => setFilter('featured', !filters.featured)}
            aria-pressed={!!filters.featured}
            className={cn(
              'flex h-12 w-full items-center justify-center gap-2 border text-[10px] font-bold uppercase tracking-[0.2em] transition-colors',
              filters.featured
                ? 'border-cc-black bg-cc-black text-white'
                : 'border-black/20 text-black/60 hover:border-black hover:text-black'
            )}
          >
            <BadgeCheck size={16} strokeWidth={1.7} />
            Solo destacados
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-cc-black">
      <PageIntro
        index="01"
        eyebrow="Inventario CARLIFE"
        title={<>Encontrá tu próximo vehículo</>}
        size="compact"
        className="!bg-white"
        description={
          <p aria-live="polite">
            {loading
              ? 'Buscando vehículos...'
              : error
                ? 'No se pudo cargar el catálogo'
                : `${total} vehículo${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`}
          </p>
        }
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cc-gray" aria-hidden="true" />
            <input
              type="search"
              placeholder="Marca, modelo, año..."
              aria-label="Buscar vehículos"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="field field-light h-12 pl-11 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenFilters(!openFilters)}
            aria-expanded={openFilters}
            aria-controls="filtros-catalogo"
            className="btn btn-dark h-12 px-5 md:hidden"
          >
            <SlidersHorizontal size={18} />
            {openFilters ? 'Ocultar' : 'Filtros'}
            <ChevronDown size={15} className={cn('transition-transform', openFilters && 'rotate-180')} />
          </button>
        </div>

        <div id="filtros-catalogo" className="mt-4">
          <div className="hidden md:block">{renderFilterPanel('desktop')}</div>
          <div className={cn('md:hidden', openFilters ? 'block' : 'hidden')}>
            <div className="pt-1">{renderFilterPanel('movil')}</div>
          </div>
        </div>
      </PageIntro>

      <section id="resultados" className="relative scroll-mt-24 bg-white">
        <div className="container-cc relative py-10 sm:py-14">
          <div className="mb-9 flex flex-col gap-5 border-b border-cc-paper pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow eyebrow-dark">Resultados</span>
              <p className="data-num mt-3 text-4xl text-cc-black sm:text-5xl">
                {error ? 'Sin conexión' : `Mostrando ${bikes.length} de ${total}`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="ordenar" className="field-label !mb-0">Ordenar por</label>
              <select
                id="ordenar"
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="field field-light h-11 w-full py-0 text-xs sm:min-w-[200px]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-10">
            <p className="eyebrow eyebrow-dark mb-4">Explorá por categoría</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CATEGORIES.map((item) => {
                const active = filters.category === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter('category', active ? undefined : item.value)}
                    className={cn(
                      'group relative flex min-h-[150px] flex-col items-start justify-between border p-5 text-left transition-colors sm:p-6',
                      active
                        ? 'border-cc-black bg-cc-black text-white'
                        : 'border-cc-paper bg-cc-soft text-cc-black hover:border-black/40'
                    )}
                  >
                    <span className="break-words font-display text-2xl font-bold uppercase leading-none tracking-tight min-[360px]:text-3xl sm:text-4xl">{item.label}</span>
                    <span className={cn(
                      'mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]',
                      active ? 'text-white/60' : 'text-cc-gray'
                    )}>
                      {active ? <Check size={15} /> : <ArrowRight size={15} />}
                      {active ? 'Quitar filtro' : `Ver ${item.label.toLowerCase()}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorState
              compact
              title="No se pudo cargar el catálogo"
              className="mx-auto max-w-2xl"
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          ) : bikes.length === 0 ? (
            <EmptyState
              icon={<SearchX size={30} strokeWidth={1.5} />}
              code="00"
              title={<>Sin resultados</>}
              description="Ningún vehículo coincide con tu búsqueda. Probá con otros filtros."
              actions={hasActiveFilters ? (
                <button type="button" onClick={clearFilters} className="btn btn-dark px-6">
                  <X size={15} /> Limpiar filtros
                </button>
              ) : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bikes.map((bike, index) => (
                <Reveal key={bike.id} delay={(index % 3) * 80}>
                  <BikeCard bike={bike} />
                </Reveal>
              ))}
            </div>
          )}

          {!error && !loading && totalPages > 1 && (
            <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Paginación del catálogo">
              <p className="eyebrow eyebrow-dark">Página {page} de {totalPages}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Página anterior"
                  className="flex h-11 w-11 items-center justify-center border border-black/20 text-black/60 transition-colors hover:border-black hover:text-black disabled:opacity-30"
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
                      'h-11 w-11 text-sm font-bold transition-colors',
                      number === page
                        ? 'bg-cc-black text-white'
                        : 'border border-black/20 text-black/60 hover:border-black hover:text-black'
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
                  className="flex h-11 w-11 items-center justify-center border border-black/20 text-black/60 transition-colors hover:border-black hover:text-black disabled:opacity-30"
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
