import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, Briefcase, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const serviceSchema = z.object({
  title_ar: z.string().min(2, "العنوان بالعربي مطلوب"),
  title_en: z.string().min(2, "العنوان بالإنجليزي مطلوب"),
  description_ar: z.string().min(10, "الوصف بالعربي مطلوب"),
  description_en: z.string().min(10, "الوصف بالإنجليزي مطلوب"),
  requirements_ar: z.string().optional().or(z.literal('')),
  requirements_en: z.string().optional().or(z.literal('')),
  fees: z.string().optional().or(z.literal('')),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  is_featured: z.boolean().default(false),
  image_url: z.string().optional().or(z.literal('')),
});

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<any>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      requirements_ar: '',
      requirements_en: '',
      fees: '',
      slug: '',
      is_featured: false,
      image_url: '',
    },
  }) as any;

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("خطأ في جلب الخدمات");
    else setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onSubmit = async (values: any) => {
    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(values)
        .eq('id', editingService.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم تحديث الخدمة بنجاح");
        setIsDialogOpen(false);
        fetchServices();
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert(values);
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت إضافة الخدمة بنجاح");
        setIsDialogOpen(false);
        fetchServices();
      }
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchServices();
    }
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
      title_ar: service.title_ar,
      title_en: service.title_en,
      description_ar: service.description_ar,
      description_en: service.description_en,
      requirements_ar: service.requirements_ar || '',
      requirements_en: service.requirements_en || '',
      fees: service.fees || '',
      slug: service.slug,
      is_featured: service.is_featured,
      image_url: service.image_url || '',
    });
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setEditingService(null);
    form.reset({
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      requirements_ar: '',
      requirements_en: '',
      fees: '',
      slug: '',
      is_featured: false,
      image_url: '',
    });
    setIsDialogOpen(true);
  };

  const filtered = services.filter(s => s.title_ar.includes(searchTerm) || s.title_en.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center gap-4">
            <Briefcase size={40} className="text-secondary" />
            <span>إدارة الخدمات</span>
          </h1>
          <p className="text-muted-foreground mt-2">إضافة وتعديل وحذف خدمات التأشيرات والمصادقات</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white px-8 py-7 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
          <Plus className="text-secondary" size={24} />
          <span>إضافة خدمة جديدة</span>
        </Button>
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
        <div className="p-8 border-b bg-muted/30">
           <div className="relative max-w-md">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                className="pr-12 h-14 rounded-2xl border-2 focus:border-secondary transition-all"
                placeholder="ابحث عن خدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-black py-6 px-8">الصورة</TableHead>
              <TableHead className="text-right font-black py-6 px-8">عنوان الخدمة</TableHead>
              <TableHead className="text-right font-black py-6 px-8">مميزة</TableHead>
              <TableHead className="text-left font-black py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">جاري التحميل...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">لا توجد خدمات حالياً</TableCell></TableRow>
            ) : (
              filtered.map((service) => (
                <TableRow key={service.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-6 px-8">
                    <img src={service.image_url || 'https://placeholder.com/100'} className="w-16 h-12 object-cover rounded-xl shadow-sm" alt="" />
                  </TableCell>
                  <TableCell className="font-bold text-primary py-6 px-8 text-lg">{service.title_ar}</TableCell>
                  <TableCell className="py-6 px-8">
                    {service.is_featured ? (
                      <span className="px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-xs font-black">نعم</span>
                    ) : (
                      <span className="px-4 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-black">لا</span>
                    )}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-left">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(service)} className="text-primary hover:bg-primary/5 hover:text-primary rounded-xl">
                        <Edit size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} className="text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={20} />
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
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-[40px] p-0" dir="rtl">
          <DialogHeader className="p-8 bg-primary text-white">
            <DialogTitle className="text-3xl font-black flex items-center gap-4">
              <Briefcase className="text-secondary" size={32} />
              {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <Form {...(form as any)}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">العنوان (بالعربي)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">العنوان (بالإنجليزي)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">الوصف (بالعربي)</FormLabel>
                        <FormControl><Textarea {...field} rows={4} className="rounded-2xl border-2" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">الوصف (بالإنجليزي)</FormLabel>
                        <FormControl><Textarea {...field} rows={4} className="rounded-2xl border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="requirements_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">المتطلبات (بالعربي)</FormLabel>
                        <FormControl><Textarea {...field} rows={3} className="rounded-2xl border-2" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requirements_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">المتطلبات (بالإنجليزي)</FormLabel>
                        <FormControl><Textarea {...field} rows={3} className="rounded-2xl border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="fees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">الرسوم (مثال: ٤٠٠ ريال)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">الرابط المختصر (Slug)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary flex items-center gap-2">
                           <ImageIcon size={16} />
                           رابط الصورة
                        </FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-6 bg-muted/50 rounded-3xl border-2 border-dashed">
                      <div className="space-y-1">
                        <FormLabel className="text-lg font-black text-primary">تمييز الخدمة</FormLabel>
                        <p className="text-sm text-muted-foreground">ستظهر هذه الخدمة في الصفحة الرئيسية</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-secondary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl h-16 px-10 text-lg border-2">إلغاء</Button>
                  <Button type="submit" className="rounded-2xl h-16 px-16 text-lg bg-primary font-black shadow-xl">حفظ الخدمة</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
