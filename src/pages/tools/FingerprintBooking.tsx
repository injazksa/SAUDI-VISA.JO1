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
          subject: `🚨 طلب موعد جديد من رقم: ${data.phone}`,
          html: `
            <div dir="rtl" style="font-family: Arial; border: 2px solid #059669; padding: 20px; border-radius: 15px;">
              <h2 style="color: #059669; text-align: center;">طلب حجز موعد جديد</h2>
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
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "التكلفة الإجمالية" : "Total Cost"}</p>
                        <p className="text-2xl font-black text-secondary">{orderData.total_cost} {isRtl ? "دينار" : "JOD"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-secondary transition-colors">
                      <div className="bg-secondary/20 p-3 rounded-xl text-secondary">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">{isRtl ? "تاريخ الطلب" : "Order Date"}</p>
                        <p className="text-lg font-black text-primary">{new Date(orderData.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-primary/5 rounded-[32px] border-2 border-dashed border-primary/20 space-y-4">
                  <h3 className="text-xl font-black text-primary flex items-center gap-2">
                    <AlertCircle size={24} className="text-secondary" />
                    <span>{isRtl ? "تعليمات هامة" : "Important Instructions"}</span>
                  </h3>
                  <ul className="space-y-3 text-muted-foreground font-bold list-disc list-inside">
                    <li>{isRtl ? "يرجى الحضور قبل الموعد بـ 15 دقيقة." : "Please arrive 15 minutes before your appointment."}</li>
                    <li>{isRtl ? "إحضار جواز السفر الأصلي وصورة عن التأشيرة." : "Bring your original passport and a copy of the visa."}</li>
                    <li>{isRtl ? "التأكد من مطابقة البيانات في هذا الإيصال مع الوثائق الرسمية." : "Ensure the data in this receipt matches your official documents."}</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted/30 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 print:hidden">
                <Button onClick={handlePrint} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-2xl font-black flex items-center gap-3 shadow-xl">
                  <Printer size={20} />
                  <span>{isRtl ? "طباعة الإيصال" : "Print Receipt"}</span>
                </Button>
                <Link to="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto px-10 py-6 rounded-2xl font-black border-2">
                    {isRtl ? "العودة للرئيسية" : "Back to Home"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-arabic bg-muted/30" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-secondary font-bold border border-white/20"
          >
            <ShieldCheck size={20} />
            <span>{isRtl ? "خدمة معتمدة وآمنة 100%" : "100% Certified & Secure Service"}</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            {isRtl ? "حجز المواعيد" : "Appointment Booking"}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            {isRtl 
              ? "احجز موعدك الآن بسهولة وسرعة من خلال نظامنا الإلكتروني المعتمد." 
              : "Book your appointment now easily and quickly through our certified electronic system."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Sidebar Info */}
              <div className="bg-muted/50 p-10 space-y-8 border-l rtl:border-l-0 rtl:border-r">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-primary">{isRtl ? "لماذا تحجز معنا؟" : "Why book with us?"}</h3>
                  <div className="space-y-6">
                    {[
                      { icon: <Clock className="text-secondary" />, title: isRtl ? "توفير الوقت" : "Save Time", desc: isRtl ? "تجنب الانتظار الطويل" : "Avoid long waits" },
                      { icon: <ShieldCheck className="text-secondary" />, title: isRtl ? "ضمان القبول" : "Guaranteed Acceptance", desc: isRtl ? "مراجعة دقيقة للبيانات" : "Accurate data review" },
                      { icon: <CreditCard className="text-secondary" />, title: isRtl ? "دفع آمن" : "Secure Payment", desc: isRtl ? "خيارات دفع متعددة" : "Multiple payment options" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm h-fit">{item.icon}</div>
                        <div>
                          <p className="font-black text-primary">{item.title}</p>
                          <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-primary rounded-3xl text-white space-y-4">
                  <p className="font-bold text-sm opacity-80">{isRtl ? "رسوم الخدمة" : "Service Fee"}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-secondary">15</span>
                    <span className="text-xl font-bold">{isRtl ? "دينار / شخص" : "JOD / Person"}</span>
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed">
                    {isRtl 
                      ? "* الرسوم تشمل حجز الموعد والمراجعة الفنية للطلب." 
                      : "* Fees include appointment booking and technical review."}
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-2 p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-primary flex items-center gap-2">
                        <FileText size={18} className="text-secondary" />
                        <span>{isRtl ? "نوع التأشيرة" : "Visa Type"}</span>
                      </label>
                      <Select onValueChange={(v) => setFormData({ ...formData, visaType: v })}>
                        <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-secondary">
                          <SelectValue placeholder={isRtl ? "اختر نوع التأشيرة" : "Select visa type"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">{isRtl ? "تأشيرة عمل" : "Work Visa"}</SelectItem>
                          <SelectItem value="visit">{isRtl ? "تأشيرة زيارة" : "Visit Visa"}</SelectItem>
                          <SelectItem value="tourist">{isRtl ? "تأشيرة سياحة" : "Tourist Visa"}</SelectItem>
                          <SelectItem value="umrah">{isRtl ? "تأشيرة عمرة" : "Umrah Visa"}</SelectItem>
                          <SelectItem value="family">{isRtl ? "زيارة عائلية" : "Family Visit"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-primary flex items-center gap-2">
                        <Globe size={18} className="text-secondary" />
                        <span>{isRtl ? "الجنسية" : "Nationality"}</span>
                      </label>
                      <Select onValueChange={(v) => setFormData({ ...formData, nationality: v })}>
                        <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-secondary">
                          <SelectValue placeholder={isRtl ? "اختر الجنسية" : "Select nationality"} />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalities.map((nat) => (
                            <SelectItem key={nat.id} value={isRtl ? nat.name_ar : nat.name_en}>
                              {isRtl ? nat.name_ar : nat.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-primary flex items-center gap-2">
                        <Users size={18} className="text-secondary" />
                        <span>{isRtl ? "عدد الأشخاص" : "Number of People"}</span>
                      </label>
                      <Input 
                        type="number" 
                        min="1" 
                        max="10"
                        className="h-14 rounded-2xl border-2 focus:ring-secondary font-bold"
                        value={formData.peopleCount}
                        onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-primary flex items-center gap-2">
                        <Phone size={18} className="text-secondary" />
                        <span>{isRtl ? "رقم الهاتف (واتساب)" : "Phone Number (WhatsApp)"}</span>
                      </label>
                      <Input 
                        placeholder="07XXXXXXXX"
                        className="h-14 rounded-2xl border-2 focus:ring-secondary font-bold"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-primary flex items-center gap-2">
                      <Mail size={18} className="text-secondary" />
                      <span>{isRtl ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}</span>
                    </label>
                    <Input 
                      type="email"
                      placeholder="example@mail.com"
                      className="h-14 rounded-2xl border-2 focus:ring-secondary font-bold"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-primary flex items-center gap-2">
                      <Upload className="text-secondary" size={18} />
                      <span>{isRtl ? "صورة التأشيرة أو الجواز (اختياري)" : "Visa or Passport Copy (Optional)"}</span>
                    </label>
                    <div className="relative">
                      <Input 
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <label 
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20"
                      >
                        {file ? (
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <CheckCircle2 className="text-green-500" />
                            <span>{file.name}</span>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <ImageIcon className="mx-auto text-muted-foreground" size={32} />
                            <p className="text-sm text-muted-foreground font-medium">
                              {isRtl ? "اضغط لرفع الملف" : "Click to upload file"}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-dashed">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-xl font-black text-primary">{isRtl ? "الإجمالي" : "Total"}</span>
                      <span className="text-3xl font-black text-secondary">{totalCost} {isRtl ? "دينار" : "JOD"}</span>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-8 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span>{isRtl ? "جاري الإرسال..." : "Sending..."}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={24} />
                          <span>{isRtl ? "تأكيد الحجز الآن" : "Confirm Booking Now"}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FingerprintBooking;
