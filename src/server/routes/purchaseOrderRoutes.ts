
import express from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all purchase orders
router.get('/', async (_req, res) => {
  try {
    const orders = await PurchaseOrder.find().sort({ createdAt: -1 }).lean().exec();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create purchase order
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Generate order number
    const orderCount = await PurchaseOrder.countDocuments();
    const orderNumber = `PO-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(5, '0')}`;
    
    const purchaseOrder = new PurchaseOrder({
      ...req.body,
      orderNumber
    });
    
    const savedOrder = await purchaseOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating purchase order', error });
  }
});

export default router;
