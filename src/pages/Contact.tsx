import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getSettings('site_config').then(({ data }) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    const { error } = await db.submitContact(values);
    if (error) {
      toast.error(t('common.error'));
    } else {
      toast.success(t('common.success'));
      form.reset();
    }
  };

  const isRtl = i18n.language === 'ar';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const contactInfo = config?.contact_info;

  return (
    <div className="pb-20 space-y-20">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_6d6280b6-7e55-4984-8b26-0c993b67db30.jpg" alt="Contact" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('nav.contact')}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
               <h2 className="text-3xl font-bold text-primary">{t('contact.info')}</h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                 {isRtl 
                    ? "نحن هنا لمساعدتكم في أي وقت. لا تترددوا في التواصل معنا عبر أي من الوسائل التالية، أو زيارتنا في مكتبنا."
                    : "We are here to help you anytime. Feel free to contact us through any of the following means, or visit us in our office."
                 }
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t('contact.phone')}</h4>
                    <p className="text-muted-foreground">{contactInfo?.phone}</p>
                    <p className="text-muted-foreground">{contactInfo?.whatsapp}</p>
                  </div>
               </div>

               <div className="flex space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="break-all">
                    <h4 className="font-bold text-lg">{t('contact.emails')}</h4>
                    <p className="text-muted-foreground text-sm">{contactInfo?.email}</p>
                    <p className="text-muted-foreground text-sm">{contactInfo?.support_email}</p>
                  </div>
               </div>

               <div className="flex space-x-4 rtl:space-x-reverse sm:col-span-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t('contact.address')}</h4>
                    <p className="text-muted-foreground">{isRtl ? contactInfo?.address_ar : contactInfo?.address_en}</p>
                  </div>
               </div>
            </div>

            <div className="bg-muted p-8 rounded-2xl flex items-center justify-between border">
               <div className="space-y-2">
                  <h4 className="font-bold text-xl flex items-center space-x-2 rtl:space-x-reverse">
                    <MessageCircle className="text-[#25D366]" size={24} />
                    <span>WhatsApp</span>
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {isRtl ? "تواصل معنا مباشرة عبر واتساب" : "Contact us directly via WhatsApp"}
                  </p>
               </div>
               <a href={`https://wa.me/${contactInfo?.whatsapp}`} target="_blank" rel="noopener noreferrer">
                 <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                   <span>{t('common.whatsapp')}</span>
                 </Button>
               </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 md:p-12 shadow-xl border"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={isRtl ? "أدخل اسمك" : "Enter your name"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={isRtl ? "example@domain.com" : "example@domain.com"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.message')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"} 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-6 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                  <Send size={20} />
                  <span>{t('common.send')}</span>
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="container mx-auto px-4">
        <div className="space-y-8">
           <div className="text-center">
             <h2 className="text-3xl font-bold text-primary mb-4">{t('contact.location')}</h2>
             <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
           </div>
           <div className="rounded-3xl overflow-hidden shadow-2xl h-[450px] border">
             <iframe 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               style={{ border: 0 }} 
               referrerPolicy="no-referrer-when-downgrade" 
               src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&q=Jordan,Amman,Jabal Amman,First Circle&language=en&region=cn" 
               allowFullScreen
             ></iframe>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
