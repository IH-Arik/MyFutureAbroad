-- Add currency field to budget_items table
ALTER TABLE budget_items ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_budget_items_currency ON budget_items(currency);
