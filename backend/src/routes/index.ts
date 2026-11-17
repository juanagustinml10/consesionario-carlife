import { Router } from 'express';
import authRouter from './auth';
import bikesRouter from './bikes';
import statsRouter from './stats';

const router = Router();

router.use('/auth', authRouter);
router.use('/bikes', bikesRouter);
router.use('/stats', statsRouter);

export default router;
