import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import prisma from '../lib/prisma';
import { env } from '../config/env';

export interface ListBikesFilters {
  q?: string;
  brand?: string;
  model?: string;
  year?: number;
  condition?: 'NUEVA' | 'USADA';
  priceMin?: number;
  priceMax?: number;
  status?: 'DISPONIBLE' | 'RESERVADA' | 'VENDIDA';
  featured?: boolean;
  page: number;
  limit: number;
}

export interface CreateBikeInput {
  slug: string;
  title: string;
  brandId: string;
  model: string;
  year: number;
  condition: 'NUEVA' | 'USADA';
  displacementCc?: number | null;
  price: number;
  currency: string;
  description?: string | null;
  status: 'DISPONIBLE' | 'RESERVADA' | 'VENDIDA';
  featured?: boolean;
  images?: Array<{ url: string; isPrimary: boolean; order: number }>;
  features?: Array<{ key: string; value: string }>;
}

export interface UpdateBikeInput extends Partial<Omit<CreateBikeInput, 'slug'>> {}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const generateSlug = (title: string) => {
  const base = slugify(title) || 'moto';
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}`;
};

export const listBikes = async (filters: ListBikesFilters) => {
  const { q, brand, model, year, condition, priceMin, priceMax, status, featured, page, limit } = filters;
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
  if (condition) where.condition = condition;
  if (status) where.status = status;
  if (featured === true) where.featured = true;
  if (priceMin !== undefined || priceMax !== undefined) {
    const price: Record<string, number> = {};
    if (priceMin !== undefined) price.gte = priceMin;
    if (priceMax !== undefined) price.lte = priceMax;
    where.price = price;
  }

  const [data, total] = await Promise.all([
    prisma.bike.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        brand: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
        features: { orderBy: { key: 'asc' } },
      },
    }),
    prisma.bike.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getBikeBySlug = async (slug: string) => {
  return prisma.bike.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      features: { orderBy: { key: 'asc' } },
    },
  });
};

export const getBikeById = async (id: string) => {
  return prisma.bike.findUnique({
    where: { id },
    include: {
      brand: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      features: { orderBy: { key: 'asc' } },
    },
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
      year: input.year,
      condition: input.condition,
      displacementCc: input.displacementCc ?? null,
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
    include: {
      brand: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      features: { orderBy: { key: 'asc' } },
    },
  });
};

export const updateBike = async (id: string, input: UpdateBikeInput) => {
  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.brandId !== undefined) data.brandId = input.brandId;
  if (input.model !== undefined) data.model = input.model;
  if (input.year !== undefined) data.year = input.year;
  if (input.condition !== undefined) data.condition = input.condition;
  if (input.displacementCc !== undefined) data.displacementCc = input.displacementCc;
  if (input.price !== undefined) data.price = input.price;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.description !== undefined) data.description = input.description;
  if (input.status !== undefined) data.status = input.status;
  if (input.featured !== undefined) data.featured = input.featured;

  if (Object.keys(data).length === 0) {
    const err: any = new Error('No hay campos para actualizar');
    err.statusCode = 400;
    throw err;
  }

  return prisma.bike.update({
    where: { id },
    data,
    include: {
      brand: true,
      images: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
      features: { orderBy: { key: 'asc' } },
    },
  });
};

export const deleteBike = async (id: string) => {
  return prisma.bike.delete({ where: { id } });
};

export const saveUploadedFile = async (buffer: Buffer, originalName: string) => {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
  const ext = path.extname(originalName).toLowerCase();
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  const filePath = path.join(env.UPLOAD_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `${env.PUBLIC_BASE_URL}/uploads/${filename}`;
};

export const addBikeImages = async (
  bikeId: string,
  urls: Array<{ url: string; isPrimary?: boolean }>,
) => {
  // Si se marca una como principal, desmarcar las demás de la moto
  const hasPrimary = urls.some((u) => u.isPrimary);
  if (hasPrimary) {
    await prisma.bikeImage.updateMany({
      where: { bikeId },
      data: { isPrimary: false },
    });
  }

  const lastOrder = await prisma.bikeImage.findFirst({
    where: { bikeId },
    orderBy: { order: 'desc' },
  });
  const baseOrder = (lastOrder?.order ?? -1) + 1;

  return prisma.bikeImage.createMany({
    data: urls.map((u, i) => ({
      bikeId,
      url: u.url,
      isPrimary: u.isPrimary ?? false,
      order: baseOrder + i,
    })),
  });
};

export const setPrimaryImage = async (bikeId: string, imageId: string) => {
  const image = await prisma.bikeImage.findFirst({ where: { id: imageId, bikeId } });
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
  const image = await prisma.bikeImage.findFirst({ where: { id: imageId, bikeId } });
  if (!image) {
    const err: any = new Error('Imagen no encontrada');
    err.statusCode = 404;
    throw err;
  }

  await prisma.bikeImage.delete({ where: { id: imageId } });
};

export const trackBikeVisit = async (bikeId: string, ip?: string, userAgent?: string) => {
  const bike = await prisma.bike.findUnique({ where: { id: bikeId }, select: { id: true } });
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
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
