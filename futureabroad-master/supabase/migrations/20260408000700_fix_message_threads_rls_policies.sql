-- Migration: Fix message_threads and messages RLS policies to use provider_members
-- Previously these policies checked the legacy profile.provider_id field.
-- Now they properly check the provider_members table for multi-provider support.

-- Drop the old provider policy for message_threads
drop policy if exists "Providers see their threads" on public.message_threads;

-- Create improved provider policy that checks provider_members table
create policy "Providers see their threads (via provider_members)"
  on public.message_threads for select
  using (
    exists (
      select 1 from public.provider_members pm
      where pm.user_id = auth.uid()
        and pm.provider_id = public.message_threads.provider_id
    )
  );

-- Drop the old policy for messages table
drop policy if exists "Thread participants can read messages" on public.messages;

-- Create improved messages policy that checks provider_members
create policy "Thread participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = public.messages.thread_id
        and (
          t.client_id = auth.uid()
          or exists (
            select 1 from public.provider_members pm
            where pm.user_id = auth.uid()
              and pm.provider_id = t.provider_id
          )
        )
    )
  );

-- Drop the old insert policy for messages
drop policy if exists "Thread participants can send messages" on public.messages;

-- Create improved insert policy
create policy "Thread participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.message_threads t
      where t.id = public.messages.thread_id
        and (
          t.client_id = auth.uid()
          or exists (
            select 1 from public.provider_members pm
            where pm.user_id = auth.uid()
              and pm.provider_id = t.provider_id
          )
        )
    )
  );
