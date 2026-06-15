-- Migration: Add RLS policies for tables missing fine-grained access rules
-- Adds sensible Row Level Security policies for services, service_types,
-- providers (update/delete), countries, visas, and resources (mutations).

-- SERVICES
alter table if exists public.services enable row level security;

-- Public read access for services (browsing)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'Public can read services') then
    execute $pol$
      create policy "Public can read services"
        on public.services for select
        using (true);
    $pol$;
  end if;
end$$;

-- Providers (owners/admins) can create services for their provider
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'Provider members can insert services for their provider') then
    execute $pol$
      create policy "Provider members can insert services for their provider"
        on public.services for insert
        with check (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = provider_id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        );
    $pol$;
  end if;
end$$;

-- Provider members (owner/admin) can update/delete services belonging to their provider
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'Provider members can manage services for their provider (update)') then
    execute $pol$
      create policy "Provider members can manage services for their provider (update)"
        on public.services for update
        using (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = public.services.provider_id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        )
        with check (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = public.services.provider_id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        );
    $pol$;
  end if;

  if not exists (select 1 from pg_policies where tablename = 'services' and policyname = 'Provider members can manage services for their provider (delete)') then
    execute $pol$
      create policy "Provider members can manage services for their provider (delete)"
        on public.services for delete
        using (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = public.services.provider_id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        );
    $pol$;
  end if;
end$$;


-- SERVICE TYPES
alter table if exists public.service_types enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_types' and policyname = 'Public can read service_types') then
    execute $pol$
      create policy "Public can read service_types"
        on public.service_types for select
        using (true);
    $pol$;
  end if;
end$$;

-- Allow only the DB service role to modify service types (managed by server/admin)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_types' and policyname = 'Service role can insert service_types') then
    execute $pol$
      create policy "Service role can insert service_types"
        on public.service_types for insert
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_types' and policyname = 'Service role can update service_types') then
    execute $pol$
      create policy "Service role can update service_types"
        on public.service_types for update
        using (current_user = 'service_role')
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_types' and policyname = 'Service role can delete service_types') then
    execute $pol$
      create policy "Service role can delete service_types"
        on public.service_types for delete
        using (current_user = 'service_role');
    $pol$;
  end if;
end$$;


-- PROVIDERS (mutations)
alter table if exists public.providers enable row level security;

-- Allow provider members (owner/admin) to update providers they belong to
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'providers' and policyname = 'Provider members can update providers') then
    execute $pol$
      create policy "Provider members can update providers"
        on public.providers for update
        using (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = public.providers.id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        )
        with check (
          exists (
            select 1 from public.provider_members pm
            where pm.provider_id = public.providers.id
              and pm.user_id = auth.uid()
              and pm.role in ('owner','admin')
          )
          or current_user = 'service_role'
        );
    $pol$;
  end if;
end$$;

-- Deleting providers should be restricted to the DB service role (admins)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'providers' and policyname = 'Service role can delete providers') then
    execute $pol$
      create policy "Service role can delete providers"
        on public.providers for delete
        using (current_user = 'service_role');
    $pol$;
  end if;
end$$;


-- COUNTRIES & VISAS (readable, mutations by admin/service_role)
alter table if exists public.countries enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'countries' and policyname = 'Public can read countries') then
    execute $pol$
      create policy "Public can read countries"
        on public.countries for select
        using (true);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'countries' and policyname = 'Service role can insert countries') then
    execute $pol$
      create policy "Service role can insert countries"
        on public.countries for insert
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'countries' and policyname = 'Service role can update countries') then
    execute $pol$
      create policy "Service role can update countries"
        on public.countries for update
        using (current_user = 'service_role')
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'countries' and policyname = 'Service role can delete countries') then
    execute $pol$
      create policy "Service role can delete countries"
        on public.countries for delete
        using (current_user = 'service_role');
    $pol$;
  end if;
end$$;

alter table if exists public.visas enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visas' and policyname = 'Public can read visas') then
    execute $pol$
      create policy "Public can read visas"
        on public.visas for select
        using (true);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visas' and policyname = 'Service role can insert visas') then
    execute $pol$
      create policy "Service role can insert visas"
        on public.visas for insert
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visas' and policyname = 'Service role can update visas') then
    execute $pol$
      create policy "Service role can update visas"
        on public.visas for update
        using (current_user = 'service_role')
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'visas' and policyname = 'Service role can delete visas') then
    execute $pol$
      create policy "Service role can delete visas"
        on public.visas for delete
        using (current_user = 'service_role');
    $pol$;
  end if;
end$$;


-- RESOURCES: allow public read (already present) but restrict mutations to service_role
alter table if exists public.resources enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'resources' and policyname = 'Service role can insert resources') then
    execute $pol$
      create policy "Service role can insert resources"
        on public.resources for insert
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'resources' and policyname = 'Service role can update resources') then
    execute $pol$
      create policy "Service role can update resources"
        on public.resources for update
        using (current_user = 'service_role')
        with check (current_user = 'service_role');
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'resources' and policyname = 'Service role can delete resources') then
    execute $pol$
      create policy "Service role can delete resources"
        on public.resources for delete
        using (current_user = 'service_role');
    $pol$;
  end if;
end$$;

-- End of migration
