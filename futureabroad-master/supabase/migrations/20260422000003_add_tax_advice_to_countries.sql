-- Add tax_advice column to countries table
ALTER TABLE countries
ADD COLUMN tax_advice text;

-- Add comment for documentation
COMMENT ON COLUMN countries.tax_advice IS 'Markdown bullet points about tax considerations for the country';
