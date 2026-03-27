import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Fingerprint, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SaudiAuth: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <h1 className="text-4xl font-bold mb-4 relative z-10">{isRtl ? 'مصادقة السعودي (نفاذ)' : 'Saudi Authentication (Nafath)'}</h1>
         <div className="h-1 w-20 bg-secondary mx-auto relative z-10"></div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-primary">{isRtl ? 'ما هو نظام نفاذ الموحد؟' : 'What is the Unified Nafath System?'}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRtl 
                ? "نظام نفاذ هو نظام وطني موحد يهدف إلى توفير وسيلة موحدة وآمنة للدخول إلى جميع المنصات الحكومية السعودية والخدمات الإلكترونية للأفراد والشركات."
                : "The Nafath system is a unified national system that aims to provide a unified and secure means to access all Saudi government platforms and electronic services for individuals and companies."
              }
            </p>
            <div className="space-y-4">
               {[
                 isRtl ? "دخول موحد وآمن لجميع المنصات" : "Unified and secure login for all platforms",
                 isRtl ? "تفعيل الهوية الرقمية للزائرين" : "Digital identity activation for visitors",
                 isRtl ? "ربط البيانات الشخصية بالخدمات الحكومية" : "Linking personal data with government services",
                 isRtl ? "أعلى درجات الأمان والخصوصية" : "Highest levels of security and privacy"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse font-medium">
                    <CheckCircle2 className="text-primary shrink-0" size={24} />
                    <span>{item}</span>
                 </div>
               ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 bg-muted rounded-3xl border-none shadow-inner"
          >
             <div className="flex flex-col items-center space-y-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                   <Fingerprint size={48} />
                </div>
                <h3 className="text-xl font-bold text-primary">{isRtl ? 'تحتاج لتفعيل هويتك الرقمية؟' : 'Need to activate your digital identity?'}</h3>
                <p className="text-sm text-muted-foreground">
                   {isRtl 
                     ? "نوفر لك خدمات الدعم الفني والمساعدة في تفعيل وتوثيق الهوية الرقمية في نظام نفاذ السعودي."
                     : "We provide technical support and assistance in activating and documenting digital identity in the Saudi Nafath system."
                   }
                </p>
                <Button size="lg" className="w-full font-bold py-6 text-lg" asChild>
                   <a href="https://www.iam.gov.sa/" target="_blank" rel="noopener noreferrer">
                      {isRtl ? 'زيارة منصة نفاذ' : 'Visit Nafath Platform'}
                   </a>
                </Button>
             </div>
          </motion.div>
        </div>

        <Card className="border-none shadow-2xl bg-muted/30">
           <CardHeader className="p-8 border-b bg-primary text-white">
              <CardTitle className="text-2xl font-bold flex items-center space-x-3 rtl:space-x-reverse">
                 <ShieldCheck size={28} className="text-secondary" />
                 <span>{isRtl ? 'تعليمات وإرشادات الاستخدام' : 'Instructions & Usage Guidelines'}</span>
              </CardTitle>
           </CardHeader>
           <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h4 className="font-bold text-primary">{isRtl ? 'للمواطنين السعوديين والمقيمين' : 'For Saudi Citizens & Residents'}</h4>
                 <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
                    <li>{isRtl ? "يجب تفعيل حساب أبشر مسبقاً" : "Absher account must be pre-activated"}</li>
                    <li>{isRtl ? "تحميل تطبيق نفاذ على الهاتف الذكي" : "Download Nafath app on smartphone"}</li>
                    <li>{isRtl ? "ربط رقم الهاتف المفعل بالحساب" : "Link the activated phone number to the account"}</li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold text-primary">{isRtl ? 'للزائرين والمستثمرين' : 'For Visitors & Investors'}</h4>
                 <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
                    <li>{isRtl ? "يمكن التسجيل برقم التأشيرة" : "Registration with visa number is possible"}</li>
                    <li>{isRtl ? "يجب توفر رقم هاتف سعودي مفعل" : "An activated Saudi phone number is required"}</li>
                    <li>{isRtl ? "توثيق البصمة في الأجهزة المخصصة" : "Fingerprint documentation at dedicated machines"}</li>
                 </ul>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaudiAuth;
