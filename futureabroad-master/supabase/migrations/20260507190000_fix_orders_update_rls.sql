-- Fix: orders UPDATE RLS policy was never updated to use provider_members.
-- The SELECT policy was fixed in 20260408000800 but UPDATE still checks
-- only the legacy profiles.provider_id column.
DROP POLICY IF EXISTS "Providers can update order status" ON public.orders;

CREATE POLICY "Providers can update order status"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.provider_members pm
      WHERE pm.user_id = auth.uid()
        AND pm.provider_id = public.orders.provider_id
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.provider_id = public.orders.provider_id
    )
  );
