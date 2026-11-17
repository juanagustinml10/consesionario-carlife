import type { Request, Response } from 'express';
import { getDashboardStats, getRecentBikes } from '../services/stats.service';
import { asyncHandler } from '../middleware/asyncHandler';

export const dashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json(stats);
});

export const recentBikes = asyncHandler(async (_req: Request, res: Response) => {
  const list = await getRecentBikes();
  res.json(list);
});
