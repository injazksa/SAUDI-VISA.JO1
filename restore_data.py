import os
import json
from supabase import create_client, Client

# إعدادات Supabase من الملف الأصلي
url = "https://afnbvdbgartnjewhycgl.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbmJ2ZGJnYXJ0bmpld2h5Y2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTg3MDksImV4cCI6MjA5MDE5NDcwOX0._ZgiIonejFQiVnit98CsHWnQJD7oAFOWnPLEUCmpvtY"

supabase: Client = create_client(url, key)

def restore_settings():
    print("Restoring settings...")
    config = {
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
    }
    
    try:
        supabase.table('settings').upsert({"key": "site_config", "value": config}).execute()
        print("Settings restored successfully.")
    except Exception as e:
        print(f"Error restoring settings: {e}")

def restore_services():
    print("Restoring services...")
    services = [
        {"title_ar": "تأشيرة سياحية", "title_en": "Tourist Visa", "description_ar": "استخراج التأشيرة السياحية للسعودية بكل سهولة.", "description_en": "Get your Saudi tourist visa easily.", "slug": "tourist-visa", "is_featured": True, "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg"},
        {"title_ar": "تأشيرة عمل", "title_en": "Work Visa", "description_ar": "خدمات تأشيرات العمل والتوظيف.", "description_en": "Work and recruitment visa services.", "slug": "work-visa", "is_featured": True, "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_87030688-dd3c-4e24-9eb4-64bcaa1014a5.jpg"},
        {"title_ar": "تأشيرة زيارة عائلية", "title_en": "Family Visit Visa", "description_ar": "تسهيل إجراءات الزيارة العائلية.", "description_en": "Facilitating family visit procedures.", "slug": "family-visit", "is_featured": True, "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg"}
    ]
    for s in services:
        try:
            supabase.table('services').upsert(s, on_conflict='slug').execute()
        except Exception as e:
            print(f"Error restoring service {s['slug']}: {e}")
    print("Services restored.")

def restore_news():
    print("Restoring news...")
    news = [
        {"title_ar": "تحديثات جديدة لتأشيرات العمرة", "title_en": "New Updates for Umrah Visas", "excerpt_ar": "تعرف على آخر التحديثات لموسم العمرة الحالي.", "excerpt_en": "Learn about the latest updates for the current Umrah season.", "content_ar": "محتوى الخبر هنا...", "content_en": "News content here...", "slug": "umrah-updates-2024", "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_cfb1f010-7122-4992-a910-4331424ea9d5.jpg"},
        {"title_ar": "افتتاح الفرع الجديد في عمان", "title_en": "New Branch Opening in Amman", "excerpt_ar": "يسرنا استقبالكم في فرعنا الجديد بشارع مكة.", "excerpt_en": "We are pleased to welcome you to our new branch in Mecca St.", "content_ar": "محتوى الخبر هنا...", "content_en": "News content here...", "slug": "new-branch-amman", "image_url": "https://miaoda-site-img.s3cdn.medo.dev/images/KLing_87030688-dd3c-4e24-9eb4-64bcaa1014a5.jpg"}
    ]
    for n in news:
        try:
            supabase.table('news').upsert(n, on_conflict='slug').execute()
        except Exception as e:
            print(f"Error restoring news {n['slug']}: {e}")
    print("News restored.")

def restore_faqs():
    print("Restoring FAQs...")
    faqs = [
        {"question_ar": "كم تستغرق مدة استخراج التأشيرة السياحية؟", "question_en": "How long does it take to issue a tourist visa?", "answer_ar": "تستغرق عادة من ٢٤ إلى ٤٨ ساعة عمل.", "answer_en": "It usually takes 24 to 48 working hours.", "display_order": 1},
        {"question_ar": "ما هي الأوراق المطلوبة لتأشيرة العمرة؟", "question_en": "What are the documents required for an Umrah visa?", "answer_ar": "جواز سفر ساري المفعول لمدة ٦ أشهر، صورة شخصية بخلفية بيضاء، وشهادة تطعيم.", "answer_en": "A passport valid for 6 months, a personal photo with a white background, and a vaccination certificate.", "display_order": 2}
    ]
    for f in faqs:
        try:
            supabase.table('faqs').insert(f).execute()
        except Exception as e:
            print(f"Error restoring FAQ: {e}")
    print("FAQs restored.")

if __name__ == "__main__":
    restore_settings()
    restore_services()
    restore_news()
    restore_faqs()
    print("All data restoration attempts completed.")
