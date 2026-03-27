import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { NewsItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Newspaper } from 'lucide-react';
import { supabase } from '@/db/supabase';

const newsSchema = z.object({
  title_ar: z.string().min(2),
  title_en: z.string().min(2),
  content_ar: z.string().min(10),
  content_en: z.string().min(10),
  excerpt_ar: z.string().optional(),
  excerpt_en: z.string().optional(),
  slug: z.string().min(2),
  image_url: z.string().optional(),
});

const AdminNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title_ar: '', title_en: '', content_ar: '', content_en: '', excerpt_ar: '', excerpt_en: '', slug: '', image_url: '',
    },
  });

  useEffect(() => { fetchNews(); }, []);

  useEffect(() => {
    if (editingNews) {
      form.reset({
        title_ar: editingNews.title_ar, title_en: editingNews.title_en,
        content_ar: editingNews.content_ar, content_en: editingNews.content_en,
        excerpt_ar: editingNews.excerpt_ar || '', excerpt_en: editingNews.excerpt_en || '',
        slug: editingNews.slug, image_url: editingNews.image_url || '',
      });
    } else {
      form.reset({ title_ar: '', title_en: '', content_ar: '', content_en: '', excerpt_ar: '', excerpt_en: '', slug: '', image_url: '' });
    }
  }, [editingNews, form]);

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await db.getNews();
    setNews(data);
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof newsSchema>) => {
    try {
      if (editingNews) {
        const { error } = await supabase.from('news').update(values).eq('id', editingNews.id);
        if (error) throw error;
        toast.success('News updated');
      } else {
        const { error } = await supabase.from('news').insert(values);
        if (error) throw error;
        toast.success('News created');
      }
      setIsDialogOpen(false); setEditingNews(null); fetchNews();
    } catch (error: any) { toast.error(error.message); }
  };

  const deleteNews = async (id: string) => {
    if (confirm('Delete this news?')) {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) toast.error(error.message);
      else { toast.success('News deleted'); fetchNews(); }
    }
  };

  const filteredNews = news.filter(n => n.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || n.title_ar.includes(searchTerm));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="text-3xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
             <Newspaper size={32} />
             <span>Manage News</span>
           </h1>
           <p className="text-muted-foreground">Keep your users updated with the latest news.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingNews(null); }}>
          <DialogTrigger asChild><Button className="flex items-center space-x-2"><Plus size={20} /><span>New Item</span></Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingNews ? 'Edit News' : 'New Item'}</DialogTitle></DialogHeader>
            <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title_ar" render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="title_en" render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="image_url" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="excerpt_ar" render={({ field }) => (<FormItem><FormLabel>Excerpt (AR)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="excerpt_en" render={({ field }) => (<FormItem><FormLabel>Excerpt (EN)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="content_ar" render={({ field }) => (<FormItem><FormLabel>Content (AR)</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="content_en" render={({ field }) => (<FormItem><FormLabel>Content (EN)</FormLabel><FormControl><Textarea rows={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="submit">{editingNews ? 'Update' : 'Post'}</Button></DialogFooter>
            </form></Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 bg-background p-4 rounded-xl border">
        <Search size={20} className="text-muted-foreground" />
        <Input placeholder="Search news..." className="border-none shadow-none focus-visible:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>News Title</TableHead><TableHead>Slug</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>) : filteredNews.length === 0 ? (<TableRow><TableCell colSpan={3} className="text-center py-8">No news items found.</TableCell></TableRow>) : (
              filteredNews.map((n) => (
                <TableRow key={n.id}><TableCell className="font-medium"><div>{n.title_en}</div><div className="text-xs text-muted-foreground">{n.title_ar}</div></TableCell><TableCell className="text-muted-foreground text-sm">{n.slug}</TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingNews(n); setIsDialogOpen(true); }}><Edit size={18} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNews(n.id)}><Trash2 size={18} /></Button>
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

export default AdminNews;
