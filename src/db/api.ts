import { supabase } from './supabase';
import { Profile, Service, BlogPost, NewsItem, ContactSubmission, Settings, SiteConfig } from '@/types';

export const db = {
  // Profiles
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return { data: data as Profile | null, error };
  },

  // Settings
  async getSettings(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    return { data: data?.value as any | null, error };
  },

  async updateSettings(key: string, value: any) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();
    return { data, error };
  },

  // Services
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data || []) as Service[], error };
  },

  async getFeaturedServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_featured', true)
      .limit(6);
    return { data: (data || []) as Service[], error };
  },

  async getServiceBySlug(slug: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return { data: data as Service | null, error };
  },

  // Blog
  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data || []) as BlogPost[], error };
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return { data: data as BlogPost | null, error };
  },

  // News
  async getNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data || []) as NewsItem[], error };
  },

  async getNewsBySlug(slug: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return { data: data as NewsItem | null, error };
  },

  // Contact Submissions
  async submitContact(submission: Omit<ContactSubmission, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(submission);
    return { data, error };
  },

  async getContactSubmissions() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data || []) as ContactSubmission[], error };
  }
};
