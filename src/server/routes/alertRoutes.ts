
import express, { Request, Response } from 'express';
import Alert from '../models/Alert';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all alerts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create alert
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    return res.json(savedAlert);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating alert', error });
  }
});

export default router;
