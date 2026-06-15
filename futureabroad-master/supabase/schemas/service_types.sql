-- service_types.sql
create table if not exists service_types (
  id text primary key, -- e.g. 'visa_application'
  name text not null,
  icon text, -- e.g. 'file-text', 'briefcase' (lucide-react icon names)
  tagline text,
  description text,
  created_at timestamptz default now()
);

-- Seed initial service types
insert into service_types (id, name, icon, tagline, description) values
('visa_application', 'Visa Application', 'file-text', 'Full application support', 'Complete end-to-end assistance with your visa application.'),
('legal_consultation', 'Legal Consultation', 'scale', 'Expert legal advice', 'Consult with certified immigration lawyers.'),
('document_translation', 'Document Translation', 'languages', 'Certified translations', 'Official translation of your documents.'),
('relocation_package', 'Relocation Package', 'home', 'Move with ease', 'Housing, banking, and settlement assistance.')
on conflict (id) do nothing;
