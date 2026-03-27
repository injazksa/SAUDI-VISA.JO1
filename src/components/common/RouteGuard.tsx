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
      const isLoginPage = location.pathname === '/admin/login' || location.pathname.endsWith('/admin/login');
      const isAdminRoute = location.pathname.startsWith('/admin') && !isLoginPage;

      // 1. If we are on the login page, NEVER redirect away from it unless the user is already logged in as admin
      if (isLoginPage) {
        if (user && isAdmin) {
          console.log('User is already Admin, redirecting to Dashboard');
          navigate('/admin');
        }
        return;
      }

      // 2. If user is NOT logged in and tries to access a private route (not public and not login)
      if (!isPublicRoute && !user) {
        console.log('Not logged in, redirecting to Login');
        navigate('/admin/login', { state: { from: location } });
        return;
      }

      // 3. If user IS logged in but is NOT an admin and tries to access an admin route
      if (isAdminRoute && user && !isAdmin) {
        console.log('Logged in but not Admin, redirecting to Home');
        navigate('/');
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
