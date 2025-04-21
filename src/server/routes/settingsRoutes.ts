
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import SettingsModel from '../models/Settings';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let settingsModel: SettingsModel;

// Initialize model with pool
export const initSettingsRoutes = (pool: Pool) => {
  settingsModel = new SettingsModel(pool);
  return router;
};

// Get all settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await settingsModel.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create or update setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const setting = await settingsModel.upsert(req.body);
    res.status(200).json(setting);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error });
    return;
  }
});

export default router;
