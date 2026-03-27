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
import { Edit, Trash2, Plus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const professionSchema = z.object({
  name_ar: z.string().min(2, "الاسم بالعربي مطلوب"),
  name_en: z.string().min(2, "الاسم بالإنجليزي مطلوب"),
  code: z.string().min(1, "الرمز مطلوب"),
});

const AdminProfessions: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof professionSchema>>({
    resolver: zodResolver(professionSchema),
    defaultValues: {
      name_ar: '',
      name_en: '',
      code: '',
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

  const onSubmit = async (values: z.infer<typeof professionSchema>) => {
    if (editingProfession) {
      const { error } = await supabase
        .from('professions')
        .update(values)
        .eq('id', editingProfession.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم التحديث بنجاح");
        setIsDialogOpen(false);
        fetchProfessions();
      }
    } else {
      const { error } = await supabase
        .from('professions')
        .insert(values);
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت الإضافة بنجاح");
        setIsDialogOpen(false);
        fetchProfessions();
      }
    }
  };

  const deleteProfession = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('professions').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchProfessions();
    }
  };

  const openEdit = (prof: Profession) => {
    setEditingProfession(prof);
    form.reset({
      name_ar: prof.name_ar,
      name_en: prof.name_en,
      code: prof.code,
    });
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setEditingProfession(null);
    form.reset({
      name_ar: '',
      name_en: '',
      code: '',
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary">إدارة المهن والرموز</h1>
          <p className="text-muted-foreground">أضف أو عدل المهن المعتمدة في النظام</p>
        </div>
        <Button onClick={openAdd} className="bg-secondary text-primary font-bold hover:bg-secondary/90">
          <Plus className="ml-2" size={20} />
          إضافة مهنة جديدة
        </Button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-bold">المهنة (بالعربي)</TableHead>
              <TableHead className="text-right font-bold">الرمز</TableHead>
              <TableHead className="text-left font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
            ) : professions.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10">لا يوجد مهن حالياً</TableCell></TableRow>
            ) : (
              professions.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell className="font-medium">{prof.name_ar}</TableCell>
                  <TableCell>{prof.code}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(prof)} className="text-primary hover:bg-primary/5">
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProfession(prof.id)} className="text-red-500 hover:bg-red-50">
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
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary flex items-center gap-3">
              <UserCheck className="text-secondary" />
              {editingProfession ? 'تعديل مهنة' : 'إضافة مهنة جديدة'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">الاسم بالعربي</FormLabel>
                    <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">الاسم بالإنجليزي</FormLabel>
                    <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">رمز المهنة</FormLabel>
                    <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">إلغاء</Button>
                <Button type="submit" className="rounded-xl px-10 bg-primary font-bold">حفظ</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfessions;
