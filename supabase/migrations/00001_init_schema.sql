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
