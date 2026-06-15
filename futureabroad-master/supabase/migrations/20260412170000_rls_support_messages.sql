-- Disable client access to support_messages
-- Enable Row Level Security and add explicit deny-all policies.
-- The Supabase service role (service key) bypasses RLS, so only server-side code
-- using the service key will be able to read/write this table.

BEGIN;

-- Turn on RLS for the table
ALTER TABLE IF EXISTS public.support_messages
  ENABLE ROW LEVEL SECURITY;

-- Explicit deny policies for all operations (always false)
-- Drop existing policies if present, then create them (CREATE POLICY doesn't support IF NOT EXISTS)
DROP POLICY IF EXISTS deny_select_on_support_messages ON public.support_messages;
CREATE POLICY deny_select_on_support_messages
  ON public.support_messages
  FOR SELECT
  USING (false);

DROP POLICY IF EXISTS deny_insert_on_support_messages ON public.support_messages;
CREATE POLICY deny_insert_on_support_messages
  ON public.support_messages
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS deny_update_on_support_messages ON public.support_messages;
CREATE POLICY deny_update_on_support_messages
  ON public.support_messages
  FOR UPDATE
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS deny_delete_on_support_messages ON public.support_messages;
CREATE POLICY deny_delete_on_support_messages
  ON public.support_messages
  FOR DELETE
  USING (false);

COMMIT;
