CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  full_name text,
  email text,
  phone text,
  address text,
  message text,
  details jsonb,
  user_id uuid,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.enquiries TO authenticated;
GRANT INSERT ON public.enquiries TO anon;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY enquiries_insert_anyone ON public.enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY enquiries_select_own ON public.enquiries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX enquiries_created_at_idx ON public.enquiries (created_at DESC);
CREATE INDEX enquiries_type_idx ON public.enquiries (type);
