import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { FAQ } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const faqSchema = z.object({
  question_ar: z.string().min(5, "السؤال بالعربي يجب أن يكون ٥ أحرف على الأقل"),
  question_en: z.string().min(5, "السؤال بالإنجليزي يجب أن يكون ٥ أحرف على الأقل"),
  answer_ar: z.string().min(10, "الإجابة بالعربي يجب أن تكون ١٠ أحرف على الأقل"),
  answer_en: z.string().min(10, "الإجابة بالإنجليزي يجب أن تكون ١٠ أحرف على الأقل"),
  display_order: z.coerce.number().default(0),
});

const AdminFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question_ar: '',
      question_en: '',
      answer_ar: '',
      answer_en: '',
      display_order: 0,
    },
  }) as any;

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) toast.error("خطأ في جلب الأسئلة");
    else setFaqs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onSubmit = async (values: any) => {
    if (editingFaq) {
      const { error } = await supabase
        .from('faqs')
        .update(values)
        .eq('id', editingFaq.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم التحديث بنجاح");
        setIsDialogOpen(false);
        fetchFaqs();
      }
    } else {
      const { error } = await supabase
        .from('faqs')
        .insert(values);
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت الإضافة بنجاح");
        setIsDialogOpen(false);
        fetchFaqs();
      }
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchFaqs();
    }
  };

  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    form.reset({
      question_ar: faq.question_ar,
      question_en: faq.question_en,
      answer_ar: faq.answer_ar,
      answer_en: faq.answer_en,
      display_order: faq.display_order,
    });
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setEditingFaq(null);
    form.reset({
      question_ar: '',
      question_en: '',
      answer_ar: '',
      answer_en: '',
      display_order: faqs.length + 1,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة الأسئلة الشائعة</h1>
          <p className="text-muted-foreground">أضف أو عدل الأسئلة التي تظهر في الصفحة الرئيسية</p>
        </div>
        <Button onClick={openAdd} className="bg-secondary text-primary font-bold hover:bg-secondary/90">
          <Plus className="ml-2" size={20} />
          إضافة سؤال جديد
        </Button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-bold">السؤال (بالعربي)</TableHead>
              <TableHead className="text-right font-bold">الترتيب</TableHead>
              <TableHead className="text-left font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
            ) : faqs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10">لا يوجد أسئلة حالياً</TableCell></TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.question_ar}</TableCell>
                  <TableCell>{faq.display_order}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(faq)} className="text-primary hover:bg-primary/5">
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteFaq(faq.id)} className="text-red-500 hover:bg-red-50">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary flex items-center gap-3">
              <HelpCircle className="text-secondary" />
              {editingFaq ? 'تعديل سؤال' : 'إضافة سؤال جديد'}
            </DialogTitle>
          </DialogHeader>
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="question_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">السؤال بالعربي</FormLabel>
                      <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">السؤال بالإنجليزي</FormLabel>
                      <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="answer_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">الإجابة بالعربي</FormLabel>
                      <FormControl><Textarea {...field} rows={4} className="rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answer_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">الإجابة بالإنجليزي</FormLabel>
                      <FormControl><Textarea {...field} rows={4} className="rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">ترتيب العرض</FormLabel>
                    <FormControl><Input type="number" {...field} className="rounded-xl w-32" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">إلغاء</Button>
                <Button type="submit" className="rounded-xl px-10 bg-primary font-bold">حفظ التغييرات</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFaqs;
