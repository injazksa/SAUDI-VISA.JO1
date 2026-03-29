import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Settings, Save, Globe, Phone, Mail, MapPin, Hash, Image as ImageIcon, Plus, Trash2, Upload, Loader2, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderFileInputRef = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    db.getSettings('site_config').then(({ data, error }) => {
      if (error) {
        console.error('Settings Fetch Error:', error);
        alert('خطأ في جلب الإعدادات: ' + error.message + '\nتأكد من وجود جدول باسم settings في Supabase.');
      }
      setConfig(data);
      setLoading(false);
    }).catch(err => {
      alert('خطأ غير متوقع: ' + err.message);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'slider', index?: number) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    const uploadId = type === 'logo' ? 'logo' : `slider-${index}`;
    setUploading(uploadId);
    
    try {
      const { data, error } = await db.uploadImage(file);
      if (error) throw error;
      
      if (type === 'logo') {
        setConfig({ ...config, logo_image: data });
        toast.success('تم رفع الشعار بنجاح');
      } else if (type === 'slider' && index !== undefined) {
        const newSliders = [...(config.home_sliders || [])];
        newSliders[index] = { ...newSliders[index], image_url: data };
        setConfig({ ...config, home_sliders: newSliders });
        toast.success('تم رفع صورة السلايدر بنجاح');
      }
    } catch (err: any) {
      toast.error('فشل الرفع: ' + err.message);
    } finally {
      setUploading(null);
    }
  };

  const addSlider = () => {
    const newSliders = [...(config?.home_sliders || []), { image_url: '', title_ar: '', title_en: '', subtitle_ar: '', subtitle_en: '' }];
    setConfig({ ...config!, home_sliders: newSliders });
  };

  const removeSlider = (index: number) => {
    const newSliders = config?.home_sliders?.filter((_, i) => i !== index);
    setConfig({ ...config!, home_sliders: newSliders });
  };

  const updateSlider = (index: number, field: string, value: any) => {
    const newSliders = [...(config?.home_sliders || [])];
    newSliders[index] = { ...newSliders[index], [field]: value };
    setConfig({ ...config!, home_sliders: newSliders });
  };

  const addBadge = () => {
    const newBadges = [...(config?.trust_badges || []), { icon: 'Star', label_ar: '', label_en: '' }];
    setConfig({ ...config!, trust_badges: newBadges });
  };

  const removeBadge = (index: number) => {
    const newBadges = config?.trust_badges?.filter((_, i) => i !== index);
    setConfig({ ...config!, trust_badges: newBadges });
  };

  const updateBadge = (index: number, field: string, value: string) => {
    const newBadges = [...(config?.trust_badges || [])];
    newBadges[index] = { ...newBadges[index], [field]: value };
    setConfig({ ...config!, trust_badges: newBadges });
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
           {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="text-secondary" />}
           <span>{saving ? 'جاري الحفظ...' : 'حفظ كافة التغييرات'}</span>
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Config */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b"><CardTitle className="flex items-center gap-3 text-primary"><Globe size={20} className="text-secondary" /><span>الإعدادات العامة</span></CardTitle></CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold">اسم الموقع / الشعار النصي</label>
                 <Input 
                   className="rounded-xl h-12"
                   value={config?.logo_url} 
                   onChange={(e) => setConfig({ ...config!, logo_url: e.target.value })} 
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-sm font-bold block">صورة الشعار</label>
                 <div className="flex items-center gap-4">
                    {config?.logo_image && (
                      <div className="w-16 h-16 rounded-xl border overflow-hidden bg-muted flex items-center justify-center">
                        <img src={config.logo_image} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input 
                        className="rounded-xl h-12 text-xs"
                        placeholder="رابط الصورة أو ارفع من هاتفك"
                        value={config?.logo_image} 
                        onChange={(e) => setConfig({ ...config!, logo_image: e.target.value })} 
                      />
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'logo')} 
                      />
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl border-dashed border-2 h-12 gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading === 'logo'}
                      >
                        {uploading === 'logo' ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                        <span>{uploading === 'logo' ? 'جاري الرفع...' : 'رفع شعار جديد من الهاتف'}</span>
                      </Button>
                    </div>
                 </div>
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

         {/* Trust Badges Management */}
         <Card className="border-none shadow-xl rounded-3xl overflow-hidden lg:col-span-2">
            <CardHeader className="bg-muted/50 border-b flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-3 text-primary">
                  <Star size={20} className="text-secondary" />
                  <span>مميزاتنا (لماذا تختارنا)</span>
               </CardTitle>
               <Button onClick={addBadge} size="sm" className="bg-secondary text-primary font-bold">
                  <Plus size={18} className="ml-1" />
                  إضافة ميزة
               </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {config?.trust_badges?.map((badge, idx) => (
                    <div key={idx} className="p-6 border rounded-2xl relative group bg-muted/10">
                       <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => removeBadge(idx)}
                          className="absolute -top-3 -left-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                       >
                          <Trash2 size={14} />
                       </Button>
                       <div className="space-y-3">
                          <Select value={badge.icon} onValueChange={(val) => updateBadge(idx, 'icon', val)}>
                             <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="Clock">ساعة (سرعة)</SelectItem>
                                <SelectItem value="ShieldCheck">درع (أمان)</SelectItem>
                                <SelectItem value="Star">نجمة (تميز)</SelectItem>
                                <SelectItem value="Globe">كرة أرضية (عالمي)</SelectItem>
                             </SelectContent>
                          </Select>
                          <Input placeholder="العنوان (AR)" className="rounded-xl h-10" value={badge.label_ar} onChange={(e) => updateBadge(idx, 'label_ar', e.target.value)} />
                          <Input placeholder="Label (EN)" className="rounded-xl h-10" value={badge.label_en} onChange={(e) => updateBadge(idx, 'label_en', e.target.value)} />
                       </div>
                    </div>
                 ))}
               </div>
            </CardContent>
         </Card>

         {/* Home Sliders */}
         <Card className="border-none shadow-xl rounded-3xl overflow-hidden lg:col-span-2">
            <CardHeader className="bg-muted/50 border-b flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-3 text-primary">
                  <ImageIcon size={20} className="text-secondary" />
                  <span>سلايدر الصور في الصفحة الرئيسية</span>
               </CardTitle>
               <Button onClick={addSlider} size="sm" className="bg-secondary text-primary font-bold">
                  <Plus size={18} className="ml-1" />
                  إضافة شريحة جديدة
               </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               {config?.home_sliders?.map((slider, idx) => (
                  <div key={idx} className="p-6 border-2 border-dashed rounded-[32px] space-y-6 relative group">
                     <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removeSlider(idx)}
                        className="absolute -top-4 -left-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <Trash2 size={18} />
                     </Button>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-sm font-bold block">صورة الشريحة</label>
                           {slider.image_url && (
                             <div className="w-full h-40 rounded-2xl border overflow-hidden bg-muted mb-2">
                               <img src={slider.image_url} alt="Slider Preview" className="w-full h-full object-cover" />
                             </div>
                           )}
                           <Input className="rounded-xl h-12 text-xs mb-2" placeholder="رابط الصورة" value={slider.image_url} onChange={(e) => updateSlider(idx, 'image_url', e.target.value)} />
                           <input 
                              type="file" 
                              ref={el => sliderFileInputRef.current[idx] = el} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleImageUpload(e, 'slider', idx)} 
                           />
                           <Button 
                              variant="outline" 
                              className="w-full rounded-xl border-dashed border-2 h-12 gap-2"
                              onClick={() => sliderFileInputRef.current[idx]?.click()}
                              disabled={uploading === `slider-${idx}`}
                           >
                              {uploading === `slider-${idx}` ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                              <span>{uploading === `slider-${idx}` ? 'جاري الرفع...' : 'رفع صورة من الهاتف'}</span>
                           </Button>
                        </div>
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold">العنوان (AR)</label>
                                 <Input className="rounded-xl h-12" value={slider.title_ar} onChange={(e) => updateSlider(idx, 'title_ar', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold">العنوان (EN)</label>
                                 <Input className="rounded-xl h-12" value={slider.title_en} onChange={(e) => updateSlider(idx, 'title_en', e.target.value)} />
                              </div>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold">النص الفرعي (AR)</label>
                                 <Textarea className="rounded-xl" rows={2} value={slider.subtitle_ar} onChange={(e) => updateSlider(idx, 'subtitle_ar', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold">النص الفرعي (EN)</label>
                                 <Textarea className="rounded-xl" rows={2} value={slider.subtitle_en} onChange={(e) => updateSlider(idx, 'subtitle_en', e.target.value)} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               {(!config?.home_sliders || config.home_sliders.length === 0) && (
                 <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-3xl border-2 border-dashed">
                    لا يوجد صور في السلايدر حالياً، اضغط على "إضافة شريحة جديدة" للبدء.
                 </div>
               )}
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
