import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { NewsItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, Newspaper, Search, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const newsSchema = z.object({
  title_ar: z.string().min(2, "العنوان بالعربي مطلوب"),
  title_en: z.string().min(2, "العنوان بالإنجليزي مطلوب"),
  excerpt_ar: z.string().min(5, "المقتطف بالعربي مطلوب"),
  excerpt_en: z.string().min(5, "المقتطف بالإنجليزي مطلوب"),
  content_ar: z.string().min(10, "المحتوى بالعربي مطلوب"),
  content_en: z.string().min(10, "المحتوى بالإنجليزي مطلوب"),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  image_url: z.string().url("رابط الصورة غير صحيح"),
});

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<any>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title_ar: '',
      title_en: '',
      excerpt_ar: '',
      excerpt_en: '',
      content_ar: '',
      content_en: '',
      slug: '',
      image_url: '',
    },
  }) as any;

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("خطأ في جلب الأخبار");
    else setNews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onSubmit = async (values: any) => {
    if (editingNews) {
      const { error } = await supabase
        .from('news')
        .update(values)
        .eq('id', editingNews.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم تحديث الخبر بنجاح");
        setIsDialogOpen(false);
        fetchNews();
      }
    } else {
      const { error } = await supabase
        .from('news')
        .insert(values);
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت إضافة الخبر بنجاح");
        setIsDialogOpen(false);
        fetchNews();
      }
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchNews();
    }
  };

  const openEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    form.reset({
      title_ar: newsItem.title_ar,
      title_en: newsItem.title_en,
      excerpt_ar: newsItem.excerpt_ar,
      excerpt_en: newsItem.excerpt_en,
      content_ar: newsItem.content_ar,
      content_en: newsItem.content_en,
      slug: newsItem.slug,
      image_url: newsItem.image_url,
    });
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setEditingNews(null);
    form.reset({
      title_ar: '',
      title_en: '',
      excerpt_ar: '',
      excerpt_en: '',
      content_ar: '',
      content_en: '',
      slug: '',
      image_url: '',
    });
    setIsDialogOpen(true);
  };

  const filtered = news.filter(n => n.title_ar.includes(searchTerm) || n.title_en.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center gap-4">
            <Newspaper size={40} className="text-secondary" />
            <span>إدارة الأخبار</span>
          </h1>
          <p className="text-muted-foreground mt-2">نشر وتعديل الأخبار العاجلة والتنبيهات</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white px-8 py-7 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
          <Plus className="text-secondary" size={24} />
          <span>إضافة خبر جديد</span>
        </Button>
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
        <div className="p-8 border-b bg-muted/30">
           <div className="relative max-w-md">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                className="pr-12 h-14 rounded-2xl border-2 focus:border-secondary transition-all"
                placeholder="ابحث عن خبر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-black py-6 px-8">الصورة</TableHead>
              <TableHead className="text-right font-black py-6 px-8">العنوان</TableHead>
              <TableHead className="text-right font-black py-6 px-8">التاريخ</TableHead>
              <TableHead className="text-left font-black py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">جاري التحميل...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">لا يوجد أخبار حالياً</TableCell></TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-6 px-8">
                    <img src={item.image_url} className="w-16 h-12 object-cover rounded-xl shadow-sm" alt="" />
                  </TableCell>
                  <TableCell className="font-bold text-primary py-6 px-8 text-lg">{item.title_ar}</TableCell>
                  <TableCell className="py-6 px-8 text-muted-foreground">{new Date(item.created_at).toLocaleDateString('ar-JO')}</TableCell>
                  <TableCell className="py-6 px-8 text-left">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="text-primary hover:bg-primary/5 rounded-xl">
                        <Edit size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNews(item.id)} className="text-red-500 hover:bg-red-50 rounded-xl">
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
              <Newspaper className="text-secondary" size={32} />
              {editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}
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
                    name="excerpt_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">المقتطف (بالعربي)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-primary">المقتطف (بالإنجليزي)</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-primary">المحتوى (بالعربي)</FormLabel>
                      <FormControl><Textarea {...field} rows={6} className="rounded-2xl border-2" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-primary">المحتوى (بالإنجليزي)</FormLabel>
                      <FormControl><Textarea {...field} rows={6} className="rounded-2xl border-2" dir="ltr" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <FormLabel className="font-black text-primary">رابط الصورة</FormLabel>
                        <FormControl><Input {...field} className="rounded-2xl h-14 border-2" dir="ltr" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl h-16 px-10 text-lg border-2">إلغاء</Button>
                  <Button type="submit" className="rounded-2xl h-16 px-16 text-lg bg-primary font-black shadow-xl">حفظ الخبر</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;
