import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import PATHS from '@/routes/paths';
import Loader from '@/components/feedback/Loader';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground select-none">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign-in, remembering where the user was trying to go
    return <Navigate to={PATHS.SIGN_IN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

