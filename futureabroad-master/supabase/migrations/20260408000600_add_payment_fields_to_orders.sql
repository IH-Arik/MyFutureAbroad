-- Add payment-related fields to orders table
alter table public.orders
add column if not exists payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
add column if not exists amount integer, -- amount in cents
add column if not exists stripe_payment_intent_id text,
add column if not exists stripe_transfer_id text,
add column if not exists commission_amount integer,
add column if not exists commission_percentage decimal(5,2) not null default 10.00,
add column if not exists payment_date timestamptz;
