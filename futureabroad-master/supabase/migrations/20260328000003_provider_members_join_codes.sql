-- ============================================================
-- PROVIDER MEMBERS
-- Many-to-many between auth users and providers.
-- A provider account user can manage multiple providers.
-- ============================================================
create table if not exists public.provider_members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at   timestamptz default now(),
  unique (user_id, provider_id)
);

alter table public.provider_members enable row level security;

-- Users can see their own memberships
create policy "Members can view own memberships"
  on public.provider_members for select
  using (auth.uid() = user_id);

-- Members can insert their own membership (used when joining via code)
create policy "Members can insert own membership"
  on public.provider_members for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Add join_code to providers
-- ============================================================
alter table public.providers
  add column if not exists join_code text unique;

-- Generate a random 8-char alphanumeric join code for existing rows
update public.providers
  set join_code = upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  where join_code is null;

-- Function to auto-generate join_code on insert
create or replace function public.generate_provider_join_code()
returns trigger language plpgsql as $$
begin
  if new.join_code is null then
    new.join_code := upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists set_provider_join_code on public.providers;
create trigger set_provider_join_code
  before insert on public.providers
  for each row execute procedure public.generate_provider_join_code();

-- Allow provider members to read providers they belong to
-- (add a select policy if not already present)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'providers' and policyname = 'Members can view their providers'
  ) then
    execute $pol$
      create policy "Members can view their providers"
        on public.providers for select
        using (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = providers.id and pm.user_id = auth.uid()
          )
          or true  -- providers are also publicly readable for browsing
        )
    $pol$;
  end if;
end $$;

-- Allow provider accounts to insert new providers
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'providers' and policyname = 'Provider accounts can create providers'
  ) then
    execute $pol$
      create policy "Provider accounts can create providers"
        on public.providers for insert
        with check (
          exists (
            select 1 from public.profiles
            where profiles.id = auth.uid() and profiles.role = 'provider'
          )
        )
    $pol$;
  end if;
end $$;
-- ============================================================
-- Auto-create owner membership when a provider is inserted
-- ============================================================
create or replace function public.handle_new_provider()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  _uid uuid;
begin
  _uid := auth.uid();
  if _uid is null then
    return new;
  end if;
  insert into public.provider_members (user_id, provider_id, role)
  values (_uid, new.id, 'owner')
  on conflict (user_id, provider_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_provider_created on public.providers;
create trigger on_provider_created
  after insert on public.providers
  for each row execute procedure public.handle_new_provider();