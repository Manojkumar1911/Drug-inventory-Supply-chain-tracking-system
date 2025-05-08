
import { Pool } from 'pg';

export interface IAlert {
  id?: number;
  title: string;
  description: string;
  severity?: string;
  status?: string;
  category: string;
  location: string;
  timestamp?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class AlertModel {
  private pool: typeof Pool;

  constructor(pool: typeof Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<IAlert>): Promise<IAlert[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM alerts ORDER BY timestamp DESC');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM alerts WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY timestamp DESC';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding alerts:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<IAlert | null> {
    try {
      const result = await this.pool.query('SELECT * FROM alerts WHERE id = $1', [id]);
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error finding alert by id:', error);
      throw error;
    }
  }

  async create(alert: IAlert): Promise<IAlert> {
    try {
      const { title, description, severity, status, category, location } = alert;
      
      const result = await this.pool.query(
        `INSERT INTO alerts (
          title, description, severity, status, category, location, timestamp, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING *`,
        [title, description, severity || 'medium', status || 'New', category, location]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async update(id: number, alert: Partial<IAlert>): Promise<IAlert | null> {
    try {
      const updates = { ...alert, updated_at: new Date() };
      
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      if (keys.length === 0) return await this.findById(id);

      let query = 'UPDATE alerts SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += ` WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM alerts WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }
}

export default AlertModel;
