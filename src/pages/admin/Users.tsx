import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("خطأ في جلب المستخدمين");
    else setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateRole = async (id: string, role: 'admin' | 'user') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);
    
    if (error) toast.error("فشل تحديث الصلاحية");
    else {
      toast.success("تم تحديث الصلاحية بنجاح");
      fetchProfiles();
    }
  };

  const changeMyPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون ٦ أحرف على الأقل");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("فشل تغيير كلمة المرور: " + error.message);
    else {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setIsPasswordModalOpen(false);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary flex items-center gap-4">
            <Users size={40} className="text-secondary" />
            <span>إدارة المستخدمين</span>
          </h1>
          <p className="text-muted-foreground mt-2">عرض وإدارة صلاحيات المشرفين</p>
        </div>
        <div className="flex gap-4">
           <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="border-2 border-primary text-primary font-bold rounded-2xl h-14 px-6">
              <Key className="ml-2" size={20} />
              تغيير كلمة مروري
           </Button>
           <Button className="bg-primary text-white font-bold rounded-2xl h-14 px-6" onClick={() => toast.info("لإضافة مستخدم جديد، يرجى استخدامه للتسجيل أولاً ثم قم بترقيته لمدير من هنا.")}>
              <UserPlus className="ml-2" size={20} />
              إضافة مستخدم جديد
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-right font-black py-6 px-8">البريد الإلكتروني</TableHead>
              <TableHead className="text-right font-black py-6 px-8">الصلاحية</TableHead>
              <TableHead className="text-right font-black py-6 px-8">تاريخ التسجيل</TableHead>
              <TableHead className="text-left font-black py-6 px-8">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold text-muted-foreground">جاري التحميل...</TableCell></TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-bold text-primary py-6 px-8">{profile.email}</TableCell>
                  <TableCell className="py-6 px-8">
                     <div className="flex items-center gap-2">
                        {profile.role === 'admin' ? <Shield size={16} className="text-secondary" /> : null}
                        <span className={profile.role === 'admin' ? "font-black text-secondary" : "text-muted-foreground"}>
                           {profile.role === 'admin' ? "مدير نظام" : "مستخدم عادي"}
                        </span>
                     </div>
                  </TableCell>
                  <TableCell className="py-6 px-8 text-muted-foreground">{new Date(profile.created_at).toLocaleDateString('ar-JO')}</TableCell>
                  <TableCell className="py-6 px-8 text-left">
                    <Select 
                      defaultValue={profile.role} 
                      onValueChange={(val) => updateRole(profile.id, val as any)}
                    >
                       <SelectTrigger className="w-32 rounded-xl">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="admin">مدير نظام</SelectItem>
                          <SelectItem value="user">مستخدم عادي</SelectItem>
                       </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[400px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary">تغيير كلمة المرور</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
             <div className="space-y-2">
                <label className="text-sm font-bold">كلمة المرور الجديدة</label>
                <Input 
                  type="password" 
                  className="rounded-xl h-12" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
             </div>
             <Button onClick={changeMyPassword} className="w-full bg-primary font-bold py-6 rounded-xl">تحديث الآن</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
