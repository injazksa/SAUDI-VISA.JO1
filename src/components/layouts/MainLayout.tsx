import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Phone, Mail, MapPin, Globe, ChevronUp, MessageCircle, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { cn } from '@/lib/utils';

const NewsTicker = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-primary text-white overflow-hidden whitespace-nowrap py-2 text-sm font-medium">
      <div className="news-ticker">
        {items.map((item, index) => (
          <span key={index} className="mx-8">
            • {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const WhatsAppButton = ({ phone, isRtl }: { phone: string; isRtl: boolean }) => {
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center",
        isRtl ? "left-6" : "right-6"
      )}
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
};

const ScrollToTop = ({ isRtl }: { isRtl: boolean }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true);
      } else if (scrolled <= 300) {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "fixed bottom-24 z-50 rounded-full shadow-lg transition-opacity duration-300",
        isRtl ? "left-6" : "right-6",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={scrollToTop}
    >
      <ChevronUp size={24} />
    </Button>
  );
};

const MainLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    db.getSettings('site_config').then(({ data }) => setConfig(data));
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const contactInfo = config?.contact_info;
  const newsTickerItems = i18n.language === 'ar' ? config?.news_ticker_ar : config?.news_ticker_en;

  const whatsappNumber = contactInfo?.whatsapp?.replace(/\s/g, '') || "962789881009";

  return (
    <div className="flex flex-col min-h-screen">
      {/* News Ticker */}
      <NewsTicker items={newsTickerItems || []} />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            {config?.logo_image ? (
              <img src={config.logo_image} alt="Saudiavisa Logo" className="h-10 md:h-12 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                 <div className="bg-primary p-2 rounded-xl">
                    <Globe className="text-secondary" size={24} />
                 </div>
                 <span className="text-2xl font-black text-primary tracking-tight">
                    {config?.logo_url || "Saudiavisa"}
                 </span>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe size={18} />
              <span>{i18n.language === 'ar' ? 'English' : 'عربي'}</span>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
             <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side={i18n.language === 'ar' ? 'right' : 'left'}>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-lg font-medium",
                        location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start rtl:md:text-start">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">{config?.logo_url || "⚡ Saudiavisa"}</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
              {i18n.language === 'ar' ? config?.hero_ar.subtitle : config?.hero_en.subtitle}
            </p>
            <div className="text-xs text-muted-foreground pt-2">
               <p>{i18n.language === 'ar' ? "الشركة المتخصصة للتوظيف" : "Specialized Recruitment Company"}</p>
               <p>{i18n.language === 'ar' ? "ترخيص رقم 22128" : "License No. 22128"}</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{t('contact.info')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                <Phone size={16} />
                <span>{contactInfo?.phone}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                <Mail size={16} />
                <span>{contactInfo?.email_visa}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse">
                <MapPin size={16} />
                <span>{i18n.language === 'ar' ? contactInfo?.address_ar : contactInfo?.address_en}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">{i18n.language === 'ar' ? 'روابط هامة' : 'Important Links'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/legal/terms-of-use">{i18n.language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</Link></li>
              <li><Link to="/legal/privacy-policy">{i18n.language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              <li><Link to="/legal/disclaimer">{i18n.language === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2026 Saudiavisa. {i18n.language === 'ar' ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </footer>

      {/* Floating Buttons */}
      <WhatsAppButton phone={whatsappNumber} isRtl={i18n.language === 'ar'} />
      <ScrollToTop isRtl={i18n.language === 'ar'} />
    </div>
  );
};

export default MainLayout;
