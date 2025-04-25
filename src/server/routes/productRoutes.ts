
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import ProductModel from '../models/Product';
import { authenticateToken } from './authRoutes';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

const router = express.Router();
let productModel: ProductModel;

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const multerUpload = multer({ storage: storage });

// Initialize model with pool
export const initProductRoutes = (pool: Pool) => {
  productModel = new ProductModel(pool);
  return router;
};

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await productModel.find();
    res.json(products);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(parseInt(id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create product
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = await productModel.create(req.body);
    res.json(product);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Update product
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productModel.update(parseInt(id), req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Use update method to logically delete or create a delete method if needed
    await productModel.update(parseInt(id), { deleted: true });
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// CSV upload
router.post('/upload', authenticateToken, multerUpload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer.toString('utf8');
    let productsAdded = 0;

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null); // Signal the end of the stream

    readableStream
      .pipe(csv())
      .on('data', async (row: any) => {
        // Map CSV fields to your Product model
        const productData = {
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          quantity: parseInt(row.quantity),
          category: row.category,
          supplier_id: row.supplier_id,
          location_id: row.location_id,
          reorder_point: parseInt(row.reorder_point),
          // Add required fields that might be missing from CSV
          sku: row.sku || `SKU-${Date.now()}`,
          unit: row.unit || 'unit',
          location: row.location || 'Main',
          reorder_level: parseInt(row.reorder_level) || 10
        };

        try {
          await productModel.create(productData);
          productsAdded++;
        } catch (error) {
          console.error('Error inserting product:', error);
          // Optionally, handle the error for individual rows
        }
      })
      .on('end', () => {
        res.status(200).json({ message: 'CSV import completed', productsAdded });
      })
      .on('error', (error: any) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ message: 'Error processing CSV file', error });
      });
      
    return;
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ message: 'Error processing CSV file', error });
  }
});

export default router;
