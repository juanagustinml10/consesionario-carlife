import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Motorbike,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';
import { bikesService } from '@/services/bikes';
import type { Bike, BikeStatus } from '@/types';

const STATUS_LABELS: Record<BikeStatus, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADA: 'Reservada',
  VENDIDA: 'Vendida',
};

export const Bikes: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BikeStatus | 'TODOS'>('TODOS');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState<Bike | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bikesService.list({
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

  const filtered = bikes.filter(
    (b) => statusFilter === 'TODOS' || b.status === statusFilter
  );

  return (
    <div className="bg-jay-black/5">
      <div className="container-jay">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Motocicletas</h1>
            <p className="text-sm text-jay-black/60">
              Administración de publicaciones del catálogo.
            </p>
          </div>
          <Link
            to="/admin/motos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-jay-red text-white font-medium hover:bg-black transition-colors"
          >
            <Plus size={18} /> Nueva publicación
          </Link>
        </div>

        <div className="rounded-xl border border-jay-black/10 bg-jay-white shadow-sm overflow-hidden">
          <div className="border-b border-jay-black/5 bg-jay-black/5 p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-jay-black/40" />
                <input
                  type="search"
                  placeholder="Buscar por marca, modelo o título..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-jay-black/20 bg-jay-white focus:outline-none focus:ring-2 focus:ring-jay-red/50 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BikeStatus | 'TODOS')}
                className="py-3 rounded-lg border border-jay-black/20 bg-jay-white text-sm focus:outline-none focus:ring-2 focus:ring-jay-red/50"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="DISPONIBLE">Disponibles</option>
                <option value="RESERVADA">Reservadas</option>
                <option value="VENDIDA">Vendidas</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-jay-black/50">
              <Motorbike size={14} />
              <span>{filtered.length} publicación{filtered.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-jay-black/5 bg-jay-black/3">
                  <th className="py-4 px-6 font-medium text-jay-black/60">Moto</th>
                  <th className="py-4 px-6 font-medium text-jay-black/60">Año</th>
                  <th className="py-4 px-6 font-medium text-jay-black/60">Precio</th>
                  <th className="py-4 px-6 font-medium text-jay-black/60">Estado</th>
                  <th className="py-4 px-6 font-medium text-jay-black/60 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jay-black/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-40 text-center text-jay-black/40">
                      Cargando publicaciones...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-40 text-center text-jay-black/40">
                      No se encontraron publicaciones.
                    </td>
                  </tr>
                ) : (
                  filtered.map((bike) => (
                    <tr key={bike.id} className="hover:bg-jay-black/3 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-jay-black/5">
                            <Motorbike size={18} className="text-jay-black/40" />
                          </div>
                          <div>
                            <p className="font-medium text-jay-black">{bike.title}</p>
                            <p className="text-xs text-jay-black/50">
                              {bike.brand?.name ?? ''} {bike.model} · {bike.year}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-jay-black/60">{bike.year}</td>
                      <td className="py-5 px-6">
                        <span className="font-medium text-jay-black">
                          {bike.price.toLocaleString('es-AR')} {bike.currency}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            bike.status === 'DISPONIBLE'
                              ? 'bg-green-500/10 text-green-700 border-green-500/30'
                              : bike.status === 'RESERVADA'
                                ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                : 'bg-jay-red/10 text-jay-red border-jay-red/30'
                          }`}
                        >
                          {STATUS_LABELS[bike.status]}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/motos/${bike.id}/editar`}
                            className="p-2 rounded-lg text-jay-black/60 hover:bg-jay-black/5 hover:text-jay-red transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(bike)}
                            className="p-2 rounded-lg text-jay-black/60 hover:bg-jay-red hover:text-white transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="p-2 rounded-lg text-jay-black/30 hover:bg-jay-black/10 transition-colors"
                            aria-label="Más opciones"
                          >
                            <MoreHorizontal size={18} />
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md rounded-xl border border-jay-black/10 bg-jay-white p-6 shadow-2xl"
          >
            <div className="mb-4">
              <Motorbike size={24} className="text-jay-red" />
              <h3 className="ml-3 font-display text-xl font-bold">Eliminar publicación</h3>
            </div>
            <p className="text-sm text-jay-black/60 mb-6">
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
