-- Create user roles
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create public view for profiles
CREATE VIEW public_profiles AS
  SELECT id, role FROM profiles;

-- Handle new user sync
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Website settings
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  requirements_ar text,
  requirements_en text,
  fees text,
  image_url text,
  slug text UNIQUE NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  excerpt_ar text,
  excerpt_en text,
  image_url text,
  slug text UNIQUE NOT NULL,
  meta_title_ar text,
  meta_title_en text,
  meta_desc_ar text,
  meta_desc_en text,
  keywords_ar text,
  keywords_en text,
  created_at timestamp with time zone DEFAULT now()
);

-- News
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  excerpt_ar text,
  excerpt_en text,
  image_url text,
  slug text UNIQUE NOT NULL,
  meta_title_ar text,
  meta_title_en text,
  meta_desc_ar text,
  meta_desc_en text,
  created_at timestamp with time zone DEFAULT now()
);

-- Contact Submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS for Public Tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read settings" ON settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT TO anon, authenticated USING (true);

-- Admin full access
CREATE POLICY "Admin full access settings" ON settings FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access services" ON services FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access blog" ON blog_posts FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access news" ON news FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin full access contact" ON contact_submissions FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Anon can insert contact submissions
CREATE POLICY "Anon insert contact" ON contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create storage bucket for images
-- Note: buckets are created via RPC or direct SQL if enabled
INSERT INTO storage.buckets (id, name, public) VALUES ('htxlsrmyyxwjnlmwzfct_saudiavisa_images', 'saudiavisa_images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'htxlsrmyyxwjnlmwzfct_saudiavisa_images');
CREATE POLICY "Admin manage images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'htxlsrmyyxwjnlmwzfct_saudiavisa_images' AND is_admin(auth.uid()));
-- Create Nationalities table
CREATE TABLE public.nationalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create Professions table
CREATE TABLE public.professions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  code text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create FAQs table
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_ar text NOT NULL,
  question_en text NOT NULL,
  answer_ar text NOT NULL,
  answer_en text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_ar text NOT NULL,
  author_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  rating int DEFAULT 5,
  created_at timestamp with time zone DEFAULT now()
);

-- Create Legal Pages table
CREATE TABLE public.legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Add extra fields to settings if needed via updates later

-- Enable RLS
ALTER TABLE public.nationalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read nationalities" ON nationalities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read professions" ON professions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read legal_pages" ON legal_pages FOR SELECT TO anon, authenticated USING (true);

-- Admin full access
CREATE POLICY "Admin manage nationalities" ON nationalities FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin manage professions" ON professions FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin manage faqs" ON faqs FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admin manage legal_pages" ON legal_pages FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Insert initial data
INSERT INTO faqs (question_ar, question_en, answer_ar, answer_en, display_order) VALUES
('كم تستغرق مدة استخراج التأشيرة السياحية؟', 'How long does it take to issue a tourist visa?', 'تستغرق عادة من ٢٤ إلى ٤٨ ساعة عمل.', 'It usually takes 24 to 48 working hours.', 1),
('هل يمكن للأردنيين الحصول على تأشيرة عند الوصول؟', 'Can Jordanians get a visa on arrival?', 'نعم، في حالات محددة لمن لديهم تأشيرة شينغن أو أمريكية مستخدمة، ولكن يفضل التقديم المسبق إلكترونياً.', 'Yes, in specific cases for those with a used Schengen or US visa, but online pre-application is preferred.', 2),
('ما هي الأوراق المطلوبة لتأشيرة العمرة؟', 'What are the documents required for an Umrah visa?', 'جواز سفر ساري المفعول لمدة ٦ أشهر، صورة شخصية بخلفية بيضاء، وشهادة تطعيم.', 'A passport valid for 6 months, a personal photo with a white background, and a vaccination certificate.', 3);

INSERT INTO legal_pages (slug, title_ar, title_en, content_ar, content_en) VALUES
('terms-of-use', 'شروط الاستخدام', 'Terms of Use', 'محتوى شروط الاستخدام هنا...', 'Terms of use content here...'),
('privacy-policy', 'سياسة الخصوصية', 'Privacy Policy', 'محتوى سياسة الخصوصية هنا...', 'Privacy policy content here...'),
('disclaimer', 'إخلاء المسؤولية', 'Disclaimer', 'محتوى إخلاء المسؤولية هنا...', 'Disclaimer content here...');
ALTER TABLE public.professions 
ADD COLUMN category_ar text,
ADD COLUMN category_en text,
ADD COLUMN documents jsonb DEFAULT '[]'::jsonb;

-- Update types/schema if needed
COMMENT ON COLUMN public.professions.documents IS 'Array of required document names/descriptions';
