import { supabase } from './supabase';
import { 
  Profile, Service, BlogPost, NewsItem, ContactSubmission, SiteConfig,
  Nationality, Profession, FAQ, Testimonial, LegalPage
} from '@/types';

// Helper for single object queries
const singleData = <T>(data: any) => data as T | null;
const arrayData = <T>(data: any) => (data || []) as T[];

export const db = {
  // Profiles
  async getProfile(id: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    return { data: singleData<Profile>(data), error };
  },

  // Settings
  async getSettings(key: string) {
    const { data, error } = await supabase.from('settings').select('value').eq('key', key).maybeSingle();
    return { data: data?.value as any | null, error };
  },

  async updateSettings(key: string, value: any) {
    const { data, error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }).select().single();
    return { data, error };
  },

  // Services
  async getServices() {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    return { data: arrayData<Service>(data), error };
  },

  async getFeaturedServices() {
    const { data, error } = await supabase.from('services').select('*').eq('is_featured', true).limit(6);
    return { data: arrayData<Service>(data), error };
  },

  async getServiceBySlug(slug: string) {
    const { data, error } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
    return { data: singleData<Service>(data), error };
  },

  // Blog
  async getBlogPosts() {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    return { data: arrayData<BlogPost>(data), error };
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
    return { data: singleData<BlogPost>(data), error };
  },

  // News
  async getNews() {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    return { data: arrayData<NewsItem>(data), error };
  },

  async getNewsBySlug(slug: string) {
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).maybeSingle();
    return { data: singleData<NewsItem>(data), error };
  },

  // Contact Submissions
  async submitContact(submission: Omit<ContactSubmission, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('contact_submissions').insert(submission);
    return { data, error };
  },

  async getContactSubmissions() {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    return { data: arrayData<ContactSubmission>(data), error };
  },

  // FAQs
  async getFaqs() {
    const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
    return { data: arrayData<FAQ>(data), error };
  },

  // Testimonials
  async getTestimonials() {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    return { data: arrayData<Testimonial>(data), error };
  },

  // Nationalities
  async getNationalities() {
    const { data, error } = await supabase.from('nationalities').select('*').order('name_ar', { ascending: true });
    return { data: arrayData<Nationality>(data), error };
  },

  // Professions
  async getProfessions() {
    const { data, error } = await supabase.from('professions').select('*').order('name_ar', { ascending: true });
    return { data: arrayData<Profession>(data), error };
  },

  // Legal Pages
  async getLegalPageBySlug(slug: string) {
    const { data, error } = await supabase.from('legal_pages').select('*').eq('slug', slug).maybeSingle();
    return { data: singleData<LegalPage>(data), error };
  },

  // Storage
  async uploadImage(file: File, bucket: string = 'saudiavisa_images') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { data: data.publicUrl, error: null };
  }
};

// Direct exports for easier use in components
export const getLegalPageBySlug = async (slug: string) => (await db.getLegalPageBySlug(slug)).data;
export const getSiteConfig = async () => (await db.getSettings('site_config')).data as SiteConfig | null;
export const getFaqs = async () => (await db.getFaqs()).data;
export const getTestimonials = async () => (await db.getTestimonials()).data;
export const getServices = async () => (await db.getServices()).data;
export const getBlogPosts = async () => (await db.getBlogPosts()).data;
export const getNews = async () => (await db.getNews()).data;
