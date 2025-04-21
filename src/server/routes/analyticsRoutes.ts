
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

// Get analytics with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, metricType, location, category } = req.query;
    
    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (metricType) filters.metricType = metricType as string;
    if (location) filters.location = location as string;
    if (category) filters.category = category as string;
    
    const data = await analyticsModel.find(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create analytics entry
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const analyticsEntry = await analyticsModel.create(req.body);
    res.status(201).json(analyticsEntry);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytics entry', error });
    return;
  }
});

export default router;
