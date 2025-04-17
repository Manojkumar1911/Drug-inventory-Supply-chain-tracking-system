
import { Pool } from 'pg';

export interface ILocation {
  id?: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_number?: string;
  email?: string;
  manager?: string;
  is_active?: boolean;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

class LocationModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<ILocation>): Promise<ILocation[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM locations ORDER BY name');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM locations WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY name';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding locations:', error);
      throw error;
    }
  }

  async create(locationData: ILocation): Promise<ILocation> {
    try {
      const result = await this.pool.query(
        `INSERT INTO locations 
        (name, address, city, state, zip_code, country, phone_number, email, manager, is_active, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
        [
          locationData.name,
          locationData.address,
          locationData.city,
          locationData.state,
          locationData.zip_code,
          locationData.country || 'USA',
          locationData.phone_number || null,
          locationData.email || null,
          locationData.manager || null,
          locationData.is_active !== undefined ? locationData.is_active : true,
          locationData.notes || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<ILocation | null> {
    try {
      const result = await this.pool.query('SELECT * FROM locations WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding location by id:', error);
      throw error;
    }
  }

  async findByName(name: string): Promise<ILocation | null> {
    try {
      const result = await this.pool.query('SELECT * FROM locations WHERE name = $1', [name]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding location by name:', error);
      throw error;
    }
  }

  async update(id: number, locationData: Partial<ILocation>): Promise<ILocation | null> {
    try {
      const location = await this.findById(id);
      if (!location) return null;

      const keys = Object.keys(locationData);
      const values = Object.values(locationData);
      
      if (keys.length === 0) return location;

      let query = 'UPDATE locations SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }
}

export default LocationModel;
