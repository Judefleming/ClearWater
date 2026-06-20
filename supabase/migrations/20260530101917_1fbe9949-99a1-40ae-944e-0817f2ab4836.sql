
-- Enums
CREATE TYPE public.package_type AS ENUM ('Standard', 'Premium');
CREATE TYPE public.salt_request_status AS ENUM ('Requested', 'Confirmed', 'Delivered', 'Cancelled');
CREATE TYPE public.warranty_claim_status AS ENUM ('Submitted', 'In Review', 'Approved', 'Resolved', 'Rejected');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  package_type public.package_type DEFAULT 'Standard',
  unit_model TEXT,
  install_date DATE,
  on_salt_plan BOOLEAN DEFAULT false,
  next_salt_delivery DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Access codes
CREATE TABLE public.access_codes (
  code TEXT PRIMARY KEY,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  package_type public.package_type DEFAULT 'Standard',
  unit_model TEXT,
  install_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.access_codes TO anon, authenticated;
GRANT UPDATE ON public.access_codes TO authenticated;
GRANT ALL ON public.access_codes TO service_role;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_codes_read" ON public.access_codes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "access_codes_claim" ON public.access_codes FOR UPDATE TO authenticated USING (used_by IS NULL OR used_by = auth.uid());

-- Salt requests
CREATE TABLE public.salt_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  salt_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  preferred_delivery TEXT NOT NULL,
  notes TEXT,
  status public.salt_request_status NOT NULL DEFAULT 'Requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.salt_requests TO authenticated;
GRANT ALL ON public.salt_requests TO service_role;
ALTER TABLE public.salt_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "salt_requests_select_own" ON public.salt_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "salt_requests_insert_own" ON public.salt_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Warranty claims
CREATE TABLE public.warranty_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Normal',
  status public.warranty_claim_status NOT NULL DEFAULT 'Submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.warranty_claims TO authenticated;
GRANT ALL ON public.warranty_claims TO service_role;
ALTER TABLE public.warranty_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY warranty_claims_select_own ON public.warranty_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY warranty_claims_insert_own ON public.warranty_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, address, package_type, unit_model, install_date)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    COALESCE((NEW.raw_user_meta_data->>'package_type')::public.package_type, 'Standard'),
    NEW.raw_user_meta_data->>'unit_model',
    NULLIF(NEW.raw_user_meta_data->>'install_date','')::date
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Private storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Customers read their own folder (userId/...) plus shared folder (_shared/...)
CREATE POLICY "docs_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'customer-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR (storage.foldername(name))[1] = '_shared'
    )
  );

-- Seed demo access code
INSERT INTO public.access_codes (code, first_name, last_name, email, phone, address, package_type, unit_model, install_date)
VALUES ('CW-DEMO-2026', 'Demo', 'Customer', 'demo@example.com', '0871234567', '1 Demo Street, Dublin', 'Premium', 'ClearWater All-in-One Premium', CURRENT_DATE - INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;
