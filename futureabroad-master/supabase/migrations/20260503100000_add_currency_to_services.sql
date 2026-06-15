-- Add currency field to services so each service has an attached currency
alter table public.services
add column if not exists currency text not null default 'USD';

comment on column public.services.currency is 'Currency code (ISO 4217) for this service''s price';
