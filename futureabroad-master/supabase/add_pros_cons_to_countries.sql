-- Add pros_for_expats and cons_for_expats columns to countries table
-- These are populated by the weekly AI update pipeline and read directly by the frontend

ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS pros_for_expats text[],
  ADD COLUMN IF NOT EXISTS cons_for_expats text[];

COMMENT ON COLUMN countries.pros_for_expats IS 'AI-generated list of top advantages for expats living in this country';
COMMENT ON COLUMN countries.cons_for_expats IS 'AI-generated list of top challenges for expats living in this country';
