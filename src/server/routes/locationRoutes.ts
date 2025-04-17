
import express from 'express';
import Location from '../models/Location';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all locations
router.get('/', async (_req, res) => {
  try {
    const locations = await Location.find().lean().exec();
    return res.json(locations);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create location
router.post('/', authenticateToken, async (req, res) => {
  try {
    const location = new Location(req.body);
    const savedLocation = await location.save();
    return res.status(201).json(savedLocation);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating location', error });
  }
});

export default router;
