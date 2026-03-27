import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FileText, Newspaper, Mail, TrendingUp, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    services: 0,
    blog: 0,
    news: 0,
    contact: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [servicesRes, blogRes, newsRes, contactRes] = await Promise.all([
        db.getServices(),
        db.getBlogPosts(),
        db.getNews(),
        db.getContactSubmissions()
      ]);

      setStats({
        services: servicesRes.data.length,
        blog: blogRes.data.length,
        news: newsRes.data.length,
        contact: contactRes.data.length,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Services', value: stats.services, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', link: '/admin/services' },
    { title: 'Blog Posts', value: stats.blog, icon: FileText, color: 'text-green-600', bg: 'bg-green-100', link: '/admin/blog' },
    { title: 'News Items', value: stats.news, icon: Newspaper, color: 'text-purple-600', bg: 'bg-purple-100', link: '/admin/news' },
    { title: 'Contact Submissions', value: stats.contact, icon: Mail, color: 'text-orange-600', bg: 'bg-orange-100', link: '/admin/contact' },
  ];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-primary">Admin Dashboard Overview</h1>
         <div className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
            <TrendingUp size={16} />
            <span>Real-time Stats</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                   </div>
                   <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                   </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
               <CardTitle>Welcome to your control center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-muted-foreground leading-relaxed">
                  From here you can manage all aspects of your Saudiavisa website. Use the sidebar to navigate through different content types.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/30 flex items-center space-x-4 rtl:space-x-reverse">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <TrendingUp size={20} />
                     </div>
                     <span className="text-sm font-medium">Updates are instant</span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/30 flex items-center space-x-4 rtl:space-x-reverse">
                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                        <Users size={20} />
                     </div>
                     <span className="text-sm font-medium">Multi-language support</span>
                  </div>
               </div>
            </CardContent>
         </Card>
         
         <Card className="border-none shadow-md">
            <CardHeader>
               <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <Link to="/admin/services">
                 <Button variant="outline" className="w-full justify-start space-x-2 rtl:space-x-reverse" asChild>
                    <span>
                      <Briefcase size={16} />
                      <span>Add New Service</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/blog">
                 <Button variant="outline" className="w-full justify-start space-x-2 rtl:space-x-reverse" asChild>
                    <span>
                      <FileText size={16} />
                      <span>Post to Blog</span>
                    </span>
                 </Button>
               </Link>
               <Link to="/admin/settings">
                 <Button variant="outline" className="w-full justify-start space-x-2 rtl:space-x-reverse" asChild>
                    <span>
                      <Settings size={16} />
                      <span>Update Contact Info</span>
                    </span>
                 </Button>
               </Link>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

const cn = (...args: any[]) => args.filter(Boolean).join(' ');

export default Dashboard;
