-- ============================================================
-- SIGNUP FIX: Run this in Supabase Dashboard → SQL Editor
-- Fixes "Database error saving new user" on account creation
-- Safe to run multiple times (idempotent)
-- ============================================================

-- Step 1: Ensure profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'provider')),
  provider_id  uuid REFERENCES public.providers(id) ON DELETE SET NULL,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Step 2: Drop date_of_birth column if it was added by an old migration and not removed
ALTER TABLE public.profiles DROP COLUMN IF EXISTS date_of_birth;

-- Step 3: Replace handle_new_user() with the latest version
-- Captures full_name and role from auth metadata, sanitises role value
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _role text;
  _full_name text;
BEGIN
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  -- Sanitise role — only allow known values
  IF _role NOT IN ('client', 'provider') THEN
    _role := 'client';
  END IF;

  _full_name := NEW.raw_user_meta_data->>'full_name';

  INSERT INTO public.profiles (id, role, full_name)
  VALUES (NEW.id, _role, _full_name)
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        role      = EXCLUDED.role,
        updated_at = now();

  RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger (drop first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 5: Enable RLS on profiles (safe if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Ensure all required RLS policies exist
DO $$
BEGIN
  -- SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- INSERT (this one is often missing and causes the error)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Step 7: Verify — check the trigger exists and function is correct
SELECT
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth'
  AND trigger_name = 'on_auth_user_created';
