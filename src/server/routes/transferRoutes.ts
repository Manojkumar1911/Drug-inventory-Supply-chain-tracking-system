
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let pool: Pool;

// Initialize routes with pool
export const initTransferRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// Get all transfers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM transfers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create transfer
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Begin transaction
    await pool.query('BEGIN');
    
    const { 
      product_id, 
      product_name, 
      quantity, 
      from_location, 
      to_location, 
      requested_by, 
      notes, 
      priority 
    } = req.body;
    
    // Create transfer record
    const transferResult = await pool.query(
      `INSERT INTO transfers
      (product_id, product_name, quantity, from_location, to_location, requested_by, notes, priority, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *`,
      [
        product_id, 
        product_name, 
        quantity, 
        from_location, 
        to_location, 
        requested_by, 
        notes,
        priority || 'Normal'
      ]
    );
    
    // Update product quantities
    // First, check if product exists at source location
    const sourceProductResult = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND location = $2',
      [product_id, from_location]
    );
    
    if (sourceProductResult.rows.length > 0) {
      // Reduce quantity at source location
      await pool.query(
        'UPDATE products SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2 AND location = $3',
        [quantity, product_id, from_location]
      );
      
      // Check if product exists at destination location
      const destProductResult = await pool.query(
        'SELECT * FROM products WHERE sku = $1 AND location = $2',
        [sourceProductResult.rows[0].sku, to_location]
      );
      
      if (destProductResult.rows.length > 0) {
        // Update quantity at destination
        await pool.query(
          'UPDATE products SET quantity = quantity + $1, updated_at = NOW() WHERE id = $2',
          [quantity, destProductResult.rows[0].id]
        );
      } else {
        // Create new product entry at destination
        const sourceProduct = sourceProductResult.rows[0];
        await pool.query(
          `INSERT INTO products
          (name, sku, category, quantity, unit, location, expiry_date, reorder_level, manufacturer, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
          [
            sourceProduct.name,
            sourceProduct.sku,
            sourceProduct.category,
            quantity,
            sourceProduct.unit,
            to_location,
            sourceProduct.expiry_date,
            sourceProduct.reorder_level,
            sourceProduct.manufacturer
          ]
        );
      }
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.status(201).json(transferResult.rows[0]);
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error creating transfer', error });
  }
});

export default router;
