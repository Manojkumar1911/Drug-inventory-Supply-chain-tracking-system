
import { Pool } from 'pg';

export interface ISupplier {
  id?: number;
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  lead_time?: number;
  minimum_order_amount?: number;
  notes?: string;
  is_active?: boolean;
  rating?: number;
  created_at?: Date;
  updated_at?: Date;
}

class SupplierModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<ISupplier>): Promise<ISupplier[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM suppliers ORDER BY name');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM suppliers WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY name';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding suppliers:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<ISupplier | null> {
    try {
      const result = await this.pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding supplier by id:', error);
      throw error;
    }
  }

  async create(supplierData: ISupplier): Promise<ISupplier> {
    try {
      const result = await this.pool.query(
        `INSERT INTO suppliers 
        (name, contact_person, email, phone_number, address, city, state, zip_code, 
         country, tax_id, payment_terms, lead_time, minimum_order_amount, notes, 
         is_active, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING *`,
        [
          supplierData.name,
          supplierData.contact_person,
          supplierData.email,
          supplierData.phone_number,
          supplierData.address,
          supplierData.city,
          supplierData.state,
          supplierData.zip_code,
          supplierData.country || 'USA',
          supplierData.tax_id || null,
          supplierData.payment_terms || null,
          supplierData.lead_time || null,
          supplierData.minimum_order_amount || null,
          supplierData.notes || null,
          supplierData.is_active !== undefined ? supplierData.is_active : true,
          supplierData.rating || 3
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  async update(id: number, supplierData: Partial<ISupplier>): Promise<ISupplier | null> {
    try {
      const supplier = await this.findById(id);
      if (!supplier) return null;

      const keys = Object.keys(supplierData);
      const values = Object.values(supplierData);
      
      if (keys.length === 0) return supplier;

      let query = 'UPDATE suppliers SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }
}

export default SupplierModel;
