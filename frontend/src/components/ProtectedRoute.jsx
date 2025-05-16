// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#076870]"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If a role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    // Redirect to the appropriate dashboard based on their role
    switch (user.role?.toLowerCase()) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'provider':
        return <Navigate to="/provider-dashboard" replace />;
      case 'client':
        return <Navigate to="/client-dashboard" replace />;
      default:
        // If role is not recognized, redirect to home
        return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required role (or no specific role is required)
  return children;
};

export default ProtectedRoute;