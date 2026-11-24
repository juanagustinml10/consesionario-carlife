import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';

export { saveUploadedFile, deleteUploadedFile } from './storage.service.js';
export type { StoredUpload } from './storage.service.js';

type BikeStatusValue = 'BORRADOR' | 'DISPONIBLE' | 'RESERVADA' | 'VENDIDA';
export type VehicleCategoryValue = 'AUTO' | 'CAMIONETA_SUV';
export type FuelTypeValue = 'NAFTA' | 'DIESEL' | 'HIBRIDO' | 'ELECTRICO' | 'GNC' | 'OTRO';
export type TransmissionTypeValue = 'MANUAL' | 'AUTOMATICA';
export type DriveTypeValue = 'X2' | 'X4' | 'DELANTERA' | 'TRASERA' | 'INTEGRAL';

/** Máximo de fotografías por publicación (galería del panel y ficha pública). */
export const MAX_IMAGES_PER_BIKE = 10;

export interface ListBikesFilters {
  q?: string;
  brand?: string;
  model?: string;
  year?: number;
  category?: VehicleCategoryValue;
  condition?: 'NUEVA' | 'USADA';
  fuel?: FuelTypeValue;
  transmission?: TransmissionTypeValue;
  drive?: DriveTypeValue;
  priceMin?: number;
  priceMax?: number;
  status?: BikeStatusValue;
  featured?: boolean;
  page: number;
  limit: number;
}

export interface CreateBikeInput {
  slug: string;
  title: string;
  brandId: string;
  model: string;
  version?: string | null;
  year: number;
  vehicleCategory: VehicleCategoryValue;
  condition: 'NUEVA' | 'USADA';
  color?: string | null;
  fuel?: FuelTypeValue | null;
  transmission?: TransmissionTypeValue | null;
  drive?: DriveTypeValue | null;
  engine?: string | null;
  powerHp?: number | null;
  doors?: number | null;
  seats?: number | null;
  mileageKm?: number | null;
  financingAvailable?: boolean;
  price: number;
  currency: string;
  description?: string | null;
  status: BikeStatusValue;
  featured?: boolean;
  images?: Array<{ url: string; isPrimary: boolean; order: number }>;
  features?: Array<{ key: string; value: string }>;
}

export interface UpdateBikeInput extends Partial<Omit<CreateBikeInput, 'slug'>> {}

/**
 * Listados y detalle nunca traen `BikeImage.data`: los bytes solo se leen en
 * /api/images/:key. `select` explícito evita que Prisma incluya la columna BYTEA.
 */
const bikeSelect: Prisma.BikeSelect = {
  id: true,
  slug: true,
  title: true,
  brandId: true,
  brand: true,
  model: true,
  version: true,
  year: true,
  vehicleCategory: true,
  condition: true,
  color: true,
  fuel: true,
  transmission: true,
  drive: true,
  engine: true,
  powerHp: true,
  doors: true,
  seats: true,
  mileageKm: true,
  financingAvailable: true,
  price: true,
  currency: true,
  description: true,
  status: true,
  featured: true,
  views: true,
  createdAt: true,
  updatedAt: true,
  images: {
    select: { id: true, url: true, isPrimary: true, order: true, createdAt: true },
    orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
  },
  features: { orderBy: { key: 'asc' } },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const generateSlug = (title: string) => {
  const base = slugify(title) || 'vehiculo';
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
};

/**
 * Catálogo público. Los borradores nunca se exponen, incluso si alguien
 * intenta filtrar por `status=BORRADOR` en la query.
 */
export const listBikes = async (filters: ListBikesFilters, includeDrafts = false) => {
  const { q, brand, model, year, category, condition, fuel, transmission, drive, priceMin, priceMax, status, featured, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
    ];
  }
  if (brand) where.brandId = brand;
  if (model) where.model = { contains: model, mode: 'insensitive' };
  if (year) where.year = year;
  if (category) where.vehicleCategory = category;
  if (condition) where.condition = condition;
  if (fuel) where.fuel = fuel;
  if (transmission) where.transmission = transmission;
  if (drive) where.drive = drive;
  if (featured === true) where.featured = true;
  if (priceMin !== undefined || priceMax !== undefined) {
    const price: Record<string, number> = {};
    if (priceMin !== undefined) price.gte = priceMin;
    if (priceMax !== undefined) price.lte = priceMax;
    where.price = price;
  }

  if (includeDrafts) {
    if (status) where.status = status;
  } else {
    where.status =
      status && status !== 'BORRADOR'
        ? { equals: status, not: 'BORRADOR' }
        : { not: 'BORRADOR' };
  }

  const [data, total] = await Promise.all([
    prisma.bike.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: bikeSelect,
    }),
    prisma.bike.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/** Listado del panel: incluye borradores para poder editarlos. */
export const listAdminBikes = async (filters: ListBikesFilters) =>
  listBikes(filters, true);

export const getBikeBySlug = async (slug: string) => {
  return prisma.bike.findFirst({
    where: { slug, status: { not: 'BORRADOR' } },
    select: bikeSelect,
  });
};

export const getBikeById = async (id: string) => {
  return prisma.bike.findUnique({
    where: { id },
    select: bikeSelect,
  });
};

export const createBike = async (input: CreateBikeInput) => {
  const existing = await prisma.bike.findUnique({ where: { slug: input.slug } });
  if (existing) {
    const err: any = new Error('Slug ya existente');
    err.statusCode = 409;
    throw err;
  }

  return prisma.bike.create({
    data: {
      slug: input.slug,
      title: input.title,
      brandId: input.brandId,
      model: input.model,
      version: input.version ?? null,
      year: input.year,
      vehicleCategory: input.vehicleCategory,
      condition: input.condition,
      color: input.color ?? null,
      fuel: input.fuel ?? null,
      transmission: input.transmission ?? null,
      drive: input.drive ?? null,
      engine: input.engine ?? null,
      powerHp: input.powerHp ?? null,
      doors: input.doors ?? null,
      seats: input.seats ?? null,
      mileageKm: input.mileageKm ?? null,
      financingAvailable: input.financingAvailable ?? false,
      price: input.price,
      currency: input.currency,
      description: input.description ?? null,
      status: input.status,
      featured: input.featured ?? false,
      images:
        input.images?.length
          ? {
              create: input.images.map((img, i) => ({
                url: img.url,
                isPrimary: img.isPrimary,
                order: i,
              })),
            }
          : undefined,
      features:
        input.features?.length
          ? {
              create: input.features.map((f) => ({ key: f.key, value: f.value })),
            }
          : undefined,
    },
    select: bikeSelect,
  });
};

export const updateBike = async (id: string, input: UpdateBikeInput) => {
  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.brandId !== undefined) data.brandId = input.brandId;
  if (input.model !== undefined) data.model = input.model;
  if (input.version !== undefined) data.version = input.version;
  if (input.year !== undefined) data.year = input.year;
  if (input.vehicleCategory !== undefined) data.vehicleCategory = input.vehicleCategory;
  if (input.condition !== undefined) data.condition = input.condition;
  if (input.color !== undefined) data.color = input.color;
  if (input.fuel !== undefined) data.fuel = input.fuel;
  if (input.transmission !== undefined) data.transmission = input.transmission;
  if (input.drive !== undefined) data.drive = input.drive;
  if (input.engine !== undefined) data.engine = input.engine;
  if (input.powerHp !== undefined) data.powerHp = input.powerHp;
  if (input.doors !== undefined) data.doors = input.doors;
  if (input.seats !== undefined) data.seats = input.seats;
  if (input.mileageKm !== undefined) data.mileageKm = input.mileageKm;
  if (input.financingAvailable !== undefined) data.financingAvailable = input.financingAvailable;
  if (input.price !== undefined) data.price = input.price;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.description !== undefined) data.description = input.description;
  if (input.status !== undefined) data.status = input.status;
  if (input.featured !== undefined) data.featured = input.featured;

  const current = await prisma.bike.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!current) {
    const err: any = new Error('Vehículo no encontrado');
    err.statusCode = 404;
    throw err;
  }

  const hasScalarChanges = Object.keys(data).length > 0;
  if (!hasScalarChanges && input.features === undefined) {
    const err: any = new Error('No hay campos para actualizar');
    err.statusCode = 400;
    throw err;
  }

  if (input.features !== undefined) {
    // Se reemplaza el conjunto completo para conservar el orden y evitar duplicados.
    return prisma.$transaction(async (tx) => {
      await tx.bikeFeature.deleteMany({ where: { bikeId: id } });
      if (input.features?.length) {
        await tx.bikeFeature.createMany({
          data: input.features.map((f) => ({ bikeId: id, key: f.key, value: f.value })),
        });
      }
      return tx.bike.update({
        where: { id },
        data: hasScalarChanges ? data : {},
        select: bikeSelect,
      });
    });
  }

  return prisma.bike.update({
    where: { id },
    data,
    select: bikeSelect,
  });
};

export const deleteBike = async (id: string) => {
  return prisma.bike.delete({ where: { id } });
};

export interface BikeImageUpload {
  url: string;
  isPrimary?: boolean;
  /** Presente solo con STORAGE_DRIVER=db. */
  data?: Buffer;
  storageKey?: string;
  mimeType?: string;
  sizeBytes?: number;
  checksum?: string;
  thumbnailData?: Buffer;
  thumbnailMimeType?: string;
  thumbnailSizeBytes?: number;
  thumbnailChecksum?: string;
  width?: number;
  height?: number;
}

export const addBikeImages = async (
  bikeId: string,
  images: BikeImageUpload[],
) => {
  const bike = await prisma.bike.findUnique({
    where: { id: bikeId },
    select: { id: true },
  });
  if (!bike) {
    const err: any = new Error('Vehículo no encontrado');
    err.statusCode = 404;
    throw err;
  }

  const existing = await prisma.bikeImage.findMany({
    where: { bikeId },
    select: { order: true, checksum: true },
    orderBy: { order: 'desc' },
  });

  // Un mismo archivo (checksum de la imagen optimizada) no se guarda dos veces.
  const seenChecksums = new Set<string>();
  for (const image of existing) {
    if (image.checksum) seenChecksums.add(image.checksum);
  }
  const unique = images.filter((image) => {
    if (!image.checksum || seenChecksums.has(image.checksum)) return false;
    seenChecksums.add(image.checksum);
    return true;
  });

  // Si todo el lote era duplicado, no se hace nada: la galería ya está completa.
  if (unique.length === 0) return { count: 0 };

  if (existing.length + unique.length > MAX_IMAGES_PER_BIKE) {
    const err: any = new Error(
      `Una publicación admite hasta ${MAX_IMAGES_PER_BIKE} fotografías`,
    );
    err.statusCode = 400;
    throw err;
  }

  // Solo la primera foto de una publicación vacía pasa a ser portada. En una
  // edición se conserva la portada elegida por el administrador.
  const makePrimary = existing.length === 0;
  const baseOrder = (existing[0]?.order ?? -1) + 1;

  return prisma.bikeImage.createMany({
    data: unique.map((image, i) => ({
      bikeId,
      url: image.url,
      isPrimary: makePrimary && i === 0,
      order: baseOrder + i,
      ...(image.data
        ? {
            data: new Uint8Array(image.data),
            storageKey: image.storageKey,
            mimeType: image.mimeType,
            sizeBytes: image.sizeBytes,
            checksum: image.checksum,
            thumbnailData: image.thumbnailData
              ? new Uint8Array(image.thumbnailData)
              : undefined,
            thumbnailMimeType: image.thumbnailMimeType,
            thumbnailSizeBytes: image.thumbnailSizeBytes,
            thumbnailChecksum: image.thumbnailChecksum,
            width: image.width,
            height: image.height,
          }
        : {}),
    })),
  });
};

export const setPrimaryImage = async (bikeId: string, imageId: string) => {
  const image = await prisma.bikeImage.findFirst({
    where: { id: imageId, bikeId },
    select: { id: true },
  });
  if (!image) {
    const err: any = new Error('Imagen no encontrada');
    err.statusCode = 404;
    throw err;
  }

  await prisma.bikeImage.updateMany({ where: { bikeId }, data: { isPrimary: false } });
  await prisma.bikeImage.update({ where: { id: imageId }, data: { isPrimary: true } });

  return getBikeById(bikeId);
};

export const removeBikeImage = async (bikeId: string, imageId: string) => {
  const image = await prisma.bikeImage.findFirst({
    where: { id: imageId, bikeId },
    select: { id: true },
  });
  if (!image) {
    const err: any = new Error('Imagen no encontrada');
    err.statusCode = 404;
    throw err;
  }

  await prisma.bikeImage.delete({ where: { id: imageId } });
};

/** Reordena las fotos existentes. Exige el listado completo de IDs del vehículo. */
export const reorderBikeImages = async (bikeId: string, ids: string[]) => {
  const images = await prisma.bikeImage.findMany({
    where: { bikeId },
    select: { id: true },
  });
  const owned = new Set(images.map((image) => image.id));
  if (ids.length !== owned.size || ids.some((id) => !owned.has(id))) {
    const err: any = new Error('El orden debe incluir todas las fotografías del vehículo');
    err.statusCode = 400;
    throw err;
  }

  await prisma.$transaction(
    ids.map((id, order) =>
      prisma.bikeImage.update({ where: { id }, data: { order } }),
    ),
  );

  return getBikeById(bikeId);
};

export const trackBikeVisit = async (bikeId: string, ip?: string, userAgent?: string) => {
  const bike = await prisma.bike.findUnique({ where: { id: bikeId }, select: { id: true } });
  if (!bike) {
    const err: any = new Error('Vehículo no encontrado');
    err.statusCode = 404;
    throw err;
  }

  await Promise.all([
    prisma.bikeVisit.create({ data: { bikeId, ip, userAgent } }),
    prisma.bike.update({ where: { id: bikeId }, data: { views: { increment: 1 } } }),
  ]);
};

export const listBrands = async () => {
  return prisma.brand.findMany({ orderBy: { name: 'asc' } });
};

export const getBrandBySlug = async (slug: string) => {
  return prisma.brand.findUnique({ where: { slug } });
};
