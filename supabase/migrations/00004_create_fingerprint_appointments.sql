-- Create fingerprint_appointments table
CREATE TABLE IF NOT EXISTS public.fingerprint_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_type text NOT NULL,
  nationality text NOT NULL,
  people_count int NOT NULL,
  total_cost numeric NOT NULL,
  phone_number text NOT NULL,
  email text,
  visa_document_url text,
  status text DEFAULT 'new',
  ref_id text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fingerprint_appointments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert new appointments
CREATE POLICY "Enable insert for all users" ON public.fingerprint_appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow admins to manage all appointments
CREATE POLICY "Admins can manage appointments" ON public.fingerprint_appointments
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()));

-- Storage policy for uploading images to the bucket
-- Note: The bucket 'saudiavisa_images' is already created in 00001_init_schema.sql
-- We need to ensure anon users can upload if they are submitting the form

CREATE POLICY "Enable upload for anon users" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'htxlsrmyyxwjnlmwzfct_saudiavisa_images');
