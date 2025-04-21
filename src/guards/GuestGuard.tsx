
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const GuestGuard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
