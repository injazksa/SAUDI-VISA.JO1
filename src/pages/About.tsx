import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Eye, Users } from 'lucide-react';

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getSettings('site_config').then(({ data }) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const isRtl = i18n.language === 'ar';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const values = [
    {
      icon: Target,
      title: isRtl ? "رسالتنا" : "Our Mission",
      description: isRtl 
        ? "تقديم خدمات تأشيرات موثوقة وسريعة للمواطنين والمقيمين في الأردن الراغبين في زيارة المملكة العربية السعودية."
        : "Providing reliable and fast visa services for citizens and residents in Jordan wishing to visit the Kingdom of Saudi Arabia."
    },
    {
      icon: Eye,
      title: isRtl ? "رؤيتنا" : "Our Vision",
      description: isRtl 
        ? "أن نكون المكتب الرائد والأكثر ثقة في خدمات التأشيرات السعودية في الأردن من خلال التميز والاحترافية."
        : "To be the leading and most trusted office in Saudi visa services in Jordan through excellence and professionalism."
    },
    {
      icon: Users,
      title: isRtl ? "فريقنا" : "Our Team",
      description: isRtl 
        ? "نضم نخبة من المستشارين والخبراء المتخصصين في القوانين والإجراءات السعودية لضمان أفضل تجربة لعملائنا."
        : "We include a select group of consultants and experts specialized in Saudi laws and procedures to ensure the best experience for our clients."
    }
  ];

  return (
    <div className="pb-20 space-y-20">
      {/* Page Header */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_bccfdee9-a894-44fa-a38a-d2f25d943e12.jpg" alt="About" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('nav.about')}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-primary">
              {isRtl ? "من نحن في Saudiavisa" : "Who We Are at Saudiavisa"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRtl 
                ? "مكتب Saudiavisa هو شريككم المعتمد والموثوق في الأردن لجميع خدمات التأشيرات السعودية. نحن نسعى جاهدين لتقديم حلول متكاملة تغطي كافة أنواع التأشيرات، بدءاً من السياحية والعمرة وصولاً إلى تأشيرات العمل والزيارات التجارية."
                : "Saudiavisa is your approved and trusted partner in Jordan for all Saudi visa services. We strive to provide integrated solutions covering all types of visas, from tourism and Umrah to work visas and business visits."
              }
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRtl 
                ? "خبرتنا الطويلة في هذا المجال تتيح لنا تقديم الاستشارات الدقيقة ومتابعة الطلبات باحترافية عالية، مما يوفر الوقت والجهد على عملائنا ويضمن لهم أفضل النتائج."
                : "Our long experience in this field allows us to provide accurate consultations and follow up on requests with high professionalism, saving our clients time and effort and ensuring them the best results."
              }
            </p>
            <ul className="space-y-3">
              {[
                isRtl ? "دقة في معالجة البيانات" : "Accuracy in data processing",
                isRtl ? "سرعة في الإنجاز" : "Speed in achievement",
                isRtl ? "متابعة مستمرة للطلب" : "Continuous follow-up of the request",
                isRtl ? "شفافية مطلقة في الرسوم" : "Absolute transparency in fees"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 rtl:space-x-reverse text-foreground font-medium">
                  <CheckCircle2 className="text-primary" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]"
          >
            <img 
              src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_6d6280b6-7e55-4984-8b26-0c993b67db30.jpg" 
              alt="Office" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-2xl shadow-sm text-center space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section className="container mx-auto px-4 text-center space-y-8">
        <h2 className="text-3xl font-bold text-primary">{isRtl ? "تفضل بزيارتنا" : "Visit Us"}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isRtl 
            ? "نحن نرحب بكم دائماً في مكتبنا للإجابة على جميع استفساراتكم ومساعدتكم في اختيار نوع التأشيرة المناسب لاحتياجاتكم."
            : "We always welcome you to our office to answer all your inquiries and help you choose the right type of visa for your needs."
          }
        </p>
        <div className="inline-block p-6 bg-primary text-white rounded-2xl shadow-xl">
           <p className="text-xl font-bold mb-2">{isRtl ? config?.contact_info.address_ar : config?.contact_info.address_en}</p>
           <p className="text-lg opacity-90">{config?.contact_info.phone}</p>
        </div>
      </section>
    </div>
  );
};

export default About;
