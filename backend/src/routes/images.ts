import { Router } from 'express';
import { z } from 'zod';
import { validate } from './_validation.js';
import { getImage } from '../controllers/images.controller.js';

const router = Router();

// storageKey se genera con crypto.randomBytes(16).toString('hex').
const imageKeySchema = z.object({
  key: z.string().regex(/^[a-f0-9]{32}$/, 'Clave de imagen inválida'),
});

router.get('/:key', validate(imageKeySchema, 'params'), getImage);

export default router;
