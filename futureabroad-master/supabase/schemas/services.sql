-- services.sql
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references providers(id) on delete cascade not null,
  title text not null,
  description text,
  service_type text references service_types(id) not null,
  applicable_visas int[], -- Array of visa IDs
  applicable_countries int[], -- Array of country IDs
  price_usd numeric(12, 2) check (price_usd >= 0),
  currency text not null default 'USD',
  price_type text check (price_type in ('fixed', 'starting_at', 'hourly')),
  delivery_days int,
  includes text[],
  requirements text[],
  image_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_services_provider on services (provider_id);
create index if not exists idx_services_type on services (service_type);
create index if not exists idx_services_price_usd on services (price_usd);
