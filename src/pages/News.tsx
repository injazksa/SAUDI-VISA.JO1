import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { NewsItem } from '@/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, ArrowLeft, Newspaper } from 'lucide-react';

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getNews().then(({ data }) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  const isRtl = i18n.language === 'ar';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-20">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bccfdee9-a894-44fa-a38a-d2f25d943e12.jpg" alt="News" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('nav.news')}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* News Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden h-full flex flex-col md:flex-row hover:shadow-xl transition-all border-none shadow-md group">
                <div className="h-64 md:h-full md:w-2/5 overflow-hidden shrink-0">
                  <img 
                    src={item.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bccfdee9-a894-44fa-a38a-d2f25d943e12.jpg"} 
                    alt={isRtl ? item.title_ar : item.title_en} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-secondary font-bold mb-4 uppercase tracking-wider">
                    <Calendar size={14} />
                    <span>{new Date(item.created_at).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary line-clamp-2 mb-4 group-hover:text-secondary transition-colors">
                    {isRtl ? item.title_ar : item.title_en}
                  </CardTitle>
                  <CardContent className="p-0 flex-1">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-6">
                      {isRtl ? item.excerpt_ar : item.excerpt_en}
                    </p>
                  </CardContent>
                  <CardFooter className="p-0 pt-4 flex justify-between items-center border-t">
                    <Link to={`/news/${item.slug}`} className="text-primary font-bold text-sm flex items-center space-x-2 rtl:space-x-reverse group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      <span>{t('common.readMore')}</span>
                      {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default News;
