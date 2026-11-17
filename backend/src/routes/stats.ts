import { Router } from 'express';
import { authenticateAccess } from '../middleware/auth';
import { dashboard, recentBikes } from '../controllers/stats.controller';

const router = Router();

router.get('/dashboard', authenticateAccess, dashboard);
router.get('/recent-bikes', authenticateAccess, recentBikes);

export default router;
