-- Allow providers to view client profiles when they're in a shared message thread
-- This is needed for the provider dashboard to display client names

-- Policy: Providers can view profiles of clients they have message threads with
create policy "Providers can view client profiles in their threads"
  on public.profiles for select
  using (
    -- Check if requesting user is a provider member of a thread's provider and this is the client
    exists (
      select 1 from public.message_threads mt
      join public.provider_members pm on pm.provider_id = mt.provider_id
      where pm.user_id = auth.uid() and mt.client_id = profiles.id
    )
  );

-- Policy: Clients can view profiles of providers they have message threads with
create policy "Clients can view provider profiles in their threads"
  on public.profiles for select
  using (
    -- Check if requesting user is a client with a message thread to a provider user
    exists (
      select 1 from public.message_threads mt
      join public.provider_members pm on pm.provider_id = mt.provider_id
      where mt.client_id = auth.uid() and pm.user_id = profiles.id
    )
  );
