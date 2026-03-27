import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Nationality } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, Globe } from 'lucide-react';
import { toast } from 'sonner';

const natSchema = z.object({
  name_ar: z.string().min(2, "الاسم بالعربي مطلوب"),
  name_en: z.string().min(2, "الاسم بالإنجليزي مطلوب"),
});

const AdminNationalities: React.FC = () => {
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNat, setEditingNat] = useState<Nationality | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(natSchema),
    defaultValues: {
      name_ar: '',
      name_en: '',
    },
  });

  const fetchNationalities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nationalities')
      .select('*')
      .order('name_ar', { ascending: true });
    
    if (error) toast.error("خطأ في جلب الجنسيات");
    else setNationalities(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNationalities();
  }, []);

  const onSubmit = async (values: any) => {
    if (editingNat) {
      const { error } = await supabase
        .from('nationalities')
        .update(values)
        .eq('id', editingNat.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم التحديث بنجاح");
        setIsDialogOpen(false);
        fetchNationalities();
      }
    } else {
      const { error } = await supabase
        .from('nationalities')
        .insert(values);
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت الإضافة بنجاح");
        setIsDialogOpen(false);
        fetchNationalities();
      }
    }
  };

  const deleteNat = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('nationalities').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchNationalities();
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة الجنسيات</h1>
          <p className="text-muted-foreground">أضف أو عدل الجنسيات المتاحة في حاسبة التأشيرات</p>
        </div>
        <Button onClick={() => { setEditingNat(null); form.reset({ name_ar: '', name_en: '' }); setIsDialogOpen(true); }} className="bg-secondary text-primary font-bold">
          <Plus className="ml-2" size={20} />
          إضافة جنسية
        </Button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-bold py-6 px-8">الجنسية (بالعربي)</TableHead>
              <TableHead className="text-right font-bold py-6 px-8">الجنسية (بالإنجليزي)</TableHead>
              <TableHead className="text-left font-bold py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
            ) : (
              nationalities.map((nat) => (
                <TableRow key={nat.id}>
                  <TableCell className="font-medium py-6 px-8">{nat.name_ar}</TableCell>
                  <TableCell className="py-6 px-8">{nat.name_en}</TableCell>
                  <TableCell className="text-left py-6 px-8">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingNat(nat); form.reset({ name_ar: nat.name_ar, name_en: nat.name_en }); setIsDialogOpen(true); }}>
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNat(nat.id)} className="text-red-500">
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
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader><DialogTitle>{editingNat ? 'تعديل جنسية' : 'إضافة جنسية'}</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
             <div className="space-y-2">
                <label className="text-sm font-bold">الاسم بالعربي</label>
                <Input {...form.register('name_ar')} className="rounded-xl h-12" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold">الاسم بالإنجليزي</label>
                <Input {...form.register('name_en')} className="rounded-xl h-12" />
             </div>
             <Button type="submit" className="w-full bg-primary font-bold py-6 rounded-xl">حفظ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNationalities;
