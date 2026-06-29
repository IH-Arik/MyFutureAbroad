-- Add missing columns to visas table for comprehensive AI-generated visa pages
-- Safe to run multiple times (IF NOT EXISTS)

ALTER TABLE visas
  ADD COLUMN IF NOT EXISTS target_applicant text,
  ADD COLUMN IF NOT EXISTS work_permitted boolean,
  ADD COLUMN IF NOT EXISTS dependants_allowed boolean,
  ADD COLUMN IF NOT EXISTS renewal_conditions text,
  ADD COLUMN IF NOT EXISTS application_process_steps text[],
  ADD COLUMN IF NOT EXISTS tax_implications text,
  ADD COLUMN IF NOT EXISTS processing_time_min_days integer,
  ADD COLUMN IF NOT EXISTS processing_time_max_days integer,
  ADD COLUMN IF NOT EXISTS application_fee_amount numeric(14,2),
  ADD COLUMN IF NOT EXISTS base_currency text;

COMMENT ON COLUMN visas.target_applicant IS 'AI-generated: who this visa is designed for (retirees, remote workers, investors, etc.)';
COMMENT ON COLUMN visas.work_permitted IS 'Whether the visa holder is permitted to work in the destination country';
COMMENT ON COLUMN visas.dependants_allowed IS 'Whether spouse and/or dependent children can join the applicant';
COMMENT ON COLUMN visas.renewal_conditions IS 'Conditions under which the visa can be renewed';
COMMENT ON COLUMN visas.application_process_steps IS 'Step-by-step application process (3-6 steps)';
COMMENT ON COLUMN visas.tax_implications IS 'Special tax treatment that applies to this visa category';
COMMENT ON COLUMN visas.processing_time_min_days IS 'Minimum processing time in days';
COMMENT ON COLUMN visas.processing_time_max_days IS 'Maximum processing time in days';
COMMENT ON COLUMN visas.application_fee_amount IS 'Application fee in the original local currency (see base_currency)';
COMMENT ON COLUMN visas.base_currency IS 'ISO 4217 currency code for application_fee_amount';
