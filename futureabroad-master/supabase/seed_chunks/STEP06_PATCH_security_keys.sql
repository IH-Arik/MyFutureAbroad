-- Fix: create provider_security_keys table and insert test keys
-- (This was the only thing that failed at the end of STEP06)

CREATE TABLE IF NOT EXISTS public.provider_security_keys (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  description text,
  active      boolean DEFAULT true,
  used_by     uuid REFERENCES public.providers(id),
  used_at     timestamptz,
  created_at  timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_security_keys TO anon, authenticated, service_role;

-- Insert the test keys
INSERT INTO provider_security_keys (key, description, active)
VALUES
  ('TEST001', 'Test security key 1', true),
  ('TEST002', 'Test security key 2', true),
  ('DEMO001', 'Demo security key', true)
ON CONFLICT (key) DO NOTHING;
