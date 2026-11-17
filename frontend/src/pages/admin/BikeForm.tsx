import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Plus, Trash2, Check } from 'lucide-react';

import { Link } from '@/components/shared/Link';
import Button from '@/components/ui/button';
import { bikesService } from '@/services/bikes';
import type { Bike, BikeCondition, BikeStatus } from '@/types';

const CONDITIONS: BikeCondition[] = ['NUEVA', 'USADA'];
const STATUSES: BikeStatus[] = ['DISPONIBLE', 'RESERVADA', 'VENDIDA'];
const YEARS = [...Array(11).keys()].map((i) => new Date().getFullYear() - i);

interface FormValues {
  title: string;
  brandId: string;
  model: string;
  year: number;
  condition: BikeCondition;
  displacementCc: string;
  mileageKm: string;
  price: string;
  currency: string;
  description: string;
  status: BikeStatus;
  featured: boolean;
}

export const BikeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [form, setForm] = useState<FormValues>({
    title: '',
    brandId: '',
    model: '',
    year: new Date().getFullYear(),
    condition: 'USADA',
    displacementCc: '',
    mileageKm: '',
    price: '',
    currency: 'ARS',
    description: '',
    status: 'DISPONIBLE',
    featured: false,
  });

  useEffect(() => {
    bikesService.listBrands().then(setBrands).catch(() => setBrands([]));
    if (isEdit && id) {
      bikesService.getById(id).then((b) => {
        setBike(b);
        setForm({
          title: b.title,
          brandId: b.brandId,
          model: b.model,
          year: b.year,
          condition: b.condition,
          displacementCc: String(b.displacementCc ?? ''),
          mileageKm: String(b.mileageKm ?? ''),
          price: String(b.price),
          currency: b.currency,
          description: b.description ?? '',
          status: b.status,
          featured: b.featured,
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEdit, id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input = {
        title: form.title,
        brandId: form.brandId,
        model: form.model,
        year: form.year,
        condition: form.condition,
        displacementCc: form.displacementCc ? Number(form.displacementCc) : null,
        mileageKm: form.mileageKm ? Number(form.mileageKm) : null,
        price: Number(form.price),
        currency: form.currency,
        description: form.description || null,
        status: form.status,
        featured: form.featured,
      };

      let savedBike: Bike;
      if (isEdit && bike) {
        savedBike = await bikesService.update(bike.id, input as any);
      } else {
        savedBike = await bikesService.create(input as any);
      }

      if (newImages.length > 0 && savedBike.id) {
        await bikesService.uploadImages(savedBike.id, newImages);
      }

      navigate('/admin/motos');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const setPrimary = async (imageId: string) => {
    if (!bike?.id) return;
    try {
      const updated = await bikesService.setPrimaryImage(bike.id, imageId);
      setBike(updated);
    } catch {
      // error handled by API layer
    }
  };

  const removeExistingImage = async (imageId: string) => {
    if (!bike?.id) return;
    if (!window.confirm('¿Eliminar esta fotografía?')) return;
    try {
      await bikesService.deleteImage(bike.id, imageId);
      setBike((prev) => (prev ? { ...prev, images: prev.images.filter((i) => i.id !== imageId) } : prev));
    } catch {
      // error handled by API layer
    }
  };

  if (loading) {
    return (
      <div className="container-jay py-20">
        <p className="text-gray-500">Cargando publicación...</p>
      </div>
    );
  }

  const images = bike?.images ?? [];

  return (
    <div className="bg-transparent">
      <div className="container-jay">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/admin/motos" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-jay-red">
            <ArrowLeft size={18} /> Volver al listado
          </Link>
          <h1 className="font-display text-2xl font-bold">
            {isEdit ? 'Editar publicación' : 'Nueva publicación'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl border border-white/8 bg-jay-surface p-8 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">Datos de la motocicleta</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Título</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Marca</label>
                <select
                  required
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                >
                  <option value="">Seleccionar marca</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Modelo</label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Año</label>
                <select
                  required
                  value={String(form.year)}
                  onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Condición</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value as BikeCondition })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c === 'NUEVA' ? '0 km' : 'Usada'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Cilindrada (cc)</label>
                <input
                  type="number"
                  value={form.displacementCc}
                  onChange={(e) => setForm({ ...form, displacementCc: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Kilometraje (km)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0 si es 0 km"
                  value={form.mileageKm}
                  onChange={(e) => setForm({ ...form, mileageKm: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Precio</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full pl-7 py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Moneda</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium text-gray-300">Descripción</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as BikeStatus })}
                  className="w-full py-3 rounded-lg border border-white/10 bg-jay-elevated text-white focus:outline-none focus:ring-2 focus:ring-jay-red/40 transition-colors"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s === 'DISPONIBLE' ? 'Disponible' : s === 'RESERVADA' ? 'Reservada' : 'Vendida'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="rounded border-white/20 text-jay-red focus:ring-jay-red bg-transparent"
                  />
                  <span className="text-sm font-medium text-gray-300">Destacar en la portada</span>
                </label>
              </div>
            </div>
          </div>

          {/* Fotografías */}
          <div className="rounded-2xl border border-white/8 bg-jay-surface p-8 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
              <ImageIcon size={16} /> Fotografías
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Subí varias fotografías y seleccioná cuál será la principal de la ficha.
              <br className="hidden md:block" />
              Formatos recomendados: JPG o PNG.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-square rounded-lg border border-white/10 bg-transparent overflow-hidden">
                    {img.url ? (
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-[10px]">
                        Foto de prueba
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur text-white text-[10px] font-medium border border-white/60">
                    {img.isPrimary ? (
                      <>
                        <Check size={12} className="text-jay-red" /> Principal
                      </>
                    ) : (
                      <button
                        onClick={() => setPrimary(img.id)}
                        className="text-gray-400 hover:text-jay-red transition-colors"
                        title="Establecer como principal"
                      >
                        Marcar principal
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-jay-red/10 text-jay-red hover:bg-jay-red hover:text-white transition-colors"
                    title="Eliminar fotografía"
                    aria-label="Eliminar fotografía"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {newImages.map((file, i) => (
                <div key={i} className="relative aspect-square rounded-lg border border-dashed border-white/15 bg-transparent flex flex-col items-center justify-center p-2">
                  <ImageIcon size={24} className="text-gray-500 mb-2" />
                  <span className="text-[10px] text-gray-500 truncate w-full text-center">{file.name}</span>
                  <button
                    onClick={() => removeNewImage(i)}
                    className="mt-1 p-1 rounded-lg bg-jay-red/10 text-jay-red hover:bg-jay-red hover:text-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border border-dashed border-white/15 bg-transparent flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/[0.04] hover:border-jay-red transition-colors group">
                <Plus size={20} className="text-gray-500 group-hover:text-jay-red mb-2" />
                <span className="text-xs font-medium text-gray-400 group-hover:text-jay-red">Agregar más fotos</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {newImages.length > 0 && (
              <div className="mb-4 text-sm text-jay-red">
                {newImages.length} fotografía(s) nueva(s) se subirán al guardar.
              </div>
            )}

          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:pt-4">
              <Link
                to="/admin/motos"
                className="w-full rounded-lg border border-white/10 px-6 py-3 text-center text-sm font-medium text-gray-300 transition-colors hover:bg-transparent sm:w-auto"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                variant="red"
                className="w-full px-8 sm:w-auto"
                disabled={saving}
              >
                {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Publicar motocicleta'}
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
