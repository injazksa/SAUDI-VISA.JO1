import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { SiteConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Settings, Save, Globe, Phone, Mail, MapPin } from 'lucide-react';

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
    else toast.success('Settings updated successfully');
    setSaving(false);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
           <Settings size={32} />
           <span>Site Settings</span>
         </h1>
         <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
           <Save size={20} />
           <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Config */}
        <Card className="border-none shadow-md">
           <CardHeader><CardTitle className="flex items-center space-x-2 rtl:space-x-reverse"><Globe size={20} className="text-primary" /><span>General</span></CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Logo Text / URL</label>
                 <Input 
                   value={config?.logo_url} 
                   onChange={(e) => setConfig({ ...config!, logo_url: e.target.value })} 
                 />
              </div>
           </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-none shadow-md">
           <CardHeader><CardTitle className="flex items-center space-x-2 rtl:space-x-reverse"><Phone size={20} className="text-primary" /><span>Contact Information</span></CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1 rtl:space-x-reverse"><Phone size={14} /><span>Phone</span></label>
                    <Input value={config?.contact_info.phone} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, phone: e.target.value } })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1 rtl:space-x-reverse"><Mail size={14} /><span>Email</span></label>
                    <Input value={config?.contact_info.email} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, email: e.target.value } })} />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1 rtl:space-x-reverse"><MapPin size={14} /><span>Address (AR)</span></label>
                 <Input value={config?.contact_info.address_ar} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, address_ar: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1 rtl:space-x-reverse"><MapPin size={14} /><span>Address (EN)</span></label>
                 <Input value={config?.contact_info.address_en} onChange={(e) => setConfig({ ...config!, contact_info: { ...config!.contact_info, address_en: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* Hero Content AR */}
        <Card className="border-none shadow-md">
           <CardHeader><CardTitle>Hero Section (Arabic)</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Title</label>
                 <Input value={config?.hero_ar.title} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Subtitle</label>
                 <Textarea value={config?.hero_ar.subtitle} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, subtitle: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">CTA Text</label>
                 <Input value={config?.hero_ar.cta_text} onChange={(e) => setConfig({ ...config!, hero_ar: { ...config!.hero_ar, cta_text: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* Hero Content EN */}
        <Card className="border-none shadow-md">
           <CardHeader><CardTitle>Hero Section (English)</CardTitle></CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Title</label>
                 <Input value={config?.hero_en.title} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, title: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Subtitle</label>
                 <Textarea value={config?.hero_en.subtitle} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, subtitle: e.target.value } })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">CTA Text</label>
                 <Input value={config?.hero_en.cta_text} onChange={(e) => setConfig({ ...config!, hero_en: { ...config!.hero_en, cta_text: e.target.value } })} />
              </div>
           </CardContent>
        </Card>

        {/* News Ticker */}
        <Card className="border-none shadow-md lg:col-span-2">
           <CardHeader><CardTitle>News Ticker Items (One per line)</CardTitle></CardHeader>
           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Arabic Items</label>
                 <Textarea 
                   rows={5} 
                   value={config?.news_ticker_ar.join('\n')} 
                   onChange={(e) => setConfig({ ...config!, news_ticker_ar: e.target.value.split('\n') })} 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">English Items</label>
                 <Textarea 
                   rows={5} 
                   value={config?.news_ticker_en.join('\n')} 
                   onChange={(e) => setConfig({ ...config!, news_ticker_en: e.target.value.split('\n') })} 
                 />
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
