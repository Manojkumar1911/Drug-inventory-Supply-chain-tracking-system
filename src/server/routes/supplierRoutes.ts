
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let pool: Pool;

// Initialize routes with pool
export const initSupplierRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// Get all suppliers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create supplier
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      name,
      contact_person,
      email,
      phone_number,
      address,
      city,
      state,
      zip_code,
      country,
      tax_id,
      payment_terms,
      lead_time,
      minimum_order_amount,
      notes,
      rating
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO suppliers
      (name, contact_person, email, phone_number, address, city, state, zip_code, country,
       tax_id, payment_terms, lead_time, minimum_order_amount, notes, rating, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *`,
      [
        name,
        contact_person,
        email,
        phone_number,
        address,
        city,
        state,
        zip_code,
        country || 'USA',
        tax_id,
        payment_terms,
        lead_time,
        minimum_order_amount,
        notes,
        rating || 3
      ]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating supplier', error });
  }
});

export default router;
