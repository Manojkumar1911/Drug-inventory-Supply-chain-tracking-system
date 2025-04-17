
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { supabase } from '@/integrations/supabase/client';

dotenv.config();

let pool: Pool | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

/**
 * Creates a connection to the PostgreSQL database using Supabase credentials
 */
const connectDB = () => {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('\x1b[31m%s\x1b[0m', 'PostgreSQL connection string is missing in .env file');
      return null;
    }
    
    // Parse connection details for logging
    const connectionDetails = parseConnectionString(connectionString);
    
    console.log('\x1b[36m%s\x1b[0m', '🔌 Attempting to connect to Supabase PostgreSQL database...');
    console.log('\x1b[33m%s\x1b[0m', 'Connection Details:');
    console.log('Host:', connectionDetails.host || 'Unknown');
    console.log('Database:', connectionDetails.database || 'Unknown');
    console.log('Project ID:', 'labzxhoshhzfixlzccrw');
    
    // Create connection pool with enhanced configuration for Supabase
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase SSL connection
      },
      // Additional connection pool settings
      max: 10, // maximum number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    });
    
    // Test connection with detailed logging
    pool.connect((err, client, release) => {
      if (err) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Supabase PostgreSQL connection error:', err);
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
        console.log('\x1b[33m%s\x1b[0m', 'Database is ready to use');
        
        // Also check if we can connect through the supabase client
        checkSupabaseClientConnection();
        
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

/**
 * Handles connection failures with retry logic
 */
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

/**
 * Checks if we can connect through the Supabase client
 */
async function checkSupabaseClientConnection() {
  try {
    // Try to make a simple query using the supabase client
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', '✗ Supabase client connection test failed:', error.message);
    } else {
      console.log('\x1b[32m%s\x1b[0m', '✓ Supabase client connection test successful');
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Supabase client connection test error:', error);
  }
}

/**
 * Parses a PostgreSQL connection string into its components
 */
function parseConnectionString(connectionString: string) {
  try {
    const details: {
      host?: string;
      port?: string;
      database?: string;
      user?: string;
    } = {};
    
    // Extract host
    const hostMatch = connectionString.match(/@([^:]+):/);
    if (hostMatch && hostMatch[1]) {
      details.host = hostMatch[1];
    }
    
    // Extract port
    const portMatch = connectionString.match(/:(\d+)\//);
    if (portMatch && portMatch[1]) {
      details.port = portMatch[1];
    }
    
    // Extract database
    const dbMatch = connectionString.match(/\/([^?]+)($|\?)/);
    if (dbMatch && dbMatch[1]) {
      details.database = dbMatch[1];
    }
    
    // Extract user
    const userMatch = connectionString.match(/\/\/([^:]+):/);
    if (userMatch && userMatch[1]) {
      details.user = userMatch[1];
    }
    
    return details;
  } catch (error) {
    console.error('Error parsing connection string:', error);
    return {};
  }
}

export default connectDB;
