
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Main Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Alerts from './pages/Alerts';
import Transfers from './pages/Transfers';
import Reorder from './pages/Reorder';
import Suppliers from './pages/Suppliers';
import Locations from './pages/Locations';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Guards
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        
        {/* Guest routes (not accessible when logged in) */}
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/reorder" element={<Reorder />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
