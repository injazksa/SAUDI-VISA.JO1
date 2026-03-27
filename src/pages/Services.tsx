import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { Service } from '@/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getServices().then(({ data }) => {
      setServices(data);
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
          <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_749b82f7-0505-4624-92ea-cb4903859165.jpg" alt="Services" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('nav.services')}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all border-none shadow-md group">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={service.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_749b82f7-0505-4624-92ea-cb4903859165.jpg"} 
                    alt={isRtl ? service.title_ar : service.title_en} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {isRtl ? service.title_ar : service.title_en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                    {isRtl ? service.description_ar : service.description_en}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-8 px-6 flex justify-between items-center">
                  <Link to={`/services/${service.slug}`} className="w-full">
                    <Button className="w-full text-lg font-bold group" asChild>
                      <span>
                        <span>{t('common.readMore')}</span>
                        {isRtl ? <ArrowLeft size={18} className="mr-2 group-hover:mr-4 transition-all" /> : <ArrowRight size={18} className="ml-2 group-hover:ml-4 transition-all" />}
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

export default Services;
