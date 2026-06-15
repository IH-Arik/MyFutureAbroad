-- Update the seeded services in production with expanded applicable_countries
-- and sync the normalized service_countries join table.

-- ============================================================
-- 1. Update applicable_countries on each seeded service
-- ============================================================

-- Global Visa Solutions (11111111-1111-1111-1111-111111111111)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark',
    'Sweden','Finland','Norway','Cyprus'
))
where provider_id = '11111111-1111-1111-1111-111111111111'
  and title = 'Portugal Digital Nomad Visa Application';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Spain','Portugal','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark',
    'Sweden','Finland','Norway','Cyprus'
))
where provider_id = '11111111-1111-1111-1111-111111111111'
  and title = 'Spain Digital Nomad Visa Package';

-- Expat Relocations (22222222-2222-2222-2222-222222222222)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Thailand','Mexico','Croatia','Greece','Italy',
    'Cyprus','Malta','Turkey','Vietnam','Indonesia'
))
where provider_id = '22222222-2222-2222-2222-222222222222'
  and title = 'Portugal Relocation Package';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Thailand','Mexico','Portugal','Spain','Vietnam','Indonesia',
    'Malaysia','India','Georgia','Turkey'
))
where provider_id = '22222222-2222-2222-2222-222222222222'
  and title = 'Thailand Soft Landing Package';

-- LegalDocs Translation (33333333-3333-3333-3333-333333333333)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Thailand','Mexico','Netherlands',
    'France','Italy','Switzerland','Ireland','Greece','Belgium','Poland',
    'Austria','Turkey','Malta','Denmark','Sweden','Finland','Norway','Cyprus',
    'Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Vietnam',
    'Indonesia','Malaysia','India','Georgia','Morocco','Egypt','South Africa',
    'Chile','Argentina','Brazil','Peru','China','Japan','South Korea',
    'Singapore','Hong Kong'
))
where provider_id = '33333333-3333-3333-3333-333333333333'
  and title = 'Document Translation - Standard';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania'
))
where provider_id = '33333333-3333-3333-3333-333333333333'
  and title = 'Apostille + Translation Bundle';

-- International Tax Advisors (44444444-4444-4444-4444-444444444444)
update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania','Thailand','Mexico','Vietnam','Indonesia',
    'Malaysia','United Arab Emirates','Singapore','Georgia','Turkey',
    'Argentina','Brazil','Chile'
))
where provider_id = '44444444-4444-4444-4444-444444444444'
  and title = 'Digital Nomad Tax Consultation';

update services
set applicable_countries = (select array_agg(id) from countries where name in (
    'Portugal','Spain','Germany','Estonia','Netherlands','France','Italy',
    'Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta',
    'Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia',
    'Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia',
    'Latvia','Lithuania','United Kingdom','Canada','Australia','New Zealand',
    'United States','Japan','South Korea','Singapore','Hong Kong',
    'United Arab Emirates','Brazil','Argentina','Chile','South Africa','Israel'
))
where provider_id = '44444444-4444-4444-4444-444444444444'
  and title = 'Portugal NHR Tax Regime Setup';

-- ============================================================
-- 2. Sync the service_countries join table
-- ============================================================

-- Remove old mappings for these provider services
delete from service_countries
where service_id in (
    select id from services
    where provider_id in (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444'
    )
);

-- Re-insert from updated applicable_countries
insert into service_countries (service_id, country_id)
select id, unnest(applicable_countries)
from services
where provider_id in (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444'
)
and applicable_countries is not null
on conflict do nothing;
