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
    // Replace upsert with appropriate method
    const setting = await settingsModel.create(req.body);
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating setting', error });
  }
});

// Get setting by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const setting = await settingsModel.findById(id);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update setting
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const setting = await settingsModel.update(id, req.body);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Delete setting
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await settingsModel.delete(id);
    res.json({ message: 'Setting deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
