-- Alter the existing message_threads.client_id FK from auth.users -> profiles.
-- profiles.id already FKs to auth.users.id, so the constraint chain is maintained
-- and on delete cascade propagates properly. PostgREST will then be able to resolve
-- the join for provider-facing queries.

begin;

alter table public.message_threads
  drop constraint if exists message_threads_client_id_fkey,
  add constraint message_threads_client_id_fkey
    foreign key (client_id) references public.profiles(id) on delete cascade;

commit;
