-- Quick fix: add missing columns and tables that STEP04 needs
-- Run this BEFORE re-running STEP04_chunk.sql

-- 1. Add join_code column to providers
ALTER TABLE public.providers
  ADD COLUMN IF NOT EXISTS join_code text UNIQUE;

-- 2. Auto-generate join codes on insert
CREATE OR REPLACE FUNCTION public.generate_provider_join_code()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_provider_join_code ON public.providers;
CREATE TRIGGER set_provider_join_code
  BEFORE INSERT ON public.providers
  FOR EACH ROW EXECUTE PROCEDURE public.generate_provider_join_code();

-- 3. Create provider_members table (needed for join codes)
CREATE TABLE IF NOT EXISTS public.provider_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, provider_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_members TO anon, authenticated, service_role;
