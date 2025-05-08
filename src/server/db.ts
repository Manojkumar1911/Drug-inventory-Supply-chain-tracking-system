
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { join } from 'path';

// Configure dotenv to read from root directory
dotenv.config({ path: join(process.cwd(), '.env') });

// Database connection details from environment variables
const connectionString = process.env.DATABASE_URL;

// Create a connection pool
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Connection state
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Initialize the database connection
 * @returns {Promise<Pool>} The database connection pool
 */
export async function initDb(): Promise<Pool> {
  if (isConnected) {
    // If already connected, just return the pool
    return pool;
  }
  
  try {
    connectionAttempts++;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('\x1b[33m%s\x1b[0m', 'Connecting to PostgreSQL database...');
    
    // Test the connection
    const client = await pool.connect();
    
    try {
      // Execute a simple query to verify the connection
      await client.query('SELECT NOW()');
      
      isConnected = true;
      console.log('\x1b[32m%s\x1b[0m', '✓ PostgreSQL connected successfully');
      console.log('\x1b[33m%s\x1b[0m', 'Database is ready to use');
      
      connectionAttempts = 0;
      return pool;
      
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '✗ Database connection failed:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    if (connectionAttempts < MAX_RETRIES) {
      console.log('\x1b[33m%s\x1b[0m', `Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${connectionAttempts}/${MAX_RETRIES})`);
      
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return initDb();
    } else {
      console.error('\x1b[31m%s\x1b[0m', 'Max connection attempts reached. Check your database configuration.');
      throw error;
    }
  }
}

/**
 * Check health of the database connection
 * @returns {Promise<boolean>} True if the connection is healthy
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export the pool
export default pool;
