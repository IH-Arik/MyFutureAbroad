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
	'Sweden Visa',
	(select id from countries where name = 'Sweden'),
	'student',
	'Sweden''s student residence permit for non-EU/EEA nationals enrolled in a full-time degree programme at a Swedish university, allowing residence for the duration of the course.',
	array['Study at Swedish universities','Part-time work permitted','Post-study job search permit','High quality of life','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'SEK',
	80640.00,
	'SEK',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	false,
	15,
	12,
	false,
	false,
	NULL,
	200.00,
	'SEK',
	array[]::text[],
	'https://www.migrationsverket.se/en/you-want-to-apply/study.html',
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
	'Sweden Visa',
	(select id from countries where name = 'Sweden'),
	'work',
	'Sweden''s family reunification residence permit allows the spouse, cohabiting partner, and minor children of Swedish residents to join them in Sweden. The sponsor must meet income and accommodation requirements.',
	array['Family unity in Sweden','Right to work','Path to permanent residency','Strong social welfare system','Schengen Area travel'],
	NULL,
	NULL,
	2200.00,
	'SEK',
	0.00,
	'SEK',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	true,
	270,
	12,
	false,
	true,
	NULL,
	200.00,
	'SEK',
	array[]::text[],
	'https://www.migrationsverket.se/en/you-want-to-apply/live-with-someone/live-with-a-partner-child-or-other-relative.html',
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
	'Sweden Visa',
	(select id from countries where name = 'Sweden'),
	'work',
	'Sweden''s self-employment permit for entrepreneurs enables non-EU nationals with an innovative business idea to establish and run a company in Sweden, subject to a viability assessment.',
	array['Launch a startup in Sweden','Access to thriving Nordic startup ecosystem','Path to permanent residency','Strong work-life balance','Schengen Area travel'],
	NULL,
	NULL,
	1500.00,
	'SEK',
	200000.00,
	'SEK',
	array['Entrepreneurship','Innovation'],
	array[]::text[],
	array[]::text[],
	false,
	true,
	60,
	24,
	false,
	true,
	NULL,
	280.00,
	'SEK',
	array[]::text[],
	'https://www.migrationsverket.se/en/you-want-to-apply/work/start-a-business.html',
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
	'Norway Visa',
	(select id from countries where name = 'Norway'),
	'student',
	'Norway''s student residence permit for non-EU/EEA nationals enrolled at a Norwegian university or higher education institution for a full-time programme of study lasting more than 90 days.',
	array['Study in Norway','Part-time work permitted','High quality of life','Post-study work permit option','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'NOK',
	121980.00,
	'NOK',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	false,
	30,
	12,
	false,
	false,
	NULL,
	700.00,
	'NOK',
	array[]::text[],
	'https://www.udi.no/en/want-to-apply/studies/',
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
	'Norway Visa',
	(select id from countries where name = 'Norway'),
	'work',
	'Norway''s family immigration permit allows spouses, cohabiting partners, and minor children of Norwegian residents to join them in Norway, subject to income and integration requirements.',
	array['Family unity in Norway','Right to work','Path to permanent residency','Exceptional natural environment','Strong welfare system'],
	NULL,
	NULL,
	3000.00,
	'NOK',
	0.00,
	'NOK',
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
	600.00,
	'NOK',
	array[]::text[],
	'https://www.udi.no/en/want-to-apply/family-immigration/',
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
	'student',
	'Greece''s student visa (Type D) for non-EU/EEA nationals enrolled in a full-time study programme at a Greek university or accredited institution for more than 90 days.',
	array['Study in Greece','Part-time work permitted','Mediterranean lifestyle','Schengen Area travel','Affordable cost of living'],
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
	180.00,
	'EUR',
	array[]::text[],
	'https://www.mfa.gr/en/visa-requirements-for-entering-greece/',
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
	'Greece''s family reunification permit allows non-EU spouses and minor dependent children of non-EU residents legally living in Greece for at least two years to join them.',
	array['Family unity in Greece','Right to work','Path to permanent residency','Mediterranean lifestyle','Schengen Area travel'],
	NULL,
	NULL,
	1000.00,
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
	150.00,
	'EUR',
	array[]::text[],
	'https://www.mfa.gr/en/visa-requirements-for-entering-greece/',
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
	'Greece''s self-employment visa allows non-EU nationals to establish and run their own business or work as an independent professional in Greece, subject to proof of business viability and financial stability.',
	array['Run your own business in Greece','Mediterranean lifestyle','Schengen Area travel','Low cost of living','Path to permanent residency'],
	NULL,
	NULL,
	1000.00,
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
	150.00,
	'EUR',
	array[]::text[],
	'https://www.mfa.gr/en/visa-requirements-for-entering-greece/',
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
	'Malta Visa',
	(select id from countries where name = 'Malta'),
	'student',
	'Malta''s student visa for non-EU/EEA nationals enrolled in a full-time recognised study programme in Malta for more than 90 days, with the right to work part-time during studies.',
	array['Study in English-speaking EU country','Part-time work permitted','Mediterranean climate','Schengen Area travel','Affordable living costs'],
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
	330.00,
	'EUR',
	array[]::text[],
	'https://residencymalta.gov.mt/',
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
	'Malta Visa',
	(select id from countries where name = 'Malta'),
	'work',
	'Malta''s family reunification permit allows non-EU spouses and minor dependent children of non-EU residents legally living in Malta to join them in Malta for long-term residence.',
	array['Family unity in Malta','Right to work','English-speaking EU country','Mediterranean climate','Schengen Area travel'],
	NULL,
	NULL,
	1200.00,
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
	330.00,
	'EUR',
	array[]::text[],
	'https://identitymalta.com/unit/expatriates-unit/',
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
	'Malta Visa',
	(select id from countries where name = 'Malta'),
	'work',
	'Malta''s self-employment permit allows non-EU nationals to establish and run their own business in Malta, an English-speaking EU member with a business-friendly regulatory environment.',
	array['Run your own business in Malta','English-speaking EU member','Mediterranean lifestyle','Schengen Area travel','Favourable tax environment'],
	NULL,
	NULL,
	1200.00,
	'EUR',
	14000.00,
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
	330.00,
	'EUR',
	array[]::text[],
	'https://jobsplus.gov.mt/employers-en-gb/employing-people/single-permit',
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
	'Malta Visa',
	(select id from countries where name = 'Malta'),
	'family',
	'Malta''s Permanent Residence Programme (MPRP) grants non-EU investors permanent residency through a qualifying property purchase/rental and government contribution, offering Schengen Area access.',
	array['EU permanent residency','Schengen Area travel','Stable regulatory environment','English-speaking country','Family inclusion'],
	NULL,
	NULL,
	0.00,
	'EUR',
	500000.00,
	'EUR',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	120,
	12,
	false,
	true,
	NULL,
	50000.00,
	'EUR',
	array[]::text[],
	'https://residencymalta.gov.mt/',
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
	'Turkey Visa',
	(select id from countries where name = 'Turkey'),
	'work',
	'Turkey''s Digital Nomad Visa launched in April 2024, allowing remote workers aged 21-55 from 36 eligible countries to live in Turkey for up to one year while working for foreign employers or as self-employed professionals.',
	array['Live and work remotely in Turkey','Tax-free income for stays under 183 days','Low cost of living','Rich culture and history','Family members can apply for dependent permits'],
	NULL,
	55,
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
	false,
	NULL,
	150.00,
	'USD',
	array[]::text[],
	'https://www.goturkiye.com/digital-nomad-visa',
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
	'Turkey Visa',
	(select id from countries where name = 'Turkey'),
	'work',
	'Turkey''s family residence permit allows non-Turkish spouses and minor children of Turkish citizens or holders of valid Turkish residence permits to join them for long-term residence in Turkey.',
	array['Family unity in Turkey','Right to work after switching permit','Low cost of living','Rich culture and history','Strategic location bridging Europe and Asia'],
	NULL,
	NULL,
	1200.00,
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
	120.00,
	'USD',
	array[]::text[],
	'https://www.goc.gov.tr/aile-ikamet-izni',
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
	'Turkey Visa',
	(select id from countries where name = 'Turkey'),
	'student',
	'Turkey''s student residence permit for non-Turkish nationals enrolled at a Turkish university or higher education institution, granting them the right to live in Turkey for the duration of their studies.',
	array['Study in Turkey','Affordable tuition fees','Rich cultural experience','Schengen-adjacent location','Part-time work option with work permit'],
	NULL,
	NULL,
	0.00,
	'USD',
	3000.00,
	'USD',
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
	80.00,
	'USD',
	array[]::text[],
	'https://www.goc.gov.tr/ogrenci-ikamet-izni',
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
	'Poland Visa',
	(select id from countries where name = 'Poland'),
	'work',
	'Poland''s family reunification visa allows non-EU spouses and minor children of legal Polish residents to join them in Poland, provided the sponsor meets accommodation and income requirements.',
	array['Family unity in Poland','Right to work','Affordable cost of living','Central European location','Path to permanent residency'],
	NULL,
	NULL,
	1500.00,
	'PLN',
	0.00,
	'PLN',
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
	80.00,
	'PLN',
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
	'Poland Visa',
	(select id from countries where name = 'Poland'),
	'student',
	'Poland''s student visa and residence permit for non-EU nationals enrolled in a full-time study programme at a Polish university or accredited educational institution.',
	array['Study at Polish universities','Affordable tuition and living costs','Central European location','Part-time work permitted','Schengen Area travel'],
	NULL,
	NULL,
	0.00,
	'PLN',
	3600.00,
	'PLN',
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
	80.00,
	'PLN',
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
	'Cyprus Visa',
	(select id from countries where name = 'Cyprus'),
	'family',
	'Cyprus''s family reunification permit allows non-EU spouses and dependent children of legal Cypriot residents to join them for long-term residence in Cyprus.',
	array['Family unity in Cyprus','EU member state','Mediterranean climate','English widely spoken','Schengen Area adjacent travel'],
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
	60,
	12,
	false,
	true,
	NULL,
	173.00,
	'EUR',
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
	'Cyprus Visa',
	(select id from countries where name = 'Cyprus'),
	'student',
	'Cyprus''s student visa for non-EU nationals enrolled at a Cypriot university or accredited higher education institution for a full-time programme lasting more than 90 days.',
	array['Study in English-speaking EU country','Affordable tuition fees','Mediterranean climate','Part-time work permitted','European qualifications'],
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
	173.00,
	'EUR',
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
	'Cyprus Visa',
	(select id from countries where name = 'Cyprus'),
	'other',
	'Cyprus''s Category F permanent residence permit allows non-EU nationals with sufficient independent annual income (not earned in Cyprus) to retire or live in Cyprus indefinitely.',
	array['EU permanent residency','Mediterranean climate','Low tax environment','English widely spoken','High quality healthcare'],
	NULL,
	NULL,
	30000.00,
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
	540.00,
	'EUR',
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
	'The UK Graduate (UK)',
	(select id from countries where name = 'United Kingdom'),
	'student',
	'The UK Graduate Visa allows international students who have completed a degree at a UK university to remain in the UK for 2 years (3 years for PhD graduates) to work or look for work in any occupation.',
	array['Stay in the UK after graduating','Work in any job at any salary','No employer sponsorship required','Switch to Skilled Worker Visa','Access to the NHS'],
	NULL,
	NULL,
	0.00,
	'GBP',
	0.00,
	'GBP',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	false,
	21,
	24,
	false,
	false,
	NULL,
	836.00,
	'GBP',
	array[]::text[],
	'https://www.gov.uk/graduate-visa',
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
	'The UK Skilled (UK)',
	(select id from countries where name = 'United Kingdom'),
	'work',
	'The UK Skilled Worker Visa allows non-UK nationals with a job offer from a licensed UK employer in an eligible occupation to live and work in the UK for up to 5 years.',
	array['Live and work in the UK','Access to the NHS','Bring dependants','Path to settlement (ILR)','Travel in and out of the UK'],
	NULL,
	NULL,
	38700.00,
	'GBP',
	0.00,
	'GBP',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	true,
	true,
	21,
	60,
	false,
	true,
	NULL,
	1480.00,
	'GBP',
	array[]::text[],
	'https://www.gov.uk/skilled-worker-visa',
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
	'The UK Global (UK)',
	(select id from countries where name = 'United Kingdom'),
	'work',
	'The UK Global Talent Visa is for leaders or potential leaders in academia, research, arts, culture, or digital technology. No job offer is required; applicants need endorsement from a designated body.',
	array['No employer sponsorship required','Bring dependants','Fast track to ILR (3 years)','Access to the NHS','Work flexibly across organisations'],
	NULL,
	NULL,
	0.00,
	'GBP',
	0.00,
	'GBP',
	array['Research','Technology','Arts','Culture','Academia'],
	array[]::text[],
	array[]::text[],
	true,
	true,
	21,
	60,
	false,
	true,
	NULL,
	748.00,
	'GBP',
	array[]::text[],
	'https://www.gov.uk/global-talent',
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
	'The UK Short-term (UK)',
	(select id from countries where name = 'United Kingdom'),
	'other',
	'The UK Short-term Study Visa allows non-UK nationals to study an English language course in the UK for up to 6 months (or 11 months if the course is at an accredited institution).',
	array['Study English in the UK','Short flexible programme','No CAS required for English courses','Access to British culture','Pathway to further UK study'],
	NULL,
	NULL,
	0.00,
	'GBP',
	1015.00,
	'GBP',
	array[]::text[],
	array[]::text[],
	array[]::text[],
	false,
	false,
	21,
	6,
	false,
	false,
	NULL,
	215.00,
	'GBP',
	array[]::text[],
	'https://www.gov.uk/study-visit-visa',
	NULL
);

-- Successfully imported 111 visa records


-- Ensure all service types exist
begin;
insert into service_types (id, name, icon, tagline, description) values
('visa_application', 'Visa Application', 'file-text', 'Full application support', 'Complete end-to-end assistance with your visa application.'),
('legal_consultation', 'Legal Consultation', 'scale', 'Expert legal advice', 'Consult with certified immigration lawyers.'),
('relocation_package', 'Relocation', 'home', 'Move with ease', 'Housing, banking, and settlement assistance.'),
('insurance', 'Insurance', 'shield', 'Safety first', 'Health and travel insurance options.'),
('consultation', 'Consultation', 'users', 'Expert advice', 'One-on-one sessions with experts.'),
('tax_planning', 'Tax Planning', 'calculator', 'Optimize taxes', 'Financial and tax residency planning.'),
('document_preparation', 'Document Prep', 'file-text', 'Paperwork sorted', 'Assistance with gathering and formatting documents.'),
('document_translation', 'Document Translation', 'file-text', 'Professional translation', 'Certified document translation for immigration purposes.')
on conflict (id) do nothing;

-- Seed Providers
-- Using explicit UUIDs to link services
insert into providers (id, company_name, description, provider_type, countries_served, languages, rating, review_count, verified, response_time_hours, contact_email, website, status)
values
('11111111-1111-1111-1111-111111111111', 'Global Visa Solutions', 'Expert immigration consultants with 15+ years of experience helping clients navigate complex visa processes across Europe and beyond.', 'agency', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia')), array['English','Portuguese','Spanish'], 
	4.9, 234, true, 4, 'info@globalvisasolutions.com', 'https://globalvisasolutions.com', 'active'),
('22222222-2222-2222-2222-222222222222', 'Expat Relocations', 'Full-service relocation company helping expats settle into their new home. From finding accommodation to setting up utilities.', 'consultancy', 
	array(select id from countries where name in ('Portugal','Spain','Thailand','Mexico')), array['English','Spanish','Thai'], 
	4.7, 156, true, 6, 'hello@expatrelocations.com', 'https://expatrelocations.com', 'active'),
('33333333-3333-3333-3333-333333333333', 'LegalDocs Translation', 'Certified document translation services for immigration purposes. Official translations accepted by embassies worldwide.', 'agency', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Thailand','Mexico')), array['English','Portuguese','Spanish','German','Thai'], 
	4.8, 421, true, 2, 'translate@legaldocs.com', 'https://legaldocs-translation.com', 'active'),
('44444444-4444-4444-4444-444444444444', 'International Tax Advisors', 'Specialized tax planning for digital nomads and expats. Optimize your tax situation legally across multiple jurisdictions.', 'consultancy', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia')), array['English','German'], 
	4.6, 89, true, 12, 'consult@internationaltax.com', 'https://internationaltaxadvisors.com', 'active')
on conflict (id) do nothing;

-- Seed Services
insert into services (provider_id, title, description, service_type, applicable_countries, price_usd, price_type, delivery_days, includes, requirements, image_url, active)
values
-- Global Visa Solutions Services
('11111111-1111-1111-1111-111111111111', 'Portugal Digital Nomad Visa Application', 'Complete end-to-end assistance with your Portugal Digital Nomad Visa application.', 'visa_application', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark','Sweden','Finland','Norway','Cyprus')), 1500, 'fixed', 45, 
	array['Document review and preparation','Application form completion','Embassy appointment scheduling','Interview preparation','Follow-up with authorities','Status updates'], 
	array['Valid passport','Proof of income documentation','Employment contract or business registration'], '', true),
('11111111-1111-1111-1111-111111111111', 'Spain Digital Nomad Visa Package', 'Expert guidance through Spain''s Digital Nomad Visa process with our experienced immigration team.', 'visa_application', 
	array(select id from countries where name in ('Spain','Portugal','Germany','Estonia','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Denmark','Sweden','Finland','Norway','Cyprus')), 1200, 'fixed', 30, 
	array['Full application preparation','Document verification','NIE number assistance','Embassy liaison','Post-arrival registration support'], 
	array['Passport valid 6+ months','Remote work contract','Bank statements (6 months)'], '', true),

-- Expat Relocations Services
('22222222-2222-2222-2222-222222222222', 'Portugal Relocation Package', 'Comprehensive relocation support to make your move to Portugal smooth and stress-free.', 'relocation_package', 
	array(select id from countries where name in ('Portugal','Spain','Thailand','Mexico','Croatia','Greece','Italy','Cyprus','Malta','Turkey','Vietnam','Indonesia')), 2500, 'fixed', 30, 
	array['Accommodation search (3 options)','NIF number application','Bank account setup assistance','Utility connections','Welcome orientation call','Local area guide'], 
	array['Visa approval or in process','Budget and preferences form'], '', true),
('22222222-2222-2222-2222-222222222222', 'Thailand Soft Landing Package', 'Everything you need to start your new life in Thailand, from airport pickup to settled in your new home.', 'relocation_package', 
	array(select id from countries where name in ('Thailand','Mexico','Portugal','Spain','Vietnam','Indonesia','Malaysia','India','Georgia','Turkey')), 1800, 'fixed', 14, 
	array['Airport pickup','Temporary accommodation (7 nights)','Thai SIM card setup','Bank account assistance','Apartment hunting tour','Local orientation'], 
	array['Valid visa','Arrival details'], '', true),

-- LegalDocs Translation Services
('33333333-3333-3333-3333-333333333333', 'Document Translation - Standard', 'Certified translation of legal documents for immigration purposes. Accepted by embassies worldwide.', 'document_translation', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Thailand','Mexico','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Turkey','Malta','Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Vietnam','Indonesia','Malaysia','India','Georgia','Morocco','Egypt','South Africa','Chile','Argentina','Brazil','Peru','China','Japan','South Korea','Singapore','Hong Kong')), 30, 'fixed', 3, 
	array['Certified translation','Official stamp and signature','Digital and physical copies','Embassy-ready format'], 
	array['Original document scan','Target language specification'], '', true),
('33333333-3333-3333-3333-333333333333', 'Apostille + Translation Bundle', 'Complete apostille and certified translation service for international document authentication.', 'document_preparation', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta','Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia','Latvia','Lithuania')), 150, 'fixed', 10, 
	array['Document apostille','Certified translation','Notarization if required','Express courier delivery'], 
	array['Original documents','Document type list'], '', true),

-- International Tax Advisors Services
('44444444-4444-4444-4444-444444444444', 'Digital Nomad Tax Consultation', 'One-hour consultation to understand your tax obligations as a digital nomad and optimize your tax situation.', 'consultation', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta','Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia','Latvia','Lithuania','Thailand','Mexico','Vietnam','Indonesia','Malaysia','United Arab Emirates','Singapore','Georgia','Turkey','Argentina','Brazil','Chile')), 200, 'fixed', 1, 
	array['1-hour video consultation','Tax residency analysis','Optimization recommendations','Summary report','30-day email follow-up'], 
	array['Current tax residency info','Income sources overview'], '', true),
('44444444-4444-4444-4444-444444444444', 'Portugal NHR Tax Regime Setup', 'Complete assistance with Portugal''s Non-Habitual Resident tax regime application for up to 10 years of tax benefits.', 'tax_planning', 
	array(select id from countries where name in ('Portugal','Spain','Germany','Estonia','Netherlands','France','Italy','Switzerland','Ireland','Greece','Belgium','Poland','Austria','Malta','Denmark','Sweden','Finland','Norway','Cyprus','Hungary','Croatia','Czechia','Slovakia','Bulgaria','Romania','Luxembourg','Slovenia','Latvia','Lithuania','United Kingdom','Canada','Australia','New Zealand','United States','Japan','South Korea','Singapore','Hong Kong','United Arab Emirates','Brazil','Argentina','Chile','South Africa','Israel')), 800, 'fixed', 21, 
	array['NHR eligibility assessment','Application preparation','Portuguese tax registration','Tax authority liaison','Annual reporting guidance'], 
	array['Portugal residency permit','Previous 5 years tax history'], '', true);

-- ============================================================
-- Seed provider join codes (deterministic so seed is idempotent)
-- ============================================================
update providers set join_code = 'GVSA0001' where id = '11111111-1111-1111-1111-111111111111' and (join_code is null or join_code = 'GVSA0001');

update providers set join_code = 'EXPA0002' where id = '22222222-2222-2222-2222-222222222222' and (join_code is null or join_code = 'EXPA0002');
update providers set join_code = 'LGDA0003' where id = '33333333-3333-3333-3333-333333333333' and (join_code is null or join_code = 'LGDA0003');

update providers set join_code = 'ITXA0004' where id = '44444444-4444-4444-4444-444444444444' and (join_code is null or join_code = 'ITXA0004');

-- ============================================================
-- Seed test provider user
-- Email: provider@test.com  Password: provider123
-- Owns Global Visa Solutions
-- ============================================================
-- insert into auth.users (
--   id,
--   instance_id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_user_meta_data,
--   created_at,
--   updated_at,
--   aud,
--   role
-- )
-- values (
--   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--   '00000000-0000-0000-0000-000000000000',
--   'provider@test.com',
--   crypt('provider123', gen_salt('bf')),
--   now(),
--   '{"role": "provider"}'::jsonb,
--   now(),
--   now(),
--   'authenticated',
--   'authenticated'
-- )
-- on conflict (id) do nothing;

-- -- Profile for test provider user
-- insert into public.profiles (id, role, provider_id)
-- values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'provider', '11111111-1111-1111-1111-111111111111')
-- on conflict (id) do update set role = 'provider', provider_id = '11111111-1111-1111-1111-111111111111';

-- -- Membership: test user owns Global Visa Solutions
-- insert into public.provider_members (user_id, provider_id, role)
-- values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner')
-- on conflict (user_id, provider_id) do nothing;

-- -- Seed Resources
-- insert into resources (title, type, excerpt, content, author, cover_image, tags, reading_time_minutes, published, featured)
-- values
-- (
--     'Moving to Spain? Here is what you need to know',
--     'guide',
--     'Spain has long been a favourite destination for expats, families, and professionals seeking a high quality of life in the heart of Europe. With vibrant cities, rich cultural heritage, a country that blends old-world elegance with modern convenience.',
--     E'Spain has long been a **favourite destination for expats**, families, and professionals seeking a high quality of life in the heart of Europe. With vibrant cities, rich cultural heritage, a country that blends old-world elegance with modern convenience. Whether you dream of Barcelona''s cosmopolitan energy, Madrid''s cultural richness, or Valencia''s perfect seaside lifestyle, Spain offers something for everyone.\n\nThis guide covers everything you need to know about moving to Spain, from visa options to finding a home and settling in.',
--     'MyFutureAbroad Team',
--     'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&q=80',
--     array['Spain','Relocation Guide','Europe','Expat Life','Cost of Living'],
--     12,
--     true,
--     true
-- )
-- on conflict do nothing;

-- Populate normalized service_countries table from any applicable_countries arrays
insert into service_countries (service_id, country_id)
select id, unnest(applicable_countries)
from services
where applicable_countries is not null
on conflict do nothing;
