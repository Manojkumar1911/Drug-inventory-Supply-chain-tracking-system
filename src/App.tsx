
import { Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Temporarily removed protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/analytics" element={<Analytics />} />
      
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
