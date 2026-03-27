import React, { useEffect } from 'react';
import { BrowserRouter, useRoutes, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/sonner';
import { routes } from '@/routes';
import { useTranslation } from 'react-i18next';
import '@/i18n';

const AppContent: React.FC = () => {
  const content = useRoutes(routes);
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{content}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteGuard>
          <AppContent />
          <Toaster position="top-center" />
        </RouteGuard>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
