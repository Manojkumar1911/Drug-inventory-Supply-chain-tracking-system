import { Pool } from 'pg';

export interface ISettings {
  id?: number;
  key: string;
  value: any;
  group_name: string;
  description?: string;
  is_system?: boolean;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

class SettingsModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<ISettings>): Promise<ISettings[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM settings');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM settings WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding settings:', error);
      throw error;
    }
  }

  async findByKey(key: string): Promise<ISettings | null> {
    try {
      const result = await this.pool.query('SELECT * FROM settings WHERE key = $1', [key]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding setting by key:', error);
      throw error;
    }
  }

  async create(settingData: ISettings): Promise<ISettings> {
    try {
      const result = await this.pool.query(
        `INSERT INTO settings 
        (key, value, group_name, description, is_system, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [
          settingData.key,
          JSON.stringify(settingData.value),
          settingData.group_name,
          settingData.description || null,
          settingData.is_system || false,
          settingData.updated_by || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  }

  async update(key: string, settingData: Partial<ISettings>): Promise<ISettings | null> {
    try {
      const setting = await this.findByKey(key);
      if (!setting) return null;

      const updates = { ...settingData };
      
      if (updates.value !== undefined) {
        updates.value = JSON.stringify(updates.value);
      }

      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      if (keys.length === 0) return setting;

      let query = 'UPDATE settings SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE key = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, key]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM settings WHERE key = $1', [key]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  }
}

export default SettingsModel;
