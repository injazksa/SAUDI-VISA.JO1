import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const RequiredDocuments: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const documents = [
    {
      title_ar: "تأشيرة السياحة",
      title_en: "Tourist Visa",
      docs_ar: ["جواز سفر ساري المفعول لـ ٦ أشهر", "صورة شخصية (٤*٦) بخلفية بيضاء", "تأمين طبي معتمد"],
      docs_en: ["Passport valid for 6 months", "Personal photo (4*6) with white background", "Certified medical insurance"]
    },
    {
      title_ar: "تأشيرة العمل",
      title_en: "Work Visa",
      docs_ar: ["أصل المؤهل العلمي مصدق", "تقرير طبي معتمد", "صحيفة الحالة الجنائية (عدم محكومية)", "عقد العمل مصدق"],
      docs_en: ["Original certified educational qualification", "Certified medical report", "Criminal record certificate", "Certified work contract"]
    },
    {
      title_ar: "الزيارة العائلية",
      title_en: "Family Visit",
      docs_ar: ["رقم مستند التأشيرة", "صورة جواز السفر للزائر", "إثبات صلة القرابة مصدق"],
      docs_en: ["Visa document number", "Visitor's passport copy", "Certified proof of relationship"]
    }
  ];

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <h1 className="text-4xl font-bold mb-4 relative z-10">{isRtl ? 'الأوراق والمستندات المطلوبة' : 'Required Documents & Papers'}</h1>
         <div className="h-1 w-20 bg-secondary mx-auto relative z-10"></div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/">
           <Button variant="ghost" className="mb-8 flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground hover:text-primary" asChild>
             <span>
               {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
               <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
             </span>
           </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {documents.map((item, idx) => (
             <Card key={idx} className="border-none shadow-xl rounded-[32px] overflow-hidden hover:scale-105 transition-transform">
               <CardHeader className="bg-primary text-white p-6">
                  <CardTitle className="text-xl font-bold text-center">{isRtl ? item.title_ar : item.title_en}</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  <ul className="space-y-4">
                    {(isRtl ? item.docs_ar : item.docs_en).map((doc, i) => (
                      <li key={i} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <CheckCircle2 className="text-secondary shrink-0" size={20} />
                        <span className="text-sm font-medium text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
               </CardContent>
             </Card>
           ))}
        </div>

        <div className="mt-16 bg-muted p-10 rounded-[40px] border-2 border-dashed border-primary/20 flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
              <Info size={40} />
           </div>
           <div className="space-y-2 text-center md:text-right">
              <h3 className="text-2xl font-black text-primary">{isRtl ? 'ملاحظة هامة جداً' : 'Very Important Note'}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isRtl 
                  ? "قد تتغير المتطلبات حسب كل حالة بشكل فردي، أو حسب تعليمات السفارة السعودية الجديدة. يرجى دائماً التأكد من مكتبنا قبل تجهيز الأوراق."
                  : "Requirements may change according to each individual case or new Saudi embassy instructions. Please always confirm with our office before preparing papers."
                }
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocuments;
