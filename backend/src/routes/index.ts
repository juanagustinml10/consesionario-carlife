import { Router } from 'express';
import authRouter from './auth.js';
import bikesRouter from './bikes.js';
import imagesRouter from './images.js';
import statsRouter from './stats.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/bikes', bikesRouter);
router.use('/images', imagesRouter);
router.use('/stats', statsRouter);

export default router;
