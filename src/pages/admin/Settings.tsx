import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Settings, Save, Globe, Phone, Mail, MapPin, Hash } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getSettings('site_config').then(({ data }) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const { error } = await db.updateSettings('site_config', config);
    if (error) toast.error(error.message);
    else toast.success('تم حفظ الإعدادات بنجاح');
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center font-bold">جاري تحميل الإعدادات...</div>;

  return (
    <div className="space-y-8 pb-12 font-arabic" dir="rtl">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-primary flex items-center gap-3">
              <Settings size={32} className="text-secondary" />
              <span>إعدادات الموقع</span>
            </h1>
            <p className="text-muted-foreground mt-1">إدارة كافة النصوص والروابط والمعلومات الأساسية للموقع</p>
         </div>
         <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl font-bold flex items-center gap-3 shadow-lg">
           <Save size={20} className="text-secondary" />
           <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة التغييرات'}</span>
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Config */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="flex items-center gap-3 text-primary"><Globe size={20} className="text-secondary" /><span>الإعدادات العامة</span></CardTitle></CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold">اسم الموقع / الشعار</label>
                 <Input 
                   className="rounded-xl h-12"
                   value={config?.logo_url} 
                   onChange={(e) => setConfig({ ...config!, logo_url: e.target.value })} 
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold">عنوان الموقع (AR)</label>
                   <Input 
                     className="rounded-xl h-12"
                     value={config?.site_title_ar} 
                     onChange={(e) => setConfig({ ...config!, site_title_ar: e.target.value })} 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold">عنوان الموقع (EN)</label>
                   <Input 
                     className="rounded-xl h-12"
                     value={config?.site_title_en} 
                     onChange={(e) => setConfig({ ...config!, site_title_en: e.target.value })} 
                   />
                </div>
              </div>
           </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="flex items-center gap-3 text-primary"><Phone size={20} className="text-secondary" /><span>معلومات التواصل</span></CardTitle></CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2"><Phone size={14} className="text-secondary" /><span>رقم الهاتف</span></label>
                    <Input className="rounded-xl h-12" value={config?.contact_info.phone} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, phone: e.target.value } })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2"><Hash size={14} className="text-secondary" /><span>رقم الواتساب</span></label>
                    <Input className="rounded-xl h-12" value={config?.contact_info.whatsapp} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, whatsapp: e.target.value } })} />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold">إيميل التأشيرات</label>
                    <Input className="rounded-xl" value={config?.contact_info.email_visa} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, email_visa: e.target.value } })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold">إيميل الدعم</label>
                    <Input className="rounded-xl" value={config?.contact_info.email_support} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, email_support: e.target.value } })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold">إيميل المعلومات</label>
                    <Input className="rounded-xl" value={config?.contact_info.email_info} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, email_info: e.target.value } })} />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold flex items-center gap-2"><MapPin size={14} className="text-secondary" /><span>العنوان (بالعربي)</span></label>
                 <Input className="rounded-xl h-12" value={config?.contact_info.address_ar} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, address_ar: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">رابط خريطة قوقل</label>
                 <Input className="rounded-xl h-12 text-xs" value={config?.contact_info.google_maps_url} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, google_maps_url: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* Hero Content AR */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="text-primary font-black">قسم الواجهة (بالعربي)</CardTitle></CardHeader>
           <CardContent className="p-8 space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-bold">العنوان الرئيسي</label>
                 <Input className="rounded-xl h-12" value={config?.hero_ar.title} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">العنوان الفرعي</label>
                 <Textarea className="rounded-xl" rows={3} value={config?.hero_ar.subtitle} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, subtitle: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">نص زر الانتقال</label>
                 <Input className="rounded-xl h-12" value={config?.hero_ar.cta_text} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, cta_text: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* Hero Content EN */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="text-primary font-black">قسم الواجهة (بالإنجليزي)</CardTitle></CardHeader>
           <CardContent className="p-8 space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-bold">Title</label>
                 <Input className="rounded-xl h-12" value={config?.hero_en.title} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">Subtitle</label>
                 <Textarea className="rounded-xl" rows={3} value={config?.hero_en.subtitle} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, subtitle: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">CTA Text</label>
                 <Input className="rounded-xl h-12" value={config?.hero_en.cta_text} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, cta_text: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* News Ticker */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden lg:col-span-2">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="text-primary font-black">شريط الأخبار المتحرك (واحد في كل سطر)</CardTitle></CardHeader>
           <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-sm font-bold">أخبار بالعربي</label>
                 <Textarea 
                   className="rounded-xl"
                   rows={6} 
                   value={config?.news_ticker_ar.join('\n')} 
                   onChange={(e) => setConfig({ ...config!, news_ticker_ar: e.target.value.split('\n').filter(s => s.trim()) })} 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold">أخبار بالإنجليزي</label>
                 <Textarea 
                   className="rounded-xl"
                   rows={6} 
                   value={config?.news_ticker_en.join('\n')} 
                   onChange={(e) => setConfig({ ...config!, news_ticker_en: e.target.value.split('\n').filter(s => s.trim()) })} 
                 />
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
