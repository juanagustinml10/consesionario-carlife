import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/error';
import router from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'jaymotos-backend' });
});

app.use('/uploads', express.static(env.UPLOAD_DIR));

app.use('/api', router);

app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada', statusCode: 404 });
});

app.use(errorHandler);

export default app;
