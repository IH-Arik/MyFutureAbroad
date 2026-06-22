-- ============================================================
-- Basic visa entries for the 6 new countries
-- Run AFTER NEW_countries_batch1.sql
-- ============================================================

INSERT INTO visas (
  name, country_id, visa_type, description, benefits,
  min_income, min_income_currency,
  requires_health_insurance, requires_clean_criminal_record,
  processing_time_days, validity_months, renewable,
  has_path_to_residency, path_to_residency_description,
  application_fee_usd, application_fee_currency,
  required_documents, official_link
)
VALUES

-- ── BAHRAIN ──────────────────────────────────────────────────
(
  'Bahrain Work Visa',
  (SELECT id FROM countries WHERE name = 'Bahrain'),
  'work',
  'Standard employment visa for foreign nationals sponsored by a Bahraini employer. Allows residence and work for the duration of the employment contract.',
  ARRAY['Legal right to work', 'Family sponsorship eligible', 'Access to public services', 'Renewable annually'],
  NULL, NULL, false, true, 14, 24, true, true,
  'Long-term residents may apply for permanent residency after 10 years of continuous legal stay.',
  100, 'BHD',
  ARRAY['Valid passport (6+ months validity)', 'Employer sponsorship letter', 'Medical fitness certificate', 'Police clearance certificate', 'Passport photos'],
  'https://www.lmra.bh/portal/en/home'
),
(
  'Bahrain Investor Visa',
  (SELECT id FROM countries WHERE name = 'Bahrain'),
  'investor',
  'Residence permit for foreign investors establishing or investing in a Bahraini business. Managed through the Bahrain Economic Development Board.',
  ARRAY['Business ownership rights', 'No personal income tax', 'Family sponsorship', 'Gateway to GCC markets', 'Renewable residence'],
  50000, 'USD', false, true, 30, 24, true, true,
  'Investors with sustained business operations may apply for permanent residency.',
  500, 'USD',
  ARRAY['Business registration documents', 'Proof of investment', 'Bank statements', 'Passport', 'Business plan'],
  'https://www.bahrainedb.com'
),

-- ── BANGLADESH ───────────────────────────────────────────────
(
  'Bangladesh Employment Visa',
  (SELECT id FROM countries WHERE name = 'Bangladesh'),
  'work',
  'Employment visa for foreign nationals with a job offer from a Bangladeshi company. Requires employer sponsorship and government clearance.',
  ARRAY['Legal right to work', 'Multiple entry permitted', 'Renewable annually', 'Access to banking services'],
  NULL, NULL, false, true, 30, 12, true, false, NULL,
  150, 'USD',
  ARRAY['Valid passport', 'Employer invitation letter', 'Work permit from BIDA', 'Medical certificate', 'Police clearance', 'Educational certificates'],
  'https://www.dip.gov.bd'
),
(
  'Bangladesh Tourist Visa on Arrival',
  (SELECT id FROM countries WHERE name = 'Bangladesh'),
  'tourist',
  'Visa on arrival available for nationals of eligible countries at international airports. Valid for short stays and tourism purposes.',
  ARRAY['Available at major airports', 'Quick processing', 'Suitable for short visits', 'Extendable in-country'],
  NULL, NULL, false, false, 1, 1, false, false, NULL,
  50, 'USD',
  ARRAY['Valid passport (6+ months)', 'Return flight ticket', 'Hotel booking', 'Sufficient funds proof'],
  'https://www.dip.gov.bd'
),

-- ── BARBADOS ─────────────────────────────────────────────────
(
  'Barbados Welcome Stamp',
  (SELECT id FROM countries WHERE name = 'Barbados'),
  'digital_nomad',
  'The Barbados Welcome Stamp is a 12-month renewable remote work visa for individuals who can work remotely for an employer outside Barbados.',
  ARRAY['Live and work remotely for 12 months', 'Renewable for another 12 months', 'Family members included', 'Access to beaches and Caribbean lifestyle', 'No Barbados income tax on foreign-sourced income'],
  50000, 'USD', true, false, 7, 12, true, false, NULL,
  2000, 'USD',
  ARRAY['Passport', 'Proof of employment or self-employment outside Barbados', 'Proof of income ($50,000+ per year)', 'Health insurance', 'Police certificate'],
  'https://www.visitbarbados.org/barbados-welcome-stamp'
),
(
  'Barbados Retirement Visa',
  (SELECT id FROM countries WHERE name = 'Barbados'),
  'retirement',
  'Retirement residence permit for individuals who wish to retire in Barbados with proven passive income.',
  ARRAY['Live in Barbados year-round', 'Access to quality healthcare', 'English-speaking environment', 'Stable political climate'],
  2000, 'USD', true, true, 30, 12, true, true,
  'Long-term retirees may apply for permanent residency after extended continuous stay.',
  750, 'USD',
  ARRAY['Passport', 'Proof of pension or retirement income', 'Health insurance', 'Police clearance', 'Medical certificate'],
  'https://immigration.gov.bb'
),

-- ── CAMBODIA ─────────────────────────────────────────────────
(
  'Cambodia E-Class Visa (Tourist)',
  (SELECT id FROM countries WHERE name = 'Cambodia'),
  'tourist',
  'The E-class tourist visa allows entry for tourism and can be extended multiple times inside Cambodia, making it popular with long-stay visitors and expats.',
  ARRAY['Extendable up to 12 months in-country', 'Easy to obtain online or on arrival', 'Low cost', 'Multiple entry possible with extensions'],
  NULL, NULL, false, false, 3, 1, true, false, NULL,
  30, 'USD',
  ARRAY['Valid passport (6+ months)', 'Passport photo', 'Return or onward ticket', 'Hotel booking (recommended)'],
  'https://evisa.gov.kh'
),
(
  'Cambodia Ordinary Resident Visa',
  (SELECT id FROM countries WHERE name = 'Cambodia'),
  'retirement',
  'Long-term resident visa for retirees and self-sufficient individuals wanting to live in Cambodia. One of the most flexible and affordable expat visas in Southeast Asia.',
  ARRAY['12-month stay', 'Renewable indefinitely', 'Very low cost of living', 'No minimum income requirement', 'USD-based economy'],
  NULL, NULL, false, false, 7, 12, true, false, NULL,
  290, 'USD',
  ARRAY['Passport', 'Passport photo', 'Bank statement or proof of funds', 'Application form'],
  'https://www.mfaic.gov.kh'
),

-- ── COLOMBIA ─────────────────────────────────────────────────
(
  'Colombia Digital Nomad Visa',
  (SELECT id FROM countries WHERE name = 'Colombia'),
  'digital_nomad',
  'Colombia''s digital nomad visa (Nómada Digital) allows remote workers to live in Colombia for up to 2 years while working for foreign employers or clients.',
  ARRAY['2-year renewable visa', 'Work legally as a remote worker', 'Path to residency', 'Affordable cost of living', 'Vibrant expat community'],
  3000, 'USD', true, true, 30, 24, true, true,
  'After 5 years of continuous legal residence, you may apply for permanent residency.',
  52, 'USD',
  ARRAY['Passport', 'Employment or client contract', 'Proof of monthly income ($3,000+)', 'Health insurance', 'Bank statements (3 months)', 'Police clearance'],
  'https://www.cancilleria.gov.co'
),
(
  'Colombia Pensionado Visa',
  (SELECT id FROM countries WHERE name = 'Colombia'),
  'retirement',
  'Retirement visa for those receiving a pension or regular passive income of at least 3x the Colombian minimum wage (~$650/month).',
  ARRAY['Live in Colombia indefinitely', 'Renewable annually', 'Low cost of living', 'Warm climate year-round', 'Path to permanent residency'],
  650, 'USD', true, true, 30, 12, true, true,
  'After 5 years as a visa holder, eligible to apply for permanent residency (Resident Visa).',
  52, 'USD',
  ARRAY['Passport', 'Proof of pension or passive income', 'Bank statements', 'Health insurance in Colombia', 'Police clearance'],
  'https://www.cancilleria.gov.co'
),

-- ── COSTA RICA ───────────────────────────────────────────────
(
  'Costa Rica Pensionado Visa',
  (SELECT id FROM countries WHERE name = 'Costa Rica'),
  'retirement',
  'The Pensionado visa is ideal for retirees who can prove a monthly pension income of at least $1,000. One of the most popular retirement visas in Latin America.',
  ARRAY['Live in Costa Rica legally', 'Import one vehicle and household goods duty-free', 'Healthcare system access (CAJA)', '12% discount on utilities and transportation', 'Warm climate and nature'],
  1000, 'USD', false, true, 90, 24, true, true,
  'After 3 years as a Pensionado, eligible to apply for permanent residency.',
  100, 'USD',
  ARRAY['Passport', 'Proof of monthly pension ($1,000+)', 'Birth certificate (apostilled)', 'Police clearance (apostilled)', 'Marriage certificate if applicable', 'Passport photos'],
  'https://migracion.go.cr'
),
(
  'Costa Rica Rentista Visa',
  (SELECT id FROM countries WHERE name = 'Costa Rica'),
  'investor',
  'For non-retirees who can demonstrate a stable passive income of $2,500/month from investments, rental income, or other sources.',
  ARRAY['Legal long-term residency', 'Bring household goods duty-free', 'Renewable every 2 years', 'Path to permanent residency after 3 years', 'Beautiful natural environment'],
  2500, 'USD', false, true, 90, 24, true, true,
  'Eligible for permanent residency after 3 years of continuous legal residence.',
  100, 'USD',
  ARRAY['Passport', 'Proof of $2,500/month passive income', 'Bank statements', 'Police clearance (apostilled)', 'Birth certificate (apostilled)', 'Passport photos'],
  'https://migracion.go.cr'
)
ON CONFLICT DO NOTHING;

-- ── DOMINICAN REPUBLIC ──────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Dominican Republic Rentista Visa',
  (SELECT id FROM countries WHERE name = 'Dominican Republic'),
  'retirement',
  'Residency for those with a regular passive income from investments, pensions, or other sources. One of the most accessible residency programs in the Caribbean.',
  ARRAY['Legal residency', 'Low income threshold ($1,500/month)', 'Path to permanent residency', 'Tax incentives for retirees', 'Warm Caribbean climate'],
  1500, 'USD', false, true, 45, 12, true, true,
  'After 3 years of legal residency, eligible to apply for permanent residency.',
  200, 'USD',
  ARRAY['Passport', 'Proof of $1,500/month income', 'Birth certificate (apostilled)', 'Police clearance (apostilled)', 'Medical certificate', 'Passport photos'],
  'https://migracion.gob.do'
),
(
  'Dominican Republic Retirement Visa',
  (SELECT id FROM countries WHERE name = 'Dominican Republic'),
  'retirement',
  'Special retirement residency (Law 171-07) offering significant tax benefits to foreign retirees including exemption from import duties on personal goods.',
  ARRAY['Import vehicle duty-free', 'Import household goods duty-free', 'Property purchase assistance', 'Tax exemptions', 'Year-round warm weather'],
  1500, 'USD', false, true, 45, 12, true, true,
  'Pathway to permanent residency after qualifying period.',
  200, 'USD',
  ARRAY['Passport', 'Proof of pension income ($1,500+/month)', 'Birth certificate', 'Police clearance', 'Medical exam', 'Passport photos'],
  'https://migracion.gob.do'
) ON CONFLICT DO NOTHING;

-- ── ECUADOR ──────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Ecuador Retirement Visa',
  (SELECT id FROM countries WHERE name = 'Ecuador'),
  'retirement',
  'Ecuador''s retirement (Jubilado) visa requires just $800/month in pension income — one of the world''s lowest thresholds. Uses US dollars, making budgeting straightforward.',
  ARRAY['Very low income requirement', 'USD economy — no currency risk', 'Galápagos access', 'Excellent climate in Cuenca', 'Import one vehicle duty-free'],
  800, 'USD', false, true, 30, 24, true, true,
  'After 3 years as a temporary resident, eligible for permanent residency.',
  450, 'USD',
  ARRAY['Passport', 'Proof of pension income ($800+/month)', 'Criminal background check (apostilled)', 'Medical certificate', 'Passport photos'],
  'https://www.cancilleria.gob.ec'
),
(
  'Ecuador Digital Nomad Visa',
  (SELECT id FROM countries WHERE name = 'Ecuador'),
  'digital_nomad',
  'Temporary residency for remote workers with foreign-sourced income. Ecuador uses the US dollar, making financial planning easy for North American and European nomads.',
  ARRAY['Legal residency for 2 years', 'USD economy', 'Affordable cost of living', 'Four distinct ecosystems to explore', 'Path to permanent residency'],
  1350, 'USD', true, true, 30, 24, true, true,
  'After 3 years, eligible for permanent residency.',
  450, 'USD',
  ARRAY['Passport', 'Proof of remote income ($1,350+/month)', 'Health insurance', 'Criminal background check (apostilled)', 'Bank statements'],
  'https://www.cancilleria.gob.ec'
) ON CONFLICT DO NOTHING;

-- ── FIJI ─────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Fiji Long-Stay Permit',
  (SELECT id FROM countries WHERE name = 'Fiji'),
  'retirement',
  'Fiji''s long-stay permit allows retirees and investors to reside in Fiji for extended periods. Ideal for those seeking a peaceful Pacific island lifestyle.',
  ARRAY['Peaceful island lifestyle', '330 islands to explore', 'English-speaking', 'Warm tropical climate', 'World-class diving and snorkeling'],
  2000, 'USD', true, true, 30, 12, true, false, NULL,
  400, 'USD',
  ARRAY['Passport', 'Proof of funds or income', 'Medical certificate', 'Police clearance', 'Passport photos'],
  'https://www.fiji.gov.fj'
) ON CONFLICT DO NOTHING;

-- ── GHANA ─────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Ghana Work Permit',
  (SELECT id FROM countries WHERE name = 'Ghana'),
  'work',
  'Employment permit for foreign nationals working with Ghanaian companies. Ghana is West Africa''s most stable and business-friendly destination for expats.',
  ARRAY['Legal right to work', 'English-speaking environment', 'Gateway to West Africa', 'Growing tech ecosystem', 'Rich cultural heritage'],
  NULL, NULL, false, true, 30, 12, true, false, NULL,
  150, 'USD',
  ARRAY['Passport', 'Employment contract', 'Educational certificates', 'Medical certificate', 'Police clearance'],
  'https://www.gipc.gov.gh'
),
(
  'Ghana Investor Visa',
  (SELECT id FROM countries WHERE name = 'Ghana'),
  'investor',
  'Residence permit for foreign investors registering a business with the Ghana Investment Promotion Centre (GIPC). Minimum investment thresholds apply.',
  ARRAY['Business ownership rights', 'Access to West African markets', 'English-speaking country', 'Renewable residence', 'Stable democracy'],
  NULL, NULL, false, true, 45, 24, true, true,
  'Investors may apply for permanent residence after sustained business operations.',
  1000, 'USD',
  ARRAY['Passport', 'GIPC registration certificate', 'Business registration', 'Proof of investment', 'Bank statements'],
  'https://www.gipc.gov.gh'
) ON CONFLICT DO NOTHING;

-- ── GUYANA ────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Guyana Work Permit',
  (SELECT id FROM countries WHERE name = 'Guyana'),
  'work',
  'Work permit for foreign nationals employed in Guyana. The booming oil sector is driving high demand for skilled workers in engineering, finance, and energy.',
  ARRAY['Legal right to work', 'English-speaking country', 'Booming oil economy', 'High skilled worker demand', 'Pristine nature and wildlife'],
  NULL, NULL, false, true, 21, 12, true, false, NULL,
  100, 'USD',
  ARRAY['Passport', 'Job offer letter', 'Educational certificates', 'Medical certificate', 'Police clearance'],
  'https://www.minfor.gov.gy'
) ON CONFLICT DO NOTHING;

-- ── HONDURAS ──────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Honduras Retirement Visa',
  (SELECT id FROM countries WHERE name = 'Honduras'),
  'retirement',
  'Honduras residency for retirees with a pension or regular income. One of the most affordable retirement destinations in Central America with a Bay Islands expat community.',
  ARRAY['Very low cost of living', 'Bay Islands diving and beaches', 'Year-round warm climate', 'Tax exemptions on imported goods', 'Renewable residence'],
  1500, 'USD', false, true, 30, 12, true, true,
  'After 3 years of legal residency, eligible to apply for permanent residency.',
  200, 'USD',
  ARRAY['Passport', 'Proof of income ($1,500+/month)', 'Birth certificate (apostilled)', 'Police clearance (apostilled)', 'Medical certificate'],
  'https://www.migracion.gob.hn'
) ON CONFLICT DO NOTHING;

-- ── JAMAICA ───────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Jamaica Global Work or Holiday Permit',
  (SELECT id FROM countries WHERE name = 'Jamaica'),
  'digital_nomad',
  'Jamaica''s remote work visa allows digital nomads to live and work remotely from the island for up to 6 months. Perfect for those wanting Caribbean island life.',
  ARRAY['Live in Jamaica for up to 6 months', 'English-speaking island', 'Beautiful beaches and mountains', 'Vibrant culture and music scene', 'No Jamaica tax on foreign income'],
  NULL, NULL, true, false, 7, 6, false, false, NULL,
  0, 'USD',
  ARRAY['Passport', 'Proof of employment or self-employment outside Jamaica', 'Health insurance', 'Return flight ticket', 'Hotel or accommodation booking'],
  'https://www.visitjamaica.com/global-work-holiday'
) ON CONFLICT DO NOTHING;

-- ── JORDAN ────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Jordan Work Permit',
  (SELECT id FROM countries WHERE name = 'Jordan'),
  'work',
  'Employment permit for foreign workers in Jordan, typically sponsored by a Jordanian employer. Jordan is a stable regional hub for NGOs, diplomacy, and international business.',
  ARRAY['Regional stability', 'English widely spoken', 'Access to Middle East markets', 'Rich history and culture', 'World-class sites like Petra'],
  NULL, NULL, false, true, 21, 12, true, false, NULL,
  100, 'USD',
  ARRAY['Passport', 'Employment contract', 'Medical certificate', 'Police clearance', 'Educational certificates'],
  'https://www.mol.gov.jo'
),
(
  'Jordan Retirement Visa',
  (SELECT id FROM countries WHERE name = 'Jordan'),
  'retirement',
  'Jordan offers residency for retirees who can demonstrate regular income or savings. Amman is one of the Middle East''s most livable cities for expats.',
  ARRAY['Moderate cost of living', 'English widely spoken', 'Excellent healthcare', 'Warm climate', 'Safe and stable environment'],
  2000, 'USD', true, true, 30, 12, true, false, NULL,
  200, 'USD',
  ARRAY['Passport', 'Proof of retirement income or savings', 'Medical certificate', 'Police clearance', 'Passport photos'],
  'https://www.moi.gov.jo'
) ON CONFLICT DO NOTHING;

-- ── KAZAKHSTAN ────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Kazakhstan Work Visa',
  (SELECT id FROM countries WHERE name = 'Kazakhstan'),
  'work',
  'Kazakhstan work permit for foreign professionals. The country actively recruits skilled workers in oil & gas, technology, and finance.',
  ARRAY['Low cost of living', 'Growing economy', 'Strategic location', 'Modern capital city', 'Natural landscapes'],
  NULL, NULL, false, true, 30, 12, true, false, NULL,
  120, 'USD',
  ARRAY['Passport', 'Employment contract', 'Educational certificates', 'Medical certificate', 'Police clearance'],
  'https://www.gov.kz'
),
(
  'Kazakhstan Investor Visa',
  (SELECT id FROM countries WHERE name = 'Kazakhstan'),
  'investor',
  'Residence for foreign investors establishing businesses in Kazakhstan. Special Economic Zones offer significant tax incentives for qualifying investments.',
  ARRAY['Tax incentives in SEZs', 'Strategic Central Asian location', 'Growing consumer market', 'Modern business infrastructure', 'Renewable residence'],
  NULL, NULL, false, true, 45, 12, true, true,
  'After 5 years of legal residence, eligible for permanent residency.',
  500, 'USD',
  ARRAY['Passport', 'Business registration documents', 'Proof of investment', 'Bank statements', 'Business plan'],
  'https://www.invest.gov.kz'
) ON CONFLICT DO NOTHING;

-- ── KENYA ─────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Kenya Work Permit',
  (SELECT id FROM countries WHERE name = 'Kenya'),
  'work',
  'Class G work permit for foreign professionals employed by Kenyan companies. Nairobi is East Africa''s largest tech and business hub.',
  ARRAY['English-speaking country', 'Gateway to East Africa', 'Tech startup ecosystem', 'Safari and nature access', 'Renewable annually'],
  NULL, NULL, false, true, 30, 12, true, false, NULL,
  2000, 'USD',
  ARRAY['Passport', 'Employment contract', 'Educational certificates', 'Medical certificate', 'Police clearance', 'Passport photos'],
  'https://www.ecitizen.go.ke'
),
(
  'Kenya Digital Nomad Visa',
  (SELECT id FROM countries WHERE name = 'Kenya'),
  'digital_nomad',
  'Kenya launched a digital nomad work permit allowing remote workers to live in Kenya while working for foreign employers, valid for up to 2 years.',
  ARRAY['2-year permit', 'Nairobi tech community access', 'Safari and wildlife experiences', 'English-speaking country', 'East African travel base'],
  1000, 'USD', true, true, 14, 24, true, false, NULL,
  111, 'USD',
  ARRAY['Passport', 'Proof of remote employment', 'Proof of income', 'Health insurance', 'Police clearance'],
  'https://www.ecitizen.go.ke'
) ON CONFLICT DO NOTHING;

-- ── KYRGYZSTAN ────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Kyrgyzstan Tourist Visa (Visa-Free)',
  (SELECT id FROM countries WHERE name = 'Kyrgyzstan'),
  'tourist',
  'Citizens of 60+ countries can enter Kyrgyzstan visa-free for 30 days. Extensions available through OVIR. Ideal for budget travelers and digital nomads.',
  ARRAY['Free entry for 60+ nationalities', 'Extendable at OVIR office', 'Extremely low cost of living', 'World-class trekking', 'Authentic nomadic culture'],
  NULL, NULL, false, false, 1, 1, true, false, NULL,
  0, 'USD',
  ARRAY['Valid passport (6+ months)', 'Return ticket', 'Proof of funds'],
  'https://www.mfa.gov.kg'
) ON CONFLICT DO NOTHING;

-- ── KUWAIT ────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Kuwait Work Visa',
  (SELECT id FROM countries WHERE name = 'Kuwait'),
  'work',
  'Kuwait work visa for foreign nationals sponsored by a Kuwaiti employer. No income tax makes Kuwait employment packages very attractive. Residency tied to employment.',
  ARRAY['No personal income tax', 'High salary packages', 'Modern city amenities', 'Tax-free savings', 'Large expat community'],
  NULL, NULL, false, true, 30, 24, true, false, NULL,
  100, 'KWD',
  ARRAY['Passport', 'Employer sponsorship letter', 'Medical fitness certificate', 'Police clearance', 'Educational certificates', 'Passport photos'],
  'https://www.moi.gov.kw'
) ON CONFLICT DO NOTHING;

-- ── LAOS ──────────────────────────────────────────────────────
INSERT INTO visas (name, country_id, visa_type, description, benefits, min_income, min_income_currency, requires_health_insurance, requires_clean_criminal_record, processing_time_days, validity_months, renewable, has_path_to_residency, path_to_residency_description, application_fee_usd, application_fee_currency, required_documents, official_link)
VALUES
(
  'Laos Tourist e-Visa',
  (SELECT id FROM countries WHERE name = 'Laos'),
  'tourist',
  'Laos e-visa for tourism, available online prior to arrival. Valid for 30 days and extendable within the country. Gateway to the UNESCO-listed Luang Prabang.',
  ARRAY['Easy online application', 'Extendable in-country', 'Very low cost of living', 'Stunning cultural sites', 'Peaceful travel experience'],
  NULL, NULL, false, false, 3, 1, true, false, NULL,
  35, 'USD',
  ARRAY['Passport (6+ months validity)', 'Passport photo', 'Return ticket', 'Hotel booking confirmation'],
  'https://laoevisa.gov.la'
),
(
  'Laos Long-Term Visa (Business)',
  (SELECT id FROM countries WHERE name = 'Laos'),
  'investor',
  'Business visa for investors and entrepreneurs operating in Laos. The government is actively encouraging foreign investment, especially in tourism and renewable energy.',
  ARRAY['Long-term stay', 'Investment opportunities', 'Low operating costs', 'Access to Southeast Asian markets', 'Peaceful business environment'],
  NULL, NULL, false, true, 14, 12, true, false, NULL,
  100, 'USD',
  ARRAY['Passport', 'Business registration documents', 'Proof of investment', 'Medical certificate'],
  'https://www.investlaos.gov.la'
) ON CONFLICT DO NOTHING;
