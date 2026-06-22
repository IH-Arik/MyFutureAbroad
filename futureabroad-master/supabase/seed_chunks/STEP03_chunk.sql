insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'work',
	'Italy''s family reunification visa (Ricongiungimento Familiare) allows non-EU residents in Italy to bring close family members (spouse, minor children, dependent parents) to join them.',
	array['Family unity in Italy','Right to work and study','Access to Italian healthcare (SSN)','Path to permanent residency','Schengen Area travel'],
	NULL,
	NULL,
	6549.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	24,
	false,
	true,
	NULL,
	120.00,
	'EUR',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'work',
	'Italy''s Working Holiday Visa (Vacanza Lavoro) allows young citizens of partner countries to travel and work in Italy for up to 12 months, combining tourism with temporary employment.',
	array['Travel and work in Italy','Experience Italian culture','Schengen Area travel','Part-time or seasonal employment','No sponsorship required'],
	NULL,
	30,
	0.00,
	'EUR',
	3000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	30.00,
	'EUR',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'work',
	'Italy''s self-employment visa for non-EU nationals who wish to work as freelancers, independent professionals, or establish their own business under Italy''s annual quota system (Decreto Flussi).',
	array['Work independently in Italy','Path to permanent residency','Schengen Area travel','Rich cultural environment','Access to Italian healthcare'],
	NULL,
	NULL,
	0.00,
	'EUR',
	8000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	120,
	24,
	false,
	true,
	NULL,
	120.00,
	'EUR',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'student',
	'Italy''s student visa (Visto per Studio) for non-EU nationals who have been accepted into an Italian university, higher education institution, or accredited language school for stays over 90 days.',
	array['Study at world-class Italian universities','Part-time work permitted up to 20hrs/week','Schengen Area travel','Rich cultural experience','Pathway to post-study work permit'],
	NULL,
	NULL,
	0.00,
	'EUR',
	6000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	55.00,
	'EUR',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'tourist',
	'Italy''s short-stay Schengen visa (Type C) allows non-EU nationals to visit Italy for tourism, business, or short courses for up to 90 days within a 180-day period.',
	array['Travel throughout the Schengen Area','Visit Italy for tourism or business','Quick processing','Straightforward application','Multiple entry options available'],
	NULL,
	NULL,
	0.00,
	'EUR',
	500.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	false,
	15,
	3,
	false,
	false,
	NULL,
	85.00,
	'EUR',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'work',
	'Italy''s Investor Visa (Golden Visa) grants a 2-year residence permit to non-EU nationals who make a qualifying investment in Italian startups, companies, government bonds, or philanthropic projects.',
	array['EU residency','Schengen Area travel','Live and work in Italy','Family inclusion','Path to citizenship after 10 years'],
	NULL,
	NULL,
	0.00,
	'EUR',
	250000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	24,
	false,
	true,
	NULL,
	116.00,
	'EUR',
	array[]::text[],
	'https://investorvisaforitaly.mise.gov.it/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s work visa for non-EU skilled professionals who have a job offer from a Spanish employer in a qualified occupation, granting residence and work rights in Spain.',
	array['Live and work in Spain','Schengen Area travel','Path to permanent residency','High quality of life','Mediterranean climate'],
	NULL,
	NULL,
	1080.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	100.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s Working Holiday Visa for young citizens of partner countries to live and work in Spain for up to 12 months, combining travel with temporary employment or work experience.',
	array['Travel and work in Spain','Experience Spanish culture','Schengen Area travel','No sponsorship required','Flexible employment options'],
	NULL,
	30,
	0.00,
	'EUR',
	2000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	65.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s job seeker visa allows non-EU qualified professionals and graduates to enter Spain for up to 12 months to search for employment or to set up a business.',
	array['Search for work in Spain on the ground','Experience Spanish job market','Schengen Area travel','Convert to work permit if employed','Mediterranean lifestyle'],
	NULL,
	NULL,
	0.00,
	'EUR',
	7200.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	65.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s family reunification visa allows non-EU residents with a valid long-term residence permit to bring close family members (spouse, minor children, dependent parents) to live with them in Spain.',
	array['Family unity in Spain','Right to work and study','Access to Spanish healthcare','Schengen Area travel','Path to permanent residency'],
	NULL,
	NULL,
	600.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	true,
	NULL,
	88.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'student',
	'Spain''s long-term student visa for non-EU nationals enrolled in a Spanish university, language school, or accredited course for stays exceeding 90 days.',
	array['Study at top Spanish universities','Part-time work permitted up to 20hrs/week','Schengen Area travel','Vibrant student life','Affordable tuition and living costs'],
	NULL,
	NULL,
	0.00,
	'EUR',
	5400.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	80.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'startup',
	'Spain''s Entrepreneur Visa under the Entrepreneurs'' Law for non-EU nationals who wish to develop an innovative business activity with special economic interest to Spain.',
	array['Run an innovative business in Spain','Schengen Area travel','Path to permanent residency','Access to Spanish startup ecosystem','Family reunification eligible'],
	NULL,
	NULL,
	0.00,
	'EUR',
	15000.00,
	'EUR',
	array['Entrepreneurship','Innovation'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	100.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s self-employed or autonomous worker visa (cuenta propia) for non-EU professionals who wish to work as independent freelancers or establish and run their own business in Spain.',
	array['Work independently in Spain','Schengen Area travel','Path to permanent residency','Mediterranean lifestyle','Family reunification eligible'],
	NULL,
	NULL,
	0.00,
	'EUR',
	10000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	100.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s standard work visa (Visado de Trabajo por Cuenta Ajena) for non-EU nationals who have a job offer from a Spanish employer and employer-sponsored work permit authorisation.',
	array['Live and work legally in Spain','Schengen Area travel','Path to permanent residency','High quality of life','Mediterranean climate'],
	NULL,
	NULL,
	1080.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	88.00,
	'EUR',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'For highly skilled (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'work',
	'For highly skilled workers from outside the EU/EEA who have a job offer from a recognized Dutch sponsor.',
	array['30% tax ruling benefit','Fast processing','Family inclusion','Path to permanent residency','High quality of life'],
	NULL,
	NULL,
	4800.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	14,
	60,
	false,
	true,
	NULL,
	350.00,
	'USD',
	array[]::text[],
	'https://ind.nl/en/residence-permits/work/highly-skilled-migrant',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'For innovative entrepreneurs (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'startup',
	'For innovative entrepreneurs who want to launch their startup in the Netherlands.',
	array['Access to Dutch startup ecosystem','Family inclusion','Schengen travel','Path to residency','Business support'],
	NULL,
	NULL,
	0.00,
	'USD',
	15000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	350.00,
	'USD',
	array[]::text[],
	'https://ind.nl/en/residence-permits/work/start-up',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'For highly skilled (Ireland)',
	(select id from countries where name = 'Ireland'),
	'work',
	'For highly skilled workers in occupations experiencing critical skills shortages in Ireland.',
	array['Immediate family reunification','Path to permanent residency','English-speaking country','EU access','Strong tech sector'],
	NULL,
	NULL,
	3200.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	24,
	false,
	true,
	NULL,
	1200.00,
	'USD',
	array[]::text[],
	'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'For non-EU citizens (Italy)',
	(select id from countries where name = 'Italy'),
	'work',
	'For non-EU citizens who wish to live in Italy without working, supported by passive income or savings.',
	array['Beautiful lifestyle','Path to EU residency','Healthcare access','Family inclusion','Schengen travel'],
	NULL,
	NULL,
	2500.00,
	'USD',
	35000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	true,
	NULL,
	150.00,
	'USD',
	array[]::text[],
	'https://vistoperitalia.esteri.it/home/en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Italy Visa',
	(select id from countries where name = 'Italy'),
	'work',
	'Italy''s visa for remote workers employed by companies outside Italy or self-employed freelancers.',
	array['Work remotely from Italy','Schengen access','Rich culture and lifestyle','Family inclusion','Path to residency'],
	NULL,
	NULL,
	2333.33,
	'USD',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	45,
	12,
	false,
	true,
	NULL,
	120.00,
	'USD',
	array[]::text[],
	'https://www.esteri.it/en/servizi-consolari-e-visti/italiani-all-estero/digital-nomad-visa/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Greece Visa',
	(select id from countries where name = 'Greece'),
	'work',
	'Greece''s visa for remote workers who want to live and work from the beautiful Greek islands or mainland.',
	array['Low cost of living','Beautiful scenery','Schengen access','Mediterranean lifestyle','Family inclusion'],
	NULL,
	NULL,
	3500.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	100.00,
	'USD',
	array[]::text[],
	'https://migration.gov.gr/en/digital-nomad-visa/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Residence by investment (Greece)',
	(select id from countries where name = 'Greece'),
	'family',
	'Residence by investment program for real estate purchases in Greece, offering EU residency.',
	array['EU residency','Schengen travel','No minimum stay','Family inclusion','Path to citizenship'],
	NULL,
	NULL,
	0.00,
	'USD',
	250000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	60,
	false,
	true,
	NULL,
	2000.00,
	'USD',
	array[]::text[],
	'https://migration.gov.gr/en/golden-visa/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Work permit for (Belgium)',
	(select id from countries where name = 'Belgium'),
	'work',
	'Work permit for self-employed professionals and business owners wanting to establish in Belgium.',
	array['EU headquarters location','Multilingual environment','Family reunification','Path to residency','Central European location'],
	NULL,
	NULL,
	0.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	60,
	false,
	true,
	NULL,
	400.00,
	'USD',
	array[]::text[],
	'https://economie.fgov.be/en/themes/enterprises/starting-business/procedures-self-employed',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Work and residence (Poland)',
	(select id from countries where name = 'Poland'),
	'work',
	'Work and residence permit for non-EU citizens with employment in Poland.',
	array['Low cost of living','Growing economy','Schengen access','Path to permanent residency','Central location'],
	NULL,
	NULL,
	1500.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	36,
	false,
	true,
	NULL,
	120.00,
	'USD',
	array[]::text[],
	'https://udsc.gov.pl/en/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Points-based immigration system (Austria)',
	(select id from countries where name = 'Austria'),
	'work',
	'Points-based immigration system for skilled workers, graduates, and key workers in Austria.',
	array['High quality of life','Strong economy','Family reunification','Path to permanent residency','Schengen access'],
	NULL,
	NULL,
	3000.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	24,
	false,
	true,
	NULL,
	160.00,
	'USD',
	array[]::text[],
	'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/red-white-red-card/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Premium work permit (Turkey)',
	(select id from countries where name = 'Turkey'),
	'work',
	'Premium work permit for highly qualified foreigners, investors, and those making significant contributions to Turkey.',
	array['Indefinite validity','Work flexibility','Family inclusion','Path to citizenship','Strategic location'],
	NULL,
	NULL,
	3000.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	250.00,
	'USD',
	array[]::text[],
	'https://www.goc.gov.tr/turquoise-card',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Nomad Residence Permit (Malta)',
	(select id from countries where name = 'Malta'),
	'work',
	'Nomad Residence Permit for remote workers who want to live and work from Malta''s Mediterranean shores.',
	array['English-speaking','Mediterranean climate','EU access','Tax benefits','Safe environment'],
	NULL,
	NULL,
	2700.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	true,
	NULL,
	300.00,
	'USD',
	array[]::text[],
	'https://nomad.residencymalta.gov.mt/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Swiss residence permit (Switzerland)',
	(select id from countries where name = 'Switzerland'),
	'work',
	'Swiss residence permit for non-EU/EFTA nationals with employment in Switzerland.',
	array['High salaries','Excellent quality of life','Beautiful scenery','Strong banking','Central location'],
	NULL,
	NULL,
	8000.00,
	'EUR',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	150.00,
	'EUR',
	array[]::text[],
	'https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht-eu_efta.html',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Simplified work permit (Denmark)',
	(select id from countries where name = 'Denmark'),
	'work',
	'Simplified work permit scheme for highly paid positions or certified companies in Denmark.',
	array['High quality of life','Work-life balance','Strong welfare system','Family inclusion','Schengen access'],
	NULL,
	NULL,
	5500.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	30,
	48,
	false,
	true,
	NULL,
	400.00,
	'USD',
	array[]::text[],
	'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Fast-track',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Swedish work permit (Sweden)',
	(select id from countries where name = 'Sweden'),
	'work',
	'Swedish work permit for non-EU citizens with a job offer meeting salary and insurance requirements.',
	array['Excellent work-life balance','Strong social security','Beautiful nature','Family inclusion','Path to permanent residency'],
	NULL,
	NULL,
	2200.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	120,
	24,
	false,
	true,
	NULL,
	250.00,
	'USD',
	array[]::text[],
	'https://www.migrationsverket.se/en/you-want-to-apply/work.html',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Residence permit for (Finland)',
	(select id from countries where name = 'Finland'),
	'startup',
	'Residence permit for startup founders who want to build their innovative business in Finland.',
	array['Strong startup ecosystem','High quality of life','Excellent education','Family inclusion','Schengen access'],
	NULL,
	NULL,
	0.00,
	'USD',
	15000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	24,
	false,
	true,
	NULL,
	500.00,
	'USD',
	array[]::text[],
	'https://www.businessfinland.fi/en/do-business-with-finland/startup-in-finland/startup-permit',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Work permit for (Norway)',
	(select id from countries where name = 'Norway'),
	'work',
	'Work permit for skilled workers with a concrete job offer from a Norwegian employer.',
	array['High salaries','Beautiful nature','Strong welfare','Work-life balance','Family reunification'],
	NULL,
	NULL,
	3500.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	30,
	36,
	false,
	true,
	NULL,
	600.00,
	'USD',
	array[]::text[],
	'https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Cyprus visa for (Cyprus)',
	(select id from countries where name = 'Cyprus'),
	'work',
	'Cyprus visa for remote workers wanting to enjoy Mediterranean living while working for overseas employers.',
	array['Mediterranean climate','Low cost of living','English widely spoken','EU member','Tax benefits'],
	NULL,
	NULL,
	3500.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	150.00,
	'USD',
	array[]::text[],
	'https://www.moi.gov.cy/moi/crmd/crmd.nsf/dmlindex_en/dmlindex_en',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The UK offers (UK)',
	(select id from countries where name = 'United Kingdom'),
	'work',
	'The UK offers various visa options for workers depending upon your circumstances.',
	array['Access to NHS healthcare','Path to settlement','Bring dependants','Switch employers','Work flexibility'],
	NULL,
	NULL,
	2100.00,
	'EUR',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	21,
	60,
	false,
	true,
	NULL,
	750.00,
	'EUR',
	array[]::text[],
	'https://www.gov.uk/browse/visas-immigration/work-visas',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Visa to set (UK)',
	(select id from countries where name = 'United Kingdom'),
	'work',
	'Visa to set up and run an innovative business in the UK',
	array['Fast Track to Permanent Residency','No Minimum Investment Requirement','Ability to Start and Run Your Own Business','Flexibility to Work Outside Your Startup','Family Members Can Join'],
	NULL,
	NULL,
	0.00,
	'GBP',
	0.00,
	'USD',
	array['Entrepreneurship','Business Management'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	21,
	36,
	false,
	true,
	NULL,
	1274.00,
	'GBP',
	array[]::text[],
	'https://www.gov.uk/innovator-founder-visa',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Multi-year residence permit (France)',
	(select id from countries where name = 'France'),
	'work',
	'Multi-year residence permit for highly skilled workers, researchers, and entrepreneurs coming to France.',
	array['4-year validity','Work authorization included','Family inclusion','Path to permanent residency','Schengen access'],
	NULL,
	NULL,
	2800.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	45,
	48,
	false,
	true,
	NULL,
	200.00,
	'USD',
	array[]::text[],
	'https://www.service-public.fr/particuliers/vosdroits/F16922',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'family',
	'Germany''s EU Blue Card for highly qualified non-EU citizens with a university degree and job offer.',
	array['Fast-track to permanent residency','Family reunification','Schengen travel','Strong job market','High quality of life'],
	NULL,
	NULL,
	4000.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	48,
	false,
	true,
	NULL,
	140.00,
	'USD',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Self-employment visa for (Germany)',
	(select id from countries where name = 'Germany'),
	'work',
	'Self-employment visa for freelancers and artists who want to work independently in Germany.',
	array['Work independently','Path to permanent residency','Access to German healthcare','Schengen travel','Family reunification'],
	NULL,
	NULL,
	0.00,
	'USD',
	10000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	36,
	false,
	true,
	NULL,
	100.00,
	'USD',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/self-employment',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Portugal Visa',
	(select id from countries where name = 'Portugal'),
	'work',
	'Portugal''s Digital Nomad Visa allows remote workers to live and work in Portugal while employed by a company outside the country. Perfect for freelancers and remote employees.',
	array['Access to Schengen Area','Path to permanent residency','High quality of life','Mild climate year-round','Affordable cost of living'],
	NULL,
	NULL,
	3040.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	true,
	NULL,
	180.00,
	'USD',
	array[]::text[],
	'https://vistos.mne.gov.pt/en/national-visas/general-information/work',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Portugal Visa',
	(select id from countries where name = 'Portugal'),
	'family',
	'Portugal''s Golden Visa is a residency by investment program offering permanent residency to non-EU citizens who make qualifying investments in Portugal.',
	array['EU residency','Path to citizenship','Visa-free Schengen travel','Family inclusion','Low stay requirement'],
	NULL,
	NULL,
	0.00,
	'USD',
	500000.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	24,
	false,
	true,
	NULL,
	5500.00,
	'USD',
	array[]::text[],
	'https://aima.gov.pt/en/golden-visa',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The D7 Visa (Portugal)',
	(select id from countries where name = 'Portugal'),
	'family',
	'The D7 Visa is perfect for retirees or those with passive income streams who want to enjoy Portugal''s relaxed lifestyle and affordable healthcare.',
	array['Low cost of living','Excellent healthcare','Path to citizenship','Tax benefits','Family reunification'],
	NULL,
	NULL,
	760.00,
	'EUR',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	45,
	24,
	false,
	true,
	NULL,
	150.00,
	'EUR',
	array[]::text[],
	'https://vistos.mne.gov.pt/en/national-visas/general-information/passive-income',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s new Digital Nomad Visa allows remote workers to live in Spain while working for foreign companies. Includes tax benefits and path to residency.',
	array['Schengen access','Special tax regime','Path to residency','Family inclusion','World-class healthcare'],
	NULL,
	NULL,
	2646.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	36,
	false,
	true,
	NULL,
	80.00,
	'USD',
	array[]::text[],
	'https://www.inclusion.gob.es/en/web/migraciones/digital-nomad-visa',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Spain Visa',
	(select id from countries where name = 'Spain'),
	'work',
	'Spain''s Non-Lucrative Visa is ideal for retirees and those with passive income who want to enjoy Spanish culture without working.',
	array['High quality healthcare','EU residency','Path to citizenship','Family reunification','Beautiful climate'],
	NULL,
	NULL,
	2400.00,
	'USD',
	0.00,
	'USD',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	true,
	NULL,
	120.00,
	'USD',
	array[]::text[],
	'https://www.exteriores.gob.es/en/visas/pages/visados.aspx',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The EU Blue (Germany)',
	(select id from countries where name = 'Germany'),
	'work',
	'The EU Blue Card is a work permit for highly qualified non-EU citizens, offering a pathway to permanent residence in Germany and the EU.',
	array['Path to permanent residency','EU-wide mobility','Family reunification','Strong economy','World-class infrastructure'],
	NULL,
	NULL,
	4500.00,
	'USD',
	0.00,
	'USD',
	array['Technology & IT','Engineering','Healthcare','Finance'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	48,
	false,
	true,
	NULL,
	100.00,
	'USD',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The Dutch family (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'work',
	'The Dutch family reunification permit allows non-EU family members of legal Dutch residents to join them in the Netherlands. The sponsor must meet minimum income requirements and provide adequate accommodation.',
	array['Family unity in the Netherlands','Right to work and study','Path to permanent residency','Access to Dutch healthcare','Schengen Area travel'],
	NULL,
	NULL,
	24174.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	228.00,
	'EUR',
	array[]::text[],
	'https://ind.nl/en/residence-permits/family-and-partner',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The Dutch student (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'student',
	'The Dutch student residence permit (MVV + IND permit) allows non-EU/EEA nationals enrolled at a Dutch higher education institution to live and study in the Netherlands for the duration of their programme.',
	array['Study at world-class Dutch institutions','Part-time work permitted up to 16hrs/week','Schengen Area travel','Orientation year permit after graduation','Path to skilled worker visa'],
	NULL,
	NULL,
	0.00,
	'EUR',
	10000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	210.00,
	'EUR',
	array[]::text[],
	'https://ind.nl/en/residence-permits/study',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The Dutch self-employed (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'work',
	'The Dutch self-employed residence permit (equivalent to a digital nomad visa) allows non-EU freelancers and remote entrepreneurs to live and work in the Netherlands, assessed via a points-based system covering experience, business plan, and Dutch economic contribution.',
	array['Live and work as a freelancer in the Netherlands','Register your business locally','Schengen Area travel','Path to permanent residency','Access to world-class infrastructure'],
	NULL,
	NULL,
	3000.00,
	'EUR',
	5000.00,
	'EUR',
	array['Entrepreneurship','Self-Employment'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	24,
	false,
	true,
	NULL,
	430.00,
	'EUR',
	array[]::text[],
	'https://ind.nl/en/residence-permits/work/self-employment',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'The Dutch Orientation (Netherlands)',
	(select id from countries where name = 'Netherlands'),
	'work',
	'The Dutch Orientation Year (Zoekjaar) permit allows recent non-EU graduates from recognised universities to stay in the Netherlands for one year to find work or start a business.',
	array['Job search in the Netherlands after graduation','Right to work during permit period','No sponsor required','Schengen Area travel','Path to skilled migrant permit'],
	NULL,
	NULL,
	0.00,
	'EUR',
	10000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	228.00,
	'EUR',
	array[]::text[],
	'https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'student',
	'Germany''s student visa (Studentenvisum) for non-EU nationals accepted into a German university or higher education institution for a full degree programme lasting more than 90 days.',
	array['Study at world-renowned German universities','Part-time work permitted up to 120 days/year','Post-study job-seeker permit','Tuition-free education at many public universities','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'EUR',
	11904.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	45,
	12,
	false,
	false,
	NULL,
	82.00,
	'EUR',
	array[]::text[],
	'https://www.germany-visa.org/student-visa/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'work',
	'Germany''s family reunion visa (Familienzusammenf�hrung) allows spouses, minor children, and in some cases dependent relatives of German residents and citizens to join them in Germany for long-term residence.',
	array['Family unity in Germany','Immediate right to work','Path to permanent residency','Access to German healthcare','Schengen Area travel'],
	NULL,
	NULL,
	2200.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	82.00,
	'EUR',
	array[]::text[],
	'https://www.auswaertiges-amt.de/en/visa-service/familienvisum',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'work',
	'Germany''s points-based Opportunity Card (Chancenkarte) allows qualified non-EU nationals to enter Germany for up to one year to search for work or test the job market, without a prior job offer.',
	array['Enter Germany without a prior job offer','Work up to 20hrs/week whilst job seeking','Access to Germany''s labour market','Convert to work permit when employed','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'EUR',
	15000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	false,
	NULL,
	82.00,
	'EUR',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'work',
	'Germany''s job seeker visa allows highly qualified non-EU professionals with a recognised degree to enter Germany for up to six months to look for work matching their qualifications.',
	array['Search for work in Germany in person','Network directly with German employers','Convert to work visa when employed','Schengen Area travel','Access to Germany''s thriving economy'],
	NULL,
	NULL,
	0.00,
	'EUR',
	12000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	6,
	false,
	false,
	NULL,
	82.00,
	'EUR',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/job-seeker-visa',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Germany Visa',
	(select id from countries where name = 'Germany'),
	'work',
	'Germany''s self-employment visa (Freiberufler Visa / Selbstst�ndige) for non-EU freelancers and liberal professionals such as artists, writers, engineers and IT consultants who wish to work independently in Germany.',
	array['Work independently in Germany','Access to Schengen Area','Path to permanent residency','No employer sponsorship required','Access to German healthcare'],
	NULL,
	NULL,
	2500.00,
	'EUR',
	10000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	36,
	false,
	true,
	NULL,
	82.00,
	'EUR',
	array[]::text[],
	'https://www.make-it-in-germany.com/en/visa-residence/types/self-employment',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'France Visa',
	(select id from countries where name = 'France'),
	'student',
	'France''s long-stay student visa (VLS-TS �tudiant) for non-EU nationals enrolled in a French higher education institution or accredited language programme for more than 90 days.',
	array['Study at world-class French institutions','Part-time work permitted (up to 964 hrs/year)','Schengen Area travel','Post-study job search permit','Affordable higher education'],
	NULL,
	NULL,
	0.00,
	'EUR',
	7200.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	false,
	30,
	12,
	false,
	false,
	NULL,
	54.00,
	'EUR',
	array[]::text[],
	'https://france-visas.gouv.fr/en/student',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'France Visa',
	(select id from countries where name = 'France'),
	'work',
	'France''s family reunification visa allows the spouse and dependent children of a foreign national who has been legally resident in France for at least 18 months to join them for long-term residence.',
	array['Family unity in France','Right to work','Path to permanent residency','Access to French healthcare','Schengen Area travel'],
	NULL,
	NULL,
	1329.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	109.00,
	'EUR',
	array[]::text[],
	'https://france-visas.gouv.fr/en/famille-d-etranger-residant-en-france',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'France Visa',
	(select id from countries where name = 'France'),
	'other',
	'France''s long-stay visitor visa (VLS-TS Visiteur) is ideal for retirees and financially independent non-EU nationals who wish to live in France without engaging in any professional activity.',
	array['Live in France long-term','Schengen Area travel','Access to French healthcare (after registration)','Rich cultural lifestyle','Path to permanent residency'],
	NULL,
	NULL,
	1500.00,
	'EUR',
	18000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	false,
	30,
	12,
	false,
	true,
	NULL,
	109.00,
	'EUR',
	array[]::text[],
	'https://france-visas.gouv.fr/en/visitor',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'France Visa',
	(select id from countries where name = 'France'),
	'startup',
	'France''s long-stay visa for self-employed professionals and entrepreneurs (Profession lib�rale / Commer�ant) who wish to establish or run their own business in France.',
	array['Start or run your own business in France','Schengen Area travel','Access to French healthcare','Path to permanent residency','Strong startup ecosystem'],
	NULL,
	NULL,
	1500.00,
	'EUR',
	8000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	true,
	NULL,
	109.00,
	'EUR',
	array[]::text[],
	'https://france-visas.gouv.fr/en/entrepreneur',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Ireland Visa',
	(select id from countries where name = 'Ireland'),
	'student',
	'Ireland''s student visa (Stamp 2) allows non-EEA nationals enrolled in a full-time course on Ireland''s Interim List of Eligible Programmes (ILEP) to live and study in Ireland.',
	array['Study at Irish universities and colleges','Part-time work permitted (20hrs/week term time, 40hrs holidays)','English-speaking country','Path to post-study work permit','Access to EU education networks'],
	NULL,
	NULL,
	0.00,
	'EUR',
	7000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	65.00,
	'EUR',
	array[]::text[],
	'https://www.irishimmigration.ie/coming-to-study-in-ireland/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Ireland Visa',
	(select id from countries where name = 'Ireland'),
	'work',
	'Ireland''s join family visa allows non-EEA nationals to join a family member who is an Irish citizen or legal resident, subject to income, accommodation, and relationship requirements.',
	array['Join family in Ireland','Right to work (Stamp 4)','English-speaking country','Path to Irish residency','Access to Irish healthcare'],
	NULL,
	NULL,
	40000.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	65.00,
	'EUR',
	array[]::text[],
	'https://www.irishimmigration.ie/coming-to-join-family-in-ireland/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Ireland Visa',
	(select id from countries where name = 'Ireland'),
	'work',
	'Ireland''s Immigrant Investor Programme grants residence to non-EEA nationals who make a qualifying investment of at least �1 million in an approved Irish enterprise fund or business.',
	array['EU residency','No minimum stay requirement','Right to live, work and study in Ireland','Family inclusion','Path to Irish citizenship after 5 years'],
	NULL,
	NULL,
	0.00,
	'EUR',
	2000000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	180,
	24,
	false,
	true,
	NULL,
	1635.00,
	'EUR',
	array[]::text[],
	'https://www.irishimmigration.ie/coming-to-invest-in-ireland/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Ireland Visa',
	(select id from countries where name = 'Ireland'),
	'work',
	'Ireland''s General Employment Permit allows non-EEA nationals to work in Ireland in occupations experiencing labour shortages, requiring a job offer from an Irish employer paying above the salary threshold.',
	array['Live and work legally in Ireland','Path to long-term residency','English-speaking environment','Growing tech economy','Family can join after 12 months'],
	NULL,
	NULL,
	34000.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	24,
	false,
	true,
	NULL,
	1095.00,
	'EUR',
	array[]::text[],
	'https://www.gov.ie/en/service/apply-for-a-general-employment-permit/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Austria Visa',
	(select id from countries where name = 'Austria'),
	'student',
	'Austria''s student visa (Aufenthaltsbewilligung � Studierender) for non-EU/EEA nationals enrolled in a full degree programme at an Austrian university or accredited higher education institution.',
	array['Study at world-class Austrian institutions','Part-time work permitted','Schengen Area travel','High quality of life','Access to Austrian healthcare'],
	NULL,
	NULL,
	0.00,
	'EUR',
	10164.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	12,
	false,
	false,
	NULL,
	160.00,
	'EUR',
	array[]::text[],
	'https://www.oead.at/en/study-in-austria/before-your-stay/visa-residence-permit/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Austria Visa',
	(select id from countries where name = 'Austria'),
	'work',
	'Austria''s family reunification permit allows non-EU/EEA spouses and minor children of Austrian residents to join their family member for long-term residence in Austria, subject to income and accommodation requirements.',
	array['Family unity in Austria','Right to work','Path to permanent residency','Schengen Area travel','High quality of life and healthcare'],
	NULL,
	NULL,
	1600.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	174.00,
	'EUR',
	array[]::text[],
	'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/family-reunification/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Austria Visa',
	(select id from countries where name = 'Austria'),
	'startup',
	'Austria''s Red-White-Red Card for Startup Founders is for non-EU entrepreneurs with an innovative business idea that contributes to the Austrian economy. Includes a points-based assessment of qualifications and business viability.',
	array['Launch an innovative business in Austria','Path to permanent residency','Access to central European markets','Schengen Area travel','High quality of life'],
	NULL,
	NULL,
	2000.00,
	'EUR',
	20000.00,
	'EUR',
	array['Entrepreneurship','Innovation'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	60,
	24,
	false,
	true,
	NULL,
	174.00,
	'EUR',
	array[]::text[],
	'https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/red-white-red-card/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Belgium Visa',
	(select id from countries where name = 'Belgium'),
	'student',
	'Belgium''s long-stay student visa (Type D) for non-EU nationals enrolled at a Belgian university or higher education institution for a full academic programme lasting more than 90 days.',
	array['Study at Belgian universities','Part-time work permitted','Multilingual environment','EU headquarters location','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'EUR',
	7200.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	12,
	false,
	false,
	NULL,
	220.00,
	'EUR',
	array[]::text[],
	'https://dofi.ibz.be/en/themes/visa/categories-of-visa-d/student',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Belgium Visa',
	(select id from countries where name = 'Belgium'),
	'work',
	'Belgium''s family reunification visa allows non-EU spouses, minor children, and in some cases dependent relatives of Belgian citizens or legal residents to join them in Belgium for long-term residence.',
	array['Family unity in Belgium','Right to work','Path to permanent residency','EU headquarters location','Schengen Area travel'],
	NULL,
	NULL,
	1500.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	220.00,
	'EUR',
	array[]::text[],
	'https://dofi.ibz.be/en/themes/residence/family-reunification',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Belgium Visa',
	(select id from countries where name = 'Belgium'),
	'work',
	'Belgium''s Single Permit (Permis unique) combines a work permit and residence permit into one document for non-EU nationals who have a job offer from a Belgian employer.',
	array['Live and work legally in Belgium','Path to permanent residency','EU headquarters location','Multilingual environment','Schengen Area travel'],
	NULL,
	NULL,
	2500.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	440.00,
	'EUR',
	array[]::text[],
	'https://economie.fgov.be/en/themes/enterprises/starting-business/foreign-nationals/single-permit',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Denmark Visa',
	(select id from countries where name = 'Denmark'),
	'student',
	'Denmark''s student residence permit for non-EU/EEA nationals enrolled in a full-time study programme at a Danish university or higher education institution lasting more than 3 months.',
	array['Study in Denmark','Part-time work permitted (20hrs/week)','Post-study work permit option','High quality of life','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'DKK',
	9136.00,
	'DKK',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	60,
	12,
	false,
	false,
	NULL,
	250.00,
	'DKK',
	array[]::text[],
	'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Education/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Denmark Visa',
	(select id from countries where name = 'Denmark'),
	'work',
	'Denmark''s family reunification permit allows spouses, registered partners, and minor children of Danish residents to join them in Denmark, subject to integration and attachment requirements.',
	array['Family unity in Denmark','Right to work','Path to permanent residency','Strong welfare system','Schengen Area travel'],
	NULL,
	NULL,
	3300.00,
	'DKK',
	0.00,
	'DKK',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	90,
	12,
	false,
	true,
	NULL,
	2030.00,
	'DKK',
	array[]::text[],
	'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Family/',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Finland Visa',
	(select id from countries where name = 'Finland'),
	'student',
	'Finland''s student residence permit for non-EU/EEA nationals enrolled in a full-time degree programme at a Finnish university or university of applied sciences.',
	array['Study at Finnish universities (often tuition-free for EU students)','Part-time work permitted','High quality education system','Path to post-study work permit','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'EUR',
	6720.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	false,
	30,
	12,
	false,
	false,
	NULL,
	380.00,
	'EUR',
	array[]::text[],
	'https://migri.fi/en/student',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Finland Visa',
	(select id from countries where name = 'Finland'),
	'work',
	'Finland''s family reunification permit allows the spouses, registered partners, and minor children of Finnish residents or citizens to join them in Finland, provided the sponsor can support the family financially.',
	array['Family unity in Finland','Right to work','Path to permanent residency','Strong social security','Schengen Area travel'],
	NULL,
	NULL,
	1300.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	90,
	12,
	false,
	true,
	NULL,
	470.00,
	'EUR',
	array[]::text[],
	'https://migri.fi/en/family-member-of-a-person-living-in-finland',
	NULL
);

insert into visas (
	name, country_id, visa_type, description, benefits, min_age, max_age,
	min_income, min_income_currency, min_savings, min_savings_currency,
	required_skills, eligible_nationalities, excluded_nationalities,
	requires_health_insurance, requires_clean_criminal_record,
	processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description,
	application_fee_usd, application_fee_currency, required_documents, official_link, image_url
)
values
(
	'Finland Visa',
	(select id from countries where name = 'Finland'),
	'work',
	'Finland''s specialist work permit for non-EU/EEA nationals who have been offered a specialist or expert role by a Finnish employer, allowing long-term residence and employment in Finland.',
	array['Work in Finland''s thriving tech economy','Path to permanent residency','Strong work-life balance','Family can join','Schengen Area travel'],
	NULL,
	NULL,
	3000.00,
	'EUR',
	0.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	30,
	24,
	false,
	true,
	NULL,
	500.00,
	'EUR',
	array[]::text[],
	'https://migri.fi/en/employee',
	NULL
);
