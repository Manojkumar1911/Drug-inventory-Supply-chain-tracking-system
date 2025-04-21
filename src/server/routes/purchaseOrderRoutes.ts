
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import PurchaseOrderModel from '../models/PurchaseOrder';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let purchaseOrderModel: PurchaseOrderModel;

// Initialize model with pool
export const initPurchaseOrderRoutes = (pool: Pool) => {
  purchaseOrderModel = new PurchaseOrderModel(pool);
  return router;
};

// Get all purchase orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await purchaseOrderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create purchase order
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const order = await purchaseOrderModel.create(req.body);
    res.status(201).json(order);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase order', error });
    return;
  }
});

export default router;
