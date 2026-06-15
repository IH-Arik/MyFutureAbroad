-- Migration: Add bank account and Stripe Connect fields to providers
alter table public.providers
add column if not exists bank_account_holder_name text,
add column if not exists bank_account_number text, -- encrypted in production
add column if not exists bank_routing_number text, -- encrypted in production
add column if not exists stripe_connect_account_id text,
add column if not exists bank_account_verified boolean default false,
add column if not exists updated_at timestamptz default now();
