
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
router.get('/', async (req: Request, res: Response) => {
  try {
    // Assuming findAll is implemented in your model
    const settings = await settingsModel.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
});

// Get settings by group
router.get('/group/:groupName', async (req: Request, res: Response) => {
  try {
    // Assuming findByGroup is implemented in your model
    const { groupName } = req.params;
    const settings = await settingsModel.find({ group_name: groupName });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings by group', error });
  }
});

// Update or create a setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key, value, description, group_name } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    
    // Check if the setting already exists
    const existingSettings = await settingsModel.find({ key });
    const existingSetting = existingSettings.length > 0 ? existingSettings[0] : null;
    
    let setting;
    if (existingSetting) {
      // Update the existing setting
      setting = await settingsModel.update(existingSetting.id, { 
        value, 
        description: description || existingSetting.description,
        group_name: group_name || existingSetting.group_name,
        // Only use req.user.id if it exists - added type check
        updated_by: req.user?.id || null
      });
    } else {
      // Create a new setting
      setting = await settingsModel.create({
        key,
        value,
        description: description || '',
        group_name: group_name || 'general',
        // Only use req.user.id if it exists - added type check
        updated_by: req.user?.id || null
      });
    }
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error });
  }
});

// Delete a setting
router.delete('/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    // Assuming remove function exists in your model
    const existingSettings = await settingsModel.find({ key });
    
    if (existingSettings.length === 0) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    await settingsModel.delete(existingSettings[0].id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting setting', error });
  }
});

export default router;
