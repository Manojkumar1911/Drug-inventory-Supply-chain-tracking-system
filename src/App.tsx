
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Transfers from "./pages/Transfers";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Locations from "./pages/Locations";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";
import Reorder from "./pages/Reorder";
import AuthGuard from "@/guards/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import AIFeatures from "./pages/AIFeatures";
import PurchaseOrders from "./pages/PurchaseOrders";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/not-found" element={<NotFound />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/transfers" element={<Transfers />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/users" element={<Users />} />
                <Route path="/reorder" element={<Reorder />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/purchase-orders" element={<PurchaseOrders />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/not-found" />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
