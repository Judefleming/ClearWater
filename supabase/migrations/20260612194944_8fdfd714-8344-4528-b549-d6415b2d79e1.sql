REVOKE SELECT, UPDATE ON public.access_codes FROM anon, authenticated;
DROP POLICY IF EXISTS "access_codes_read" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_claim" ON public.access_codes;

DROP POLICY IF EXISTS "docs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "docs_update_own" ON storage.objects;
DROP POLICY IF EXISTS "docs_delete_own" ON storage.objects;

CREATE POLICY "docs_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'customer-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "docs_update_own" ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'customer-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'customer-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "docs_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'customer-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);