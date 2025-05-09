
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<GuestGuard />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            {/* Protected routes */}
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Floating chatbot available on all authenticated routes */}
          <FloatingChatButton />
          
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
