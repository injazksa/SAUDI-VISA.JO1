import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "about": "من نحن",
        "services": "الخدمات",
        "blog": "المدونة",
        "news": "الأخبار",
        "contact": "تواصل معنا",
        "fingerprint": "حجز بصمة",
        "admin": "لوحة التحكم"
      },
      "common": {
        "readMore": "اقرأ المزيد",
        "contactUs": "تواصل معنا",
        "requirements": "المتطلبات",
        "fees": "الرسوم",
        "latestNews": "آخر الأخبار",
        "latestBlog": "آخر المقالات",
        "viewAll": "عرض الكل",
        "whatsapp": "تواصل عبر واتساب",
        "backToTop": "العودة للأعلى",
        "loading": "جاري التحميل...",
        "error": "حدث خطأ ما",
        "send": "إرسال",
        "name": "الاسم",
        "email": "البريد الإلكتروني",
        "message": "الرسالة",
        "success": "تم بنجاح",
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج",
        "username": "اسم المستخدم",
        "password": "كلمة المرور",
        "adminPanel": "لوحة الإدارة"
      },
      "home": {
        "heroTitle": "بوابتك للحصول على التأشيرة السعودية من الأردن",
        "heroSubtitle": "نقدم خدمات احترافية ومتكاملة لتسهيل إجراءات حصولكم على جميع أنواع التأشيرات للمملكة العربية السعودية.",
        "featuredServices": "خدماتنا المميزة",
        "contactSection": "تواصل سريع"
      },
      "contact": {
        "info": "معلومات التواصل",
        "address": "العنوان",
        "phone": "الهاتف / واتساب",
        "emails": "البريد الإلكتروني",
        "support": "الدعم الفني",
        "infoMail": "معلومات عامة",
        "location": "موقعنا على الخريطة"
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "services": "Services",
        "blog": "Blog",
        "news": "News",
        "contact": "Contact Us",
        "fingerprint": "Fingerprint Booking",
        "admin": "Admin"
      },
      "common": {
        "readMore": "Read More",
        "contactUs": "Contact Us",
        "requirements": "Requirements",
        "fees": "Fees",
        "latestNews": "Latest News",
        "latestBlog": "Latest Blog",
        "viewAll": "View All",
        "whatsapp": "WhatsApp Chat",
        "backToTop": "Back to Top",
        "loading": "Loading...",
        "error": "Something went wrong",
        "send": "Send",
        "name": "Name",
        "email": "Email",
        "message": "Message",
        "success": "Success",
        "login": "Login",
        "logout": "Logout",
        "username": "Username",
        "password": "Password",
        "adminPanel": "Admin Panel"
      },
      "home": {
        "heroTitle": "Your Gateway to Saudi Visas from Jordan",
        "heroSubtitle": "We provide professional and integrated services to facilitate your procedures for obtaining all types of visas for the Kingdom of Saudi Arabia.",
        "featuredServices": "Featured Services",
        "contactSection": "Quick Contact"
      },
      "contact": {
        "info": "Contact Information",
        "address": "Address",
        "phone": "Phone / WhatsApp",
        "emails": "Email Addresses",
        "support": "Support",
        "infoMail": "General Information",
        "location": "Our Location"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
