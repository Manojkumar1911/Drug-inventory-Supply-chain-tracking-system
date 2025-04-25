
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
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, metricType, location, category } = req.query;
    
    let filters: any = {};
    if (startDate && endDate) {
      filters.dateRange = { 
        start: new Date(startDate as string), 
        end: new Date(endDate as string) 
      };
    }
    if (metricType) filters.metricType = metricType as string;
    if (location) filters.location = location as string;
    if (category) filters.category = category as string;
    
    const analytics = await analyticsModel.find(filters);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get analytics by metric type
router.get('/metric/:metricType', async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsModel.findByMetric(req.params.metricType);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create analytics record
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const analytic = await analyticsModel.create(req.body);
    res.json(analytic);
  } catch (error) {
    res.status(500).json({ message: 'Error creating analytic record', error });
  }
});

// Get summary analytics
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { period } = req.query;
    const summary = await analyticsModel.getSummary(period as string || 'weekly');
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error getting analytics summary', error });
  }
});

export default router;
