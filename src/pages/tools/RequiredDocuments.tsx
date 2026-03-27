import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Printer, Download, MapPin, Phone, CheckCircle2, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/db/api';
import { Profession, SiteConfig } from '@/types';
import { Link } from 'react-router-dom';

const RequiredDocuments: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProf, setSelectedProf] = useState<Profession | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: profs } = await db.getProfessions();
      const conf = await db.getSettings('site_config');
      setProfessions(profs || []);
      setConfig(conf.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredProfessions = professions.filter(p => 
    p.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-20 font-arabic" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-primary py-20 text-white relative overflow-hidden print:hidden">
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         </div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
               {isRtl ? "الأوراق المطلوبة حسب المهنة" : "Required Documents by Profession"}
            </motion.h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
               {isRtl 
                 ? "ابحث عن مهنتك لمعرفة كافة المستندات المطلوبة لتأشيرة العمل السعودية وطباعتها مباشرة." 
                 : "Search for your profession to know all required documents for Saudi work visa and print them directly."}
            </p>
         </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Search */}
            <div className="lg:col-span-1 space-y-6 print:hidden">
               <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden">
                  <CardHeader className="bg-muted/50 border-b">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Search size={20} className="text-secondary" />
                        <span>{isRtl ? "ابحث عن مهنتك" : "Search Profession"}</span>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <Input 
                        placeholder={isRtl ? "مثلاً: مهندس، فني، محاسب..." : "Ex: Engineer, Technician..."}
                        className="rounded-xl h-12"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                     />
                     <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                        {loading ? (
                          <div className="py-10 text-center text-muted-foreground">{isRtl ? "جاري التحميل..." : "Loading..."}</div>
                        ) : filteredProfessions.length > 0 ? (
                          filteredProfessions.map(prof => (
                            <button
                              key={prof.id}
                              onClick={() => setSelectedProf(prof)}
                              className={`w-full text-start p-4 rounded-2xl transition-all border-2 ${
                                selectedProf?.id === prof.id 
                                  ? 'border-secondary bg-secondary/5 font-black text-primary' 
                                  : 'border-transparent hover:bg-muted/50 text-muted-foreground'
                              }`}
                            >
                               <div className="flex justify-between items-center">
                                  <span>{isRtl ? prof.name_ar : prof.name_en}</span>
                                  <span className="text-xs opacity-50">{prof.code}</span>
                               </div>
                            </button>
                          ))
                        ) : (
                          <div className="py-10 text-center text-muted-foreground">{isRtl ? "لا توجد نتائج." : "No results found."}</div>
                        )}
                     </div>
                  </CardContent>
               </Card>

               <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-4">
                  {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                  <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
               </Link>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-2 space-y-6">
               <AnimatePresence mode="wait">
                  {selectedProf ? (
                    <motion.div
                      key={selectedProf.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                       <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden print:shadow-none print:border print:rounded-none">
                          <CardHeader className="bg-primary text-white p-8 md:p-12 print:bg-white print:text-black print:p-0 print:border-b-4 print:border-primary">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-4">
                                      <div className="bg-secondary p-3 rounded-2xl print:hidden">
                                         <FileText size={32} className="text-primary" />
                                      </div>
                                      <div>
                                         <h2 className="text-3xl font-black">{isRtl ? selectedProf.name_ar : selectedProf.name_en}</h2>
                                         <p className="text-white/70 font-bold">{isRtl ? "الأوراق المطلوبة لتأشيرة العمل" : "Required Documents for Work Visa"}</p>
                                      </div>
                                   </div>
                                </div>
                                <div className="print:hidden">
                                   <Button onClick={handlePrint} className="bg-secondary text-primary font-black px-8 py-6 rounded-2xl flex items-center gap-3">
                                      <Printer size={20} />
                                      <span>{isRtl ? "طباعة القائمة" : "Print List"}</span>
                                   </Button>
                                </div>
                                {/* Print Header */}
                                <div className="hidden print:block text-end space-y-1">
                                   <h3 className="text-2xl font-black text-primary">Saudiavisa</h3>
                                   <p className="text-sm font-bold">مكتب تأشيرات السعودية في الأردن</p>
                                   <p className="text-xs">{config?.contact_info.phone}</p>
                                   <p className="text-xs">{isRtl ? config?.contact_info.address_ar : config?.contact_info.address_en}</p>
                                </div>
                             </div>
                          </CardHeader>
                          <CardContent className="p-8 md:p-12 space-y-8 print:p-0 print:mt-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                   <h3 className="text-xl font-black text-primary border-b-2 border-secondary pb-2 flex items-center gap-2">
                                      <CheckCircle2 size={24} className="text-secondary" />
                                      <span>{isRtl ? "قائمة المستندات الأساسية" : "Essential Documents"}</span>
                                   </h3>
                                   <ul className="space-y-4">
                                      {(selectedProf.documents || []).map((doc, idx) => (
                                         <motion.li 
                                           key={idx}
                                           initial={{ opacity: 0, y: 10 }}
                                           animate={{ opacity: 1, y: 0 }}
                                           transition={{ delay: idx * 0.1 }}
                                           className="flex items-start gap-3 p-4 bg-muted/20 rounded-2xl border hover:border-secondary transition-colors"
                                         >
                                            <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0"></div>
                                            <span className="font-medium text-lg leading-relaxed">{doc}</span>
                                         </motion.li>
                                      ))}
                                      {(!selectedProf.documents || selectedProf.documents.length === 0) && (
                                         <li className="text-muted-foreground italic">{isRtl ? "لا توجد مستندات مسجلة لهذه المهنة حالياً." : "No documents registered for this profession."}</li>
                                      )}
                                   </ul>
                                </div>

                                <div className="space-y-6 print:mt-10">
                                   <div className="bg-primary/5 p-8 rounded-[32px] border-2 border-dashed border-primary/20 space-y-6">
                                      <h3 className="text-xl font-black text-primary flex items-center gap-2">
                                         <Globe size={24} className="text-secondary" />
                                         <span>{isRtl ? "تعليمات هامة" : "Important Instructions"}</span>
                                      </h3>
                                      <div className="space-y-4 text-muted-foreground leading-relaxed">
                                         <p>{isRtl 
                                           ? "• يجب أن تكون جميع الصور الشخصية حديثة وبخلفية بيضاء." 
                                           : "• All personal photos must be recent with a white background."}</p>
                                         <p>{isRtl 
                                           ? "• التأكد من صلاحية الجواز لمدة لا تقل عن 6 أشهر." 
                                           : "• Ensure passport validity for at least 6 months."}</p>
                                         <p>{isRtl 
                                           ? "• تصديق الشهادات يجب أن يكون من الملحقية الثقافية السعودية والسفارة." 
                                           : "• Certification must be from Saudi Cultural Attaché and Embassy."}</p>
                                      </div>
                                      <div className="pt-4 border-t border-dashed border-primary/20">
                                         <div className="flex items-center gap-3 text-primary font-black">
                                            <Phone size={20} className="text-secondary" />
                                            <span>{config?.contact_info.phone}</span>
                                         </div>
                                         <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                            <MapPin size={16} className="text-secondary" />
                                            <span>{isRtl ? config?.contact_info.address_ar : config?.contact_info.address_en}</span>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>

                             {/* Print Footer */}
                             <div className="hidden print:flex justify-between items-center mt-20 pt-8 border-t-2 border-muted text-xs text-muted-foreground">
                                <div>طُبع من موقع Saudiavisa.com</div>
                                <div>الشركة المتخصصة للتوظيف - ترخيص رقم 22128</div>
                                <div>{new Date().toLocaleDateString('ar-JO')}</div>
                             </div>
                          </CardContent>
                       </Card>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-6 bg-muted/10 rounded-[40px] border-2 border-dashed border-muted">
                       <div className="bg-muted p-6 rounded-full">
                          <Search size={64} className="text-muted-foreground/30" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black text-primary">{isRtl ? "اختر مهنة للبدء" : "Select Profession to Start"}</h3>
                          <p className="text-muted-foreground">{isRtl ? "استخدم قائمة البحث الجانبية لاختيار المهنة وعرض الأوراق المطلوبة." : "Use the sidebar search to select a profession and view required documents."}</p>
                       </div>
                    </div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RequiredDocuments;
