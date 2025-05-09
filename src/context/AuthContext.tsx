
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log('Auth state changed:', event);
          setSession(newSession);
          
          if (newSession?.user) {
            const userData: AuthUser = {
              id: newSession.user.id,
              name: newSession.user.user_metadata.name || 'User',
              email: newSession.user.email || '',
              role: newSession.user.user_metadata.role || 'user'
            };
            setUser(userData);
            setIsAuthenticated(true);
            
            // Update user profile in profiles table
            setTimeout(async () => {
              try {
                await supabase.from('profiles').upsert({
                  id: newSession.user.id,
                  name: newSession.user.user_metadata.name,
                  role: newSession.user.user_metadata.role || 'user',
                  updated_at: new Date().toISOString(),
                });
              } catch (error) {
                console.error('Error updating profile:', error);
              }
            }, 0);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          
          setLoading(false);
        }
      );

      // Then check for existing session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        const userData: AuthUser = {
          id: data.session.user.id,
          name: data.session.user.user_metadata.name || 'User',
          email: data.session.user.email || '',
          role: data.session.user.user_metadata.role || 'user'
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
      
      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Logged in successfully');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create a profile entry
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: name,
          role: 'user',
        });
        
        toast.success('Account created successfully! Please check your email to confirm your account.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = { 
    user, 
    session,
    login, 
    signup, 
    logout, 
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
