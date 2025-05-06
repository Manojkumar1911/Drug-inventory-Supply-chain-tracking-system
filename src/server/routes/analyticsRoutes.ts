
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import AnalyticsModel from '../models/Analytics';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let analyticsModel: typeof AnalyticsModel;

// Initialize model with pool
export const initAnalyticsRoutes = (pool: Pool) => {
  analyticsModel = new AnalyticsModel(pool);
  return router;
};

// Get analytics data with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, metricType, location, category } = req.query;
    
    // Build filter object from query parameters
    const filter: Record<string, any> = {};
    
    if (startDate && typeof startDate === 'string') {
      filter.startDate = new Date(startDate);
    }
    
    if (endDate && typeof endDate === 'string') {
      filter.endDate = new Date(endDate);
    }
    
    if (metricType && typeof metricType === 'string') {
      filter.metric_type = metricType;
    }
    
    if (location && typeof location === 'string') {
      filter.location = location;
    }
    
    if (category && typeof category === 'string') {
      filter.category = category;
    }
    
    const analytics = await analyticsModel.find(filter);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error });
  }
});

// Create analytics entry
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const analyticsData = req.body;
    const result = await analyticsModel.create(analyticsData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytics entry', error });
  }
});

export default router;
