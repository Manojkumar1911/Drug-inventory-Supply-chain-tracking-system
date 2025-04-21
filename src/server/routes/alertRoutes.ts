
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import AlertModel from '../models/Alert';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let alertModel: AlertModel;

// Initialize model with pool
export const initAlertRoutes = (pool: Pool) => {
  alertModel = new AlertModel(pool);
  return router;
};

// Get all alerts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const alerts = await alertModel.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create alert
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const alert = await alertModel.create(req.body);
    res.json(alert);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
    return;
  }
});

export default router;
