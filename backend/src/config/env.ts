import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('4000'),
  PUBLIC_BASE_URL: z.string().url().default('http://localhost:4000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerido'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET es requerido'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET es requerido'),
  JWT_ACCESS_TTL: z.string().default('900'),
  JWT_REFRESH_TTL: z.string().default('604800'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.string().default('5242880'),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
