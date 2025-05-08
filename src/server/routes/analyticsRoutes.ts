
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Initialize routes with pool
export const initAnalyticsRoutes = (pool: Pool) => {
  // Get analytics data with optional filtering
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, metricType, location, category } = req.query;
      
      // Build filter object from query parameters
      const filter: Record<string, any> = {};
      
      if (startDate && typeof startDate === 'string') {
        filter.startDate = new Date(startDate);
      }
      
      if (endDate && typeof endDate === 'string') {
        filter.endDate = new Date(endDate);
      }
      
      if (metricType && typeof metricType === 'string') {
        filter.metric_type = metricType;
      }
      
      if (location && typeof location === 'string') {
        filter.location = location;
      }
      
      if (category && typeof category === 'string') {
        filter.category = category;
      }
      
      // Use direct SQL query instead of MongoDB model
      const query = `
        SELECT * FROM analytics 
        WHERE ($1::text IS NULL OR metric_type = $1)
        AND ($2::text IS NULL OR location = $2)
        AND ($3::text IS NULL OR category = $3)
      `;
      
      const result = await pool.query(query, [
        filter.metric_type || null,
        filter.location || null,
        filter.category || null
      ]);
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics data', error });
    }
  });

  // Create analytics entry
  router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
      const analyticsData = req.body;
      
      const result = await pool.query(
        `INSERT INTO analytics 
        (date, metric_type, value, location, category, notes)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [
          analyticsData.date || new Date(),
          analyticsData.metric_type,
          analyticsData.value,
          analyticsData.location || null,
          analyticsData.category || null,
          analyticsData.notes || null
        ]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating analytics entry', error });
    }
  });

  return router;
};

export default router;
