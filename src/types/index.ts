export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}

export interface Service {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  requirements_ar?: string;
  requirements_en?: string;
  fees?: string;
  image_url?: string;
  slug: string;
  is_featured: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  image_url?: string;
  slug: string;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_desc_ar?: string;
  meta_desc_en?: string;
  keywords_ar?: string;
  keywords_en?: string;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  image_url?: string;
  slug: string;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_desc_ar?: string;
  meta_desc_en?: string;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SiteConfig {
  logo_url: string;
  hero_ar: {
    title: string;
    subtitle: string;
    cta_text: string;
    image_url: string;
  };
  hero_en: {
    title: string;
    subtitle: string;
    cta_text: string;
    image_url: string;
  };
  contact_info: {
    phone: string;
    email: string;
    support_email: string;
    info_email: string;
    address_ar: string;
    address_en: string;
    whatsapp: string;
  };
  news_ticker_ar: string[];
  news_ticker_en: string[];
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}
