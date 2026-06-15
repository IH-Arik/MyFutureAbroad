-- providers.sql
create table if not exists providers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- links to auth.users if needed
  company_name text not null,
  logo_url text,
  description text,
  provider_type text check (provider_type in ('agency', 'law_firm', 'freelancer', 'consultancy')),
  countries_served int[], -- Array of country IDs
  languages text[], -- e.g. ['en', 'pt']
  rating numeric(3, 2) default 0,
  review_count int default 0,
  verified boolean default false,
  response_time_hours int,
  contact_email text,
  website text,
  preferred_currency text default 'USD',
  status text default 'active' check (status in ('active', 'pending', 'suspended')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_providers_company_name on providers (company_name);
create index if not exists idx_providers_type on providers (provider_type);
create index if not exists idx_providers_verified on providers (verified);
