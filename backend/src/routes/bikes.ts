import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { validate } from './_validation';
import {
  list,
  getBySlug,
  trackVisit,
  getById,
  create,
  update,
  remove,
  uploadImages,
  setPrimary,
  deleteImage,
  brands,
} from '../controllers/bikes.controller';
import { authenticateAccess } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

const bikeQuerySchema = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().optional(),
  condition: z.enum(['NUEVA', 'USADA']).optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  status: z.enum(['DISPONIBLE', 'RESERVADA', 'VENDIDA']).optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

const bikeIdSchema = z.object({ id: z.string().cuid('ID de moto inválido') });
const slugSchema = z.object({ slug: z.string().min(1) });
const imageSchema = z.object({
  id: z.string().cuid('ID de moto inválido'),
  imageId: z.string().cuid('ID de imagen inválido'),
});

const createBikeSchema = z.object({
  title: z.string().min(2, 'El título es requerido').max(140),
  brandId: z.string().cuid('ID de marca inválido'),
  model: z.string().min(1, 'El modelo es requerido').max(100),
  year: z.coerce.number().int().min(1900).max(2100, 'Año inválido'),
  condition: z.enum(['NUEVA', 'USADA']),
  displacementCc: z.coerce.number().int().positive().optional().nullable(),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  currency: z.string().length(3, 'Moneda inválida').default('ARS'),
  description: z.string().optional().nullable(),
  status: z.enum(['DISPONIBLE', 'RESERVADA', 'VENDIDA']).default('DISPONIBLE'),
  featured: z.coerce.boolean().default(false),
});

const updateBikeSchema = createBikeSchema.partial();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(env.MAX_FILE_SIZE) },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// Público
router.get('/', validate(bikeQuerySchema, 'query'), list);
router.get('/brands', brands);
router.get('/slug/:slug', validate(slugSchema, 'params'), getBySlug);
router.get('/:id', validate(bikeIdSchema, 'params'), getById);
router.post('/:id/visits', validate(bikeIdSchema, 'params'), trackVisit);

// Privado (panel administrativo)
router.post(
  '/',
  authenticateAccess,
  validate(createBikeSchema),
  create,
);
router.patch(
  '/:id',
  authenticateAccess,
  validate(bikeIdSchema, 'params'),
  validate(updateBikeSchema),
  update,
);
router.delete(
  '/:id',
  authenticateAccess,
  validate(bikeIdSchema, 'params'),
  remove,
);
router.post(
  '/:id/images',
  authenticateAccess,
  upload.array('images', 10),
  uploadImages,
);
router.patch(
  '/:id/images/:imageId/primary',
  authenticateAccess,
  validate(imageSchema, 'params'),
  setPrimary,
);
router.delete(
  '/:id/images/:imageId',
  authenticateAccess,
  validate(imageSchema, 'params'),
  deleteImage,
);

export default router;
