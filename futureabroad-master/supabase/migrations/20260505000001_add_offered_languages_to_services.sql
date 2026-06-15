-- Add a languages array column to the services table
-- so each service can define which languages it offers.

alter table public.services
add column languages text[] default '{}'::text[];

-- Update RLS policy to allow providers to insert/update the new column
-- (existing policies on services already cover full row access,
-- so no extra policy changes needed unless you want column-level restrictions).
