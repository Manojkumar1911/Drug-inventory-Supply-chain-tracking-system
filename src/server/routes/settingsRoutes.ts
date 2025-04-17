
import express, { Request, Response } from 'express';
import Settings from '../models/Settings';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await Settings.find().lean();
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create or update setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key, value, group, description } = req.body;
    
    // Check if setting exists
    const existingSetting = await Settings.findOne({ key });
    if (existingSetting) {
      // Update existing setting
      existingSetting.value = value;
      existingSetting.group = group || existingSetting.group;
      existingSetting.description = description || existingSetting.description;
      existingSetting.updatedBy = req.body.user?.id || 'system';
      
      const updatedSetting = await existingSetting.save();
      return res.json(updatedSetting);
    } else {
      // Create new setting
      const setting = new Settings({
        key,
        value,
        group,
        description,
        updatedBy: req.body.user?.id || 'system'
      });
      
      const savedSetting = await setting.save();
      return res.status(201).json(savedSetting);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error saving setting', error });
  }
});

// Get system settings
router.get('/system', async (_req: Request, res: Response) => {
  try {
    const systemSettings = await Settings.find({ isSystem: true }).lean();
    return res.json(systemSettings);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching system settings', error });
  }
});

export default router;
