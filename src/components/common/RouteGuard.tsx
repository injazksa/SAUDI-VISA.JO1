import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_ROUTES = ['/', '/about', '/services', '/blog', '/news', '/contact', '/tools', '/legal', '/admin/login'];

export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('RouteGuard Check:', { pathname: location.pathname, user: !!user, isAdmin, loading });
    if (!loading) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        location.pathname === route || location.pathname.startsWith(route + '/')
      );
      const isLoginPage = location.pathname === '/admin/login' || location.pathname.includes('/admin/login');
      const isAdminRoute = location.pathname.startsWith('/admin') && !isLoginPage;

      if (isLoginPage) {
        console.log('Accessing Login Page - No Redirect Allowed');
        return;
      }

      // 1. If user is NOT logged in and tries to access a private route
      if (!isPublicRoute && !user) {
        navigate('/admin/login', { state: { from: location } });
        return;
      }

      // 2. If user IS logged in and tries to access an admin route but is NOT an admin
      if (isAdminRoute && user && !isAdmin) {
        navigate('/');
        return;
      }

      // 3. If user IS logged in and tries to access the login page
      if (isLoginPage && user) {
        navigate('/admin');
        return;
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
