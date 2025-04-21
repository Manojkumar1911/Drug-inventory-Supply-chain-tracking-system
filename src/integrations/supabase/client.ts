
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import type { User } from '@supabase/supabase-js';

// Get environment variables for Supabase connection
const SUPABASE_URL = "https://labzxhoshhzfixlzccrw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYnp4aG9zaGh6Zml4bHpjY3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzA0MzksImV4cCI6MjA2MDQ0NjQzOX0.GbnzLqFktcNHynfhUIHa0kf-FQyrX2wCu7p2k1uJLI8";

// Create the Supabase client with enhanced options for auth and storage
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    },
    global: {
      headers: {
        'x-application-name': 'Drug-Inventory-Supply-Chain',
      },
    },
  }
);

// User type definition
export type UserSession = {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
};

// Extract and format session data
export const extractSession = (session: any): UserSession => {
  if (!session) return { user: null, access_token: null, refresh_token: null };
  
  return {
    user: session.user || null,
    access_token: session.access_token || null,
    refresh_token: session.refresh_token || null,
  };
};

// Create a helper function for authenticated queries
export const authenticatedQuery = async <T>(
  callback: () => Promise<T>
): Promise<T> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) {
    throw new Error('Not authenticated');
  }
  
  return callback();
};

// Connection status checker
export const checkSupabaseConnection = async () => {
  try {
    // Use a safer method to check connection without using tables that may not exist yet
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return { connected: false, error: error.message };
    }
    
    console.log('Supabase connection success');
    return { connected: true };
  } catch (error) {
    console.error('Supabase connection check error:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
