
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();
let pool: Pool;

// Initialize routes with pool
export const initSettingsRoutes = (dbPool: Pool) => {
  pool = dbPool;
  return router;
};

// Get all settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Create or update setting
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { key, value, group_name, description } = req.body;
    
    // Check if setting exists
    const existingResult = await pool.query('SELECT * FROM settings WHERE key = $1', [key]);
    
    if (existingResult.rows.length > 0) {
      // Update existing setting
      const result = await pool.query(
        `UPDATE settings 
        SET value = $1, 
            group_name = $2, 
            description = $3, 
            updated_by = $4,
            updated_at = NOW() 
        WHERE key = $5
        RETURNING *`,
        [
          JSON.stringify(value),
          group_name || existingResult.rows[0].group_name,
          description || existingResult.rows[0].description,
          req.body.user?.id || 'system',
          key
        ]
      );
      
      res.json(result.rows[0]);
    } else {
      // Create new setting
      const result = await pool.query(
        `INSERT INTO settings
        (key, value, group_name, description, updated_by, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *`,
        [
          key,
          JSON.stringify(value),
          group_name,
          description,
          req.body.user?.id || 'system'
        ]
      );
      
      res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving setting', error });
  }
});

// Get system settings
router.get('/system', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM settings WHERE is_system = true');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system settings', error });
  }
});

export default router;
