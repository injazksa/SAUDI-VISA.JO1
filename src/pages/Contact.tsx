import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    db.getSettings('site_config').then(({ data }) => setConfig(data));
  }, []);

  const contactInfo = config?.contact_info;

  return (
    <div className="pb-20 space-y-24">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-black mb-6">
            {isRtl ? 'تواصل مع مكتب تأشيرات السعودية' : 'Contact Saudi Visa Office'}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
            {isRtl 
              ? 'نحن هنا للإجابة على جميع استفساراتكم وتسهيل إجراءاتكم. لا تترددوا في الاتصال بنا.'
              : 'We are here to answer all your inquiries and facilitate your procedures. Feel free to contact us.'}
          </p>
          <div className="h-1.5 w-24 bg-secondary mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-primary mb-6">{isRtl ? 'معلومات التواصل المباشر' : 'Direct Contact Info'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-primary text-white group hover:bg-secondary transition-colors duration-500">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-secondary group-hover:text-primary group-hover:bg-white transition-all">
                      <Phone size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{isRtl ? 'اتصل بنا' : 'Call Us'}</h4>
                      <p className="text-white/70 group-hover:text-primary font-bold">{contactInfo?.phone}</p>
                    </div>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-primary" asChild>
                       <a href={`tel:${contactInfo?.phone}`}>{isRtl ? 'اتصل الآن' : 'Call Now'}</a>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white group hover:bg-primary transition-colors duration-500">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:text-secondary group-hover:bg-white/10 transition-all">
                      <MessageSquare size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-primary group-hover:text-white">{isRtl ? 'واتساب' : 'WhatsApp'}</h4>
                      <p className="text-muted-foreground group-hover:text-white/70 font-bold">{contactInfo?.whatsapp}</p>
                    </div>
                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                      <a href={`https://wa.me/${contactInfo?.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        {isRtl ? 'محادثة فورية' : 'Live Chat'}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-8 bg-muted/50 p-10 rounded-[40px] border border-dashed border-primary/20">
               <h3 className="text-2xl font-black text-primary">{isRtl ? 'عناوين البريد الإلكتروني' : 'Email Addresses'}</h3>
               <div className="space-y-6">
                  {[
                    { label: isRtl ? 'قسم التأشيرات' : 'Visas Dept', email: contactInfo?.email_visa },
                    { label: isRtl ? 'الدعم الفني' : 'Technical Support', email: contactInfo?.email_support },
                    { label: isRtl ? 'معلومات عامة' : 'General Info', email: contactInfo?.email_info }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 rtl:space-x-reverse">
                       <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                          <Mail size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-primary">{item.label}</p>
                          <p className="text-muted-foreground">{item.email}</p>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-8 border-t border-primary/10">
                  <h3 className="text-xl font-black text-primary mb-4 flex items-center gap-2">
                     <MapPin className="text-secondary" />
                     {isRtl ? 'موقعنا في الأردن' : 'Our Location in Jordan'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                     {isRtl ? contactInfo?.address_ar : contactInfo?.address_en}
                  </p>
                  <p className="mt-2 text-sm font-bold text-primary">
                     {isRtl ? "الشركة المتخصصة للتوظيف - ترخيص 22128" : "Specialized Recruitment Company - License 22128"}
                  </p>
               </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-full min-h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative group">
             {contactInfo?.google_maps_url ? (
               <iframe
                 src={contactInfo.google_maps_url}
                 className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                 style={{ border: 0 }}
                 allowFullScreen={true}
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
             ) : (
               <div className="w-full h-full bg-muted flex items-center justify-center">
                 <p className="text-muted-foreground">{isRtl ? 'خريطة الموقع غير متوفرة' : 'Map not available'}</p>
               </div>
             )}
             <div className="absolute bottom-8 left-8 right-8 bg-primary/90 backdrop-blur-md p-6 rounded-3xl text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="font-bold mb-2">{isRtl ? "تفضل بزيارتنا" : "Visit Us"}</p>
                <p className="text-sm text-white/70">{isRtl ? "نستقبلكم من الأحد إلى الخميس من ٩ صباحاً وحتى ٥ مساءً" : "We welcome you Sun - Thu, 9 AM - 5 PM"}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
