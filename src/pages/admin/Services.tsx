import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { Service } from '@/types';
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
import { Plus, Edit, Trash2, Search, Briefcase } from 'lucide-react';
import { supabase } from '@/db/supabase';

const serviceSchema = z.object({
  title_ar: z.string().min(2),
  title_en: z.string().min(2),
  description_ar: z.string().min(10),
  description_en: z.string().min(10),
  requirements_ar: z.string().optional().or(z.literal('')),
  requirements_en: z.string().optional().or(z.literal('')),
  fees: z.string().optional().or(z.literal('')),
  slug: z.string().min(2),
  is_featured: z.boolean(),
  image_url: z.string().optional().or(z.literal('')),
});

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof serviceSchema>>({
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
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (editingService) {
      form.reset({
        title_ar: editingService.title_ar,
        title_en: editingService.title_en,
        description_ar: editingService.description_ar,
        description_en: editingService.description_en,
        requirements_ar: editingService.requirements_ar || '',
        requirements_en: editingService.requirements_en || '',
        fees: editingService.fees || '',
        slug: editingService.slug,
        is_featured: editingService.is_featured,
        image_url: editingService.image_url || '',
      });
    } else {
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
    }
  }, [editingService, form]);

  const fetchServices = async () => {
    setLoading(true);
    const { data } = await db.getServices();
    setServices(data);
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof serviceSchema>) => {
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(values)
          .eq('id', editingService.id);
        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('services')
          .insert(values);
        if (error) throw error;
        toast.success('Service added successfully');
      }
      setIsDialogOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) toast.error(error.message);
      else {
        toast.success('Service deleted');
        fetchServices();
      }
    }
  };

  const filteredServices = services.filter(s => 
    s.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.title_ar.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
           <h1 className="text-3xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
             <Briefcase size={32} />
             <span>Manage Services</span>
           </h1>
           <p className="text-muted-foreground">Add, edit or delete visa services offered by Saudiavisa.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingService(null);
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add New Service</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="title_ar" render={({ field }) => (
                    <FormItem><FormLabel>Title (Arabic)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="title_en" render={({ field }) => (
                    <FormItem><FormLabel>Title (English)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fees" render={({ field }) => (
                    <FormItem><FormLabel>Fees</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description_ar" render={({ field }) => (
                  <FormItem><FormLabel>Description (Arabic)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description_en" render={({ field }) => (
                  <FormItem><FormLabel>Description (English)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="requirements_ar" render={({ field }) => (
                  <FormItem><FormLabel>Requirements (Arabic)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="requirements_en" render={({ field }) => (
                  <FormItem><FormLabel>Requirements (English)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="image_url" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter className="pt-6">
                  <Button type="submit" className="w-full md:w-auto">{editingService ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 bg-background p-4 rounded-xl border">
        <Search size={20} className="text-muted-foreground" />
        <Input 
          placeholder="Search services..." 
          className="border-none shadow-none focus-visible:ring-0" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">No services found.</TableCell></TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div>{service.title_en}</div>
                    <div className="text-xs text-muted-foreground">{service.title_ar}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{service.slug}</TableCell>
                  <TableCell>{service.is_featured ? '✅' : '❌'}</TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingService(service);
                      setIsDialogOpen(true);
                    }}>
                      <Edit size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteService(service.id)}>
                      <Trash2 size={18} />
                    </Button>
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

export default AdminServices;
