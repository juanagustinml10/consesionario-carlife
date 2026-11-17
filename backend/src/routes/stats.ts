import { Router } from 'express';
import { authenticateAccess } from '../middleware/auth.js';
import { dashboard, recentBikes } from '../controllers/stats.controller.js';

const router = Router();

router.get('/dashboard', authenticateAccess, dashboard);
router.get('/recent-bikes', authenticateAccess, recentBikes);

export default router;
