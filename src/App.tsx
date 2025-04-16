
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Transfers from "./pages/Transfers";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Log authentication status for debugging
    console.log("Auth status:", isAuthenticated);
  }, [isAuthenticated]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/transfers"
        element={
          <ProtectedRoute>
            <Transfers />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
