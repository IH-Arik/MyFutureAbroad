-- Migration: Add base_currency and application_fee_amount columns to visas
-- Purpose: Store visa fees in their base currency to avoid conversion errors
-- When viewing in base currency, show the original amount without conversion

BEGIN;

-- Add new columns
ALTER TABLE visas
ADD COLUMN IF NOT EXISTS base_currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS application_fee_amount numeric(12,2);

-- Migrate existing data: populate new columns from old columns
-- If application_fee_currency is set, use it as base_currency; otherwise use USD
UPDATE visas
SET 
  base_currency = COALESCE(application_fee_currency, 'USD'),
  application_fee_amount = application_fee_usd
WHERE application_fee_amount IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_visas_base_currency ON visas (base_currency);

COMMIT;
