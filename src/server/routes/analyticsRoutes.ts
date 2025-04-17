
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let pool: Pool;

// Initialize routes with pool
export const initAnalyticsRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// Get analytics data
router.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, metricType, location, category } = req.query;
    
    let query = 'SELECT * FROM analytics WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;
    
    if (startDate && endDate) {
      query += ` AND date >= $${paramIndex} AND date <= $${paramIndex + 1}`;
      values.push(new Date(startDate as string));
      values.push(new Date(endDate as string));
      paramIndex += 2;
    }
    
    if (metricType) {
      query += ` AND metric_type = $${paramIndex}`;
      values.push(metricType);
      paramIndex++;
    }
    
    if (location) {
      query += ` AND location = $${paramIndex}`;
      values.push(location);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }
    
    query += ' ORDER BY date ASC';
    
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create analytics data
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { date, metricType, value, location, category, notes } = req.body;
    
    // Check if analytics entry already exists for this date/metric/location/category
    const existingResult = await pool.query(
      'SELECT * FROM analytics WHERE date = $1 AND metric_type = $2 AND location = $3 AND category = $4',
      [new Date(date), metricType, location || null, category || null]
    );
    
    if (existingResult.rows.length > 0) {
      // Update existing metric
      const updatedResult = await pool.query(
        'UPDATE analytics SET value = $1, notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [value, notes || existingResult.rows[0].notes, existingResult.rows[0].id]
      );
      res.json(updatedResult.rows[0]);
      return;
    } else {
      // Create new metric
      const result = await pool.query(
        `INSERT INTO analytics 
        (date, metric_type, value, location, category, notes, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
        RETURNING *`,
        [new Date(date), metricType, value, location, category, notes]
      );
      
      res.status(201).json(result.rows[0]);
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving analytics', error });
    return;
  }
});

export default router;
