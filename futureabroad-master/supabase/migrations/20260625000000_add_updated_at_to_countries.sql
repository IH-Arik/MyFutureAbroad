-- Add updated_at column to countries table
ALTER TABLE public.countries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
