
import { Pool } from 'pg';

export interface IProduct {
  id?: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  expiry_date?: Date;
  reorder_level: number;
  manufacturer?: string;
  created_at?: Date;
  updated_at?: Date;
}

class ProductModel {
  private pool: typeof Pool;

  constructor(pool: typeof Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<IProduct>): Promise<IProduct[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM products ORDER BY name');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM products WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY name';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding products:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<IProduct | null> {
    try {
      const result = await this.pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding product by id:', error);
      throw error;
    }
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    try {
      const result = await this.pool.query('SELECT * FROM products WHERE sku = $1', [sku]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding product by sku:', error);
      throw error;
    }
  }

  async create(productData: IProduct): Promise<IProduct> {
    try {
      const result = await this.pool.query(
        `INSERT INTO products 
        (name, sku, category, quantity, unit, location, expiry_date, reorder_level, manufacturer)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          productData.name,
          productData.sku,
          productData.category,
          productData.quantity,
          productData.unit,
          productData.location,
          productData.expiry_date || null,
          productData.reorder_level,
          productData.manufacturer || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async update(id: number, productData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await this.findById(id);
      if (!product) return null;

      const keys = Object.keys(productData);
      const values = Object.values(productData);
      
      if (keys.length === 0) return product;

      let query = 'UPDATE products SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async findProductsToReorder(): Promise<IProduct[]> {
    try {
      const result = await this.pool.query('SELECT * FROM products WHERE quantity <= reorder_level');
      return result.rows;
    } catch (error) {
      console.error('Error finding products to reorder:', error);
      throw error;
    }
  }
}

export default ProductModel;
