
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
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create product
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = await productModel.create(req.body);
    res.json(product);
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
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product - modified to use a soft delete approach
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Marking as inactive rather than deleting
    await productModel.update(parseInt(id), { quantity: 0, reorder_level: 0 });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Get products that need to be reordered
router.get('/reorder', async (_req: Request, res: Response) => {
  try {
    const products = await productModel.findProductsToReorder();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products to reorder', error });
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

    const results: any[] = [];
    
    readableStream
      .pipe(csv())
      .on('data', (row: any) => {
        // Store each row for batch processing
        results.push(row);
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            // Map CSV fields to your Product model
            const productData = {
              name: row.name,
              sku: row.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              category: row.category,
              quantity: parseInt(row.quantity) || 0,
              unit: row.unit || 'unit',
              location: row.location || 'Main',
              expiry_date: row.expiry_date ? new Date(row.expiry_date) : null,
              reorder_level: parseInt(row.reorder_level) || 10,
              manufacturer: row.manufacturer || null
            };

            await productModel.create(productData);
            productsAdded++;
          }

          res.status(200).json({ 
            message: 'CSV import completed', 
            productsAdded,
            count: productsAdded 
          });
        } catch (error) {
          console.error('Error processing CSV rows:', error);
          res.status(500).json({ message: 'Error processing CSV data', error });
        }
      })
      .on('error', (error: any) => {
        console.error('CSV parsing error:', error);
        res.status(500).json({ message: 'Error processing CSV file', error });
      });
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ message: 'Error processing CSV file', error });
  }
});

export default router;
