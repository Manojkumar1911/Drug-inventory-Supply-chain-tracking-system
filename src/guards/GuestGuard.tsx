
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const GuestGuard = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Button disabled variant="ghost" size="lg">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Loading...
        </Button>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestGuard;
