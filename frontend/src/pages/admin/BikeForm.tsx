import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
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
import type {
  Bike,
  BikeCondition,
  BikeImage,
  BikeStatus,
  DriveType,
  FuelType,
  TransmissionType,
  VehicleCategory,
} from '@/types';
import { cn } from '@/lib/utils';
import {
  BUSINESS,
  DRIVE_TYPES,
  FUEL_TYPES,
  MAX_IMAGES_PER_BIKE,
  MAX_MODEL_YEAR,
  MODEL_YEARS,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  VEHICLE_CONDITIONS,
  VEHICLE_EQUIPMENT,
} from '@/lib/constants';
import {
  fuelLabel,
  transmissionLabel,
  vehicleCategoryLabel,
} from '@/lib/format';
import { getThumbnailUrl } from '@/lib/images';

const STEPS = [
  { id: 1, label: 'Información general', hint: 'Identificá el vehículo' },
  { id: 2, label: 'Datos técnicos', hint: 'Motor, caja y tracción' },
  { id: 3, label: 'Equipamiento', hint: 'Marcá lo que incluye' },
  { id: 4, label: 'Fotografías', hint: 'Subí, ordená y elegí portada' },
  { id: 5, label: 'Precio y financiación', hint: 'Valor y créditos prendarios' },
  { id: 6, label: 'Publicación', hint: 'Revisá y guardá' },
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

/** Foto seleccionada en el dispositivo; `preview` se libera al quitarla o al salir. */
interface NewImage {
  id: string;
  file: File;
  preview: string;
}

interface FormValues {
  title: string;
  brandId: string;
  model: string;
  version: string;
  year: number;
  /** '' obliga a elegir el tipo antes de guardar. */
  vehicleCategory: VehicleCategory | '';
  condition: BikeCondition;
  color: string;
  fuel: FuelType | '';
  transmission: TransmissionType | '';
  drive: DriveType | '';
  engine: string;
  powerHp: string;
  doors: string;
  seats: string;
  mileageKm: string;
  description: string;
  price: string;
  currency: string;
  financingAvailable: boolean;
  featured: boolean;
}

const emptyForm: FormValues = {
  title: '',
  brandId: '',
  model: '',
  version: '',
  year: MAX_MODEL_YEAR,
  vehicleCategory: '',
  condition: 'USADA',
  color: '',
  fuel: '',
  transmission: '',
  drive: '',
  engine: '',
  powerHp: '',
  doors: '',
  seats: '',
  mileageKm: '',
  description: '',
  price: '',
  currency: 'ARS',
  financingAvailable: false,
  featured: false,
};

const byOrder = (a: BikeImage, b: BikeImage) => a.order - b.order;
const optionalNumber = (value: string) => (value.trim() === '' ? null : Number(value));
const optionalText = (value: string) => value.trim() || null;
const knownEquipmentKeys = new Set<string>(VEHICLE_EQUIPMENT.map((item) => item.key));

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
  const [equipment, setEquipment] = useState<string[]>([]);
  const [customFeatures, setCustomFeatures] = useState<FeatureDraft[]>([]);
  const [existingImages, setExistingImages] = useState<BikeImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [newPrimaryId, setNewPrimaryId] = useState<string | null>(null);
  const newImagesRef = useRef<NewImage[]>([]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => () => {
    newImagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

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
          version: b.version ?? '',
          year: b.year,
          vehicleCategory: b.vehicleCategory ?? '',
          condition: 'USADA',
          color: b.color ?? '',
          fuel: b.fuel ?? '',
          transmission: b.transmission ?? '',
          drive: b.drive ?? '',
          engine: b.engine ?? '',
          powerHp: b.powerHp ? String(b.powerHp) : '',
          doors: b.doors ? String(b.doors) : '',
          seats: b.seats ? String(b.seats) : '',
          mileageKm: b.mileageKm == null ? '' : String(b.mileageKm),
          description: b.description ?? '',
          price: String(b.price),
          currency: b.currency,
          financingAvailable: b.financingAvailable,
          featured: b.featured,
        });
        setEquipment(b.features
          .filter((feature) => knownEquipmentKeys.has(feature.key))
          .map((feature) => feature.key));
        // Las claves personalizadas (y cualquier dato heredado) se conservan.
        setCustomFeatures(b.features
          .filter((feature) => !knownEquipmentKeys.has(feature.key))
          .map((feature) => ({ id: feature.id, key: feature.key, value: feature.value })));
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
    1: Boolean(form.title.trim()) && Boolean(form.brandId) && Boolean(form.model.trim()) &&
       Boolean(form.vehicleCategory) && Number(form.year) > 0,
    2: true,
    3: true,
    4: true,
    5: Number(form.price) > 0,
    6: true,
  };
  const canSave = validSteps[1] && validSteps[5];

  const toggleEquipment = (key: string) =>
    setEquipment((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );

  const updateCustomFeature = (index: number, patch: Partial<FeatureDraft>) =>
    setCustomFeatures((prev) => prev.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));

  const handleNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      setNewImages((prev) => {
        const room = Math.max(0, MAX_IMAGES_PER_BIKE - existingImages.length - prev.length);
        const added = files.slice(0, room).map((file) => ({
          id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID()}`,
          file,
          preview: URL.createObjectURL(file),
        }));
        if (existingImages.length === 0 && prev.length === 0 && added.length > 0) {
          setNewPrimaryId(added[0].id);
        }
        return [...prev, ...added];
      });
    }
    event.target.value = '';
  };

  const removeNewImage = (imageId: string) => {
    setNewImages((prev) => {
      const removed = prev.find((image) => image.id === imageId);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((image) => image.id !== imageId);
    });
    setNewPrimaryId((current) => (current === imageId ? null : current));
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
      setStep(!validSteps[1] ? 1 : 5);
      setError('Completá título, marca, modelo, tipo de vehículo y precio antes de guardar.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const features = [
        ...equipment.map((key) => ({ key, value: 'Sí' })),
        ...customFeatures
          .filter((feature) => feature.key.trim() && feature.value.trim() &&
            !equipment.includes(feature.key.trim()))
          .map((feature) => ({ key: feature.key.trim(), value: feature.value.trim() })),
      ];

      const input: CreateBikeInput = {
        title: form.title.trim(),
        brandId: form.brandId,
        model: form.model.trim(),
        version: optionalText(form.version),
        year: form.year,
        vehicleCategory: form.vehicleCategory as VehicleCategory,
        condition: form.condition,
        color: optionalText(form.color),
        fuel: form.fuel || null,
        transmission: form.transmission || null,
        drive: form.drive || null,
        engine: optionalText(form.engine),
        powerHp: optionalNumber(form.powerHp),
        doors: optionalNumber(form.doors),
        seats: optionalNumber(form.seats),
        mileageKm: optionalNumber(form.mileageKm),
        financingAvailable: form.financingAvailable,
        price: Number(form.price),
        currency: form.currency,
        description: optionalText(form.description),
        features,
        status,
        featured: form.featured,
      };

      let saved: Bike;
      if (isEdit && bike) saved = await bikesService.update(bike.id, input);
      else saved = await bikesService.create(input);

      if (newImages.length > 0) {
        const previousIds = new Set(existingImages.map((image) => image.id));
        const result = await bikesService.uploadImages(saved.id, newImages.map((image) => image.file));
        const added = result.images.filter((image) => !previousIds.has(image.id));
        const primaryIndex = newImages.findIndex((image) => image.id === newPrimaryId);
        const target = primaryIndex >= 0 ? added[primaryIndex] : undefined;
        if (target && !target.isPrimary) {
          await bikesService.setPrimaryImage(saved.id, target.id);
        }
      }
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
  const equipmentCount = equipment.length;

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
          {isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Completá las seis secciones. Podés guardar como borrador cuando quieras.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-none border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
          <Info size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Las secciones se navegan hacia adelante solo con los datos válidos. */}
      <nav aria-label="Secciones de la publicación" className="mb-8 rounded-none border border-white/15 bg-cc-carbon p-3 sm:p-4">
        <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
          Sección {step} de {STEPS.length}
        </p>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
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
                  <span className="flex w-full items-start gap-2">
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-none text-[10px] font-bold',
                        active ? 'bg-white text-cc-black' : done ? 'bg-white/10 text-white/70' : 'bg-cc-carbon text-white/35'
                      )}
                    >
                      {done ? <Check size={12} /> : item.id}
                    </span>
                    <span className={cn(
                      'min-w-0 break-words text-[11px] font-bold uppercase leading-tight tracking-wider',
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
        {/* 1 — Información general */}
        {step === 1 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>01</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Información general</h2>
            </div>
            <p className="-mt-2 mb-6 text-sm text-white/50">
              Los datos principales para identificar el vehículo en el catálogo.
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
                  placeholder="Ej.: Corolla"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-version" className={labelClass}>Versión</label>
                <input
                  id="bike-version"
                  value={form.version}
                  onChange={(event) => update('version', event.target.value)}
                  placeholder="Ej.: XEI 1.8 CVT"
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
                <label htmlFor="bike-category" className={labelClass}>Tipo de vehículo</label>
                <select
                  id="bike-category"
                  required
                  value={form.vehicleCategory}
                  onChange={(event) => update('vehicleCategory', event.target.value as VehicleCategory | '')}
                  className={inputClass}
                >
                  <option value="">Seleccionar tipo</option>
                  {VEHICLE_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-condition" className={labelClass}>Estado del vehículo</label>
                <select
                  id="bike-condition"
                  value={form.condition}
                  onChange={(event) => update('condition', event.target.value as BikeCondition)}
                  className={inputClass}
                >
                  {VEHICLE_CONDITIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <p className="text-[11px] leading-relaxed text-white/50">
                  En CARLIFE publicamos únicamente vehículos usados.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-color" className={labelClass}>Color</label>
                <input
                  id="bike-color"
                  value={form.color}
                  onChange={(event) => update('color', event.target.value)}
                  placeholder="Ej.: Gris metalizado"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-km" className={labelClass}>Kilometraje (km)</label>
                <input
                  id="bike-km"
                  type="number"
                  min="0"
                  value={form.mileageKm}
                  onChange={(event) => update('mileageKm', event.target.value)}
                  placeholder="Ej.: 85000"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                <label htmlFor="bike-description" className={labelClass}>Descripción general</label>
                <textarea
                  id="bike-description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => update('description', event.target.value)}
                  placeholder="Contá las características principales del vehículo…"
                  className={cn(inputClass, 'resize-y')}
                />
              </div>
            </div>
          </section>
        )}

        {/* 2 — Datos técnicos */}
        {step === 2 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>02</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Datos técnicos</h2>
            </div>
            <p className="-mt-2 mb-6 text-sm text-white/50">
              Completá solo los datos disponibles. Los campos vacíos se muestran como «A confirmar».
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="bike-engine" className={labelClass}>Motor / cilindrada</label>
                <input
                  id="bike-engine"
                  value={form.engine}
                  onChange={(event) => update('engine', event.target.value)}
                  placeholder="Ej.: 2.0 L"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-power" className={labelClass}>Potencia (CV)</label>
                <input
                  id="bike-power"
                  type="number"
                  min="0"
                  value={form.powerHp}
                  onChange={(event) => update('powerHp', event.target.value)}
                  placeholder="Ej.: 150"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-fuel" className={labelClass}>Combustible</label>
                <select
                  id="bike-fuel"
                  value={form.fuel}
                  onChange={(event) => update('fuel', event.target.value as FuelType | '')}
                  className={inputClass}
                >
                  <option value="">Sin definir</option>
                  {FUEL_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-transmission" className={labelClass}>Transmisión</label>
                <select
                  id="bike-transmission"
                  value={form.transmission}
                  onChange={(event) => update('transmission', event.target.value as TransmissionType | '')}
                  className={inputClass}
                >
                  <option value="">Sin definir</option>
                  {TRANSMISSIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bike-drive" className={labelClass}>Tracción</label>
                <select
                  id="bike-drive"
                  value={form.drive}
                  onChange={(event) => update('drive', event.target.value as DriveType | '')}
                  className={inputClass}
                >
                  <option value="">Sin definir</option>
                  {DRIVE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bike-doors" className={labelClass}>Puertas</label>
                  <input
                    id="bike-doors"
                    type="number"
                    min="0"
                    value={form.doors}
                    onChange={(event) => update('doors', event.target.value)}
                    placeholder="Ej.: 4"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bike-seats" className={labelClass}>Asientos</label>
                  <input
                    id="bike-seats"
                    type="number"
                    min="0"
                    value={form.seats}
                    onChange={(event) => update('seats', event.target.value)}
                    placeholder="Ej.: 5"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 flex items-start gap-1.5 text-[11px] leading-relaxed text-white/50">
              <CircleHelp size={13} className="mt-0.5 shrink-0" />
              No todos los datos deben estar completos: dejá en blanco lo que se desconozca.
            </p>
          </section>
        )}

        {/* 3 — Equipamiento */}
        {step === 3 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>03</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Equipamiento</h2>
            </div>
            <p className="-mt-2 mb-6 text-sm text-white/50">
              Seleccioná todas las características que incluye el vehículo.
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {VEHICLE_EQUIPMENT.map((item) => {
                const checked = equipment.includes(item.key);
                return (
                  <label
                    key={item.key}
                    className={cn(
                      'flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors',
                      checked
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEquipment(item.key)}
                      className="h-5 w-5 shrink-0 rounded border-white/15 bg-transparent text-white focus:ring-white/40"
                    />
                    {item.label}
                  </label>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-white/50">
              {equipmentCount} característica{equipmentCount !== 1 ? 's' : ''} seleccionada{equipmentCount !== 1 ? 's' : ''}.
            </p>

            <div className="mt-10 border-t border-white/15 pt-8">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={labelClass}>Características adicionales</p>
                  <p className="text-[11px] text-white/50">
                    Sumá otro equipamiento o datos que no estén en la lista. Ejemplo: Cubiertas · Nuevas.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={customFeatures.length >= 30}
                  onClick={() => setCustomFeatures((prev) => [...prev, { key: '', value: '' }])}
                  className={cn(buttonClass, 'w-full border-white/15 text-white/70 hover:border-white hover:text-white sm:w-auto')}
                >
                  <Plus size={16} /> Agregar característica
                </button>
              </div>
              <div className="space-y-3">
                {customFeatures.length === 0 && (
                  <p className="rounded-none border border-dashed border-white/15 px-4 py-6 text-center text-xs text-white/35">
                    Sin características adicionales.
                  </p>
                )}
                {customFeatures.map((feature, index) => (
                  <div key={feature.id ?? `nueva-${index}`} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      aria-label={`Nombre de la característica ${index + 1}`}
                      placeholder="Ej.: Cubiertas"
                      maxLength={80}
                      value={feature.key}
                      onChange={(event) => updateCustomFeature(index, { key: event.target.value })}
                      className={inputClass}
                    />
                    <input
                      aria-label={`Valor de la característica ${index + 1}`}
                      placeholder="Ej.: Nuevas"
                      maxLength={200}
                      value={feature.value}
                      onChange={(event) => updateCustomFeature(index, { value: event.target.value })}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      aria-label={`Eliminar característica ${index + 1}`}
                      onClick={() => setCustomFeatures((prev) => prev.filter((_, i) => i !== index))}
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

        {/* 4 — Fotografías */}
        {step === 4 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>04</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Fotografías</h2>
            </div>
            <p className="-mt-2 mb-4 text-sm text-white/50">
              Subí imágenes, elegí la portada y ordenálas. Las fotos nuevas se suben al guardar.
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
                  {newImages.map((image, index) => (
                    <div key={image.id} className="overflow-hidden rounded-none border border-dashed border-white/15 bg-cc-black">
                      <div className="relative aspect-square">
                        <img src={image.preview} alt={`Vista previa de ${image.file.name}`} className="h-full w-full object-cover" />
                        {newPrimaryId === image.id ? (
                          <span className="absolute left-2 top-2 rounded-none border border-white/15 bg-cc-black/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            Portada
                          </span>
                        ) : (
                          <button
                            type="button"
                            title="Usar como portada"
                            aria-label={`Usar foto nueva ${index + 1} como portada`}
                            onClick={() => setNewPrimaryId(image.id)}
                            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center border border-white/15 bg-cc-black/90 text-white/70 transition-colors hover:text-white"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <p className="truncate border-t border-white/15 px-2 py-2 text-[10px] text-white/50">{image.file.name}</p>
                      <div className="flex flex-wrap items-center justify-center gap-1 border-t border-white/15 p-2">
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
                          onClick={() => removeNewImage(image.id)}
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
              <span className="text-[11px] text-white/50">
                JPG, PNG o WebP · hasta {MAX_IMAGES_PER_BIKE} fotos por publicación · se suben de a una
              </span>
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

        {/* 5 — Precio y financiación */}
        {step === 5 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>05</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Precio y financiación</h2>
            </div>
            <p className="-mt-2 mb-6 text-sm text-white/50">
              Definí el precio publicado e indicá si la unidad admite créditos prendarios.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
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
                    className={cn(inputClass, 'w-24 px-2')}
                  >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-8">
              <label className="flex min-h-14 cursor-pointer items-start gap-3 select-none">
                <input
                  type="checkbox"
                  checked={form.financingAvailable}
                  onChange={(event) => update('financingAvailable', event.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-white/15 bg-transparent text-white focus:ring-white/40"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">
                    Admite financiación mediante créditos prendarios
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/50">
                    Marcá esta opción solo si el vehículo puede financiarse de esa forma.
                  </span>
                </span>
              </label>
              {form.financingAvailable && (
                <div className="mt-5 border-l-2 border-white bg-white/5 p-5">
                  <p className="text-xs leading-relaxed text-white/70">{BUSINESS.financingMessage}</p>
                  <p className="mt-3 text-[11px] text-white/45">
                    No se publican cuotas, tasas ni condiciones específicas: se confirman al consultar.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6 — Publicación */}
        {step === 6 && (
          <section className={cardClass}>
            <div className={stepHeadingClass}>
              <span className={stepEyebrowClass}>06</span>
              <span className="h-px w-8 bg-cc-carbon" />
              <h2 className={stepTitleClass}>Publicación</h2>
            </div>
            <p className="-mt-2 mb-6 text-sm text-white/50">
              Revisá el resumen y elegí cómo guardar.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-none border border-white/15 bg-cc-black p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">El vehículo</p>
                <p className="mt-2 truncate text-sm font-semibold text-white">{form.title || 'Sin título'}</p>
                <p className="mt-1 text-xs text-white/50">
                  {vehicleCategoryLabel(form.vehicleCategory || null)} · {form.year}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {brands.find((brand) => brand.id === form.brandId)?.name ?? 'Sin marca'} {form.model}
                  {form.version ? ` ${form.version}` : ''}
                </p>
              </div>
              <div className="rounded-none border border-white/15 bg-cc-black p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Datos principales</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {form.fuel ? fuelLabel(form.fuel) : 'Combustible sin definir'}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {form.transmission ? transmissionLabel(form.transmission) : 'Transmisión sin definir'}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {form.mileageKm ? `${Number(form.mileageKm).toLocaleString('es-AR')} km` : 'Kilometraje sin dato'}
                </p>
              </div>
              <div className="rounded-none border border-white/15 bg-cc-black p-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                  <FileText size={12} /> Contenido
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{imageCount} foto(s)</p>
                <p className="mt-1 text-xs text-white/50">{equipmentCount} equipamiento(s)</p>
                <p className="mt-1 text-xs text-white/50">{customFeatures.length} característica(s) adicional(es)</p>
              </div>
              <div className="rounded-none border border-white/15 bg-cc-black p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Precio y financiación</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {form.currency} {form.price ? Number(form.price).toLocaleString('es-AR') : '—'}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {form.financingAvailable ? 'Créditos prendarios: disponible' : 'Créditos prendarios: no indicado'}
                </p>
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

        {/* Navegación entre secciones y acciones finales */}
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
            {step < 6 && (
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
            {step === 6 && (
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
