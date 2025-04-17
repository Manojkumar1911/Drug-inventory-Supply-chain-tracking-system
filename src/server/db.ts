
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

const connectDB = () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('\x1b[31m%s\x1b[0m', 'PostgreSQL connection string is missing in .env file');
      console.log('\x1b[33m%s\x1b[0m', 'Please create a .env file with DATABASE_URL=your_connection_string');
      return null;
    }
    
    // Create connection pool
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    // Test connection
    pool.query('SELECT NOW()', (err) => {
      if (err) {
        console.error('\x1b[31m%s\x1b[0m', '✗ PostgreSQL connection error:', err);
        handleConnectionFailure();
      } else {
        console.log('\x1b[32m%s\x1b[0m', '✓ PostgreSQL connected successfully');
        connectionAttempts = 0;
        createConnectionAlert('Database Connection Established', 
          'PostgreSQL connection successfully established', 
          'low');
      }
    });
    
    pool.on('error', (err) => {
      console.error('\x1b[31m%s\x1b[0m', '✗ PostgreSQL connection error:', err);
      createConnectionAlert('Database Connection Error', 
        `PostgreSQL connection error: ${err.message}`, 
        'high');
      handleConnectionFailure();
    });
    
    return pool;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'PostgreSQL connection error:', error);
    return null;
  }
};

function handleConnectionFailure() {
  if (connectionAttempts < MAX_RETRIES) {
    console.log('\x1b[33m%s\x1b[0m', `Attempting to reconnect (${connectionAttempts + 1}/${MAX_RETRIES})...`);
    connectionAttempts++;
    setTimeout(() => {
      connectDB();
    }, 5000);
  } else {
    console.error('\x1b[31m%s\x1b[0m', 'Max reconnection attempts reached. Please restart the server.');
    createConnectionAlert('Database Connection Failed', 
      'Maximum reconnection attempts reached. Database is not available.', 
      'critical');
  }
}

async function createConnectionAlert(title: string, description: string, severity: 'critical' | 'high' | 'medium' | 'low') {
  try {
    if (pool) {
      await pool.query(
        'INSERT INTO alerts (title, description, severity, status, category, location, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [title, description, severity, 'New', 'System', 'Database', new Date()]
      );
    }
  } catch (error) {
    console.error('Error creating connection alert:', error);
  }
}

export default connectDB;
