-- visas.sql
-- Restructured visas schema to better match CSV data
create table if not exists visas (
  id serial primary key,
  
  -- Core identification
  name text not null,
  visa_type text,
  country_id int not null references countries(id) on delete cascade,
  
  -- Description and details
  description text,
  benefits text[], -- short list of perks
  
  -- Eligibility criteria
  min_age int,
  max_age int,
  min_income numeric(14,2),
  min_income_currency text, -- e.g. 'USD', auto-populated from application_fee_currency if income is set
  min_savings numeric(14,2),
  min_savings_currency text, -- auto-populated from application_fee_currency if savings is set
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
  
  -- Path to residency (restructured as boolean flag + description)
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

-- Indexes for performance
create index if not exists idx_visas_name on visas (name);
create index if not exists idx_visas_country on visas (country_id);
create index if not exists idx_visas_visa_type on visas (visa_type);
create index if not exists idx_visas_country_name on visas (country_id, name);