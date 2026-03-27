import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, ShieldCheck, Globe, Clock, Star, 
  HelpCircle, CheckCircle2, Phone, ExternalLink, Calculator, UserCheck, FileText,
  ChevronLeft, ChevronRight
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSliders = [
    {
      image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg',
      title_ar: 'مكتب تأشيرات السعودية في الأردن',
      title_en: 'Saudi Visa Office in Jordan',
      subtitle_ar: 'المركز المعتمد للسفارة السعودية - الشركة المتخصصة للتوظيف ترخيص 22128',
      subtitle_en: 'Certified Center for the Saudi Embassy - Specialized Recruitment Company License 22128'
    },
    {
      image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_87030688-dd3c-4e24-9eb4-64bcaa1014a5.jpg',
      title_ar: 'إصدار كافة أنواع التأشيرات',
      title_en: 'Issuing All Types of Visas',
      subtitle_ar: 'تأشيرات العمل، الزيارة، السياحة، والعمرة بأعلى كفاءة وسرعة ممكنة.',
      subtitle_en: 'Work, Visit, Tourist, and Umrah visas with the highest efficiency and speed.'
    }
  ];

  const currentSliders = config?.home_sliders && config.home_sliders.length > 0 ? config.home_sliders : defaultSliders;

  useEffect(() => {
    if (currentSliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % currentSliders.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [currentSliders]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentSliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? currentSliders.length - 1 : prev - 1));
  };

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
      {/* Hero Section with Slider */}
      <section className="relative h-[95vh] md:h-[90vh] flex items-center bg-primary overflow-hidden">
        <AnimatePresence mode="wait">
          {config?.home_sliders && config.home_sliders.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110"
                style={{ backgroundImage: `url(${config.home_sliders[currentSlide].image_url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent rtl:bg-gradient-to-l"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary rounded-full -mr-96 -mt-96 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/30 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-secondary/20 text-secondary border border-secondary/30 px-5 py-2.5 rounded-full text-sm font-bold backdrop-blur-md"
            >
              <ShieldCheck size={18} />
              <span>{isRtl ? "مكتب معتمد للسفارة السعودية في الأردن" : "Certified Saudi Embassy Office in Jordan"}</span>
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                  {isRtl 
                    ? (config?.home_sliders?.[currentSlide]?.title_ar || config?.hero_ar?.title)
                    : (config?.home_sliders?.[currentSlide]?.title_en || config?.hero_en?.title)}
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
                  {isRtl 
                    ? (config?.home_sliders?.[currentSlide]?.subtitle_ar || config?.hero_ar?.subtitle)
                    : (config?.home_sliders?.[currentSlide]?.subtitle_en || config?.hero_en?.subtitle)}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse pt-4"
            >
              <Link to="/services">
                <Button size="lg" className="w-full sm:w-auto text-xl px-10 bg-secondary hover:bg-white text-primary font-black border-none py-8 rounded-2xl shadow-2xl shadow-secondary/20 transition-all hover:scale-105" asChild>
                  <span>{isRtl ? "استكشف خدماتنا" : "Explore Services"}</span>
                </Button>
              </Link>
              <Link to="/tools/visa-calculator">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-10 border-secondary/50 text-secondary hover:bg-secondary hover:text-primary py-8 rounded-2xl backdrop-blur-md font-black shadow-2xl transition-all hover:scale-105" asChild>
                    <span>
                       <Calculator className="mr-3 rtl:ml-3" size={24} />
                       {isRtl ? "حاسبة الرسوم الذكية" : "Smart Fee Calculator"}
                    </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-4 lg:right-10 flex items-center space-x-4 rtl:space-x-reverse z-30">
           <Button 
            onClick={prevSlide}
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-primary backdrop-blur-md border border-white/20 transition-all"
           >
              {isRtl ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
           </Button>
           <Button 
            onClick={nextSlide}
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-primary backdrop-blur-md border border-white/20 transition-all"
           >
              {isRtl ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
           </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-3 rtl:space-x-reverse z-30">
           {config?.home_sliders?.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentSlide(idx)}
               className={`h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-secondary' : 'w-2 bg-white/30'}`}
             ></button>
           ))}
        </div>
      </section>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 -mt-16 md:-mt-12 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {(config?.trust_badges || [
              { icon: 'Clock', label_ar: "سرعة الإنجاز", label_en: "Fast Processing" },
              { icon: 'ShieldCheck', label_ar: "موثوقية تامة", label_en: "Full Reliability" },
              { icon: 'Star', label_ar: "مركز معتمد", label_en: "Certified Center" },
              { icon: 'Globe', label_ar: "تغطية شاملة", label_en: "Full Coverage" }
            ]).map((badge, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center text-center space-y-4 border-b-8 border-secondary group hover:bg-primary transition-all duration-500"
              >
                 <div className="text-secondary group-hover:text-white transition-colors">
                    {badge.icon === 'Clock' && <Clock size={40} />}
                    {badge.icon === 'ShieldCheck' && <ShieldCheck size={40} />}
                    {badge.icon === 'Star' && <Star size={40} />}
                    {badge.icon === 'Globe' && <Globe size={40} />}
                 </div>
                 <span className="font-black text-primary group-hover:text-white text-lg transition-colors">{isRtl ? badge.label_ar : badge.label_en}</span>
              </motion.div>
            ))}
         </div>
      </div>

      {/* Tools Section */}
      <section className="bg-muted/30 py-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-primary leading-tight">
                  {isRtl ? "أدوات ذكية لتسهيل معاملاتك" : "Smart Tools to Simplify Your Transactions"}
               </h2>
               <p className="text-xl text-muted-foreground leading-relaxed">
                  {isRtl 
                    ? "نقدم لك مجموعة من الأدوات التفاعلية لمساعدتك في معرفة التكاليف والأوراق المطلوبة بدقة." 
                    : "We offer interactive tools to help you know costs and required documents accurately."}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Tool 1: Visa Calculator */}
               <motion.div whileHover={{ y: -10 }} className="h-full">
                  <Card className="h-full rounded-[40px] border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                     <div className="p-10 bg-primary text-white space-y-6 flex-1 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                           <div className="bg-secondary/20 w-20 h-20 rounded-3xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                              <Calculator size={40} />
                           </div>
                           <h3 className="text-3xl font-black">{isRtl ? "حاسبة الرسوم" : "Visa Calculator"}</h3>
                           <p className="text-white/70 leading-relaxed font-medium">
                              {isRtl ? "احسب التكلفة التقريبية لتأشيرتك بناءً على الجنسية ونوع التأشيرة." : "Calculate the approximate cost of your visa based on nationality and type."}
                           </p>
                        </div>
                        <Link to="/tools/visa-calculator">
                           <Button className="w-full bg-secondary text-primary font-black py-7 rounded-2xl hover:bg-white transition-colors">
                              {isRtl ? "ابدأ الحساب الآن" : "Start Calculating"}
                           </Button>
                        </Link>
                     </div>
                  </Card>
               </motion.div>

               {/* Tool 2: Required Documents */}
               <motion.div whileHover={{ y: -10 }} className="h-full">
                  <Card className="h-full rounded-[40px] border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                     <div className="p-10 bg-white text-primary space-y-6 flex-1 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                           <div className="bg-primary/5 w-20 h-20 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                              <FileText size={40} />
                           </div>
                           <h3 className="text-3xl font-black">{isRtl ? "الأوراق المطلوبة" : "Required Docs"}</h3>
                           <p className="text-muted-foreground leading-relaxed font-medium">
                              {isRtl ? "اعرف كافة المستندات المطلوبة حسب مهنتك واطبع القائمة مباشرة." : "Know all required documents according to your profession and print the list."}
                           </p>
                        </div>
                        <Link to="/tools/required-documents">
                           <Button className="w-full bg-primary text-white font-black py-7 rounded-2xl hover:bg-secondary hover:text-primary transition-all">
                              {isRtl ? "عرض القائمة" : "View List"}
                           </Button>
                        </Link>
                     </div>
                  </Card>
               </motion.div>

               {/* Tool 3: Professional Auth */}
               <motion.div whileHover={{ y: -10 }} className="h-full">
                  <Card className="h-full rounded-[40px] border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                     <div className="p-10 bg-secondary text-primary space-y-6 flex-1 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                           <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                              <ShieldCheck size={40} />
                           </div>
                           <h3 className="text-3xl font-black">{isRtl ? "الاعتماد المهني" : "Professional Auth"}</h3>
                           <p className="text-primary/70 leading-relaxed font-medium">
                              {isRtl ? "دليل شامل لإجراءات الاعتماد المهني السعودي للمهندسين والأطباء." : "Comprehensive guide for Saudi professional accreditation for engineers and doctors."}
                           </p>
                        </div>
                        <Link to="/tools/saudi-accreditation">
                           <Button className="w-full bg-primary text-white font-black py-7 rounded-2xl hover:bg-white hover:text-primary transition-all">
                              {isRtl ? "دليل الاعتماد" : "Accreditation Guide"}
                           </Button>
                        </Link>
                     </div>
                  </Card>
               </motion.div>
            </div>
         </div>
      </section>

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
