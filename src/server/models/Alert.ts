
import { Pool } from 'pg';

export interface IAlert {
  id?: number;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'New' | 'In Progress' | 'Resolved';
  category: string;
  location: string;
  timestamp?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class AlertModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<IAlert>): Promise<IAlert[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM alerts WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY created_at DESC';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding alerts:', error);
      throw error;
    }
  }

  async create(alertData: IAlert): Promise<IAlert> {
    try {
      const result = await this.pool.query(
        `INSERT INTO alerts 
        (title, description, severity, status, category, location, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [
          alertData.title,
          alertData.description,
          alertData.severity,
          alertData.status || 'New',
          alertData.category,
          alertData.location,
          alertData.timestamp || new Date()
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<IAlert | null> {
    try {
      const result = await this.pool.query('SELECT * FROM alerts WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding alert by id:', error);
      throw error;
    }
  }

  async update(id: number, alertData: Partial<IAlert>): Promise<IAlert | null> {
    try {
      const alert = await this.findById(id);
      if (!alert) return null;

      const keys = Object.keys(alertData);
      const values = Object.values(alertData);
      
      if (keys.length === 0) return alert;

      let query = 'UPDATE alerts SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }
}

export default AlertModel;
