
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
      return null;
    }
    
    // Create connection pool with enhanced configuration
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Important for Supabase SSL connection
      },
      // Additional connection pool settings
      max: 10, // maximum number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    });
    
    // Test connection with detailed logging
    pool.connect((err, client, release) => {
      if (err) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Supabase PostgreSQL connection error:', err);
        console.log('\x1b[33m%s\x1b[0m', 'Connection Details:');
        console.log('Host:', connectionString.split('@')[1].split(':')[0]);
        console.log('Port:', connectionString.split(':')[3].split('/')[0]);
        console.log('Database:', connectionString.split('/')[3]);
        handleConnectionFailure();
        return;
      }
      
      // Connection successful, run a test query
      client.query('SELECT NOW()', (queryErr) => {
        release(); // Always release the client back to the pool
        
        if (queryErr) {
          console.error('\x1b[31m%s\x1b[0m', '✗ Supabase query execution error:', queryErr);
          handleConnectionFailure();
          return;
        }
        
        console.log('\x1b[32m%s\x1b[0m', '✓ Supabase PostgreSQL connected successfully');
        console.log('\x1b[33m%s\x1b[0m', 'Connection Details:');
        console.log('Host:', connectionString.split('@')[1].split(':')[0]);
        console.log('Port:', connectionString.split(':')[3].split('/')[0]);
        console.log('Database:', connectionString.split('/')[3]);
        
        connectionAttempts = 0;
      });
    });
    
    pool.on('error', (err) => {
      console.error('\x1b[31m%s\x1b[0m', '✗ Supabase PostgreSQL pool error:', err);
      handleConnectionFailure();
    });
    
    return pool;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Supabase PostgreSQL connection error:', error);
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
    console.error('\x1b[31m%s\x1b[0m', 'Max reconnection attempts reached. Please check your connection details.');
  }
}

export default connectDB;
