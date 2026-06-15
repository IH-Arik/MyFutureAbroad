-- Migration: 20260410000000_restructure_visas_schema_for_csv
-- Purpose: Restructure visas table to better match CSV data structure
-- Key changes:
--   1. Split path_to_residency into boolean flag + description
--   2. Add min_income_currency (inferred from application_fee_currency)
--   3. Add visa_type column for categorization
--   4. Improve handling of optional fields
--   5. Maintain backward compatibility with existing data

BEGIN;

-- Step 1: Rename existing table to backup
ALTER TABLE IF EXISTS visas RENAME TO visas_old;

-- Step 2: Create new visas table with restructured schema
CREATE TABLE visas (
  id serial primary key,
  
  -- Core identification
  name text not null,
  visa_type text,
  country_id int not null references countries(id) on delete cascade,
  
  -- Description and details
  description text,
  benefits text[],
  
  -- Eligibility criteria
  min_age int,
  max_age int,
  min_income numeric(14,2),
  min_income_currency text,
  min_savings numeric(14,2),
  min_savings_currency text,
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
  
  -- Path to residency (restructured)
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

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visas_name ON visas (name);
CREATE INDEX IF NOT EXISTS idx_visas_country ON visas (country_id);
CREATE INDEX IF NOT EXISTS idx_visas_visa_type ON visas (visa_type);
CREATE INDEX IF NOT EXISTS idx_visas_country_name ON visas (country_id, name);

-- Step 4: Migrate data from old table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'visas_old') THEN
    INSERT INTO visas (
      id, name, visa_type, country_id, description, benefits,
      min_age, max_age, min_income, min_income_currency, min_savings, min_savings_currency,
      required_skills, eligible_nationalities, excluded_nationalities,
      requires_health_insurance, requires_clean_criminal_record,
      processing_time_days, validity_months, renewable,
      has_path_to_residency, path_to_residency_description,
      application_fee_usd, application_fee_currency, required_documents, official_link,
      image_url, additional_info, created_at, updated_at
    )
    SELECT
      id, name, visa_type, country_id, description, benefits,
      min_age, max_age, min_income, min_income_currency, min_savings, min_savings_currency,
      required_skills, eligible_nationalities, excluded_nationalities,
      requires_health_insurance, requires_clean_criminal_record,
      processing_time_days, validity_months, renewable,
      CASE WHEN path_to_residency IN ('true', '1', 'TRUE', 'True') THEN true ELSE false END,
      CASE WHEN path_to_residency NOT IN ('true', 'false', '1', '0', '', 'TRUE', 'False', 'FALSE') THEN path_to_residency::text ELSE NULL END,
      application_fee_usd, application_fee_currency, required_documents, official_link,
      image_url, additional_info, created_at, updated_at
    FROM visas_old;
    
    -- Drop the old table
    DROP TABLE visas_old;
  END IF;
END $$;

-- Step 5: Create helper function to populate min_income_currency from application_fee_currency
CREATE OR REPLACE FUNCTION set_min_income_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- If min_income is set but min_income_currency is not, use application_fee_currency
  IF NEW.min_income IS NOT NULL AND NEW.min_income_currency IS NULL THEN
    NEW.min_income_currency := NEW.application_fee_currency;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger to auto-set min_income_currency
DROP TRIGGER IF EXISTS trg_set_min_income_currency ON visas;
CREATE TRIGGER trg_set_min_income_currency
  BEFORE INSERT OR UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION set_min_income_currency();

-- Step 7: Create helper function to populate min_savings_currency from application_fee_currency
CREATE OR REPLACE FUNCTION set_min_savings_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- If min_savings is set but min_savings_currency is not, use application_fee_currency
  IF NEW.min_savings IS NOT NULL AND NEW.min_savings_currency IS NULL THEN
    NEW.min_savings_currency := NEW.application_fee_currency;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to auto-set min_savings_currency
DROP TRIGGER IF EXISTS trg_set_min_savings_currency ON visas;
CREATE TRIGGER trg_set_min_savings_currency
  BEFORE INSERT OR UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION set_min_savings_currency();

-- Step 9: Create function to sync updated_at timestamp
CREATE OR REPLACE FUNCTION update_visas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger for updated_at
DROP TRIGGER IF EXISTS trg_update_visas_updated_at ON visas;
CREATE TRIGGER trg_update_visas_updated_at
  BEFORE UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION update_visas_updated_at();

COMMIT;
