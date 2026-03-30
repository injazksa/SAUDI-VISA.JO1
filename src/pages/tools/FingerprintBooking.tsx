import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CreditCard,
  Upload,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/db/api';
import { SiteConfig, Nationality } from '@/types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const FingerprintBooking: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    visaType: '',
    nationality: '',
    peopleCount: 1,
    phone: '',
    email: '',
  });

  const PRICE_PER_PERSON = 15;
  const totalCost = formData.peopleCount * PRICE_PER_PERSON;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: nats } = await db.getNationalities();
        const { data: conf } = await db.getSettings('site_config');
        setNationalities(nats || []);
        setConfig(conf);
      } catch (e) {
        console.error("Fetch data error:", e);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!formData.visaType || !formData.nationality || !formData.phone) {
      toast.error(isRtl ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let fileUrl = '';
      
      // 1. محاولة رفع الصورة إذا وجدت
      if (file) {
        try {
          const { data: upData, error: upErr } = await db.uploadImage(file, 'saudiavisa_images');
          if (!upErr && upData) {
            fileUrl = upData.publicUrl || '';
          }
        } catch (uploadError) {
          console.error("File upload failed, but continuing with submission:", uploadError);
        }
      }

      // 2. تحضير بيانات الطلب
      const submissionData = {
        visa_type: formData.visaType,
        nationality: formData.nationality,
        people_count: formData.peopleCount,
        total_cost: totalCost,
        phone_number: formData.phone,
        email: formData.email || '',
        visa_document_url: fileUrl,
        status: 'new',
        ref_id: Math.floor(100000 + Math.random() * 900000).toString(),
        created_at: new Date().toISOString()
      };

      // 3. الحفظ المباشر في قاعدة بيانات سوبابيس (Supabase)
      const { error: insErr } = await db.supabase
        .from('fingerprint_appointments')
        .insert([submissionData]);

      if (insErr) {
        console.error("Supabase insertion error:", insErr);
        throw new Error(insErr.message);
      }

      // 4. عرض صفحة النجاح للمستخدم
      setOrderData(submissionData);
      setSubmitted(true);
      toast.success(isRtl ? "تم استلام طلبك بنجاح" : "Request received successfully");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error: any) {
      console.error("Final submission error:", error);
      toast.error(isRtl 
        ? "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى أو التواصل معنا عبر الواتساب." 
        : "Error during submission, please try again or contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // واجهة عرض الإيصال بعد النجاح
  if (submitted && orderData) {
    return (
      <div className="min-h-screen pb-20 font-arabic bg-muted/30" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4 print:hidden">
              <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-4xl font-black text-primary">
                {isRtl ? "تم تأكيد طلبك بنجاح!" : "Order Confirmed Successfully!"}
              </h1>
              <p className="text-xl text-muted-foreground">
                {isRtl 
                  ? "يرجى طباعة هذا الإيصال أو الاحتفاظ بصورة منه لمراجعته عند الحضور." 
                  : "Please print this receipt or keep a copy of it for reference when you arrive."}
              </p>
            </div>

            <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white print:shadow-none print:border-2 print:border-primary print:rounded-none">
              <CardHeader className="bg-primary text-white p-10 text-center relative overflow-hidden print:bg-white print:text-black print:border-b-4 print:border-primary print:p-6">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-3xl print:hidden">
                      <Calendar size={48} className="text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black">
                    {isRtl ? "إيصال مراجعة معاملة" : "Transaction Review Receipt"}
                  </h2>
                  <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-xl font-bold print:bg-muted print:text-primary">
                    SV-{orderData.ref_id}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "نوع الطلب" : "Request Type"}</p>
                        <p className="text-lg font-black text-primary">{isRtl ? "حجز موعد" : "Appointment Booking"} ({orderData.visa_type})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "عدد الأشخاص" : "Number of People"}</p>
                        <p className="text-lg font-black text-primary">{orderData.people_count}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "الجنسية" : "Nationality"}</p>
                        <p className="text-lg font-black text-primary">{orderData.nationality}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "رقم الهاتف" : "Phone Number"}</p>
                        <p className="text-lg font-black text-primary">{orderData.phone_number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "البريد الإلكتروني" : "Email"}</p>
                        <p className="text-lg font-black text-primary">{orderData.email || '---'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-2xl border-2 border-primary/20">
                      <div className="bg-primary p-3 rounded-xl text-white">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-primary font-bold">{isRtl ? "إجمالي المبلغ" : "Total Amount"}</p>
                        <p className="text-2xl font-black text-primary">{orderData.total_cost} {isRtl ? "دينار" : "JOD"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-secondary/10 rounded-[30px] border-2 border-secondary/20 space-y-4">
                  <div className="flex items-center gap-3 text-secondary">
                    <ShieldCheck size={28} />
                    <h3 className="text-xl font-black">{isRtl ? "ملاحظات هامة" : "Important Notes"}</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-lg font-bold">
                      <span className="text-secondary">•</span>
                      <span>{isRtl ? "يرجى إحضار أصل جواز السفر وصورة عن التأشيرة." : "Please bring original passport and visa copy."}</span>
                    </li>
                    <li className="flex gap-3 text-lg font-bold">
                      <span className="text-secondary">•</span>
                      <span>{isRtl ? "الحضور قبل الموعد بـ 15 دقيقة على الأقل." : "Arrive at least 15 minutes before the appointment."}</span>
                    </li>
                    <li className="flex gap-3 text-lg font-bold text-primary">
                      <span className="text-secondary">•</span>
                      <span>{isRtl ? "سيتم التواصل معك عبر الواتساب لتأكيد الموعد النهائي." : "We will contact you via WhatsApp to confirm the final appointment."}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/50 p-8 flex flex-col md:flex-row gap-4 print:hidden">
                <Button 
                  onClick={handlePrint}
                  className="w-full md:w-auto flex-1 h-16 rounded-2xl text-xl font-black gap-3 shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <Printer size={24} />
                  {isRtl ? "طباعة الإيصال" : "Print Receipt"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="w-full md:w-auto flex-1 h-16 rounded-2xl text-xl font-black border-2 hover:bg-muted transition-colors"
                >
                  {isRtl ? "حجز موعد جديد" : "Book Another Appointment"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // واجهة النموذج الأساسية
  return (
    <div className="min-h-screen pb-20 font-arabic bg-muted/30" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-4"
          >
            <span className="text-secondary font-bold">⭐ {isRtl ? "خدمة معتمدة وآمنة 100%" : "100% Certified & Secure Service"}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-4"
          >
            {isRtl ? "حجز المواعيد" : "Appointment Booking"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium"
          >
            {isRtl 
              ? "احجز موعدك الآن بسهولة وسرعة من خلال نظامنا الإلكتروني المعتمد." 
              : "Book your appointment now easily and quickly through our certified electronic system."}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
              <form onSubmit={handleSubmit}>
                <CardContent className="p-8 md:p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <FileText size={20} className="text-secondary" />
                        {isRtl ? "نوع التأشيرة" : "Visa Type"}
                      </label>
                      <Select 
                        onValueChange={(v) => setFormData({...formData, visaType: v})}
                        required
                      >
                        <SelectTrigger className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary transition-all text-lg font-bold">
                          <SelectValue placeholder={isRtl ? "اختر نوع التأشيرة" : "Select visa type"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2">
                          <SelectItem value="work" className="text-lg font-bold py-3">{isRtl ? "تأشيرة عمل" : "Work Visa"}</SelectItem>
                          <SelectItem value="visit" className="text-lg font-bold py-3">{isRtl ? "تأشيرة زيارة" : "Visit Visa"}</SelectItem>
                          <SelectItem value="family" className="text-lg font-bold py-3">{isRtl ? "تأشيرة عائلية" : "Family Visa"}</SelectItem>
                          <SelectItem value="tourist" className="text-lg font-bold py-3">{isRtl ? "تأشيرة سياحية" : "Tourist Visa"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <Globe size={20} className="text-secondary" />
                        {isRtl ? "الجنسية" : "Nationality"}
                      </label>
                      <Select 
                        onValueChange={(v) => setFormData({...formData, nationality: v})}
                        required
                      >
                        <SelectTrigger className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary transition-all text-lg font-bold">
                          <SelectValue placeholder={isRtl ? "اختر الجنسية" : "Select nationality"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2 max-h-[300px]">
                          {nationalities.map((nat) => (
                            <SelectItem key={nat.id} value={isRtl ? nat.name_ar : nat.name_en} className="text-lg font-bold py-3">
                              {isRtl ? nat.name_ar : nat.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <Users size={20} className="text-secondary" />
                        {isRtl ? "عدد الأشخاص" : "Number of People"}
                      </label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={formData.peopleCount}
                        onChange={(e) => setFormData({...formData, peopleCount: parseInt(e.target.value) || 1})}
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary transition-all text-lg font-bold"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <Phone size={20} className="text-secondary" />
                        {isRtl ? "رقم الهاتف (واتساب)" : "Phone Number (WhatsApp)"}
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="07XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary transition-all text-lg font-bold"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <Mail size={20} className="text-secondary" />
                        {isRtl ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                      </label>
                      <Input 
                        type="email" 
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary transition-all text-lg font-bold"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="text-lg font-black flex items-center gap-2 text-primary">
                        <Upload size={20} className="text-secondary" />
                        {isRtl ? "صورة التأشيرة أو الجواز (اختياري)" : "Visa or Passport Image (Optional)"}
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed border-muted rounded-[30px] cursor-pointer bg-muted/10 group-hover:bg-muted/20 group-hover:border-secondary transition-all"
                        >
                          {file ? (
                            <div className="flex items-center gap-3 text-green-600 font-black text-xl">
                              <CheckCircle2 size={32} />
                              {file.name}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon size={48} className="mb-2" />
                              <span className="text-xl font-black">{isRtl ? "اضغط هنا لرفع الملف" : "Click here to upload file"}</span>
                              <span className="text-sm font-bold">{isRtl ? "صور أو ملفات PDF" : "Images or PDF files"}</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-primary/5 rounded-[30px] border-2 border-primary/10 gap-6">
                    <div>
                      <p className="text-xl font-bold text-muted-foreground mb-1">{isRtl ? "الإجمالي" : "Total"}</p>
                      <p className="text-4xl font-black text-primary">{totalCost} {isRtl ? "دينار" : "JOD"}</p>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full md:w-auto h-16 px-12 rounded-2xl text-2xl font-black gap-3 shadow-xl hover:scale-[1.02] transition-transform"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={28} />
                      ) : (
                        <>
                          <CheckCircle2 size={28} />
                          {isRtl ? "تأكيد الحجز الآن" : "Confirm Booking Now"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[40px] border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-secondary text-primary p-8">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <ShieldCheck size={28} />
                  {isRtl ? "لماذا تحجز معنا؟" : "Why book with us?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="bg-secondary/20 p-3 rounded-2xl h-fit">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-1">{isRtl ? "توفير الوقت" : "Save Time"}</h4>
                    <p className="text-muted-foreground font-bold">{isRtl ? "تجنب الانتظار الطويل في المكاتب." : "Avoid long waits at offices."}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-secondary/20 p-3 rounded-2xl h-fit">
                    <ShieldCheck className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-1">{isRtl ? "ضمان القبول" : "Guaranteed Acceptance"}</h4>
                    <p className="text-muted-foreground font-bold">{isRtl ? "مراجعة دقيقة للبيانات قبل الإرسال." : "Accurate data review before sending."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintBooking;
