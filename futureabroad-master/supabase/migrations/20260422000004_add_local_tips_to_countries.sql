-- Add local_tips column to countries table
ALTER TABLE countries
ADD COLUMN local_tips text;

-- Add comment for documentation
COMMENT ON COLUMN countries.local_tips IS 'Markdown text with helpful tips for moving or applying for citizenship in the country';
