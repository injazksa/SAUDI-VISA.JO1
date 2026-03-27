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
