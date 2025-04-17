
import express, { Request, Response } from 'express';
import Location from '../models/Location';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all locations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const locations = await Location.find().lean().exec();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create location
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const location = new Location(req.body);
    const savedLocation = await location.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error });
  }
});

export default router;
