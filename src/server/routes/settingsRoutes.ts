
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
router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  try {
    // Assuming the model has a find method instead of findAll
    const settings = await settingsModel.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get setting by key
router.get('/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const setting = await settingsModel.findByKey(key);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create or update setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key, value, groupName, description } = req.body;
    const userId = req.body.user?.id;
    
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    
    // Assuming the model has a create/update method instead of upsert
    const setting = await settingsModel.update(key, {
      key,
      value,
      group_name: groupName,
      description,
      updated_by: userId
    });
    
    res.json(setting);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error });
  }
});

// Delete setting
router.delete('/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const result = await settingsModel.delete(key);
    if (!result) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json({ message: 'Setting deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting setting', error });
  }
});

export default router;
