import { Router } from 'express';
import { z } from 'zod';
import { validate } from './_validation.js';
import { login, refresh, logout } from '../controllers/auth.controller.js';
import { authenticateAccess } from '../middleware/auth.js';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const tokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

// El alta de administradores se hace con `npm run prisma:seed`.
// No se expone registro público: cualquiera podría crear un ADMIN.
router.post('/login', validate(credentialsSchema), login);
router.post('/refresh', validate(tokenSchema), refresh);
router.post('/logout', authenticateAccess, validate(tokenSchema), logout);

export default router;
