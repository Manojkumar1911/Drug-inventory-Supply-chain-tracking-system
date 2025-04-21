import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import TransferModel from '../models/Transfer';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let transferModel: TransferModel;

// Initialize model with pool
export const initTransferRoutes = (pool: Pool) => {
  transferModel = new TransferModel(pool);
  return router;
};

// Get all transfers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const transfers = await transferModel.find();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create transfer
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const transfer = await transferModel.create(req.body);
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transfer', error });
  }
});

export default router;
