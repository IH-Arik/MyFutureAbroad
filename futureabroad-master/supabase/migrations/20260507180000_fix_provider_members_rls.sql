-- Fix: make provider_members readable by all authenticated users.
-- This table only maps users→providers (no sensitive data) and is
-- referenced in RLS subqueries for documents, storage, threads, and
-- the shareDocument function. Without this, clients can never see
-- provider member rows, breaking:
--   1. Storage RLS (createSignedUrl returns 404)
--   2. Documents RLS (queries return 0 rows)
--   3. shareDocument (can't find recipient provider member)
DROP POLICY IF EXISTS "Members can view own memberships" ON public.provider_members;

CREATE POLICY "Authenticated users can view provider memberships"
  ON public.provider_members FOR SELECT
  TO authenticated
  USING (true);
