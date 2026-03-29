import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, ShieldCheck, Globe, Clock, Star, 
  HelpCircle, CheckCircle2, Phone, ExternalLink, Calculator, UserCheck, FileText,
  ChevronLeft, ChevronRight, Zap, Award, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { db, getFaqs, getTestimonials } from '@/db/api';
import { Service, NewsItem, BlogPost, SiteConfig, FAQ, Testimonial } from '@/types';
import ScrollReveal from '@/components/common/ScrollReveal';

const HomeOptimized: React.FC = () => {
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

  // Container animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* HERO SECTION - Premium Slider */}
      <section className="relative h-[95vh] md:h-[90vh] flex items-center bg-primary overflow-hidden">
        <AnimatePresence mode="wait">
          {config?.home_sliders && config.home_sliders.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110 will-change-transform"
                style={{ backgroundImage: `url(${config.home_sliders[currentSlide].image_url})` }}
              ></div>
              <div className="absolute inset-0 gradient-overlay-primary"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary rounded-full -mr-96 -mt-96 blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/30 rounded-full -ml-48 -mb-48 blur-3xl"
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            {/* Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-secondary/20 text-secondary border border-secondary/30 px-5 py-2.5 rounded-full text-sm font-bold backdrop-blur-md"
            >
              <ShieldCheck size={18} />
              <span>{isRtl ? "مكتب معتمد للسفارة السعودية" : "Certified Saudi Embassy Office"}</span>
            </motion.div>
            
            {/* Main Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-8xl font-black text-white leading-tight drop-shadow-2xl">
                  {isRtl 
                    ? (config?.home_sliders?.[currentSlide]?.title_ar || 'مكتب تأشيرات السعودية')
                    : (config?.home_sliders?.[currentSlide]?.title_en || 'Saudi Visa Office')}
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
                  {isRtl 
                    ? (config?.home_sliders?.[currentSlide]?.subtitle_ar || '')
                    : (config?.home_sliders?.[currentSlide]?.subtitle_en || '')}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 rtl:sm:space-x-reverse pt-4"
            >
              <Link to="/services">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="w-full sm:w-auto text-xl px-10 bg-secondary hover:bg-white text-primary font-black border-none py-8 rounded-2xl shadow-2xl shadow-secondary/20 transition-all">
                    <span>{isRtl ? "استكشف الخدمات" : "Explore Services"}</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/tools/visa-calculator">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-xl px-10 border-secondary/50 text-secondary hover:bg-secondary hover:text-primary py-8 rounded-2xl backdrop-blur-md font-black shadow-2xl transition-all">
                    <Calculator className="mr-3 rtl:ml-3" size={24} />
                    {isRtl ? "حاسبة الرسوم" : "Fee Calculator"}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-4 lg:right-10 flex items-center space-x-4 rtl:space-x-reverse z-30">
          <motion.button 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-primary backdrop-blur-md border border-white/20 transition-all flex items-center justify-center"
          >
            {isRtl ? <ChevronRight size={32} /> : <ChevronLeft size={32} />}
          </motion.button>
          <motion.button 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-secondary text-white hover:text-primary backdrop-blur-md border border-white/20 transition-all flex items-center justify-center"
          >
            {isRtl ? <ChevronLeft size={32} /> : <ChevronRight size={32} />}
          </motion.button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-3 rtl:space-x-reverse z-30">
          {config?.home_sliders?.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              animate={{
                width: currentSlide === idx ? 32 : 8,
                backgroundColor: currentSlide === idx ? '#D4AF37' : 'rgba(255, 255, 255, 0.3)',
              }}
              className="h-2 rounded-full transition-all duration-500"
            ></motion.button>
          ))}
        </div>
      </section>

      {/* TRUST BADGES - Animated on Scroll */}
      <ScrollReveal direction="up" duration={0.7}>
        <div className="container mx-auto px-4 -mt-16 md:-mt-12 relative z-20">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {(config?.trust_badges || [
              { icon: 'Zap', label_ar: "سرعة الإنجاز", label_en: "Fast Processing" },
              { icon: 'ShieldCheck', label_ar: "موثوقية تامة", label_en: "Full Reliability" },
              { icon: 'Award', label_ar: "مركز معتمد", label_en: "Certified Center" },
              { icon: 'Users', label_ar: "تغطية شاملة", label_en: "Full Coverage" }
            ]).map((badge, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(212, 175, 55, 0.2)' }}
                className="bg-white p-8 rounded-[32px] shadow-premium flex flex-col items-center text-center space-y-4 border-b-4 border-secondary group transition-all duration-300"
              >
                <div className="text-secondary group-hover:scale-110 transition-transform duration-300">
                  {badge.icon === 'Zap' && <Zap size={40} />}
                  {badge.icon === 'ShieldCheck' && <ShieldCheck size={40} />}
                  {badge.icon === 'Award' && <Award size={40} />}
                  {badge.icon === 'Users' && <Users size={40} />}
                </div>
                <span className="font-black text-primary text-lg">{isRtl ? badge.label_ar : badge.label_en}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>

      {/* TOOLS SECTION */}
      <section className="bg-gradient-to-br from-muted/30 to-accent/20 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-black text-primary leading-tight"
              >
                {isRtl ? "أدوات ذكية وسريعة" : "Smart & Fast Tools"}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                {isRtl 
                  ? "احسب التكاليف، اعرف الأوراق المطلوبة، وتعرف على الاعتماد المهني بسهولة." 
                  : "Calculate costs, know required documents, and learn about professional accreditation easily."}
              </motion.p>
            </div>
          </ScrollReveal>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Tool Cards */}
            {[
              {
                icon: Calculator,
                title_ar: "حاسبة الرسوم",
                title_en: "Visa Calculator",
                desc_ar: "احسب التكلفة التقريبية بناءً على الجنسية ونوع التأشيرة.",
                desc_en: "Calculate approximate cost by nationality and visa type.",
                link: "/tools/visa-calculator",
                bg: "bg-primary",
                textColor: "text-white",
                btnColor: "bg-secondary"
              },
              {
                icon: FileText,
                title_ar: "الأوراق المطلوبة",
                title_en: "Required Docs",
                desc_ar: "اعرف كل المستندات المطلوبة حسب مهنتك.",
                desc_en: "Know all documents needed for your profession.",
                link: "/tools/required-documents",
                bg: "bg-white",
                textColor: "text-primary",
                btnColor: "bg-primary"
              },
              {
                icon: ShieldCheck,
                title_ar: "الاعتماد المهني",
                title_en: "Professional Auth",
                desc_ar: "دليل شامل للاعتماد المهني السعودي.",
                desc_en: "Complete guide for Saudi professional accreditation.",
                link: "/tools/saudi-accreditation",
                bg: "bg-secondary",
                textColor: "text-primary",
                btnColor: "bg-primary"
              }
            ].map((tool, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link to={tool.link}>
                  <motion.div
                    whileHover={{ y: -12 }}
                    className="h-full cursor-pointer"
                  >
                    <Card className={`h-full rounded-[40px] border-none shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden group ${tool.bg}`}>
                      <CardContent className={`p-10 space-y-6 flex flex-col justify-between h-full ${tool.textColor}`}>
                        <div className="space-y-4">
                          <motion.div 
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            className={`w-20 h-20 rounded-3xl flex items-center justify-center ${tool.bg === 'bg-white' ? 'bg-primary/10' : 'bg-white/20'} transition-all duration-300`}
                          >
                            <tool.icon size={40} />
                          </motion.div>
                          <h3 className="text-3xl font-black">{isRtl ? tool.title_ar : tool.title_en}</h3>
                          <p className={`leading-relaxed font-medium ${tool.textColor === 'text-white' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {isRtl ? tool.desc_ar : tool.desc_en}
                          </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className={`w-full ${tool.btnColor} ${tool.textColor === 'text-white' ? 'text-primary' : 'text-white'} font-black py-7 rounded-2xl hover:scale-105 transition-all`}>
                            {isRtl ? "ابدأ الآن" : "Get Started"}
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeOptimized;
