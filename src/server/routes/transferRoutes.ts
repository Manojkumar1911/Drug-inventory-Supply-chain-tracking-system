
import express from 'express';
import Transfer from '../models/Transfer';
import Product from '../models/Product';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get all transfers
router.get('/', async (_req, res) => {
  try {
    const transfers = await Transfer.find().lean().exec();
    return res.json(transfers);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create transfer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    const savedTransfer = await transfer.save();
    
    // Update product quantities
    const product = await Product.findById(transfer.product).exec();
    if (product) {
      // Reduce quantity at source location
      if (product.location === transfer.from) {
        product.quantity -= transfer.quantity;
        await product.save();
      }
      
      // Check if product exists at destination
      const destinationProduct = await Product.findOne({ 
        sku: product.sku,
        location: transfer.to
      }).exec();
      
      if (destinationProduct) {
        // Update quantity at destination
        destinationProduct.quantity += transfer.quantity;
        await destinationProduct.save();
      } else {
        // Create new product entry at destination
        const newLocationProduct = new Product({
          ...product.toObject(),
          _id: undefined,
          location: transfer.to,
          quantity: transfer.quantity
        });
        await newLocationProduct.save();
      }
    }
    
    return res.status(201).json(savedTransfer);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating transfer', error });
  }
});

export default router;
