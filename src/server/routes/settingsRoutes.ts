
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
    const settings = await settingsModel.findAll();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get settings by group
router.get('/group/:groupName', async (req: Request, res: Response) => {
  try {
    const settings = await settingsModel.findByGroup(req.params.groupName);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get setting by key
router.get('/key/:key', async (req: Request, res: Response) => {
  try {
    const setting = await settingsModel.findByKey(req.params.key);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create or Update setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key, value, groupName, description } = req.body;
    
    // Check if setting exists
    const existingSetting = await settingsModel.findByKey(key);
    
    let result;
    if (existingSetting) {
      // Update existing setting
      result = await settingsModel.update(key, { value, groupName, description, updatedBy: req.user?.id });
    } else {
      // Create new setting
      result = await settingsModel.create({ key, value, groupName, description });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error saving setting', error });
  }
});

// Delete setting
router.delete('/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const deleted = await settingsModel.remove(req.params.key);
    if (!deleted) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting setting', error });
  }
});

export default router;
