import type { Request, Response } from 'express';
import {
  createBike,
  deleteBike,
  deleteUploadedFile,
  getBikeById,
  getBikeBySlug,
  generateSlug,
  listBikes,
  listBrands,
  removeBikeImage,
  saveUploadedFile,
  setPrimaryImage,
  trackBikeVisit,
  updateBike,
  addBikeImages,
  listAdminBikes,
  reorderBikeImages,
} from '../services/bikes.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import type { AuthenticatedRequest } from '../types/express.js';
import prisma from '../lib/prisma.js';

type ValidatedRequest = AuthenticatedRequest & { validated?: unknown };

export const list = asyncHandler(async (req: Request, res: Response) => {
  const result = await listBikes((req as ValidatedRequest).validated as any);
  res.json(result);
});

/** Listado del panel: incluye los borradores, que el catálogo público oculta. */
export const listAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await listAdminBikes((req as ValidatedRequest).validated as any);
  res.json(result);
});

export const getBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };
  const bike = await getBikeBySlug(slug);
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }
  res.json(bike);
});

export const trackVisit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await trackBikeVisit(id, req.ip, req.headers['user-agent'] ?? undefined);
  res.status(204).send();
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const bike = await getBikeById(id);
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }
  res.json(bike);
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = (req as ValidatedRequest).validated as any;
  const bike = await createBike({
    ...input,
    slug: input.slug ?? generateSlug(input.title),
  });
  res.status(201).json(bike);
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const input = (req as ValidatedRequest).validated as any;
  const bike = await updateBike(id, input);
  res.json(bike);
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const bike = await prisma.bike.findUnique({ where: { id }, select: { id: true } });
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }

  // En `db` los bytes se van con la fila (ON DELETE CASCADE). En local/S3 hay
  // que borrar también el full y la miniatura antes de eliminar la moto.
  const images = await prisma.bikeImage.findMany({
    where: { bikeId: id },
    select: { url: true },
  });
  await Promise.all(images.map((image) => deleteUploadedFile(image.url)));

  await deleteBike(id);
  res.json({ ok: true });
});

export const uploadImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const files = (req as any).files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    const err: any = new Error('No se enviaron imágenes');
    err.statusCode = 400;
    throw err;
  }

  // Un archivo por request: Vercel limita el body a ~4.5 MB y Sharp procesa
  // cada imagen antes de guardarla. El servicio decide la portada y el orden.
  const stored = await Promise.all(files.map((file) => saveUploadedFile(file.buffer)));
  await addBikeImages(id, stored);

  const bike = await getBikeById(id);
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }
  res.status(201).json({ images: bike.images });
});

export const setPrimary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, imageId } = req.params as { id: string; imageId: string };
  const bike = await setPrimaryImage(id, imageId);
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }
  res.json({ images: bike.images });
});

export const deleteImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, imageId } = req.params as { id: string; imageId: string };
  const image = await prisma.bikeImage.findFirst({
    where: { id: imageId, bikeId: id },
    select: { id: true, url: true },
  });
  if (!image) {
    const err: any = new Error('Imagen no encontrada');
    err.statusCode = 404;
    throw err;
  }

  await deleteUploadedFile(image.url);

  await removeBikeImage(id, imageId);
  res.json({ ok: true });
});

export const reorderImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const { ids } = (req as ValidatedRequest).validated as { ids: string[] };
  const bike = await reorderBikeImages(id, ids);
  if (!bike) {
    const err: any = new Error('Moto no encontrada');
    err.statusCode = 404;
    throw err;
  }
  res.json({ images: bike.images });
});

export const brands = asyncHandler(async (_req: Request, res: Response) => {
  const list = await listBrands();
  res.json(list);
});
