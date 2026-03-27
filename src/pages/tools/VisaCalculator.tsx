import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Info, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/db/api';
import { Nationality } from '@/types';
import { Link } from 'react-router-dom';

const VisaCalculator: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [selectedNationality, setSelectedNationality] = useState<string>('');
  const [selectedVisaType, setSelectedVisaType] = useState<string>('');
  const [result, setResult] = useState<{ min: number; max: number; note_ar: string; note_en: string; isApprox: boolean } | null>(null);

  useEffect(() => {
    db.getNationalities().then(({ data }) => setNationalities(data || []));
  }, []);

  const visaTypes = [
    { id: 'work', name_ar: 'تأشيرة عمل', name_en: 'Work Visa' },
    { id: 'tourist', name_ar: 'تأشيرة سياحية', name_en: 'Tourist Visa' },
    { id: 'family', name_ar: 'زيارة عائلية', name_en: 'Family Visit' },
    { id: 'personal', name_ar: 'زيارة شخصية', name_en: 'Personal Visit' },
    { id: 'business', name_ar: 'زيارة تجارية', name_en: 'Business Visit' },
    { id: 'gov', name_ar: 'زيارة حكومية', name_en: 'Government Visit' },
    { id: 'residence', name_ar: 'إقامة (استقدام)', name_en: 'Residence/Recruitment' },
    { id: 'business_trip', name_ar: 'أعمال', name_en: 'Business Trip' },
    { id: 'transit', name_ar: 'مرور', name_en: 'Transit' },
    { id: 'umrah', name_ar: 'عمرة', name_en: 'Umrah' },
  ];

  const calculate = () => {
    if (!selectedNationality || !selectedVisaType) return;

    const isJordanian = nationalities.find(n => n.id === selectedNationality)?.name_en === 'Jordan';
    let min = 0;
    let max = 0;
    let note_ar = '';
    let note_en = '';
    let isApprox = true;

    if (selectedVisaType === 'work') {
      min = 150;
      max = 450;
      note_ar = 'المتطلبات الأساسية: عقد عمل مصدق، تأشيرة صادرة من الشركة السعودية، تفويض إلكتروني للمكتب. التكلفة تختلف حسب مسمى التأشيرة والخدمات الإضافية.';
      note_en = 'Basic Requirements: Certified work contract, visa issued by a Saudi company, electronic authorization for the office. Cost varies by visa title and extra services.';
    } else if (selectedVisaType === 'umrah') {
      if (isJordanian) {
        min = 140;
        max = 190;
        note_ar = 'التكلفة تشمل التأمين والرسوم الأساسية. قد تختلف قليلاً.';
        note_en = 'Cost includes insurance and basic fees. May vary slightly.';
      } else {
        min = 210;
        max = 270;
        note_ar = 'يجب أن يكون مقيماً في الأردن. التكلفة غير دقيقة وتعتمد على التوفر والكوتا.';
        note_en = 'Must be resident in Jordan. Cost is not accurate and depends on availability and quota.';
      }
    } else {
      // All other visits
      const baseMin = 120;
      const baseMax = 140;
      const extra = isJordanian ? 0 : 10; // User said +20 but gave 130-150 range, which is +10
      min = baseMin + extra;
      max = baseMax + extra;
      note_ar = 'تشمل التأشيرات السياحية، العائلية، الشخصية، التجارية، الحكومية، الاستقدام، والأعمال. قد تختلف التكلفة حسب التأمين.';
      note_en = 'Includes Tourist, Family, Personal, Business, Gov, Recruitment, and Business visas. Cost may vary by insurance.';
    }

    setResult({ min, max, note_ar, note_en, isApprox });
  };

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mt-48 blur-3xl animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            {isRtl ? 'حاسبة تكلفة التأشيرات الذكية' : 'Smart Visa Cost Calculator'}
          </motion.h1>
          <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {isRtl ? 'احصل على تقدير فوري ودقيق لتكلفة تأشيرتك بناءً على جنسيتك ونوع الطلب بالدينار الأردني.' : 'Get an instant and accurate estimate of your visa cost based on your nationality and application type in JOD.'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl -mt-16 relative z-20">
        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-lg font-bold text-primary flex items-center gap-2">
                    <Globe className="text-secondary" size={20} />
                    {isRtl ? 'اختر الجنسية' : 'Select Nationality'}
                  </label>
                  <Select onValueChange={setSelectedNationality}>
                    <SelectTrigger className="h-14 rounded-2xl border-2 bg-muted/30 focus:ring-secondary">
                      <SelectValue placeholder={isRtl ? "ابحث عن جنسيتك..." : "Search nationality..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map(nat => (
                        <SelectItem key={nat.id} value={nat.id!}>
                          {isRtl ? nat.name_ar : nat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-lg font-bold text-primary flex items-center gap-2">
                    <Calculator className="text-secondary" size={20} />
                    {isRtl ? 'نوع التأشيرة' : 'Visa Type'}
                  </label>
                  <Select onValueChange={setSelectedVisaType}>
                    <SelectTrigger className="h-14 rounded-2xl border-2 bg-muted/30 focus:ring-secondary">
                      <SelectValue placeholder={isRtl ? "اختر نوع التأشيرة" : "Select visa type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {visaTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {isRtl ? type.name_ar : type.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
             </div>

             <Button 
                onClick={calculate}
                disabled={!selectedNationality || !selectedVisaType}
                className="w-full h-16 rounded-2xl text-xl font-black bg-secondary text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02]"
             >
                {isRtl ? 'احسب التكلفة التقديرية' : 'Calculate Estimated Cost'}
             </Button>

             <AnimatePresence>
               {result && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                 >
                    <div className="bg-primary/5 rounded-[32px] p-8 border-2 border-secondary/20 relative">
                       <div className="flex flex-col items-center text-center space-y-4">
                          <span className="text-muted-foreground font-bold">{isRtl ? 'التكلفة التقريبية بالدينار الأردني' : 'Estimated Cost in JOD'}</span>
                          <div className="flex items-baseline gap-2">
                             <span className="text-5xl md:text-6xl font-black text-primary">{result.min} - {result.max}</span>
                             <span className="text-xl font-bold text-secondary">{isRtl ? 'د.أ' : 'JOD'}</span>
                          </div>
                          
                          <div className="flex items-start gap-4 mt-6 bg-white p-6 rounded-2xl shadow-sm border text-right">
                             <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                                <Info className="text-secondary" size={24} />
                             </div>
                             <div className="space-y-2">
                                <h4 className="font-black text-primary">{isRtl ? 'ملاحظات هامة:' : 'Important Notes:'}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                   {isRtl ? result.note_ar : result.note_en}
                                </p>
                             </div>
                          </div>

                          <div className="mt-6 flex items-center gap-2 text-amber-600 font-bold bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                             <AlertCircle size={18} />
                             <span>{isRtl ? 'هذه الأرقام تقريبية وتخضع للتغيير حسب تعليمات السفارة.' : 'These numbers are approximate and subject to change per Embassy instructions.'}</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </CardContent>
        </Card>

        <div className="mt-12 flex flex-col md:flex-row gap-6">
           <Link to="/tools/required-documents" className="flex-1">
             <Button variant="outline" className="w-full h-20 rounded-2xl border-2 hover:bg-muted group">
                <div className="flex items-center gap-4 text-right">
                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText size={24} />
                   </div>
                   <div>
                      <div className="font-black text-primary">{isRtl ? 'الأوراق المطلوبة' : 'Required Documents'}</div>
                      <div className="text-sm text-muted-foreground">{isRtl ? 'تحقق من قائمة المستندات' : 'Check document list'}</div>
                   </div>
                </div>
             </Button>
           </Link>
           <Link to="/contact" className="flex-1">
             <Button variant="outline" className="w-full h-20 rounded-2xl border-2 hover:bg-muted group">
                <div className="flex items-center gap-4 text-right">
                   <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                      <Phone size={24} />
                   </div>
                   <div>
                      <div className="font-black text-primary">{isRtl ? 'احجز موعدك' : 'Book Appointment'}</div>
                      <div className="text-sm text-muted-foreground">{isRtl ? 'تواصل معنا لتأكيد الموعد' : 'Contact us to confirm'}</div>
                   </div>
                </div>
             </Button>
           </Link>
        </div>
      </div>
    </div>
  );
};

// Internal icon import since it was missing in common list
const Globe = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const FileText = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const Phone = ({ size, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

export default VisaCalculator;
