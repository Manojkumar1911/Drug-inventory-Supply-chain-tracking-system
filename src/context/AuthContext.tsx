
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: object) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  updateProfile: async () => ({}),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for current session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role || 'Staff',
          };
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth session error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            role: session.user.user_metadata?.role || 'Staff',
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData = {}) => {
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
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          avatar_url: data.avatar_url,
          role: data.role
        }
      });
      if (error) throw error;
      
      // Update local state if successful
      if (user) {
        setUser({
          ...user,
          ...data
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };
  
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
