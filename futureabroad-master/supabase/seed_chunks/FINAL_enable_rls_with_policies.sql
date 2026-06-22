-- FINAL: Enable RLS with proper public read policies
-- Run this instead of (or after) 99_FINAL_enable_rls.sql

-- ── COUNTRIES ────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.countries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read countries" ON public.countries;
CREATE POLICY "Public can read countries"
  ON public.countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can insert countries" ON public.countries;
CREATE POLICY "Service role can insert countries"
  ON public.countries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update countries" ON public.countries;
CREATE POLICY "Service role can update countries"
  ON public.countries FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can delete countries" ON public.countries;
CREATE POLICY "Service role can delete countries"
  ON public.countries FOR DELETE USING (true);

-- ── VISAS ────────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.visas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read visas" ON public.visas;
CREATE POLICY "Public can read visas"
  ON public.visas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can insert visas" ON public.visas;
CREATE POLICY "Service role can insert visas"
  ON public.visas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update visas" ON public.visas;
CREATE POLICY "Service role can update visas"
  ON public.visas FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can delete visas" ON public.visas;
CREATE POLICY "Service role can delete visas"
  ON public.visas FOR DELETE USING (true);

-- ── RESOURCES ────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.resources;
CREATE POLICY "Enable read access for all users"
  ON public.resources FOR SELECT USING (true);

-- ── SERVICES ────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read services" ON public.services;
CREATE POLICY "Public can read services"
  ON public.services FOR SELECT USING (true);

-- ── SERVICE COUNTRIES ────────────────────────────────────────
ALTER TABLE IF EXISTS public.service_countries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read service_countries" ON public.service_countries;
CREATE POLICY "Public can read service_countries"
  ON public.service_countries FOR SELECT USING (true);

-- ── SERVICE TYPES ────────────────────────────────────────────
ALTER TABLE IF EXISTS public.service_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read service_types" ON public.service_types;
CREATE POLICY "Public can read service_types"
  ON public.service_types FOR SELECT USING (true);

-- ── PROVIDERS ────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read providers" ON public.providers;
CREATE POLICY "Public can read providers"
  ON public.providers FOR SELECT USING (true);
