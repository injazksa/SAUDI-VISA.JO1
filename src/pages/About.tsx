import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, History, Users, Award, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="pb-20 space-y-24">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-black mb-6">
            {isRtl ? 'مكتب تأشيرات السعودية في الأردن' : 'Saudi Visa Office in Jordan'}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
            {isRtl 
              ? 'نحن الشريك الاستراتيجي والمعتمد لكل من يرغب في الحصول على خدمات التأشيرات السعودية وتصديق الوثائق الرسمية من المملكة الأردنية الهاشمية.'
              : 'We are the strategic and certified partner for everyone who wants to obtain Saudi visa services and legalize official documents from the Hashemite Kingdom of Jordan.'}
          </p>
          <div className="h-1.5 w-24 bg-secondary mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-primary leading-tight">
              {isRtl ? 'مركز معتمد للسفارة السعودية' : 'Approved Saudi Embassy Center'}
            </h2>
            <div className="prose prose-lg prose-primary max-w-none text-muted-foreground leading-relaxed">
              <p>
                {isRtl 
                  ? "تعتبر الشركة المتخصصة للتوظيف (ترخيص رقم 22128) من المكاتب الرائدة والمعتمدة لتقديم كافة خدمات التأشيرات السعودية في الأردن. نحن نمتلك خبرة تمتد لسنوات طويلة في التعامل مع متطلبات السفارة السعودية والمصالح القنصلية."
                  : "Specialized Recruitment Company (License No. 22128) is one of the leading and approved offices for providing all Saudi visa services in Jordan. We have years of experience dealing with the requirements of the Saudi embassy and consular interests."}
              </p>
              <p>
                {isRtl 
                  ? "مركزنا يوفر حلولاً شاملة لتأشيرات العمل، السياحة، الزيارة، والعمرة، بالإضافة إلى خدمات تصديق الشهادات الجامعية والوثائق الرسمية، والاعتماد المهني السعودي، ومصادقة نفاذ."
                  : "Our center provides comprehensive solutions for work, tourism, visit, and Umrah visas, in addition to university degree legalization services, Saudi professional accreditation, and Nafath authentication."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                isRtl ? "موثوقية تامة" : "Total Reliability",
                isRtl ? "دقة في المواعيد" : "Punctuality",
                isRtl ? "فريق عمل محترف" : "Professional Team",
                isRtl ? "استشارات مجانية" : "Free Consultations"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse font-bold text-primary bg-muted/50 p-4 rounded-xl">
                  <CheckCircle2 className="text-secondary shrink-0" size={24} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-secondary/10 rounded-[40px] rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
               className="relative z-10 rounded-[40px] shadow-2xl" 
               alt="About Saudiavisa" 
             />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: <Users />, count: "10,000+", label_ar: "عميل سعيد", label_en: "Happy Client" },
            { icon: <Award />, count: "100%", label_ar: "نسبة النجاح", label_en: "Success Rate" },
            { icon: <History />, count: "15+", label_ar: "سنة خبرة", label_en: "Years Experience" },
            { icon: <ShieldCheck />, count: "22128", label_ar: "رقم الترخيص", label_en: "License No." }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-4">
               <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-secondary mb-4">
                  {stat.icon}
               </div>
               <div className="text-4xl font-black text-secondary">{stat.count}</div>
               <div className="text-lg font-bold">{isRtl ? stat.label_ar : stat.label_en}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4">
         <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-black text-primary">{isRtl ? "قيمنا الجوهرية" : "Our Core Values"}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
               {isRtl ? "نحن نؤمن بأن النجاح يكمن في الالتزام بأعلى معايير الجودة والأمانة." : "We believe that success lies in committing to the highest standards of quality and integrity."}
            </p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title_ar: "الأمانة والنزاهة", 
                title_en: "Honesty & Integrity",
                desc_ar: "نتعامل مع بيانات عملائنا بأعلى مستويات الخصوصية والأمانة المطلقة.",
                desc_en: "We handle our clients' data with the highest levels of privacy and absolute integrity."
              },
              { 
                title_ar: "السرعة والدقة", 
                title_en: "Speed & Accuracy",
                desc_ar: "نحن نقدر وقت عملائنا، لذا نضمن إنجاز المعاملات بأسرع وقت ممكن وبدقة متناهية.",
                desc_en: "We value our clients' time, so we ensure transactions are completed as quickly as possible with extreme accuracy."
              },
              { 
                title_ar: "خدمة العملاء", 
                title_en: "Customer Service",
                desc_ar: "نحن هنا من أجلك، فريقنا جاهز للرد على استفساراتك ومساعدتك في كل خطوة.",
                desc_en: "We are here for you; our team is ready to answer your inquiries and help you every step of the way."
              }
            ].map((value, idx) => (
              <Card key={idx} className="border-none shadow-xl rounded-3xl overflow-hidden hover:bg-muted/50 transition-colors">
                 <CardContent className="p-10 space-y-4 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                       {idx === 0 ? <ShieldCheck /> : idx === 1 ? <Clock /> : <Users />}
                    </div>
                    <h3 className="text-xl font-bold text-primary">{isRtl ? value.title_ar : value.title_en}</h3>
                    <p className="text-muted-foreground leading-relaxed">{isRtl ? value.desc_ar : value.desc_en}</p>
                 </CardContent>
              </Card>
            ))}
         </div>
      </section>
    </div>
  );
};

export default About;
