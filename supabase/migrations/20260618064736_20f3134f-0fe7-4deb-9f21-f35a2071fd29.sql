
-- Explicit deny for anon on access_codes (defense in depth)
CREATE POLICY access_codes_no_anon_access ON public.access_codes
  AS RESTRICTIVE FOR ALL TO anon USING (false) WITH CHECK (false);

-- Explicit deny SELECT for anon on enquiries
CREATE POLICY enquiries_no_anon_select ON public.enquiries
  FOR SELECT TO anon USING (false);

-- Tighten enquiries insert: authenticated users must insert their own user_id; anon may insert with NULL user_id
DROP POLICY IF EXISTS enquiries_insert_anyone ON public.enquiries;
CREATE POLICY enquiries_insert_anon ON public.enquiries
  FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY enquiries_insert_authenticated ON public.enquiries
  FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
