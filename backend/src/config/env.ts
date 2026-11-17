import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.string().default('4000'),
    PUBLIC_BASE_URL: z.string().url().default('http://localhost:4000'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerido'),
    DATABASE_URL_UNPOOLED: z.string().min(1, 'DATABASE_URL_UNPOOLED es requerido'),
    JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET es requerido'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET es requerido'),
    JWT_ACCESS_TTL: z.string().default('900'),
    JWT_REFRESH_TTL: z.string().default('604800'),
    // En producción puede traer varios orígenes separados por coma.
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    // "local" para desarrollo; "s3" para Vercel u otro entorno sin disco persistente.
    STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
    STORAGE_S3_BUCKET: z.string().optional(),
    STORAGE_PUBLIC_BASE_URL: z.string().url().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_ENDPOINT_URL_S3: z.string().url().optional(),
    AWS_REGION: z.string().default('auto'),
    UPLOAD_DIR: z.string().default('./uploads'),
    // Vercel Functions limita el body a ~4.5 MB; 4 MB deja margen para multipart.
    MAX_FILE_SIZE: z.string().default('4194304'),
    SEED_ADMIN_EMAIL: z.string().email().optional(),
    SEED_ADMIN_PASSWORD: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.STORAGE_DRIVER !== 's3') return;

    const required: Array<[keyof typeof value, string]> = [
      ['STORAGE_S3_BUCKET', 'STORAGE_S3_BUCKET es requerido con STORAGE_DRIVER=s3'],
      ['STORAGE_PUBLIC_BASE_URL', 'STORAGE_PUBLIC_BASE_URL es requerido con STORAGE_DRIVER=s3'],
      ['AWS_ACCESS_KEY_ID', 'AWS_ACCESS_KEY_ID es requerido con STORAGE_DRIVER=s3'],
      ['AWS_SECRET_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY es requerido con STORAGE_DRIVER=s3'],
      ['AWS_ENDPOINT_URL_S3', 'AWS_ENDPOINT_URL_S3 es requerido con STORAGE_DRIVER=s3'],
    ];

    for (const [field, message] of required) {
      if (!value[field]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
