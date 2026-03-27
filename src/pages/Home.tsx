import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { Service, NewsItem, BlogPost, SiteConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [servicesRes, newsRes, blogRes, settingsRes] = await Promise.all([
        db.getFeaturedServices(),
        db.getNews(),
        db.getBlogPosts(),
        db.getSettings('site_config')
      ]);

      setServices(servicesRes.data);
      setNews(newsRes.data.slice(0, 3));
      setBlog(blogRes.data.slice(0, 3));
      setConfig(settingsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const isRtl = i18n.language === 'ar';
  const hero = isRtl ? config?.hero_ar : config?.hero_en;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-40">
           <img 
            src={hero?.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_5f3a7008-e70c-4bc1-9b29-35d47f184b4e.jpg"} 
            alt="Saudi Arabia" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center md:text-start rtl:md:text-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {hero?.title || t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90">
              {hero?.subtitle || t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
              <Link to="/services">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-secondary hover:bg-secondary/90 text-white border-none" asChild>
                  <span>{hero?.cta_text || t('home.featuredServices')}</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                  <span>{t('common.contactUs')}</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('home.featuredServices')}</h2>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow border-none shadow-md">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_749b82f7-0505-4624-92ea-cb4903859165.jpg"} 
                    alt={isRtl ? service.title_ar : service.title_en} 
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary">
                    {isRtl ? service.title_ar : service.title_en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-muted-foreground line-clamp-3 mb-6">
                    {isRtl ? service.description_ar : service.description_en}
                  </p>
                  <Link to={`/services/${service.slug}`}>
                    <Button variant="link" className="p-0 text-primary font-bold flex items-center space-x-2 rtl:space-x-reverse" asChild>
                      <span>
                        <span>{t('common.readMore')}</span>
                        {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* News & Blog Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* News Column */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">{t('common.latestNews')}</h3>
                <Link to="/news" className="text-sm font-medium text-secondary hover:underline">{t('common.viewAll')}</Link>
              </div>
              <div className="space-y-6">
                {news.map((item) => (
                  <Link key={item.id} to={`/news/${item.slug}`} className="group flex space-x-4 rtl:space-x-reverse items-center bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden">
                      <img src={item.image_url} alt={isRtl ? item.title_ar : item.title_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {isRtl ? item.title_ar : item.title_en}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-JO' : 'en-US')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog Column */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">{t('common.latestBlog')}</h3>
                <Link to="/blog" className="text-sm font-medium text-secondary hover:underline">{t('common.viewAll')}</Link>
              </div>
              <div className="space-y-6">
                {blog.map((item) => (
                  <Link key={item.id} to={`/blog/${item.slug}`} className="group flex space-x-4 rtl:space-x-reverse items-center bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden">
                      <img src={item.image_url} alt={isRtl ? item.title_ar : item.title_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {isRtl ? item.title_ar : item.title_en}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-JO' : 'en-US')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">{t('home.contactSection')}</h2>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              {isRtl 
                ? "فريقنا المتخصص جاهز للرد على جميع استفساراتكم ومساعدتكم في إنهاء إجراءات تأشيرتكم بسرعة واحترافية."
                : "Our specialized team is ready to answer all your inquiries and help you complete your visa procedures quickly and professionally."
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse">
              <a href={`tel:${config?.contact_info.phone}`} className="flex items-center space-x-3 rtl:space-x-reverse bg-white text-primary px-6 py-4 rounded-xl font-bold hover:bg-secondary hover:text-white transition-all w-full sm:w-auto">
                 <span className="text-xl">{config?.contact_info.phone}</span>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg rounded-xl w-full sm:w-auto" asChild>
                  <span>{t('common.contactUs')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
