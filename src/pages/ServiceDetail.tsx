import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { Service } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Info, DollarSign } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      db.getServiceBySlug(slug).then(({ data }) => {
        setService(data);
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

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Service Not Found</h2>
        <Link to="/services">
          <Button variant="default" asChild><span>Back to Services</span></Button>
        </Link>
      </div>
    );
  }

  const title = isRtl ? service.title_ar : service.title_en;
  const description = isRtl ? service.description_ar : service.description_en;
  const requirements = isRtl ? service.requirements_ar : service.requirements_en;

  return (
    <div className="pb-20">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={service.image_url || "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_749b82f7-0505-4624-92ea-cb4903859165.jpg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {title}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Back Button */}
          <Link to="/services">
             <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground hover:text-primary mb-8" asChild>
               <span>
                 {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                 <span>{isRtl ? "العودة للخدمات" : "Back to Services"}</span>
               </span>
             </Button>
          </Link>

          {/* Description */}
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-md border border-border space-y-8">
            <div className="space-y-4">
               <h2 className="text-2xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
                 <Info size={28} className="text-secondary" />
                 <span>{isRtl ? "عن الخدمة" : "About the Service"}</span>
               </h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                 {description}
               </p>
            </div>

            {/* Requirements */}
            {requirements && (
              <div className="space-y-4 pt-8 border-t">
                 <h2 className="text-2xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
                   <CheckCircle size={28} className="text-secondary" />
                   <span>{t('common.requirements')}</span>
                 </h2>
                 <div className="bg-muted p-6 rounded-xl prose prose-sm md:prose-lg max-w-none prose-primary whitespace-pre-wrap">
                   {requirements}
                 </div>
              </div>
            )}

            {/* Fees */}
            {service.fees && (
              <div className="space-y-4 pt-8 border-t">
                 <h2 className="text-2xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
                   <DollarSign size={28} className="text-secondary" />
                   <span>{t('common.fees')}</span>
                 </h2>
                 <p className="text-xl font-bold text-secondary">
                   {service.fees}
                 </p>
              </div>
            )}
            
            <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="text-muted-foreground italic text-center sm:text-start">
                 {isRtl ? "للمزيد من المعلومات أو البدء بالإجراءات، تواصل معنا" : "For more information or to start the procedures, contact us"}
               </p>
               <Link to="/contact">
                 <Button size="lg" className="px-10 text-lg font-bold" asChild>
                   <span>{t('common.contactUs')}</span>
                 </Button>
               </Link>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px]">
             <img src={service.image_url} alt={title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
