-- Add extra_info column to countries table
ALTER TABLE countries
ADD COLUMN extra_info text;

COMMENT ON COLUMN countries.extra_info IS 'Additional markdown content for country-specific extra details';
