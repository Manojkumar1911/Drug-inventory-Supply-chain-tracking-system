
import express, { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
let pool: Pool;

// Initialize routes with pool
export const initProductRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// CSV Upload route for Products
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results: any[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve())
        .on('error', reject);
    });

    // Insert each product from CSV
    let insertedCount = 0;
    
    for (const product of results) {
      await pool.query(
        `INSERT INTO products
        (name, sku, category, quantity, unit, location, expiry_date, reorder_level, manufacturer, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          product.name,
          product.sku,
          product.category,
          parseInt(product.quantity) || 0,
          product.unit,
          product.location,
          product.expiryDate ? new Date(product.expiryDate) : null,
          parseInt(product.reorderLevel) || 0,
          product.manufacturer
        ]
      );
      insertedCount++;
    }
    
    fs.unlinkSync(req.file.path);
    
    return res.status(200).json({ 
      message: 'CSV uploaded successfully', 
      count: insertedCount
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Error processing CSV', error });
  }
});

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create new product
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, sku, category, quantity, unit, location, expiryDate, reorderLevel, manufacturer } = req.body;
    
    const result = await pool.query(
      `INSERT INTO products
      (name, sku, category, quantity, unit, location, expiry_date, reorder_level, manufacturer, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [name, sku, category, quantity, unit, location, expiryDate, reorderLevel, manufacturer]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get products that need to be reordered (below reorder level)
router.get('/reorder', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE quantity < reorder_level');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
