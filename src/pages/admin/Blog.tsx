import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { BlogPost } from '@/types';
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
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import { supabase } from '@/db/supabase';

const blogSchema = z.object({
  title_ar: z.string().min(2),
  title_en: z.string().min(2),
  content_ar: z.string().min(10),
  content_en: z.string().min(10),
  excerpt_ar: z.string().optional(),
  excerpt_en: z.string().optional(),
  slug: z.string().min(2),
  image_url: z.string().optional(),
});

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title_ar: '', title_en: '', content_ar: '', content_en: '', excerpt_ar: '', excerpt_en: '', slug: '', image_url: '',
    },
  });

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    if (editingPost) {
      form.reset({
        title_ar: editingPost.title_ar, title_en: editingPost.title_en,
        content_ar: editingPost.content_ar, content_en: editingPost.content_en,
        excerpt_ar: editingPost.excerpt_ar || '', excerpt_en: editingPost.excerpt_en || '',
        slug: editingPost.slug, image_url: editingPost.image_url || '',
      });
    } else {
      form.reset({ title_ar: '', title_en: '', content_ar: '', content_en: '', excerpt_ar: '', excerpt_en: '', slug: '', image_url: '' });
    }
  }, [editingPost, form]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await db.getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof blogSchema>) => {
    try {
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(values).eq('id', editingPost.id);
        if (error) throw error;
        toast.success('Post updated');
      } else {
        const { error } = await supabase.from('blog_posts').insert(values);
        if (error) throw error;
        toast.success('Post created');
      }
      setIsDialogOpen(false); setEditingPost(null); fetchPosts();
    } catch (error: any) { toast.error(error.message); }
  };

  const deletePost = async (id: string) => {
    if (confirm('Delete this post?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) toast.error(error.message);
      else { toast.success('Post deleted'); fetchPosts(); }
    }
  };

  const filteredPosts = posts.filter(p => p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || p.title_ar.includes(searchTerm));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="text-3xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
             <FileText size={32} />
             <span>Manage Blog</span>
           </h1>
           <p className="text-muted-foreground">Share informative articles with your visitors.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingPost(null); }}>
          <DialogTrigger asChild><Button className="flex items-center space-x-2"><Plus size={20} /><span>New Article</span></Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingPost ? 'Edit Post' : 'New Article'}</DialogTitle></DialogHeader>
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
              <DialogFooter><Button type="submit">{editingPost ? 'Update' : 'Post'}</Button></DialogFooter>
            </form></Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 bg-background p-4 rounded-xl border">
        <Search size={20} className="text-muted-foreground" />
        <Input placeholder="Search posts..." className="border-none shadow-none focus-visible:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Post Title</TableHead><TableHead>Slug</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>) : filteredPosts.length === 0 ? (<TableRow><TableCell colSpan={3} className="text-center py-8">No posts found.</TableCell></TableRow>) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}><TableCell className="font-medium"><div>{post.title_en}</div><div className="text-xs text-muted-foreground">{post.title_ar}</div></TableCell><TableCell className="text-muted-foreground text-sm">{post.slug}</TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}><Edit size={18} /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deletePost(post.id)}><Trash2 size={18} /></Button>
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

export default AdminBlog;
