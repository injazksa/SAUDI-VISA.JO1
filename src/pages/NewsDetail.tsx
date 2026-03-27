import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { NewsItem } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, Newspaper, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      db.getNewsBySlug(slug).then(({ data }) => {
        setNewsItem(data);
        setLoading(false);
      });
    }
  }, [slug]);

  const isRtl = i18n.language === 'ar';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">News Item Not Found</h2>
        <Link to="/news">
          <Button variant="default" asChild><span>Back to News</span></Button>
        </Link>
      </div>
    );
  }

  const title = isRtl ? newsItem.title_ar : newsItem.title_en;
  const content = isRtl ? newsItem.content_ar : newsItem.content_en;

  return (
    <div className="pb-20">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={newsItem.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bccfdee9-a894-44fa-a38a-d2f25d943e12.jpg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto leading-tight"
          >
            {title}
          </motion.h1>
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm font-medium opacity-90 mt-6">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar size={18} className="text-secondary" />
              <span>{new Date(newsItem.created_at).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}</span>
            </span>
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Newspaper size={18} className="text-secondary" />
              <span>Latest News</span>
            </span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/news">
             <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground hover:text-primary mb-8" asChild>
               <span>
                 {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                 <span>{isRtl ? "العودة للأخبار" : "Back to News"}</span>
               </span>
             </Button>
          </Link>

          {/* Main Content */}
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-md border border-border">
            <div className="prose prose-sm md:prose-lg lg:prose-xl max-w-none prose-primary whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {content}
            </div>

            <div className="mt-16 pt-8 border-t flex items-center justify-between">
               <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-sm font-bold text-primary">{isRtl ? "شارك الخبر:" : "Share News:"}</span>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success(isRtl ? "تم نسخ الرابط" : "Link copied!");
                  }}>
                    <Share2 size={18} />
                  </Button>
               </div>
               <Link to="/news">
                 <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse" asChild>
                    <span>
                      <span>{isRtl ? "المزيد من الأخبار" : "More News"}</span>
                      {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </span>
                 </Button>
               </Link>
            </div>
          </div>
          
          {/* Image */}
          {newsItem.image_url && (
            <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl h-[450px]">
               <img src={newsItem.image_url} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
