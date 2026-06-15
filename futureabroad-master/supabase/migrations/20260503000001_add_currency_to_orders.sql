-- Add currency field to orders table to support per-payment currency selection
alter table public.orders
add column if not exists currency text not null default 'USD';

-- Add comment for clarity
comment on column public.orders.currency is 'Currency code (ISO 4217) for this specific payment transaction';
