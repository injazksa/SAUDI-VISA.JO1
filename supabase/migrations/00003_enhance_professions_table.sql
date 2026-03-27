ALTER TABLE public.professions 
ADD COLUMN category_ar text,
ADD COLUMN category_en text,
ADD COLUMN documents jsonb DEFAULT '[]'::jsonb;

-- Update types/schema if needed
COMMENT ON COLUMN public.professions.documents IS 'Array of required document names/descriptions';
