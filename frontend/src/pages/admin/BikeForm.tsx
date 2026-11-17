import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bike as BikeIcon,
  Check,
  Gauge,
  Image as ImageIcon,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
} from 'lucide-react';

import { Link } from '@/components/shared/Link';
import { bikesService, type CreateBikeInput } from '@/services/bikes';
import type { Bike, BikeCondition, BikeImage, BikeStatus } from '@/types';
import { cn } from '@/lib/utils';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 12 }, (_, index) => CURRENT_YEAR - index);
const CONDITIONS: BikeCondition[] = ['NUEVA', 'USADA'];
const STEPS = [
  { id: 1, label: 'Datos' },
  { id: 2, label: 'Estado' },
  { id: 3, label: 'Detalles' },
  { id: 4, label: 'Fotografías' },
  { id: 5, label: 'Publicación' },
] as const;

const inputClass =
  'w-full rounded-lg border border-white/10 bg-jay-elevated px-3 py-3 text-sm text-white placeholder:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-jay-red/40';
const labelClass = 'mb-2 block text-sm font-medium text-gray-300';
const cardClass = 'rounded-2xl border border-white/8 bg-jay-surface p-6 shadow-card sm:p-8';
const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const iconButtonClass =
  'flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-gray-300 transition-colors hover:border-jay-red hover:text-white disabled:cursor-not-allowed disabled:opacity-30';

interface FeatureDraft {
  id?: string;
  key: string;
  value: string;
}

interface FormValues {
  title: string;
  brandId: string;
  model: string;
  year: number;
  price: string;
  currency: string;
  condition: BikeCondition;
  displacementCc: string;
  mileageKm: string;
  usageHours: string;
  description: string;
  featured: boolean;
}

const emptyForm: FormValues = {
  title: '',
  brandId: '',
  model: '',
  year: CURRENT_YEAR,
  price: '',
  currency: 'ARS',
  condition: 'USADA',
  displacementCc: '',
  mileageKm: '',
  usageHours: '',
  description: '',
  featured: false,
};

const byOrder = (a: BikeImage, b: BikeImage) => a.order - b.order;

export const BikeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [features, setFeatures] = useState<FeatureDraft[]>([]);
  const [existingImages, setExistingImages] = useState<BikeImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    let active = true;
    bikesService.listBrands().then((data) => {
      if (active) setBrands(data);
    }).catch(() => {});

    if (isEdit && id) {
      bikesService.getById(id).then((b) => {
        if (!active) return;
        setBike(b);
        setForm({
          title: b.title,
          brandId: b.brandId,
          model: b.model,
          year: b.year,
          price: String(b.price),
          currency: b.currency,
          condition: b.condition,
          displacementCc: String(b.displacementCc ?? ''),
          mileageKm: String(b.mileageKm ?? ''),
          usageHours: b.condition === 'USADA' && b.usageHours ? String(b.usageHours) : '',
          description: b.description ?? '',
          featured: b.featured,
        });
        setFeatures(b.features.map((feature) => ({
          id: feature.id,
          key: feature.key,
          value: feature.value,
        })));
        setExistingImages([...b.images].sort(byOrder));
        setLoading(false);
      }).catch(() => {
        if (active) {
          setError('No se pudo cargar la publicación.');
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [isEdit, id]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validSteps: Record<number, boolean> = {
    1: Boolean(form.title.trim()) && Boolean(form.brandId) && Boolean(form.model.trim()) && Number(form.price) > 0,
    2: form.condition === 'NUEVA' || form.condition === 'USADA',
    3: true,
    4: true,
    5: true,
  };
  const canSave = [1, 2, 3, 4].every((number) => validSteps[number]);

  const changeCondition = (condition: BikeCondition) =>
    setForm((prev) => ({
      ...prev,
      condition,
      // Las horas no aplican a unidades 0 km: se descartan al cambiar de estado.
      usageHours: condition === 'NUEVA' ? '' : prev.usageHours,
    }));

  const updateFeature = (index: number, patch: Partial<FeatureDraft>) =>
    setFeatures((prev) => prev.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));

  const handleNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) setNewImages((prev) => [...prev, ...files]);
    event.target.value = '';
  };

  const swap = <T,>(items: T[], from: number, to: number): T[] => {
    if (to < 0 || to >= items.length) return items;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  };

  const moveExisting = async (index: number, direction: -1 | 1) => {
    const next = swap(existingImages, index, index + direction);
    if (next === existingImages || !bike) return;
    const previous = existingImages;
    setExistingImages(next);
    try {
      const result = await bikesService.reorderImages(bike.id, next.map((image) => image.id));
      setExistingImages([...result.images].sort(byOrder));
    } catch {
      setExistingImages(previous);
      setError('No se pudo cambiar el orden de las fotografías.');
    }
  };

  const moveNew = (index: number, direction: -1 | 1) =>
    setNewImages((prev) => swap(prev, index, index + direction));

  const makePrimary = async (imageId: string) => {
    if (!bike) return;
    try {
      const result = await bikesService.setPrimaryImage(bike.id, imageId);
      setExistingImages([...result.images].sort(byOrder));
    } catch {
      setError('No se pudo seleccionar la fotografía principal.');
    }
  };

  const deleteExisting = async (imageId: string) => {
    if (!bike || !window.confirm('¿Eliminar esta fotografía?')) return;
    try {
      await bikesService.deleteImage(bike.id, imageId);
      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
    } catch {
      setError('No se pudo eliminar la fotografía.');
    }
  };

  const save = async (status: BikeStatus) => {
    if (!canSave) {
      setStep(1);
      setError('Completá título, marca, modelo y precio antes de guardar.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const input: CreateBikeInput = {
        title: form.title.trim(),
        brandId: form.brandId,
        model: form.model.trim(),
        year: form.year,
        condition: form.condition,
        displacementCc: form.displacementCc ? Number(form.displacementCc) : null,
        mileageKm: form.mileageKm ? Number(form.mileageKm) : null,
        usageHours:
          form.condition === 'USADA' && form.usageHours !== ''
            ? Number(form.usageHours)
            : null,
        price: Number(form.price),
        currency: form.currency,
        description: form.description.trim() || null,
        features: features
          .filter((feature) => feature.key.trim() && feature.value.trim())
          .map((feature) => ({ key: feature.key.trim(), value: feature.value.trim() })),
        status,
        featured: form.featured,
      };

      let saved: Bike;
      if (isEdit && bike) saved = await bikesService.update(bike.id, input);
      else saved = await bikesService.create(input);

      if (newImages.length > 0) await bikesService.uploadImages(saved.id, newImages);
      navigate('/admin/motos');
    } catch {
      setError('No se pudo guardar la publicación. Revisá los datos e intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-jay py-20">
        <p className="text-sm text-gray-500">Cargando publicación...</p>
      </div>
    );
  }

  const imageCount = existingImages.length + newImages.length;

  return (
    <div className="bg-transparent">
      <div className="container-jay pb-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/admin/motos" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-jay-red">
            <ArrowLeft size={18} /> Volver al listado
          </Link>
          <h1 className="font-display text-2xl font-bold">
            {isEdit ? 'Editar publicación' : 'Nueva publicación'}
          </h1>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-jay-red/40 bg-jay-red/10 px-4 py-3 text-sm text-jay-red-soft">
            {error}
          </div>
        )}

        {/* Pasos: se navega hacia adelante solo con los datos válidos. */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {STEPS.map((item) => {
            const active = step === item.id;
            const done = step > item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.id > step}
                onClick={() => setStep(item.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors',
                  active
                    ? 'border-jay-red bg-jay-red/10 text-jay-red-soft'
                    : done
                      ? 'border-white/10 text-gray-400 hover:border-jay-red/60'
                      : 'border-white/5 text-gray-600'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px]',
                    active ? 'bg-jay-red text-white' : done ? 'bg-white/10 text-gray-300' : 'bg-white/5'
                  )}
                >
                  {done ? <Check size={12} /> : item.id}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={(event) => { event.preventDefault(); void save('DISPONIBLE'); }}>
          {/* Paso 1 — Datos */}
          {step === 1 && (
            <section className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">01</span>
                <span className="h-px w-8 bg-jay-red" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Datos</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <label htmlFor="bike-title" className={labelClass}>Título</label>
                  <input
                    id="bike-title"
                    required
                    value={form.title}
                    onChange={(event) => update('title', event.target.value)}
                    placeholder="Ej.: Beta 300 RR Freenduro"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-brand" className={labelClass}>Marca</label>
                  <select
                    id="bike-brand"
                    required
                    value={form.brandId}
                    onChange={(event) => update('brandId', event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar marca</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-model" className={labelClass}>Modelo</label>
                  <input
                    id="bike-model"
                    required
                    value={form.model}
                    onChange={(event) => update('model', event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-year" className={labelClass}>Año</label>
                  <select
                    id="bike-year"
                    value={String(form.year)}
                    onChange={(event) => update('year', Number(event.target.value))}
                    className={inputClass}
                  >
                    {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-price" className={labelClass}>Precio</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        id="bike-price"
                        required
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) => update('price', event.target.value)}
                        className={cn(inputClass, 'pl-7')}
                      />
                    </div>
                    <select
                      aria-label="Moneda"
                      value={form.currency}
                      onChange={(event) => update('currency', event.target.value)}
                      className={cn(inputClass, 'w-20 px-2')}
                    >
                      <option value="ARS">ARS</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Paso 2 — Estado */}
          {step === 2 && (
            <section className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">02</span>
                <span className="h-px w-8 bg-jay-red" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Estado</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CONDITIONS.map((condition) => {
                  const selected = form.condition === condition;
                  return (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => changeCondition(condition)}
                      aria-pressed={selected}
                      className={cn(
                        'flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-colors',
                        selected
                          ? 'border-jay-red bg-jay-red/10'
                          : 'border-white/10 bg-jay-elevated/40 hover:border-white/25'
                      )}
                    >
                      <span className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        selected ? 'bg-jay-red text-white' : 'bg-white/5 text-gray-400'
                      )}>
                        {condition === 'NUEVA' ? <BikeIcon size={20} /> : <Gauge size={20} />}
                      </span>
                      <span className="font-display text-lg font-bold text-white">
                        {condition === 'NUEVA' ? '0 km' : 'Usada'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {condition === 'NUEVA'
                          ? 'Sin horas de uso declaradas.'
                          : 'Con kilometraje y horas de uso opcionales.'}
                      </span>
                      {selected && <Check size={16} className="ml-auto text-jay-red" />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Paso 3 — Detalles */}
          {step === 3 && (
            <section className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">03</span>
                <span className="h-px w-8 bg-jay-red" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Detalles</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="bike-cc" className={labelClass}>Cilindrada (cc)</label>
                  <input
                    id="bike-cc"
                    type="number"
                    min="0"
                    value={form.displacementCc}
                    onChange={(event) => update('displacementCc', event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-km" className={labelClass}>Kilometraje (km)</label>
                  <input
                    id="bike-km"
                    type="number"
                    min="0"
                    placeholder="Ej.: 12000"
                    value={form.mileageKm}
                    onChange={(event) => update('mileageKm', event.target.value)}
                    className={inputClass}
                  />
                </div>
                {form.condition === 'USADA' && (
                  <div className="space-y-2">
                    <label htmlFor="bike-hours" className={labelClass}>Horas de uso</label>
                    <input
                      id="bike-hours"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Ej.: 85 horas"
                      value={form.usageHours}
                      onChange={(event) => update('usageHours', event.target.value)}
                      className={inputClass}
                    />
                    <p className="text-[11px] leading-relaxed text-gray-500">
                      Opcional y decimal. Solo se muestra en la ficha si es mayor a 0.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <label htmlFor="bike-description" className={labelClass}>Descripción</label>
                <textarea
                  id="bike-description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  className={cn(inputClass, 'resize-y')}
                />
              </div>

              <div className="mt-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={labelClass}>Características técnicas</p>
                    <p className="text-[11px] text-gray-500">
                      Pares clave / valor. Ejemplo: Motor · 300 cc.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={features.length >= 30}
                    onClick={() => setFeatures((prev) => [...prev, { key: '', value: '' }])}
                    className={cn(buttonClass, 'border-white/10 text-gray-300 hover:border-jay-red hover:text-white')}
                  >
                    <Plus size={15} /> Agregar característica
                  </button>
                </div>
                <div className="space-y-3">
                  {features.length === 0 && (
                    <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-gray-600">
                      Sin características cargadas.
                    </p>
                  )}
                  {features.map((feature, index) => (
                    <div key={feature.id ?? `nueva-${index}`} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        aria-label={`Nombre de la característica ${index + 1}`}
                        placeholder="Ej.: Suspensión delantera"
                        maxLength={80}
                        value={feature.key}
                        onChange={(event) => updateFeature(index, { key: event.target.value })}
                        className={inputClass}
                      />
                      <input
                        aria-label={`Valor de la característica ${index + 1}`}
                        placeholder="Ej.: Invertida 41 mm"
                        maxLength={200}
                        value={feature.value}
                        onChange={(event) => updateFeature(index, { value: event.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        aria-label={`Eliminar característica ${index + 1}`}
                        onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== index))}
                        className={cn(iconButtonClass, 'sm:h-[46px] sm:w-[46px] hover:border-jay-red hover:text-jay-red')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Paso 4 — Fotografías */}
          {step === 4 && (
            <section className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">04</span>
                <span className="h-px w-8 bg-jay-red" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Fotografías</h2>
              </div>
              <p className="mb-6 text-sm text-gray-400">
                Subí varias imágenes, elegí la portada y cambiá el orden con las flechas.
              </p>

              {existingImages.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Fotos de la publicación</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {existingImages.map((image, index) => (
                      <div key={image.id} className="relative overflow-hidden rounded-lg border border-white/10 bg-black">
                        <div className="aspect-square">
                          <img src={image.url} alt="" className="h-full w-full object-cover" />
                        </div>
                        {image.isPrimary && (
                          <span className="absolute left-2 top-2 rounded-md border border-jay-red/60 bg-black/75 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-jay-red-soft backdrop-blur">
                            Portada
                          </span>
                        )}
                        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              aria-label={`Mover foto ${index + 1} hacia arriba`}
                              disabled={index === 0}
                              onClick={() => void moveExisting(index, -1)}
                              className={iconButtonClass}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label={`Mover foto ${index + 1} hacia abajo`}
                              disabled={index === existingImages.length - 1}
                              onClick={() => void moveExisting(index, 1)}
                              className={iconButtonClass}
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                          <div className="flex gap-1">
                            {!image.isPrimary && (
                              <button
                                type="button"
                                title="Usar como portada"
                                aria-label={`Usar foto ${index + 1} como portada`}
                                onClick={() => void makePrimary(image.id)}
                                className={iconButtonClass}
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Eliminar fotografía"
                              aria-label={`Eliminar foto ${index + 1}`}
                              onClick={() => void deleteExisting(image.id)}
                              className={cn(iconButtonClass, 'hover:border-jay-red hover:text-jay-red')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">Fotos nuevas (se suben al guardar)</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {newImages.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-jay-elevated/40 p-3">
                        <ImageIcon size={22} className="text-gray-500" />
                        <span className="w-full truncate text-center text-[10px] text-gray-400">{file.name}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            aria-label={`Mover foto nueva ${index + 1} antes`}
                            disabled={index === 0}
                            onClick={() => moveNew(index, -1)}
                            className={iconButtonClass}
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Mover foto nueva ${index + 1} después`}
                            disabled={index === newImages.length - 1}
                            onClick={() => moveNew(index, 1)}
                            className={iconButtonClass}
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Quitar foto nueva ${index + 1}`}
                            onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                            className={cn(iconButtonClass, 'hover:border-jay-red hover:text-jay-red')}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-jay-elevated/30 p-8 text-center transition-colors hover:border-jay-red hover:bg-white/[0.03]">
                <Upload size={24} className="text-jay-red" />
                <span className="text-sm font-medium text-gray-300">Agregar fotografías</span>
                <span className="text-[11px] text-gray-600">JPG, PNG o WebP · hasta 10 por carga</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleNewImages}
                  className="hidden"
                />
              </label>
              {imageCount > 0 && (
                <p className="mt-4 text-xs text-gray-500">{imageCount} fotografía(s) en total.</p>
              )}
            </section>
          )}

          {/* Paso 5 — Publicación */}
          {step === 5 && (
            <section className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display text-xs font-extrabold tracking-[0.2em] text-jay-red">05</span>
                <span className="h-px w-8 bg-jay-red" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Publicación</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-jay-elevated/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Publicación</p>
                  <p className="mt-2 truncate text-sm font-semibold text-white">{form.title || 'Sin título'}</p>
                  <p className="mt-1 text-xs text-gray-500">{form.year} · {form.currency} {form.price || '—'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-jay-elevated/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Estado</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {form.condition === 'NUEVA' ? '0 km' : 'Usada'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {form.usageHours && form.condition === 'USADA'
                      ? `${form.usageHours} horas de uso`
                      : 'Horas de uso: sin dato'}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-jay-elevated/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Contenido</p>
                  <p className="mt-2 text-sm font-semibold text-white">{imageCount} foto(s)</p>
                  <p className="mt-1 text-xs text-gray-500">{features.filter((f) => f.key && f.value).length} característica(s)</p>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-jay-red focus:ring-jay-red"
                />
                <span className="text-sm font-medium text-gray-300">Destacar en la portada</span>
              </label>

              <div className="mt-6 space-y-2 border-l-2 border-jay-red bg-jay-elevated/40 p-4 text-xs leading-relaxed text-gray-400">
                <p><strong className="text-white">Guardar como borrador:</strong> queda guardado y solo se ve desde este panel.</p>
                <p><strong className="text-white">Publicar:</strong> la moto pasa a estar disponible en el catálogo público.</p>
              </div>
            </section>
          )}

          {/* Navegación entre pasos y acciones finales */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((current) => current - 1)}
                  className={cn(buttonClass, 'border-white/10 text-gray-300 hover:bg-white/5')}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {step < 5 && (
                <button
                  type="button"
                  disabled={!validSteps[step]}
                  onClick={() => setStep((current) => current + 1)}
                  className={cn(
                    buttonClass,
                    'border-jay-red bg-jay-red text-white hover:bg-black disabled:border-white/10 disabled:bg-white/5 disabled:text-gray-600'
                  )}
                >
                  Siguiente <ArrowRight size={16} />
                </button>
              )}
              {step === 5 && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save('BORRADOR')}
                    className={cn(buttonClass, 'border-white/15 text-gray-300 hover:border-white/40 hover:text-white')}
                  >
                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar como borrador'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={cn(buttonClass, 'border-jay-red bg-jay-red text-white hover:bg-black')}
                  >
                    <Send size={16} /> {saving ? 'Publicando...' : 'Publicar'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
