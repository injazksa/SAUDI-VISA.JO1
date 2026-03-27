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
  HelpCircle,
  UserCheck,
  Globe,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminLayout: React.FC = () => {
  const { profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'لوحة القيادة', path: '/admin', icon: LayoutDashboard },
    { name: 'الخدمات', path: '/admin/services', icon: Briefcase },
    { name: 'المدونة', path: '/admin/blog', icon: FileText },
    { name: 'الأخبار', path: '/admin/news', icon: Newspaper },
    { name: 'الأسئلة الشائعة', path: '/admin/faqs', icon: HelpCircle },
    { name: 'المهن والرموز', path: '/admin/professions', icon: UserCheck },
    { name: 'الجنسيات', path: '/admin/nationalities', icon: Globe },
    { name: 'المستخدمين', path: '/admin/users', icon: Users },
    { name: 'الرسائل', path: '/admin/contact', icon: Mail },
    { name: 'الإعدادات', path: '/admin/settings', icon: Settings },
  ];

  if (!isAdmin) {
    return null; // RouteGuard handles the redirect
  }

  return (
    <div className="flex h-screen bg-muted/30 font-arabic" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col transition-all duration-300 shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-black text-secondary truncate">لوحة التحكم</h1>
          <p className="text-xs text-white/50 mt-1">إدارة مكتب تأشيرات السعودية</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-xl transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-secondary text-primary font-bold shadow-lg" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={22} className={cn(location.pathname === item.path ? "text-primary" : "text-secondary group-hover:text-white")} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10 space-y-3">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm">
            <Home size={20} />
            <span>عرض الموقع</span>
          </Link>
          <button 
            onClick={() => {
              signOut();
              navigate('/admin/login');
            }}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <Globe size={20} />
             </div>
             <div>
                <span className="text-sm font-medium text-muted-foreground block">مرحباً بك،</span>
                <span className="text-sm font-bold text-primary">{profile?.email}</span>
             </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <div className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-black">
                مدير النظام
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
