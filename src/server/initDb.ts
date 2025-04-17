
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Initializing database...');

    // Read schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);
    console.log('Schema created successfully');

    // Check if admin user exists
    const adminResult = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminResult.rowCount === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('Default admin user created');
    }

    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  } finally {
    pool.end();
  }
}

export default initializeDatabase;
