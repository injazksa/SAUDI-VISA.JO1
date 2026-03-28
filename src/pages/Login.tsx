import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const Login: React.FC = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';
  const isRtl = i18n.language === 'ar';

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
    email: '',
    password: '',
  },
});

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const { error } = isLogin 
      ? await signInWithEmail(values.email, values.password)
      : await signUpWithEmail(values.email, values.password);

    if (error) {
      toast.error(error.message);
      alert('خطأ في تسجيل الدخول: ' + error.message);
    } else {
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      alert('تم تسجيل الدخول بنجاح! جاري التحقق من صلاحياتك...');
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-background rounded-2xl p-8 md:p-12 shadow-2xl border"
      >
        <div className="text-center mb-8 space-y-4">
           <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
             <ShieldCheck size={40} />
           </div>
           <h2 className="text-3xl font-bold text-primary">
             {isLogin ? t('common.login') : "Create Admin Account"}
           </h2>
           <p className="text-muted-foreground">
             {isLogin 
               ? "Access the admin dashboard to manage your content." 
               : "Sign up to become an administrator."
             }
           </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{t('common.email')}</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Lock size={16} className="text-muted-foreground" />
                    <span>{t('common.password')}</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full text-lg py-6 font-bold">
              {loading ? t('common.loading') : (isLogin ? t('common.login') : "Sign Up")}
            </Button>
          </form>
        </Form>

        <div className="mt-8 pt-6 border-t text-center space-y-4">
           <p className="text-sm text-muted-foreground">
             {isLogin ? "Don't have an account?" : "Already have an account?"}
             <button 
               onClick={() => setIsLogin(!isLogin)} 
               className="text-primary font-bold hover:underline ml-2"
             >
               {isLogin ? "Sign Up" : t('common.login')}
             </button>
           </p>
           <Link to="/" className="text-sm text-primary flex items-center justify-center space-x-2 rtl:space-x-reverse hover:underline">
             {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
             <span>Back to Home</span>
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
