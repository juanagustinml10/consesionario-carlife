import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const validate =
  (schema: z.ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const parsed = await schema.parseAsync(data);
    (req as any).validated = parsed;
    next();
  });
