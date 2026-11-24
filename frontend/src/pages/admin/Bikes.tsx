import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CarFront,
  Edit2,
  ImageOff,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import { bikesService } from '@/services/bikes';
import { getThumbnailUrl } from '@/lib/images';
import type { Bike, BikeStatus } from '@/types';

const STATUS_LABELS: Record<BikeStatus, string> = {
  BORRADOR: 'Borrador',
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
  VENDIDA: 'Vendida',
};

const statusBadgeClass = (status: BikeStatus) => {
  if (status === 'BORRADOR') return 'border-white/15 text-white/50';
  if (status === 'DISPONIBLE') return 'border-white bg-white text-cc-black';
  if (status === 'RESERVADA') return 'border-white/40 text-white/80';
  return 'border-white/15 bg-white/10 text-white';
};

const getThumb = (bike: Bike) =>
  bike.images?.find((image) => image.isPrimary)?.url ?? bike.images?.[0]?.url;

export const Bikes = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BikeStatus | 'TODOS'>('TODOS');
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bikeToDelete, setBikeToDelete] = useState<Bike | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await bikesService.listAdmin({
        limit: 100,
        status: statusFilter === 'TODOS' ? undefined : statusFilter,
      });
      setBikes(response.data);
    } catch {
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!bikeToDelete) return;
    dialogCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBikeToDelete(null);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [bikeToDelete]);

  /** Cambia el estado de una publicación con actualización optimista. */
  const changeStatus = async (bike: Bike, status: BikeStatus) => {
    if (status === bike.status || updatingStatusId) return;
    const previous = bike.status;
    setStatusError(null);
    setUpdatingStatusId(bike.id);
    setBikes((prev) =>
      prev.map((item) => (item.id === bike.id ? { ...item, status } : item)),
    );
    try {
      await bikesService.update(bike.id, { status });
    } catch {
      setBikes((prev) =>
        prev.map((item) => (item.id === bike.id ? { ...item, status: previous } : item)),
      );
      setStatusError('No se pudo cambiar el estado. Intentá de nuevo.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bikeToDelete) return;
    setDeletingId(bikeToDelete.id);
    try {
      await bikesService.remove(bikeToDelete.id);
      setBikeToDelete(null);
      setLoading(true);
      void load();
    } catch {
      // El modal permanece abierto para que el usuario pueda reintentar.
    } finally {
      setDeletingId(null);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = bikes.filter((bike) => {
    if (statusFilter !== 'TODOS' && bike.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = [bike.title, bike.model, bike.brand?.name ?? '', String(bike.year)]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div>
      <div className="mb-7 flex flex-col gap-5 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow eyebrow-light">Inventario</span>
          <h1 className="display-md mt-3">Vehículos</h1>
          <p className="mt-3 text-sm text-white/55">
            Administración de publicaciones del catálogo.
          </p>
        </div>
        <Link to="/admin/motos/nuevo" className="btn btn-light self-start sm:self-auto">
          <Plus size={16} /> Nueva publicación
        </Link>
      </div>

      <div className="border border-white/10 bg-cc-carbon">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder="Buscar por marca, modelo o título…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Buscar publicaciones"
                className="field pl-11"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setLoading(true);
                setStatusFilter(event.target.value as BikeStatus | 'TODOS');
              }}
              aria-label="Filtrar por estado"
              className="field md:min-w-52"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="BORRADOR">Borradores</option>
              <option value="DISPONIBLE">Disponibles</option>
              <option value="RESERVADA">Reservadas</option>
              <option value="VENDIDA">Vendidas</option>
            </select>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
            <CarFront size={13} className="text-white/60" />
            {filtered.length} publicación{filtered.length !== 1 ? 'es' : ''}
          </div>
          {statusError && (
            <p className="mt-2 text-xs text-white" role="alert">
              {statusError}
            </p>
          )}
        </div>

        <div className="divide-y divide-white/10 md:hidden">
          {loading ? (
            <p className="py-14 text-center text-sm text-white/50">Cargando publicaciones…</p>
          ) : filtered.length === 0 ? (
            <p className="py-14 text-center text-sm text-white/50">No se encontraron publicaciones.</p>
          ) : (
            filtered.map((bike) => {
              const thumb = getThumb(bike);
              return (
                <div key={bike.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-cc-black">
                      {thumb ? (
                        <img src={getThumbnailUrl(thumb)} alt="" loading="lazy" className="photo h-full w-full object-cover" />
                      ) : (
                        <ImageOff size={18} className="text-white/35" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{bike.title}</p>
                      <p className="mt-1 truncate text-[11px] text-white/45">
                        {bike.brand?.name ?? ''} {bike.model} · {bike.year}
                      </p>
                      <select
                        value={bike.status}
                        disabled={updatingStatusId === bike.id}
                        onChange={(event) => void changeStatus(bike, event.target.value as BikeStatus)}
                        aria-label={`Estado de ${bike.title}`}
                        className={`mt-2 min-h-11 border bg-cc-black px-3 text-[11px] font-bold uppercase tracking-wider outline-none disabled:opacity-50 ${statusBadgeClass(bike.status)}`}
                      >
                        {(Object.keys(STATUS_LABELS) as BikeStatus[]).map((status) => (
                          <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <span className="data-num text-lg">{bike.price.toLocaleString('es-AR')} {bike.currency}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/motos/${bike.id}/editar`}
                        className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
                        title="Editar"
                        aria-label="Editar publicación"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setBikeToDelete(bike)}
                        className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-cc-black"
                        title="Eliminar"
                        aria-label="Eliminar publicación"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/45">
                <th className="px-5 py-3.5 font-bold">Vehículo</th>
                <th className="px-4 py-3.5 font-bold">Año</th>
                <th className="px-4 py-3.5 font-bold">Precio</th>
                <th className="px-4 py-3.5 font-bold">Estado</th>
                <th className="px-5 py-3.5 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-sm text-white/50">Cargando publicaciones…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-sm text-white/50">No se encontraron publicaciones.</td>
                </tr>
              ) : (
                filtered.map((bike) => {
                  const thumb = getThumb(bike);
                  return (
                    <tr key={bike.id} className="transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-cc-black">
                            {thumb ? (
                              <img src={getThumbnailUrl(thumb)} alt="" loading="lazy" className="photo h-full w-full object-cover" />
                            ) : (
                              <ImageOff size={16} className="text-white/35" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{bike.title}</p>
                            <p className="mt-0.5 truncate text-[11px] text-white/45">{bike.brand?.name ?? ''} {bike.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="data-num px-4 py-4 text-xs text-white/60">{bike.year}</td>
                      <td className="px-4 py-4">
                        <span className="data-num text-base">{bike.price.toLocaleString('es-AR')} {bike.currency}</span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={bike.status}
                          disabled={updatingStatusId === bike.id}
                          onChange={(event) => void changeStatus(bike, event.target.value as BikeStatus)}
                          aria-label={`Estado de ${bike.title}`}
                          className={`min-h-11 border bg-cc-black px-3 text-[11px] font-bold uppercase tracking-wider outline-none disabled:opacity-50 ${statusBadgeClass(bike.status)}`}
                        >
                          {(Object.keys(STATUS_LABELS) as BikeStatus[]).map((status) => (
                            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/motos/${bike.id}/editar`}
                            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
                            title="Editar"
                            aria-label="Editar publicación"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setBikeToDelete(bike)}
                            className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-cc-black"
                            title="Eliminar"
                            aria-label="Eliminar publicación"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {bikeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cc-black/70 p-4 backdrop-blur-[2px]"
          onClick={() => setBikeToDelete(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md border border-white/15 bg-cc-carbon shadow-card"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
              <div>
                <CarFront size={22} className="text-white/60" />
                <h2 id="delete-dialog-title" className="display-sm mt-3">
                  Eliminar publicación
                </h2>
              </div>
              <button
                ref={dialogCloseRef}
                type="button"
                onClick={() => setBikeToDelete(null)}
                className="flex min-h-11 min-w-11 items-center justify-center text-white/50 transition-colors hover:text-white"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-white/60">
                ¿Estás seguro de que querés eliminar{' '}
                <strong className="font-semibold text-white">“{bikeToDelete.title}”</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setBikeToDelete(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deletingId !== null}
                  className="btn btn-light"
                >
                  {deletingId === bikeToDelete.id ? 'Eliminando…' : 'Eliminar publicación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
