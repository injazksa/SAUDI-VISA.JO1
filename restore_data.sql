-- 1. إعدادات الموقع الأساسية (أرقام الهاتف، الإيميلات، اللوجو، السلايدر)
INSERT INTO public.settings (key, value)
VALUES ('site_config', '{
  "site_title_ar": "إنجاز - مكتب تأشيرات السعودية",
  "site_title_en": "Injaz - Saudi Visa Office",
  "logo_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg",
  "contact_info": {
    "phone": "+962789881009",
    "whatsapp": "962789881009",
    "email_visa": "visa@injazksa.com",
    "email_support": "support@injazksa.com",
    "email_info": "info@injazksa.com",
    "address_ar": "عمان، الأردن - شارع مكة",
    "address_en": "Amman, Jordan - Mecca St",
    "google_maps_url": "https://maps.google.com"
  },
  "hero_ar": {
    "title": "مكتب تأشيرات السعودية المعتمد",
    "subtitle": "نقدم كافة خدمات التأشيرات للسفارة السعودية في الأردن بأعلى كفاءة"
  },
  "hero_en": {
    "title": "Certified Saudi Visa Office",
    "subtitle": "Providing all visa services for the Saudi Embassy in Jordan with high efficiency"
  },
  "news_ticker_ar": ["نحيطكم علماً بأن أوقات الدوام خلال شهر رمضان من 10 صباحاً حتى 4 مساءً", "بدء استقبال طلبات تأشيرات العمرة للموسم الجديد"],
  "news_ticker_en": ["Ramadan working hours: 10 AM to 4 PM", "Umrah visa applications are now open for the new season"],
  "home_sliders": [
    {
      "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg",
      "title_ar": "مكتب تأشيرات السعودية في الأردن",
      "title_en": "Saudi Visa Office in Jordan",
      "subtitle_ar": "المركز المعتمد للسفارة السعودية - الشركة المتخصصة للتوظيف ترخيص 22128",
      "subtitle_en": "Certified Center for the Saudi Embassy - Specialized Recruitment Company License 22128"
    },
    {
      "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_87030688-dd3c-4e24-9eb4-64bcaa1014a5.jpg",
      "title_ar": "إصدار كافة أنواع التأشيرات",
      "title_en": "Issuing All Types of Visas",
      "subtitle_ar": "تأشيرات العمل، الزيارة، السياحة، والعمرة بأعلى كفاءة وسرعة ممكنة.",
      "subtitle_en": "Work, Visit, Tourist, and Umrah visas with the highest efficiency and speed."
    }
  ],
  "trust_badges": [
    { "icon": "Clock", "label_ar": "سرعة الإنجاز", "label_en": "Fast Processing" },
    { "icon": "ShieldCheck", "label_ar": "موثوقية تامة", "label_en": "Full Reliability" },
    { "icon": "Star", "label_ar": "مركز معتمد", "label_en": "Certified Center" },
    { "icon": "Globe", "label_ar": "تغطية شاملة", "label_en": "Full Coverage" }
  ]
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. إضافة خدمات تجريبية
INSERT INTO public.services (title_ar, title_en, description_ar, description_en, slug, icon, is_featured)
VALUES 
('تأشيرة سياحية', 'Tourist Visa', 'استخراج التأشيرة السياحية للسعودية بكل سهولة.', 'Get your Saudi tourist visa easily.', 'tourist-visa', 'Globe', true),
('تأشيرة عمل', 'Work Visa', 'خدمات تأشيرات العمل والتوظيف.', 'Work and recruitment visa services.', 'work-visa', 'Briefcase', true),
('تأشيرة زيارة عائلية', 'Family Visit Visa', 'تسهيل إجراءات الزيارة العائلية.', 'Facilitating family visit procedures.', 'family-visit', 'Users', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. إضافة أخبار تجريبية
INSERT INTO public.news (title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, slug, image_url)
VALUES 
('تحديثات جديدة لتأشيرات العمرة', 'New Updates for Umrah Visas', 'تعرف على آخر التحديثات لموسم العمرة الحالي.', 'Learn about the latest updates for the current Umrah season.', 'محتوى الخبر هنا...', 'News content here...', 'umrah-updates-2024', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg'),
('افتتاح الفرع الجديد في عمان', 'New Branch Opening in Amman', 'يسرنا استقبالكم في فرعنا الجديد بشارع مكة.', 'We are pleased to welcome you to our new branch in Mecca St.', 'محتوى الخبر هنا...', 'News content here...', 'new-branch-amman', 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_87030688-dd3c-4e24-9eb4-64bcaa1014a5.jpg')
ON CONFLICT (slug) DO NOTHING;

-- 4. إضافة أسئلة شائعة
INSERT INTO public.faqs (question_ar, question_en, answer_ar, answer_en, display_order)
VALUES 
('كم تستغرق مدة استخراج التأشيرة السياحية؟', 'How long does it take to issue a tourist visa?', 'تستغرق عادة من ٢٤ إلى ٤٨ ساعة عمل.', 'It usually takes 24 to 48 working hours.', 1),
('ما هي الأوراق المطلوبة لتأشيرة العمرة؟', 'What are the documents required for an Umrah visa?', 'جواز سفر ساري المفعول لمدة ٦ أشهر، صورة شخصية بخلفية بيضاء، وشهادة تطعيم.', 'A passport valid for 6 months, a personal photo with a white background, and a vaccination certificate.', 2)
ON CONFLICT DO NOTHING;
