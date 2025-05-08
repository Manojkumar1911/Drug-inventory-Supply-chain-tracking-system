import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
  is_active?: boolean;
  last_login?: Date;
  created_by?: string;
  updated_by?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findById(id: number): Promise<IUser | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async find(conditions?: Partial<IUser>): Promise<IUser[]> {
    try {
      if (!conditions || Object.keys(conditions).length === 0) {
        const result = await this.pool.query('SELECT * FROM users ORDER BY created_at DESC');
        return result.rows;
      }

      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      
      let query = 'SELECT * FROM users WHERE ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
      query += ' ORDER BY created_at DESC';

      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }

  async create(userData: IUser): Promise<IUser> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const result = await this.pool.query(
        `INSERT INTO users 
        (name, email, password, role, is_active, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          userData.is_active !== undefined ? userData.is_active : true,
          userData.created_by || null,
          userData.updated_by || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: number, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await this.findById(id);
      if (!user) return null;

      const updates: any = { ...userData };
      
      // Hash password if it's being updated
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      if (keys.length === 0) return user;

      let query = 'UPDATE users SET ';
      query += keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      query += `, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;

      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async comparePassword(userId: number, candidatePassword: string): Promise<boolean> {
    try {
      const user = await this.findById(userId);
      if (!user) return false;
      
      return bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
      console.error('Error comparing password:', error);
      throw error;
    }
  }
}

export default UserModel;
