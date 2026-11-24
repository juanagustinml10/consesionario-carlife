import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CircleHelp,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Info,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

import { Link } from '@/components/shared/Link';
import { bikesService, type CreateBikeInput } from '@/services/bikes';
import type { Bike, BikeCondition, BikeImage, BikeStatus, BikeUsage } from '@/types';
import { cn } from '@/lib/utils';
import { BIKE_USAGES, MAX_IMAGES_PER_BIKE, MAX_MODEL_YEAR, MODEL_YEARS } from '@/lib/constants';
import { usageLabel } from '@/lib/format';
import { getThumbnailUrl } from '@/lib/images';

const STEPS = [
  { id: 1, label: 'Datos', hint: 'Identificá el vehículo' },
  { id: 2, label: 'Estado', hint: 'Solo autos usados' },
  { id: 3, label: 'Detalles', hint: 'Ficha y características' },
  { id: 4, label: 'Fotografías', hint: 'Subí y ordená fotos' },
  { id: 5, label: 'Publicación', hint: 'Revisá y guardá' },
] as const;

const inputClass =
  'w-full rounded-none border border-white/15 bg-cc-carbon px-4 py-3.5 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-white focus:ring-1 focus:ring-white/20';
const labelClass = 'mb-2 block text-xs font-bold uppercase tracking-wider text-white/70';
const cardClass = 'rounded-none border border-white/15 bg-cc-carbon p-5 sm:p-8';
const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-none border px-5 py-3 font-display text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const iconButtonClass =
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-white/15 bg-cc-carbon text-white/70 transition-colors hover:border-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30';
const stepHeadingClass = 'mb-6 flex items-center gap-3';
const stepEyebrowClass = 'text-xs font-bold tracking-[0.2em] text-white/70';
const stepTitleClass = 'text-sm font-semibold uppercase tracking-wider text-white/70';

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
  /** '' representa "Sin definir" y se envía como null a la API. */
  usage: BikeUsage | '';
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
  year: MAX_MODEL_YEAR,
  price: '',
  currency: 'ARS',
  condition: 'USADA',
  usage: '',
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
  const [loading, setLoading] = useState(isEdit);
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
          condition: 'USADA',
          usage: b.usage ?? '',
          displacementCc: String(b.displacementCc ?? ''),
          mileageKm: String(b.mileageKm ?? ''),
          usageHours: b.usageHours ? String(b.usageHours) : '',
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
    }

    return () => {
      active = false;
    };
  }, [isEdit, id]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validSteps: Record<number, boolean> = {
    1: Boolean(form.title.trim()) && Boolean(form.brandId) && Boolean(form.model.trim()) && Number(form.price) > 0,
    2: form.condition === 'USADA',
    3: true,
    4: true,
    5: true,
  };
  const canSave = [1, 2, 3, 4].every((number) => validSteps[number]);

  const updateFeature = (index: number, patch: Partial<FeatureDraft>) =>
    setFeatures((prev) => prev.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));

  const handleNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      setNewImages((prev) => {
        const room = Math.max(
          0,
          MAX_IMAGES_PER_BIKE - existingImages.length - prev.length,
        );
        return [...prev, ...files.slice(0, room)];
      });
    }
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
        usage: form.usage || null,
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
      <div className="py-20">
        <p className="text-sm text-white/50">Cargando publicación…</p>
      </div>
    );
  }

  const imageCount = existingImages.length + newImages.length;

  return (
    <div className="pb-16">
      <div className="mb-7 border-b border-white/15 pb-6">
        <Link
          to="/admin/motos"
          className="mb-4 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Volver al listado
        </Link>
        <span className="micro-label text-white/70">
          {isEdit ? 'Edición' : 'Alta'} / Catálogo
        </span>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-white sm:text-4xl">
          {isEdit ? 'Editar publicación' : 'Nueva publicación'}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Completá los pasos en orden. Podés guardar como borrador cuando quieras.
        </p>
      </div>

        {error && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-none border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
            <Info size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Pasos: se navega hacia adelante solo con los datos válidos. */}
        <nav aria-label="Pasos de la publicación" className="mb-8 rounded-none border border-white/15 bg-cc-carbon p-3 sm:p-4">
          <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
            Paso {step} de {STEPS.length}
          </p>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {STEPS.map((item) => {
              const active = step === item.id;
              const done = step > item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={item.id > step}
                    aria-current={active ? 'step' : undefined}
                    onClick={() => setStep(item.id)}
                    className={cn(
                      'flex h-full w-full flex-col items-start gap-2 rounded-none border px-3 py-3 text-left transition-colors',
                      active
                        ? 'border-white bg-white/10'
                        : done
                          ? 'border-white/15 bg-cc-black hover:border-white/15'
                          : 'border-white/15 bg-transparent opacity-60'
                    )}
                  >
                    <span className="flex w-full items-center gap-2">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-none text-[10px] font-bold',
                          active ? 'bg-white text-cc-black' : done ? 'bg-white/10 text-white/70' : 'bg-cc-carbon text-white/35'
                        )}
                      >
                        {done ? <Check size={12} /> : item.id}
                      </span>
                      <span className={cn(
                        'min-w-0 break-words text-xs font-bold uppercase tracking-wider',
                        active ? 'text-white' : done ? 'text-white/70' : 'text-white/35'
                      )}>
                        {item.label}
                      </span>
                    </span>
                    <span className="text-[11px] leading-tight text-white/50">{item.hint}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <form onSubmit={(event) => { event.preventDefault(); void save('DISPONIBLE'); }}>
          {/* Paso 1 — Datos */}
          {step === 1 && (
            <section className={cardClass}>
              <div className={stepHeadingClass}>
                <span className={stepEyebrowClass}>01</span>
                <span className="h-px w-8 bg-cc-carbon" />
                <h2 className={stepTitleClass}>Datos</h2>
              </div>
              <p className="-mt-2 mb-6 text-sm text-white/50">
                Lo básico para identificar el vehículo en el catálogo.
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <label htmlFor="bike-title" className={labelClass}>Título de la publicación</label>
                  <input
                    id="bike-title"
                    required
                    value={form.title}
                    onChange={(event) => update('title', event.target.value)}
                    placeholder="Ej.: Toyota Corolla 2022"
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
                  <label htmlFor="bike-year" className={labelClass}>Año</label>
                  <select
                    id="bike-year"
                    value={String(form.year)}
                    onChange={(event) => update('year', Number(event.target.value))}
                    className={inputClass}
                  >
                    {MODEL_YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-price" className={labelClass}>Precio</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
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
              <div className={stepHeadingClass}>
                <span className={stepEyebrowClass}>02</span>
                <span className="h-px w-8 bg-cc-carbon" />
                <h2 className={stepTitleClass}>Estado</h2>
              </div>
              <p className="-mt-2 mb-6 text-sm text-white/50">
                En CARLIFE publicamos únicamente autos usados.
              </p>
              <div className="flex min-h-36 flex-col items-start gap-3 rounded-none border border-white bg-white/10 p-5">
                <span className="flex w-full items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-none bg-cc-carbon text-white">
                    <Check size={20} />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-none bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    <Check size={12} /> Seleccionada
                  </span>
                </span>
                <span className="font-display text-xl font-bold text-white">Usado</span>
                <span className="max-w-xs text-xs leading-relaxed text-white/50">
                  Podés cargar kilómetros y horas de uso (opcional).
                </span>
              </div>
            </section>
          )}

          {/* Paso 3 — Detalles */}
          {step === 3 && (
            <section className={cardClass}>
              <div className={stepHeadingClass}>
                <span className={stepEyebrowClass}>03</span>
                <span className="h-px w-8 bg-cc-carbon" />
                <h2 className={stepTitleClass}>Detalles</h2>
              </div>
              <p className="-mt-2 mb-6 text-sm text-white/50">
                Sumá información técnica y características. Todo es opcional.
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="bike-usage" className={labelClass}>Uso</label>
                  <select
                    id="bike-usage"
                    value={form.usage}
                    onChange={(event) => update('usage', event.target.value as BikeUsage | '')}
                    className={inputClass}
                  >
                    <option value="">Sin definir</option>
                    {BIKE_USAGES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  <p className="text-[11px] leading-relaxed text-white/50">
                    Define el bloque del catálogo en el que aparece la publicación.
                  </p>
                </div>
                {form.condition === 'USADA' && (
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
                )}
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
                    <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-white/50">
                      <CircleHelp size={13} className="mt-0.5 shrink-0" />
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
                    <p className="text-[11px] text-white/50">
                      Pares clave / valor. Ejemplo: Motor · 2.0 L.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={features.length >= 30}
                    onClick={() => setFeatures((prev) => [...prev, { key: '', value: '' }])}
                    className={cn(buttonClass, 'w-full border-white/15 text-white/70 hover:border-white hover:text-white sm:w-auto')}
                  >
                    <Plus size={16} /> Agregar característica
                  </button>
                </div>
                <div className="space-y-3">
                  {features.length === 0 && (
                    <p className="rounded-none border border-dashed border-white/15 px-4 py-6 text-center text-xs text-white/35">
                      Sin características cargadas.
                    </p>
                  )}
                  {features.map((feature, index) => (
                    <div key={feature.id ?? `nueva-${index}`} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        aria-label={`Nombre de la característica ${index + 1}`}
                        placeholder="Ej.: Transmisión"
                        maxLength={80}
                        value={feature.key}
                        onChange={(event) => updateFeature(index, { key: event.target.value })}
                        className={inputClass}
                      />
                      <input
                        aria-label={`Valor de la característica ${index + 1}`}
                        placeholder="Ej.: Automática CVT"
                        maxLength={200}
                        value={feature.value}
                        onChange={(event) => updateFeature(index, { value: event.target.value })}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        aria-label={`Eliminar característica ${index + 1}`}
                        onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== index))}
                        className={cn(iconButtonClass, 'h-11 w-11 sm:h-[52px] sm:w-[52px] hover:border-white hover:text-white')}
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
              <div className={stepHeadingClass}>
                <span className={stepEyebrowClass}>04</span>
                <span className="h-px w-8 bg-cc-carbon" />
                <h2 className={stepTitleClass}>Fotografías</h2>
              </div>
              <p className="-mt-2 mb-4 text-sm text-white/50">
                Subí imágenes, elegí la portada y ordenálas. Se guardan al guardar la publicación.
              </p>
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/50">
                <span>↑ ↓ = ordenar</span>
                <span>✓ = usar como portada</span>
                <span>✕ = quitar</span>
              </div>

              {existingImages.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/50">Fotos de la publicación</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {existingImages.map((image, index) => (
                      <div key={image.id} className="overflow-hidden rounded-none border border-white/15 bg-cc-black">
                        <div className="relative aspect-square">
                          <img src={getThumbnailUrl(image.url)} alt="" className="h-full w-full object-cover" />
                          {image.isPrimary && (
                            <span className="absolute left-2 top-2 rounded-none border border-white/15 bg-cc-black/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                              Portada
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1 border-t border-white/15 bg-cc-black p-2">
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
                            className={iconButtonClass}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-white/50">Fotos nuevas (se suben al guardar)</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {newImages.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex min-h-40 flex-col items-center justify-between gap-3 rounded-none border border-dashed border-white/15 bg-cc-black p-3">
                        <div className="flex w-full flex-col items-center gap-2 pt-2">
                          <ImageIcon size={24} className="text-white/50" />
                          <span className="w-full truncate text-center text-[10px] text-white/50">{file.name}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          <button
                            type="button"
                            aria-label={`Mover foto nueva ${index + 1} antes`}
                            disabled={index === 0}
                            onClick={() => moveNew(index, -1)}
                            className={iconButtonClass}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Mover foto nueva ${index + 1} después`}
                            disabled={index === newImages.length - 1}
                            onClick={() => moveNew(index, 1)}
                            className={iconButtonClass}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Quitar foto nueva ${index + 1}`}
                            onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))}
                            className={iconButtonClass}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-none border border-dashed border-white/15 bg-cc-black/40 p-8 text-center transition-colors hover:border-white hover:bg-cc-carbon/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-none bg-white/10">
                  <Upload size={24} className="text-white/70" />
                </span>
                <span className="text-sm font-semibold text-white">Tocá para agregar fotografías</span>
                <span className="text-[11px] text-white/50">JPG, PNG o WebP · hasta {MAX_IMAGES_PER_BIKE} fotos por publicación</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleNewImages}
                  className="hidden"
                />
              </label>
              {imageCount > 0 && (
                <p className="mt-4 text-xs text-white/50">{imageCount} fotografía(s) en total.</p>
              )}
            </section>
          )}

          {/* Paso 5 — Publicación */}
          {step === 5 && (
            <section className={cardClass}>
              <div className={stepHeadingClass}>
                <span className={stepEyebrowClass}>05</span>
                <span className="h-px w-8 bg-cc-carbon" />
                <h2 className={stepTitleClass}>Publicación</h2>
              </div>
              <p className="-mt-2 mb-6 text-sm text-white/50">
                Revisá el resumen y elegí cómo guardar.
              </p>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">El vehículo</p>
                  <p className="mt-2 truncate text-sm font-semibold text-white">{form.title || 'Sin título'}</p>
                  <p className="mt-1 text-xs text-white/50">{form.year} · {form.currency} {form.price || '—'}</p>
                  <p className="mt-1 text-xs text-white/50">Uso: {usageLabel(form.usage || null)}</p>
                </div>
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Estado</p>
                  <p className="mt-2 text-sm font-semibold text-white">Usado</p>
                  <p className="mt-1 text-xs text-white/50">
                    {form.usageHours ? `${form.usageHours} horas de uso` : 'Horas de uso: sin dato'}
                  </p>
                </div>
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    <FileText size={12} /> Contenido
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{imageCount} foto(s)</p>
                  <p className="mt-1 text-xs text-white/50">{features.filter((f) => f.key && f.value).length} característica(s)</p>
                </div>
              </div>

              <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => update('featured', event.target.checked)}
                  className="h-5 w-5 rounded border-white/15 bg-transparent text-white/70 focus:ring-white/40"
                />
                <span className="text-sm font-medium text-white/70">Destacar en la portada</span>
              </label>

              <p className="mb-3 mt-8 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Elegí qué hacer con esta publicación
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-none bg-cc-black text-white/70">
                      <EyeOff size={18} />
                    </span>
                    <span className="rounded-none border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Privado
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">Guardar como borrador</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Queda guardado y solo se ve desde este panel. Podés seguir editando después.
                  </p>
                </div>
                <div className="rounded-none border border-white/30 bg-cc-carbon/[0.06] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-none bg-white/15 text-white">
                      <Sparkles size={18} />
                    </span>
                    <span className="rounded-none border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Visible
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">Publicar</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    El vehículo pasa a estar disponible en el catálogo público.
                  </p>
                </div>
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-none bg-white/10 text-white/70">
                      <Info size={18} />
                    </span>
                    <span className="rounded-none border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Visible
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">Marcar como reservada</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Sigue en el catálogo con la leyenda “Reservada”.
                  </p>
                </div>
                <div className="rounded-none border border-white/15 bg-cc-black p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-none bg-cc-black text-white/50">
                      <Check size={18} />
                    </span>
                    <span className="rounded-none border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Visible
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">Marcar como vendida</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    Sigue en el catálogo con la leyenda “Vendida”.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Navegación entre pasos y acciones finales */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((current) => current - 1)}
                  className={cn(buttonClass, 'w-full border-white/15 text-white/70 hover:bg-cc-black sm:w-auto')}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {step < 5 && (
                <button
                  type="button"
                  disabled={!validSteps[step]}
                  onClick={() => setStep((current) => current + 1)}
                  className={cn(
                    buttonClass,
                    'w-full border-white bg-cc-carbon text-white hover:bg-white/15 disabled:border-white/15 disabled:bg-cc-black disabled:text-white/35 sm:w-auto'
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
                    className={cn(
                      buttonClass,
                      'w-full border-white/15 bg-transparent text-white/70 hover:border-white/40 hover:bg-cc-black hover:text-white sm:w-auto'
                    )}
                  >
                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar como borrador'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={cn(
                      buttonClass,
                      'w-full border-white bg-cc-carbon text-white hover:bg-white/15 sm:w-auto'
                    )}
                  >
                    <Send size={16} /> {saving ? 'Publicando...' : 'Publicar'}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save('RESERVADA')}
                    className={cn(
                      buttonClass,
                      'w-full border-white/40 bg-transparent text-white/70 hover:bg-white/10 sm:w-auto'
                    )}
                  >
                    <Info size={16} /> {saving ? 'Guardando...' : 'Reservada'}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void save('VENDIDA')}
                    className={cn(
                      buttonClass,
                      'w-full border-white/15 bg-transparent text-white/70 hover:border-white/40 hover:text-white sm:w-auto'
                    )}
                  >
                    <Check size={16} /> {saving ? 'Guardando...' : 'Vendida'}
                  </button>
                </>
              )}
            </div>
          </div>
      </form>
    </div>
  );
};
