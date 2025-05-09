
// Import required modules
import express, { Request, Response } from 'express';
import Settings from '../models/Settings';

const router = express.Router();

// Get all settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await Settings.find();
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ message: 'Failed to fetch settings', error });
  }
});

// Get settings by key
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    return res.status(200).json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    return res.status(500).json({ message: 'Failed to fetch setting', error });
  }
});

// Create or update setting
router.post('/', async (req: Request, res: Response) => {
  try {
    const { key, value, category } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ message: 'Key and value are required' });
    }
    
    // Find and update if exists, otherwise create new
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, category: category || 'general' },
      { new: true, upsert: true, runValidators: true }
    );
    
    return res.status(200).json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return res.status(500).json({ message: 'Failed to update setting', error });
  }
});

// Delete setting
router.delete('/:key', async (req: Request, res: Response) => {
  try {
    const setting = await Settings.findOneAndDelete({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    return res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return res.status(500).json({ message: 'Failed to delete setting', error });
  }
});

export default router;
