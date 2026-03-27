import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        <div className="flex items-center justify-center text-destructive">
          <AlertTriangle size={100} strokeWidth={1.5} />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground">
            {isRtl ? "الصفحة غير موجودة" : "Page Not Found"}
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
            {isRtl 
              ? "نعتذر، الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو لم تكن موجودة أبداً."
              : "Sorry, the page you are looking for has been moved, deleted or never existed."
            }
          </p>
        </div>
        <Link to="/">
          <Button size="lg" className="px-8 py-6 text-lg font-bold space-x-3 rtl:space-x-reverse" asChild>
            <span>
              <Home size={24} />
              <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
            </span>
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
