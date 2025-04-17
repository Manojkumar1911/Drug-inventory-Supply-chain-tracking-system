
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let pool: Pool;

// Initialize routes with pool
export const initPurchaseOrderRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// Get all purchase orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT po.*, 
        json_agg(poi.*) as items 
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      GROUP BY po.id
      ORDER BY po.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create purchase order
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Begin transaction
    await pool.query('BEGIN');
    
    // Generate order number
    const countResult = await pool.query('SELECT COUNT(*) FROM purchase_orders');
    const orderCount = parseInt(countResult.rows[0].count);
    const orderNumber = `PO-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(5, '0')}`;
    
    // Create purchase order
    const { supplier_id, supplier_name, items, status, submitted_by, notes, total_amount } = req.body;
    
    const poResult = await pool.query(
      `INSERT INTO purchase_orders
      (order_number, supplier_id, supplier_name, status, submitted_by, notes, total_amount, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [orderNumber, supplier_id, supplier_name, status || 'Draft', submitted_by, notes, total_amount]
    );
    
    const purchaseOrder = poResult.rows[0];
    
    // Insert order items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO purchase_order_items
          (purchase_order_id, product_id, product_name, quantity, unit_price, total_price)
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            purchaseOrder.id, 
            item.product_id, 
            item.product_name, 
            item.quantity, 
            item.unit_price, 
            item.total_price
          ]
        );
      }
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    // Fetch complete order with items
    const completeOrderResult = await pool.query(
      `SELECT po.*, 
        json_agg(poi.*) as items 
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE po.id = $1
      GROUP BY po.id`,
      [purchaseOrder.id]
    );
    
    res.status(201).json(completeOrderResult.rows[0]);
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error creating purchase order', error });
  }
});

export default router;
