
import express, { Request, Response } from 'express';
import Supplier from '../models/Supplier';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all suppliers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find().lean().exec();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error });
  }
});

export default router;
