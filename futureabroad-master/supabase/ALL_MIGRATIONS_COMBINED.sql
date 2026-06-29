-- ============================================================
-- Migration: 20260314231326_create_countries_visa_tables.sql
-- ============================================================
create sequence "public"."countries_id_seq";

create sequence "public"."visas_id_seq";


  create table "public"."countries" (
    "id" integer not null default nextval('public.countries_id_seq'::regclass),
    "continent" text not null,
    "name" text not null,
    "iso_code" character(2),
    "flag_url" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."visas" (
    "id" integer not null default nextval('public.visas_id_seq'::regclass),
    "name" text not null,
    "country_id" integer,
    "visa_type" text,
    "description" text,
    "benefits" text[],
    "min_age" integer,
    "max_age" integer,
    "min_income" numeric(14,2),
    "min_income_currency" text,
    "min_savings" numeric(14,2),
    "min_savings_currency" text,
    "required_skills" text[],
    "eligible_nationalities" text[],
    "excluded_nationalities" text[],
    "requires_health_insurance" boolean default false,
    "requires_clean_criminal_record" boolean default false,
    "processing_time_days" integer,
    "validity_months" integer,
    "renewable" boolean default false,
    "path_to_residency" text,
    "application_fee_usd" numeric(12,2),
    "application_fee_currency" text,
    "required_documents" text[],
    "official_link" text,
    "image_url" text,
    "additional_info" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter sequence "public"."countries_id_seq" owned by "public"."countries"."id";

alter sequence "public"."visas_id_seq" owned by "public"."visas"."id";

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

CREATE UNIQUE INDEX idx_countries_name ON public.countries USING btree (name);

CREATE INDEX idx_visas_country ON public.visas USING btree (country_id);

CREATE INDEX idx_visas_name ON public.visas USING btree (name);

CREATE UNIQUE INDEX visas_pkey ON public.visas USING btree (id);

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

alter table "public"."visas" add constraint "visas_pkey" PRIMARY KEY using index "visas_pkey";

alter table "public"."visas" add constraint "visas_country_id_fkey" FOREIGN KEY (country_id) REFERENCES public.countries(id) not valid;

alter table "public"."visas" validate constraint "visas_country_id_fkey";

grant delete on table "public"."countries" to "anon";

grant insert on table "public"."countries" to "anon";

grant references on table "public"."countries" to "anon";

grant select on table "public"."countries" to "anon";

grant trigger on table "public"."countries" to "anon";

grant truncate on table "public"."countries" to "anon";

grant update on table "public"."countries" to "anon";

grant delete on table "public"."countries" to "authenticated";

grant insert on table "public"."countries" to "authenticated";

grant references on table "public"."countries" to "authenticated";

grant select on table "public"."countries" to "authenticated";

grant trigger on table "public"."countries" to "authenticated";

grant truncate on table "public"."countries" to "authenticated";

grant update on table "public"."countries" to "authenticated";

grant delete on table "public"."countries" to "service_role";

grant insert on table "public"."countries" to "service_role";

grant references on table "public"."countries" to "service_role";

grant select on table "public"."countries" to "service_role";

grant trigger on table "public"."countries" to "service_role";

grant truncate on table "public"."countries" to "service_role";

grant update on table "public"."countries" to "service_role";

grant delete on table "public"."visas" to "anon";

grant insert on table "public"."visas" to "anon";

grant references on table "public"."visas" to "anon";

grant select on table "public"."visas" to "anon";

grant trigger on table "public"."visas" to "anon";

grant truncate on table "public"."visas" to "anon";

grant update on table "public"."visas" to "anon";

grant delete on table "public"."visas" to "authenticated";

grant insert on table "public"."visas" to "authenticated";

grant references on table "public"."visas" to "authenticated";

grant select on table "public"."visas" to "authenticated";

grant trigger on table "public"."visas" to "authenticated";

grant truncate on table "public"."visas" to "authenticated";

grant update on table "public"."visas" to "authenticated";

grant delete on table "public"."visas" to "service_role";

grant insert on table "public"."visas" to "service_role";

grant references on table "public"."visas" to "service_role";

grant select on table "public"."visas" to "service_role";

grant trigger on table "public"."visas" to "service_role";

grant truncate on table "public"."visas" to "service_role";

grant update on table "public"."visas" to "service_role";




-- ============================================================
-- Migration: 20260314234411_create_highlight_img_url_for_country.sql
-- ============================================================
alter table "public"."countries" add column "highlight_img_url" text;




-- ============================================================
-- Migration: 20260315002936_create_services.sql
-- ============================================================

  create table "public"."providers" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "company_name" text not null,
    "logo_url" text,
    "description" text,
    "provider_type" text,
    "countries_served" integer[],
    "languages" text[],
    "rating" numeric(3,2) default 0,
    "review_count" integer default 0,
    "verified" boolean default false,
    "response_time_hours" integer,
    "contact_email" text,
    "website" text,
    "status" text default 'active'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."service_types" (
    "id" text not null,
    "name" text not null,
    "icon" text,
    "tagline" text,
    "description" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."services" (
    "id" uuid not null default gen_random_uuid(),
    "provider_id" uuid not null,
    "title" text not null,
    "description" text,
    "service_type" text not null,
    "applicable_visas" integer[],
    "applicable_countries" integer[],
    "price_usd" numeric(12,2),
    "price_type" text,
    "delivery_days" integer,
    "includes" text[],
    "requirements" text[],
    "image_url" text,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


CREATE INDEX idx_providers_company_name ON public.providers USING btree (company_name);

CREATE INDEX idx_providers_type ON public.providers USING btree (provider_type);

CREATE INDEX idx_providers_verified ON public.providers USING btree (verified);

CREATE INDEX idx_services_price_usd ON public.services USING btree (price_usd);

CREATE INDEX idx_services_provider ON public.services USING btree (provider_id);

CREATE INDEX idx_services_type ON public.services USING btree (service_type);

CREATE UNIQUE INDEX providers_pkey ON public.providers USING btree (id);

CREATE UNIQUE INDEX service_types_pkey ON public.service_types USING btree (id);

CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id);

alter table "public"."providers" add constraint "providers_pkey" PRIMARY KEY using index "providers_pkey";

alter table "public"."service_types" add constraint "service_types_pkey" PRIMARY KEY using index "service_types_pkey";

alter table "public"."services" add constraint "services_pkey" PRIMARY KEY using index "services_pkey";

alter table "public"."providers" add constraint "providers_provider_type_check" CHECK ((provider_type = ANY (ARRAY['agency'::text, 'law_firm'::text, 'freelancer'::text, 'consultancy'::text]))) not valid;

alter table "public"."providers" validate constraint "providers_provider_type_check";

alter table "public"."providers" add constraint "providers_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'suspended'::text]))) not valid;

alter table "public"."providers" validate constraint "providers_status_check";

alter table "public"."services" add constraint "services_price_type_check" CHECK ((price_type = ANY (ARRAY['fixed'::text, 'starting_at'::text, 'hourly'::text]))) not valid;

alter table "public"."services" validate constraint "services_price_type_check";

alter table "public"."services" add constraint "services_price_usd_check" CHECK ((price_usd >= (0)::numeric)) not valid;

alter table "public"."services" validate constraint "services_price_usd_check";

alter table "public"."services" add constraint "services_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE CASCADE not valid;

alter table "public"."services" validate constraint "services_provider_id_fkey";

alter table "public"."services" add constraint "services_service_type_fkey" FOREIGN KEY (service_type) REFERENCES public.service_types(id) not valid;

alter table "public"."services" validate constraint "services_service_type_fkey";

grant delete on table "public"."providers" to "anon";

grant insert on table "public"."providers" to "anon";

grant references on table "public"."providers" to "anon";

grant select on table "public"."providers" to "anon";

grant trigger on table "public"."providers" to "anon";

grant truncate on table "public"."providers" to "anon";

grant update on table "public"."providers" to "anon";

grant delete on table "public"."providers" to "authenticated";

grant insert on table "public"."providers" to "authenticated";

grant references on table "public"."providers" to "authenticated";

grant select on table "public"."providers" to "authenticated";

grant trigger on table "public"."providers" to "authenticated";

grant truncate on table "public"."providers" to "authenticated";

grant update on table "public"."providers" to "authenticated";

grant delete on table "public"."providers" to "service_role";

grant insert on table "public"."providers" to "service_role";

grant references on table "public"."providers" to "service_role";

grant select on table "public"."providers" to "service_role";

grant trigger on table "public"."providers" to "service_role";

grant truncate on table "public"."providers" to "service_role";

grant update on table "public"."providers" to "service_role";

grant delete on table "public"."service_types" to "anon";

grant insert on table "public"."service_types" to "anon";

grant references on table "public"."service_types" to "anon";

grant select on table "public"."service_types" to "anon";

grant trigger on table "public"."service_types" to "anon";

grant truncate on table "public"."service_types" to "anon";

grant update on table "public"."service_types" to "anon";

grant delete on table "public"."service_types" to "authenticated";

grant insert on table "public"."service_types" to "authenticated";

grant references on table "public"."service_types" to "authenticated";

grant select on table "public"."service_types" to "authenticated";

grant trigger on table "public"."service_types" to "authenticated";

grant truncate on table "public"."service_types" to "authenticated";

grant update on table "public"."service_types" to "authenticated";

grant delete on table "public"."service_types" to "service_role";

grant insert on table "public"."service_types" to "service_role";

grant references on table "public"."service_types" to "service_role";

grant select on table "public"."service_types" to "service_role";

grant trigger on table "public"."service_types" to "service_role";

grant truncate on table "public"."service_types" to "service_role";

grant update on table "public"."service_types" to "service_role";

grant delete on table "public"."services" to "anon";

grant insert on table "public"."services" to "anon";

grant references on table "public"."services" to "anon";

grant select on table "public"."services" to "anon";

grant trigger on table "public"."services" to "anon";

grant truncate on table "public"."services" to "anon";

grant update on table "public"."services" to "anon";

grant delete on table "public"."services" to "authenticated";

grant insert on table "public"."services" to "authenticated";

grant references on table "public"."services" to "authenticated";

grant select on table "public"."services" to "authenticated";

grant trigger on table "public"."services" to "authenticated";

grant truncate on table "public"."services" to "authenticated";

grant update on table "public"."services" to "authenticated";

grant delete on table "public"."services" to "service_role";

grant insert on table "public"."services" to "service_role";

grant references on table "public"."services" to "service_role";

grant select on table "public"."services" to "service_role";

grant trigger on table "public"."services" to "service_role";

grant truncate on table "public"."services" to "service_role";

grant update on table "public"."services" to "service_role";




-- ============================================================
-- Migration: 20260315011741_create_resources.sql
-- ============================================================

  create table "public"."resources" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "title" text not null,
    "type" text not null,
    "excerpt" text,
    "content" text,
    "author" text default 'MyFutureAbroad Team'::text,
    "cover_image" text,
    "tags" text[],
    "reading_time_minutes" integer,
    "published" boolean default false,
    "featured" boolean default false
      );


CREATE UNIQUE INDEX resources_pkey ON public.resources USING btree (id);

alter table "public"."resources" add constraint "resources_pkey" PRIMARY KEY using index "resources_pkey";

grant delete on table "public"."resources" to "anon";

grant insert on table "public"."resources" to "anon";

grant references on table "public"."resources" to "anon";

grant select on table "public"."resources" to "anon";

grant trigger on table "public"."resources" to "anon";

grant truncate on table "public"."resources" to "anon";

grant update on table "public"."resources" to "anon";

grant delete on table "public"."resources" to "authenticated";

grant insert on table "public"."resources" to "authenticated";

grant references on table "public"."resources" to "authenticated";

grant select on table "public"."resources" to "authenticated";

grant trigger on table "public"."resources" to "authenticated";

grant truncate on table "public"."resources" to "authenticated";

grant update on table "public"."resources" to "authenticated";

grant delete on table "public"."resources" to "service_role";

grant insert on table "public"."resources" to "service_role";

grant references on table "public"."resources" to "service_role";

grant select on table "public"."resources" to "service_role";

grant trigger on table "public"."resources" to "service_role";

grant truncate on table "public"."resources" to "service_role";

grant update on table "public"."resources" to "service_role";


  create policy "Enable read access for all users"
  on "public"."resources"
  as permissive
  for select
  to public
using (true);





-- ============================================================
-- Migration: 20260328000001_create_profiles_orders_messages.sql
-- ============================================================
-- ============================================================
-- PROFILES
-- One row per auth user. role = 'client' | 'provider'
-- provider_id links provider-role users to their provider row
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null default 'client' check (role in ('client', 'provider')),
  provider_id  uuid references public.providers(id) on delete set null,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Automatically create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ============================================================
-- ORDERS
-- Created when a client books a service
-- ============================================================
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  service_id   uuid not null references public.services(id) on delete restrict,
  provider_id  uuid not null references public.providers(id) on delete restrict,
  status       text not null default 'pending'
                 check (status in ('pending', 'active', 'completed', 'cancelled')),
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_orders_client    on public.orders(client_id);
create index if not exists idx_orders_provider  on public.orders(provider_id);
create index if not exists idx_orders_service   on public.orders(service_id);

alter table public.orders enable row level security;

create policy "Clients see their own orders"
  on public.orders for select
  using (auth.uid() = client_id);

create policy "Providers see orders for their provider"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.orders.provider_id
    )
  );

create policy "Clients can create orders"
  on public.orders for insert
  with check (auth.uid() = client_id);

create policy "Providers can update order status"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.orders.provider_id
    )
  );


-- ============================================================
-- MESSAGE THREADS
-- One thread per order (1-to-1 between order and thread)
-- ============================================================
create table if not exists public.message_threads (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null unique references public.orders(id) on delete cascade,
  client_id    uuid not null references auth.users(id) on delete cascade,
  provider_id  uuid not null references public.providers(id) on delete cascade,
  created_at   timestamptz default now()
);

create index if not exists idx_threads_client    on public.message_threads(client_id);
create index if not exists idx_threads_provider  on public.message_threads(provider_id);

alter table public.message_threads enable row level security;

create policy "Clients see their threads"
  on public.message_threads for select
  using (auth.uid() = client_id);

create policy "Providers see their threads"
  on public.message_threads for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.message_threads.provider_id
    )
  );

-- Auto-create thread when order is inserted
create or replace function public.handle_new_order()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.message_threads (order_id, client_id, provider_id)
  values (new.id, new.client_id, new.provider_id);
  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.handle_new_order();


-- ============================================================
-- MESSAGES
-- Individual messages within a thread
-- sender_type: 'client' | 'provider'
-- ============================================================
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  thread_id    uuid not null references public.message_threads(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  sender_type  text not null check (sender_type in ('client', 'provider')),
  body         text not null,
  created_at   timestamptz default now()
);

create index if not exists idx_messages_thread on public.messages(thread_id);
create index if not exists idx_messages_sender on public.messages(sender_id);

alter table public.messages enable row level security;

-- Client can read messages in their threads
create policy "Thread participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = public.messages.thread_id
        and (
          t.client_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.provider_id = t.provider_id
          )
        )
    )
  );

-- Any participant can insert a message
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
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.provider_id = t.provider_id
          )
        )
    )
  );


-- ============================================================
-- Migration: 20260328000002_fix_profile_trigger_role.sql
-- ============================================================
-- Update handle_new_user trigger to respect the role passed in user metadata.
-- This avoids needing a client-side upsert (which hits RLS) for provider signups.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _role text;
begin
  _role := coalesce(new.raw_user_meta_data->>'role', 'client');
  -- Sanitise: only allow known roles
  if _role not in ('client', 'provider') then
    _role := 'client';
  end if;

  insert into public.profiles (id, role)
  values (new.id, _role)
  on conflict (id) do update set role = excluded.role;

  return new;
end;
$$;


-- ============================================================
-- Migration: 20260328000003_provider_members_join_codes.sql
-- ============================================================
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

-- ============================================================
-- Migration: 20260328000004_add_rls_policies.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260404123000_create_service_countries.sql
-- ============================================================
-- Migration: create service_countries join table and migrate existing data
begin;

-- Create join table between services and countries
create table if not exists public.service_countries (
  service_id uuid not null references public.services(id) on delete cascade,
  country_id integer not null references public.countries(id) on delete cascade,
  primary key (service_id, country_id)
);

-- Indexes
create index if not exists idx_service_countries_service on public.service_countries (service_id);
create index if not exists idx_service_countries_country on public.service_countries (country_id);

-- Migrate any existing applicable_countries arrays into the join table
insert into public.service_countries (service_id, country_id)
select id, unnest(applicable_countries)
from public.services
where applicable_countries is not null;

-- Grants similar to other tables
grant select on table public.service_countries to anon;
grant insert on table public.service_countries to anon;
grant update on table public.service_countries to anon;
grant delete on table public.service_countries to anon;

grant select on table public.service_countries to authenticated;
grant insert on table public.service_countries to authenticated;
grant update on table public.service_countries to authenticated;
grant delete on table public.service_countries to authenticated;

grant select on table public.service_countries to service_role;
grant insert on table public.service_countries to service_role;
grant update on table public.service_countries to service_role;
grant delete on table public.service_countries to service_role;

commit;


-- ============================================================
-- Migration: 20260404124000_add_rls_service_countries.sql
-- ============================================================
-- Enable RLS and allow public read on service_countries join table
alter table if exists public.service_countries enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_countries' and policyname = 'Public can read service_countries') then
    execute $pol$
      create policy "Public can read service_countries"
        on public.service_countries for select
        using (true);
    $pol$;
  end if;
end$$;


-- ============================================================
-- Migration: 20260404130000_create_budgets.sql
-- ============================================================
-- Migration: create budgets and budget_items tables
begin;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  total_amount numeric(12,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  cost numeric(12,2) not null default 0,
  category text,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_budgets_user on public.budgets (user_id);
create index if not exists idx_budget_items_budget on public.budget_items (budget_id);

-- Grants similar to other tables
grant select on table public.budgets to anon;
grant insert on table public.budgets to anon;
grant update on table public.budgets to anon;
grant delete on table public.budgets to anon;

grant select on table public.budget_items to anon;
grant insert on table public.budget_items to anon;
grant update on table public.budget_items to anon;
grant delete on table public.budget_items to anon;

commit;


-- ============================================================
-- Migration: 20260404131000_add_rls_budgets.sql
-- ============================================================
-- Migration: enable RLS and policies for budgets and budget_items

alter table if exists public.budgets enable row level security;
alter table if exists public.budget_items enable row level security;

-- Budgets policies
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can view own budgets') then
    execute $pol$
      create policy "Users can view own budgets"
        on public.budgets for select
        using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can insert budgets') then
    execute $pol$
      create policy "Users can insert budgets"
        on public.budgets for insert
        with check (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can update own budgets') then
    execute $pol$
      create policy "Users can update own budgets"
        on public.budgets for update
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can delete own budgets') then
    execute $pol$
      create policy "Users can delete own budgets"
        on public.budgets for delete
        using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

-- Budget items policies (allow access only if the parent budget belongs to the user)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can view budget items for their budgets') then
    execute $pol$
      create policy "Users can view budget items for their budgets"
        on public.budget_items for select
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can insert budget items for their budgets') then
    execute $pol$
      create policy "Users can insert budget items for their budgets"
        on public.budget_items for insert
        with check (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can update budget items for their budgets') then
    execute $pol$
      create policy "Users can update budget items for their budgets"
        on public.budget_items for update
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        )
        with check (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can delete budget items for their budgets') then
    execute $pol$
      create policy "Users can delete budget items for their budgets"
        on public.budget_items for delete
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;


-- ============================================================
-- Migration: 20260406000000_add_delete_user_rpc.sql
-- ============================================================
-- Enable users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void AS $$
BEGIN
  -- Delete the authenticated user from the auth.users table
  -- This will cascade and delete their profile and other related data
  -- if foreign key constraints are set up with ON DELETE CASCADE
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Migration: 20260406000001_create_checklists.sql
-- ============================================================
-- Migration: create checklists and checklist_items tables with RLS
begin;

create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.checklists(id) on delete cascade,
  name text not null,
  category text,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_checklists_user on public.checklists (user_id);
create index if not exists idx_checklist_items_checklist on public.checklist_items (checklist_id);

-- Grants
grant select on table public.checklists to anon;
grant insert on table public.checklists to anon;
grant update on table public.checklists to anon;
grant delete on table public.checklists to anon;

grant select on table public.checklist_items to anon;
grant insert on table public.checklist_items to anon;
grant update on table public.checklist_items to anon;
grant delete on table public.checklist_items to anon;

-- RLS
alter table if exists public.checklists enable row level security;
alter table if exists public.checklist_items enable row level security;

-- Checklists policies
create policy "Users can view own checklists" on public.checklists for select using (auth.uid() = user_id);
create policy "Users can insert checklists" on public.checklists for insert with check (auth.uid() = user_id);
create policy "Users can update own checklists" on public.checklists for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own checklists" on public.checklists for delete using (auth.uid() = user_id);

-- Checklist items policies
create policy "Users can view checklist items for their checklists" on public.checklist_items for select using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can insert checklist items for their checklists" on public.checklist_items for insert with check (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can update checklist items for their checklists" on public.checklist_items for update using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid())) with check (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can delete checklist items for their checklists" on public.checklist_items for delete using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));

commit;

-- ============================================================
-- Migration: 20260406000002_add_provider_currency.sql
-- ============================================================
alter table providers add column if not exists preferred_currency text default 'USD';


-- ============================================================
-- Migration: 20260407000000_create_encrypted_documents.sql
-- ============================================================
-- Create document categories
CREATE TABLE public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Insert default categories
INSERT INTO public.document_categories (name, description) VALUES 
('Passport', 'Official passport documents'), 
('Driver''s License', 'Driving permits and licenses'), 
('Insurance', 'Health, travel, and vehicle insurance papers'), 
('Visas', 'Visa grants and applications'),
('Other', 'Miscellaneous documents');

-- Table for user cryptographic keys
CREATE TABLE public.user_keys (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for uploaded documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.document_categories(id),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Documents Access Control (Encrypted AES keys for each user who can access)
CREATE TABLE public.document_access (
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    encrypted_aes_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (document_id, user_id)
);

-- Enable RLS
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are readable by everyone." ON public.document_categories
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own keys." ON public.user_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view everyone's public key (to share docs), but only their own private key." ON public.user_keys
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own keys." ON public.user_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.document_access WHERE document_id = public.documents.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert document access for their own documents" ON public.document_access
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view document access for documents they can access" ON public.document_access
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
    );


-- ============================================================
-- Migration: 20260408000000_create_documents_bucket.sql
-- ============================================================
-- Add Storage bucket for private encrypted documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the documents bucket
CREATE POLICY "Users can upload their own encrypted documents."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND (auth.uid())::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can select their own encrypted documents."
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND (auth.uid())::text = (string_to_array(name, '/'))[1]);

-- Assume users might eventually read objects from other paths shared with them (handled via UI fetch if signed urls are needed or read policies are opened up based on document_access).
-- For now, letting users fetch specifically granted documents using the same subquery logic from the `documents` table:
CREATE POLICY "Users can view encrypted documents shared with them."
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM public.documents d
    JOIN public.document_access da ON d.id = da.document_id
    WHERE d.file_path = storage.objects.name AND da.user_id = auth.uid()
  )
);


-- ============================================================
-- Migration: 20260408000100_fix_documents_rls_recursion.sql
-- ============================================================
-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can select documents they own or have access to" ON public.documents;
DROP POLICY IF EXISTS "Users can view document access for documents they can access" ON public.document_access;

-- Recreate simpler policies without circular references
-- For documents: Users can see documents they own OR documents where they have an access record
CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT USING (
        auth.uid() = user_id OR
        id IN (SELECT document_id FROM public.document_access WHERE user_id = auth.uid())
    );

-- For document_access: Users can see their own access records
CREATE POLICY "Users can view their own document access records" ON public.document_access
    FOR SELECT USING (user_id = auth.uid());


-- ============================================================
-- Migration: 20260408000200_add_documents_update_delete_policies.sql
-- ============================================================
-- Add UPDATE and DELETE policies for documents table
CREATE POLICY "Users can update their own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- Migration: 20260408000300_add_date_of_birth_to_profiles.sql
-- ============================================================
-- Add date_of_birth column to profiles table
alter table public.profiles
add column if not exists date_of_birth date;


-- ============================================================
-- Migration: 20260408000400_add_insert_policy_profiles.sql
-- ============================================================
-- Add INSERT RLS policy to profiles table
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- ============================================================
-- Migration: 20260408000500_improve_user_trigger_capture_metadata.sql
-- ============================================================
-- Improve handle_new_user trigger to capture full_name and date_of_birth from auth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, date_of_birth)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role'), 'client'),
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'date_of_birth')::date
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      date_of_birth = excluded.date_of_birth,
      role = excluded.role;
  return new;
end;
$$;


-- ============================================================
-- Migration: 20260408000600_add_payment_fields_to_orders.sql
-- ============================================================
-- Add payment-related fields to orders table
alter table public.orders
add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
add column if not exists amount integer, -- amount in cents
add column if not exists stripe_payment_intent_id text,
add column if not exists stripe_transfer_id text,
add column if not exists commission_amount integer,
add column if not exists commission_percentage decimal(5,2) not null default 10.00,
add column if not exists payment_date timestamptz;


-- ============================================================
-- Migration: 20260408000700_fix_message_threads_rls_policies.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260408000800_fix_orders_rls_for_providers.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260408000900_add_bank_account_to_providers.sql
-- ============================================================
-- Migration: Add bank account and Stripe Connect fields to providers
alter table public.providers
add column if not exists bank_account_holder_name text,
add column if not exists bank_account_number text, -- encrypted in production
add column if not exists bank_routing_number text, -- encrypted in production
add column if not exists stripe_connect_account_id text,
add column if not exists bank_account_verified boolean default false,
add column if not exists updated_at timestamptz default now();


-- ============================================================
-- Migration: 20260409000000_enable_realtime_messages.sql
-- ============================================================
-- Enable realtime on messages and message_threads tables
-- This allows changes to these tables to be broadcast to subscribed clients in real-time

BEGIN;

-- Add messages table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Add message_threads table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE message_threads;

COMMIT;


-- ============================================================
-- Migration: 20260409000100_allow_provider_view_client_profiles.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260409000200_allow_multiple_orders_per_thread.sql
-- ============================================================
-- Allow multiple orders per message thread
-- Remove the UNIQUE constraint on order_id to support multiple payment requests in one conversation

alter table public.message_threads
drop constraint if exists message_threads_order_id_key;


-- ============================================================
-- Migration: 20260409000300_decouple_threads_orders.sql
-- ============================================================
-- 1. Add reference columns
ALTER TABLE public.orders ADD COLUMN thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE;
ALTER TABLE public.message_threads ADD COLUMN service_id UUID REFERENCES public.services(id) ON DELETE CASCADE;

-- 2. Migrate existing data
DO $$
BEGIN
  -- A thread's service_id is the same as its origin order's service_id
  UPDATE public.message_threads mt
  SET service_id = o.service_id 
  FROM public.orders o
  WHERE mt.order_id = o.id;

  -- An order's thread_id is the thread that points to it
  UPDATE public.orders o
  SET thread_id = mt.id 
  FROM public.message_threads mt
  WHERE mt.order_id = o.id;
END $$;

-- Drop rows where service_id is somehow still null because order didn't exist
DELETE FROM public.message_threads WHERE service_id IS NULL;

-- Make it NOT NULL for future
ALTER TABLE public.message_threads ALTER COLUMN service_id SET NOT NULL;

-- 3. Drop old trigger and column
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
DROP FUNCTION IF EXISTS public.handle_new_order();

-- Wait, messages also have a thread_id foreign key. We need to be careful with dropping message_threads columns if views depend on them.
ALTER TABLE public.message_threads DROP COLUMN IF EXISTS order_id;

-- 4. Enable RLS for insert on message_threads (clients can start a chat)
CREATE POLICY "Clients can create message threads"
  ON public.message_threads FOR INSERT
  WITH CHECK (auth.uid() = client_id);


-- ============================================================
-- Migration: 20260409000400_allow_providers_to_read_shared_documents.sql
-- ============================================================
-- Allow providers to read documents of clients they have threads with
CREATE POLICY "Providers can read documents of their clients"
ON public.documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE mt.client_id = public.documents.user_id
          AND pm.user_id = auth.uid()
    )
);

-- Allow providers to fetch the url of the document in the documents bucket
CREATE POLICY "Providers can read documents in bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.documents d
        JOIN public.message_threads mt ON mt.client_id = d.user_id
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE d.file_path = storage.objects.name
          AND pm.user_id = auth.uid()
    )
);


-- ============================================================
-- Migration: 20260410000000_create_provider_security_keys.sql
-- ============================================================
-- Create security keys table for business signup verification
CREATE TABLE IF NOT EXISTS provider_security_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  used_at timestamp DEFAULT NULL,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT,
  active BOOLEAN DEFAULT true
);

-- Add RLS policies
ALTER TABLE provider_security_keys ENABLE ROW LEVEL SECURITY;

-- Admins can view/create/update/delete keys they created
CREATE POLICY "Admins can manage own keys" ON provider_security_keys
  FOR ALL USING (auth.jwt() ->> 'role' = 'authenticated' AND created_by = auth.uid());

-- Authenticated users can read active, unused keys for validation during signup
CREATE POLICY "Users can validate active keys" ON provider_security_keys
  FOR SELECT USING (auth.jwt() ->> 'role' = 'authenticated' AND active = true AND used_at IS NULL);

-- Add index for fast key lookup
CREATE INDEX IF NOT EXISTS idx_provider_security_keys_key ON provider_security_keys(key);
CREATE INDEX IF NOT EXISTS idx_provider_security_keys_used_at ON provider_security_keys(used_at);


-- ============================================================
-- Migration: 20260410000100_add_currency_to_budget_items.sql
-- ============================================================
-- Add currency field to budget_items table
ALTER TABLE budget_items ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_budget_items_currency ON budget_items(currency);


-- ============================================================
-- Migration: 20260410000200_restructure_visas_schema_for_csv.sql
-- ============================================================
-- Migration: 20260410000000_restructure_visas_schema_for_csv
-- Purpose: Restructure visas table to better match CSV data structure
-- Key changes:
--   1. Split path_to_residency into boolean flag + description
--   2. Add min_income_currency (inferred from application_fee_currency)
--   3. Add visa_type column for categorization
--   4. Improve handling of optional fields
--   5. Maintain backward compatibility with existing data

BEGIN;

-- Step 1: Rename existing table to backup
ALTER TABLE IF EXISTS visas RENAME TO visas_old;

-- Step 2: Create new visas table with restructured schema
CREATE TABLE visas (
  id serial primary key,
  
  -- Core identification
  name text not null,
  visa_type text,
  country_id int not null references countries(id) on delete cascade,
  
  -- Description and details
  description text,
  benefits text[],
  
  -- Eligibility criteria
  min_age int,
  max_age int,
  min_income numeric(14,2),
  min_income_currency text,
  min_savings numeric(14,2),
  min_savings_currency text,
  required_skills text[],
  eligible_nationalities text[],
  excluded_nationalities text[],
  
  -- Requirements
  requires_health_insurance boolean default false,
  requires_clean_criminal_record boolean default false,
  
  -- Processing and validity
  processing_time_days int,
  validity_months int,
  renewable boolean default false,
  
  -- Path to residency (restructured)
  has_path_to_residency boolean default false,
  path_to_residency_description text,
  
  -- Application details
  application_fee_usd numeric(12,2),
  application_fee_currency text,
  required_documents text[],
  official_link text,
  
  -- Media and additional data
  image_url text,
  additional_info jsonb,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visas_name ON visas (name);
CREATE INDEX IF NOT EXISTS idx_visas_country ON visas (country_id);
CREATE INDEX IF NOT EXISTS idx_visas_visa_type ON visas (visa_type);
CREATE INDEX IF NOT EXISTS idx_visas_country_name ON visas (country_id, name);

-- Step 4: Migrate data from old table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visas_old') THEN
    INSERT INTO visas (
      id, name, visa_type, country_id, description, benefits,
      min_age, max_age, min_income, min_income_currency, min_savings, min_savings_currency,
      required_skills, eligible_nationalities, excluded_nationalities,
      requires_health_insurance, requires_clean_criminal_record,
      processing_time_days, validity_months, renewable,
      has_path_to_residency, path_to_residency_description,
      application_fee_usd, application_fee_currency, required_documents, official_link,
      image_url, additional_info, created_at, updated_at
    )
    SELECT
      id, name, visa_type, country_id, description, benefits,
      min_age, max_age, min_income, min_income_currency, min_savings, min_savings_currency,
      required_skills, eligible_nationalities, excluded_nationalities,
      requires_health_insurance, requires_clean_criminal_record,
      processing_time_days, validity_months, renewable,
      CASE WHEN path_to_residency IN ('true', '1', 'TRUE', 'True') THEN true ELSE false END,
      CASE WHEN path_to_residency NOT IN ('true', 'false', '1', '0', '', 'TRUE', 'False', 'FALSE') THEN path_to_residency::text ELSE NULL END,
      application_fee_usd, application_fee_currency, required_documents, official_link,
      image_url, additional_info, created_at, updated_at
    FROM visas_old;
    
    -- Drop the old table
    DROP TABLE visas_old;
  END IF;
END $$;

-- Step 5: Create helper function to populate min_income_currency from application_fee_currency
CREATE OR REPLACE FUNCTION set_min_income_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- If min_income is set but min_income_currency is not, use application_fee_currency
  IF NEW.min_income IS NOT NULL AND NEW.min_income_currency IS NULL THEN
    NEW.min_income_currency := NEW.application_fee_currency;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger to auto-set min_income_currency
DROP TRIGGER IF EXISTS trg_set_min_income_currency ON visas;
CREATE TRIGGER trg_set_min_income_currency
  BEFORE INSERT OR UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION set_min_income_currency();

-- Step 7: Create helper function to populate min_savings_currency from application_fee_currency
CREATE OR REPLACE FUNCTION set_min_savings_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- If min_savings is set but min_savings_currency is not, use application_fee_currency
  IF NEW.min_savings IS NOT NULL AND NEW.min_savings_currency IS NULL THEN
    NEW.min_savings_currency := NEW.application_fee_currency;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to auto-set min_savings_currency
DROP TRIGGER IF EXISTS trg_set_min_savings_currency ON visas;
CREATE TRIGGER trg_set_min_savings_currency
  BEFORE INSERT OR UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION set_min_savings_currency();

-- Step 9: Create function to sync updated_at timestamp
CREATE OR REPLACE FUNCTION update_visas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger for updated_at
DROP TRIGGER IF EXISTS trg_update_visas_updated_at ON visas;
CREATE TRIGGER trg_update_visas_updated_at
  BEFORE UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION update_visas_updated_at();

COMMIT;


-- ============================================================
-- Migration: 20260411000000_add_visas_rls_policies.sql
-- ============================================================
-- Enable Row Level Security for visas
ALTER TABLE IF EXISTS public.visas ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to replace it cleanly
DROP POLICY IF EXISTS "Public can read visas" ON public.visas;

-- Allow anyone (public/anon) to read the visas
CREATE POLICY "Public can read visas"
    ON public.visas
    FOR SELECT
    USING (true);

-- Drop existing service role policies if they exist
DROP POLICY IF EXISTS "Service role can insert visas" ON public.visas;
DROP POLICY IF EXISTS "Service role can update visas" ON public.visas;
DROP POLICY IF EXISTS "Service role can delete visas" ON public.visas;

-- Allow service_role to manage visas (Note: service_role bypasses RLS anyway, 
-- but explicitly defining it can be good practice for admin dashboards)
CREATE POLICY "Service role can insert visas"
    ON public.visas
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update visas"
    ON public.visas
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can delete visas"
    ON public.visas
    FOR DELETE
    USING (true);


-- ============================================================
-- Migration: 20260412162000_create_support_messages.sql
-- ============================================================
-- Create support_messages table
BEGIN;

CREATE TABLE IF NOT EXISTS public.support_messages (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  category text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  email text NOT NULL,
  user_id uuid NULL
);

CREATE INDEX IF NOT EXISTS support_messages_created_at_idx ON public.support_messages (created_at DESC);

COMMIT;


-- ============================================================
-- Migration: 20260412170000_rls_support_messages.sql
-- ============================================================
-- Disable client access to support_messages
-- Enable Row Level Security and add explicit deny-all policies.
-- The Supabase service role (service key) bypasses RLS, so only server-side code
-- using the service key will be able to read/write this table.

BEGIN;

-- Turn on RLS for the table
ALTER TABLE IF EXISTS public.support_messages
  ENABLE ROW LEVEL SECURITY;

-- Explicit deny policies for all operations (always false)
-- Drop existing policies if present, then create them (CREATE POLICY doesn't support IF NOT EXISTS)
DROP POLICY IF EXISTS deny_select_on_support_messages ON public.support_messages;
CREATE POLICY deny_select_on_support_messages
  ON public.support_messages
  FOR SELECT
  USING (false);

DROP POLICY IF EXISTS deny_insert_on_support_messages ON public.support_messages;
CREATE POLICY deny_insert_on_support_messages
  ON public.support_messages
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS deny_update_on_support_messages ON public.support_messages;
CREATE POLICY deny_update_on_support_messages
  ON public.support_messages
  FOR UPDATE
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS deny_delete_on_support_messages ON public.support_messages;
CREATE POLICY deny_delete_on_support_messages
  ON public.support_messages
  FOR DELETE
  USING (false);

COMMIT;


-- ============================================================
-- Migration: 20260412231800_add_base_currency_to_visas.sql
-- ============================================================
-- Migration: Add base_currency and application_fee_amount columns to visas
-- Purpose: Store visa fees in their base currency to avoid conversion errors
-- When viewing in base currency, show the original amount without conversion

BEGIN;

-- Add new columns
ALTER TABLE visas
ADD COLUMN IF NOT EXISTS base_currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS application_fee_amount numeric(12,2);

-- Migrate existing data: populate new columns from old columns
-- If application_fee_currency is set, use it as base_currency; otherwise use USD
UPDATE visas
SET 
  base_currency = COALESCE(application_fee_currency, 'USD'),
  application_fee_amount = application_fee_usd
WHERE application_fee_amount IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_visas_base_currency ON visas (base_currency);

COMMIT;


-- ============================================================
-- Migration: 20260422000000_add_description_to_countries.sql
-- ============================================================
-- Add description column to countries table
alter table countries
add column description text;


-- ============================================================
-- Migration: 20260422000001_add_longdescription_to_countries.sql
-- ============================================================
-- Add longdescription column to countries table
alter table countries
add column longdescription text;


-- ============================================================
-- Migration: 20260422000002_add_citizenship_requirements_to_countries.sql
-- ============================================================
-- Add citizenship_requirements column to countries table
alter table countries add column citizenship_requirements jsonb;

-- Add comment explaining the JSON structure
comment on column countries.citizenship_requirements is 'JSON object with citizenship categories as keys. Format: { "category_name": { "icon": "icon_name", "desc": "markdown_description" }, ... }';


-- ============================================================
-- Migration: 20260422000003_add_tax_advice_to_countries.sql
-- ============================================================
-- Add tax_advice column to countries table
ALTER TABLE countries
ADD COLUMN tax_advice text;

-- Add comment for documentation
COMMENT ON COLUMN countries.tax_advice IS 'Markdown bullet points about tax considerations for the country';


-- ============================================================
-- Migration: 20260422000004_add_local_tips_to_countries.sql
-- ============================================================
-- Add local_tips column to countries table
ALTER TABLE countries
ADD COLUMN local_tips text;

-- Add comment for documentation
COMMENT ON COLUMN countries.local_tips IS 'Markdown text with helpful tips for moving or applying for citizenship in the country';


-- ============================================================
-- Migration: 20260422000005_add_extra_info_to_countries.sql
-- ============================================================
-- Add extra_info column to countries table
ALTER TABLE countries
ADD COLUMN extra_info text;

COMMENT ON COLUMN countries.extra_info IS 'Additional markdown content for country-specific extra details';


-- ============================================================
-- Migration: 20260423000000_add_validate_security_key_rpc.sql
-- ============================================================
-- RPC to validate a provider security key without exposing the full table via RLS.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS safely.
-- Returns: 'valid' | 'invalid' | 'already_used'
CREATE OR REPLACE FUNCTION validate_provider_security_key(p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used_at TIMESTAMP;
  v_found   BOOLEAN := FALSE;
BEGIN
  SELECT used_at, TRUE
    INTO v_used_at, v_found
    FROM provider_security_keys
   WHERE key = p_key
     AND active = TRUE
   LIMIT 1;

  IF NOT v_found THEN
    RETURN 'invalid';
  END IF;

  IF v_used_at IS NOT NULL THEN
    RETURN 'already_used';
  END IF;

  RETURN 'valid';
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE ALL ON FUNCTION validate_provider_security_key(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_provider_security_key(TEXT) TO authenticated;


-- ============================================================
-- Migration: 20260423000001_remove_date_of_birth.sql
-- ============================================================
-- Remove date_of_birth from profiles and update the new-user trigger

ALTER TABLE public.profiles DROP COLUMN IF EXISTS date_of_birth;

-- Update trigger to no longer insert/upsert date_of_birth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role'), 'client'),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
  RETURN NEW;
END;
$$;


-- ============================================================
-- Migration: 20260429000000_add_more_countries.sql
-- ============================================================
-- Migration: add_more_countries
-- Countries added: Hungary, Croatia, United States, Japan, South Korea, UAE, Canada, Australia,
-- New Zealand, Singapore, Hong Kong, Czechia, Slovakia, Bulgaria, Romania, Luxembourg,
-- South Africa, Slovenia, Latvia, Lithuania, China, Mongolia, Liechtenstein, Saudi Arabia,
-- Vietnam, Argentina, Brazil, India, Malaysia, Moldova, Albania, Georgia, Israel, Bahamas,
-- Pakistan, Qatar, Bosnia and Herzegovina, Egypt, Maldives, Monaco, Seychelles
-- Also includes existing countries (on conflict do nothing): Estonia, Thailand, Morocco, Indonesia, Iceland, Mexico

insert into countries (continent, name, iso_code, flag_url, highlight_img_url, description, longdescription)
values
(
	'Europe', 'Hungary', 'HU',
	'https://flagcdn.com/hu.svg',
	'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=800&q=80',
	'A Central European gem on the Danube, Hungary enchants with its ornate Parliament, healing thermal baths, and vibrant Budapest nightlife. EU membership combined with affordable living makes it a top destination for expats and digital nomads.

## Key Highlights
- Stunning Budapest architecture and world-renowned thermal bath culture
- Affordable EU living with rich cultural heritage
- Growing tech ecosystem and welcoming digital nomad community',
	'Hungary is a Central European nation with a rich history spanning over a millennium, from the Magyar conquest of the Carpathian Basin to full European Union membership. Budapest, the capital, is consistently ranked among Europe''s most beautiful cities, dramatically split by the Danube with the ornate Parliament building, iconic Chain Bridge, and hilltop Buda Castle. The city is celebrated for its thermal bath culture, vibrant ruin bars, and world-class culinary scene that blends Hungarian tradition with modern creativity. Hungary joined the EU in 2004, providing residents and businesses access to the single market and freedom of movement across Europe. The cost of living is significantly lower than Western Europe while maintaining a strong quality of life, making it increasingly popular among remote workers, retirees, and entrepreneurs. Budapest''s startup ecosystem is growing rapidly, with coworking spaces and accelerators supporting innovation. English proficiency is growing rapidly among younger generations and professionals, though Hungarian — a famously unique Finno-Ugric language — remains dominant. Beyond Budapest, Hungary offers Lake Balaton (Central Europe''s largest lake), rolling wine regions like Tokaj and Eger, and the vast Great Hungarian Plain. The country punches above its weight in science, culture, and innovation, having produced numerous Nobel laureates and world-renowned artists.'
),
(
	'Europe', 'Croatia', 'HR',
	'https://flagcdn.com/hr.svg',
	'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
	'A stunning Adriatic jewel with medieval walled cities and over 1,200 crystalline islands. Croatia combines Mediterranean beauty with EU membership, affordable living, and a pioneering digital nomad visa program.

## Key Highlights
- Breathtaking Dalmatian coastline with crystal-clear Adriatic waters
- UNESCO-listed medieval cities including iconic Dubrovnik
- EU membership with one of Europe''s first digital nomad visas',
	'Croatia is a southeastern European country renowned for its stunning Adriatic coastline, featuring over 1,200 islands, medieval walled cities, and crystal-clear turquoise waters. Dubrovnik, the "Pearl of the Adriatic," is one of the world''s best-preserved medieval cities and a UNESCO World Heritage site, while Zagreb, the capital, offers Central European charm with excellent museums, cafe culture, and a growing tech scene. Croatia became an EU member in 2013 and adopted the Euro in 2023, cementing its integration into the European economic area. The country was a pioneer in digital nomad legislation, introducing one of Europe''s first purpose-built digital nomad visas, attracting remote workers from around the world. National parks like Plitvice Lakes, with its terraced waterfalls and turquoise pools, are among Europe''s most spectacular natural wonders. The country''s cost of living, while rising in tourist areas, remains reasonable compared to Western Europe. Dalmatian cuisine features excellent seafood, olive oil, and local wines. Croatia''s transformation from post-Yugoslav economic challenges to a popular EU member demonstrates remarkable resilience and development, and tourism has become a major economic driver supporting continued investment in infrastructure.'
),
(
	'North America', 'United States', 'US',
	'https://flagcdn.com/us.svg',
	'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
	'The world''s largest economy and global cultural powerhouse, the United States offers unparalleled career opportunities, diverse landscapes, and world-class universities. From Silicon Valley to New York City, innovation and ambition define the American experience.

## Key Highlights
- World''s largest economy with unmatched career opportunities
- World-class universities and technology innovation hubs
- Extraordinarily diverse landscapes and multicultural society',
	'The United States is the world''s largest economy and most globally influential nation, comprising 50 diverse states spanning an entire continent. From the technology corridors of Silicon Valley to the financial powerhouse of New York City, the US offers unparalleled professional opportunities across virtually every industry. The country is home to the world''s leading universities, including Harvard, MIT, and Stanford, which attract talent from every corner of the globe. American culture, entertainment, and innovation have shaped global society through technology, film, music, and media. The landscape is extraordinarily diverse, from the rocky coastlines of New England to the sunny beaches of Florida, the Rocky Mountains, the Great Plains, and Hawaii''s tropical islands. Immigration to the US is highly competitive and complex, with visa categories catering to skilled workers, investors, students, and family members. The H-1B visa is the primary pathway for skilled workers, while the EB-5 investor visa requires substantial capital. American healthcare is world-class but expensive, making health insurance essential. The cost of living varies dramatically by region, with major coastal cities being expensive but interior states offering more affordability. The American dream of opportunity and reinvention continues to attract millions of ambitious individuals seeking education, career advancement, and a better life in the world''s most powerful democracy.'
),
(
	'Asia', 'Japan', 'JP',
	'https://flagcdn.com/jp.svg',
	'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
	'An island nation where ancient tradition meets cutting-edge modernity, Japan captivates with its unique culture, world-renowned cuisine, and unmatched safety. Tokyo, Kyoto, and Osaka offer experiences unlike anywhere else on Earth.

## Key Highlights
- Unique blend of ancient culture and cutting-edge technology
- World-renowned cuisine, exceptional safety, and precision
- Extraordinary landscapes from Mount Fuji to sakura-lined streets',
	'Japan is an East Asian island nation of extraordinary cultural depth and technological sophistication, occupying a unique position as one of the world''s most ancient civilizations that has simultaneously embraced modernity completely. Tokyo, one of the world''s most dynamic megacities, blends ultramodern skyscrapers with traditional temples and cherry blossom parks. Japan''s economy is the third largest in the world, with global leadership in automotive, electronics, robotics, and manufacturing. Japanese culture emphasizes precision, craftsmanship, group harmony, and aesthetic beauty in everything from cuisine to architecture. The country offers extraordinary food culture, from world-class sushi and ramen to elaborate kaiseki dinners, with Tokyo having more Michelin-starred restaurants than any other city. Japan is exceptionally safe, efficient, and well-organized, with punctual public transportation, low crime, and immaculate public spaces. Learning Japanese is essential for long-term integration, as English proficiency outside tourist areas remains limited. Immigration has historically been strict, but recent years have seen expansion of work visas and a dedicated digital nomad visa program. The cost of living in Tokyo is high but manageable, while regional cities offer more affordable alternatives. Japan''s aging population is creating new opportunities for skilled foreign workers in healthcare, technology, and education sectors.'
),
(
	'Asia', 'South Korea', 'KR',
	'https://flagcdn.com/kr.svg',
	'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
	'A dynamic East Asian nation leading the world in technology, K-pop, and innovative culture. South Korea offers world-class infrastructure, a vibrant food scene, and growing opportunities for international talent in Seoul and beyond.

## Key Highlights
- Global leader in technology with Samsung, LG, and Hyundai
- Vibrant K-pop and K-drama culture with world-class street food
- Excellent infrastructure with strong career opportunities',
	'South Korea is a technologically advanced East Asian nation that transformed from post-war poverty to one of the world''s most dynamic economies within a single generation — an achievement known as the "Miracle on the Han River." Seoul, the capital and home to half the country''s population, is a sprawling ultramodern city with world-class infrastructure, excellent public transportation, and a vibrant cultural scene. South Korea is home to global technology and manufacturing giants including Samsung, LG, Hyundai, and SK, making it a significant innovation hub. The Korean Wave (Hallyu) has made Korean pop culture — K-pop, K-dramas, and Korean cinema — globally influential, bringing international attention to the language and culture. Korean cuisine is world-renowned for its bold flavors, fermentation techniques, and diverse street food culture including tteokbokki, Korean fried chicken, and bibimbap. South Korea offers excellent internet infrastructure (among the world''s fastest), modern healthcare, and a strong social safety net. For skilled foreign workers, the country has several visa pathways, including E-Series work visas and the D-10 job seeker visa. Learning Korean significantly improves integration and career opportunities. The cost of living in Seoul is high compared to other Asian cities but comparable to Western European capitals. The country faces challenges including intense work culture and competitive academic pressure.'
),
(
	'Asia', 'United Arab Emirates', 'AE',
	'https://flagcdn.com/ae.svg',
	'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
	'A gleaming Middle Eastern hub where ultramodern architecture meets ancient desert heritage. The UAE offers tax-free income, world-class infrastructure, and unmatched business opportunities as a strategic bridge connecting East and West.

## Key Highlights
- Zero personal income tax with business-friendly environment
- World-class infrastructure, luxury lifestyle, and global connectivity
- Strategic hub connecting Europe, Asia, and Africa',
	'The United Arab Emirates is a federation of seven emirates on the Arabian Peninsula, transforming from a pearl-diving economy to one of the world''s most modern and diversified economies in just a few decades. Dubai and Abu Dhabi are internationally recognized as global hubs for business, finance, tourism, and innovation, attracting millions of expatriates and tourists annually. The UAE offers zero personal income tax, making it highly attractive for high-earning professionals and entrepreneurs seeking to maximize their earnings while maintaining a luxurious lifestyle. Dubai''s skyline, featuring the world''s tallest building (Burj Khalifa), is a testament to the country''s extraordinary ambition. Abu Dhabi manages the country''s vast sovereign wealth fund through investments in renewable energy, culture, and technology. Expatriates make up approximately 88% of the UAE''s population, creating one of the world''s most international societies. The country has introduced various long-term residency options including Golden Visas for investors, entrepreneurs, and skilled professionals. Islamic law and conservative social norms apply, requiring expatriates to respect local customs. The desert climate features extreme summer heat, making outdoor activities largely seasonal. The UAE''s strategic location between Europe and Asia makes it a major logistics and travel hub, and its world-class airports offer connections to virtually every major city globally.'
),
(
	'North America', 'Canada', 'CA',
	'https://flagcdn.com/ca.svg',
	'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
	'One of the world''s most welcoming countries for immigrants, Canada offers exceptional quality of life, vast natural beauty, and strong opportunities across technology, healthcare, and natural resources.

## Key Highlights
- World-leading immigration pathways and genuinely multicultural society
- Exceptional quality of life with universal healthcare
- Stunning natural landscapes from the Rockies to the Arctic',
	'Canada is the world''s second largest country by land area, stretching from the Atlantic to the Pacific and north to the Arctic, offering extraordinary natural diversity from the Rocky Mountains to boreal forests, prairie grasslands, and thousands of lakes. Toronto, Vancouver, and Montreal are cosmopolitan cities consistently ranked among the world''s most livable, with strong economies, diverse populations, and excellent public services. Canada is widely regarded as having one of the world''s most welcoming immigration systems, with points-based Express Entry and Provincial Nominee Programs attracting hundreds of thousands of skilled workers annually. The country offers universal healthcare, strong labor protections, and excellent public education, making it particularly attractive for families. Canadian society is fundamentally multicultural, with the country''s identity built on diversity and inclusion. The technology sector is growing rapidly, with Toronto and Vancouver developing as major tech hubs attracting companies from Silicon Valley and beyond. Canada is bilingual at the federal level (English and French), with Quebec maintaining a distinct French-speaking culture. The natural environment is spectacular and easily accessible, with world-class ski resorts, hiking trails, and wildlife viewing opportunities. The cost of living varies dramatically by city, with Vancouver and Toronto expensive but other cities more affordable. Canada''s stable political system, rule of law, and social safety net make it one of the world''s most desirable migration destinations.'
),
(
	'Oceania', 'Australia', 'AU',
	'https://flagcdn.com/au.svg',
	'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
	'A sun-drenched continent of extraordinary natural wonders, from the Great Barrier Reef to the ancient outback. Australia offers an enviable outdoor lifestyle, world-class cities, and competitive immigration pathways for skilled workers.

## Key Highlights
- Iconic natural wonders including the Great Barrier Reef and Uluru
- High quality of life with year-round outdoor lifestyle
- Competitive points-based immigration for skilled workers',
	'Australia is a vast island continent in the southern hemisphere, offering a unique combination of world-class cities, extraordinary natural landscapes, and one of the highest standards of living globally. Sydney, Melbourne, Brisbane, and Perth are cosmopolitan cities with thriving economies, vibrant cultural scenes, and excellent infrastructure, while the vast outback contains ancient indigenous cultural sites, unique wildlife, and dramatic landscapes found nowhere else on Earth. The Great Barrier Reef, the world''s largest coral reef system, is one of the planet''s most irreplaceable natural wonders. Australia''s economy is diverse and resilient, with strengths in mining, agriculture, financial services, and a growing technology sector. The country operates a points-based immigration system that actively recruits skilled workers from around the world, with various visa pathways for professionals, students, and investors. English is the primary language, making integration straightforward for English speakers. Australia''s healthcare system combines universal coverage (Medicare) with private options. The cost of living, particularly in Sydney and Melbourne, is high, with housing being a major expense. Australian culture emphasizes outdoor living, sport, informality, and multiculturalism, creating a relaxed and welcoming society. The country''s unique wildlife, including kangaroos, koalas, and diverse marine life, adds to its extraordinary appeal.'
),
(
	'Oceania', 'New Zealand', 'NZ',
	'https://flagcdn.com/nz.svg',
	'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=800&q=80',
	'A breathtaking land of fiords, volcanoes, and vast green landscapes made famous by The Lord of the Rings. New Zealand offers clean living, friendly immigration, and a superb quality of life in one of the world''s most pristine environments.

## Key Highlights
- Spectacular landscapes from fiords to volcanic plateaus
- Clean, safe environment with accessible immigration policies
- Rich Māori cultural heritage enriching national identity',
	'New Zealand is a Pacific island nation of extraordinary natural beauty, comprising two main islands with dramatically different characters: the North Island featuring volcanic plateaus and geothermal activity, and the South Island with the Southern Alps, fiords, glaciers, and vast plains. Wellington is the compact, creative capital, while Auckland is the largest city and economic hub. New Zealand consistently ranks among the world''s safest, most livable, and least corrupt nations. The country''s immigration system is relatively accessible, with various pathways for skilled workers, entrepreneurs, and investors through the points-based Skilled Migrant Category. New Zealand''s Māori culture is integral to national identity, with te reo Māori recognized as an official language. The economy is strong in agriculture, tourism, film production, and a growing technology sector. The country gained international fame as the filming location for The Lord of the Rings and The Hobbit trilogies. New Zealand''s clean environment, excellent outdoor recreation, and friendly people make it consistently popular with both visitors and immigrants. The cost of living is moderate to high, with Auckland particularly expensive for housing. The country''s geographic remoteness is both a challenge and a virtue, preserving its pristine environment and distinct culture while requiring long-haul flights for international travel.'
),
(
	'Asia', 'Singapore', 'SG',
	'https://flagcdn.com/sg.svg',
	'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
	'Asia''s premier financial hub and city-state, Singapore combines extraordinary efficiency, safety, and multicultural harmony. A global business gateway with world-class infrastructure and unparalleled strategic positioning between East and West.

## Key Highlights
- World-class financial hub with exceptional business environment
- Extraordinary safety, cleanliness, and operational efficiency
- Strategic location with multicultural English-speaking society',
	'Singapore is a city-state island nation at the southern tip of the Malay Peninsula, ranking as one of the world''s most efficient, prosperous, and livable places despite its tiny size. It serves as Asia''s premier financial hub, hosting major banks, investment firms, and regional headquarters for multinational corporations alongside one of the world''s busiest container ports. English is an official language alongside Malay, Mandarin Chinese, and Tamil, making it uniquely accessible for international professionals. Singapore consistently ranks at the top of global indices for ease of doing business, rule of law, and corruption-free governance. The country''s multicultural society — comprising Chinese, Malay, Indian, and expatriate communities — creates a uniquely cosmopolitan Asian environment. Singapore''s infrastructure is world-class, featuring an ultra-efficient MRT network, exceptional healthcare, and renowned educational institutions. The cost of living is among Asia''s highest, particularly for housing. The country offers multiple immigration pathways for skilled professionals, entrepreneurs, and investors through Employment Passes and EntrePass programs. Singapore''s strategic location as a hub between East and West makes it ideal for businesses serving both Asian and Western markets. The tiny country has almost no natural resources yet achieved extraordinary prosperity through human capital, smart governance, and strategic positioning.'
),
(
	'Asia', 'Hong Kong', 'HK',
	'https://flagcdn.com/hk.svg',
	'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80',
	'A dynamic Special Administrative Region with one of the world''s most iconic skylines. Hong Kong blends East and West in a compact vertical city offering major financial opportunities, vibrant Cantonese culture, and unique historical heritage.

## Key Highlights
- World-class financial center with iconic Victoria Harbour skyline
- Unique blend of Chinese and international cultures
- Exceptional Cantonese cuisine and vibrant urban energy',
	'Hong Kong is a Special Administrative Region of China, situated on the southeastern coast of mainland China, known for its dramatic skyline, deep natural harbor, and unique position as a meeting point of Chinese and international cultures. Hong Kong operates under the "one country, two systems" framework, maintaining its own legal system based on English common law, currency, and immigration policies separate from mainland China. The city developed as a major British trading port and transformed into one of Asia''s leading financial centers, housing major banks, stock exchanges, and investment firms. Victoria Harbour provides one of the world''s most spectacular urban waterfronts. Cantonese is the primary language, though English is widely spoken in business, legal, and government contexts. Hong Kong''s cuisine, particularly dim sum and seafood, is world-renowned and considered among Asia''s finest. The city offers excellent transportation, world-class healthcare at private hospitals, and exceptional connectivity. Political changes since 2020 have affected the city''s governance and seen significant emigration waves to the UK, Canada, and Australia. Hong Kong remains an important financial hub with significant opportunities, though the evolving political situation requires careful consideration for those considering relocation. The cost of living, particularly housing, is among the world''s highest.'
),
(
	'Europe', 'Czechia', 'CZ',
	'https://flagcdn.com/cz.svg',
	'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
	'A Central European cultural gem centered on fairytale Prague, one of Europe''s most beautiful cities. Czechia combines EU membership, affordable living, world-class beer culture, and a growing technology sector.

## Key Highlights
- Fairytale Prague with world-class medieval architecture
- Affordable EU living with exceptional quality of life
- World-renowned beer culture and growing startup ecosystem',
	'Czechia (officially the Czech Republic) is a Central European nation landlocked between Germany, Austria, Slovakia, and Poland, with Prague as its capital and one of Europe''s most architecturally magnificent cities. Prague''s historic center, largely undamaged during World War II, features stunning Gothic, Baroque, and Art Nouveau architecture across its bridges, castles, and cobblestone old town. Czechia joined the EU in 2004, providing residents with access to the single market and freedom of movement, though the country retains its own currency (Czech Koruna). The cost of living is considerably lower than Western Europe, making it attractive for digital nomads and remote workers maintaining Western incomes. Czech beer is world-renowned as among the finest in the world, and the country has the highest per capita beer consumption globally. The economy is diversified with strong manufacturing, particularly automotive, alongside growing technology and startup sectors in Prague and Brno. Czech people are known for their directness, dry humor, and strong secular traditions. Learning Czech is helpful but English is widely spoken among younger generations and in business contexts. The country offers excellent public transportation, good healthcare, and a high quality of life relative to cost. Czechia''s cultural richness, historical depth, and central European location make it an increasingly popular destination for expats and digital nomads seeking affordable EU living.'
),
(
	'Europe', 'Slovakia', 'SK',
	'https://flagcdn.com/sk.svg',
	'https://images.unsplash.com/photo-1564689510742-4e9c7584c1f8?auto=format&fit=crop&w=800&q=80',
	'A Central European hidden gem with dramatic mountain landscapes and hundreds of medieval castles. Slovakia''s EU and Eurozone membership, combined with Bratislava''s unique tri-border location, makes it an underrated expat destination.

## Key Highlights
- Dramatic Tatra Mountains and hundreds of preserved medieval castles
- Affordable EU/Eurozone living with a growing economy
- Bratislava''s unique proximity to Vienna and Budapest',
	'Slovakia is a Central European nation that gained independence in 1993 following the peaceful "Velvet Divorce" from Czechoslovakia, and has since developed into a successful EU and Eurozone member. Bratislava, the compact capital, sits uniquely at the junction of three countries (Slovakia, Austria, and Hungary), with Vienna and Budapest each less than an hour away — making it ideal for those wishing to access multiple major European cities easily. Slovakia is characterized by dramatic natural landscapes including the High Tatra Mountains, offering some of Central Europe''s best skiing and hiking, alongside hundreds of medieval castles scattered across the countryside. The country has attracted significant foreign manufacturing investment, particularly in the automotive sector, with major plants operated by Volkswagen, Kia, and Stellantis. The cost of living is among the lowest in the Eurozone, making it extremely attractive for remote workers and digital nomads maintaining incomes in stronger currencies. Slovak people are known for warmth and hospitality, and English is growing among younger generations and professionals. Healthcare is adequate and the public education system is solid. Bratislava''s restaurant and bar scene is excellent, and the cultural scene is developing rapidly. The country''s proximity to Vienna also means residents have easy access to one of Europe''s greatest cultural capitals.'
),
(
	'Europe', 'Bulgaria', 'BG',
	'https://flagcdn.com/bg.svg',
	'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80',
	'The EU''s most affordable country combines Black Sea beaches, ancient Thracian history, and Balkan mountain landscapes. Bulgaria offers some of Europe''s lowest living costs alongside EU membership and a rapidly growing technology sector.

## Key Highlights
- EU''s most affordable cost of living with flat 10% income tax
- Beautiful Black Sea coastline and world-class ski resorts
- Growing tech sector with strong IT talent pool',
	'Bulgaria is a Southeastern European nation and EU member state bordering Romania, Serbia, North Macedonia, Greece, and Turkey, with significant Black Sea coastline. Sofia, the capital, is a pleasant mid-sized city with Roman ruins beneath its streets, an impressive Alexander Nevsky Cathedral, and a growing tech scene. Bulgaria holds the distinction of being the EU''s most affordable country, with living costs dramatically lower than Western Europe, making it particularly attractive for retirees, remote workers, and entrepreneurs. The Black Sea coast features popular resort towns like Sunny Beach and Varna, attracting summer tourists from across Europe. The Balkan and Rila Mountains offer excellent skiing at world-class resorts, particularly Bansko, at a fraction of the cost of Western European alternatives. Bulgaria has a rapidly growing IT sector, with Sofia becoming an emerging tech hub with companies providing services across Europe. The country has a flat income tax rate of 10%, one of the lowest in the EU, and a flat corporate tax rate of 10%. Bulgarian is a South Slavic language using the Cyrillic alphabet, and English proficiency is growing rapidly among younger people in urban areas. Challenges include bureaucratic inefficiencies and variable service quality outside major cities. Bulgaria offers compelling value against a backdrop of Mediterranean-influenced climate and a rich cultural heritage from ancient Thracian, Greek, Roman, and Byzantine civilizations.'
),
(
	'Europe', 'Romania', 'RO',
	'https://flagcdn.com/ro.svg',
	'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
	'Home to Transylvania''s Gothic castles, the Carpathian Mountains, and vibrant Bucharest, Romania offers EU membership at some of Europe''s most affordable prices. A rapidly growing tech sector is turning it into Central Europe''s next startup destination.

## Key Highlights
- Iconic Transylvania with Bran Castle and Carpathian forests
- Affordable EU living with Europe''s fastest internet speeds
- Booming technology industry and rapidly modernizing economy',
	'Romania is a Southeastern European nation and EU member state with a rich cultural heritage blending Latin, Slavic, and Dacian traditions. The country is internationally famous for Transylvania, with its Gothic castles, medieval towns, and legends — Bran Castle near Brașov being the most visited landmark. Bucharest, the capital, earned the nickname "Little Paris" in the early 20th century for its grand boulevards and architecture, and today hosts a growing startup ecosystem and lively arts scene. Romania has some of Europe''s fastest internet speeds and highest broadband penetration, supporting a thriving IT and software development sector. The cost of living is among the lowest in the EU, making Bucharest and other cities extremely attractive for digital nomads who earn in stronger currencies. The Carpathian Mountains, Black Sea coast, and Danube Delta provide extraordinary natural diversity. The Danube Delta, one of Europe''s largest wetland areas, is a UNESCO World Heritage site of exceptional biodiversity. Romanian is a Romance language with significant Latin roots, making it more accessible to speakers of Spanish, French, Italian, or Portuguese. English proficiency is growing rapidly, particularly among younger generations, though it remains variable outside urban centers. Romania''s combination of history, natural beauty, affordability, and modernizing economy makes it one of Eastern Europe''s most compelling destinations.'
),
(
	'Europe', 'Luxembourg', 'LU',
	'https://flagcdn.com/lu.svg',
	'https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?auto=format&fit=crop&w=800&q=80',
	'Europe''s wealthiest nation per capita, Luxembourg punches far above its weight as a global financial center and EU institutional hub. This tiny Grand Duchy offers exceptional salaries, trilingual culture, and unparalleled access to the heart of Europe.

## Key Highlights
- Highest GDP per capita in the European Union
- Major global financial center and EU institutional hub
- Multilingual culture (Luxembourgish, French, German)',
	'Luxembourg is one of the world''s smallest and wealthiest nations, a Grand Duchy nestled between Belgium, France, and Germany in the heart of Western Europe. Luxembourg City, the capital, is a UNESCO World Heritage site built atop dramatic sandstone cliffs, featuring medieval fortifications alongside modern glass banking towers. The country boasts the highest GDP per capita in the EU, driven by its position as a leading European financial center hosting major banks, investment funds, and fintech companies. Luxembourg hosts several key European Union institutions, including the European Court of Justice and the European Court of Auditors, making it a hub for EU policy. The country is officially trilingual, with Luxembourgish, French, and German all recognized, and English very widely spoken in business. Luxembourg''s small size makes it extremely convenient to live and work, with excellent public transportation and connectivity to neighboring countries. The country''s tax policies have historically attracted international businesses, though regulations have tightened in response to EU directives. Despite high salaries, the cost of living — particularly housing — is extremely expensive. The country''s multicultural population (nearly half are non-Luxembourgish) creates a highly international environment. Luxembourg''s exceptional connectivity to Brussels, Paris, and Frankfurt makes it ideal for those working in European business and finance.'
),
(
	'Africa', 'South Africa', 'ZA',
	'https://flagcdn.com/za.svg',
	'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
	'Africa''s most developed economy combines Cape Town''s stunning natural beauty, world-class safari experiences, and remarkable cultural diversity. South Africa offers extraordinary wildlife, vibrant cities, and some of Africa''s best infrastructure.

## Key Highlights
- Iconic Cape Town beneath Table Mountain with vibrant culture
- World-class safari destinations and diverse Big Five wildlife
- Africa''s most developed infrastructure and economy',
	'South Africa is Africa''s most industrially developed nation, located at the southernmost tip of the African continent where the Atlantic and Indian Oceans meet. Cape Town is one of the world''s most dramatically beautiful cities, built below the iconic Table Mountain with stunning beaches and a vibrant cultural and culinary scene. Johannesburg is the economic powerhouse, while Pretoria serves as the administrative capital and Durban as the major coastal port city. South Africa is renowned for world-class safari experiences in Kruger National Park and numerous private game reserves offering encounters with the "Big Five." The country has 11 official languages reflecting its extraordinary cultural diversity, and is often called the "Rainbow Nation" following its peaceful transition from apartheid to democracy under Nelson Mandela in 1994. The economy is the most diversified on the continent, with mining, finance, tourism, manufacturing, and agriculture all significant. The cost of living is generally low compared to developed nations, making South Africa attractive for retirees and remote workers earning in foreign currencies. The country faces significant challenges including high unemployment, economic inequality, and variable safety standards in some urban areas. Excellent wine regions, particularly in the Western Cape, produce world-class vintages at very affordable prices. South Africa''s extraordinary natural beauty and cultural richness create an unparalleled quality of life for those who navigate its complexities.'
),
(
	'Europe', 'Slovenia', 'SI',
	'https://flagcdn.com/si.svg',
	'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
	'A tiny Central European gem with extraordinary natural beauty — from Lake Bled to the Julian Alps and Adriatic coast. Slovenia packs incredible diversity into a small territory with EU membership and exceptional sustainability credentials.

## Key Highlights
- Iconic Lake Bled surrounded by the Julian Alps
- EU member with excellent sustainability and green credentials
- Surprising diversity: Alps, caves, wine regions, and coastline in one country',
	'Slovenia is a small Central European nation that surprises visitors with how much it packs into its compact territory — just 20,000 square kilometers of stunning Alpine lakes, dramatic karst caves, wine regions, and a short but beautiful Adriatic coastline. Ljubljana, the charming capital, is consistently ranked among Europe''s most livable and sustainable cities, with a car-free center, vibrant cafe culture, and excellent quality of life. Lake Bled, with its island church and dramatic castle backdrop, is one of Europe''s most romantic and photographed landscapes. Slovenia was among the most prosperous republics of the former Yugoslavia and transitioned successfully to a market economy, joining both the EU and Eurozone in 2004 and 2007 respectively. The country consistently performs well in environmental sustainability rankings and has ambitious green energy goals. The economy is diversified with strengths in manufacturing, pharmaceuticals, and tourism. Slovenians have high English proficiency and are known for their outdoors-oriented, active lifestyle. The cost of living is moderate by EU standards, slightly lower than Western European countries. Slovenia''s geographic position makes it excellent for exploring neighboring Italy, Austria, Croatia, and Hungary. The country''s extraordinary natural landscapes, including Triglav National Park and the Škocjan Caves UNESCO World Heritage site, offer world-class outdoor pursuits across all seasons.'
),
(
	'Europe', 'Latvia', 'LV',
	'https://flagcdn.com/lv.svg',
	'https://images.unsplash.com/photo-1549614512-1a9fcb9a851b?auto=format&fit=crop&w=800&q=80',
	'The Baltic state with Europe''s finest Art Nouveau architecture in Riga, surrounded by amber Baltic beaches and ancient forests. Latvia offers EU membership, affordable living, and a growing fintech and digital economy.

## Key Highlights
- Riga''s UNESCO-listed Art Nouveau architecture quarter
- Affordable Baltic living with EU membership
- Growing fintech and IT sector',
	'Latvia is a Baltic state on the eastern shore of the Baltic Sea, sharing borders with Estonia, Lithuania, Russia, and Belarus. Riga, the capital and the Baltic''s largest city, is renowned for its extraordinary Art Nouveau architecture — with over 800 buildings in this style, one of the world''s most concentrated collections — alongside a beautifully preserved medieval old town designated as a UNESCO World Heritage site. Latvia joined the EU and NATO in 2004 and adopted the Euro in 2014, fully integrating into the Western political and economic community. The country has developed a significant fintech and IT sector, particularly in Riga, with companies providing financial technology services across Europe. The Baltic coastline features beautiful sandy beaches and amber-producing shores that gave the Baltic Sea its name. Latvian forests cover nearly 60% of the country''s territory, providing extraordinary natural environments. The cost of living is lower than Western Europe while maintaining solid quality of life. Latvian is the official language, though Russian is widely spoken by a significant minority population and English proficiency is high among younger generations. The country''s small population (under 2 million) creates a tight-knit society where networking is highly effective. Latvia has made significant investments in digital infrastructure and education, making it competitive in the knowledge economy and increasingly attractive to tech talent from across the EU.'
),
(
	'Europe', 'Lithuania', 'LT',
	'https://flagcdn.com/lt.svg',
	'https://images.unsplash.com/photo-1553408619-26c4abb4d22f?auto=format&fit=crop&w=800&q=80',
	'The Baltic state with a stunning baroque capital and the largest surviving medieval old town in Northern Europe. Lithuania combines EU membership, affordable living, and one of the EU''s fastest-growing fintech sectors.

## Key Highlights
- Vilnius: UNESCO-listed medieval old town with baroque architecture
- EU''s fastest growing fintech and licensed payments sector
- Affordable living with EU membership and a welcoming startup scene',
	'Lithuania is the southernmost and largest of the three Baltic states, with Vilnius as its capital and one of the best-preserved medieval old towns in Northern Europe, designated as a UNESCO World Heritage site for its extensive baroque architecture. Lithuania was the last European country to convert to Christianity in 1387, and its ancient pagan heritage continues to influence local culture and traditions. The country joined the EU and NATO in 2004 and adopted the Euro in 2015. Lithuania has emerged as a significant European fintech hub, with Vilnius hosting dozens of licensed payment institutions and electronic money firms that chose it as their EU passporting base. The city''s startup ecosystem is growing rapidly, supported by EU funding and government innovation programs. The cost of living is lower than Western Europe, making it attractive for remote workers and entrepreneurs. Lithuanian is the official language and one of the oldest living Indo-European languages. English is widely spoken among younger people and professionals. The country''s natural landscapes include the beautiful Curonian Spit (a UNESCO World Heritage site shared with Russia), extensive forests, and thousands of lakes. The Curonian Spit offers unique dune landscapes and traditional fishing culture. Lithuania''s relatively small size (under 3 million people) creates a close-knit business community where relationships matter greatly.'
),
(
	'Asia', 'China', 'CN',
	'https://flagcdn.com/cn.svg',
	'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
	'The world''s second largest economy and most populous nation offers unprecedented scale of opportunity alongside ancient cultural depth. From the Great Wall to Shanghai''s skyline, China presents a civilization of extraordinary complexity.

## Key Highlights
- World''s second largest economy with unparalleled market scale
- Extraordinary cultural heritage spanning 5,000 years
- Ultra-modern cities alongside ancient world wonders',
	'China is the world''s most populous nation and second largest economy, representing one of the oldest continuous civilizations on Earth with over 5,000 years of recorded history. Beijing, the capital, houses the Forbidden City, the world''s largest imperial palace complex, alongside Tiananmen Square and ancient temples. Shanghai is Asia''s premier financial and commercial hub, with a spectacular modern skyline along the Bund waterfront. China''s economic transformation over the past four decades has been historically remarkable, lifting hundreds of millions from poverty through manufacturing, technology, and trade. The country leads globally in internet users, electric vehicles, renewable energy capacity, and manufacturing. China operates an internet behind the "Great Firewall," requiring VPNs to access Google, Facebook, and many international websites. Mandarin Chinese is the official language, and learning it significantly opens professional and social opportunities. For foreigners, navigating China''s regulatory environment, visa system, and business culture requires patience and local knowledge. The country offers extraordinary regional diversity, from tropical Hainan Island to the Tibetan Plateau, the Gobi Desert, and the karst mountains of Guilin. China''s unique position as both an ancient civilization and ultramodern technological powerhouse makes it a fascinating but complex destination requiring significant preparation.'
),
(
	'Asia', 'Mongolia', 'MN',
	'https://flagcdn.com/mn.svg',
	'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
	'The world''s least densely populated country offers vast steppes, authentic nomadic culture, and the legacy of Genghis Khan''s legendary empire. Mongolia''s raw, untouched landscapes make it one of Earth''s last great wilderness frontiers.

## Key Highlights
- World''s least densely populated country with vast pristine steppe
- Rich nomadic heritage and authentic traditional culture
- Unique adventure opportunities from horseback riding to eagle hunting',
	'Mongolia is a landlocked country in Central and East Asia sandwiched between Russia and China, the world''s least densely populated nation with vast steppes, the Gobi Desert, and rugged mountains covering a territory larger than Western Europe. Ulaanbaatar, the capital, is home to nearly half the country''s population and sits at 1,350 meters altitude, making it one of the world''s coldest capital cities. Mongolian nomadic culture, with its tradition of moving with herds across the steppe and living in gers (yurts), remains alive and authentic. Genghis Khan founded the largest contiguous land empire in history from the Mongolian steppe in the 13th century, leaving a profound historical legacy visible in national pride and cultural traditions. Mongolia''s economy relies significantly on mining (coal, copper, gold, cashmere), with significant untapped mineral wealth attracting international investment. The country transitioned from a Soviet satellite state to democracy in 1990 and has been developing rapidly since. For adventurous travelers and expats, Mongolia offers extraordinary opportunities for horseback riding, eagle hunting with Kazakh eagle hunters, and experiencing nomadic hospitality. The extreme continental climate features brutal winters down to -40°C and hot summers. English is growing among younger people and those in the mining and tourism industries. Mongolia presents unique opportunities for those willing to embrace its challenges.'
),
(
	'Europe', 'Liechtenstein', 'LI',
	'https://flagcdn.com/li.svg',
	'https://images.unsplash.com/photo-1476929884616-23e8d302bc89?auto=format&fit=crop&w=800&q=80',
	'The world''s sixth smallest country, nestled between Switzerland and Austria in the Rhine Valley. Liechtenstein is a prosperous Alpine principality with a surprising industrial base, low tax rates, and stunning mountain scenery.

## Key Highlights
- Scenic Alpine principality with medieval Vaduz Castle
- Among Europe''s wealthiest nations per capita
- Low-tax environment with strong manufacturing and financial sector',
	'Liechtenstein is a tiny principality of just 160 square kilometers nestled between Switzerland and Austria in the Rhine Valley, yet it ranks among the world''s wealthiest nations per capita with a highly developed financial services sector and substantial manufacturing base. Vaduz, the capital, features the iconic Vaduz Castle on a hill overlooking the Rhine, alongside a small but impressive collection of museums and galleries. Despite its size, Liechtenstein has a remarkably diverse economy anchored in precision manufacturing (dental products, heating equipment, power tools), financial services, and ceramics. The country uses the Swiss franc as its currency and has a customs and monetary union with Switzerland. Liechtenstein is a member of the EEA and Schengen Area but not the EU, maintaining significant autonomy. It offers extremely low tax rates, attracting international businesses and wealthy residents. The principality''s small size (just 38,000 people) makes it exceptionally exclusive and intimate. The Alpine landscapes are beautiful, offering skiing, hiking, and outdoor activities across multiple seasons. Immigration and residency are strictly controlled, with very limited pathways for foreign nationals. Liechtenstein''s political stability, extraordinary prosperity, and natural beauty make it a fascinating if highly exclusive destination that deserves more attention from those exploring Central Europe.'
),
(
	'Asia', 'Saudi Arabia', 'SA',
	'https://flagcdn.com/sa.svg',
	'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
	'Rapidly transforming under Vision 2030, Saudi Arabia combines extraordinary ancient heritage with ultramodern development. The Kingdom offers tax-free income, world-class infrastructure investment, and an unprecedented national reinvention.

## Key Highlights
- Tax-free income with massive Vision 2030 infrastructure investment
- Extraordinary ancient heritage including UNESCO-listed AlUla
- Unprecedented modernization opening the Kingdom to the world',
	'Saudi Arabia is the largest country in the Middle East, occupying the majority of the Arabian Peninsula, and holds the world''s second largest proven oil reserves. Riyadh, the capital, is a modern metropolis undergoing rapid transformation under Crown Prince Mohammed bin Salman''s Vision 2030 program, which seeks to diversify the economy beyond oil through tourism, entertainment, technology, and finance. The country has undertaken remarkable social reforms since 2017, including allowing women to drive, opening cinemas, and developing a tourism industry that was previously nonexistent. Saudi Arabia offers zero personal income tax, attracting skilled expatriate workers across energy, finance, healthcare, education, and construction sectors. The country is developing extraordinary projects including NEOM, a planned futuristic city in the northwest, and Red Sea tourism developments on pristine coastline. Ancient heritage sites including AlUla, home to Nabataean tombs comparable to Petra in Jordan, are becoming major international attractions. Islamic law and customs shape public life, requiring respectful observance by expatriates. The weather is extremely hot, particularly in summer, with inland temperatures regularly exceeding 45°C. The Kingdom''s transformation from a largely closed society to one actively welcoming tourists and skilled workers represents one of the most significant changes in the region''s modern history, creating genuine opportunities for those willing to adapt.'
),
(
	'Asia', 'Vietnam', 'VN',
	'https://flagcdn.com/vn.svg',
	'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
	'A Southeast Asian gem of extraordinary beauty — from Ha Long Bay''s limestone karsts to the ancient streets of Hoi An. Vietnam offers unbeatable affordability, rich history, world-class street food, and one of Asia''s most vibrant expat communities.

## Key Highlights
- Breathtaking Ha Long Bay and UNESCO-listed ancient town of Hoi An
- Exceptional affordability making it a top digital nomad destination
- Rich culture, delicious cuisine, and genuinely warm hospitality',
	'Vietnam is a long, narrow Southeast Asian nation stretching 1,650 kilometers along the eastern edge of the Indochina Peninsula, offering extraordinary geographical diversity from the northern mountains and terraced rice fields of Sapa to the UNESCO-listed limestone karsts of Ha Long Bay, the ancient trading town of Hoi An, and the tropical beaches of Phu Quoc. Hanoi, the capital in the north, preserves colonial French architecture and ancient Old Quarter streets, while Ho Chi Minh City (Saigon) in the south is a bustling modern metropolis. Vietnam has undergone remarkable economic transformation since the Doi Moi reforms of 1986, emerging as one of Southeast Asia''s fastest growing economies. The cost of living is extraordinarily low by international standards, making Vietnam one of the world''s most popular digital nomad destinations, particularly Da Nang and Hoi An. Vietnamese cuisine is celebrated globally for its fresh herbs, complex broths, and regional diversity, with dishes like pho, banh mi, and fresh spring rolls having wide international recognition. The country offers excellent street food culture, vibrant cafe scenes, and a genuinely warm welcome to foreigners. Vietnamese is the official language, and English is growing especially in urban and tourist areas. Visa regulations have been easing, with e-visa available for many nationalities. Vietnam''s combination of natural beauty, cultural depth, affordability, and dynamism makes it exceptional for both short visits and long-term stays.'
),
(
	'South America', 'Argentina', 'AR',
	'https://flagcdn.com/ar.svg',
	'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
	'The land of tango, Malbec, and Patagonia offers one of South America''s richest cultural experiences. Despite economic challenges, Argentina''s sophisticated Buenos Aires, extraordinary natural landscapes, and warm people create an irresistible destination.

## Key Highlights
- World-class Malbec wine and legendary Argentine beef cuisine
- Dramatic Patagonia with glaciers and some of the world''s finest wilderness
- Vibrant Buenos Aires with world-class tango, culture, and nightlife',
	'Argentina is South America''s second largest country, extending from the subtropical north to the subarctic reaches of Patagonia and Tierra del Fuego, encompassing extraordinary natural diversity. Buenos Aires, the capital, is one of Latin America''s most sophisticated and European-influenced cities, with world-class restaurants, tango culture, vibrant nightlife, and a passionate football culture. Argentina is renowned globally for its premium Malbec wines from Mendoza and exceptional beef, with Argentine asado (barbecue) culture deeply embedded in national identity. Patagonia in the south offers some of the planet''s most dramatic landscapes: Perito Moreno Glacier, the jagged Fitz Roy massif, and pristine wilderness that draws adventurers from around the world. The country has a highly educated, largely European-descended population with strong cultural and intellectual traditions. Argentina has faced persistent economic challenges including chronic inflation and currency instability, which has paradoxically made it very affordable for those earning in foreign currencies — digital nomads and remote workers can live extremely well on modest US dollar incomes. Spanish is the official language, with the distinctive Rioplatense accent. Despite economic challenges, Argentina''s cultural richness, natural beauty, food culture, and warm people make it deeply appealing and one of South America''s most compelling destinations.'
),
(
	'South America', 'Brazil', 'BR',
	'https://flagcdn.com/br.svg',
	'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
	'South America''s giant captivates with Carnival, the Amazon, and Rio de Janeiro''s iconic beaches. Brazil offers the continent''s largest economy, extraordinary biodiversity, vibrant culture, and a warmth of spirit unmatched anywhere in the world.

## Key Highlights
- Iconic Rio de Janeiro, Carnival celebrations, and Copacabana
- The Amazon: world''s largest rainforest and greatest biodiversity
- Vibrant Brazilian culture and extraordinarily warm, welcoming people',
	'Brazil is South America''s largest and most populous nation, the world''s fifth largest country, and the dominant economic power of the continent. Rio de Janeiro, with its stunning natural setting between mountains and sea, is globally iconic for Carnival, the statue of Christ the Redeemer, Copacabana beach, and samba culture. São Paulo, the economic capital, is Latin America''s largest city and financial hub, with world-class restaurants, museums, and business opportunities. The Amazon Basin covers much of Brazil''s interior and represents the world''s largest tropical rainforest, containing approximately 10% of all species on Earth. Brazil is enormously diverse, with indigenous, European, African, and Asian influences creating a unique multicultural identity. The country has the 11th largest economy in the world, with significant sectors in agriculture, mining, manufacturing, and a rapidly growing technology sector. São Paulo''s tech scene and startup ecosystem is among Latin America''s most dynamic. Portuguese is Brazil''s official language, and the country is linguistically distinct from its Spanish-speaking neighbors. The cost of living varies dramatically by city and region. Brazil offers visa pathways for skilled workers, investors, and digital nomads through its Digital Nomad Visa program. The country''s extraordinary cultural richness, natural diversity, and the warmth of its people make it one of the world''s most captivating destinations.'
),
(
	'Asia', 'India', 'IN',
	'https://flagcdn.com/in.svg',
	'https://images.unsplash.com/photo-1524492412937-b28074a47d70?auto=format&fit=crop&w=800&q=80',
	'The world''s most populous democracy offers a civilization of extraordinary depth, diversity, and scale. From the Taj Mahal to Bangalore''s Silicon Valley, India''s combination of ancient culture and technological ambition is reshaping the 21st century.

## Key Highlights
- World''s largest democracy with extraordinary cultural diversity
- Bangalore and Hyderabad as global information technology hubs
- Iconic monuments including the Taj Mahal and thousands of ancient temples',
	'India is the world''s most populous country and largest democracy, a civilization of extraordinary depth spanning over 5,000 years of continuous history. The country is home to an astonishing diversity of languages (22 officially recognized), religions, cuisines, and cultural traditions across 28 states. New Delhi is the capital, while Mumbai is the financial and entertainment capital, and Bengaluru (Bangalore) has become one of the world''s major technology hubs — often called the "Silicon Valley of India." India is the world''s third largest startup ecosystem and a major force in global information technology, pharmaceuticals, finance, and manufacturing. The Taj Mahal in Agra, built by Emperor Shah Jahan in the 17th century, is arguably the world''s most recognizable monument, while Rajasthan''s palaces, Kerala''s backwaters, and the Himalayan peaks offer extraordinary additional attractions. Indian cuisine encompasses an astonishing variety of regional specialties, from the rich Mughal-influenced dishes of the north to the coconut-based curries of the south. The cost of living is very low by international standards, making India excellent for budget-conscious expats. English is widely spoken in business and education, a legacy of British colonial history, making India very accessible to English-speaking professionals. India''s rapid economic growth, young population, and tech-forward culture make it one of the 21st century''s most dynamic societies.'
),
(
	'Asia', 'Malaysia', 'MY',
	'https://flagcdn.com/my.svg',
	'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
	'A multiethnic Southeast Asian gem where Malay, Chinese, and Indian cultures create extraordinary cuisine and vibrant diversity. Kuala Lumpur offers modern infrastructure, affordable living, and the Malaysia My Second Home program.

## Key Highlights
- Extraordinary multicultural cuisine ranked among Asia''s finest
- Affordable modern living with the Malaysia My Second Home program
- Borneo''s ancient rainforests and world-class marine ecosystems',
	'Malaysia is a Southeast Asian nation of remarkable cultural diversity, split between the Malay Peninsula and the northern portion of the island of Borneo. Kuala Lumpur, the capital, is a modern metropolis dominated by the iconic Petronas Twin Towers, with excellent infrastructure, world-class shopping, and diverse food offerings at very affordable prices. Malaysia''s multicultural society — comprising Malay, Chinese, Indian, and indigenous communities — creates one of the world''s most diverse and celebrated food cultures, with hawker centers offering extraordinary variety. The country operates the MM2H (Malaysia My Second Home) program, one of Southeast Asia''s most established long-term residency programs for retirees and remote workers. Malaysian Borneo (Sabah and Sarawak) offers ancient rainforests, diverse wildlife including orangutans and pygmy elephants, and some of the world''s best diving at Sipadan. The cost of living is very reasonable, with quality meals available for a few dollars and comfortable accommodation at a fraction of Western prices. English is widely spoken as a business and educational language, making Malaysia very accessible to English speakers. The country is predominantly Muslim, and Islamic law applies to Muslim residents. Malaysia''s combination of modernity, affordability, natural beauty, and cultural richness makes it consistently popular among expats, particularly retirees and digital nomads.'
),
(
	'Europe', 'Moldova', 'MD',
	'https://flagcdn.com/md.svg',
	'https://images.unsplash.com/photo-1627408236286-3f36d5e0d9d7?auto=format&fit=crop&w=800&q=80',
	'Europe''s least visited country harbors a remarkable secret: thousands of cave wine cellars making it one of the world''s most surprising wine destinations. Moldova is modernizing rapidly with EU candidate status driving significant reform.

## Key Highlights
- World-class wine country with cave cellars holding millions of bottles
- Europe''s most affordable destination for budget travelers
- EU candidate status driving rapid modernization and reform',
	'Moldova is a small landlocked Eastern European nation sandwiched between Romania and Ukraine, often cited as Europe''s least visited country despite having genuine attractions for curious travelers. Chișinău, the capital, is a pleasant city with Soviet-era architecture, excellent restaurants, and an increasingly cosmopolitan atmosphere as the country modernizes. The country''s extraordinary wine culture is its most compelling draw — Cricova and Mileștii Mici operate the world''s largest wine cellars, with tens of kilometers of underground tunnels carved into limestone holding millions of bottles. Moldova consistently produces excellent wines, particularly from indigenous Fetească grape varieties, at astonishingly low prices. The country received EU candidate status in 2022, following Russia''s invasion of Ukraine, and is working toward reforms that may lead to EU membership within the next decade. This prospect is driving modernization across governance, infrastructure, and digital services. Moldova is home to the breakaway region of Transnistria, a Soviet-era enclave along the Dniester River that operates quasi-independently. The cost of living is among Europe''s lowest, and the country offers genuine hospitality. Romanian-speaking Moldovans can travel on Romanian passports, granting EU rights. The country faces challenges including poverty, significant emigration, and dependency on remittances from the diaspora, but offers remarkable character.'
),
(
	'Europe', 'Albania', 'AL',
	'https://flagcdn.com/al.svg',
	'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=800&q=80',
	'The Balkans'' hidden gem is emerging from decades of isolation to reveal stunning Adriatic and Ionian coastlines, preserved Ottoman old towns, and Europe''s most affordable lifestyle. Albania''s natural beauty and authentic hospitality are extraordinary.

## Key Highlights
- Pristine Ionian and Adriatic beaches at a fraction of European prices
- Preserved Ottoman old towns and dramatic mountain landscapes
- EU candidate country with very affordable and authentic lifestyle',
	'Albania is a small Southeastern European nation on the Balkan Peninsula, bordered by the Adriatic and Ionian Seas to the west, with a coastline increasingly recognized as one of Europe''s most beautiful and undiscovered. Tirana, the capital, has transformed from a grey Communist-era city into a colorful, dynamic metropolis with excellent restaurants, vibrant nightlife, and a growing cafe culture. Albania''s Riviera, stretching south along the Ionian coast, features crystal-clear turquoise waters, dramatic clifftop villages, and beaches that rival those of Croatia or Greece at a fraction of the cost. The country''s interior conceals remarkable treasures: Gjirokastër''s UNESCO-listed Ottoman old town, the ancient ruins of Butrint, and the Albanian Alps offering challenging trekking routes. Albania was one of the most isolated Communist states in the world until 1991 and is still working through its post-Communist transition, though progress has been significant. The country has EU candidate status, driving governance and institutional reforms. The cost of living is among Europe''s lowest, making it very attractive for budget-conscious digital nomads — Albania has become an increasingly popular nomad destination. Albanians are known for their extraordinary hospitality: the concept of "besa" (sacred guest protection) remains central to cultural identity. Albanian is the official language; Italian and English are widely spoken in tourism areas. Albania''s combination of beauty, affordability, and authenticity is genuinely exceptional.'
),
(
	'Asia', 'Georgia', 'GE',
	'https://flagcdn.com/ge.svg',
	'https://images.unsplash.com/photo-1565008887078-5e4f9a8cd5e8?auto=format&fit=crop&w=800&q=80',
	'The Caucasus crossroads of Europe and Asia offers the world''s oldest winemaking tradition, stunning mountain landscapes, and legendary hospitality. Tbilisi''s bohemian charm has made Georgia a global digital nomad hotspot.

## Key Highlights
- World''s oldest winemaking tradition with unique qvevri clay vessels
- Stunning Greater Caucasus mountains and ancient cave cities
- Extremely welcoming visa-free policy and flat 20% income tax',
	'Georgia is a small Caucasian nation at the crossroads of Europe and Asia, situated south of the Greater Caucasus mountains, bordering Russia, Armenia, Azerbaijan, and Turkey. Tbilisi, the capital, is a city of extraordinary bohemian charm with a strikingly diverse architectural heritage from ancient Persian to Soviet-era and contemporary design, a vibrant arts scene, and a world-class electronic music scene that has earned Tbilisi a reputation as one of Europe''s most exciting emerging cities. Georgia is widely recognized as the world''s oldest wine region, with evidence of winemaking dating back 8,000 years, using the unique qvevri clay vessels buried underground for fermentation and aging. The country harbors remarkable natural and cultural heritage including the cave city of Uplistsikhe, the ancient capital Mtskheta, and the spectacular Kazbegi region in the Greater Caucasus mountains. Georgia offers one of the world''s most welcoming visa policies, allowing citizens of most nations to stay for up to a year without a visa, alongside a very low flat tax rate, making it extremely attractive for remote workers and entrepreneurs. The cost of living is low, the food is exceptional (khinkali dumplings, khachapuri cheese bread), and Georgians have a legendary reputation for hospitality. English is growing rapidly among younger people and the significant expat community that has built up in Tbilisi in recent years.'
),
(
	'Asia', 'Israel', 'IL',
	'https://flagcdn.com/il.svg',
	'https://images.unsplash.com/photo-1544948982-5aabd0a81ce4?auto=format&fit=crop&w=800&q=80',
	'The "Startup Nation" is one of the world''s most innovative countries, punching far above its weight in technology, biotech, and venture capital. Israel offers ancient holy sites, Mediterranean beaches, and a dynamic society shaped by extraordinary cultural convergence.

## Key Highlights
- World-leading startup ecosystem and innovation culture
- Ancient holy sites sacred to three world religions
- Mediterranean beaches alongside vibrant modern Tel Aviv',
	'Israel is a small Middle Eastern nation on the eastern Mediterranean coast, occupying one of the world''s most historically and religiously significant territories. Jerusalem, home to the Western Wall, Church of the Holy Sepulchre, and al-Aqsa Mosque, is sacred to Judaism, Christianity, and Islam simultaneously. Tel Aviv, the modern commercial capital, is a sun-drenched Mediterranean city with excellent beaches, world-class restaurants, vibrant nightlife, and one of the world''s most dynamic startup ecosystems. Israel is nicknamed the "Startup Nation" for its extraordinarily high concentration of technology startups and venture capital investment relative to its size, with particular strengths in cybersecurity, agriculture technology, medical devices, and artificial intelligence. The country''s mandatory military service for most citizens creates a culture of resourcefulness and leadership that contributes to entrepreneurial success. Hebrew is the official language alongside Arabic; English is widely spoken in business and urban environments. The cost of living in Tel Aviv is among the world''s highest, particularly for housing. Israel''s geopolitical situation in the Middle East requires awareness of security considerations and regional dynamics. The country has excellent universities, world-class healthcare, and a high standard of living. Israeli society is diverse, comprising Jewish Israelis from many national backgrounds, Arab Israelis, and various religious communities, creating a uniquely complex and vibrant culture shaped by the world''s most ancient histories.'
),
(
	'North America', 'Bahamas', 'BS',
	'https://flagcdn.com/bs.svg',
	'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
	'A Caribbean paradise of 700 islands with crystal-clear waters and iconic pink sand beaches. The Bahamas offers zero income tax, an established offshore financial sector, and a luxury lifestyle just 50 miles from Miami.

## Key Highlights
- Crystal-clear turquoise waters and famous pink sand beaches
- Zero income, capital gains, and wealth taxes
- Strategic location just 50 miles from Florida with USD economy',
	'The Bahamas is an archipelago nation of approximately 700 islands and 2,400 cays stretching 760 miles southeast from Florida, offering some of the Caribbean''s most spectacular beaches and marine environments. Nassau, the capital on New Providence Island, is the commercial and financial hub, while Paradise Island hosts luxury resorts and Atlantis, one of the world''s largest resort complexes. The Bahamas is well-established as a tax-advantaged jurisdiction, with no personal income tax, no capital gains tax, no wealth tax, and no inheritance tax, making it attractive to high-net-worth individuals and international businesses. The country has developed a strong financial services sector alongside tourism. The Bahamas Permanent Residency is available to those purchasing property above certain thresholds, providing a pathway to long-term stays. The Out Islands (Family Islands) offer extraordinary off-the-beaten-track experiences with pristine reefs and the famous swimming pigs of Big Major Cay. The climate is warm and sunny year-round, though hurricane season (June-November) poses risks. The cost of living is high, particularly for food and consumer goods, which are largely imported. English is the official language, making the Bahamas very accessible to American and British expatriates seeking a Caribbean lifestyle without language barriers. The proximity to Miami provides excellent air connectivity and easy access to major US services.'
),
(
	'Asia', 'Pakistan', 'PK',
	'https://flagcdn.com/pk.svg',
	'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&w=800&q=80',
	'A South Asian nation of extraordinary contrasts — from the ancient ruins of Mohenjo-daro to the world''s highest mountain ranges. Pakistan offers remarkable landscapes, genuine hospitality, and K2''s dramatic peaks attracting mountaineers worldwide.

## Key Highlights
- K2 and the world''s greatest concentration of high mountains
- Ancient Indus Valley civilization sites (Mohenjo-daro, Harappa)
- Extraordinary hospitality and very affordable living costs',
	'Pakistan is a South Asian country of approximately 230 million people, the world''s fifth most populous nation, sharing borders with India, Afghanistan, Iran, and China. Islamabad, the planned capital, sits in a natural bowl between the Margalla Hills, while Lahore is the cultural heart of Punjab with extraordinary Mughal architecture including the Badshahi Mosque and Lahore Fort. Karachi on the Arabian Sea is the commercial and financial capital. Pakistan encompasses some of the world''s highest mountains — the Karakoram range includes K2 (the world''s second highest peak) alongside over 60 other peaks exceeding 7,000 meters, making it a premier destination for serious mountaineers. The Hunza Valley and Gilgit-Baltistan region offer some of the most spectacular mountain scenery on Earth. Pakistan''s history spans some of the earliest human civilizations, including Mohenjo-daro and Harappa, ancient cities of the Indus Valley Civilization dating to 3,000 BCE. The country faces significant challenges including political instability and variable infrastructure. However, the Pakistani people are extraordinarily hospitable, and travel in the northern mountain regions is considered safe and rewarding. The cost of living is very low by international standards. Urdu is the national language, though English has official status and is used in government, education, and business. Pakistan''s extraordinary natural landscapes remain among the world''s most undervisited and spectacular.'
),
(
	'Asia', 'Qatar', 'QA',
	'https://flagcdn.com/qa.svg',
	'https://images.unsplash.com/photo-1562832135-14a35d25edef?auto=format&fit=crop&w=800&q=80',
	'The world''s wealthiest country per capita, Qatar transformed from a pearl-diving backwater to a global powerhouse in just decades. Doha offers ultramodern architecture, tax-free salaries, and world-class cultural investment.

## Key Highlights
- World''s highest GDP per capita driven by natural gas wealth
- Ultramodern Doha with world-class museums and architecture
- Tax-free income with significant investment in expat lifestyle and culture',
	'Qatar is a small peninsular country in the Persian Gulf, transformed from a modest pearl-fishing economy to one of the world''s wealthiest nations through its vast natural gas reserves. Doha, the capital, is a showcase of ultramodern architecture and urban planning, with the striking Museum of Islamic Art, innovative Pearl-Qatar island development, and world-class cultural institutions. Qatar hosted the 2022 FIFA World Cup, accelerating a massive infrastructure investment program that built world-class stadiums, metro systems, and transformed the capital into a genuine global city. The country''s North Field gas reservoir contains the world''s largest single natural gas reserve, generating extraordinary sovereign wealth managed through the Qatar Investment Authority. Expatriates constitute approximately 88% of Qatar''s population, making it one of the world''s most international societies. The country offers zero personal income tax and excellent infrastructure, making it attractive for skilled workers in energy, finance, healthcare, education, and construction. Islamic law and conservative social norms apply, requiring respect for local customs. The climate is extremely hot in summer, with temperatures regularly exceeding 45°C. Qatar has made significant investments in education through Education City, hosting branches of major American universities. The country''s ambition and willingness to invest in world-class cultural and educational institutions distinguishes it from other Gulf states.'
),
(
	'Europe', 'Bosnia and Herzegovina', 'BA',
	'https://flagcdn.com/ba.svg',
	'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?auto=format&fit=crop&w=800&q=80',
	'A Balkan jewel where Ottoman, Austro-Hungarian, and Yugoslav heritages converge in stunning Sarajevo. Bosnia and Herzegovina offers medieval towns, mountain rivers, and some of Europe''s most affordable and authentic living.

## Key Highlights
- Sarajevo''s extraordinary multicultural Ottoman-era old town
- Stunning mountains with world-class rafting and adventure activities
- One of Europe''s most affordable destinations with EU candidate status',
	'Bosnia and Herzegovina is a Southeastern European nation in the western Balkans, sharing borders with Croatia, Serbia, and Montenegro. Sarajevo, the capital, is one of Europe''s most unique cities, where Ottoman minarets, Austro-Hungarian architecture, and socialist-era apartment blocks converge in a valley surrounded by mountains — a legacy of the city''s complex multicultural history as a meeting point of civilizations. The Old Town (Baščaršija) features cobblestoned streets, traditional craftsmen''s shops, and the central Gazi Husrev-beg mosque dating to the 16th century. Mostar, with its iconic reconstructed Stari Most (Old Bridge) over the Neretva River, is one of the Balkans'' most photographed sites. The country endured a devastating war between 1992 and 1995 but has rebuilt and is developing as an EU candidate, with accession aspirations driving reforms. Bosnia has stunning mountain landscapes for skiing in winter and hiking in summer, and dramatic river canyons for white-water adventures. The Una and Neretva rivers are exceptional for rafting and kayaking. The cost of living is among Europe''s lowest. The country''s three constituent peoples — Bosniaks, Serbs, and Croats — give it linguistic accessibility (mutually intelligible South Slavic languages) and rich cultural diversity. Bosnia''s combination of history, natural beauty, affordability, and authenticity make it one of Europe''s most underrated destinations.'
),
(
	'Africa', 'Egypt', 'EG',
	'https://flagcdn.com/eg.svg',
	'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80',
	'Home to one of humanity''s greatest civilizations, Egypt captivates with the Pyramids of Giza, Nile River culture, and ancient temples spanning thousands of years. A bridge between Africa and the Middle East offering extraordinary history at accessible prices.

## Key Highlights
- Pyramids of Giza and Sphinx: the sole surviving ancient world wonder
- Extraordinary Nile Valley temples and pharaonic heritage
- World-class Red Sea diving and Mediterranean beaches',
	'Egypt is a transcontinental country primarily located in northeastern Africa, with the Sinai Peninsula forming a land bridge into Asia. Cairo, Africa''s largest city, serves as the capital and gateway to ancient civilization. The Pyramids of Giza, just outside Cairo, represent one of humanity''s most extraordinary engineering achievements and the sole surviving wonder of the ancient world. The Nile River, the world''s longest river, flows through Egypt''s eastern desert creating the fertile valley that sustained one of history''s greatest civilizations for over 5,000 years. Luxor contains the world''s greatest concentration of ancient Egyptian monuments, including Karnak Temple, the Valley of the Kings, and dozens of other extraordinary archaeological sites. The Red Sea coast offers world-class diving and snorkeling in pristine coral reef ecosystems, with resorts at Hurghada and Sharm el-Sheikh attracting divers from around the world. Egypt''s economy has revenues from tourism, Suez Canal transit fees, oil, and remittances. Arabic is the official language; English is widely spoken in tourism and business contexts. The cost of living is very low by international standards. Egypt''s extraordinary historical depth, vibrant urban culture, and geographical diversity — from deserts to Mediterranean coast — make it one of the world''s most compelling destinations for both short visits and long-term stays, particularly for history enthusiasts.'
),
(
	'Asia', 'Maldives', 'MV',
	'https://flagcdn.com/mv.svg',
	'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
	'Paradise found — the Maldives is the world''s lowest-lying nation, a string of coral atolls with crystal-clear turquoise lagoons, overwater bungalows, and some of the finest tropical luxury on Earth.

## Key Highlights
- World''s most iconic overwater bungalows above turquoise lagoons
- Exceptional coral reef diving and world-class marine biodiversity
- Ultimate luxury tropical destination with unparalleled natural beauty',
	'The Maldives is an island nation in the Indian Ocean southwest of Sri Lanka, comprising approximately 1,200 coral islands organized into 26 atolls, with a total land area of just 298 square kilometers spread across 90,000 square kilometers of ocean. Malé, the tiny capital island, is one of the world''s most densely populated cities, contrasting dramatically with the resort islands that have made the Maldives globally synonymous with luxury tropical holidays. The country pioneered the overwater bungalow concept, offering guests accommodation directly above crystal-clear turquoise lagoons with immediate access to extraordinary coral gardens teeming with marine life. The Maldives'' underwater world is among the planet''s finest for diving and snorkeling, with whale sharks, manta rays, sea turtles, and brilliant coral formations in exceptionally clear visibility. The economy is almost entirely dependent on luxury tourism alongside fishing. The Maldives is one of the countries most vulnerable to climate change — its highest point is just 2.4 meters above sea level, making the entire nation potentially threatened by rising seas. Islamic law applies, and alcohol is prohibited for locals (though available in resort islands). The cost of resort stays is among the world''s highest, while local islands offer more budget-friendly experiences. Long-term residency opportunities are limited, primarily through employment with resorts or significant investment programs.'
),
(
	'Europe', 'Monaco', 'MC',
	'https://flagcdn.com/mc.svg',
	'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
	'The world''s second smallest country is synonymous with wealth, glamour, and the Formula 1 Grand Prix. Monaco offers zero income tax, extraordinary Mediterranean scenery, and the world''s highest concentration of millionaires.

## Key Highlights
- Zero personal income tax jurisdiction
- Formula 1 Grand Prix and Casino Monte-Carlo glamour
- Highest concentration of millionaires and billionaires globally',
	'Monaco is a sovereign city-state on the French Riviera, covering just 2.02 square kilometers — the world''s second smallest country — yet housing over 38,000 residents, making it the world''s most densely populated sovereign state. The principality is ruled by the Grimaldi family, one of Europe''s oldest royal dynasties. Monaco''s global reputation for wealth and glamour stems from its zero income tax policy, which attracts wealthy residents from across Europe and beyond, creating the world''s highest concentration of high-net-worth individuals per capita. The Casino Monte-Carlo, glamorized by James Bond and countless films, remains an active casino and iconic architectural landmark. The Formula 1 Monaco Grand Prix, held through the principality''s streets each May, is one of motorsport''s most prestigious and spectacular events. Monaco''s coastline offers excellent Mediterranean swimming, a well-equipped marina hosting some of the world''s most spectacular superyachts, and access to the broader Côte d''Azur region. Real estate is among the world''s most expensive, with apartment prices regularly exceeding €100,000 per square meter in prime locations. Residency in Monaco requires demonstrating sufficient financial means and maintaining accommodation in the principality. French is the official language. Monaco''s quality of life is exceptional, with low crime, excellent weather, world-class restaurants, and immediate access to the broader French and Italian Riviera.'
),
(
	'Africa', 'Seychelles', 'SC',
	'https://flagcdn.com/sc.svg',
	'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=800&q=80',
	'An Indian Ocean archipelago of extraordinary beauty — dramatic granite boulders, lush tropical forests, and pristine beaches. The Seychelles offers a stable island paradise with a welcoming visa policy and unique Creole culture.

## Key Highlights
- Stunning granite islands with unique prehistoric Coco de Mer palms
- World-class diving in UNESCO Biosphere Reserves
- Stable island economy with welcoming visitor permit system',
	'The Seychelles is an archipelago nation of 115 islands in the Indian Ocean, northeast of Madagascar. Victoria, located on the main island of Mahé, is the world''s smallest capital city. The Seychelles is famous for its unique geological character — many islands are granitic rather than coral, creating dramatic landscapes of massive rounded boulders, lush tropical vegetation, and pristine beaches unlike those found elsewhere in the Indian Ocean. Praslin and La Digue are the most popular outer islands, famous for Anse Source d''Argent (frequently listed among the world''s most beautiful beaches) and the Vallée de Mai palm forest, a UNESCO World Heritage site where the Coco de Mer palm — producing the world''s largest seed — grows in a primeval setting. The marine environment is exceptional, with pristine coral reefs, diverse fish populations, and nesting grounds for sea turtles. The country is politically stable and maintains a relatively high Human Development Index for Africa. The economy relies heavily on tourism and fishing, with the government promoting offshore financial services. The Seychellois Creole culture combines African, French, Indian, and Chinese influences, creating unique cuisine, music, and artistic traditions. The Seychelles Visitor Permit allows extended stays for nationals of most countries, making it very accessible. The cost of living is moderate to high, with the island''s pristine environment and biodiversity more than justifying the investment.'
)
on conflict (name) do nothing;

-- =============================================================================
-- Citizenship Requirements
-- =============================================================================

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Hungarian citizens acquire citizenship automatically at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous residence, B1 Hungarian language proficiency, knowledge of Hungarian history and culture, clean criminal record, financial stability.\n\n**Processing:** Through Office of Immigration, typically 6-12 months."
  },
  "Spouse of Hungarian Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 3 years of marriage and 2 years continuous residence in Hungary."
  },
  "Ethnic Hungarians": {
    "icon": "🇭🇺",
    "desc": "Ethnic Hungarians living outside Hungary (particularly in Romania, Slovakia, Ukraine) may apply for Hungarian citizenship through simplified procedure with no residence requirement."
  }
}' WHERE name = 'Hungary';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Croatian citizens automatically acquire Croatian citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence, Croatian language proficiency, knowledge of Croatian culture and constitution, clean criminal record, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Spouse of Croatian Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 3 years of marriage with reduced residence requirements."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU citizens have freedom of movement in Croatia but citizenship still requires meeting standard naturalization criteria."
  }
}' WHERE name = 'Croatia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Birth (Jus Soli)": {
    "icon": "🏛️",
    "desc": "Children born on US soil automatically acquire citizenship regardless of parents'' nationality. Birthright citizenship is enshrined in the 14th Amendment."
  },
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of US citizens may acquire citizenship at birth even if born abroad, subject to residency requirements of the citizen parent."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as Lawful Permanent Resident (3 years if married to US citizen), English language, US history and civics test, good moral character, no criminal record.\n\n**Processing:** 8-24 months depending on field office."
  },
  "Investor Pathway": {
    "icon": "💰",
    "desc": "EB-5 Immigrant Investor Program requires $800,000-$1,050,000 investment creating 10 full-time jobs, leading to Green Card and eventual citizenship."
  }
}' WHERE name = 'United States';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of at least one Japanese citizen parent acquire citizenship at birth. Children born out of wedlock to Japanese father require legal recognition."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence, ability to support oneself financially, good conduct, renunciation of previous nationality (dual citizenship not officially recognized).\n\n**Processing:** Through Ministry of Justice, 1-2 years. Very selective."
  },
  "Special Naturalization": {
    "icon": "⭐",
    "desc": "Reduced residence requirements (3 years) for spouses of Japanese nationals married for 3+ years. Reduced for those born in Japan with Japanese parent."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Japan does not officially recognize dual citizenship. Naturalized citizens must renounce previous citizenship. Children with dual citizenship must choose by age 22."
  }
}' WHERE name = 'Japan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of South Korean citizens automatically acquire citizenship. Overseas Koreans (ethnic Koreans with foreign citizenship) have special repatriation pathways."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (2 years if married to Korean citizen for 2+ years), Korean language proficiency, knowledge of Korean culture, financial stability.\n\n**Processing:** Through Ministry of Justice, 1-2 years."
  },
  "Special Naturalization": {
    "icon": "⭐",
    "desc": "Individuals with outstanding contributions to Korea may apply for special naturalization regardless of residence period. Overseas Koreans have expedited pathways."
  },
  "Dual Citizenship (Limited)": {
    "icon": "🇰🇷",
    "desc": "Limited dual citizenship permitted for those naturalized after age 65, spouses of Korean citizens in certain circumstances, and foreign nationals who become Korean citizens voluntarily."
  }
}' WHERE name = 'South Korea';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of UAE citizens acquire citizenship. Citizenship through paternal line only; children of UAE mothers and foreign fathers do not automatically qualify."
  },
  "Naturalization (Rare)": {
    "icon": "📋",
    "desc": "**Requirements:** 30 years continuous residence for Arabs, 20 years for non-Arabs with Arabic language fluency. Rarely granted in practice.\n\n**Note:** The UAE naturalization process is extremely selective and largely discretionary."
  },
  "Golden Visa": {
    "icon": "💰",
    "desc": "10-year renewable Golden Visa available for investors (AED 2 million+), entrepreneurs, scientists, outstanding students, and humanitarian workers. Provides residency but not citizenship."
  },
  "Birthright": {
    "icon": "🏙️",
    "desc": "No birthright citizenship. Children born in the UAE to non-citizen parents do not acquire Emirati citizenship, regardless of length of stay."
  }
}' WHERE name = 'United Arab Emirates';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Canadian citizens born abroad automatically acquire citizenship, though second-generation born abroad may face limitations."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 1,095 days physical presence in Canada in the past 5 years (as PR), English or French language (CLB 4), Canadian citizenship test (knowledge of rights/responsibilities, history, values), no prohibitions.\n\n**Processing:** 12-24 months."
  },
  "Permanent Residency Pathways": {
    "icon": "🍁",
    "desc": "Express Entry (Federal Skilled Worker, Canadian Experience Class), Provincial Nominee Programs, Family Sponsorship, and Atlantic Immigration Program are primary PR pathways before naturalization."
  },
  "Dual Citizenship": {
    "icon": "🇨🇦",
    "desc": "Canada permits dual citizenship. Canadian citizens do not need to renounce their previous citizenship and can hold multiple passports simultaneously."
  }
}' WHERE name = 'Canada';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of at least one Australian citizen parent acquire citizenship automatically at birth, whether born in Australia or abroad."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 4 years as permanent resident (last 12 months continuously), good character, basic English, Australian values and pledged commitment.\n\n**Processing:** Through Department of Home Affairs, 12-24 months."
  },
  "Points-Based PR Pathways": {
    "icon": "🦘",
    "desc": "SkillSelect/EOI points-based system for General Skilled Migration, Employer Sponsored visas, Business Innovation visas, and Regional visas lead to PR and eventual citizenship."
  },
  "Dual Citizenship": {
    "icon": "🇦🇺",
    "desc": "Australia permits dual citizenship. Applicants for Australian citizenship are not required to renounce their previous citizenship."
  }
}' WHERE name = 'Australia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of New Zealand citizens or permanent residents born in New Zealand acquire citizenship automatically. Those born abroad to NZ citizen parents may also qualify."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 1,350 days physical presence in NZ in the past 5 years as PR, good character, English language ability.\n\n**Processing:** Through Department of Internal Affairs, 3-6 months."
  },
  "Skilled Migrant & PR Pathways": {
    "icon": "🥝",
    "desc": "Skilled Migrant Category (points-based), Accredited Employer Work Visa, Investor visas, and various work-to-residence pathways lead to PR before citizenship."
  },
  "Māori Citizenship": {
    "icon": "🌿",
    "desc": "Māori people (tangata whenua) have specific constitutional status under the Treaty of Waitangi, recognizing their status as the indigenous people of New Zealand."
  }
}' WHERE name = 'New Zealand';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Singapore citizens acquire citizenship at birth. Children of Singapore PRs may register for citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 2-6 years as Permanent Resident, economic contribution, community integration, language ability in an official language.\n\n**Processing:** Highly selective; economic contribution is a key factor. 1-2 years typically."
  },
  "Permanent Residency First": {
    "icon": "🏙️",
    "desc": "Employment Pass holders typically apply for PR after 2+ years. PR is required before citizenship. PR through Employment Pass (EP), S Pass, and Entrepreneur Pass."
  },
  "Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Singapore does not permit dual citizenship. Citizens must renounce all other nationalities within one year of acquiring Singapore citizenship."
  }
}' WHERE name = 'Singapore';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Hong Kong permanent residents do not automatically acquire HK permanent resident status at birth outside HK. Residency must be established."
  },
  "Right of Abode": {
    "icon": "🏙️",
    "desc": "**Permanent Residency:** 7 years ordinary residence in HK with right to land. Right of abode holders have full residency and work rights.\n\n**Chinese National Path:** Chinese nationals residing continuously in HK for 7 years may acquire right of abode."
  },
  "BN(O) Status": {
    "icon": "🇬🇧",
    "desc": "Hong Kong British National (Overseas) passport holders and dependants may apply for British citizenship through a 5-year UK residence pathway following 2020 policy changes."
  },
  "Note on Changes": {
    "icon": "⚠️",
    "desc": "Political changes since the 2020 National Security Law have significantly altered the practical situation for many residents. Many have emigrated using UK, Canadian, and Australian pathways."
  }
}' WHERE name = 'Hong Kong';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Czech citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (3 years for EU citizens), Czech language A2 level, knowledge of Czech culture/history/political system, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have freedom of movement and can live and work in Czechia without a visa. Citizenship still requires meeting standard naturalization criteria."
  },
  "Dual Citizenship": {
    "icon": "🇨🇿",
    "desc": "Dual citizenship is permitted in Czechia. Applicants for Czech citizenship are not required to renounce their previous nationality."
  }
}' WHERE name = 'Czechia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Slovak citizens automatically acquire citizenship at birth regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence (5 years for EU citizens, 3 years for spouses of Slovak citizens), Slovak language B1, knowledge of Slovak culture/history, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Spouse of Slovak Citizen": {
    "icon": "💍",
    "desc": "Spouses of Slovak citizens may apply after 3 years of marriage with reduced residence of 3 years."
  },
  "Slovak Diaspora": {
    "icon": "🇸🇰",
    "desc": "Ethnic Slovaks living abroad may apply for Slovak citizenship under simplified conditions without residency requirements."
  }
}' WHERE name = 'Slovakia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Bulgarian citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (3 years for EU citizens and spouses of Bulgarians), Bulgarian language A2 level, no criminal record, income stability.\n\n**Processing:** Through Ministry of Justice, 12-24 months."
  },
  "Investment Citizenship": {
    "icon": "💰",
    "desc": "Investment of BGN 2,000,000 (approx. €1,000,000) in Bulgarian businesses or government bonds can lead to accelerated permanent residency (not citizenship directly)."
  },
  "Bulgarian Descent": {
    "icon": "🇧🇬",
    "desc": "Persons of Bulgarian origin or descent may apply for citizenship through simplified procedures regardless of current residency."
  }
}' WHERE name = 'Bulgaria';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Romanian citizens automatically acquire citizenship regardless of birthplace. Diaspora Romanians can pass citizenship to their children indefinitely."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence (5 years for stateless persons/refugees, 4 years for EU citizens), Romanian language B1, knowledge of Romanian culture/constitution.\n\n**Processing:** Through National Citizenship Authority, 12-18 months."
  },
  "Re-acquisition for Former Citizens": {
    "icon": "🔄",
    "desc": "Former Romanian citizens (and their children/grandchildren) who lost citizenship involuntarily, particularly those from the Communist era or from Moldova, may re-acquire citizenship through simplified procedure."
  },
  "EU Citizenship Bonus": {
    "icon": "🇪🇺",
    "desc": "Romanian citizenship grants EU citizenship, providing visa-free access to 26 EU member states. Highly sought after by Moldovans due to shared cultural and linguistic heritage."
  }
}' WHERE name = 'Romania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Luxembourgish citizens automatically acquire citizenship. Ancestors who lost citizenship due to WWII-era laws may be eligible for re-acquisition."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Luxembourgish language A2 level (or French/German B1), civics test, integration contract.\n\n**Processing:** Through Ministry of Justice, 12-24 months."
  },
  "Dual Citizenship": {
    "icon": "🇱🇺",
    "desc": "Luxembourg permits dual/multiple citizenship. In 2008, Luxembourg changed its law to allow dual citizenship, making it possible to maintain existing nationality."
  },
  "Ancestral Recovery": {
    "icon": "⭐",
    "desc": "Persons of Luxembourg descent who lost citizenship or whose ancestors were deprived of citizenship under Nazi occupation may apply for citizenship recovery."
  }
}' WHERE name = 'Luxembourg';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of South African citizens acquire citizenship at birth regardless of birthplace, subject to registration requirements."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as permanent resident, 1 year married to SA citizen or 5 years ordinary residence with PR, English or other official language ability, good character, renouncing previous citizenship.\n\n**Processing:** Through DHA, 12-24 months."
  },
  "Permanent Residency First": {
    "icon": "🌍",
    "desc": "General Work PR, Relatives PR, Retirement PR, and Business/Investment PR pathways lead to permanent residency before citizenship can be applied for."
  },
  "Dual Citizenship (Limited)": {
    "icon": "⚠️",
    "desc": "South Africa generally does not permit dual citizenship. Citizens who voluntarily acquire another nationality must apply for permission to retain SA citizenship, or they may lose it."
  }
}' WHERE name = 'South Africa';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Slovenian citizens acquire citizenship automatically at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (6 years for EU citizens), Slovenian language A2 level, knowledge of Slovenian constitution/culture, financial stability, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have right of free movement and reduced residence requirements for naturalization after 6 years."
  },
  "Dual Citizenship": {
    "icon": "🇸🇮",
    "desc": "Dual citizenship is permitted in Slovenia. Applicants are not required to renounce their previous nationality."
  }
}' WHERE name = 'Slovenia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Latvian citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as permanent resident, Latvian language B1, knowledge of Latvian history and constitution, Latvian national anthem, loyalty oath, clean criminal record.\n\n**Processing:** Through Office of Citizenship and Migration Affairs, 6-12 months."
  },
  "Non-Citizens (Historical)": {
    "icon": "⚠️",
    "desc": "Latvia has a unique category of ''Non-Citizens'' — former USSR citizens who settled during Soviet occupation and their descendants who did not qualify for automatic citizenship in 1991. They have special travel rights but are not citizens."
  },
  "Dual Citizenship (Limited)": {
    "icon": "🇱🇻",
    "desc": "Latvia permits dual citizenship only in limited cases: for citizens of EU/EEA/NATO countries and a few others. Generally requires renouncing previous citizenship."
  }
}' WHERE name = 'Latvia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Lithuanian citizens automatically acquire citizenship regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (5 years for stateless, 5 years for refugees, reduced for EU/EEA citizens), Lithuanian language B1, knowledge of Lithuanian constitution/history, renunciation of previous citizenship.\n\n**Processing:** Through Migration Department, 6-12 months."
  },
  "Ethnic Lithuanians": {
    "icon": "⭐",
    "desc": "Ethnic Lithuanians of Lithuanian descent living abroad may restore or acquire citizenship through simplified procedure without renouncing their current citizenship."
  },
  "Dual Citizenship": {
    "icon": "🇱🇹",
    "desc": "Dual citizenship is generally not permitted except for ethnic Lithuanians, persons who acquired foreign citizenship involuntarily, and citizens of certain EU/EEA member states in limited circumstances."
  }
}' WHERE name = 'Lithuania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Chinese citizens acquire citizenship through paternal line primarily. China does not officially recognize dual citizenship."
  },
  "Naturalization (Very Rare)": {
    "icon": "📋",
    "desc": "**Requirements:** 3 years continuous Chinese residence AND having close relatives who are Chinese citizens OR who have settled in China, or other legitimate reasons.\n\n**In Practice:** Naturalization is extremely rare and granted at government discretion. Foreigners overwhelmingly hold residence permits rather than citizenship."
  },
  "Residence Permits": {
    "icon": "📄",
    "desc": "Most foreigners in China hold temporary work, student, or family residence permits (Z, X, S visas). Permanent Residence (''Green Card'') is available to high-skilled talent and investors but very difficult to obtain."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "China does not recognize dual citizenship. Those who become Chinese citizens must renounce all other nationalities. Overseas Chinese who naturalize elsewhere technically lose Chinese citizenship."
  }
}' WHERE name = 'China';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Mongolian citizens automatically acquire citizenship. Children of one Mongolian and one foreign parent acquire citizenship if born in Mongolia or registered with authorities."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Mongolian language proficiency, respect for Mongolian law and culture, permanent source of income, clean criminal record.\n\n**Processing:** Through General Authority for Border Protection, 6-12 months."
  },
  "Limited Dual Citizenship": {
    "icon": "🇲🇳",
    "desc": "Mongolia generally does not permit dual citizenship. Foreign nationals who acquire Mongolian citizenship are expected to renounce their previous nationality."
  },
  "Investment Pathways": {
    "icon": "💰",
    "desc": "Long-term investment in Mongolia can facilitate permanent residency, with citizenship available after meeting standard naturalization requirements."
  }
}' WHERE name = 'Mongolia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Liechtenstein citizens automatically acquire citizenship. Citizenship passes through the paternal line; children of citizen mothers and foreign fathers require special application."
  },
  "Naturalization (Very Selective)": {
    "icon": "📋",
    "desc": "**Requirements:** 30 years of residence for ordinary naturalization (10 years if born in Liechtenstein), integration, language, clean record. Voted on by local municipality.\n\n**Processing:** Extremely long and selective. Voted by municipal council."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Parliament may grant citizenship to individuals with particular merit to Liechtenstein. Also available for those married 5+ years to a citizen with 5 years residence."
  },
  "No Dual Citizenship Generally": {
    "icon": "⚠️",
    "desc": "Liechtenstein generally does not permit dual citizenship. Naturalizing citizens must renounce their previous nationality."
  }
}' WHERE name = 'Liechtenstein';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Saudi nationals acquire citizenship through patrilineal descent. Children of Saudi mothers and foreign fathers must apply through naturalization process."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence, Arabic language proficiency, good conduct, financial stability, renunciation of previous nationality, Council of Ministers approval.\n\n**Processing:** Highly selective; large numbers of long-term residents are denied. Political and royal connections influence outcomes."
  },
  "Premium Residency (New)": {
    "icon": "💰",
    "desc": "Saudi Premium Residency (''Green Card'') launched in 2019: available through one-time fee (SAR 800,000 / ~$200k) or annual fee. Provides permanent residency with right to work, own business, and property — but not citizenship."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Saudi Arabia does not recognize dual citizenship. Saudis who naturalize elsewhere lose Saudi citizenship, and foreign nationals naturalizing as Saudi must renounce previous nationality."
  }
}' WHERE name = 'Saudi Arabia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Vietnamese citizens acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Vietnamese language proficiency, knowledge of Vietnamese history/culture, financial stability, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Justice, 1-2 years."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Individuals making significant contributions to Vietnam (investors, scientists, athletes, cultural figures) may be granted citizenship with reduced requirements by government decision."
  },
  "Overseas Vietnamese": {
    "icon": "🇻🇳",
    "desc": "Vietnamese overseas (Viet Kieu) who lost citizenship can re-apply for restoration. Vietnam has eased restrictions for diaspora seeking to reclaim roots and invest."
  }
}' WHERE name = 'Vietnam';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Argentine citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization (Very Accessible)": {
    "icon": "📋",
    "desc": "**Requirements:** Only 2 years continuous legal residence, evidence of ''good morals,'' means of legitimate livelihood, no criminal record.\n\n**Processing:** Through National Migration Authority, 3-12 months. One of the most accessible in the world."
  },
  "Spouse of Argentine Citizen": {
    "icon": "💍",
    "desc": "Spouses of Argentine citizens may apply immediately (no minimum residence) if they can demonstrate continuous cohabitation and marriage."
  },
  "Birthright Citizenship": {
    "icon": "🇦🇷",
    "desc": "Children born on Argentine soil acquire Argentine citizenship automatically (jus soli), regardless of parents'' nationality — one of the world''s most generous birthright citizenship policies."
  }
}' WHERE name = 'Argentina';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Brazilian citizens automatically acquire citizenship at birth regardless of birthplace, provided they are registered at a Brazilian consulate."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements (Ordinary):** 4 years continuous residence, Portuguese language.\n\n**Requirements (Facilitated):** 1 year if married to Brazilian citizen, 1 year if having Brazilian child, 3 years if from Portuguese-speaking country (PALOP).\n\n**Processing:** Through Ministry of Justice, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🇧🇷",
    "desc": "Children born in Brazil to foreign parents acquire Brazilian citizenship at birth (jus soli), with some exceptions for parents on official foreign government service."
  },
  "Digital Nomad Visa": {
    "icon": "💻",
    "desc": "Brazil launched a Digital Nomad Visa in 2022, providing a 1-year renewable residence permit for remote workers earning from abroad, potentially leading to permanent residency."
  }
}' WHERE name = 'Brazil';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Indian citizens (at least one parent must be Indian at time of birth) acquire citizenship at birth. Persons of Indian Origin (PIOs) have special OCI status."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 11 years total residence (last 12 months continuous), English or regional language knowledge, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Home Affairs, 1-3 years."
  },
  "OCI Card": {
    "icon": "🇮🇳",
    "desc": "Overseas Citizen of India (OCI) is a lifetime multiple-entry visa for PIOs and foreign spouses of Indian citizens — not citizenship, but provides many benefits including no immigration reporting requirement."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "India does not permit dual citizenship. Persons who voluntarily acquire citizenship of another country cease to be Indian citizens automatically."
  }
}' WHERE name = 'India';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Malaysian citizens acquire citizenship at birth if born in Malaysia. Children born abroad to Malaysian fathers may register for citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 of the last 12 years residence in Malaysia (5 years in the last 7 for spouses), Malay language test, good character, intention to reside in Malaysia permanently.\n\n**Processing:** Through National Registration Department, 2-4 years. Selective."
  },
  "MM2H Pathway": {
    "icon": "🏙️",
    "desc": "Malaysia My Second Home (MM2H) provides long-term residence up to 10 years but does not directly lead to citizenship. It is a lifestyle visa, not a pathway to permanent residency."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Malaysia does not permit dual citizenship. Malaysian citizens who voluntarily acquire foreign citizenship lose Malaysian citizenship automatically."
  }
}' WHERE name = 'Malaysia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Moldovan citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (8 years for stateless persons, 5 years for those with meritorious contributions), Romanian/Moldovan language competency, knowledge of constitution, financial stability.\n\n**Processing:** Through State Citizenship Agency, 12-24 months."
  },
  "Romanian Citizenship Option": {
    "icon": "🇷🇴",
    "desc": "Many ethnic Moldovans of Romanian heritage can apply for Romanian citizenship (and thus EU citizenship) under Romanian re-acquisition laws. This is widely used and provides EU freedom of movement."
  },
  "EU Aspirations": {
    "icon": "🇪🇺",
    "desc": "Moldova has EU candidate status. Future accession could automatically confer EU rights on Moldovan citizens, though this is still years away."
  }
}' WHERE name = 'Moldova';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Albanian citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Albanian language A2 level, knowledge of Albanian history and culture, clean criminal record, financial means, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Individuals who have made exceptional contributions to Albania (scientists, artists, investors, athletes) may receive citizenship by presidential decree without meeting standard requirements."
  },
  "EU Aspirations": {
    "icon": "🇪🇺",
    "desc": "Albania has EU candidate status. Future EU accession would bring significant changes to freedom of movement and economic opportunity for Albanian citizens."
  }
}' WHERE name = 'Albania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Georgian citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (5 years for persons of Georgian descent, spouses of Georgian citizens), Georgian language proficiency, knowledge of Georgian history and law, financial stability.\n\n**Processing:** Through Agency of Civil Registry, 6-12 months."
  },
  "Citizenship by Exception": {
    "icon": "⭐",
    "desc": "Georgian President may grant citizenship to individuals of exceptional merit or those who make significant contributions to Georgia''s economic, cultural, or scientific development."
  },
  "Welcoming Visa Policy": {
    "icon": "🇬🇪",
    "desc": "Georgia offers 1-year visa-free stays to citizens of most countries (including EU/US/UK), making it exceptionally accessible for digital nomads before any formal visa or citizenship is needed."
  }
}' WHERE name = 'Georgia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent (Aliyah)": {
    "icon": "⭐",
    "desc": "Under the Law of Return, any Jew, their spouse, children, and grandchildren (and their spouses) have the right to immigrate to Israel and acquire citizenship. This is one of the world''s broadest descent/return citizenship programs."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 3 years residence as immigrant (with declared intention to settle), Hebrew language, renunciation of previous citizenship in most cases, declaration of loyalty.\n\n**Processing:** Through Population and Immigration Authority, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🇮🇱",
    "desc": "Israel has limited jus soli citizenship. Children born in Israel to Israeli citizens acquire citizenship. Children of non-citizen parents must apply through other channels."
  },
  "Dual Citizenship": {
    "icon": "🌍",
    "desc": "Israel permits dual citizenship in many cases, particularly for those who acquire Israeli citizenship through the Law of Return while maintaining their original nationality."
  }
}' WHERE name = 'Israel';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Bahamian citizens (or born in The Bahamas to at least one citizen parent) acquire citizenship at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous lawful residence, English language, good character, no criminal record, financial stability.\n\n**Processing:** Through Department of Immigration, 12-24 months."
  },
  "Permanent Residency": {
    "icon": "🏝️",
    "desc": "Permanent Residency available through property investment (BSD $500,000+), accelerated consideration for BSD $1.5 million+. Does not automatically lead to citizenship."
  },
  "Birthright Citizenship (Limited)": {
    "icon": "🌊",
    "desc": "Children born in The Bahamas to non-citizen parents do not automatically acquire citizenship but may apply for registration upon reaching age 18."
  }
}' WHERE name = 'Bahamas';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Pakistani citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Urdu or regional language proficiency, good character, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through NADRA/Ministry of Interior, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🏔️",
    "desc": "Children born in Pakistan to at least one Pakistani parent acquire citizenship. Foundlings (children of unknown parents) found in Pakistan are also considered citizens."
  },
  "Overseas Pakistanis": {
    "icon": "🌍",
    "desc": "Pakistan has made significant efforts to maintain connections with its diaspora. NICOP (National Identity Card for Overseas Pakistanis) allows dual nationals to access government services."
  }
}' WHERE name = 'Pakistan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Qatari citizenship passes through the paternal line. Children of Qatari fathers automatically acquire citizenship."
  },
  "Naturalization (Very Selective)": {
    "icon": "📋",
    "desc": "**Requirements:** 25 years continuous legal residence (15 years for nationals of Arab countries), Arabic language, good conduct, financial stability, no criminal record, renunciation of previous nationality.\n\n**In Practice:** Extremely rare; citizenship is primarily reserved for founding families and select cases."
  },
  "Premium Residency": {
    "icon": "💰",
    "desc": "Qatar offers permanent and temporary residency visas for investors and highly skilled workers. These provide residency rights but not citizenship. Permanent residency available for those investing QAR 3.5 million+."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Qatar does not permit dual citizenship. The citizenship process is highly discretionary and primarily serves the interests of the Qatari state."
  }
}' WHERE name = 'Qatar';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of citizens of Bosnia and Herzegovina (regardless of entity — Federation or Republika Srpska) automatically acquire citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence, Bosnian/Croatian/Serbian language (official languages), knowledge of constitutional order, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Civil Affairs, 12-24 months. Can be slow due to complex governance."
  },
  "EU Candidate Status": {
    "icon": "🇪🇺",
    "desc": "Bosnia and Herzegovina has EU candidate status. Future accession would significantly change the value of BiH citizenship in terms of freedom of movement and economic opportunity."
  },
  "Diaspora": {
    "icon": "🌍",
    "desc": "The Bosnian diaspora is large (particularly in Germany, Austria, Switzerland, and Scandinavia). Citizenship maintenance by diaspora varies based on individual circumstances."
  }
}' WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Egyptian citizens automatically acquire citizenship. Egyptian mothers can pass citizenship to their children born abroad if the father is stateless or unknown."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence for most foreigners (3 years for Arab nationals, spouses of Egyptians after 2 years of marriage), Arabic language, good character, renunciation of previous citizenship.\n\n**Processing:** Presidential approval required; 2-4 years."
  },
  "Investment Naturalization": {
    "icon": "💰",
    "desc": "Investors making significant contributions to the Egyptian economy (USD 250,000+ in certain approved sectors) may apply for accelerated naturalization."
  },
  "Birthright Citizenship": {
    "icon": "🏺",
    "desc": "Limited birthright citizenship: children born in Egypt to unknown or stateless parents acquire Egyptian citizenship. Jus soli not broadly applied."
  }
}' WHERE name = 'Egypt';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Maldivian citizens acquire citizenship. However, children born abroad to Maldivian citizens must be registered with authorities to secure citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** Marriage to Maldivian citizen for 3 years (with conversion to Islam required), OR continuous legal residence of 12 years.\n\n**Note:** Non-Muslims cannot obtain Maldivian citizenship. Islam is constitutionally the state religion."
  },
  "Islamic Requirement": {
    "icon": "☪️",
    "desc": "The Constitution of the Maldives requires that all citizens be Muslim. Foreign nationals seeking citizenship must convert to Islam as part of the naturalization process."
  },
  "Limited Immigration": {
    "icon": "🏝️",
    "desc": "The Maldives has very limited permanent immigration programs. Long-term residency is primarily available through employment with resorts or investment. The small land area limits population capacity."
  }
}' WHERE name = 'Maldives';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Monégasque citizens acquire nationality. Nationality is transmitted through the paternal line; children of Monégasque mothers and foreign fathers require special application."
  },
  "Naturalization (Very Difficult)": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years of authorized residence with at least 5 continuous years immediately preceding application, adequate means of support, moral integrity, and willingness to integrate.\n\n**In Practice:** Extremely selective; the Prince of Monaco grants nationality by sovereign ordinance at his discretion."
  },
  "Marriage to Monégasque": {
    "icon": "💍",
    "desc": "Foreign nationals married to Monégasque citizens for at least 5 years may apply for nationality after 10 years of authorized residence, subject to approval by the Prince."
  },
  "Residency Requirements": {
    "icon": "🏰",
    "desc": "Residency in Monaco requires demonstrating sufficient financial means, proof of accommodation, and good character. The waiting list for residency itself can be significant due to limited space."
  }
}' WHERE name = 'Monaco';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Seychellois citizens automatically acquire citizenship at birth regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years legal residence (3 years for spouses of Seychellois citizens), English or French language (official languages), good character, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through Civil Status Division, 12-24 months."
  },
  "Investment Residence": {
    "icon": "💰",
    "desc": "The Seychelles has investor residency programs that can provide long-term residence permits but do not automatically lead to citizenship."
  },
  "Visitor Permit System": {
    "icon": "🌴",
    "desc": "The Seychelles grants a Visitor''s Permit on arrival allowing stays of up to 3 months initially, extendable up to 12 months. This permit system is one of the world''s most welcoming for initial entry."
  }
}' WHERE name = 'Seychelles';

-- =============================================================================
-- Tax Advice
-- =============================================================================

UPDATE countries SET tax_advice = $$- Hungary has a flat personal income tax rate of 15% — one of the EU''s lowest
- Corporate tax rate is 9%, the lowest flat corporate tax rate in the EU
- VAT rate is 27%, the highest in the EU (reduced rates of 18% and 5%)
- Non-residents taxed only on Hungary-sourced income
- Social security contributions total approximately 18.5% for employees
- Capital gains taxed at 15% flat rate for most assets
- No inheritance tax between direct family members
- SZÉP card system provides tax-advantaged employee benefits for leisure$$ WHERE name = 'Hungary';

UPDATE countries SET tax_advice = $$- Croatia has progressive income tax rates (23.6% and 35.4%)
- Corporate tax is 18% (10% for annual revenues under HRK 7.5 million)
- VAT at 25% (reduced rates of 13%, 5%, and 0%)
- Extensive bilateral tax treaties reduce withholding taxes
- Digital nomads with approved status may benefit from simplified tax treatment
- Property transfer tax at 3%
- Non-residents taxed on Croatian-source income only
- Croatian Kuna replaced by Euro in 2023, simplifying cross-border financial planning$$ WHERE name = 'Croatia';

UPDATE countries SET tax_advice = $$- US has progressive federal income tax (10% to 37%) plus state income taxes (0% to 13.3%)
- Corporate tax rate is 21% at federal level; state taxes vary
- Capital gains rates of 0%, 15%, or 20% depending on income
- US taxes citizens and permanent residents on worldwide income regardless of residence
- FBAR and FATCA require reporting of foreign bank accounts and assets
- Foreign Earned Income Exclusion (FEIE) allows up to ~$120k exclusion for abroad residents
- Sales tax varies by state (0% to over 10%); no federal sales tax
- Estate tax applies to estates over $13+ million; gift tax rules apply$$ WHERE name = 'United States';

UPDATE countries SET tax_advice = $$- Japan has progressive income tax (5% to 45%) plus 10% local inhabitant tax
- Corporate tax effective rate approximately 30-34% including local taxes
- Consumption tax (VAT equivalent) at 10% (8% for food/beverages)
- Residents taxed on worldwide income; non-residents on Japan-source income only
- Capital gains on securities taxed at flat 20.315% (income + special restoration surtax)
- No inheritance tax exemption for non-residents inheriting from Japanese residents
- Japan-US tax treaty reduces double taxation for American expats
- Social insurance contributions mandatory; employer and employee split costs$$ WHERE name = 'Japan';

UPDATE countries SET tax_advice = $$- Korea has progressive income tax (6% to 45%)
- Corporate tax 9%-24% depending on size and income
- VAT at 10% (one flat rate, minimal exemptions)
- Residents taxed on worldwide income; non-residents on Korea-source income only
- Capital gains on real estate can be taxed at up to 70% for short-term holdings
- Foreign tax credits available for taxes paid abroad
- National health insurance and pension contributions mandatory
- Cryptocurrency gains taxed as miscellaneous income at 20% over KRW 2.5 million$$ WHERE name = 'South Korea';

UPDATE countries SET tax_advice = $$- UAE has zero personal income tax — none on salary, investments, or capital gains
- Corporate tax introduced in 2023 at 9% (0% for profits under AED 375,000)
- VAT at 5% (introduced 2018; limited in scope compared to other countries)
- No withholding tax on dividends or interest paid to individuals
- Free Zone companies may be exempt from corporate tax under certain conditions
- No inheritance tax or wealth tax
- Social security only mandatory for UAE national employees
- Non-residents employed in UAE pay no income tax; only social contributions if applicable$$ WHERE name = 'United Arab Emirates';

UPDATE countries SET tax_advice = $$- Canada has progressive federal income tax (15% to 33%) plus provincial taxes (5% to 21%)
- Corporate tax at 26.5% combined federal/provincial (small business rate of 9%)
- GST/HST (goods and services/harmonized sales tax) 5%-15% depending on province
- Capital gains: 50% inclusion rate means half of capital gains added to income
- TFSA (Tax-Free Savings Account) and RRSP allow tax-advantaged saving
- Non-residents taxed at 25% withholding tax on Canadian income
- Foreign tax credits available for taxes paid abroad
- Provincial taxes vary significantly; Alberta has no provincial sales tax$$ WHERE name = 'Canada';

UPDATE countries SET tax_advice = $$- Australia has progressive income tax (0% to 45%) plus 2% Medicare levy
- Corporate tax at 30% (25% for companies with turnover under AUD 50 million)
- GST (goods and services tax) at 10% flat
- Capital gains taxed at income tax rates; 50% discount for assets held 12+ months
- Superannuation (pension) contributions mandatory at 11%+ of salary
- Non-residents taxed at flat 32.5% on first AUD 120,000 (no tax-free threshold)
- PAYG withholding system for employment income
- Foreign residents may be exempt from capital gains on most assets$$ WHERE name = 'Australia';

UPDATE countries SET tax_advice = $$- New Zealand has progressive income tax (10.5% to 39%)
- Corporate tax at 28%
- GST (goods and services tax) at 15%
- No capital gains tax (with some exceptions for property speculation)
- No inheritance or gift taxes
- KiwiSaver voluntary superannuation scheme with government contributions
- Non-residents taxed on NZ-source income only
- Foreign Investment Fund (FIF) rules apply to foreign investments above NZD 50,000
- Resident foreign trusts have complex disclosure requirements$$ WHERE name = 'New Zealand';

UPDATE countries SET tax_advice = $$- Singapore has progressive personal income tax (0% to 24%)
- Corporate tax at 17% flat (effective rate often lower with exemptions for startups)
- GST (goods and services tax) at 9% (increased from 8% in 2024)
- No capital gains tax, inheritance tax, or wealth tax
- Dividends from Singapore companies are tax-exempt for individuals
- Foreign income not remitted to Singapore is generally not taxable for residents
- Startup Tax Exemption: new companies pay 0% on first SGD 100,000 profit
- Social security (CPF) mandatory for Singapore citizens and PRs only$$ WHERE name = 'Singapore';

UPDATE countries SET tax_advice = $$- Hong Kong has low salaries tax (2% to 17%, capped at 16% of net income)
- Corporate profits tax at 16.5% (8.25% on first HKD 2 million for qualifying companies)
- No VAT, GST, sales tax, or capital gains tax
- No withholding tax on dividends or interest
- Source-based taxation: only income arising in or derived from HK is taxable
- Territorial tax system: foreign-source income exempt from HK tax
- Property rates (tax on rental value) instead of property purchase tax
- Stamp duty applies to stock and property transactions$$ WHERE name = 'Hong Kong';

UPDATE countries SET tax_advice = $$- Czechia has 15% personal income tax (23% above 4× average salary)
- Corporate tax at 19%
- VAT at 21% (reduced rates of 12% and 0%)
- Non-residents taxed on Czech-source income only
- Social security contributions significant (~34% employer + ~11% employee)
- Capital gains from securities held 3+ years exempt from tax
- Dividend withholding tax of 15% (reduced under treaties)
- Czech Koruna (CZK) not in Eurozone; currency exposure for Euro earners$$ WHERE name = 'Czechia';

UPDATE countries SET tax_advice = $$- Slovakia has 19% personal income tax (25% above 3× average wage threshold)
- Corporate tax at 21%
- VAT at 20% (reduced rate of 10%)
- Part of Eurozone since 2009 — no currency conversion needed for Euro earners
- Social security contributions approximately 44% total (split employer/employee)
- Capital gains generally taxed as ordinary income
- Tax residency established after 183 days or main center of life
- R&D tax super-deduction of 200% available for qualifying businesses$$ WHERE name = 'Slovakia';

UPDATE countries SET tax_advice = $$- Bulgaria has a flat 10% personal income tax — lowest in the EU
- Corporate tax at 10% flat — also lowest in the EU
- VAT at 20% (reduced rates of 9% and 0%)
- Non-residents taxed on Bulgaria-source income only
- Capital gains from sale of personal property (one per year) may be exempt
- Dividend withholding tax of 5%
- No inheritance tax between direct family members
- Bulgaria is not in Schengen or Eurozone (uses Bulgarian Lev pegged to Euro)$$ WHERE name = 'Bulgaria';

UPDATE countries SET tax_advice = $$- Romania has progressive income tax of 10% flat for most income
- Corporate tax at 16% (micro-enterprise revenue tax of 1-3% as alternative)
- VAT at 19% (reduced rates of 9%, 5%, and 0%)
- Non-residents taxed on Romania-source income only
- Social security contributions approximately 35% total
- Capital gains taxed at 10% for listed securities
- IT sector employees under 26 with software certifications are exempt from income tax
- Romania uses its own currency (Romanian Leu) — not in Eurozone yet$$ WHERE name = 'Romania';

UPDATE countries SET tax_advice = $$- Luxembourg has progressive income tax (0% to 42%) plus solidarity surtax
- Corporate tax approximately 24.94% combined (15% CIT + 7% solidarity + 6.75% municipal)
- VAT at 17% (lowest standard rate in the EU), reduced rates of 14%, 8%, and 3%
- Participation exemption: dividends and capital gains from qualifying subsidiaries exempt
- Luxembourg investment vehicles (UCITS, SICAVs) widely used for EU fund management
- No wealth tax on individuals
- Significant double tax treaty network (80+ countries)
- Highly favorable for holding companies and EU fund structures$$ WHERE name = 'Luxembourg';

UPDATE countries SET tax_advice = $$- South Africa has progressive income tax (18% to 45%)
- Corporate tax at 27%
- VAT at 15% (one of Africa''s lower standard rates)
- South African residents taxed on worldwide income
- Foreign income exemption available for those working abroad 183+ days (with some limits)
- Capital gains tax at effective rate of up to 18% for individuals
- Dividends withholding tax of 20%
- Estate duty of 20% on estates above ZAR 3.5 million (30% above ZAR 30 million)$$ WHERE name = 'South Africa';

UPDATE countries SET tax_advice = $$- Slovenia has progressive income tax (16% to 50%)
- Corporate tax at 19%
- VAT at 22% (reduced rates of 9.5% and 5%)
- Part of Eurozone since 2007 — no currency conversion needed
- Capital gains taxed at 25% (reducing to 0% after 20 years of ownership)
- Dividend withholding tax of 27.5%
- Non-residents taxed on Slovenia-source income only
- Social contributions approximately 38% total (split employer/employee)$$ WHERE name = 'Slovenia';

UPDATE countries SET tax_advice = $$- Latvia has progressive income tax (20% to 31%)
- Corporate tax at 20% on distributed profits (undistributed profits not taxed)
- VAT at 21% (reduced rates of 12% and 5%)
- Part of Eurozone since 2014
- Capital gains generally taxed as ordinary income
- No inheritance tax between direct family members
- Microenterprise tax regime (15%) available for small businesses
- Latvia''s distributed profit tax model (similar to Estonia) encourages reinvestment$$ WHERE name = 'Latvia';

UPDATE countries SET tax_advice = $$- Lithuania has progressive income tax (20% and 32%)
- Corporate tax at 15% (5% for small companies and startups)
- VAT at 21% (reduced rates of 9% and 5%)
- Part of Eurozone since 2015
- Capital gains taxed at 15% flat for individuals
- No inheritance tax between direct family members
- Fintech businesses benefit from Bank of Lithuania regulatory sandbox
- Social insurance contributions approximately 30% total (split employer/employee)$$ WHERE name = 'Lithuania';

UPDATE countries SET tax_advice = $$- China has progressive income tax (3% to 45%) for residents
- Corporate tax at 25% (15% for high-tech enterprises)
- VAT at 13% for goods, 9% for key sectors, 6% for services
- Non-residents taxed on China-source income only (with treaty benefits)
- Capital gains from listed securities generally exempt
- Real estate transfer gains taxed as income at up to 30%
- Annual individual tax return required for income above CNY 120,000
- China''s tax residency rules require 183+ days presence; long-term residents taxed on worldwide income$$ WHERE name = 'China';

UPDATE countries SET tax_advice = $$- Mongolia has progressive income tax (10% to 25%)
- Corporate tax at 10% (for income below MNT 6 billion) or 25% above threshold
- VAT at 10%
- Non-residents taxed on Mongolia-source income only
- Mining sector has special royalty and tax regimes
- Capital gains from securities taxed at flat 10%
- Withholding tax of 20% on dividends paid to non-residents
- Double tax treaty network limited; check applicable treaties before investing$$ WHERE name = 'Mongolia';

UPDATE countries SET tax_advice = $$- Liechtenstein has very low income tax (1.2% to 8% cantonal/communal rates + national tax)
- Effective combined income tax rate rarely exceeds 20% even for high earners
- Corporate tax at approximately 12.5% effective rate
- VAT at 7.7% (same as Switzerland, part of Swiss customs union)
- No inheritance tax for direct family members; modest rates for others
- No wealth tax exceeding modest annual base
- Participation exemption for qualifying dividends and capital gains at holding level
- High-net-worth individuals may negotiate lump-sum taxation agreements$$ WHERE name = 'Liechtenstein';

UPDATE countries SET tax_advice = $$- Saudi Arabia has zero personal income tax for Saudi nationals and foreign employees
- Corporate income tax at 20% for foreign entities (Zakat — Islamic tax at 2.5% for Saudi entities)
- VAT at 15% (raised from 5% in 2020 to address oil revenue shortfall)
- No capital gains tax for individuals on most assets
- Withholding tax of 5-20% on payments to non-residents depending on type
- Real estate transaction tax of 5%
- GOSI (General Organization for Social Insurance) contributions for Saudi nationals
- Vision 2030 creating new economic activity and business registration opportunities$$ WHERE name = 'Saudi Arabia';

UPDATE countries SET tax_advice = $$- Vietnam has progressive personal income tax (5% to 35%)
- Corporate tax at 20% (10% for certain high-tech and social enterprises)
- VAT at 10% (5% for essentials, 0% for exports)
- Non-residents taxed at flat 20% on Vietnam-source income
- Capital gains from securities taxed at 0.1% on gross proceeds or 20% on net gain
- Real estate transfer taxed at 2% of transfer price
- Withholding tax on dividends at 5% for individuals
- Vietnam-US tax treaty and extensive treaty network available$$ WHERE name = 'Vietnam';

UPDATE countries SET tax_advice = $$- Argentina has progressive income tax (5% to 35%)
- Corporate tax at 35%
- VAT at 21% (reduced rates of 10.5% and 0%)
- Extraordinary inflation means real-terms calculations are complex
- Withholding taxes of 7-35% on payments to non-residents
- Wealth/assets tax (Bienes Personales) at 0.5-1.5% annually
- High effective tax burden for businesses but enforcement variable
- Official and informal exchange rates differ significantly; tax planning complex
- Digital nomads may qualify for special income tax treatment on foreign earnings$$ WHERE name = 'Argentina';

UPDATE countries SET tax_advice = $$- Brazil has progressive income tax (7.5% to 27.5%) for residents
- Corporate tax at 15% (25% above BRL 20,000/month) plus 9% social contribution
- ICMS (state VAT) at 12-25%; federal taxes (PIS/COFINS) also apply; total tax burden on goods can exceed 40%
- Non-residents taxed at flat 25% on Brazil-source income
- Capital gains on assets held abroad taxed at 15-22.5%
- IOF (financial operations tax) applies to currency exchange and some financial transactions
- Brazil has a Digital Nomad Visa allowing tax-favorable treatment on foreign income
- Brazil''s complex tax system often requires local professional advice$$ WHERE name = 'Brazil';

UPDATE countries SET tax_advice = $$- India has progressive income tax (0% to 30%) under new or old regime
- Corporate tax at 22% (new regime) or 25-30% (domestic companies old regime)
- GST at 5%, 12%, 18%, or 28% depending on goods/services
- Non-residents taxed on India-source income only
- Capital gains: STCG at 15% on listed equities (held <1 year); LTCG at 10% above INR 1 lakh
- TDS (Tax Deducted at Source) system means most income is pre-taxed
- India''s tax treaty network with 90+ countries
- Remote workers earning abroad while resident in India must declare worldwide income$$ WHERE name = 'India';

UPDATE countries SET tax_advice = $$- Malaysia has progressive income tax (1% to 30%)
- Corporate tax at 24% (17% for SMEs on first MYR 600,000)
- GST abolished in 2018; replaced by SST (Sales and Services Tax) at 5-10%
- Non-residents taxed at flat 30% on Malaysia-source income
- Capital gains on shares generally exempt; RPGT applies to property (5-30% depending on holding period)
- Dividends from Malaysian companies received by individuals are tax-exempt (single-tier system)
- MM2H participants enjoy some preferential tax treatment on foreign pension income
- Double tax treaty with 70+ countries$$ WHERE name = 'Malaysia';

UPDATE countries SET tax_advice = $$- Moldova has flat 12% personal income tax
- Corporate tax at 12%
- VAT at 20% (reduced rates of 12%, 8%, and 0%)
- Non-residents taxed on Moldova-source income only
- Capital gains generally taxed at standard 12% income tax rate
- No inheritance tax between direct family members
- Moldova has limited double tax treaty network
- EU association agreement provides some harmonization of tax rules
- Wine export sector receives certain preferential fiscal treatments$$ WHERE name = 'Moldova';

UPDATE countries SET tax_advice = $$- Albania has flat 23% personal income tax (0% on income below ALL 30,000/month)
- Corporate tax at 15% (0% for agricultural businesses and SMEs under ALL 14 million)
- VAT at 20% (6% for tourism sector)
- Non-residents taxed on Albanian-source income only
- Capital gains at 15% flat rate
- Withholding tax of 15% on dividends
- Albania is not in the EU; different trade and customs rules apply
- Digital nomad-friendly visa available; income earned abroad may have favorable tax treatment$$ WHERE name = 'Albania';

UPDATE countries SET tax_advice = $$- Georgia has a flat 20% personal income tax (one of Europe''s simplest and lowest)
- Corporate tax at 15% (20% on distributed profits in Estonia-style system)
- VAT at 18%
- Non-residents taxed on Georgia-source income only
- Virtual Zone Company (IT businesses) pay 0% corporate tax on foreign-source revenue
- No capital gains tax for individuals on securities held in qualifying accounts
- Free Industrial Zones offer further tax incentives for manufacturers
- Territorial tax system: foreign income of Georgia-resident companies not taxable if not Georgia-sourced$$ WHERE name = 'Georgia';

UPDATE countries SET tax_advice = $$- Israel has progressive income tax (10% to 50%)
- Corporate tax at 23%
- VAT at 17%
- New immigrants (Olim) receive 10-year tax holiday on foreign-source income
- Long-term returnees (living abroad 6+ years) may also receive partial tax exemptions
- Capital gains on listed securities at 25% (or 30% for substantial shareholders)
- Non-residents taxed on Israel-source income only
- Dividend withholding tax of 25% (reduced to 15% for qualifying situations)
- National Insurance (Bituach Leumi) contributions mandatory for residents$$ WHERE name = 'Israel';

UPDATE countries SET tax_advice = $$- The Bahamas has zero personal income tax, zero capital gains tax, zero inheritance tax
- No corporate income tax (businesses pay annual license fees instead)
- VAT at 10% (introduced 2015)
- No payroll tax for employers; National Insurance contribution of 3.9% employee + 5.9% employer
- Real property tax based on market value of land and improvements
- Business license fee typically 0.5-1.5% of annual turnover
- Stamp duty on real estate transactions at 2.5-10% depending on value
- No double tax treaties with major economies; US citizens still taxed on worldwide income$$ WHERE name = 'Bahamas';

UPDATE countries SET tax_advice = $$- Pakistan has progressive income tax (5% to 35% for salaried, higher for business income)
- Corporate tax at 29% (reducing to 27% under ongoing reforms)
- GST at 17% (varies by province and category)
- Non-residents taxed on Pakistan-source income only
- Capital gains on securities at 12.5-15% depending on holding period
- Withholding tax system (advance tax) prevalent
- Super tax of 10% on high-income companies
- Pakistan-UK, Pakistan-US, and various other double tax treaties available
- Real estate gains taxed at 3-10% depending on holding period$$ WHERE name = 'Pakistan';

UPDATE countries SET tax_advice = $$- Qatar has zero personal income tax — no taxes on individual salaries, dividends, or capital gains
- Corporate tax at 10% for non-Qatari entities (Qatari and GCC entities may be exempt)
- VAT not yet implemented (planned but not enacted as of 2026)
- No inheritance tax, wealth tax, or gift tax
- Withholding tax of 5% on services paid to non-residents
- Free Zone entities may be fully exempt from corporate tax
- Social security only for Qatari nationals
- Proof of legitimate income needed for residency but not taxed$$ WHERE name = 'Qatar';

UPDATE countries SET tax_advice = $$- Bosnia and Herzegovina has flat 10% personal income tax (varies slightly by entity)
- Corporate tax at 10% (Federation BiH) or 10% (Republika Srpska)
- VAT at 17% (uniform across country — administered by Indirect Taxation Authority)
- Non-residents taxed on BiH-source income only
- Capital gains integrated into income tax base
- Social security contributions approximately 41.5% total (split employer/employee)
- Withholding tax on dividends at 5%
- Complex dual-entity system (Federation and Republika Srpska have separate tax administrations)$$ WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET tax_advice = $$- Egypt has progressive income tax (0% to 25%)
- Corporate tax at 22.5%
- VAT at 14%
- Non-residents taxed on Egypt-source income only
- Capital gains from securities listed on Egyptian Stock Exchange exempt
- Dividend withholding tax of 10% for individuals
- Real estate transaction tax of 2.5%
- Free zone entities may be exempt from corporate tax
- Egypt-US and extensive treaty network available$$ WHERE name = 'Egypt';

UPDATE countries SET tax_advice = $$- Maldives has no personal income tax for individuals
- Business Profit Tax (BPT) at 15% for businesses with revenue over MVR 1 million
- GST at 6% for tourism sector (16% for tourist establishments under GST Act)
- No capital gains tax, inheritance tax, or wealth tax
- Tourism Goods and Services Tax (TGST) is the primary revenue source
- Resort operators pay significant lease fees to the government
- Work permit fees apply for expatriate employees
- No double tax treaty network of significance$$ WHERE name = 'Maldives';

UPDATE countries SET tax_advice = $$- Monaco has zero personal income tax for residents (except French citizens)
- No corporate income tax for most businesses (except financial activities)
- VAT at 20% (same rate as France under customs union)
- No capital gains tax, no inheritance tax between direct heirs, no wealth tax
- French citizens living in Monaco are subject to French income tax under the 1963 Franco-Monégasque Treaty
- Residency requires proof of financial means and accommodation
- Residency is not automatic even without tax considerations; must apply and qualify
- Monaco''s CRS (Common Reporting Standard) membership means financial info shared internationally$$ WHERE name = 'Monaco';

UPDATE countries SET tax_advice = $$- Seychelles has progressive income tax (0% to 15%) under Social Security Act
- Corporate tax at 25% (15% for companies in International Business Companies regime)
- GST at 15%
- International Business Companies (IBCs) can be structured for low/zero tax on non-Seychelles income
- Capital gains generally not taxed for individuals
- Withholding tax of 15% on dividends for residents
- No inheritance tax
- Seychelles is a significant offshore financial center with special IBC and foundation legislation$$ WHERE name = 'Seychelles';

-- =============================================================================
-- Local Tips
-- =============================================================================

UPDATE countries SET local_tips = $$- Hungarian (Magyar) is unique and difficult; learning basics shows respect but English is widely spoken among younger people
- Bureaucracy efficient but can be document-heavy; keep all paperwork organized
- Healthcare good quality; mandatory National Health Insurance (OEP) required for residents
- Cost of living low by EU standards; budget €800-1,200/month comfortably in Budapest
- Budapest neighborhood choice matters: Pest districts 5, 6, 7 central and vibrant; Buda quieter
- Thermal baths are a social institution; visit regularly to integrate into local culture
- Hungarian cuisine hearty and affordable; explore market halls (Nagyvásárcsarnok) for local produce
- Winters can be cold and grey; embrace the ruin bar and cafe culture during colder months$$ WHERE name = 'Hungary';

UPDATE countries SET local_tips = $$- Croatian is the official language; English very common in cities and tourist areas
- Healthcare: register with chosen family doctor (izabrani liječnik) within 30 days of residency
- Cost of living rising in Dalmatia; budget €900-1,400/month in Split or Dubrovnik
- Seasonal economy: summer coastal towns crowded and expensive; off-season much quieter
- Digital nomad visa gives one year renewable stay with work-from-abroad income
- Bureaucracy improving but can be slow; get OIB number (tax ID) first on arrival
- Driving cars with foreign plates: rules around long-term use vary; seek local advice
- Adriatic food culture exceptional; fresh fish and local wine are genuinely world-class$$ WHERE name = 'Croatia';

UPDATE countries SET local_tips = $$- English is the primary language but dialects, accents, and slang vary enormously by region
- Healthcare expensive and insurance critical; marketplace plans available for non-employer coverage
- Social Security Number (SSN) essential for banking, employment, and tax filing
- Cost of living varies dramatically: NYC/SF very expensive; midwest/south much more affordable
- US visa system complex; work with an immigration attorney for best outcomes
- Tipping culture expected: 18-25% at restaurants, 15-20% for taxis/Uber, $1-2/bag for hotel
- Credit score system important; build it carefully from arrival using secured cards
- State varies enormously in laws, taxes, climate, culture; research specific state before choosing where to live$$ WHERE name = 'United States';

UPDATE countries SET local_tips = $$- Japanese language essential for daily life outside major tourist areas; even N4 level helps significantly
- Bureaucracy organized but requires My Number card registration within 14 days of arrival
- Healthcare: National health insurance mandatory; register at ward office immediately
- Cost of living manageable in regional cities; Tokyo expensive especially for housing
- Punctuality absolute; being even 1 minute late is considered rude in professional settings
- IC card (Suica/Pasmo) essential for transportation; buy at any train station
- Garbage sorting rules strict and taken very seriously; learn your ward''s system
- Japanese people indirect in communication; learn to read between the lines and avoid direct confrontation$$ WHERE name = 'Japan';

UPDATE countries SET local_tips = $$- Korean language helpful but English increasingly spoken in Seoul among younger generations
- Alien Registration Card (ARC) required within 90 days; register at immigration office
- Healthcare excellent and affordable with National Health Insurance
- Internet fastest in the world; expect 1Gbps fiber connections standard
- Hierarchy and age-based respect central to social and professional interactions
- Download KakaoTalk app immediately; it''s the dominant communication platform
- Cost of living high in Seoul; consider Busan or Incheon for more affordable options
- Banking: open account with IBK or KEB Hana as foreigner-friendly options$$ WHERE name = 'South Korea';

UPDATE countries SET local_tips = $$- Arabic language not required for expats; English and Hindi widely used in business and daily life
- Emirates ID required within 30 days of visa stamping; process through ICA (ICP)
- Healthcare excellent at private hospitals; medical insurance mandatory for residents
- Cost of living high, especially housing; budget AED 120,000+/year for comfortable expat life
- Ramadan affects business hours, restaurants, and social behavior; dress modestly and be respectful
- Alcohol available in licensed venues only; not sold in general supermarkets
- Summer (June-August) extreme heat (45°C+); most activity moves indoors or to cooler regions
- Summer electric bills high due to air conditioning; factor into budget$$ WHERE name = 'United Arab Emirates';

UPDATE countries SET local_tips = $$- English and French official; French required in Quebec; learn basic French for courtesy nationwide
- SIN (Social Insurance Number) required immediately; apply at Service Canada center
- Healthcare provincial; wait times for specialists can be long; private clinics emerging
- Housing costs very high in Toronto and Vancouver; consider secondary cities
- Weather extreme by region; proper winter gear essential (especially outside BC coast)
- Tap water excellent and safe everywhere; save on bottled water
- Tim Hortons is more than a coffee shop — it''s a cultural institution
- PR process: maintain residency obligations carefully to protect permanent resident status$$ WHERE name = 'Canada';

UPDATE countries SET local_tips = $$- English primary language; most bureaucracy, healthcare, and services in English
- Tax File Number (TFN) required for employment and banking; apply through ATO website
- Medicare (universal healthcare) available to residents; bulk billing eliminates out-of-pocket costs
- Housing crisis in Sydney and Melbourne; consider Brisbane, Adelaide, or Perth
- Skin cancer risk real; SPF 50 sunscreen and UV protective clothing strongly recommended
- Driving on left side; international driver''s license convertible to Australian license
- Public transport varies dramatically by city; car often needed outside major CBDs
- Bushfire and flood awareness essential; check local emergency alerts for your region$$ WHERE name = 'Australia';

UPDATE countries SET local_tips = $$- English primary language; Māori (te reo) increasingly present in public life
- IRD number (tax ID) required before starting work; apply online immediately
- Healthcare good; enroll with a GP practice as soon as possible
- Housing expensive in Auckland and Wellington; consider Hamilton, Christchurch, or regional towns
- Car essential outside Auckland and Wellington; public transport limited in most areas
- Earthquakes common; register for civil defense alerts and know what to do
- Outdoor culture central: hiking (tramping), camping, and sport expected activities
- Kiwi culture values modesty and a fair go; avoid bragging or being seen to think you''re better$$ WHERE name = 'New Zealand';

UPDATE countries SET local_tips = $$- English one of four official languages; communication generally easy for anglophones
- MyInfo/Singpass digital ID required for all government and many private services; set up first
- Healthcare world-class at public and private hospitals; Medishield Life insurance provided for PRs
- Housing expensive; HDB public flats affordable but requires PR/citizen status; private rentals steep
- Heat and humidity year-round; stay hydrated and wear breathable clothing
- Fine-heavy laws: no chewing gum (imported), no jaywalking, no littering; obey strictly
- Hawker centers and food courts offer extraordinary cuisine for SGD 3-5/meal
- ERP electronic road pricing discourages driving; MRT and bus system world-class$$ WHERE name = 'Singapore';

UPDATE countries SET local_tips = $$- Cantonese primary language; Mandarin increasingly useful; English in business/official contexts
- Registration with Immigration Department required for long-term visa holders
- Healthcare excellent at public hospitals (subsidized for visa holders) and private facilities
- Housing extremely expensive; be prepared for very small living spaces even at high cost
- MTR (Mass Transit Railway) world-class and covers city efficiently; Octopus card essential
- Dim sum culture: Sunday yum cha with family is a cherished social institution
- Political situation fluid since 2020; follow news on visa policy and legal environment
- Air quality variable; check AQI daily and have N95 masks available during pollution spikes$$ WHERE name = 'Hong Kong';

UPDATE countries SET local_tips = $$- Czech language helpful but English very common in Prague among professionals and younger people
- Residence registration required within 30 days at local Foreign Police (Cizinecká policie)
- Healthcare free for those contributing to Czech health insurance; register with health fund
- Cost of living low by EU standards; budget €800-1,100/month in Prague
- Beer culture ubiquitous: Czech pub (hospoda) central to social life; learn basic etiquette
- Czech koruna (CZK) not Euro; currency conversion needed for Euro-area travel
- Prague tourist areas saturated in summer; explore local neighborhoods (Žižkov, Vinohrady)
- Drivers and cyclists have different road priorities than UK/US; learn local traffic rules$$ WHERE name = 'Czechia';

UPDATE countries SET local_tips = $$- Slovak language helpful; English widespread especially in Bratislava among young professionals
- Registration with Foreign Police required within 3 days for non-EU citizens
- Healthcare adequate; register with health insurance fund (VšZP, Dôvera, or Union)
- Cost of living lowest in Eurozone; budget €600-900/month comfortably in Bratislava
- Bratislava perfectly positioned between Vienna (45 min) and Budapest (1 hour by bus/train)
- Mountains very close; skiing in Jasná and Low Tatras accessible for weekend trips
- Slovak cuisine hearty and cheap; try bryndzové halušky (potato dumplings with sheep cheese)
- Expat community small but growing; coworking spaces concentrated in downtown Bratislava$$ WHERE name = 'Slovakia';

UPDATE countries SET local_tips = $$- Bulgarian language uses Cyrillic script; learning alphabet helps navigation significantly
- Registration required within 3 months at local municipality for EU citizens, sooner for others
- Healthcare variable quality; supplement public system with private insurance
- Cost of living among EU''s lowest; budget €600-800/month in Sofia
- Bansko excellent ski resort town and growing digital nomad hub with low costs
- Headshaking means yes, head nodding means no — opposite of most cultures; memorize this
- Black Sea resorts crowded in July-August; shoulder seasons (May-June, Sept) ideal
- Sofia growing tech scene; monthly startup events and networking worth attending$$ WHERE name = 'Bulgaria';

UPDATE countries SET local_tips = $$- Romanian language is Romance-based; Spanish or Italian speakers adapt quickly
- Registration with Population Records within 15 days of arrival (EU citizens: within 3 months)
- Healthcare improving but slow in public system; private insurance recommended
- Internet fastest in Europe; remote work infrastructure excellent
- Cost of living very low; budget €600-900/month in Bucharest or Brașov
- Transylvania and Carpathians easily accessible for weekend adventures
- Bucharest growing fast; gentrifying neighborhoods (Floreasca, Dorobanți, Pantelimon) worth exploring
- Tap water safe in Bucharest but bottled often preferred; check by city/town$$ WHERE name = 'Romania';

UPDATE countries SET local_tips = $$- Luxembourgish, French, and German all used in daily life; English essential in business
- Registration with commune required within 3 months; get official residence certificate
- Healthcare excellent and mandatory insurance (CNS) required for all residents
- Extremely high cost of living; housing shortage severe; budget €2,500+/month
- Cross-border commuters (from France, Germany, Belgium) very common; understand commute options
- Free public transport (buses, trains, trams) for all since 2020 — a world first
- International expat community large; English-speaking social networks very established
- Luxembourg City small but culturally rich; proximity to surrounding countries unparalleled$$ WHERE name = 'Luxembourg';

UPDATE countries SET local_tips = $$- English widely spoken in Cape Town and Johannesburg; Afrikaans and Zulu also common
- Smart ID and green barcoded ID book required; foreign residents need valid permit always on person
- Healthcare: private hospitals excellent (Discovery, Netcare); public system strained — get private insurance
- Load shedding (scheduled power cuts) affects daily life; invest in backup power/battery
- Personal security awareness important; avoid displaying valuables and research safe neighborhoods
- Cost of living very low by global standards; budget ZAR 15,000-25,000/month for comfortable life
- Wildlife within reach of Johannesburg and Cape Town; regular safari weekends possible
- South African food scene underrated: braai culture, Cape Malay cuisine, and Durban curry all exceptional$$ WHERE name = 'South Africa';

UPDATE countries SET local_tips = $$- Slovenian language similar to Croatian/Serbian; English very widespread especially in Ljubljana
- Registration with Administrative Unit required within 8 days for non-EU citizens
- Healthcare excellent; mandatory health insurance registration on arrival
- Cost of living moderate by EU standards; budget €900-1,200/month in Ljubljana
- Lake Bled just 1 hour from Ljubljana; easily accessible for regular escapes
- Triglav National Park UNESCO World Heritage site; hiking and outdoor culture central to Slovenian identity
- Ljubljana car-free center; cycling very popular and infrastructure excellent
- Very safe and clean; consistently ranked top European country for quality of life$$ WHERE name = 'Slovenia';

UPDATE countries SET local_tips = $$- Latvian and Russian both widely spoken; English very common especially in Riga
- Register with PMLP (Office of Citizenship and Migration Affairs) within 3 months
- Healthcare: register with family doctor; health insurance for non-EU residents recommended
- Cost of living low by EU standards; budget €700-1,000/month in Riga
- Riga Art Nouveau district genuinely world-class; best explored on foot
- Baltic summers short but beautiful; make the most of June-August outdoor season
- Jurmala (seaside resort 30 min from Riga) excellent for beach days
- Growing fintech sector; networking in startup and finance community productive$$ WHERE name = 'Latvia';

UPDATE countries SET local_tips = $$- Lithuanian and Russian both spoken; English widespread among professionals and younger people
- Register at Migration Department within 3 months (EU) or within residency visa conditions
- Healthcare: register with State Patient Fund (VPSP); private clinics also excellent and affordable
- Cost of living low by Eurozone standards; budget €700-1,000/month in Vilnius
- Vilnius tech and fintech ecosystem growing fast; attend Vilnius Tech Park and LOGIN events
- Curonian Spit accessible for weekend trips from Vilnius; unique natural landscape
- Vilnius Old Town among Europe''s best preserved and least crowded; explore thoroughly
- Lithuanian amber considered world''s finest; great authentic souvenirs$$ WHERE name = 'Lithuania';

UPDATE countries SET local_tips = $$- Mandarin Chinese (Putonghua) official and essential for daily life; regional dialects also common
- Residence permits required within 30 days of arrival; register at local Public Security Bureau
- VPN essential for accessing Google, Gmail, WhatsApp, Facebook, Instagram, and most Western sites
- Healthcare: large cities excellent private hospitals; expat health insurance strongly recommended
- WeChat is everything: payments, maps, ordering, messaging, and social life — set up immediately
- High-speed rail network extraordinary; travel between cities by HSR much faster than flying
- Cost of living very affordable outside Shanghai and Beijing; budget ¥8,000-15,000/month
- Air quality varies; check real-time AQI and use N95 masks during high pollution days$$ WHERE name = 'China';

UPDATE countries SET local_tips = $$- Mongolian language Cyrillic-based; Russian and English basic phrases very helpful in Ulaanbaatar
- Extreme climate: prepare for -40°C winters and +35°C summers; appropriate gear essential
- Healthcare: private hospitals in Ulaanbaatar adequate; evacuate to Seoul or Tokyo for serious conditions
- Cost of living very low; budget ₮500,000-800,000/month for comfortable expat life
- Air pollution severe in Ulaanbaatar winter due to coal heating; N95 masks essential
- Nomadic hospitality rules: always accept offered food and drink (especially airag/fermented mare''s milk)
- Naadam festival (July) national celebration — extraordinary cultural experience for newcomers
- Travel in rural areas requires guide, spare tires, extra fuel; roads minimal outside cities$$ WHERE name = 'Mongolia';

UPDATE countries SET local_tips = $$- German official language; English spoken in business but everyday German essential
- Residency permit application through Ausländeramt; requires appointment booked in advance
- Healthcare mandatory Swiss insurance (Grundversicherung) required within 3 months; very expensive
- Extremely high cost of living; budget CHF 4,000-6,000+/month even outside Zurich/Geneva
- Rhine Valley location very scenic; hiking and cycling from Vaduz excellent
- Swiss cross-border shopping common; residents regularly shop in Austria and Switzerland for staples
- Very small community; everyone knows everyone; discretion and respect for neighbors important
- Train connections to Zurich (1 hour) and Innsbruck easy for wider European travel$$ WHERE name = 'Liechtenstein';

UPDATE countries SET local_tips = $$- Arabic essential in daily life; English widely spoken in business and major cities
- Iqama (residency permit) required for employment; sponsor/employer manages process
- Healthcare: excellent private hospitals (King Faisal, Johns Hopkins Arabia); mandatory health insurance
- Heat extreme in summer (50°C+); move outdoors to evenings only May-September
- Dress modestly; abaya required in some traditional areas; check current regulations
- Avoid all criticism of government, royal family, or religion; legal consequences severe
- Halal food only; alcohol completely prohibited throughout the Kingdom
- Vision 2030 creating rapid cultural shifts; entertainment, sports, and tourism expanding fast$$ WHERE name = 'Saudi Arabia';

UPDATE countries SET local_tips = $$- Vietnamese language tonal and challenging; English increasingly common in cities and tourist areas
- Temporary residence registration required within 1 month at local police station
- Healthcare: private international hospitals (Vinmec, FV Hospital) excellent; health insurance recommended
- Cost of living extraordinary value; budget $500-800/month for comfortable expat lifestyle
- Motorbike culture dominates; traffic rules informal; hire experienced driver initially or take taxis
- Da Nang, Hoi An, and Ho Chi Minh City main digital nomad hubs with excellent coworking
- Cash dominant outside major cities; carry dong and USD for rural areas
- Rainy/typhoon season (October-December in north and centre) affects travel; plan accordingly$$ WHERE name = 'Vietnam';

UPDATE countries SET local_tips = $$- Spanish official; Argentine Spanish distinct with vos usage and Italian-influenced accent
- DNI (national identity document) or cedula required; for long-term residents, obtain CUIL/CUIT
- Healthcare: private clinics excellent in Buenos Aires; OSDE insurance recommended
- Currency situation complex; blue dollar (informal) rate much better than official; seek local advice
- Cost of living very low in USD/EUR terms despite high local inflation
- Buenos Aires: research neighborhoods (Palermo, Belgrano, Recoleta) for best expat fit
- Safety variable by neighborhood and city; research before going to unfamiliar areas
- Argentines eat dinner very late (10pm-midnight); social life starts extremely late by most standards$$ WHERE name = 'Argentina';

UPDATE countries SET local_tips = $$- Portuguese (Brazilian dialect) official; different from European Portuguese in accent and vocabulary
- CPF (Cadastro de Pessoas Físicas) number essential for banking, contracts, and tax — obtain first
- Healthcare: SUS public system free but often overcrowded; private insurance strongly recommended
- Cost of living varies dramatically; São Paulo expensive by South American standards; smaller cities affordable
- Safety awareness critical in major cities; research neighborhoods and apply common-sense precautions
- Traffic culture aggressive; Uber widely available and preferred over driving initially
- Digital nomad visa available; requires minimum $1,500/month income proof
- Brazilians very warm and social; participating in churrasco and futebol culture accelerates integration$$ WHERE name = 'Brazil';

UPDATE countries SET local_tips = $$- English widely spoken in business, education, and urban India; regional languages helpful
- FRRO (Foreign Regional Registration Office) registration required within 14 days for most visas
- Healthcare: international hospitals (Apollo, Fortis, Manipal) excellent in major cities; insurance essential
- Extreme climate variation: monsoon (June-September), intense heat in plains, cold in mountains
- Cost of living very low; budget ₹50,000-80,000/month for comfortable expat life in major cities
- Traffic chaotic in all major cities; hire local driver initially rather than driving yourself
- Chai culture important social lubricant; participate genuinely in social customs
- India moves on relationship (jugaad) basis; building trust and personal connections essential for business$$ WHERE name = 'India';

UPDATE countries SET local_tips = $$- Malay official language; English widely used in business and daily life — genuinely accessible
- Visa/residence permit through Immigration Department; MM2H requires financial proof and approvals
- Healthcare excellent at private hospitals (Prince Court, Pantai); Medic medical insurance recommended
- Cost of living very reasonable; budget RM 4,000-6,000/month for comfortable expat life
- Islamic customs respected; dress modestly at mosques and religious sites
- Heat and humidity year-round; air conditioning essential and universally available
- Grab app (like Uber) essential for transport; MRT excellent in KL
- Hawker food culture extraordinary; Jalan Alor, Chow Kit, and Chinatown food streets legendary$$ WHERE name = 'Malaysia';

UPDATE countries SET local_tips = $$- Romanian/Moldovan is the official language; Russian widely spoken by minorities
- Registration required within 30 days at local Civil Records Office
- Healthcare: private clinics in Chișinău adequate; medical insurance for serious conditions needed
- Cost of living among Europe''s lowest; budget €400-600/month comfortably
- Wine experience genuinely extraordinary; Cricova winery tours world-class
- Power outages historically common; have backup solutions especially in winter
- Transnistria region interesting day trip from Chișinău; carry passport and be aware of unusual rules
- Romanian citizenship option widely pursued by eligible Moldovans for EU freedom of movement$$ WHERE name = 'Moldova';

UPDATE countries SET local_tips = $$- Albanian is the official language; Italian widely understood; English growing rapidly
- Registration at local Civil Registration Office required within 30 days of residency
- Healthcare: private clinics in Tirana adequate for most needs; international insurance for serious conditions
- Cost of living among Europe''s absolute lowest; budget €400-600/month comfortably
- Tirana''s transformation rapid; Blloku district coffee culture excellent and trendy
- Albanian Riviera accessible by furgon (shared minibus) from Tirana; car hire more flexible
- Driving can be challenging; traffic rules loosely observed especially in cities
- Expat and digital nomad community growing quickly; Tirana ranked as emerging nomad hub$$ WHERE name = 'Albania';

UPDATE countries SET local_tips = $$- Georgian language uses unique script (Mkhedruli); learn to recognize it but English widespread in Tbilisi
- Registration not required for up to 1-year stays; for longer, apply for residence permit
- Healthcare: private clinics in Tbilisi excellent and very affordable; international standard
- Cost of living very low; budget €600-900/month very comfortably in Tbilisi
- Wine culture pervasive; natural and qvevri wines fundamental to social life
- Supras (feasts) can last for hours with multiple toasts; pace yourself with the chacha (grape brandy)
- Tbilisi nightlife (especially techno scene) world-renowned; Bassiani and Khidi venues legendary
- Kazbegi mountain road stunning but sometimes closed in winter; check conditions before driving$$ WHERE name = 'Georgia';

UPDATE countries SET local_tips = $$- Hebrew and Arabic official languages; English widely spoken especially in Tel Aviv and tech sector
- Population Registry (Ministry of Interior) registration required; Olim have dedicated Aliyah process
- Healthcare: universal Kupat Holim system excellent; join one of four health funds immediately
- Cost of living in Tel Aviv very high; one of world''s most expensive cities for housing
- Shabbat (Friday sunset to Saturday night) affects most services and transport — plan around it
- Security situation awareness important; follow government advisories and be aware of surroundings
- Startup ecosystem world-class; attend TechTLV, HUB:TLV events for networking
- Israeli directness (chutzpah) can feel abrasive; it is cultural, not personal — respond in kind$$ WHERE name = 'Israel';

UPDATE countries SET local_tips = $$- English official language; Bahamian Creole spoken socially; very accessible for English speakers
- Immigration registration at Department of Immigration; carry visa documentation always
- Healthcare: Princess Margaret Hospital public; Doctors Hospital private and high quality; insurance essential
- Cost of living high; budget BSD 3,000-4,500/month for comfortable expat life
- Hurricane season June-November; hurricane shutters/preparedness essential; monitor weather closely
- Alcohol available but expensive; local Sands and Kalik beers most affordable
- Water activity culture central: sailing, diving, snorkeling key to social integration
- Banking: Nassau has international banking options; US banking also often maintained$$ WHERE name = 'Bahamas';

UPDATE countries SET local_tips = $$- Urdu national language; English has official status and widely used in business and education
- NADRA registration and Pakistan Origin Card (POC) or National Identity Card for Overseas Pakistanis
- Healthcare: private hospitals in Islamabad and Karachi excellent (Shifa, Aga Khan); insurance recommended
- Cost of living very low; budget PKR 80,000-120,000/month very comfortably in major cities
- Northern areas (Gilgit-Baltistan, Hunza) extraordinarily beautiful and safe; highly recommended
- Security situation varies by region; research specific areas; avoid conflict zones near Afghan border
- Pakistani hospitality legendary; accept home invitations and participate in meals enthusiastically
- Mobile data excellent in cities; remote mountain areas limited connectivity$$ WHERE name = 'Pakistan';

UPDATE countries SET local_tips = $$- Arabic official language; English widely used in business and hospitality sectors
- Residency permit (RP) required; employer typically manages for work visa holders
- Healthcare: Hamad Medical Corporation excellent public healthcare for residents
- Heat extremely intense May-September; outdoor activities only possible in evenings
- Alcohol available only in licensed hotels and restaurants; not widely available
- Islamic customs respected; dress modestly especially outside resort areas
- Qatar Foundation and Doha Institute offer excellent cultural programming in English
- Corniche waterfront and Katara cultural village excellent for outdoor activities in cooler months$$ WHERE name = 'Qatar';

UPDATE countries SET local_tips = $$- Bosnian/Croatian/Serbian mutually intelligible; English growing especially in Sarajevo and among younger people
- Registration at Ministry of Civil Affairs required; process can be slow
- Healthcare: private clinics in Sarajevo adequate; insurance for serious conditions recommended
- Cost of living among Europe''s very lowest; budget €400-700/month comfortably
- Sarajevo food culture extraordinary; cevapi (grilled meat) and baklava iconic
- Warm hospitality culture; invitations to coffee (kafa) important social rituals
- Driving between entities requires attention; road quality varies; watch speed cameras
- Mostar day trip from Sarajevo (2.5 hours) absolutely worth it for the iconic bridge$$ WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET local_tips = $$- Arabic (Egyptian dialect) most widely understood Arabic in the world due to media influence
- Registration with CAPMAS (immigration authorities) required; process varies by visa type
- Healthcare: private hospitals excellent in Cairo (Cairo American Medical Center); insurance strongly recommended
- Extremely hot April-September; avoid midday sun and schedule activities for morning/evening
- Traffic chaotic in Cairo; Uber/Careem safer than hailing taxis; metro efficient for city travel
- Cost of living very low; budget EGP 15,000-25,000/month for comfortable life
- Islamic hospitality culture; accepting tea/coffee offers important for building relationships
- Nile cruises between Luxor and Aswan (2-3 days) among world''s great travel experiences$$ WHERE name = 'Egypt';

UPDATE countries SET local_tips = $$- Dhivehi (Maldivian) official; English universally spoken in tourism sectors
- Work permit and residency through employer (resort) manages all documentation
- Healthcare: Malé has limited hospital (ADK Hospital); serious cases evacuated to Sri Lanka or India
- Heat year-round (29-31°C) but cooling ocean breeze; sun protection critical (UV intensity extreme)
- Alcohol only on resort islands; local islands strictly dry; check policies before booking non-resort stays
- Muslim culture on local islands; dress modestly when visiting non-resort communities
- Speedboat or seaplane transfers between Malé airport and resorts; book in advance
- Coral bleaching a growing concern; check reef health at specific atolls before diving trips$$ WHERE name = 'Maldives';

UPDATE countries SET local_tips = $$- French official language; widely spoken; English in business and international community
- Residency requires application to Direction de la Sûreté Publique; significant documentation required
- Healthcare: CHPG hospital public; private clinics also excellent; French health system accessible for some residents
- Extremely high cost of living; housing among world''s most expensive; parking spaces cost more than flats elsewhere
- Walking everywhere practical; Monaco is tiny (2km²) and very walkable with excellent elevator/escalator infrastructure
- Casino etiquette: dress code applies; Monégasques cannot enter Casino de Monte-Carlo
- Grand Prix week (May) transforms the principality; book far ahead and expect massive crowds
- Excellent train access to Nice (25 min), Cannes (50 min), and Italian Riviera for daily escapes$$ WHERE name = 'Monaco';

UPDATE countries SET local_tips = $$- Seychellois Creole (Kreol Seselwa), English, and French all official languages; English most practical
- Visitor Permit issued on arrival; register with Immigration for longer stays
- Healthcare: Victoria Hospital public; private clinics available; evacuation insurance recommended for serious conditions
- Heat year-round (27-30°C); sun protection essential — UV very intense at Indian Ocean latitude
- Car hire on Mahé and Praslin essential as taxis expensive; drive on left (British colonial legacy)
- Cost of living high for groceries and imported goods; local fruit and fish affordable
- Boat charters from Mahé to inner islands essential for island-hopping; book in advance
- Cyclone season January-April; monitor warnings though Seychelles relatively well-protected geographically$$ WHERE name = 'Seychelles';


-- ============================================================
-- Migration: 20260430000000_create_ai_chat.sql
-- ============================================================
-- Migration: AI Chat sessions and messages

begin;

create table if not exists public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content text not null,
  tool_calls jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_ai_chat_sessions_user on public.ai_chat_sessions (user_id);
create index if not exists idx_ai_chat_messages_session on public.ai_chat_messages (session_id);

-- RLS
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;

create policy "Users can manage own sessions"
  on public.ai_chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own messages"
  on public.ai_chat_messages for all
  using (
    session_id in (
      select id from public.ai_chat_sessions where user_id = auth.uid()
    )
  )
  with check (
    session_id in (
      select id from public.ai_chat_sessions where user_id = auth.uid()
    )
  );

-- Grants
grant select, insert, update, delete on public.ai_chat_sessions to anon, authenticated;
grant select, insert, update, delete on public.ai_chat_messages to anon, authenticated;

commit;


-- ============================================================
-- Migration: 20260502233424_remote_schema.sql
-- ============================================================
drop extension if exists "pg_net";

create sequence "public"."directus_activity_id_seq";

create sequence "public"."directus_fields_id_seq";

create sequence "public"."directus_notifications_id_seq";

create sequence "public"."directus_permissions_id_seq";

create sequence "public"."directus_presets_id_seq";

create sequence "public"."directus_relations_id_seq";

create sequence "public"."directus_revisions_id_seq";

create sequence "public"."directus_settings_id_seq";

create sequence "public"."directus_webhooks_id_seq";


  create table "public"."directus_access" (
    "id" uuid not null,
    "role" uuid,
    "user" uuid,
    "policy" uuid not null,
    "sort" integer
      );


alter table "public"."directus_access" enable row level security;


  create table "public"."directus_activity" (
    "id" integer not null default nextval('public.directus_activity_id_seq'::regclass),
    "action" character varying(45) not null,
    "user" uuid,
    "timestamp" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "ip" character varying(50),
    "user_agent" text,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "origin" character varying(255)
      );


alter table "public"."directus_activity" enable row level security;


  create table "public"."directus_collections" (
    "collection" character varying(64) not null,
    "icon" character varying(64),
    "note" text,
    "display_template" character varying(255),
    "hidden" boolean not null default false,
    "singleton" boolean not null default false,
    "translations" json,
    "archive_field" character varying(64),
    "archive_app_filter" boolean not null default true,
    "archive_value" character varying(255),
    "unarchive_value" character varying(255),
    "sort_field" character varying(64),
    "accountability" character varying(255) default 'all'::character varying,
    "color" character varying(255),
    "item_duplication_fields" json,
    "sort" integer,
    "group" character varying(64),
    "collapse" character varying(255) not null default 'open'::character varying,
    "preview_url" character varying(255),
    "versioning" boolean not null default false
      );


alter table "public"."directus_collections" enable row level security;


  create table "public"."directus_comments" (
    "id" uuid not null,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "comment" text not null,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_updated" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "user_updated" uuid
      );


alter table "public"."directus_comments" enable row level security;


  create table "public"."directus_dashboards" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "icon" character varying(64) not null default 'dashboard'::character varying,
    "note" text,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "color" character varying(255)
      );


alter table "public"."directus_dashboards" enable row level security;


  create table "public"."directus_extensions" (
    "enabled" boolean not null default true,
    "id" uuid not null,
    "folder" character varying(255) not null,
    "source" character varying(255) not null,
    "bundle" uuid
      );


alter table "public"."directus_extensions" enable row level security;


  create table "public"."directus_fields" (
    "id" integer not null default nextval('public.directus_fields_id_seq'::regclass),
    "collection" character varying(64) not null,
    "field" character varying(64) not null,
    "special" character varying(64),
    "interface" character varying(64),
    "options" json,
    "display" character varying(64),
    "display_options" json,
    "readonly" boolean not null default false,
    "hidden" boolean not null default false,
    "sort" integer,
    "width" character varying(30) default 'full'::character varying,
    "translations" json,
    "note" text,
    "conditions" json,
    "required" boolean default false,
    "group" character varying(64),
    "validation" json,
    "validation_message" text
      );


alter table "public"."directus_fields" enable row level security;


  create table "public"."directus_files" (
    "id" uuid not null,
    "storage" character varying(255) not null,
    "filename_disk" character varying(255),
    "filename_download" character varying(255) not null,
    "title" character varying(255),
    "type" character varying(255),
    "folder" uuid,
    "uploaded_by" uuid,
    "created_on" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "modified_by" uuid,
    "modified_on" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "charset" character varying(50),
    "filesize" bigint,
    "width" integer,
    "height" integer,
    "duration" integer,
    "embed" character varying(200),
    "description" text,
    "location" text,
    "tags" text,
    "metadata" json,
    "focal_point_x" integer,
    "focal_point_y" integer,
    "tus_id" character varying(64),
    "tus_data" json,
    "uploaded_on" timestamp with time zone
      );


alter table "public"."directus_files" enable row level security;


  create table "public"."directus_flows" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "icon" character varying(64),
    "color" character varying(255),
    "description" text,
    "status" character varying(255) not null default 'active'::character varying,
    "trigger" character varying(255),
    "accountability" character varying(255) default 'all'::character varying,
    "options" json,
    "operation" uuid,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );


alter table "public"."directus_flows" enable row level security;


  create table "public"."directus_folders" (
    "id" uuid not null,
    "name" character varying(255) not null,
    "parent" uuid
      );


alter table "public"."directus_folders" enable row level security;


  create table "public"."directus_migrations" (
    "version" character varying(255) not null,
    "name" character varying(255) not null,
    "timestamp" timestamp with time zone default CURRENT_TIMESTAMP
      );


alter table "public"."directus_migrations" enable row level security;


  create table "public"."directus_notifications" (
    "id" integer not null default nextval('public.directus_notifications_id_seq'::regclass),
    "timestamp" timestamp with time zone default CURRENT_TIMESTAMP,
    "status" character varying(255) default 'inbox'::character varying,
    "recipient" uuid not null,
    "sender" uuid,
    "subject" character varying(255) not null,
    "message" text,
    "collection" character varying(64),
    "item" character varying(255)
      );


alter table "public"."directus_notifications" enable row level security;


  create table "public"."directus_operations" (
    "id" uuid not null,
    "name" character varying(255),
    "key" character varying(255) not null,
    "type" character varying(255) not null,
    "position_x" integer not null,
    "position_y" integer not null,
    "options" json,
    "resolve" uuid,
    "reject" uuid,
    "flow" uuid not null,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );


alter table "public"."directus_operations" enable row level security;


  create table "public"."directus_panels" (
    "id" uuid not null,
    "dashboard" uuid not null,
    "name" character varying(255),
    "icon" character varying(64) default NULL::character varying,
    "color" character varying(10),
    "show_header" boolean not null default false,
    "note" text,
    "type" character varying(255) not null,
    "position_x" integer not null,
    "position_y" integer not null,
    "width" integer not null,
    "height" integer not null,
    "options" json,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid
      );


alter table "public"."directus_panels" enable row level security;


  create table "public"."directus_permissions" (
    "id" integer not null default nextval('public.directus_permissions_id_seq'::regclass),
    "collection" character varying(64) not null,
    "action" character varying(10) not null,
    "permissions" json,
    "validation" json,
    "presets" json,
    "fields" text,
    "policy" uuid not null
      );


alter table "public"."directus_permissions" enable row level security;


  create table "public"."directus_policies" (
    "id" uuid not null,
    "name" character varying(100) not null,
    "icon" character varying(64) not null default 'badge'::character varying,
    "description" text,
    "ip_access" text,
    "enforce_tfa" boolean not null default false,
    "admin_access" boolean not null default false,
    "app_access" boolean not null default false
      );


alter table "public"."directus_policies" enable row level security;


  create table "public"."directus_presets" (
    "id" integer not null default nextval('public.directus_presets_id_seq'::regclass),
    "bookmark" character varying(255),
    "user" uuid,
    "role" uuid,
    "collection" character varying(64),
    "search" character varying(100),
    "layout" character varying(100) default 'tabular'::character varying,
    "layout_query" json,
    "layout_options" json,
    "refresh_interval" integer,
    "filter" json,
    "icon" character varying(64) default 'bookmark'::character varying,
    "color" character varying(255)
      );


alter table "public"."directus_presets" enable row level security;


  create table "public"."directus_relations" (
    "id" integer not null default nextval('public.directus_relations_id_seq'::regclass),
    "many_collection" character varying(64) not null,
    "many_field" character varying(64) not null,
    "one_collection" character varying(64),
    "one_field" character varying(64),
    "one_collection_field" character varying(64),
    "one_allowed_collections" text,
    "junction_field" character varying(64),
    "sort_field" character varying(64),
    "one_deselect_action" character varying(255) not null default 'nullify'::character varying
      );


alter table "public"."directus_relations" enable row level security;


  create table "public"."directus_revisions" (
    "id" integer not null default nextval('public.directus_revisions_id_seq'::regclass),
    "activity" integer not null,
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "data" json,
    "delta" json,
    "parent" integer,
    "version" uuid
      );


alter table "public"."directus_revisions" enable row level security;


  create table "public"."directus_roles" (
    "id" uuid not null,
    "name" character varying(100) not null,
    "icon" character varying(64) not null default 'supervised_user_circle'::character varying,
    "description" text,
    "parent" uuid
      );


alter table "public"."directus_roles" enable row level security;


  create table "public"."directus_sessions" (
    "token" character varying(64) not null,
    "user" uuid,
    "expires" timestamp with time zone not null,
    "ip" character varying(255),
    "user_agent" text,
    "share" uuid,
    "origin" character varying(255),
    "next_token" character varying(64)
      );


alter table "public"."directus_sessions" enable row level security;


  create table "public"."directus_settings" (
    "id" integer not null default nextval('public.directus_settings_id_seq'::regclass),
    "project_name" character varying(100) not null default 'Directus'::character varying,
    "project_url" character varying(255),
    "project_color" character varying(255) not null default '#6644FF'::character varying,
    "project_logo" uuid,
    "public_foreground" uuid,
    "public_background" uuid,
    "public_note" text,
    "auth_login_attempts" integer default 25,
    "auth_password_policy" character varying(100),
    "storage_asset_transform" character varying(7) default 'all'::character varying,
    "storage_asset_presets" json,
    "custom_css" text,
    "storage_default_folder" uuid,
    "basemaps" json,
    "mapbox_key" character varying(255),
    "module_bar" json,
    "project_descriptor" character varying(100),
    "default_language" character varying(255) not null default 'en-US'::character varying,
    "custom_aspect_ratios" json,
    "public_favicon" uuid,
    "default_appearance" character varying(255) not null default 'auto'::character varying,
    "default_theme_light" character varying(255),
    "theme_light_overrides" json,
    "default_theme_dark" character varying(255),
    "theme_dark_overrides" json,
    "report_error_url" character varying(255),
    "report_bug_url" character varying(255),
    "report_feature_url" character varying(255),
    "public_registration" boolean not null default false,
    "public_registration_verify_email" boolean not null default true,
    "public_registration_role" uuid,
    "public_registration_email_filter" json,
    "visual_editor_urls" json,
    "accepted_terms" boolean default false,
    "project_id" uuid,
    "mcp_enabled" boolean not null default false,
    "mcp_allow_deletes" boolean not null default false,
    "mcp_prompts_collection" character varying(255) default NULL::character varying,
    "mcp_system_prompt_enabled" boolean not null default true,
    "mcp_system_prompt" text
      );


alter table "public"."directus_settings" enable row level security;


  create table "public"."directus_shares" (
    "id" uuid not null,
    "name" character varying(255),
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "role" uuid,
    "password" character varying(255),
    "user_created" uuid,
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_start" timestamp with time zone,
    "date_end" timestamp with time zone,
    "times_used" integer default 0,
    "max_uses" integer
      );


alter table "public"."directus_shares" enable row level security;


  create table "public"."directus_translations" (
    "id" uuid not null,
    "language" character varying(255) not null,
    "key" character varying(255) not null,
    "value" text not null
      );


alter table "public"."directus_translations" enable row level security;


  create table "public"."directus_users" (
    "id" uuid not null,
    "first_name" character varying(50),
    "last_name" character varying(50),
    "email" character varying(128),
    "password" character varying(255),
    "location" character varying(255),
    "title" character varying(50),
    "description" text,
    "tags" json,
    "avatar" uuid,
    "language" character varying(255) default NULL::character varying,
    "tfa_secret" character varying(255),
    "status" character varying(16) not null default 'active'::character varying,
    "role" uuid,
    "token" character varying(255),
    "last_access" timestamp with time zone,
    "last_page" character varying(255),
    "provider" character varying(128) not null default 'default'::character varying,
    "external_identifier" character varying(255),
    "auth_data" json,
    "email_notifications" boolean default true,
    "appearance" character varying(255),
    "theme_dark" character varying(255),
    "theme_light" character varying(255),
    "theme_light_overrides" json,
    "theme_dark_overrides" json,
    "text_direction" character varying(255) not null default 'auto'::character varying
      );


alter table "public"."directus_users" enable row level security;


  create table "public"."directus_versions" (
    "id" uuid not null,
    "key" character varying(64) not null,
    "name" character varying(255),
    "collection" character varying(64) not null,
    "item" character varying(255) not null,
    "hash" character varying(255),
    "date_created" timestamp with time zone default CURRENT_TIMESTAMP,
    "date_updated" timestamp with time zone default CURRENT_TIMESTAMP,
    "user_created" uuid,
    "user_updated" uuid,
    "delta" json
      );


alter table "public"."directus_versions" enable row level security;


  create table "public"."directus_webhooks" (
    "id" integer not null default nextval('public.directus_webhooks_id_seq'::regclass),
    "name" character varying(255) not null,
    "method" character varying(10) not null default 'POST'::character varying,
    "url" character varying(255) not null,
    "status" character varying(10) not null default 'active'::character varying,
    "data" boolean not null default true,
    "actions" character varying(100) not null,
    "collections" character varying(255) not null,
    "headers" json,
    "was_active_before_deprecation" boolean not null default false,
    "migrated_flow" uuid
      );


alter table "public"."directus_webhooks" enable row level security;

alter sequence "public"."directus_activity_id_seq" owned by "public"."directus_activity"."id";

alter sequence "public"."directus_fields_id_seq" owned by "public"."directus_fields"."id";

alter sequence "public"."directus_notifications_id_seq" owned by "public"."directus_notifications"."id";

alter sequence "public"."directus_permissions_id_seq" owned by "public"."directus_permissions"."id";

alter sequence "public"."directus_presets_id_seq" owned by "public"."directus_presets"."id";

alter sequence "public"."directus_relations_id_seq" owned by "public"."directus_relations"."id";

alter sequence "public"."directus_revisions_id_seq" owned by "public"."directus_revisions"."id";

alter sequence "public"."directus_settings_id_seq" owned by "public"."directus_settings"."id";

alter sequence "public"."directus_webhooks_id_seq" owned by "public"."directus_webhooks"."id";

CREATE UNIQUE INDEX directus_access_pkey ON public.directus_access USING btree (id);

CREATE UNIQUE INDEX directus_activity_pkey ON public.directus_activity USING btree (id);

CREATE UNIQUE INDEX directus_collections_pkey ON public.directus_collections USING btree (collection);

CREATE UNIQUE INDEX directus_comments_pkey ON public.directus_comments USING btree (id);

CREATE UNIQUE INDEX directus_dashboards_pkey ON public.directus_dashboards USING btree (id);

CREATE UNIQUE INDEX directus_extensions_pkey ON public.directus_extensions USING btree (id);

CREATE UNIQUE INDEX directus_fields_pkey ON public.directus_fields USING btree (id);

CREATE UNIQUE INDEX directus_files_pkey ON public.directus_files USING btree (id);

CREATE UNIQUE INDEX directus_flows_operation_unique ON public.directus_flows USING btree (operation);

CREATE UNIQUE INDEX directus_flows_pkey ON public.directus_flows USING btree (id);

CREATE UNIQUE INDEX directus_folders_pkey ON public.directus_folders USING btree (id);

CREATE UNIQUE INDEX directus_migrations_pkey ON public.directus_migrations USING btree (version);

CREATE UNIQUE INDEX directus_notifications_pkey ON public.directus_notifications USING btree (id);

CREATE UNIQUE INDEX directus_operations_pkey ON public.directus_operations USING btree (id);

CREATE UNIQUE INDEX directus_operations_reject_unique ON public.directus_operations USING btree (reject);

CREATE UNIQUE INDEX directus_operations_resolve_unique ON public.directus_operations USING btree (resolve);

CREATE UNIQUE INDEX directus_panels_pkey ON public.directus_panels USING btree (id);

CREATE UNIQUE INDEX directus_permissions_pkey ON public.directus_permissions USING btree (id);

CREATE UNIQUE INDEX directus_policies_pkey ON public.directus_policies USING btree (id);

CREATE UNIQUE INDEX directus_presets_pkey ON public.directus_presets USING btree (id);

CREATE UNIQUE INDEX directus_relations_pkey ON public.directus_relations USING btree (id);

CREATE UNIQUE INDEX directus_revisions_pkey ON public.directus_revisions USING btree (id);

CREATE UNIQUE INDEX directus_roles_pkey ON public.directus_roles USING btree (id);

CREATE UNIQUE INDEX directus_sessions_pkey ON public.directus_sessions USING btree (token);

CREATE UNIQUE INDEX directus_settings_pkey ON public.directus_settings USING btree (id);

CREATE UNIQUE INDEX directus_shares_pkey ON public.directus_shares USING btree (id);

CREATE UNIQUE INDEX directus_translations_pkey ON public.directus_translations USING btree (id);

CREATE UNIQUE INDEX directus_users_email_unique ON public.directus_users USING btree (email);

CREATE UNIQUE INDEX directus_users_external_identifier_unique ON public.directus_users USING btree (external_identifier);

CREATE UNIQUE INDEX directus_users_pkey ON public.directus_users USING btree (id);

CREATE UNIQUE INDEX directus_users_token_unique ON public.directus_users USING btree (token);

CREATE UNIQUE INDEX directus_versions_pkey ON public.directus_versions USING btree (id);

CREATE UNIQUE INDEX directus_webhooks_pkey ON public.directus_webhooks USING btree (id);

alter table "public"."directus_access" add constraint "directus_access_pkey" PRIMARY KEY using index "directus_access_pkey";

alter table "public"."directus_activity" add constraint "directus_activity_pkey" PRIMARY KEY using index "directus_activity_pkey";

alter table "public"."directus_collections" add constraint "directus_collections_pkey" PRIMARY KEY using index "directus_collections_pkey";

alter table "public"."directus_comments" add constraint "directus_comments_pkey" PRIMARY KEY using index "directus_comments_pkey";

alter table "public"."directus_dashboards" add constraint "directus_dashboards_pkey" PRIMARY KEY using index "directus_dashboards_pkey";

alter table "public"."directus_extensions" add constraint "directus_extensions_pkey" PRIMARY KEY using index "directus_extensions_pkey";

alter table "public"."directus_fields" add constraint "directus_fields_pkey" PRIMARY KEY using index "directus_fields_pkey";

alter table "public"."directus_files" add constraint "directus_files_pkey" PRIMARY KEY using index "directus_files_pkey";

alter table "public"."directus_flows" add constraint "directus_flows_pkey" PRIMARY KEY using index "directus_flows_pkey";

alter table "public"."directus_folders" add constraint "directus_folders_pkey" PRIMARY KEY using index "directus_folders_pkey";

alter table "public"."directus_migrations" add constraint "directus_migrations_pkey" PRIMARY KEY using index "directus_migrations_pkey";

alter table "public"."directus_notifications" add constraint "directus_notifications_pkey" PRIMARY KEY using index "directus_notifications_pkey";

alter table "public"."directus_operations" add constraint "directus_operations_pkey" PRIMARY KEY using index "directus_operations_pkey";

alter table "public"."directus_panels" add constraint "directus_panels_pkey" PRIMARY KEY using index "directus_panels_pkey";

alter table "public"."directus_permissions" add constraint "directus_permissions_pkey" PRIMARY KEY using index "directus_permissions_pkey";

alter table "public"."directus_policies" add constraint "directus_policies_pkey" PRIMARY KEY using index "directus_policies_pkey";

alter table "public"."directus_presets" add constraint "directus_presets_pkey" PRIMARY KEY using index "directus_presets_pkey";

alter table "public"."directus_relations" add constraint "directus_relations_pkey" PRIMARY KEY using index "directus_relations_pkey";

alter table "public"."directus_revisions" add constraint "directus_revisions_pkey" PRIMARY KEY using index "directus_revisions_pkey";

alter table "public"."directus_roles" add constraint "directus_roles_pkey" PRIMARY KEY using index "directus_roles_pkey";

alter table "public"."directus_sessions" add constraint "directus_sessions_pkey" PRIMARY KEY using index "directus_sessions_pkey";

alter table "public"."directus_settings" add constraint "directus_settings_pkey" PRIMARY KEY using index "directus_settings_pkey";

alter table "public"."directus_shares" add constraint "directus_shares_pkey" PRIMARY KEY using index "directus_shares_pkey";

alter table "public"."directus_translations" add constraint "directus_translations_pkey" PRIMARY KEY using index "directus_translations_pkey";

alter table "public"."directus_users" add constraint "directus_users_pkey" PRIMARY KEY using index "directus_users_pkey";

alter table "public"."directus_versions" add constraint "directus_versions_pkey" PRIMARY KEY using index "directus_versions_pkey";

alter table "public"."directus_webhooks" add constraint "directus_webhooks_pkey" PRIMARY KEY using index "directus_webhooks_pkey";

alter table "public"."directus_access" add constraint "directus_access_policy_foreign" FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE not valid;

alter table "public"."directus_access" validate constraint "directus_access_policy_foreign";

alter table "public"."directus_access" add constraint "directus_access_role_foreign" FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE not valid;

alter table "public"."directus_access" validate constraint "directus_access_role_foreign";

alter table "public"."directus_access" add constraint "directus_access_user_foreign" FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE not valid;

alter table "public"."directus_access" validate constraint "directus_access_user_foreign";

alter table "public"."directus_collections" add constraint "directus_collections_group_foreign" FOREIGN KEY ("group") REFERENCES public.directus_collections(collection) not valid;

alter table "public"."directus_collections" validate constraint "directus_collections_group_foreign";

alter table "public"."directus_comments" add constraint "directus_comments_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_comments" validate constraint "directus_comments_user_created_foreign";

alter table "public"."directus_comments" add constraint "directus_comments_user_updated_foreign" FOREIGN KEY (user_updated) REFERENCES public.directus_users(id) not valid;

alter table "public"."directus_comments" validate constraint "directus_comments_user_updated_foreign";

alter table "public"."directus_dashboards" add constraint "directus_dashboards_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_dashboards" validate constraint "directus_dashboards_user_created_foreign";

alter table "public"."directus_files" add constraint "directus_files_folder_foreign" FOREIGN KEY (folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL not valid;

alter table "public"."directus_files" validate constraint "directus_files_folder_foreign";

alter table "public"."directus_files" add constraint "directus_files_modified_by_foreign" FOREIGN KEY (modified_by) REFERENCES public.directus_users(id) not valid;

alter table "public"."directus_files" validate constraint "directus_files_modified_by_foreign";

alter table "public"."directus_files" add constraint "directus_files_uploaded_by_foreign" FOREIGN KEY (uploaded_by) REFERENCES public.directus_users(id) not valid;

alter table "public"."directus_files" validate constraint "directus_files_uploaded_by_foreign";

alter table "public"."directus_flows" add constraint "directus_flows_operation_unique" UNIQUE using index "directus_flows_operation_unique";

alter table "public"."directus_flows" add constraint "directus_flows_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_flows" validate constraint "directus_flows_user_created_foreign";

alter table "public"."directus_folders" add constraint "directus_folders_parent_foreign" FOREIGN KEY (parent) REFERENCES public.directus_folders(id) not valid;

alter table "public"."directus_folders" validate constraint "directus_folders_parent_foreign";

alter table "public"."directus_notifications" add constraint "directus_notifications_recipient_foreign" FOREIGN KEY (recipient) REFERENCES public.directus_users(id) ON DELETE CASCADE not valid;

alter table "public"."directus_notifications" validate constraint "directus_notifications_recipient_foreign";

alter table "public"."directus_notifications" add constraint "directus_notifications_sender_foreign" FOREIGN KEY (sender) REFERENCES public.directus_users(id) not valid;

alter table "public"."directus_notifications" validate constraint "directus_notifications_sender_foreign";

alter table "public"."directus_operations" add constraint "directus_operations_flow_foreign" FOREIGN KEY (flow) REFERENCES public.directus_flows(id) ON DELETE CASCADE not valid;

alter table "public"."directus_operations" validate constraint "directus_operations_flow_foreign";

alter table "public"."directus_operations" add constraint "directus_operations_reject_foreign" FOREIGN KEY (reject) REFERENCES public.directus_operations(id) not valid;

alter table "public"."directus_operations" validate constraint "directus_operations_reject_foreign";

alter table "public"."directus_operations" add constraint "directus_operations_reject_unique" UNIQUE using index "directus_operations_reject_unique";

alter table "public"."directus_operations" add constraint "directus_operations_resolve_foreign" FOREIGN KEY (resolve) REFERENCES public.directus_operations(id) not valid;

alter table "public"."directus_operations" validate constraint "directus_operations_resolve_foreign";

alter table "public"."directus_operations" add constraint "directus_operations_resolve_unique" UNIQUE using index "directus_operations_resolve_unique";

alter table "public"."directus_operations" add constraint "directus_operations_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_operations" validate constraint "directus_operations_user_created_foreign";

alter table "public"."directus_panels" add constraint "directus_panels_dashboard_foreign" FOREIGN KEY (dashboard) REFERENCES public.directus_dashboards(id) ON DELETE CASCADE not valid;

alter table "public"."directus_panels" validate constraint "directus_panels_dashboard_foreign";

alter table "public"."directus_panels" add constraint "directus_panels_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_panels" validate constraint "directus_panels_user_created_foreign";

alter table "public"."directus_permissions" add constraint "directus_permissions_policy_foreign" FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE not valid;

alter table "public"."directus_permissions" validate constraint "directus_permissions_policy_foreign";

alter table "public"."directus_presets" add constraint "directus_presets_role_foreign" FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE not valid;

alter table "public"."directus_presets" validate constraint "directus_presets_role_foreign";

alter table "public"."directus_presets" add constraint "directus_presets_user_foreign" FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE not valid;

alter table "public"."directus_presets" validate constraint "directus_presets_user_foreign";

alter table "public"."directus_revisions" add constraint "directus_revisions_activity_foreign" FOREIGN KEY (activity) REFERENCES public.directus_activity(id) ON DELETE CASCADE not valid;

alter table "public"."directus_revisions" validate constraint "directus_revisions_activity_foreign";

alter table "public"."directus_revisions" add constraint "directus_revisions_parent_foreign" FOREIGN KEY (parent) REFERENCES public.directus_revisions(id) not valid;

alter table "public"."directus_revisions" validate constraint "directus_revisions_parent_foreign";

alter table "public"."directus_revisions" add constraint "directus_revisions_version_foreign" FOREIGN KEY (version) REFERENCES public.directus_versions(id) ON DELETE CASCADE not valid;

alter table "public"."directus_revisions" validate constraint "directus_revisions_version_foreign";

alter table "public"."directus_roles" add constraint "directus_roles_parent_foreign" FOREIGN KEY (parent) REFERENCES public.directus_roles(id) not valid;

alter table "public"."directus_roles" validate constraint "directus_roles_parent_foreign";

alter table "public"."directus_sessions" add constraint "directus_sessions_share_foreign" FOREIGN KEY (share) REFERENCES public.directus_shares(id) ON DELETE CASCADE not valid;

alter table "public"."directus_sessions" validate constraint "directus_sessions_share_foreign";

alter table "public"."directus_sessions" add constraint "directus_sessions_user_foreign" FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE not valid;

alter table "public"."directus_sessions" validate constraint "directus_sessions_user_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_project_logo_foreign" FOREIGN KEY (project_logo) REFERENCES public.directus_files(id) not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_project_logo_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_public_background_foreign" FOREIGN KEY (public_background) REFERENCES public.directus_files(id) not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_public_background_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_public_favicon_foreign" FOREIGN KEY (public_favicon) REFERENCES public.directus_files(id) not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_public_favicon_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_public_foreground_foreign" FOREIGN KEY (public_foreground) REFERENCES public.directus_files(id) not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_public_foreground_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_public_registration_role_foreign" FOREIGN KEY (public_registration_role) REFERENCES public.directus_roles(id) ON DELETE SET NULL not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_public_registration_role_foreign";

alter table "public"."directus_settings" add constraint "directus_settings_storage_default_folder_foreign" FOREIGN KEY (storage_default_folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL not valid;

alter table "public"."directus_settings" validate constraint "directus_settings_storage_default_folder_foreign";

alter table "public"."directus_shares" add constraint "directus_shares_collection_foreign" FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE not valid;

alter table "public"."directus_shares" validate constraint "directus_shares_collection_foreign";

alter table "public"."directus_shares" add constraint "directus_shares_role_foreign" FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE not valid;

alter table "public"."directus_shares" validate constraint "directus_shares_role_foreign";

alter table "public"."directus_shares" add constraint "directus_shares_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_shares" validate constraint "directus_shares_user_created_foreign";

alter table "public"."directus_users" add constraint "directus_users_email_unique" UNIQUE using index "directus_users_email_unique";

alter table "public"."directus_users" add constraint "directus_users_external_identifier_unique" UNIQUE using index "directus_users_external_identifier_unique";

alter table "public"."directus_users" add constraint "directus_users_role_foreign" FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE SET NULL not valid;

alter table "public"."directus_users" validate constraint "directus_users_role_foreign";

alter table "public"."directus_users" add constraint "directus_users_token_unique" UNIQUE using index "directus_users_token_unique";

alter table "public"."directus_versions" add constraint "directus_versions_collection_foreign" FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE not valid;

alter table "public"."directus_versions" validate constraint "directus_versions_collection_foreign";

alter table "public"."directus_versions" add constraint "directus_versions_user_created_foreign" FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL not valid;

alter table "public"."directus_versions" validate constraint "directus_versions_user_created_foreign";

alter table "public"."directus_versions" add constraint "directus_versions_user_updated_foreign" FOREIGN KEY (user_updated) REFERENCES public.directus_users(id) not valid;

alter table "public"."directus_versions" validate constraint "directus_versions_user_updated_foreign";

alter table "public"."directus_webhooks" add constraint "directus_webhooks_migrated_flow_foreign" FOREIGN KEY (migrated_flow) REFERENCES public.directus_flows(id) ON DELETE SET NULL not valid;

alter table "public"."directus_webhooks" validate constraint "directus_webhooks_migrated_flow_foreign";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

grant delete on table "public"."directus_access" to "anon";

grant insert on table "public"."directus_access" to "anon";

grant references on table "public"."directus_access" to "anon";

grant select on table "public"."directus_access" to "anon";

grant trigger on table "public"."directus_access" to "anon";

grant truncate on table "public"."directus_access" to "anon";

grant update on table "public"."directus_access" to "anon";

grant delete on table "public"."directus_access" to "authenticated";

grant insert on table "public"."directus_access" to "authenticated";

grant references on table "public"."directus_access" to "authenticated";

grant select on table "public"."directus_access" to "authenticated";

grant trigger on table "public"."directus_access" to "authenticated";

grant truncate on table "public"."directus_access" to "authenticated";

grant update on table "public"."directus_access" to "authenticated";

grant delete on table "public"."directus_access" to "service_role";

grant insert on table "public"."directus_access" to "service_role";

grant references on table "public"."directus_access" to "service_role";

grant select on table "public"."directus_access" to "service_role";

grant trigger on table "public"."directus_access" to "service_role";

grant truncate on table "public"."directus_access" to "service_role";

grant update on table "public"."directus_access" to "service_role";

grant delete on table "public"."directus_activity" to "anon";

grant insert on table "public"."directus_activity" to "anon";

grant references on table "public"."directus_activity" to "anon";

grant select on table "public"."directus_activity" to "anon";

grant trigger on table "public"."directus_activity" to "anon";

grant truncate on table "public"."directus_activity" to "anon";

grant update on table "public"."directus_activity" to "anon";

grant delete on table "public"."directus_activity" to "authenticated";

grant insert on table "public"."directus_activity" to "authenticated";

grant references on table "public"."directus_activity" to "authenticated";

grant select on table "public"."directus_activity" to "authenticated";

grant trigger on table "public"."directus_activity" to "authenticated";

grant truncate on table "public"."directus_activity" to "authenticated";

grant update on table "public"."directus_activity" to "authenticated";

grant delete on table "public"."directus_activity" to "service_role";

grant insert on table "public"."directus_activity" to "service_role";

grant references on table "public"."directus_activity" to "service_role";

grant select on table "public"."directus_activity" to "service_role";

grant trigger on table "public"."directus_activity" to "service_role";

grant truncate on table "public"."directus_activity" to "service_role";

grant update on table "public"."directus_activity" to "service_role";

grant delete on table "public"."directus_collections" to "anon";

grant insert on table "public"."directus_collections" to "anon";

grant references on table "public"."directus_collections" to "anon";

grant select on table "public"."directus_collections" to "anon";

grant trigger on table "public"."directus_collections" to "anon";

grant truncate on table "public"."directus_collections" to "anon";

grant update on table "public"."directus_collections" to "anon";

grant delete on table "public"."directus_collections" to "authenticated";

grant insert on table "public"."directus_collections" to "authenticated";

grant references on table "public"."directus_collections" to "authenticated";

grant select on table "public"."directus_collections" to "authenticated";

grant trigger on table "public"."directus_collections" to "authenticated";

grant truncate on table "public"."directus_collections" to "authenticated";

grant update on table "public"."directus_collections" to "authenticated";

grant delete on table "public"."directus_collections" to "service_role";

grant insert on table "public"."directus_collections" to "service_role";

grant references on table "public"."directus_collections" to "service_role";

grant select on table "public"."directus_collections" to "service_role";

grant trigger on table "public"."directus_collections" to "service_role";

grant truncate on table "public"."directus_collections" to "service_role";

grant update on table "public"."directus_collections" to "service_role";

grant delete on table "public"."directus_comments" to "anon";

grant insert on table "public"."directus_comments" to "anon";

grant references on table "public"."directus_comments" to "anon";

grant select on table "public"."directus_comments" to "anon";

grant trigger on table "public"."directus_comments" to "anon";

grant truncate on table "public"."directus_comments" to "anon";

grant update on table "public"."directus_comments" to "anon";

grant delete on table "public"."directus_comments" to "authenticated";

grant insert on table "public"."directus_comments" to "authenticated";

grant references on table "public"."directus_comments" to "authenticated";

grant select on table "public"."directus_comments" to "authenticated";

grant trigger on table "public"."directus_comments" to "authenticated";

grant truncate on table "public"."directus_comments" to "authenticated";

grant update on table "public"."directus_comments" to "authenticated";

grant delete on table "public"."directus_comments" to "service_role";

grant insert on table "public"."directus_comments" to "service_role";

grant references on table "public"."directus_comments" to "service_role";

grant select on table "public"."directus_comments" to "service_role";

grant trigger on table "public"."directus_comments" to "service_role";

grant truncate on table "public"."directus_comments" to "service_role";

grant update on table "public"."directus_comments" to "service_role";

grant delete on table "public"."directus_dashboards" to "anon";

grant insert on table "public"."directus_dashboards" to "anon";

grant references on table "public"."directus_dashboards" to "anon";

grant select on table "public"."directus_dashboards" to "anon";

grant trigger on table "public"."directus_dashboards" to "anon";

grant truncate on table "public"."directus_dashboards" to "anon";

grant update on table "public"."directus_dashboards" to "anon";

grant delete on table "public"."directus_dashboards" to "authenticated";

grant insert on table "public"."directus_dashboards" to "authenticated";

grant references on table "public"."directus_dashboards" to "authenticated";

grant select on table "public"."directus_dashboards" to "authenticated";

grant trigger on table "public"."directus_dashboards" to "authenticated";

grant truncate on table "public"."directus_dashboards" to "authenticated";

grant update on table "public"."directus_dashboards" to "authenticated";

grant delete on table "public"."directus_dashboards" to "service_role";

grant insert on table "public"."directus_dashboards" to "service_role";

grant references on table "public"."directus_dashboards" to "service_role";

grant select on table "public"."directus_dashboards" to "service_role";

grant trigger on table "public"."directus_dashboards" to "service_role";

grant truncate on table "public"."directus_dashboards" to "service_role";

grant update on table "public"."directus_dashboards" to "service_role";

grant delete on table "public"."directus_extensions" to "anon";

grant insert on table "public"."directus_extensions" to "anon";

grant references on table "public"."directus_extensions" to "anon";

grant select on table "public"."directus_extensions" to "anon";

grant trigger on table "public"."directus_extensions" to "anon";

grant truncate on table "public"."directus_extensions" to "anon";

grant update on table "public"."directus_extensions" to "anon";

grant delete on table "public"."directus_extensions" to "authenticated";

grant insert on table "public"."directus_extensions" to "authenticated";

grant references on table "public"."directus_extensions" to "authenticated";

grant select on table "public"."directus_extensions" to "authenticated";

grant trigger on table "public"."directus_extensions" to "authenticated";

grant truncate on table "public"."directus_extensions" to "authenticated";

grant update on table "public"."directus_extensions" to "authenticated";

grant delete on table "public"."directus_extensions" to "service_role";

grant insert on table "public"."directus_extensions" to "service_role";

grant references on table "public"."directus_extensions" to "service_role";

grant select on table "public"."directus_extensions" to "service_role";

grant trigger on table "public"."directus_extensions" to "service_role";

grant truncate on table "public"."directus_extensions" to "service_role";

grant update on table "public"."directus_extensions" to "service_role";

grant delete on table "public"."directus_fields" to "anon";

grant insert on table "public"."directus_fields" to "anon";

grant references on table "public"."directus_fields" to "anon";

grant select on table "public"."directus_fields" to "anon";

grant trigger on table "public"."directus_fields" to "anon";

grant truncate on table "public"."directus_fields" to "anon";

grant update on table "public"."directus_fields" to "anon";

grant delete on table "public"."directus_fields" to "authenticated";

grant insert on table "public"."directus_fields" to "authenticated";

grant references on table "public"."directus_fields" to "authenticated";

grant select on table "public"."directus_fields" to "authenticated";

grant trigger on table "public"."directus_fields" to "authenticated";

grant truncate on table "public"."directus_fields" to "authenticated";

grant update on table "public"."directus_fields" to "authenticated";

grant delete on table "public"."directus_fields" to "service_role";

grant insert on table "public"."directus_fields" to "service_role";

grant references on table "public"."directus_fields" to "service_role";

grant select on table "public"."directus_fields" to "service_role";

grant trigger on table "public"."directus_fields" to "service_role";

grant truncate on table "public"."directus_fields" to "service_role";

grant update on table "public"."directus_fields" to "service_role";

grant delete on table "public"."directus_files" to "anon";

grant insert on table "public"."directus_files" to "anon";

grant references on table "public"."directus_files" to "anon";

grant select on table "public"."directus_files" to "anon";

grant trigger on table "public"."directus_files" to "anon";

grant truncate on table "public"."directus_files" to "anon";

grant update on table "public"."directus_files" to "anon";

grant delete on table "public"."directus_files" to "authenticated";

grant insert on table "public"."directus_files" to "authenticated";

grant references on table "public"."directus_files" to "authenticated";

grant select on table "public"."directus_files" to "authenticated";

grant trigger on table "public"."directus_files" to "authenticated";

grant truncate on table "public"."directus_files" to "authenticated";

grant update on table "public"."directus_files" to "authenticated";

grant delete on table "public"."directus_files" to "service_role";

grant insert on table "public"."directus_files" to "service_role";

grant references on table "public"."directus_files" to "service_role";

grant select on table "public"."directus_files" to "service_role";

grant trigger on table "public"."directus_files" to "service_role";

grant truncate on table "public"."directus_files" to "service_role";

grant update on table "public"."directus_files" to "service_role";

grant delete on table "public"."directus_flows" to "anon";

grant insert on table "public"."directus_flows" to "anon";

grant references on table "public"."directus_flows" to "anon";

grant select on table "public"."directus_flows" to "anon";

grant trigger on table "public"."directus_flows" to "anon";

grant truncate on table "public"."directus_flows" to "anon";

grant update on table "public"."directus_flows" to "anon";

grant delete on table "public"."directus_flows" to "authenticated";

grant insert on table "public"."directus_flows" to "authenticated";

grant references on table "public"."directus_flows" to "authenticated";

grant select on table "public"."directus_flows" to "authenticated";

grant trigger on table "public"."directus_flows" to "authenticated";

grant truncate on table "public"."directus_flows" to "authenticated";

grant update on table "public"."directus_flows" to "authenticated";

grant delete on table "public"."directus_flows" to "service_role";

grant insert on table "public"."directus_flows" to "service_role";

grant references on table "public"."directus_flows" to "service_role";

grant select on table "public"."directus_flows" to "service_role";

grant trigger on table "public"."directus_flows" to "service_role";

grant truncate on table "public"."directus_flows" to "service_role";

grant update on table "public"."directus_flows" to "service_role";

grant delete on table "public"."directus_folders" to "anon";

grant insert on table "public"."directus_folders" to "anon";

grant references on table "public"."directus_folders" to "anon";

grant select on table "public"."directus_folders" to "anon";

grant trigger on table "public"."directus_folders" to "anon";

grant truncate on table "public"."directus_folders" to "anon";

grant update on table "public"."directus_folders" to "anon";

grant delete on table "public"."directus_folders" to "authenticated";

grant insert on table "public"."directus_folders" to "authenticated";

grant references on table "public"."directus_folders" to "authenticated";

grant select on table "public"."directus_folders" to "authenticated";

grant trigger on table "public"."directus_folders" to "authenticated";

grant truncate on table "public"."directus_folders" to "authenticated";

grant update on table "public"."directus_folders" to "authenticated";

grant delete on table "public"."directus_folders" to "service_role";

grant insert on table "public"."directus_folders" to "service_role";

grant references on table "public"."directus_folders" to "service_role";

grant select on table "public"."directus_folders" to "service_role";

grant trigger on table "public"."directus_folders" to "service_role";

grant truncate on table "public"."directus_folders" to "service_role";

grant update on table "public"."directus_folders" to "service_role";

grant delete on table "public"."directus_migrations" to "anon";

grant insert on table "public"."directus_migrations" to "anon";

grant references on table "public"."directus_migrations" to "anon";

grant select on table "public"."directus_migrations" to "anon";

grant trigger on table "public"."directus_migrations" to "anon";

grant truncate on table "public"."directus_migrations" to "anon";

grant update on table "public"."directus_migrations" to "anon";

grant delete on table "public"."directus_migrations" to "authenticated";

grant insert on table "public"."directus_migrations" to "authenticated";

grant references on table "public"."directus_migrations" to "authenticated";

grant select on table "public"."directus_migrations" to "authenticated";

grant trigger on table "public"."directus_migrations" to "authenticated";

grant truncate on table "public"."directus_migrations" to "authenticated";

grant update on table "public"."directus_migrations" to "authenticated";

grant delete on table "public"."directus_migrations" to "service_role";

grant insert on table "public"."directus_migrations" to "service_role";

grant references on table "public"."directus_migrations" to "service_role";

grant select on table "public"."directus_migrations" to "service_role";

grant trigger on table "public"."directus_migrations" to "service_role";

grant truncate on table "public"."directus_migrations" to "service_role";

grant update on table "public"."directus_migrations" to "service_role";

grant delete on table "public"."directus_notifications" to "anon";

grant insert on table "public"."directus_notifications" to "anon";

grant references on table "public"."directus_notifications" to "anon";

grant select on table "public"."directus_notifications" to "anon";

grant trigger on table "public"."directus_notifications" to "anon";

grant truncate on table "public"."directus_notifications" to "anon";

grant update on table "public"."directus_notifications" to "anon";

grant delete on table "public"."directus_notifications" to "authenticated";

grant insert on table "public"."directus_notifications" to "authenticated";

grant references on table "public"."directus_notifications" to "authenticated";

grant select on table "public"."directus_notifications" to "authenticated";

grant trigger on table "public"."directus_notifications" to "authenticated";

grant truncate on table "public"."directus_notifications" to "authenticated";

grant update on table "public"."directus_notifications" to "authenticated";

grant delete on table "public"."directus_notifications" to "service_role";

grant insert on table "public"."directus_notifications" to "service_role";

grant references on table "public"."directus_notifications" to "service_role";

grant select on table "public"."directus_notifications" to "service_role";

grant trigger on table "public"."directus_notifications" to "service_role";

grant truncate on table "public"."directus_notifications" to "service_role";

grant update on table "public"."directus_notifications" to "service_role";

grant delete on table "public"."directus_operations" to "anon";

grant insert on table "public"."directus_operations" to "anon";

grant references on table "public"."directus_operations" to "anon";

grant select on table "public"."directus_operations" to "anon";

grant trigger on table "public"."directus_operations" to "anon";

grant truncate on table "public"."directus_operations" to "anon";

grant update on table "public"."directus_operations" to "anon";

grant delete on table "public"."directus_operations" to "authenticated";

grant insert on table "public"."directus_operations" to "authenticated";

grant references on table "public"."directus_operations" to "authenticated";

grant select on table "public"."directus_operations" to "authenticated";

grant trigger on table "public"."directus_operations" to "authenticated";

grant truncate on table "public"."directus_operations" to "authenticated";

grant update on table "public"."directus_operations" to "authenticated";

grant delete on table "public"."directus_operations" to "service_role";

grant insert on table "public"."directus_operations" to "service_role";

grant references on table "public"."directus_operations" to "service_role";

grant select on table "public"."directus_operations" to "service_role";

grant trigger on table "public"."directus_operations" to "service_role";

grant truncate on table "public"."directus_operations" to "service_role";

grant update on table "public"."directus_operations" to "service_role";

grant delete on table "public"."directus_panels" to "anon";

grant insert on table "public"."directus_panels" to "anon";

grant references on table "public"."directus_panels" to "anon";

grant select on table "public"."directus_panels" to "anon";

grant trigger on table "public"."directus_panels" to "anon";

grant truncate on table "public"."directus_panels" to "anon";

grant update on table "public"."directus_panels" to "anon";

grant delete on table "public"."directus_panels" to "authenticated";

grant insert on table "public"."directus_panels" to "authenticated";

grant references on table "public"."directus_panels" to "authenticated";

grant select on table "public"."directus_panels" to "authenticated";

grant trigger on table "public"."directus_panels" to "authenticated";

grant truncate on table "public"."directus_panels" to "authenticated";

grant update on table "public"."directus_panels" to "authenticated";

grant delete on table "public"."directus_panels" to "service_role";

grant insert on table "public"."directus_panels" to "service_role";

grant references on table "public"."directus_panels" to "service_role";

grant select on table "public"."directus_panels" to "service_role";

grant trigger on table "public"."directus_panels" to "service_role";

grant truncate on table "public"."directus_panels" to "service_role";

grant update on table "public"."directus_panels" to "service_role";

grant delete on table "public"."directus_permissions" to "anon";

grant insert on table "public"."directus_permissions" to "anon";

grant references on table "public"."directus_permissions" to "anon";

grant select on table "public"."directus_permissions" to "anon";

grant trigger on table "public"."directus_permissions" to "anon";

grant truncate on table "public"."directus_permissions" to "anon";

grant update on table "public"."directus_permissions" to "anon";

grant delete on table "public"."directus_permissions" to "authenticated";

grant insert on table "public"."directus_permissions" to "authenticated";

grant references on table "public"."directus_permissions" to "authenticated";

grant select on table "public"."directus_permissions" to "authenticated";

grant trigger on table "public"."directus_permissions" to "authenticated";

grant truncate on table "public"."directus_permissions" to "authenticated";

grant update on table "public"."directus_permissions" to "authenticated";

grant delete on table "public"."directus_permissions" to "service_role";

grant insert on table "public"."directus_permissions" to "service_role";

grant references on table "public"."directus_permissions" to "service_role";

grant select on table "public"."directus_permissions" to "service_role";

grant trigger on table "public"."directus_permissions" to "service_role";

grant truncate on table "public"."directus_permissions" to "service_role";

grant update on table "public"."directus_permissions" to "service_role";

grant delete on table "public"."directus_policies" to "anon";

grant insert on table "public"."directus_policies" to "anon";

grant references on table "public"."directus_policies" to "anon";

grant select on table "public"."directus_policies" to "anon";

grant trigger on table "public"."directus_policies" to "anon";

grant truncate on table "public"."directus_policies" to "anon";

grant update on table "public"."directus_policies" to "anon";

grant delete on table "public"."directus_policies" to "authenticated";

grant insert on table "public"."directus_policies" to "authenticated";

grant references on table "public"."directus_policies" to "authenticated";

grant select on table "public"."directus_policies" to "authenticated";

grant trigger on table "public"."directus_policies" to "authenticated";

grant truncate on table "public"."directus_policies" to "authenticated";

grant update on table "public"."directus_policies" to "authenticated";

grant delete on table "public"."directus_policies" to "service_role";

grant insert on table "public"."directus_policies" to "service_role";

grant references on table "public"."directus_policies" to "service_role";

grant select on table "public"."directus_policies" to "service_role";

grant trigger on table "public"."directus_policies" to "service_role";

grant truncate on table "public"."directus_policies" to "service_role";

grant update on table "public"."directus_policies" to "service_role";

grant delete on table "public"."directus_presets" to "anon";

grant insert on table "public"."directus_presets" to "anon";

grant references on table "public"."directus_presets" to "anon";

grant select on table "public"."directus_presets" to "anon";

grant trigger on table "public"."directus_presets" to "anon";

grant truncate on table "public"."directus_presets" to "anon";

grant update on table "public"."directus_presets" to "anon";

grant delete on table "public"."directus_presets" to "authenticated";

grant insert on table "public"."directus_presets" to "authenticated";

grant references on table "public"."directus_presets" to "authenticated";

grant select on table "public"."directus_presets" to "authenticated";

grant trigger on table "public"."directus_presets" to "authenticated";

grant truncate on table "public"."directus_presets" to "authenticated";

grant update on table "public"."directus_presets" to "authenticated";

grant delete on table "public"."directus_presets" to "service_role";

grant insert on table "public"."directus_presets" to "service_role";

grant references on table "public"."directus_presets" to "service_role";

grant select on table "public"."directus_presets" to "service_role";

grant trigger on table "public"."directus_presets" to "service_role";

grant truncate on table "public"."directus_presets" to "service_role";

grant update on table "public"."directus_presets" to "service_role";

grant delete on table "public"."directus_relations" to "anon";

grant insert on table "public"."directus_relations" to "anon";

grant references on table "public"."directus_relations" to "anon";

grant select on table "public"."directus_relations" to "anon";

grant trigger on table "public"."directus_relations" to "anon";

grant truncate on table "public"."directus_relations" to "anon";

grant update on table "public"."directus_relations" to "anon";

grant delete on table "public"."directus_relations" to "authenticated";

grant insert on table "public"."directus_relations" to "authenticated";

grant references on table "public"."directus_relations" to "authenticated";

grant select on table "public"."directus_relations" to "authenticated";

grant trigger on table "public"."directus_relations" to "authenticated";

grant truncate on table "public"."directus_relations" to "authenticated";

grant update on table "public"."directus_relations" to "authenticated";

grant delete on table "public"."directus_relations" to "service_role";

grant insert on table "public"."directus_relations" to "service_role";

grant references on table "public"."directus_relations" to "service_role";

grant select on table "public"."directus_relations" to "service_role";

grant trigger on table "public"."directus_relations" to "service_role";

grant truncate on table "public"."directus_relations" to "service_role";

grant update on table "public"."directus_relations" to "service_role";

grant delete on table "public"."directus_revisions" to "anon";

grant insert on table "public"."directus_revisions" to "anon";

grant references on table "public"."directus_revisions" to "anon";

grant select on table "public"."directus_revisions" to "anon";

grant trigger on table "public"."directus_revisions" to "anon";

grant truncate on table "public"."directus_revisions" to "anon";

grant update on table "public"."directus_revisions" to "anon";

grant delete on table "public"."directus_revisions" to "authenticated";

grant insert on table "public"."directus_revisions" to "authenticated";

grant references on table "public"."directus_revisions" to "authenticated";

grant select on table "public"."directus_revisions" to "authenticated";

grant trigger on table "public"."directus_revisions" to "authenticated";

grant truncate on table "public"."directus_revisions" to "authenticated";

grant update on table "public"."directus_revisions" to "authenticated";

grant delete on table "public"."directus_revisions" to "service_role";

grant insert on table "public"."directus_revisions" to "service_role";

grant references on table "public"."directus_revisions" to "service_role";

grant select on table "public"."directus_revisions" to "service_role";

grant trigger on table "public"."directus_revisions" to "service_role";

grant truncate on table "public"."directus_revisions" to "service_role";

grant update on table "public"."directus_revisions" to "service_role";

grant delete on table "public"."directus_roles" to "anon";

grant insert on table "public"."directus_roles" to "anon";

grant references on table "public"."directus_roles" to "anon";

grant select on table "public"."directus_roles" to "anon";

grant trigger on table "public"."directus_roles" to "anon";

grant truncate on table "public"."directus_roles" to "anon";

grant update on table "public"."directus_roles" to "anon";

grant delete on table "public"."directus_roles" to "authenticated";

grant insert on table "public"."directus_roles" to "authenticated";

grant references on table "public"."directus_roles" to "authenticated";

grant select on table "public"."directus_roles" to "authenticated";

grant trigger on table "public"."directus_roles" to "authenticated";

grant truncate on table "public"."directus_roles" to "authenticated";

grant update on table "public"."directus_roles" to "authenticated";

grant delete on table "public"."directus_roles" to "service_role";

grant insert on table "public"."directus_roles" to "service_role";

grant references on table "public"."directus_roles" to "service_role";

grant select on table "public"."directus_roles" to "service_role";

grant trigger on table "public"."directus_roles" to "service_role";

grant truncate on table "public"."directus_roles" to "service_role";

grant update on table "public"."directus_roles" to "service_role";

grant delete on table "public"."directus_sessions" to "anon";

grant insert on table "public"."directus_sessions" to "anon";

grant references on table "public"."directus_sessions" to "anon";

grant select on table "public"."directus_sessions" to "anon";

grant trigger on table "public"."directus_sessions" to "anon";

grant truncate on table "public"."directus_sessions" to "anon";

grant update on table "public"."directus_sessions" to "anon";

grant delete on table "public"."directus_sessions" to "authenticated";

grant insert on table "public"."directus_sessions" to "authenticated";

grant references on table "public"."directus_sessions" to "authenticated";

grant select on table "public"."directus_sessions" to "authenticated";

grant trigger on table "public"."directus_sessions" to "authenticated";

grant truncate on table "public"."directus_sessions" to "authenticated";

grant update on table "public"."directus_sessions" to "authenticated";

grant delete on table "public"."directus_sessions" to "service_role";

grant insert on table "public"."directus_sessions" to "service_role";

grant references on table "public"."directus_sessions" to "service_role";

grant select on table "public"."directus_sessions" to "service_role";

grant trigger on table "public"."directus_sessions" to "service_role";

grant truncate on table "public"."directus_sessions" to "service_role";

grant update on table "public"."directus_sessions" to "service_role";

grant delete on table "public"."directus_settings" to "anon";

grant insert on table "public"."directus_settings" to "anon";

grant references on table "public"."directus_settings" to "anon";

grant select on table "public"."directus_settings" to "anon";

grant trigger on table "public"."directus_settings" to "anon";

grant truncate on table "public"."directus_settings" to "anon";

grant update on table "public"."directus_settings" to "anon";

grant delete on table "public"."directus_settings" to "authenticated";

grant insert on table "public"."directus_settings" to "authenticated";

grant references on table "public"."directus_settings" to "authenticated";

grant select on table "public"."directus_settings" to "authenticated";

grant trigger on table "public"."directus_settings" to "authenticated";

grant truncate on table "public"."directus_settings" to "authenticated";

grant update on table "public"."directus_settings" to "authenticated";

grant delete on table "public"."directus_settings" to "service_role";

grant insert on table "public"."directus_settings" to "service_role";

grant references on table "public"."directus_settings" to "service_role";

grant select on table "public"."directus_settings" to "service_role";

grant trigger on table "public"."directus_settings" to "service_role";

grant truncate on table "public"."directus_settings" to "service_role";

grant update on table "public"."directus_settings" to "service_role";

grant delete on table "public"."directus_shares" to "anon";

grant insert on table "public"."directus_shares" to "anon";

grant references on table "public"."directus_shares" to "anon";

grant select on table "public"."directus_shares" to "anon";

grant trigger on table "public"."directus_shares" to "anon";

grant truncate on table "public"."directus_shares" to "anon";

grant update on table "public"."directus_shares" to "anon";

grant delete on table "public"."directus_shares" to "authenticated";

grant insert on table "public"."directus_shares" to "authenticated";

grant references on table "public"."directus_shares" to "authenticated";

grant select on table "public"."directus_shares" to "authenticated";

grant trigger on table "public"."directus_shares" to "authenticated";

grant truncate on table "public"."directus_shares" to "authenticated";

grant update on table "public"."directus_shares" to "authenticated";

grant delete on table "public"."directus_shares" to "service_role";

grant insert on table "public"."directus_shares" to "service_role";

grant references on table "public"."directus_shares" to "service_role";

grant select on table "public"."directus_shares" to "service_role";

grant trigger on table "public"."directus_shares" to "service_role";

grant truncate on table "public"."directus_shares" to "service_role";

grant update on table "public"."directus_shares" to "service_role";

grant delete on table "public"."directus_translations" to "anon";

grant insert on table "public"."directus_translations" to "anon";

grant references on table "public"."directus_translations" to "anon";

grant select on table "public"."directus_translations" to "anon";

grant trigger on table "public"."directus_translations" to "anon";

grant truncate on table "public"."directus_translations" to "anon";

grant update on table "public"."directus_translations" to "anon";

grant delete on table "public"."directus_translations" to "authenticated";

grant insert on table "public"."directus_translations" to "authenticated";

grant references on table "public"."directus_translations" to "authenticated";

grant select on table "public"."directus_translations" to "authenticated";

grant trigger on table "public"."directus_translations" to "authenticated";

grant truncate on table "public"."directus_translations" to "authenticated";

grant update on table "public"."directus_translations" to "authenticated";

grant delete on table "public"."directus_translations" to "service_role";

grant insert on table "public"."directus_translations" to "service_role";

grant references on table "public"."directus_translations" to "service_role";

grant select on table "public"."directus_translations" to "service_role";

grant trigger on table "public"."directus_translations" to "service_role";

grant truncate on table "public"."directus_translations" to "service_role";

grant update on table "public"."directus_translations" to "service_role";

grant delete on table "public"."directus_users" to "anon";

grant insert on table "public"."directus_users" to "anon";

grant references on table "public"."directus_users" to "anon";

grant select on table "public"."directus_users" to "anon";

grant trigger on table "public"."directus_users" to "anon";

grant truncate on table "public"."directus_users" to "anon";

grant update on table "public"."directus_users" to "anon";

grant delete on table "public"."directus_users" to "authenticated";

grant insert on table "public"."directus_users" to "authenticated";

grant references on table "public"."directus_users" to "authenticated";

grant select on table "public"."directus_users" to "authenticated";

grant trigger on table "public"."directus_users" to "authenticated";

grant truncate on table "public"."directus_users" to "authenticated";

grant update on table "public"."directus_users" to "authenticated";

grant delete on table "public"."directus_users" to "service_role";

grant insert on table "public"."directus_users" to "service_role";

grant references on table "public"."directus_users" to "service_role";

grant select on table "public"."directus_users" to "service_role";

grant trigger on table "public"."directus_users" to "service_role";

grant truncate on table "public"."directus_users" to "service_role";

grant update on table "public"."directus_users" to "service_role";

grant delete on table "public"."directus_versions" to "anon";

grant insert on table "public"."directus_versions" to "anon";

grant references on table "public"."directus_versions" to "anon";

grant select on table "public"."directus_versions" to "anon";

grant trigger on table "public"."directus_versions" to "anon";

grant truncate on table "public"."directus_versions" to "anon";

grant update on table "public"."directus_versions" to "anon";

grant delete on table "public"."directus_versions" to "authenticated";

grant insert on table "public"."directus_versions" to "authenticated";

grant references on table "public"."directus_versions" to "authenticated";

grant select on table "public"."directus_versions" to "authenticated";

grant trigger on table "public"."directus_versions" to "authenticated";

grant truncate on table "public"."directus_versions" to "authenticated";

grant update on table "public"."directus_versions" to "authenticated";

grant delete on table "public"."directus_versions" to "service_role";

grant insert on table "public"."directus_versions" to "service_role";

grant references on table "public"."directus_versions" to "service_role";

grant select on table "public"."directus_versions" to "service_role";

grant trigger on table "public"."directus_versions" to "service_role";

grant truncate on table "public"."directus_versions" to "service_role";

grant update on table "public"."directus_versions" to "service_role";

grant delete on table "public"."directus_webhooks" to "anon";

grant insert on table "public"."directus_webhooks" to "anon";

grant references on table "public"."directus_webhooks" to "anon";

grant select on table "public"."directus_webhooks" to "anon";

grant trigger on table "public"."directus_webhooks" to "anon";

grant truncate on table "public"."directus_webhooks" to "anon";

grant update on table "public"."directus_webhooks" to "anon";

grant delete on table "public"."directus_webhooks" to "authenticated";

grant insert on table "public"."directus_webhooks" to "authenticated";

grant references on table "public"."directus_webhooks" to "authenticated";

grant select on table "public"."directus_webhooks" to "authenticated";

grant trigger on table "public"."directus_webhooks" to "authenticated";

grant truncate on table "public"."directus_webhooks" to "authenticated";

grant update on table "public"."directus_webhooks" to "authenticated";

grant delete on table "public"."directus_webhooks" to "service_role";

grant insert on table "public"."directus_webhooks" to "service_role";

grant references on table "public"."directus_webhooks" to "service_role";

grant select on table "public"."directus_webhooks" to "service_role";

grant trigger on table "public"."directus_webhooks" to "service_role";

grant truncate on table "public"."directus_webhooks" to "service_role";

grant update on table "public"."directus_webhooks" to "service_role";




-- ============================================================
-- Migration: 20260503000001_add_currency_to_orders.sql
-- ============================================================
-- Add currency field to orders table to support per-payment currency selection
alter table public.orders
add column if not exists currency text not null default 'USD';

-- Add comment for clarity
comment on column public.orders.currency is 'Currency code (ISO 4217) for this specific payment transaction';


-- ============================================================
-- Migration: 20260503000002_add_provider_delete_policy.sql
-- ============================================================
-- Add RLS policy to allow provider owners to delete their own providers
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'providers' and policyname = 'Provider owners can delete their own providers') then
    execute $pol$
      create policy "Provider owners can delete their own providers"
        on public.providers for delete
        using (
          exists (
            select 1 from public.provider_members
            where provider_members.provider_id = providers.id
            and provider_members.user_id = auth.uid()
            and provider_members.role = 'owner'
          )
        );
    $pol$;
  end if;
end$$;



-- ============================================================
-- Migration: 20260503000003_add_mark_security_key_rpc.sql
-- ============================================================
-- RPC to mark a security key as used
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS safely.
CREATE OR REPLACE FUNCTION mark_security_key_used(p_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows_affected INTEGER;
BEGIN
  UPDATE provider_security_keys
  SET used_at = now(),
      used_by = auth.uid()
  WHERE key = p_key
    AND active = TRUE
    AND used_at IS NULL;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  
  RETURN v_rows_affected > 0;
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE ALL ON FUNCTION mark_security_key_used(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION mark_security_key_used(TEXT) TO authenticated;


-- ============================================================
-- Migration: 20260503100000_add_currency_to_services.sql
-- ============================================================
-- Add currency field to services so each service has an attached currency
alter table public.services
add column if not exists currency text not null default 'USD';

comment on column public.services.currency is 'Currency code (ISO 4217) for this service''s price';


-- ============================================================
-- Migration: 20260503120000_fix_validate_security_key_rpc.sql
-- ============================================================
-- Fix validate_provider_security_key RPC to correctly treat missing rows as invalid
-- Uses FOUND after SELECT ... INTO to detect absence of rows
CREATE OR REPLACE FUNCTION validate_provider_security_key(p_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used_at TIMESTAMP;
BEGIN
  SELECT used_at
    INTO v_used_at
    FROM provider_security_keys
   WHERE key = p_key
     AND active = TRUE
   LIMIT 1;

  -- If no row was found, FOUND will be false
  IF NOT FOUND THEN
    RETURN 'invalid';
  END IF;

  IF v_used_at IS NOT NULL THEN
    RETURN 'already_used';
  END IF;

  RETURN 'valid';
END;
$$;

-- Revoke public execute, grant only to authenticated users
REVOKE ALL ON FUNCTION validate_provider_security_key(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_provider_security_key(TEXT) TO authenticated;


-- ============================================================
-- Migration: 20260503130000_allow_clients_to_read_provider_documents.sql
-- ============================================================
-- Allow clients to read documents owned by providers they have a thread with
CREATE POLICY "Clients can read provider documents shared via threads"
ON public.documents FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE pm.user_id = public.documents.user_id
          AND mt.client_id = auth.uid()
    )
);

-- Allow clients to fetch the storage object for those provider-owned documents
CREATE POLICY "Clients can read provider documents in bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.documents d
        JOIN public.provider_members pm ON pm.user_id = d.user_id
        JOIN public.message_threads mt ON mt.provider_id = pm.provider_id
        WHERE d.file_path = storage.objects.name
          AND mt.client_id = auth.uid()
    )
);


-- ============================================================
-- Migration: 20260503150000_add_payment_constraints.sql
-- ============================================================
-- Add payment integrity constraints
-- Ensures stripe_payment_intent_id is populated when payment is completed

-- Add constraint: if payment_status is 'paid', stripe_payment_intent_id must not be null
ALTER TABLE public.orders
ADD CONSTRAINT orders_paid_intent_check
CHECK ((payment_status != 'paid') OR (stripe_payment_intent_id IS NOT NULL))
NOT VALID;

-- Validate the constraint
ALTER TABLE public.orders VALIDATE CONSTRAINT orders_paid_intent_check;

-- Add constraint: amount must be positive when present
ALTER TABLE public.orders
ADD CONSTRAINT orders_amount_check
CHECK ((amount IS NULL) OR (amount > 0))
NOT VALID;

ALTER TABLE public.orders VALIDATE CONSTRAINT orders_amount_check;


-- ============================================================
-- Migration: 20260505000000_update_seed_services_countries.sql
-- ============================================================
-- Update the seeded services in production with expanded applicable_countries
-- and sync the normalized service_countries join table.

-- ============================================================
-- 1. Update applicable_countries on each seeded service
-- ============================================================

-- Global Visa Solutions (11111111-1111-1111-1111-111111111111)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark',
    'Sweden','Finland','Norway','Cyprus'
))
where provider_id = '11111111-1111-1111-1111-111111111111'
  and title = 'Portugal Digital Nomad Visa Application';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Spain','Portugal','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark',
    'Sweden','Finland','Norway','Cyprus'
))
where provider_id = '11111111-1111-1111-1111-111111111111'
  and title = 'Spain Digital Nomad Visa Package';

-- Expat Relocations (22222222-2222-2222-2222-222222222222)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Thailand','Mexico','Croatia','Greece','Italy',
    'Cyprus','Malta','Turkey','Vietnam','Indonesia'
))
where provider_id = '22222222-2222-2222-2222-222222222222'
  and title = 'Portugal Relocation Package';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Thailand','Mexico','Portugal','Spain','Vietnam','Indonesia',
    'Malaysia','India','Georgia','Turkey'
))
where provider_id = '22222222-2222-2222-2222-222222222222'
  and title = 'Thailand Soft Landing Package';

-- LegalDocs Translation (33333333-3333-3333-3333-333333333333)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Thailand','Mexico','Netherlands',
    'France','Italy','Switzerland','Ireland','Greece','Belgium','Poland',
    'Austria','Turkey','Malta','Denmark','Sweden','Finland','Norway','Cyprus',
    'Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Vietnam',
    'Indonesia','Malaysia','India','Georgia','Morocco','Egypt','South Africa',
    'Chile','Argentina','Brazil','Peru','China','Japan','South Korea',
    'Singapore','Hong Kong'
))
where provider_id = '33333333-3333-3333-3333-333333333333'
  and title = 'Document Translation - Standard';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania'
))
where provider_id = '33333333-3333-3333-3333-333333333333'
  and title = 'Apostille + Translation Bundle';

-- International Tax Advisors (44444444-4444-4444-4444-444444444444)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania','Thailand','Mexico','Vietnam','Indonesia',
    'Malaysia','United Arab Emirates','Singapore','Georgia','Turkey',
    'Argentina','Brazil','Chile'
))
where provider_id = '44444444-4444-4444-4444-444444444444'
  and title = 'Digital Nomad Tax Consultation';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania','United Kingdom','Canada','Australia','New Zealand',
    'United States','Japan','South Korea','Singapore','Hong Kong',
    'United Arab Emirates','Brazil','Argentina','Chile','South Africa','Israel'
))
where provider_id = '44444444-4444-4444-4444-444444444444'
  and title = 'Portugal NHR Tax Regime Setup';

-- ============================================================
-- 2. Sync the service_countries join table
-- ============================================================

-- Remove old mappings for these provider services
delete from service_countries
where service_id in (
    select id from services
    where provider_id in (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444'
    )
);

-- Re-insert from updated applicable_countries
insert into service_countries (service_id, country_id)
select id, unnest(applicable_countries)
from services
where provider_id in (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444'
)
and applicable_countries is not null
on conflict do nothing;


-- ============================================================
-- Migration: 20260505000001_add_offered_languages_to_services.sql
-- ============================================================
-- Add a languages array column to the services table
-- so each service can define which languages it offers.

alter table public.services
add column languages text[] default '{}'::text[];

-- Update RLS policy to allow providers to insert/update the new column
-- (existing policies on services already cover full row access,
-- so no extra policy changes needed unless you want column-level restrictions).


-- ============================================================
-- Migration: 20260506000000_add_custom_categories_and_tags.sql
-- ============================================================
-- Migration: add custom categories and tags for checklists
begin;

-- ==============================
-- Custom categories per user
-- ==============================
create table if not exists public.checklist_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- ==============================
-- Tags per user
-- ==============================
create table if not exists public.checklist_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- ==============================
-- Junction: item <-> tag
-- ==============================
create table if not exists public.checklist_item_tags (
  checklist_item_id uuid not null references public.checklist_items(id) on delete cascade,
  tag_id uuid not null references public.checklist_tags(id) on delete cascade,
  primary key (checklist_item_id, tag_id)
);

-- Indexes
create index if not exists idx_checklist_categories_user on public.checklist_categories (user_id);
create index if not exists idx_checklist_tags_user on public.checklist_tags (user_id);
create index if not exists idx_checklist_item_tags_item on public.checklist_item_tags (checklist_item_id);
create index if not exists idx_checklist_item_tags_tag on public.checklist_item_tags (tag_id);

-- Grants
grant select, insert, update, delete on public.checklist_categories to anon;
grant select, insert, update, delete on public.checklist_tags to anon;
grant select, insert, update, delete on public.checklist_item_tags to anon;

-- ==============================
-- RLS
-- ==============================
alter table if exists public.checklist_categories enable row level security;
alter table if exists public.checklist_tags enable row level security;
alter table if exists public.checklist_item_tags enable row level security;

-- --- checklist_categories policies ---
create policy "Users can view own categories"
  on public.checklist_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert categories"
  on public.checklist_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.checklist_categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.checklist_categories for delete
  using (auth.uid() = user_id);

-- --- checklist_tags policies ---
create policy "Users can view own tags"
  on public.checklist_tags for select
  using (auth.uid() = user_id);

create policy "Users can insert tags"
  on public.checklist_tags for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tags"
  on public.checklist_tags for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own tags"
  on public.checklist_tags for delete
  using (auth.uid() = user_id);

-- --- checklist_item_tags policies (ownership via checklist) ---
create policy "Users can view item tags for their checklists"
  on public.checklist_item_tags for select
  using (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert item tags for their checklists"
  on public.checklist_item_tags for insert
  with check (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete item tags for their checklists"
  on public.checklist_item_tags for delete
  using (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

commit;


-- ============================================================
-- Migration: 20260506000001_add_checklist_items_sort_order.sql
-- ============================================================
-- Migration: add sort_order to checklist_items for drag-and-drop reordering
begin;

alter table if exists public.checklist_items
  add column if not exists sort_order int not null default 0;

-- Update existing rows so sort_order follows created_at order per checklist
with ranked as (
  select id, row_number() over (partition by checklist_id order by created_at asc) - 1 as rn
  from public.checklist_items
)
update public.checklist_items
set sort_order = ranked.rn
from ranked
where public.checklist_items.id = ranked.id;

commit;


-- ============================================================
-- Migration: 20260506000002_create_service_reviews.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260506000003_fix_service_reviews_client_fk.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260506000004_add_profiles_fk_to_message_threads.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260506000005_allow_insert_document_categories.sql
-- ============================================================
-- Allow any authenticated user to insert new document categories

begin;

create policy "Authenticated users can create categories"
  on public.document_categories for insert
  with check (auth.role() = 'authenticated');

commit;


-- ============================================================
-- Migration: 20260506000006_allow_update_delete_document_categories.sql
-- ============================================================
-- Allow authenticated users to update and delete document categories
-- so they can manage their own custom categories in the modal

begin;

create policy "Authenticated users can update categories"
  on public.document_categories for update
  using (true)
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete categories"
  on public.document_categories for delete
  using (auth.role() = 'authenticated');

commit;


-- ============================================================
-- Migration: 20260507140000_allow_clients_to_read_provider_storage_documents.sql
-- ============================================================
-- Allow clients to read storage objects owned by providers they have a thread with
-- This bypasses the need for document_access records and works even when
-- the documents table RLS blocks cross-user queries.
CREATE POLICY "Clients can read provider documents via shared thread"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE pm.user_id::text = (string_to_array(name, '/'))[1]
          AND mt.client_id = auth.uid()
    )
);

-- Allow providers to read storage objects owned by clients they have a thread with
CREATE POLICY "Providers can read client documents via shared thread"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' AND
    EXISTS (
        SELECT 1 FROM public.message_threads mt
        JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
        WHERE mt.client_id::text = (string_to_array(name, '/'))[1]
          AND pm.user_id = auth.uid()
    )
);


-- ============================================================
-- Migration: 20260507150000_create_get_shared_document_path_rpc.sql
-- ============================================================
-- RPC to safely resolve a shared document's file path for the viewer.
-- This runs with SECURITY DEFINER (bypasses RLS) and returns only the
-- minimal data needed to generate a signed URL.
-- It verifies the caller has a thread with the document owner before returning data.
CREATE OR REPLACE FUNCTION get_shared_document(doc_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    file_path text,
    content_type text
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.name, d.file_path, d.content_type
    FROM public.documents d
    WHERE d.id = doc_id
      AND (
          -- Caller owns the document
          d.user_id = auth.uid()
          OR
          -- Caller is a client of a thread with the document owner
          EXISTS (
              SELECT 1 FROM public.message_threads mt
              JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
              WHERE pm.user_id = d.user_id
                AND mt.client_id = auth.uid()
          )
          OR
          -- Caller is a provider member with a thread to the document owner (client)
          EXISTS (
              SELECT 1 FROM public.message_threads mt
              JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
              WHERE mt.client_id = d.user_id
                AND pm.user_id = auth.uid()
          )
          OR
          -- Caller has a direct document_access record
          EXISTS (
              SELECT 1 FROM public.document_access da
              WHERE da.document_id = d.id
                AND da.user_id = auth.uid()
          )
      );
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- Migration: 20260507160000_clean_document_sharing_rls.sql
-- ============================================================
-- ============================================================
-- CLEANUP: drop all overlapping cross-user document/storage policies
-- that were added as patches across multiple migrations
-- ============================================================

-- Drop redundant cross-user document SELECT policies
DROP POLICY IF EXISTS "Providers can read documents of their clients" ON public.documents;
DROP POLICY IF EXISTS "Clients can read provider documents shared via threads" ON public.documents;

-- Drop all overlapping/conflicting storage SELECT policies
DROP POLICY IF EXISTS "Users can view encrypted documents shared with them." ON storage.objects;
DROP POLICY IF EXISTS "Providers can read documents in bucket" ON storage.objects;
DROP POLICY IF EXISTS "Clients can read provider documents in bucket" ON storage.objects;
DROP POLICY IF EXISTS "Clients can read provider documents via shared thread" ON storage.objects;
DROP POLICY IF EXISTS "Providers can read client documents via shared thread" ON storage.objects;

-- Drop the now-unnecessary RPC
DROP FUNCTION IF EXISTS get_shared_document(uuid);

-- ============================================================
-- REPLACE: one clean documents SELECT policy
-- Covers: owner, document_access, thread-based client<->provider
-- ============================================================
DROP POLICY IF EXISTS "Users can select documents they own or have access to" ON public.documents;

CREATE POLICY "Users can select documents they own or have access to" ON public.documents
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR id IN (
            SELECT document_id FROM public.document_access WHERE user_id = auth.uid()
        )
        OR EXISTS (
            -- Provider reading their client's document
            SELECT 1 FROM public.message_threads mt
            JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
            WHERE mt.client_id = public.documents.user_id
              AND pm.user_id = auth.uid()
        )
        OR EXISTS (
            -- Client reading their provider's document
            SELECT 1 FROM public.message_threads mt
            JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
            WHERE pm.user_id = public.documents.user_id
              AND mt.client_id = auth.uid()
        )
    );

-- ============================================================
-- REPLACE: one clean storage.objects SELECT policy
-- Uses file path pattern (no documents table join = no circular RLS)
-- ============================================================
DROP POLICY IF EXISTS "Users can select their own encrypted documents." ON storage.objects;

CREATE POLICY "Users can select their own encrypted documents." ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'documents'
        AND (
            (auth.uid())::text = (string_to_array(name, '/'))[1]
            OR EXISTS (
                -- Client reading provider file
                SELECT 1 FROM public.message_threads mt
                JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                WHERE pm.user_id::text = (string_to_array(storage.objects.name, '/'))[1]
                  AND mt.client_id = auth.uid()
            )
            OR EXISTS (
                -- Provider reading client file
                SELECT 1 FROM public.message_threads mt
                JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                WHERE mt.client_id::text = (string_to_array(storage.objects.name, '/'))[1]
                  AND pm.user_id = auth.uid()
            )
        )
    );


-- ============================================================
-- Migration: 20260507170000_secure_document_access_insert.sql
-- ============================================================
-- ============================================================
-- DOCUMENT ACCESS: allow thread partners to insert document_access
-- for documents shared between them
-- ============================================================

DROP POLICY IF EXISTS "Users can insert document access for their own documents" ON public.document_access;

CREATE POLICY "Users can insert document access for shared documents" ON public.document_access
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Owner can always grant access
        EXISTS (
            SELECT 1 FROM public.documents WHERE id = document_id AND user_id = auth.uid()
        )
        OR
        -- Thread partner can grant access to the other party
        EXISTS (
            SELECT 1 FROM public.documents d
            -- Sender owns the document AND has a thread spanning to the recipient
            WHERE d.id = document_id
              AND d.user_id = auth.uid()
              AND EXISTS (
                  SELECT 1 FROM public.message_threads mt
                  JOIN public.provider_members pm ON mt.provider_id = pm.provider_id
                  WHERE (
                      -- Sender is client, recipient is a provider member
                      (mt.client_id = auth.uid() AND pm.user_id = document_access.user_id)
                      OR
                      -- Sender is provider member, recipient is the client
                      (pm.user_id = auth.uid() AND mt.client_id = document_access.user_id)
                  )
              )
        )
    );


-- ============================================================
-- Migration: 20260507180000_fix_provider_members_rls.sql
-- ============================================================
-- Fix: make provider_members readable by all authenticated users.
-- This table only maps users→providers (no sensitive data) and is
-- referenced in RLS subqueries for documents, storage, threads, and
-- the shareDocument function. Without this, clients can never see
-- provider member rows, breaking:
--   1. Storage RLS (createSignedUrl returns 404)
--   2. Documents RLS (queries return 0 rows)
--   3. shareDocument (can't find recipient provider member)
DROP POLICY IF EXISTS "Members can view own memberships" ON public.provider_members;

CREATE POLICY "Authenticated users can view provider memberships"
  ON public.provider_members FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================
-- Migration: 20260507190000_fix_orders_update_rls.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260507200000_fix_payment_status_constraint.sql
-- ============================================================
-- Fix: payment_status CHECK constraint is missing 'cancelled' value.
-- The cancel order endpoint tries to set payment_status='cancelled' but
-- the constraint only allows ('pending','paid','failed','refunded').
-- This causes a silent database constraint violation → 500 error.

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled'));


-- ============================================================
-- Migration: 20260507210000_allow_provider_deletion.sql
-- ============================================================
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


-- ============================================================
-- Migration: 20260507220000_fix_threads_provider_fk.sql
-- ============================================================
-- Fix: allow provider deletion without destroying chat history.
-- The message_threads FK was ON DELETE CASCADE — deleting a provider
-- would wipe all threads and their messages. Change to SET NULL instead.
ALTER TABLE public.message_threads
  ALTER COLUMN provider_id DROP NOT NULL;

ALTER TABLE public.message_threads
  DROP CONSTRAINT IF EXISTS message_threads_provider_id_fkey;

ALTER TABLE public.message_threads
  ADD CONSTRAINT message_threads_provider_id_fkey
  FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE SET NULL;


-- ============================================================
-- Migration: 20260625000000_add_updated_at_to_countries.sql
-- ============================================================
-- Add updated_at column to countries table
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();


