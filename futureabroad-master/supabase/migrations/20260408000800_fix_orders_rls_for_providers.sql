-- Migration: Fix orders RLS policy to use provider_members table
-- The existing provider RLS policy only checked profile.provider_id (legacy single-provider system)
-- Now we also check provider_members table for multi-provider support

-- Drop the old provider policy
drop policy if exists "Providers see orders for their provider" on public.orders;

-- Create improved provider policy that checks both provider_members and legacy profile.provider_id
create policy "Providers see orders for their provider (updated)"
  on public.orders for select
  using (
    -- Check if provider is a member of this order's provider via provider_members table
    exists (
      select 1 from public.provider_members pm
      where pm.user_id = auth.uid()
        and pm.provider_id = public.orders.provider_id
    )
    -- OR check legacy profile.provider_id (fallback for old accounts)
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.provider_id = public.orders.provider_id
    )
  );
