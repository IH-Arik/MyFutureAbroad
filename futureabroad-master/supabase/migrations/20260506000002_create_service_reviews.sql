-- Migration: create service_reviews table for client reviews on services
begin;

-- ==============================
-- SERVICE REVIEWS
-- ==============================
create table if not exists public.service_reviews (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references public.services(id) on delete cascade,
  provider_id  uuid not null references public.providers(id) on delete cascade,
  client_id    uuid not null references public.profiles(id) on delete cascade,
  rating       integer not null check (rating >= 1 and rating <= 5),
  body         text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  -- One review per client per service
  unique(service_id, client_id)
);

-- Indexes
create index if not exists idx_service_reviews_service on public.service_reviews (service_id);
create index if not exists idx_service_reviews_provider on public.service_reviews (provider_id);
create index if not exists idx_service_reviews_client on public.service_reviews (client_id);

-- Grants
grant select, insert, update, delete on public.service_reviews to anon;

-- ==============================
-- RLS
-- ==============================
alter table public.service_reviews enable row level security;

-- Anyone can read reviews (public)
create policy "Anyone can view reviews"
  on public.service_reviews for select
  using (true);

-- Authenticated users can insert their own reviews
create policy "Users can insert own reviews"
  on public.service_reviews for insert
  with check (auth.uid() = client_id);

-- Users can update their own reviews
create policy "Users can update own reviews"
  on public.service_reviews for update
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- Users can delete their own reviews
create policy "Users can delete own reviews"
  on public.service_reviews for delete
  using (auth.uid() = client_id);

-- ==============================
-- FUNCTION: Update provider rating
-- ==============================
create or replace function public.update_provider_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider_id uuid;
begin
  -- Determine which provider to update
  if tg_op = 'DELETE' then
    v_provider_id := old.provider_id;
  else
    v_provider_id := new.provider_id;
  end if;

  -- Update the provider's rating and review_count based on all their service reviews
  update public.providers
  set
    rating = coalesce(
      (select round(avg(rating)::numeric, 2) from public.service_reviews where provider_id = v_provider_id),
      0
    ),
    review_count = (
      select count(*) from public.service_reviews where provider_id = v_provider_id
    ),
    updated_at = now()
  where id = v_provider_id;

  return coalesce(new, old);
end;
$$;

-- Triggers to keep provider rating in sync
create trigger trg_service_reviews_aiud
  after insert or update or delete on public.service_reviews
  for each row execute function public.update_provider_rating();

-- ==============================
-- Allow reading reviewer profiles
-- Anyone can see profiles of users who have written reviews
-- ==============================
create policy "Anyone can view reviewer profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.service_reviews
      where service_reviews.client_id = profiles.id
    )
  );

commit;
