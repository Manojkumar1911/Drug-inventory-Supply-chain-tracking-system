
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

// Get analytics data
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, metricType } = req.query;
    
    let filters: any = {};
    
    if (startDate && endDate) {
      filters.dateRange = {
        start: startDate as string,
        end: endDate as string
      };
    }
    
    if (metricType) {
      filters.metricType = metricType as string;
    }
    
    const data = await analyticsModel.getAnalytics(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get summary metrics
router.get('/summary', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const summary = await analyticsModel.getSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get metrics by category
router.get('/by-category', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const categoryData = await analyticsModel.getByCategory();
    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get metrics by location
router.get('/by-location', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const locationData = await analyticsModel.getByLocation();
    res.json(locationData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create new analytics data point
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const newData = await analyticsModel.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytics data', error });
  }
});

export default router;
