import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Motorbike,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';
import { bikesService } from '@/services/bikes';
import type { Bike, BikeStatus } from '@/types';

const STATUS_LABELS: Record<BikeStatus, string> = {
  BORRADOR: 'Borrador',
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
  VENDIDA: 'Vendida',
};

const statusBadgeClass = (status: BikeStatus) => {
  if (status === 'BORRADOR') return 'bg-white/5 text-gray-400 border-white/15';
  if (status === 'DISPONIBLE') return 'bg-green-500/10 text-green-700 border-green-500/30';
  if (status === 'RESERVADA') return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
  return 'bg-jay-red/10 text-jay-red border-jay-red/30';
};

export const Bikes: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BikeStatus | 'TODOS'>('TODOS');
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState<Bike | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
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
    load();
  }, [load]);

  const handleDelete = (bike: Bike) => {
    setBikeToDelete(bike);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bikeToDelete) return;
    setDeletingId(bikeToDelete.id);
    try {
      await bikesService.remove(bikeToDelete.id);
      setConfirmOpen(false);
      setBikeToDelete(null);
      setDeletingId(null);
      load();
    } catch {
      setDeletingId(null);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = bikes.filter((b) => {
    if (statusFilter !== 'TODOS' && b.status !== statusFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = [b.title, b.model, b.brand?.name ?? '', String(b.year)]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="bg-transparent">
      <div className="container-jay">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Motocicletas</h1>
            <p className="text-sm text-gray-400">
              Administración de publicaciones del catálogo.
            </p>
          </div>
          <Link
            to="/admin/motos/nuevo"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-jay-red px-5 py-3 font-medium text-white transition-colors hover:bg-black sm:w-auto"
          >
            <Plus size={18} /> Nueva publicación
          </Link>
        </div>

        <div className="rounded-2xl border border-white/8 bg-jay-surface shadow-card overflow-hidden">
          <div className="border-b border-white/5 bg-transparent p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="search"
                  placeholder="Buscar por marca, modelo o título..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BikeStatus | 'TODOS')}
                className="py-3 rounded-lg border border-white/10 bg-jay-elevated text-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/40"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="BORRADOR">Borradores</option>
                <option value="DISPONIBLE">Disponibles</option>
                <option value="RESERVADA">Reservadas</option>
                <option value="VENDIDA">Vendidas</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Motorbike size={14} />
              <span>{filtered.length} publicación{filtered.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>

          {/* Vista móvil: tarjetas */}
          <div className="divide-y divide-white/5 md:hidden">
            {loading ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                Cargando publicaciones...
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                No se encontraron publicaciones.
              </div>
            ) : (
              filtered.map((bike) => (
                <div key={bike.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-transparent">
                        <Motorbike size={18} className="text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{bike.title}</p>
                        <p className="truncate text-xs text-gray-500">
                          {bike.brand?.name ?? ''} {bike.model} · {bike.year}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusBadgeClass(bike.status)}`}
                    >
                      {STATUS_LABELS[bike.status]}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-bold text-white">
                      {bike.price.toLocaleString('es-AR')} {bike.currency}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/motos/${bike.id}/editar`}
                        className="rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-transparent hover:text-jay-red"
                        title="Editar"
                        aria-label="Editar publicación"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(bike)}
                        className="rounded-lg p-2.5 text-gray-400 transition-colors hover:bg-jay-red hover:text-white"
                        title="Eliminar"
                        aria-label="Eliminar publicación"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista desktop: tabla */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="py-4 px-6 font-medium text-gray-400">Moto</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Año</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Precio</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Estado</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-40 text-center text-gray-500">
                      Cargando publicaciones...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-40 text-center text-gray-500">
                      No se encontraron publicaciones.
                    </td>
                  </tr>
                ) : (
                  filtered.map((bike) => (
                    <tr key={bike.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent">
                            <Motorbike size={18} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{bike.title}</p>
                            <p className="text-xs text-gray-500">
                              {bike.brand?.name ?? ''} {bike.model} · {bike.year}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-400">{bike.year}</td>
                      <td className="py-5 px-6">
                        <span className="font-medium text-white">
                          {bike.price.toLocaleString('es-AR')} {bike.currency}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusBadgeClass(bike.status)}`}
                        >
                          {STATUS_LABELS[bike.status]}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/motos/${bike.id}/editar`}
                            className="p-2 rounded-lg text-gray-400 hover:bg-transparent hover:text-jay-red transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(bike)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-jay-red hover:text-white transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmOpen && bikeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-jay-surface p-6 shadow-2xl"
          >
            <div className="mb-4">
              <Motorbike size={24} className="text-jay-red" />
              <h3 className="ml-3 font-display text-xl font-bold">Eliminar publicación</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              ¿Estás seguro de que querés eliminar <strong>"{bikeToDelete.title}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirmOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button variant="red" onClick={handleConfirmDelete} disabled={deletingId !== null} className="flex-1">
                {deletingId === bikeToDelete.id ? 'Eliminando...' : 'Eliminar publicación'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
