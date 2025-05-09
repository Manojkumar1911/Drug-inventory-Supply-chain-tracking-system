
// Import required modules
import express, { Request, Response } from 'express';
import Supplier from '../models/Supplier';

const router = express.Router();

// Get all suppliers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ message: 'Failed to fetch suppliers', error });
  }
});

// Get a single supplier by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    return res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return res.status(500).json({ message: 'Failed to fetch supplier', error });
  }
});

// Create a new supplier
router.post('/', async (req: Request, res: Response) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    return res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ message: 'Failed to create supplier', error });
  }
});

// Update a supplier
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    return res.status(200).json(supplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ message: 'Failed to update supplier', error });
  }
});

// Delete a supplier
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    return res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ message: 'Failed to delete supplier', error });
  }
});

export default router;
