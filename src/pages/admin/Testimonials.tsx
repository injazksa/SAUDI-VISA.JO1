import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Testimonial } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

const testimonialSchema = z.object({
  author_ar: z.string().min(2, "الاسم مطلوب"),
  author_en: z.string().min(2, "Name required"),
  content_ar: z.string().min(5, "المحتوى مطلوب"),
  content_en: z.string().min(5, "Content required"),
  rating: z.number().min(1).max(5),
});

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author_ar: '',
      author_en: '',
      content_ar: '',
      content_en: '',
      rating: 5,
    },
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) toast.error("فشل جلب الآراء");
    else setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const onSubmit = async (values: any) => {
    if (editing) {
      const { error } = await supabase.from('testimonials').update(values).eq('id', editing.id);
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم التحديث");
        setIsOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase.from('testimonials').insert(values);
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت الإضافة");
        setIsOpen(false);
        fetchTestimonials();
      }
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف");
      fetchTestimonials();
    }
  };

  return (
    <div className="space-y-8 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center gap-3">
             <Star className="text-secondary" />
             <span>آراء العملاء</span>
          </h1>
          <p className="text-muted-foreground">إدارة وتعديل آراء العملاء المعروضة في الصفحة الرئيسية</p>
        </div>
        <Button onClick={() => { setEditing(null); form.reset(); setIsOpen(true); }} className="bg-secondary text-primary font-bold">
          <Plus className="ml-2" />
          إضافة رأي جديد
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-bold py-6 px-8">الاسم</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">المحتوى</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">التقييم</TableHead>
              <TableHead className="text-left font-bold py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12">جاري التحميل...</TableCell></TableRow>
            ) : testimonials.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold py-6 px-8">{item.author_ar}</TableCell>
                <TableCell className="py-6 px-8 line-clamp-1 max-w-xs">{item.content_ar}</TableCell>
                <TableCell className="py-6 px-8">
                  <div className="flex text-secondary">
                    {Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </TableCell>
                <TableCell className="py-6 px-8">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(item); form.reset(item); setIsOpen(true); }}><Edit size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-red-500"><Trash2 size={18} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl font-arabic" dir="rtl">
          <DialogHeader><DialogTitle>{editing ? 'تعديل الرأي' : 'إضافة رأي جديد'}</DialogTitle></DialogHeader>
          <Form {...(form as any)}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
               <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="author_ar" render={({ field }) => (
                    <FormItem><FormLabel>الاسم (عربي)</FormLabel><FormControl><Input {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="author_en" render={({ field }) => (
                    <FormItem><FormLabel>Name (EN)</FormLabel><FormControl><Input {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                  )} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="content_ar" render={({ field }) => (
                    <FormItem><FormLabel>الرأي (عربي)</FormLabel><FormControl><Textarea {...field} className="rounded-xl" rows={3} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="content_en" render={({ field }) => (
                    <FormItem><FormLabel>Review (EN)</FormLabel><FormControl><Textarea {...field} className="rounded-xl" rows={3} /></FormControl><FormMessage /></FormItem>
                  )} />
               </div>
               <FormField control={form.control} name="rating" render={({ field }) => (
                 <FormItem><FormLabel>التقييم (1-5)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
               )} />
               <Button type="submit" className="w-full bg-primary font-bold py-6 rounded-xl">حفظ</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
