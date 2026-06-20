ALTER TABLE public.warranty_claims
  ADD COLUMN IF NOT EXISTS request_type text NOT NULL DEFAULT 'claim',
  ADD COLUMN IF NOT EXISTS preferred_time text;