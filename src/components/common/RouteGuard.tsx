import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_ROUTES = ['/', '/about', '/services', '/blog', '/news', '/contact', '/login'];

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        location.pathname === route || location.pathname.startsWith(route + '/')
      );
      const isAdminRoute = location.pathname.startsWith('/admin');

      if (!isPublicRoute && !user) {
        navigate('/login', { state: { from: location } });
      } else if (isAdminRoute && !isAdmin) {
        navigate('/');
      } else if (user && location.pathname === '/login') {
        navigate('/');
      }
    }
  }, [user, loading, location, navigate, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
