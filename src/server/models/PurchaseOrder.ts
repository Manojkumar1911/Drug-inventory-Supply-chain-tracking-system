import { Pool } from 'pg';

export interface IPurchaseOrderItem {
  id?: number;
  purchase_order_id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface IPurchaseOrder {
  id?: number;
  order_number: string;
  supplier_id: number;
  supplier_name: string;
  status?: string;
  submitted_by: string;
  approved_by?: string;
  expected_delivery_date?: Date;
  received_date?: Date;
  notes?: string;
  total_amount: number;
  payment_status?: string;
  payment_due_date?: Date;
  payment_method?: string;
  payment_reference?: string;
  shipping_method?: string;
  tracking_number?: string;
  created_at?: Date;
  updated_at?: Date;
  items?: IPurchaseOrderItem[];
}

class PurchaseOrderModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async find(conditions?: Partial<IPurchaseOrder>): Promise<IPurchaseOrder[]> {
    try {
      let query = `
        SELECT po.*, 
          json_agg(poi.*) as items 
        FROM purchase_orders po
        LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      `;
      
      const values: any[] = [];
      
      if (conditions && Object.keys(conditions).length > 0) {
        query += ' WHERE ';
        query += Object.keys(conditions).map((key, index) => {
          values.push(conditions[key as keyof IPurchaseOrder]);
          return `po.${key} = $${index + 1}`;
        }).join(' AND ');
      }
      
      query += ' GROUP BY po.id ORDER BY po.created_at DESC';
      
      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding purchase orders:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<IPurchaseOrder | null> {
    try {
      const result = await this.pool.query(
        `SELECT po.*, 
          json_agg(poi.*) as items 
        FROM purchase_orders po
        LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
        WHERE po.id = $1
        GROUP BY po.id`,
        [id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding purchase order by id:', error);
      throw error;
    }
  }

  async create(orderData: IPurchaseOrder): Promise<IPurchaseOrder> {
    try {
      // Begin transaction
      await this.pool.query('BEGIN');
      
      // Generate order number if not provided
      if (!orderData.order_number) {
        const countResult = await this.pool.query('SELECT COUNT(*) FROM purchase_orders');
        const orderCount = parseInt(countResult.rows[0].count);
        orderData.order_number = `PO-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(5, '0')}`;
      }
      
      // Create purchase order
      const result = await this.pool.query(
        `INSERT INTO purchase_orders
        (order_number, supplier_id, supplier_name, status, submitted_by, 
         approved_by, expected_delivery_date, notes, total_amount, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [
          orderData.order_number,
          orderData.supplier_id,
          orderData.supplier_name,
          orderData.status || 'Draft',
          orderData.submitted_by,
          orderData.approved_by || null,
          orderData.expected_delivery_date || null,
          orderData.notes || null,
          orderData.total_amount,
          orderData.payment_status || 'Unpaid'
        ]
      );
      
      const purchaseOrder = result.rows[0];
      
      // Insert order items
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          await this.pool.query(
            `INSERT INTO purchase_order_items
            (purchase_order_id, product_id, product_name, quantity, unit_price, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              purchaseOrder.id, 
              item.product_id, 
              item.product_name, 
              item.quantity, 
              item.unit_price, 
              item.total_price
            ]
          );
        }
      }
      
      // Commit transaction
      await this.pool.query('COMMIT');
      
      // Return complete order with items
      return this.findById(purchaseOrder.id);
    } catch (error) {
      // Rollback transaction on error
      await this.pool.query('ROLLBACK');
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  async update(id: number, orderData: Partial<IPurchaseOrder>): Promise<IPurchaseOrder | null> {
    try {
      const order = await this.findById(id);
      if (!order) return null;

      // Begin transaction
      await this.pool.query('BEGIN');
      
      const { items, ...orderUpdateData } = orderData;
      
      // Update order
      if (Object.keys(orderUpdateData).length > 0) {
        const keys = Object.keys(orderUpdateData);
        const values = Object.values(orderUpdateData);
        
        let query = 'UPDATE purchase_orders SET ';
        query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        query += `, updated_at = NOW() WHERE id = $${keys.length + 1}`;
  
        await this.pool.query(query, [...values, id]);
      }
      
      // Update items if provided
      if (items && Array.isArray(items)) {
        // Remove existing items
        await this.pool.query('DELETE FROM purchase_order_items WHERE purchase_order_id = $1', [id]);
        
        // Insert new items
        for (const item of items) {
          await this.pool.query(
            `INSERT INTO purchase_order_items
            (purchase_order_id, product_id, product_name, quantity, unit_price, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              id, 
              item.product_id, 
              item.product_name, 
              item.quantity, 
              item.unit_price, 
              item.total_price
            ]
          );
        }
      }
      
      // Commit transaction
      await this.pool.query('COMMIT');
      
      // Return updated order
      return this.findById(id);
    } catch (error) {
      // Rollback transaction on error
      await this.pool.query('ROLLBACK');
      console.error('Error updating purchase order:', error);
      throw error;
    }
  }
}

export default PurchaseOrderModel;
