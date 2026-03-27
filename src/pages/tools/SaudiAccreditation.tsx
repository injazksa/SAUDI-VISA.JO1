import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SaudiAccreditation: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-20 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <h1 className="text-4xl font-bold mb-4 relative z-10">{isRtl ? 'الاعتماد المهني السعودي' : 'Saudi Professional Accreditation'}</h1>
         <div className="h-1 w-20 bg-secondary mx-auto relative z-10"></div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-none shadow-xl">
             <CardHeader className="p-8 border-b">
               <CardTitle className="text-2xl font-bold text-primary">{isRtl ? 'عن خدمة الاعتماد المهني' : 'About Professional Accreditation'}</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "خدمة الاعتماد المهني هي خدمة تهدف إلى التحقق من المؤهلات العلمية والمهنية للعمالة الوافدة للمملكة العربية السعودية، وذلك لضمان جودة الأداء في سوق العمل السعودي."
                    : "The professional accreditation service is a service that aims to verify the scientific and professional qualifications of expatriate labor to the Kingdom of Saudi Arabia, in order to ensure quality performance in the Saudi labor market."
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                   {[
                     isRtl ? "مطابقة المؤهلات العلمية" : "Matching scientific qualifications",
                     isRtl ? "التحقق من الخبرات العملية" : "Verification of practical experiences",
                     isRtl ? "إصدار شهادات الكفاءة" : "Issuing certificates of competence",
                     isRtl ? "تسريع إجراءات التأشيرة" : "Speed up visa procedures"
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-muted/50 rounded-xl">
                        <ShieldCheck className="text-primary" size={24} />
                        <span className="font-medium">{item}</span>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>

           <div className="bg-muted p-8 rounded-2xl border border-dashed border-primary/20 flex flex-col items-center text-center space-y-6">
              <Info size={40} className="text-secondary" />
              <h3 className="text-xl font-bold text-primary">{isRtl ? 'هل تحتاج لمساعدة في تقديم طلب الاعتماد؟' : 'Need help submitting an accreditation request?'}</h3>
              <p className="text-muted-foreground max-w-md">
                {isRtl 
                  ? "فريقنا المتخصص يساعدك في رفع طلبك ومتابعته حتى الحصول على الاعتماد النهائي."
                  : "Our specialized team helps you upload your request and follow up until final accreditation is obtained."
                }
              </p>
              <Button size="lg" className="px-10 font-bold" asChild>
                <a href="https://svp.qiwa.sa/" target="_blank" rel="noopener noreferrer">
                  {isRtl ? 'زيارة موقع قوى (QIWA)' : 'Visit QIWA Site'}
                </a>
              </Button>
           </div>
        </div>

        <div className="space-y-8">
           <Card className="border-none shadow-xl bg-primary text-white">
              <CardHeader><CardTitle className="text-xl font-bold">{isRtl ? 'الأوراق المطلوبة للاعتماد' : 'Required Documents'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <ul className="space-y-4 text-sm">
                   {[
                     isRtl ? "نسخة مصدقة من الشهادة الجامعية" : "Certified copy of university degree",
                     isRtl ? "نسخة من جواز السفر" : "Copy of passport",
                     isRtl ? "شهادات الخبرة (إن وجدت)" : "Experience certificates (if any)",
                     isRtl ? "صورة شخصية حديثة" : "Recent personal photo"
                   ].map((item, i) => (
                     <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse p-3 border-b border-white/10 last:border-0">
                       <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 shrink-0"></div>
                       <span>{item}</span>
                     </li>
                   ))}
                 </ul>
              </CardContent>
           </Card>
           
           <div className="p-6 bg-secondary/10 rounded-2xl border border-secondary/20">
              <h4 className="font-bold text-primary mb-2">{isRtl ? 'تواصل معنا الآن' : 'Contact Us Now'}</h4>
              <p className="text-sm text-muted-foreground mb-4">{isRtl ? 'للحصول على استشارة مجانية حول الاعتماد المهني.' : 'To get a free consultation on professional accreditation.'}</p>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white" asChild>
                <a href="tel:0789881009">{isRtl ? 'اتصل بنا 0789881009' : 'Call 0789881009'}</a>
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SaudiAccreditation;
