
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import AnalyticsModel from '../models/Analytics';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let analyticsModel: AnalyticsModel;

// Initialize model with pool
export const initAnalyticsRoutes = (pool: Pool) => {
  analyticsModel = new AnalyticsModel(pool);
  return router;
};

// Get all analytics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const analytics = await analyticsModel.find();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create analytics
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsModel.create(req.body);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytics', error });
  }
});

export default router;
