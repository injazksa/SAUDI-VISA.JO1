import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Profession } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, UserCheck, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

const profSchema = z.object({
  name_ar: z.string().min(2, "الاسم بالعربي مطلوب"),
  name_en: z.string().min(2, "Name in English required"),
  code: z.string().min(2, "الرمز مطلوب"),
  category_ar: z.string().optional(),
  category_en: z.string().optional(),
});

const AdminProfessions: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProf, setEditingProf] = useState<Profession | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<string[]>([]);
  const [newDoc, setNewDoc] = useState('');

  const form = useForm<any>({
    resolver: zodResolver(profSchema),
    defaultValues: {
      name_ar: '',
      name_en: '',
      code: '',
      category_ar: '',
      category_en: '',
    },
  });

  const fetchProfessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('professions')
      .select('*')
      .order('name_ar', { ascending: true });
    
    if (error) toast.error("خطأ في جلب المهن");
    else setProfessions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  const onSubmit = async (values: any) => {
    const payload = { ...values, documents };
    if (editingProf) {
      const { error } = await supabase.from('professions').update(payload).eq('id', editingProf.id);
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم التحديث بنجاح");
        setIsDialogOpen(false);
        fetchProfessions();
      }
    } else {
      const { error } = await supabase.from('professions').insert(payload);
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت الإضافة بنجاح");
        setIsDialogOpen(false);
        fetchProfessions();
      }
    }
  };

  const deleteProf = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('professions').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchProfessions();
    }
  };

  const addDoc = () => {
    if (newDoc.trim()) {
      setDocuments([...documents, newDoc.trim()]);
      setNewDoc('');
    }
  };

  const removeDoc = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center gap-3">
             <UserCheck size={32} className="text-secondary" />
             <span>إدارة المهن والمستندات</span>
          </h1>
          <p className="text-muted-foreground mt-2">إضافة المهن، تصنيفها، وتحديد الأوراق المطلوبة لكل منها</p>
        </div>
        <Button onClick={() => { 
          setEditingProf(null); 
          setDocuments([]);
          form.reset({ name_ar: '', name_en: '', code: '', category_ar: '', category_en: '' }); 
          setIsDialogOpen(true); 
        }} className="bg-secondary text-primary font-bold px-6 py-6 rounded-2xl">
          <Plus className="ml-2" size={20} />
          إضافة مهنة جديدة
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-bold py-6 px-8">المهنة (عربي)</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">المهنة (EN)</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">التصنيف</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">الأوراق</TableHead>
              <TableHead className="text-left font-bold py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 font-bold">جاري التحميل...</TableCell></TableRow>
            ) : professions.map((prof) => (
              <TableRow key={prof.id} className="hover:bg-muted/10 transition-colors">
                <TableCell className="font-bold py-6 px-8 text-primary">{prof.name_ar}</TableCell>
                <TableCell className="py-6 px-8">{prof.name_en}</TableCell>
                <TableCell className="py-6 px-8 text-muted-foreground">{prof.category_ar || '-'}</TableCell>
                <TableCell className="py-6 px-8">
                   <div className="flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-lg w-fit">
                      <FileText size={12} />
                      <span>{prof.documents?.length || 0} مستند</span>
                   </div>
                </TableCell>
                <TableCell className="text-left py-6 px-8">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => { 
                      setEditingProf(prof); 
                      setDocuments(prof.documents || []);
                      form.reset(prof); 
                      setIsDialogOpen(true); 
                    }}><Edit size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProf(prof.id)} className="text-red-500"><Trash2 size={18} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl font-arabic max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader><DialogTitle className="text-2xl font-black text-primary">{editingProf ? 'تعديل المهنة' : 'إضافة مهنة جديدة'}</DialogTitle></DialogHeader>
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name_ar" render={({ field }) => (
                    <FormItem><FormLabel>الاسم بالعربي</FormLabel><FormControl><Input {...field} className="rounded-xl h-12" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="name_en" render={({ field }) => (
                    <FormItem><FormLabel>Name in English</FormLabel><FormControl><Input {...field} className="rounded-xl h-12" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="code" render={({ field }) => (
                    <FormItem><FormLabel>الرمز (Code)</FormLabel><FormControl><Input {...field} className="rounded-xl h-12" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category_ar" render={({ field }) => (
                    <FormItem><FormLabel>التصنيف (عربي)</FormLabel><FormControl><Input {...field} className="rounded-xl h-12" /></FormControl><FormMessage /></FormItem>
                  )} />
               </div>

               <div className="space-y-4">
                  <h3 className="font-black text-lg border-b pb-2 flex items-center gap-2">
                     <FileText size={20} className="text-secondary" />
                     <span>الأوراق المطلوبة لهذه المهنة</span>
                  </h3>
                  <div className="flex gap-2">
                     <Input 
                        placeholder="أضف مستند جديد..." 
                        value={newDoc} 
                        onChange={e => setNewDoc(e.target.value)} 
                        className="rounded-xl h-12"
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDoc())}
                     />
                     <Button type="button" onClick={addDoc} className="bg-primary text-white px-6 rounded-xl">إضافة</Button>
                  </div>
                  <div className="space-y-2">
                     {documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-dashed">
                           <span className="text-sm">{doc}</span>
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(i)} className="text-red-500 h-8 w-8"><X size={16} /></Button>
                        </div>
                     ))}
                     {documents.length === 0 && <p className="text-center text-muted-foreground py-4 text-sm">لا يوجد مستندات مضافة بعد.</p>}
                  </div>
               </div>

               <Button type="submit" className="w-full bg-primary font-bold py-6 rounded-xl text-lg shadow-lg">حفظ البيانات</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfessions;
