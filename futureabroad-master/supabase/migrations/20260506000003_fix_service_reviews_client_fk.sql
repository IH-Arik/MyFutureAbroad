-- Fix: Change service_reviews.client_id FK from auth.users to profiles
-- PostgREST needs a FK relationship to public.profiles to resolve
-- the `profile:profiles!client_id` join used in ServiceReviews.tsx.
-- profiles.id is already a FK to auth.users.id, so this is equivalent.

begin;

alter table public.service_reviews
  drop constraint service_reviews_client_id_fkey,
  add constraint service_reviews_client_id_fkey
    foreign key (client_id) references public.profiles(id) on delete cascade;

commit;
