import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { ContactSubmission } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Calendar, User, MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminContact: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await db.getContactSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const filtered = submissions.filter(s => 
    s.name.includes(searchTerm) || 
    s.email.includes(searchTerm) || 
    s.message.includes(searchTerm)
  );

  return (
    <div className="space-y-10 font-arabic pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center gap-4">
            <Mail size={40} className="text-secondary" />
            <span>رسائل التواصل</span>
          </h1>
          <p className="text-muted-foreground mt-2">عرض وإدارة الرسائل الواردة من زوار الموقع</p>
        </div>
        <div className="relative max-w-md w-full">
           <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
           <Input 
             className="pr-12 h-14 rounded-2xl border-2 focus:border-secondary transition-all"
             placeholder="بحث في الرسائل..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-black py-6 px-8">التاريخ</TableHead>
              <TableHead className="text-right font-black py-6 px-8">الاسم</TableHead>
              <TableHead className="text-right font-black py-6 px-8">البريد الإلكتروني</TableHead>
              <TableHead className="text-right font-black py-6 px-8 w-1/3">الرسالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">جاري التحميل...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">لا توجد رسائل حالياً</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-sm text-muted-foreground py-6 px-8">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-secondary" />
                       <span>{new Date(s.created_at).toLocaleDateString('ar-JO')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary py-6 px-8">
                     <div className="flex items-center gap-2">
                       <User size={16} className="text-secondary" />
                       <span>{s.name}</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-6 px-8">
                     <div className="flex items-center gap-2">
                       <Mail size={16} className="text-secondary" />
                       <a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a>
                     </div>
                  </TableCell>
                  <TableCell className="py-6 px-8">
                     <div className="flex gap-2 items-start p-4 bg-muted/30 rounded-2xl border border-muted/50">
                        <MessageSquare size={16} className="text-secondary mt-1 shrink-0" />
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{s.message}</p>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminContact;
