import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
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
  CreditCard
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

  // --- دالة إرسال الإيميل الاحترافية عبر Resend ---
  const sendResendEmail = async (data: any, file: File | null) => {
    const toBase64 = (f: File): Promise<string> => new Promise((res, rej) => {
      const r = new FileReader(); r.readAsDataURL(f);
      r.onload = () => res((r.result as string).split(',')[1]); r.onerror = e => rej(e);
    });

    const fileContent = file ? await toBase64(file) : null;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer re_aWPL5vd6_AUmWRP53LX9UPwrNYzy91Q3m',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'Visa@saudia-visa.com',
          subject: `🚨 طلب بصمة جديد من رقم: ${data.phone}`,
          html: `
            <div dir="rtl" style="font-family: Arial; border: 2px solid #059669; padding: 20px; border-radius: 15px;">
              <h2 style="color: #059669; text-align: center;">طلب حجز موعد بصمة جديد</h2>
              <hr/>
              <p><b>نوع التأشيرة:</b> ${data.visaType}</p>
              <p><b>الجنسية:</b> ${data.nationality}</p>
              <p><b>عدد الأشخاص:</b> ${data.peopleCount}</p>
              <p style="font-size: 18px; color: #059669;"><b>التكلفة الإجمالية: ${data.peopleCount * 15} دينار</b></p>
              <hr/>
              <p><b>رقم الهاتف:</b> ${data.phone}</p>
              <p><b>البريد الإلكتروني:</b> ${data.email || 'غير متوفر'}</p>
            </div>
          `,
          attachments: fileContent ? [{ filename: file!.name, content: fileContent }] : []
        }),
      });
    } catch (err) { console.error("Email error:", err); }
  };
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
      const { data: nats } = await db.getNationalities();
      const { data: conf } = await db.getSettings('site_config');
      setNationalities(nats || []);
      setConfig(conf);
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
    if (!formData.visaType || !formData.nationality || !formData.phone) {
      toast.error(isRtl ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let fileUrl = '';
      if (file) {
        const { data: upData, error: upErr } = await db.uploadImage(file, 'saudiavisa_images');
        if (upErr) throw upErr;
        fileUrl = upData?.publicUrl || '';
      }

      // Prepare data for submission
      const submissionData = {
        visa_type: formData.visaType,
        nationality: formData.nationality,
        people_count: formData.peopleCount,
        total_cost: totalCost,
        phone_number: formData.phone,
        email: formData.email,
        visa_document_url: fileUrl,
        status: 'new',
        ref_id: Math.floor(100000 + Math.random() * 900000).toString(),
        created_at: new Date().toISOString()
      };

      // حفظ البيانات في جدول fingerprint_appointments لأرشفة المعاملة
      const { error: insErr } = await db.supabase
        .from('fingerprint_appointments')
        .insert([submissionData]);

      if (insErr) throw insErr;

      // إرسال الإيميل عبر Resend
      await sendResendEmail(formData, file);

      setOrderData(submissionData);
      setSubmitted(true);
      toast.success(isRtl ? "تم استلام طلبك بنجاح" : "Request received successfully");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast.error(isRtl ? "حدث خطأ أثناء الإرسال: " + error.message : "Error during submission: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

            {/* Printable Receipt Card */}
            <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white print:shadow-none print:border-2 print:border-primary print:rounded-none">
              <CardHeader className="bg-primary text-white p-10 text-center relative overflow-hidden print:bg-white print:text-black print:border-b-4 print:border-primary print:p-6">
                <div className="absolute inset-0 opacity-10 print:hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl -mr-32 -mt-32"></div>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-secondary p-4 rounded-3xl print:hidden">
                      <Fingerprint size={48} className="text-primary" />
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
                        <p className="text-lg font-black text-primary">{isRtl ? "حجز موعد بصمة" : "Fingerprint Booking"} ({orderData.visa_type})</p>
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
                        <p className="text-lg font-black text-primary" dir="ltr">{orderData.phone_number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "المبلغ الإجمالي" : "Total Amount"}</p>
                        <p className="text-2xl font-black text-secondary">{orderData.total_cost} {isRtl ? "دينار أردني" : "JOD"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "تاريخ الطلب" : "Order Date"}</p>
                        <p className="text-lg font-black text-primary">
                          {new Date(orderData.created_at).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t-2 border-dashed border-muted text-center space-y-4">
                  <h4 className="text-xl font-black text-primary">{isRtl ? "مكتب تأشيرات السعودية - الأردن" : "Saudi Visa Office - Jordan"}</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {isRtl 
                      ? "المركز المعتمد للسفارة السعودية - الشركة المتخصصة للتوظيف ترخيص 22128" 
                      : "Certified Center for the Saudi Embassy - Specialized Recruitment Company License 22128"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-primary pt-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-secondary" />
                      <span>{config?.contact_info.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-secondary" />
                      <span>saudia-visa.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted/50 p-6 flex justify-center print:hidden">
                <Button onClick={handlePrint} size="lg" className="bg-primary text-white font-black px-12 py-8 rounded-2xl text-xl shadow-xl hover:scale-105 transition-all">
                  <Printer size={24} className="mr-3 rtl:ml-3" />
                  <span>{isRtl ? "طباعة الإيصال الآن" : "Print Receipt Now"}</span>
                </Button>
              </CardFooter>
            </Card>

            <div className="flex justify-center gap-4 print:hidden">
              <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-xl">
                {isRtl ? "تقديم طلب جديد" : "Submit New Request"}
              </Button>
              <Link to="/">
                <Button variant="ghost" className="rounded-xl">
                  {isRtl ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-arabic" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 bg-secondary/20 text-secondary border border-secondary/30 px-6 py-2 rounded-full text-sm font-black backdrop-blur-md mb-4"
          >
            <ShieldCheck size={20} />
            <span>{isRtl ? "خدمة معتمدة وموثوقة" : "Certified & Trusted Service"}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            {isRtl ? "حجز موعد بصمة" : "Fingerprint Appointment"}
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium">
            {isRtl 
              ? "يرجى تعبئة البيانات بدقة لتأكيد حجز موعد البصمة الخاص بك في مركزنا المعتمد." 
              : "Please fill in the details accurately to confirm your fingerprint appointment at our certified center."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-lg font-black text-primary flex items-center gap-2">
                      <FileText size={20} className="text-secondary" />
                      <span>{isRtl ? "نوع التأشيرة *" : "Visa Type *"}</span>
                    </label>
                    <Select onValueChange={(val) => setFormData({...formData, visaType: val})}>
                      <SelectTrigger className="h-16 rounded-2xl border-2 focus:ring-secondary">
                        <SelectValue placeholder={isRtl ? "اختر نوع التأشيرة..." : "Select visa type..."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="زيارة عائلية">{isRtl ? "زيارة عائلية" : "Family Visit"}</SelectItem>
                        <SelectItem value="زيارة شخصية">{isRtl ? "زيارة شخصية" : "Personal Visit"}</SelectItem>
                        <SelectItem value="زيارة عمل">{isRtl ? "زيارة عمل" : "Business Visit"}</SelectItem>
                        <SelectItem value="سياحة">{isRtl ? "سياحة" : "Tourism"}</SelectItem>
                        <SelectItem value="أخرى">{isRtl ? "أخرى" : "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-lg font-black text-primary flex items-center gap-2">
                      <Globe size={20} className="text-secondary" />
                      <span>{isRtl ? "الجنسية *" : "Nationality *"}</span>
                    </label>
                    <Select onValueChange={(val) => setFormData({...formData, nationality: val})}>
                      <SelectTrigger className="h-16 rounded-2xl border-2 focus:ring-secondary">
                        <SelectValue placeholder={isRtl ? "اختر الجنسية..." : "Select nationality..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((nat) => (
                          <SelectItem key={nat.id} value={isRtl ? nat.name_ar : nat.name_en}>
                            {isRtl ? nat.name_ar : nat.name_en}
                          </SelectItem>
                        ))}
                        {nationalities.length === 0 && (
                          <SelectItem value="أردني">{isRtl ? "أردني" : "Jordanian"}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-lg font-black text-primary flex items-center gap-2">
                      <Users size={20} className="text-secondary" />
                      <span>{isRtl ? "عدد الأشخاص *" : "Number of People *"}</span>
                    </label>
                    <Input 
                      type="number" 
                      min="1" 
                      required 
                      className="h-16 rounded-2xl border-2 focus:ring-secondary text-lg"
                      value={formData.peopleCount} 
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : parseInt(e.target.value);
                        setFormData({...formData, peopleCount: val as any});
                      }} 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-lg font-black text-primary flex items-center gap-2">
                      <Phone size={20} className="text-secondary" />
                      <span>{isRtl ? "رقم الهاتف (واتساب) *" : "Phone Number (WhatsApp) *"}</span>
                    </label>
                    <Input 
                      type="tel" 
                      required 
                      placeholder="07XXXXXXXX" 
                      className="h-16 rounded-2xl border-2 focus:ring-secondary text-lg"
                      dir="ltr"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-lg font-black text-primary flex items-center gap-2">
                    <Mail size={20} className="text-secondary" />
                    <span>{isRtl ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}</span>
                  </label>
                  <Input 
                    type="email" 
                    placeholder="example@mail.com" 
                    className="h-16 rounded-2xl border-2 focus:ring-secondary text-lg"
                    dir="ltr"
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>

                <div className="bg-secondary/5 p-8 rounded-[32px] border-2 border-dashed border-secondary/30 space-y-6">
                  <label className="text-xl font-black text-primary flex items-center justify-center gap-3">
                    <FileText size={24} className="text-secondary" />
                    <span>{isRtl ? "إرفاق صورة التأشيرة (هام جداً)" : "Attach Visa Copy (Very Important)"}</span>
                  </label>
                  <div className="flex flex-col items-center justify-center py-4">
                    <input 
                      type="file" 
                      id="visa-file"
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*,.pdf" 
                    />
                    <label 
                      htmlFor="visa-file" 
                      className="cursor-pointer bg-white border-2 border-secondary text-secondary font-black px-8 py-4 rounded-2xl hover:bg-secondary hover:text-white transition-all flex items-center gap-3 shadow-lg"
                    >
                      <FileText size={20} />
                      <span>{file ? file.name : (isRtl ? "اختر ملفاً..." : "Choose file...")}</span>
                    </label>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {isRtl ? "يدعم الصور (JPG, PNG) وملفات PDF" : "Supports images (JPG, PNG) and PDF files"}
                    </p>
                  </div>
                </div>

                <div className="bg-primary p-10 rounded-[32px] text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                  <span className="text-white/70 block text-lg font-bold mb-2">{isRtl ? "التكلفة الإجمالية الواجب دفعها" : "Total Cost to be Paid"}</span>
                  <span className="text-5xl md:text-6xl font-black text-secondary">{totalCost} {isRtl ? "دينار أردني" : "JOD"}</span>
                </div>

                <Button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full py-10 rounded-[24px] text-white font-black text-2xl transition-all transform active:scale-95 shadow-2xl bg-primary hover:bg-primary/90 relative overflow-hidden group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin" />
                      <span>{isRtl ? "جاري معالجة طلبك..." : "Processing your request..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>{isRtl ? "تأكيد الحجز والإرسال" : "Confirm Booking & Send"}</span>
                      {isRtl ? <ArrowLeft className="group-hover:-translate-x-2 transition-transform" /> : <ArrowRight className="group-hover:translate-x-2 transition-transform" />}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 px-4">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/20 p-3 rounded-2xl text-secondary">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="font-black text-primary">{isRtl ? "دفع آمن" : "Secure Payment"}</h4>
                <p className="text-sm text-muted-foreground">{isRtl ? "يتم الدفع عند الحضور للمركز" : "Payment is made upon arrival"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-secondary/20 p-3 rounded-2xl text-secondary">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="font-black text-primary">{isRtl ? "تأكيد فوري" : "Instant Confirmation"}</h4>
                <p className="text-sm text-muted-foreground">{isRtl ? "ستصلك رسالة تأكيد فورية" : "You will receive instant confirmation"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-secondary/20 p-3 rounded-2xl text-secondary">
                <Phone size={32} />
              </div>
              <div>
                <h4 className="font-black text-primary">{isRtl ? "دعم متواصل" : "Continuous Support"}</h4>
                <p className="text-sm text-muted-foreground">{isRtl ? "نحن معك في كل خطوة" : "We are with you every step"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerprintBooking;
