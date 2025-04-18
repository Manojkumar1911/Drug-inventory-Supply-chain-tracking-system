
import { supabase } from './client';
import { toast } from 'sonner';

/**
 * Helper class for bridging between the Supabase client and our PostgreSQL backend API
 * This allows us to use both direct Supabase calls and our custom API endpoints
 */
export class SupabaseIntegration {
  /**
   * Check if user is authenticated with Supabase
   */
  static async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  /**
   * Get current user data
   */
  static async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Sign up a new user
   */
  static async signUp(email: string, password: string, userData?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during signup';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Log in a user
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during login';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during logout';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Reset a user's password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during password reset';
      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Check connection status to both the API and Supabase
   */
  static async checkConnections() {
    try {
      // Check API connection
      const apiResponse = await fetch('/api/system/status');
      const apiStatus = await apiResponse.json();
      
      // Check Supabase connection using a safer method
      const { data, error } = await supabase.auth.getSession();
      const supabaseConnected = !error;
      
      return {
        api: apiStatus,
        supabase: {
          connected: supabaseConnected,
          error: error?.message
        }
      };
    } catch (error) {
      console.error('Error checking connections:', error);
      return {
        api: { connected: false },
        supabase: { connected: false }
      };
    }
  }
}

// Export a singleton instance
export const supabaseIntegration = new SupabaseIntegration();
