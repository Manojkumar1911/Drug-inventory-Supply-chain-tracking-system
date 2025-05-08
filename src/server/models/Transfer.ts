import { Pool } from 'pg';

export interface ITransfer {
  id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  from_location: string;
  to_location: string;
  requested_by: string;
  transfer_date?: Date;
  completed_date?: Date;
  notes?: string;
  status?: 'Pending Approval' | 'Approved' | 'In Transit' | 'Completed' | 'Cancelled';
  priority?: 'Urgent' | 'High' | 'Normal' | 'Low';
  created_at?: Date;
  updated_at?: Date;
}

class TransferModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<ITransfer>): Promise<ITransfer[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM transfers ORDER BY created_at DESC');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM transfers WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY created_at DESC';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding transfers:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<ITransfer | null> {
    try {
      const result = await this.pool.query('SELECT * FROM transfers WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding transfer by id:', error);
      throw error;
    }
  }

  async create(transferData: ITransfer): Promise<ITransfer> {
    try {
      const result = await this.pool.query(
        `INSERT INTO transfers 
        (product_id, product_name, quantity, from_location, to_location, 
         requested_by, transfer_date, notes, status, priority)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [
          transferData.product_id,
          transferData.product_name,
          transferData.quantity,
          transferData.from_location,
          transferData.to_location,
          transferData.requested_by,
          transferData.transfer_date || new Date(),
          transferData.notes || null,
          transferData.status || 'Pending Approval',
          transferData.priority || 'Normal'
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw error;
    }
  }

  async update(id: number, transferData: Partial<ITransfer>): Promise<ITransfer | null> {
    try {
      const transfer = await this.findById(id);
      if (!transfer) return null;

      const keys = Object.keys(transferData);
      const values = Object.values(transferData);
      
      if (keys.length === 0) return transfer;

      let query = 'UPDATE transfers SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating transfer:', error);
      throw error;
    }
  }
}

export default TransferModel;
