
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import SupplierModel from '../models/Supplier';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let supplierModel: SupplierModel;

// Initialize model with pool
export const initSupplierRoutes = (pool: Pool) => {
  supplierModel = new SupplierModel(pool);
  return router;
};

// Get all suppliers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const suppliers = await supplierModel.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const supplier = await supplierModel.create(req.body);
    res.status(201).json(supplier);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error });
    return;
  }
});

export default router;
