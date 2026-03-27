import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Newspaper, 
  Briefcase, 
  Mail, 
  LogOut, 
  Home,
  User,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const AdminLayout: React.FC = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === 'ar';

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'News', path: '/admin/news', icon: Newspaper },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Contact Submissions', path: '/admin/contact', icon: Mail },
  ];

  if (!isAdmin) {
    return null; // RouteGuard handles the redirect
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-background border-r flex flex-col transition-all duration-300",
        isRtl ? "border-l border-r-0" : ""
      )}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary truncate">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse p-3 text-muted-foreground hover:bg-muted rounded-md text-sm">
            <Home size={20} />
            <span>Go to Site</span>
          </Link>
          <button 
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 text-destructive hover:bg-destructive/10 rounded-md text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-background border-b flex items-center justify-between px-8">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <span className="text-sm font-medium text-muted-foreground">Welcome,</span>
             <span className="text-sm font-bold text-foreground">{profile?.email}</span>
          </div>
          <div className="flex items-center space-x-4">
             <Button variant="outline" size="sm" onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')}>
               {isRtl ? 'EN' : 'AR'}
             </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
