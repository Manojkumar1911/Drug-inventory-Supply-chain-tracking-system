
import express, { Request, Response } from 'express';
import Settings from '../models/Settings';

const router = express.Router();

// Get all settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await Settings.find();
    return res.status(200).json(settings);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Get setting by key
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    return res.status(200).json(setting);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a new setting
router.post('/', async (req: Request, res: Response) => {
  try {
    const setting = new Settings({
      key: req.body.key,
      value: req.body.value,
      category: req.body.category || 'general',
      description: req.body.description,
      is_system: req.body.is_system || false,
      updated_by: req.body.updated_by || 'system'
    });
    const newSetting = await setting.save();
    return res.status(201).json(newSetting);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// Update a setting
router.put('/:key', async (req: Request, res: Response) => {
  try {
    const updatedSetting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      {
        value: req.body.value,
        category: req.body.category,
        description: req.body.description,
        is_system: req.body.is_system,
        updated_by: req.body.updated_by || 'system'
      },
      { new: true }
    );

    if (!updatedSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    return res.status(200).json(updatedSetting);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
