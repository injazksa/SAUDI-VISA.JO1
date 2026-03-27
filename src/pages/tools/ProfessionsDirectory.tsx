import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, UserCheck, ArrowLeft, ArrowRight, Hash } from 'lucide-react';
import { db } from '@/db/api';
import { Profession } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';

const ProfessionsDirectory: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessions = async () => {
      const { data } = await db.getProfessions();
      setProfessions(data || []);
      setLoading(false);
    };
    fetchProfessions();
  }, []);

  const filtered = professions.filter(p => 
    p.name_ar.includes(searchTerm) || 
    p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  return (
    <div className="pb-20 space-y-12">
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <h1 className="text-4xl font-bold mb-4 relative z-10">{isRtl ? 'دليل المهن والرموز المعتمدة' : 'Directory of Professions & Codes'}</h1>
         <div className="h-1 w-20 bg-secondary mx-auto relative z-10"></div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/">
           <Button variant="ghost" className="mb-8 flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground hover:text-primary" asChild>
             <span>
               {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
               <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
             </span>
           </Button>
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-[40px] border shadow-xl space-y-8">
           <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                className="pl-12 h-14 rounded-2xl border-2 focus:border-secondary transition-all"
                placeholder={isRtl ? 'ابحث عن مهنة أو رمز...' : 'Search for profession or code...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="overflow-hidden rounded-2xl border">
              <Table>
                <TableHeader className="bg-primary text-white">
                  <TableRow>
                    <TableHead className="text-right font-bold py-6 px-8">{isRtl ? 'المهنة' : 'Profession'}</TableHead>
                    <TableHead className="text-right font-bold py-6 px-8">{isRtl ? 'الرمز' : 'Code'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-20">جاري التحميل...</TableCell></TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-20 text-muted-foreground">لا توجد نتائج مطابقة</TableCell></TableRow>
                  ) : (
                    filtered.map((prof) => (
                      <TableRow key={prof.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-bold text-primary py-6 px-8">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                             <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                                <UserCheck size={16} />
                             </div>
                             <span>{isRtl ? prof.name_ar : prof.name_en}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                           <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-muted px-4 py-2 rounded-xl text-primary font-mono font-bold">
                              <Hash size={14} className="text-secondary" />
                              <span>{prof.code}</span>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
           </div>
        </div>

        <div className="mt-12 p-8 bg-amber-50 rounded-[30px] border border-amber-200 flex items-start space-x-4 rtl:space-x-reverse">
           <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <Search size={24} />
           </div>
           <div>
              <h4 className="text-lg font-bold text-amber-800 mb-2">{isRtl ? 'تنويه هام' : 'Important Note'}</h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                 {isRtl 
                   ? "هذا الدليل للاسترشاد فقط، المهن المتاحة ورموزها قد تتغير حسب تحديثات وزارة الموارد البشرية السعودية والتصنيف المهني الموحد. يرجى التواصل معنا للتأكد من مسمى مهنتك الصحيح قبل البدء بالإجراءات."
                   : "This directory is for guidance only; available professions and their codes may change according to Saudi Ministry of Human Resources updates and the unified professional classification. Please contact us to confirm your correct profession name before starting procedures."
                 }
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionsDirectory;
