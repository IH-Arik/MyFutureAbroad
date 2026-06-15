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
