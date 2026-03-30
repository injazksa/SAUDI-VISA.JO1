import { createClient } from "@supabase/supabase-js";

// تم تحديث المفاتيح يدوياً لضمان عمل الموقع فوراً بعد نقل الاستضافة
const supabaseUrl = "https://afnbvdbgartnjewhycgl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbmJ2ZGJnYXJ0bmpld2h5Y2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTg3MDksImV4cCI6MjA5MDE5NDcwOX0._ZgiIonejFQiVnit98CsHWnQJD7oAFOWnPLEUCmpvtY";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing! Check Netlify Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Last Update: Mon Mar 30 04:35:07 EDT 2026
