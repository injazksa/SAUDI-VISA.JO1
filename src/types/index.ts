export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type Service = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  requirements_ar?: string;
  requirements_en?: string;
  fees?: string;
  slug: string;
  is_featured: boolean;
  image_url?: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  slug: string;
  image_url: string;
  author_id: string;
  created_at: string;
};

export type NewsItem = {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  slug: string;
  image_url: string;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  created_at: string;
};

export type SiteConfig = {
  id: string;
  logo_url: string;
  logo_image?: string;
  site_title_ar: string;
  site_title_en: string;
  hero_ar: { title: string; subtitle: string; cta_text: string };
  hero_en: { title: string; subtitle: string; cta_text: string };
  contact_info: {
    phone: string;
    whatsapp: string;
    email_visa: string;
    email_support: string;
    email_info: string;
    address_ar: string;
    address_en: string;
    google_maps_url: string;
  };
  news_ticker_ar: string[];
  news_ticker_en: string[];
  home_sliders?: { 
    image_url: string; 
    title_ar: string; 
    title_en: string; 
    subtitle_ar: string; 
    subtitle_en: string;
  }[];
  trust_badges?: { icon: string; label_ar: string; label_en: string }[];
  updated_at: string;
};

export type Nationality = {
  id: string;
  name_ar: string;
  name_en: string;
  created_at: string;
};

export type Profession = {
  id: string;
  name_ar: string;
  name_en: string;
  code: string;
  category_ar?: string;
  category_en?: string;
  documents?: string[];
  created_at: string;
};

export type FAQ = {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  display_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  author_ar: string;
  author_en: string;
  content_ar: string;
  content_en: string;
  rating: number;
  created_at: string;
};

export type LegalPage = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  updated_at: string;
};
