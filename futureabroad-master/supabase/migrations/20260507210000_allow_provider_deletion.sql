-- Fix: allow provider deletion by making orders.provider_id nullable
-- and changing the FK from RESTRICT to SET NULL.
-- This preserves order records (financial audit trail) while allowing
-- provider accounts to be deleted.
ALTER TABLE public.orders
  ALTER COLUMN provider_id DROP NOT NULL;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_provider_id_fkey;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_provider_id_fkey
  FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE SET NULL;
