import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit, Trash2, Plus, FileText, Search, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const blogSchema = z.object({
  title_ar: z.string().min(2, "العنوان بالعربي مطلوب"),
  title_en: z.string().min(2, "العنوان بالإنجليزي مطلوب"),
  excerpt_ar: z.string().min(5, "المقتطف بالعربي مطلوب"),
  excerpt_en: z.string().min(5, "المقتطف بالإنجليزي مطلوب"),
  content_ar: z.string().min(10, "المحتوى بالعربي مطلوب"),
  content_en: z.string().min(10, "المحتوى بالإنجليزي مطلوب"),
  slug: z.string().min(2, "الرابط المختصر مطلوب"),
  image_url: z.string().url("رابط الصورة غير صحيح"),
});

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<any>({
    resolver: zodResolver(blogSchema),
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

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("خطأ في جلب المقالات");
    else setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onSubmit = async (values: any) => {
    if (editingPost) {
      const { error } = await supabase
        .from('blog_posts')
        .update(values)
        .eq('id', editingPost.id);
      
      if (error) toast.error("فشل التحديث");
      else {
        toast.success("تم تحديث المقال بنجاح");
        setIsDialogOpen(false);
        fetchPosts();
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('blog_posts')
        .insert({ ...values, author_id: user?.id });
      
      if (error) toast.error("فشل الإضافة");
      else {
        toast.success("تمت إضافة المقال بنجاح");
        setIsDialogOpen(false);
        fetchPosts();
      }
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) toast.error("فشل الحذف");
    else {
      toast.success("تم الحذف بنجاح");
      fetchPosts();
    }
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title_ar: post.title_ar,
      title_en: post.title_en,
      excerpt_ar: post.excerpt_ar,
      excerpt_en: post.excerpt_en,
      content_ar: post.content_ar,
      content_en: post.content_en,
      slug: post.slug,
      image_url: post.image_url,
    });
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    setEditingPost(null);
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

  const filtered = posts.filter(p => p.title_ar.includes(searchTerm) || p.title_en.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center gap-4">
            <FileText size={40} className="text-secondary" />
            <span>إدارة المدونة</span>
          </h1>
          <p className="text-muted-foreground mt-2">إضافة مقالات وتحديثات للمدونة</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white px-8 py-7 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
          <Plus className="text-secondary" size={24} />
          <span>إضافة مقال جديد</span>
        </Button>
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
        <div className="p-8 border-b bg-muted/30">
           <div className="relative max-w-md">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                className="pr-12 h-14 rounded-2xl border-2 focus:border-secondary transition-all"
                placeholder="ابحث عن مقال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-black py-6 px-8">الصورة</TableHead>
              <TableHead className="text-right font-black py-6 px-8">العنوان (بالعربي)</TableHead>
              <TableHead className="text-right font-black py-6 px-8">تاريخ النشر</TableHead>
              <TableHead className="text-left font-black py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">جاري التحميل...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">لا توجد مقالات حالياً</TableCell></TableRow>
            ) : (
              filtered.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-6 px-8">
                    <img src={post.image_url} className="w-16 h-12 object-cover rounded-xl shadow-sm" alt="" />
                  </TableCell>
                  <TableCell className="font-bold text-primary py-6 px-8 text-lg">{post.title_ar}</TableCell>
                  <TableCell className="py-6 px-8 text-muted-foreground">{new Date(post.created_at).toLocaleDateString('ar-JO')}</TableCell>
                  <TableCell className="py-6 px-8 text-left">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(post)} className="text-primary hover:bg-primary/5 hover:text-primary rounded-xl">
                        <Edit size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="text-red-500 hover:bg-red-50 rounded-xl">
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
              <FileText className="text-secondary" size={32} />
              {editingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}
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
                  <Button type="submit" className="rounded-2xl h-16 px-16 text-lg bg-primary font-black shadow-xl">حفظ المقال</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
