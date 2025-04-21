
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import LocationModel from '../models/Location';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let locationModel: LocationModel;

// Initialize model with pool
export const initLocationRoutes = (pool: Pool) => {
  locationModel = new LocationModel(pool);
  return router;
};

// Get all locations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const locations = await locationModel.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create location
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const location = await locationModel.create(req.body);
    res.status(201).json(location);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error });
    return;
  }
});

export default router;
