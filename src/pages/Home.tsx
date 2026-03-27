import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, ShieldCheck, Globe, Clock, Star, 
  HelpCircle, CheckCircle2, Phone, ExternalLink, Calculator, UserCheck, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { db, getFaqs, getTestimonials } from '@/db/api';
import { Service, NewsItem, BlogPost, SiteConfig, FAQ, Testimonial } from '@/types';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [latestBlog, setLatestBlog] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const services = await db.getFeaturedServices();
      const news = await db.getNews();
      const blog = await db.getBlogPosts();
      const settings = await db.getSettings('site_config');
      const faqData = await getFaqs();
      const testimonialData = await getTestimonials();

      setFeaturedServices(services.data || []);
      setLatestNews((news.data || []).slice(0, 3));
      setLatestBlog((blog.data || []).slice(0, 3));
      setConfig(settings.data);
      setFaqs(faqData || []);
      setTestimonials(testimonialData || []);
    };
    fetchData();
  }, []);

  const hero = isRtl ? config?.hero_ar : config?.hero_en;

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary rounded-full -mr-96 -mt-96 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/30 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-secondary/20 text-secondary border border-secondary/30 px-4 py-2 rounded-full text-sm font-bold"
            >
              <ShieldCheck size={18} />
              <span>{isRtl ? "مكتب معتمد للسفارة السعودية في الأردن" : "Certified Saudi Embassy Office in Jordan"}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white leading-tight"
            >
              {hero?.title || (isRtl ? "مركز تأشيرات السعودية المعتمد" : "Approved Saudi Visa Center")}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/80 leading-relaxed font-medium"
            >
              {hero?.subtitle || (isRtl ? "نحن شريكك الموثوق لتسهيل كافة إجراءات التأشيرات والمصادقات الرسمية." : "Your trusted partner for facilitating all visa procedures and official authentications.")}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse pt-4"
            >
              <Link to="/services">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-secondary hover:bg-secondary/90 text-white border-none py-7 rounded-2xl shadow-xl shadow-secondary/20" asChild>
                  <span>{isRtl ? "استكشف خدماتنا" : "Explore Services"}</span>
                </Button>
              </Link>
              <Link to="/tools/visa-calculator">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-white/30 text-white hover:bg-white hover:text-primary py-7 rounded-2xl backdrop-blur-sm" asChild>
                   <span>
                      <Calculator className="mr-2 rtl:ml-2" size={20} />
                      {isRtl ? "حاسبة الرسوم" : "Fee Calculator"}
                   </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Clock />, label_ar: "سرعة الإنجاز", label_en: "Fast Processing" },
              { icon: <ShieldCheck />, label_ar: "موثوقية تامة", label_en: "Full Reliability" },
              { icon: <Star />, label_ar: "خبرة واسعة", label_en: "Great Experience" },
              { icon: <Globe />, label_ar: "تغطية شاملة", label_en: "Full Coverage" }
            ].map((badge, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 border-b-4 border-secondary">
                 <div className="text-secondary">{badge.icon}</div>
                 <span className="font-bold text-primary text-sm md:text-base">{isRtl ? badge.label_ar : badge.label_en}</span>
              </div>
            ))}
         </div>
      </div>

      {/* About Quick Section */}
      <section className="container mx-auto px-4">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-secondary/10 rounded-3xl -rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070&auto=format&fit=crop" 
                 alt="Office" 
                 className="relative z-10 rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-3xl hidden md:block z-20 shadow-2xl">
                  <p className="text-4xl font-black text-secondary">15+</p>
                  <p className="text-sm font-bold">{isRtl ? "سنوات من الخدمة" : "Years of Service"}</p>
               </div>
            </div>
            <div className="space-y-6">
               <h2 className="text-4xl font-black text-primary leading-tight">
                 {isRtl ? "مكتب تأشيرات السعودية في الأردن - مركز معتمد" : "Saudi Visa Office in Jordan - Certified Center"}
               </h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                 {isRtl 
                   ? "نحن في الشركة المتخصصة للتوظيف (ترخيص رقم 22128) نفخر بكوننا الوجهة الأولى لكل من يسعى للحصول على تأشيرات المملكة العربية السعودية من الأردن. خدماتنا تشمل تصديق الشهادات الجامعية والوثائق الرسمية، وتسهيل كافة إجراءات السفارة السعودية."
                   : "We at Specialized Recruitment Company (License No. 22128) are proud to be the first destination for everyone seeking Saudi Arabia visas from Jordan. Our services include certification of university degrees and official documents, and facilitating all Saudi embassy procedures."
                 }
               </p>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    isRtl ? "حجز مواعيد التأشيرات" : "Visa Appointment Booking",
                    isRtl ? "تصديق الشهادات الجامعية" : "Degree Legalization",
                    isRtl ? "الاعتماد المهني السعودي" : "Saudi Prof. Accreditation",
                    isRtl ? "مصادقة السعودي (نفاذ)" : "Saudi Authentication (Nafath)",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3 rtl:space-x-reverse font-bold text-primary">
                      <CheckCircle2 className="text-secondary" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
               </ul>
               <Button className="mt-4 px-10 py-7 text-lg font-bold rounded-2xl" asChild>
                 <Link to="/about">{isRtl ? "تعرف علينا أكثر" : "Know More About Us"}</Link>
               </Button>
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-primary">{t('home.featuredServices')}</h2>
              <div className="h-1.5 w-24 bg-secondary rounded-full"></div>
            </div>
            <Link to="/services">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl font-bold">
                <span>
                  {isRtl ? "عرض جميع الخدمات" : "View All Services"}
                  {isRtl ? <ArrowLeft className="mr-2" /> : <ArrowRight className="ml-2" />}
                </span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl group">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={service.image_url || "https://images.unsplash.com/photo-1551882547-ff43c63faf76?q=80&w=2070&auto=format&fit=crop"}
                      alt={isRtl ? service.title_ar : service.title_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                       <h3 className="text-xl font-bold text-white leading-tight">
                         {isRtl ? service.title_ar : service.title_en}
                       </h3>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-grow">
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {isRtl ? service.description_ar : service.description_en}
                    </p>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Link to={`/services/${service.slug}`} className="w-full">
                      <Button variant="secondary" className="w-full font-bold py-6 rounded-2xl bg-secondary/10 text-primary hover:bg-secondary hover:text-white border-none transition-colors" asChild>
                        <span>{t('common.readMore')}</span>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Tools Section */}
      <section className="container mx-auto px-4">
         <div className="bg-primary rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
               <div className="space-y-6">
                  <h2 className="text-4xl md:text-5xl font-black leading-tight">
                    {isRtl ? "أدوات ذكية لتسهيل إجراءاتك" : "Smart Tools to Facilitate Your Procedures"}
                  </h2>
                  <p className="text-white/70 text-lg">
                    {isRtl 
                      ? "نوفر لك مجموعة من الأدوات الإلكترونية التي تساعدك في معرفة متطلبات التأشيرات والتحقق من أهليتك المهنية."
                      : "We provide a set of electronic tools that help you know visa requirements and verify your professional eligibility."
                    }
                  </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { 
                      icon: <Calculator size={32} />, 
                      title: isRtl ? "حاسبة التأشيرات" : "Visa Calculator",
                      desc: isRtl ? "احسب الرسوم والأوراق" : "Calculate fees & papers",
                      path: "/tools/visa-calculator"
                    },
                    { 
                      icon: <ShieldCheck size={32} />, 
                      title: isRtl ? "الاعتماد المهني" : "Professional Accreditation",
                      desc: isRtl ? "تحقق من مهنتك" : "Check your profession",
                      path: "/tools/saudi-accreditation"
                    },
                    { 
                      icon: <FileText size={32} />, 
                      title: isRtl ? "الأوراق المطلوبة" : "Required Papers",
                      desc: isRtl ? "قائمة المستندات الشاملة" : "Comprehensive list",
                      path: "/tools/required-documents"
                    },
                    { 
                      icon: <UserCheck size={32} />, 
                      title: isRtl ? "مصادقة نفاذ" : "Nafath Auth",
                      desc: isRtl ? "توثيق الهوية الرقمية" : "Identity verification",
                      path: "/tools/saudi-auth"
                    },
                    { 
                      icon: <Globe size={32} />, 
                      title: isRtl ? "مواعيد السفارة" : "Embassy Appointments",
                      desc: isRtl ? "احجز موعدك الآن" : "Book your appointment",
                      path: "/contact"
                    }
                  ].map((tool, idx) => (
                    <Link key={idx} to={tool.path} className="group">
                       <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 hover:bg-secondary transition-all duration-300">
                          <div className="mb-4 text-secondary group-hover:text-white transition-colors">{tool.icon}</div>
                          <h4 className="text-xl font-bold mb-1">{tool.title}</h4>
                          <p className="text-xs text-white/50 group-hover:text-white/80">{tool.desc}</p>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-black text-primary flex items-center justify-center space-x-4 rtl:space-x-reverse">
                 <HelpCircle className="text-secondary" size={40} />
                 <span>{isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</span>
               </h2>
               <p className="text-muted-foreground">{isRtl ? "إليك إجابات لأكثر التساؤلات تكراراً حول خدماتنا." : "Here are answers to the most frequent questions about our services."}</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem key={faq.id} value={`item-${idx}`} className="bg-white border rounded-3xl px-6 py-2 shadow-sm data-[state=open]:shadow-md transition-all">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline text-primary">
                    {isRtl ? faq.question_ar : faq.question_en}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                    {isRtl ? faq.answer_ar : faq.answer_en}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
         </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-24">
         <div className="container mx-auto px-4 text-center space-y-12">
            <h2 className="text-4xl font-black text-primary">{isRtl ? "آراء عملائنا" : "Customer Reviews"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonials.map((t) => (
                 <Card key={t.id} className="border-none shadow-xl rounded-3xl p-8 text-center space-y-4 relative">
                    <div className="flex justify-center text-secondary mb-2">
                       {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                    </div>
                    <p className="italic text-muted-foreground leading-relaxed">"{isRtl ? t.content_ar : t.content_en}"</p>
                    <h4 className="font-bold text-primary">{isRtl ? t.author_ar : t.author_en}</h4>
                    <div className="absolute top-4 right-4 opacity-10">
                       <Star size={60} fill="currentColor" className="text-primary" />
                    </div>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4">
         <div className="bg-secondary rounded-[40px] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="pattern" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-primary leading-tight">
              {isRtl ? "ابدأ معاملتك الآن بكل سهولة" : "Start Your Transaction Easily Now"}
            </h2>
            <p className="text-primary/70 text-xl max-w-2xl mx-auto font-medium">
              {isRtl 
                ? "تواصل مع خبرائنا اليوم للحصول على استشارة مجانية وبدء إجراءات تأشيرتك."
                : "Contact our experts today for a free consultation and start your visa procedures."
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
               <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-xl py-8 px-12 rounded-2xl shadow-2xl font-black" asChild>
                 <a href="tel:0789881009">
                    <Phone className="mr-3 rtl:ml-3" />
                    0789881009
                 </a>
               </Button>
               <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-xl py-8 px-12 rounded-2xl font-black" asChild>
                 <a href={`https://wa.me/962789881009`} target="_blank" rel="noopener noreferrer">
                    {isRtl ? "واتساب مباشر" : "Direct WhatsApp"}
                 </a>
               </Button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
