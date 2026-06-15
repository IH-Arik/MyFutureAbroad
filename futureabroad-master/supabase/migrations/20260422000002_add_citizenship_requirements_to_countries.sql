-- Add citizenship_requirements column to countries table
alter table countries add column citizenship_requirements jsonb;

-- Add comment explaining the JSON structure
comment on column countries.citizenship_requirements is 'JSON object with citizenship categories as keys. Format: { "category_name": { "icon": "icon_name", "desc": "markdown_description" }, ... }';
