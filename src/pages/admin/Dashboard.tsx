import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Newspaper, 
  Mail, 
  TrendingUp, 
  Users, 
  Settings,
  HelpCircle,
  UserCheck,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/api';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    services: 0,
    blog: 0,
    news: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const services = await db.getServices();
      const blog = await db.getBlogPosts();
      const news = await db.getNews();
      const messages = await db.getContactSubmissions();
      
      setStats({
        services: services.data.length,
        blog: blog.data.length,
        news: news.data.length,
        messages: messages.data.length,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'الخدمات', value: stats.services, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'مقالات المدونة', value: stats.blog, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'الأخبار', value: stats.news, icon: Newspaper, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'رسائل التواصل', value: stats.messages, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div>
        <h1 className="text-4xl font-black text-primary flex items-center gap-4">
          <LayoutDashboard size={40} className="text-secondary" />
          <span>لوحة القيادة</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">نظرة عامة على حالة الموقع وإدارة المحتوى</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-xl rounded-[32px] overflow-hidden hover:scale-105 transition-transform">
            <CardContent className="p-8">
               <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                     <stat.icon size={28} />
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-bold text-muted-foreground">{stat.title}</p>
                     <p className="text-4xl font-black text-primary mt-1">{stat.value}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[32px] p-8">
           <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black text-primary flex items-center gap-3">
                 <TrendingUp className="text-secondary" />
                 <span>إجراءات سريعة</span>
              </CardTitle>
           </CardHeader>
           <CardContent className="px-0 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link to="/admin/services">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <Briefcase size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">إضافة خدمة جديدة</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/blog">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <FileText size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">نشر مقال جديد</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/news">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <Newspaper size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">إضافة خبر عاجل</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/faqs">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <HelpCircle size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">إدارة الأسئلة الشائعة</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/professions">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <UserCheck size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">تحديث دليل المهن</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/nationalities">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <Globe size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">إدارة الجنسيات</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/settings">
                 <Button variant="outline" className="w-full h-16 justify-start px-6 space-x-3 rtl:space-x-reverse rounded-2xl border-2 hover:bg-primary hover:text-white group transition-all" asChild>
                    <span>
                      <Settings size={22} className="text-secondary group-hover:text-white" />
                      <span className="text-lg">تحديث إعدادات الموقع</span>
                    </span>
                 </Button>
               </Link>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-[32px] p-8 bg-primary text-white">
           <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                 <Users className="text-secondary" />
                 <span>إدارة المستخدمين</span>
              </CardTitle>
           </CardHeader>
           <CardContent className="px-0 pt-8 space-y-6">
              <p className="text-white/70 leading-relaxed text-sm">
                 يمكنك إدارة صلاحيات المشرفين وتغيير كلمات المرور من خلال لوحة تحكم Supabase للحصول على أعلى معايير الأمان.
              </p>
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
                 <h4 className="font-bold mb-2">معلومة أمنية</h4>
                 <p className="text-xs text-white/50">يتم تشفير كافة كلمات المرور ولا يمكن لأي شخص حتى المدير رؤيتها، فقط يمكن إعادة تعيينها.</p>
              </div>
              <Button 
                onClick={() => toast.info("إدارة المشرفين ستكون متاحة قريباً في التحديث القادم.")}
                className="w-full bg-secondary text-white font-bold py-7 rounded-2xl hover:bg-white transition-all hover:text-primary"
              >
                إدارة المشرفين (قريباً)
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
