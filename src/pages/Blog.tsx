import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { BlogPost } from '@/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getBlogPosts().then(({ data }) => {
      setPosts(data);
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
          <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e4e26778-4e3a-4156-9e5f-1a630816f906.jpg" alt="Blog" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('nav.blog')}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all border-none shadow-md group">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={post.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_e4e26778-4e3a-4156-9e5f-1a630816f906.jpg"} 
                    alt={isRtl ? post.title_ar : post.title_en} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-muted-foreground mb-2">
                    <span className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar size={14} />
                      <span>{new Date(post.created_at).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}</span>
                    </span>
                    <span className="flex items-center space-x-1 rtl:space-x-reverse">
                      <User size={14} />
                      <span>Admin</span>
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-primary line-clamp-2">
                    {isRtl ? post.title_ar : post.title_en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {isRtl ? post.excerpt_ar : post.excerpt_en}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-8 px-6">
                  <Link to={`/blog/${post.slug}`} className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors" asChild>
                      <span>
                        <span>{t('common.readMore')}</span>
                        {isRtl ? <ArrowLeft size={18} className="mr-2" /> : <ArrowRight size={18} className="ml-2" />}
                      </span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
