
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

// Get supplier by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await supplierModel.findById(parseInt(req.params.id));
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const supplier = await supplierModel.create(req.body);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error });
  }
});

// Update supplier
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const supplier = await supplierModel.update(parseInt(req.params.id), req.body);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
});

// Delete supplier
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const supplier = await supplierModel.delete(parseInt(req.params.id));
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
});

export default router;
