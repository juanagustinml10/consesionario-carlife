import 'dotenv/config';
import { z } from 'zod';

export const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const envSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    VERCEL: z.string().optional(),
    PORT: z.string().default('4000'),
    // Base pública del backend. Con STORAGE_DRIVER=db se usa para armar
    // https://<backend>/api/images/<key> guardado en BikeImage.url.
    PUBLIC_BASE_URL: z.string().url().default('http://localhost:4000'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerido'),
    DATABASE_URL_UNPOOLED: z.string().min(1, 'DATABASE_URL_UNPOOLED es requerido'),
    JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET es requerido'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET es requerido'),
    JWT_ACCESS_TTL: z.string().default('900'),
    JWT_REFRESH_TTL: z.string().default('604800'),
    // En producción es obligatorio y puede traer varios orígenes separados por coma.
    CORS_ORIGIN: z.string().default(isProduction ? '' : 'http://localhost:5173'),
    // "local" solo en desarrollo; "db" guarda los bytes en Neon (recomendado en Vercel);
    // "s3" mantiene el driver anterior para quien ya tenga un bucket configurado.
    STORAGE_DRIVER: z.enum(['local', 'db', 's3']).default('local'),
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
    if (isProduction) {
      if (!value.CORS_ORIGIN.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['CORS_ORIGIN'],
          message: 'CORS_ORIGIN es requerido en producción (origen del frontend autorizado)',
        });
      } else if (
        value.CORS_ORIGIN.split(',')
          .map((origin) => origin.trim())
          .includes('*')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['CORS_ORIGIN'],
          message: 'CORS_ORIGIN no admite * en producción: enumerá los orígenes autorizados',
        });
      }
    }

    if (isProduction && value.STORAGE_DRIVER === 'db') {
      let publicUrl: URL | null = null;
      try {
        publicUrl = new URL(value.PUBLIC_BASE_URL);
      } catch {
        publicUrl = null;
      }
      const isLoopback = publicUrl
        ? ['localhost', '127.0.0.1', '::1'].includes(publicUrl.hostname)
        : true;
      if (!publicUrl || publicUrl.protocol !== 'https:' || isLoopback) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['PUBLIC_BASE_URL'],
          message:
            'PUBLIC_BASE_URL debe ser HTTPS público (no localhost) cuando STORAGE_DRIVER=db',
        });
      }
    }

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
  // Solo nombres y mensajes: nunca valores, para no exponer secretos en logs.
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join(' | ');
  throw new Error(`Variables de entorno inválidas o faltantes: ${details}`);
}

export const env = parsed.data;
