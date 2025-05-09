import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Locations from './pages/Locations';
import Transfers from './pages/Transfers';
import PurchaseOrders from './pages/PurchaseOrders';
import Reorder from './pages/Reorder';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import AIFeatures from './pages/AIFeatures';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import MainLayout from './components/layout/MainLayout';
import FloatingChatButton from './components/ai/FloatingChatButton';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      try {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(null);
      }
    }
  }, []);

  const authContextValue: AuthContextProps = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sb-access-token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const user = localStorage.getItem('user');
          setUser(user ? JSON.parse(user) : null);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setUser(null);
        }
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, [setIsAuthenticated, setUser]);
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
            
            <Route element={<AuthGuard />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/transfers" element={<Transfers />} />
                <Route path="/purchase-orders" element={<PurchaseOrders />} />
                <Route path="/reorder" element={<Reorder />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
          
          {/* Floating chatbot available on all authenticated routes */}
          <Routes>
            <Route element={<AuthGuard />}>
              <Route path="*" element={<FloatingChatButton />} />
            </Route>
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
