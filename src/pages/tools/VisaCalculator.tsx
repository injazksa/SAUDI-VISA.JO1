import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VisaCalculator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [visaType, setVisaType] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [result, setResult] = useState<{ fee: string; docs: string[] } | null>(null);

  const calculate = () => {
    // Mock calculation logic
    if (visaType === 'tourist') {
      setResult({
        fee: '440 SAR (~83 JOD)',
        docs: [
          isRtl ? 'جواز سفر ساري المفعول' : 'Valid Passport',
          isRtl ? 'صورة شخصية حديثة' : 'Recent Personal Photo',
          isRtl ? 'تأمين طبي' : 'Medical Insurance'
        ]
      });
    } else if (visaType === 'business') {
      setResult({
        fee: '600 SAR (~113 JOD)',
        docs: [
          isRtl ? 'دعوة من شركة سعودية' : 'Invitation from Saudi Company',
          isRtl ? 'خطاب تعريف بالراتب' : 'Salary Certificate',
          isRtl ? 'سجل تجاري للشركة الأردنية' : 'Jordanian Company Trade License'
        ]
      });
    }
  };

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-20 text-white text-center">
         <h1 className="text-4xl font-bold mb-4">{isRtl ? 'حاسبة التأشيرات التقديرية' : 'Visa Fee Calculator'}</h1>
         <div className="h-1 w-20 bg-secondary mx-auto"></div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-none shadow-2xl overflow-hidden">
          <CardHeader className="bg-muted/50 p-8 border-b">
            <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse text-primary">
              <Calculator size={28} className="text-secondary" />
              <span>{isRtl ? 'احسب تكلفة التأشيرة والأوراق المطلوبة' : 'Calculate Visa Cost & Required Papers'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">{isRtl ? 'نوع التأشيرة' : 'Visa Type'}</label>
                <Select onValueChange={setVisaType}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRtl ? 'اختر النوع' : 'Select Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourist">{isRtl ? 'سياحية' : 'Tourist'}</SelectItem>
                    <SelectItem value="business">{isRtl ? 'تجارية' : 'Business'}</SelectItem>
                    <SelectItem value="family">{isRtl ? 'زيارة عائلية' : 'Family Visit'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">{isRtl ? 'الجنسية' : 'Nationality'}</label>
                <Select onValueChange={setNationality}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRtl ? 'اختر الجنسية' : 'Select Nationality'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jordanian">{isRtl ? 'أردني' : 'Jordanian'}</SelectItem>
                    <SelectItem value="other">{isRtl ? 'أخرى' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={calculate} className="w-full py-6 text-lg font-bold" disabled={!visaType || !nationality}>
              {isRtl ? 'احسب الآن' : 'Calculate Now'}
            </Button>

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t space-y-6">
                <div className="bg-primary/5 p-6 rounded-2xl flex items-center justify-between border border-primary/10">
                   <span className="text-lg font-bold">{isRtl ? 'الرسوم التقديرية:' : 'Estimated Fees:'}</span>
                   <span className="text-2xl font-black text-primary">{result.fee}</span>
                </div>
                
                <div className="space-y-4">
                   <h3 className="font-bold flex items-center space-x-2 rtl:space-x-reverse text-primary">
                     <CheckCircle2 size={20} className="text-secondary" />
                     <span>{isRtl ? 'الأوراق والمستندات المطلوبة:' : 'Required Documents:'}</span>
                   </h3>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {result.docs.map((doc, i) => (
                       <li key={i} className="p-3 bg-white border rounded-xl text-sm flex items-center space-x-2 rtl:space-x-reverse">
                         <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                         <span>{doc}</span>
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start space-x-3 rtl:space-x-reverse">
                   <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
                   <p className="text-xs text-amber-800 leading-relaxed">
                     {isRtl 
                       ? "ملاحظة: هذه الرسوم تقديرية وقد تختلف حسب سعر الصرف أو تحديثات الأنظمة السعودية الرسمية. يرجى التواصل معنا للتأكيد."
                       : "Note: These fees are estimated and may vary based on exchange rates or official Saudi regulation updates. Please contact us for confirmation."
                     }
                   </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisaCalculator;
