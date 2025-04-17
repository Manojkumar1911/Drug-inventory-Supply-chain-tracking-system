
import express from 'express';
import Supplier from '../models/Supplier';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all suppliers
router.get('/', async (_req, res) => {
  try {
    const suppliers = await Supplier.find().lean().exec();
    return res.json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    return res.status(201).json(savedSupplier);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating supplier', error });
  }
});

export default router;
