-- Seed data for citizenship_requirements column
-- Format: { "category": { "icon": "icon_name", "desc": "markdown_description" } }

-- ICELAND
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Icelandic citizens automatically acquire Icelandic citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years of residence in Iceland, basic knowledge of Icelandic language and culture, no criminal record, financial stability.\n\n**Processing:** Applications reviewed by Ministry of Justice, typically 6-12 months."
  },
  "Spouse of Icelandic Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 3 years of marriage and 2 years continuous residence, with reduced language requirements."
  },
  "Birthright Citizenship": {
    "icon": "🏔️",
    "desc": "Children born in Iceland to at least one Icelandic parent acquire citizenship automatically."
  }
}' WHERE name = 'Iceland';

-- GERMANY
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "**One German parent:** Child acquires citizenship automatically at birth.\n\n**Two foreign parents:** Child can acquire if one parent has permanent residence for 8 years."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years lawful residence (5 years for spouses), basic German language (B1), integration test, no criminal record, financial independence.\n\n**Dual citizenship:** Generally not permitted but exceptions exist for children."
  },
  "Spouse of German Citizen": {
    "icon": "💍",
    "desc": "Spouses can naturalize after 3 years residence with 5-year total residency requirement, or 2 years if married before first residence."
  },
  "Birthright Citizenship": {
    "icon": "🏛️",
    "desc": "Limited jus soli: Only applicable to children of foreign residents under specific residency conditions."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Individuals with outstanding achievements in science, business, or culture may apply with reduced requirements."
  }
}' WHERE name = 'Germany';

-- PERU
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Peruvian citizens acquire citizenship automatically at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 2 years continuous residence, knowledge of Spanish language, good moral character, economic solvency.\n\n**For Latin Americans:** Residence requirement may be reduced. For Spanish citizens: 1 year residence."
  },
  "Birthright Citizenship": {
    "icon": "🏔️",
    "desc": "Children born in Peru to at least one Peruvian parent acquire citizenship. Foreign-born children of Peruvian parents can claim jus sanguinis."
  },
  "Spouse and Family": {
    "icon": "👨‍👩‍👧‍👦",
    "desc": "Spouses of Peruvian citizens may apply after 2 years of marriage and continuous residence."
  }
}' WHERE name = 'Peru';

-- CHILE
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Chilean citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (reduced for Latin Americans, Portuguese, Spanish), Spanish language ability, adherence to Chilean Constitution, good moral character.\n\n**Processing:** Application through Ministry of Interior, typically 6-12 months."
  },
  "Spouse Naturalization": {
    "icon": "💍",
    "desc": "Spouses of Chilean citizens may apply after 1 year of marriage with 5-year residence requirement reduced to 1 year."
  },
  "Birthright Citizenship": {
    "icon": "🏔️",
    "desc": "Children born in Chile to at least one Chilean parent acquire citizenship automatically."
  }
}' WHERE name = 'Chile';

-- MOROCCO
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Moroccan citizen fathers acquire citizenship automatically. Maternal descent requires father acknowledgment."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence, Moroccan language skills, renunciation of previous nationality, good moral character.\n\n**Special provisions:** Arabs, Amazighs (Berbers), and Muslims may have expedited processing."
  },
  "Spouse of Moroccan Citizen": {
    "icon": "💍",
    "desc": "Foreign spouses may apply after 2 years of marriage with reduced residence requirements."
  },
  "Birthright Citizenship": {
    "icon": "🏜️",
    "desc": "Limited jus soli: Children born in Morocco to unknown parents acquire Moroccan citizenship."
  }
}' WHERE name = 'Morocco';

-- INDONESIA
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Indonesian citizens automatically acquire Indonesian citizenship. Mixed marriages have special provisions for dual citizenship during childhood."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal continuous residence (3 years for retired foreigners, 1 year for investors), Indonesian language, good character, economic stability.\n\n**Processing:** Through Ministry of Law and Human Rights, 4-6 months."
  },
  "Special Category (Limited)": {
    "icon": "🌴",
    "desc": "Former Indonesian citizens and their descendants may apply with simplified procedures."
  },
  "Birthright Citizenship": {
    "icon": "🏝️",
    "desc": "Children born in Indonesia acquire citizenship if at least one parent is Indonesian or stateless."
  }
}' WHERE name = 'United Kingdom';

-- PORTUGAL
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Portuguese citizen parents acquire citizenship automatically. Ancestry up to 3 generations can claim based on descent."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years legal residence (6 years for Portuguese speakers, Lusophones, and EU/EFTA citizens), Portuguese language A2 level, integration tests.\n\n**Special:** Persons of Portuguese origin may qualify with reduced residence."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Spouses of Portuguese citizens may apply after 2 years marriage with reduced residence requirements."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU citizens have special naturalization privileges and may acquire citizenship after 4 years residence."
  }
}' WHERE name = 'Portugal';

-- SPAIN
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Spanish citizens acquire citizenship automatically at birth. Ancestry rights available for descendants of Spanish exiles."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years legal residence (5 years for refugees, 2 years for nationals of Latin American, Portuguese-speaking, Andorra, Philippines, Equatorial Guinea countries), Spanish language, cultural integration.\n\n**Processing:** Ministry of Inclusion, Seguridad Social y Migraciones, 12-24 months."
  },
  "Spouse Naturalization": {
    "icon": "💍",
    "desc": "Spouses may apply after 1 year marriage. If spouse is Spanish, residence requirement reduced to 1 year."
  },
  "Special Recognition": {
    "icon": "⭐",
    "desc": "Historical descendants of Spanish exiles and persons of Spanish origin may claim citizenship through simplified process."
  }
}' WHERE name = 'Spain';

-- ESTONIA
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Estonian citizen parents acquire citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 2-8 years continuous residence (varies), B1 Estonian language competency, integration test, no security threats.\n\n**EU/EEA citizens:** Can naturalize after 2 years. Non-EEA citizens require longer residence."
  },
  "Digital Citizenship": {
    "icon": "💻",
    "desc": "E-residency program allows remote digital identity but does not confer citizenship or right of residence."
  },
  "Birthright Citizenship": {
    "icon": "🇪🇪",
    "desc": "Children born in Estonia to non-citizen parents acquire Estonian citizenship if no other citizenship acquired at birth."
  }
}' WHERE name = 'Estonia';

-- THAILAND
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Thai fathers automatically acquire Thai citizenship. Maternal descent requires father acknowledgment."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence, Thai language proficiency, loyalty to Thai nation, financial independence, good conduct.\n\n**Processing:** Through Immigration Bureau, 6-12 months. Must renounce previous nationality."
  },
  "Birthright Citizenship": {
    "icon": "🏯",
    "desc": "Children born in Thailand acquire citizenship if birth is registered and at least one parent is Thai or permanent resident."
  },
  "Limited Provisions": {
    "icon": "📖",
    "desc": "Dual citizenship not officially recognized. Children must choose at age of majority."
  }
}' WHERE name = 'Thailand';

-- MEXICO
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Mexican citizens automatically acquire Mexican citizenship at birth. Foreigners born in Mexico to Mexican parent also eligible."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (reduced for certain nationalities), Spanish language ability, renunciation of previous citizenship, stable employment.\n\n**Special:** Central Americans, Spanish nationals, Portuguese nationals: 2 years residence."
  },
  "Spouse and Family": {
    "icon": "👨‍👩‍👧‍👦",
    "desc": "Spouses of Mexican citizens may apply after 1 year marriage with simplified requirements."
  },
  "Birthright Citizenship": {
    "icon": "🇲🇽",
    "desc": "Children born in Mexico acquire citizenship if born to Mexican parent(s) or if registered with Mexican authorities."
  }
}' WHERE name = 'Mexico';

-- SWITZERLAND
UPDATE countries SET citizenship_requirements = '{
  "Cantonal System": {
    "icon": "🏔️",
    "desc": "Swiss citizenship requires municipal, cantonal, and federal levels. Each canton has different requirements and processes."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years residence (some cantons require 12), language proficiency, integration, renunciation of previous nationality.\n\n**Processing:** Very selective and varies significantly by canton. Swiss-born children of non-citizens may apply after age 22."
  },
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Swiss father acquire citizenship automatically. Children of Swiss mother must have father acknowledge paternity."
  },
  "Special Programs": {
    "icon": "⭐",
    "desc": "No dual citizenship for adults. Some cantons have specific provisions for married couples and investors."
  }
}' WHERE name = 'Switzerland';

-- ITALY
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent (Jus Sanguinis)": {
    "icon": "👨‍👩‍👧",
    "desc": "Unlimited generations of Italian descendants can claim citizenship through unbroken line of paternal descent. Major reform in 1948 affects maternal lines."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years legal residence (4 years for EU/EEA citizens, 3 years for Italian descendants), Italian language, cultural integration.\n\n**Processing:** Through Prefectura, often 12-24 months."
  },
  "Spouse of Italian Citizen": {
    "icon": "💍",
    "desc": "Foreign spouses may apply after 2 years marriage with continuous residence in Italy, or 3 years total married life."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have preferential treatment and can naturalize after 4 years with simplified procedures."
  }
}' WHERE name = 'Italy';

-- NETHERLANDS
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Dutch citizen parent(s) acquire Dutch citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence (EU/EEA: 2 years), Dutch language (A2 level), integration, renunciation of other citizenship (dual citizenship limited).\n\n**Processing:** Through IND, 3-6 months."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Married couples where one is Dutch may have accelerated naturalization after 2 years marriage."
  },
  "Limited Dual Citizenship": {
    "icon": "🇪🇺",
    "desc": "Generally not permitted, but Dutch-born children of naturalized parents may retain dual citizenship until age 22 to choose."
  }
}' WHERE name = 'Netherlands';

-- IRELAND
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Ancestry-based citizenship available for up to 2 generations of Irish-born ancestors. Registration available for foreign-born children of Irish citizens."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 1 year continuous + 4 years total out of last 8 years residence, English/Irish language, good character, knowledge of Irish law.\n\n**Processing:** Through Department of Justice, 4-6 months typically."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Spouses of Irish citizens may apply with reduced residence requirements of 3 years continuous."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU citizens enjoy freedom of movement with pathway to citizenship after 5 years residence."
  }
}' WHERE name = 'Ireland';

-- GREECE
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Greek parent(s) acquire Greek citizenship automatically. Diaspora Greeks may claim based on grandparent ancestry."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years legal residence (3 years for EU/EEA citizens), Greek language A1 level, knowledge of Greek culture, renunciation of previous nationality.\n\n**Processing:** Through local authorities, 6-12 months."
  },
  "Spouse of Greek Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 1 year marriage with 3-year total residence requirement."
  },
  "Historic Greek Communities": {
    "icon": "⭐",
    "desc": "Descendants of historic Greek diaspora may claim citizenship through Ministry of Interior."
  }
}' WHERE name = 'Greece';

-- BELGIUM
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Belgian citizen parent(s) automatically acquire Belgian citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence (EU/EEA: 3 years), Dutch/French/German language depending on region, integration, renunciation of previous nationality.\n\n**Processing:** Through local municipality, 6-12 months."
  },
  "Birthright Citizenship": {
    "icon": "🏛️",
    "desc": "Limited jus soli: Children born in Belgium to non-citizen parents can claim after age 18 if they resided there for 5 years."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Spouses of Belgian citizens have access to accelerated naturalization with reduced residence requirements."
  }
}' WHERE name = 'Belgium';

-- POLAND
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Polish citizen(s) acquire Polish citizenship automatically. Ancestry-based claims available through Ministry of Interior."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 3-5 years legal residence (EU/EEA: 2 years), Polish language, knowledge of Polish culture/constitution, renunciation of previous citizenship.\n\n**Processing:** Through local voivodeship office, 6-12 months."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Spouses of Polish citizens and Polish diaspora may apply with simplified procedures and reduced residence requirements."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens enjoy preferential treatment and can naturalize faster."
  }
}' WHERE name = 'Poland';

-- AUSTRIA
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Austrian citizen parent(s) acquire Austrian citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years legal residence (EU/EEA: 6 years), German language B1 level, knowledge of Austrian constitution, renunciation of other citizenship.\n\n**Processing:** Through regional authorities, 8-12 months."
  },
  "Spouse Naturalization": {
    "icon": "💍",
    "desc": "Spouses of Austrian citizens may apply after 2 years marriage with reduced residence to 5 years."
  },
  "Special Provisions": {
    "icon": "⭐",
    "desc": "Reduced requirements for refugees and persons of Austrian descent."
  }
}' WHERE name = 'Austria';

-- TURKEY
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Turkish citizen parent(s) acquire Turkish citizenship automatically. Nationality acquired through father unless born outside wedlock."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence, Turkish language, loyalty to Turkish state, renunciation of previous nationality, no security issues.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Birthright Citizenship": {
    "icon": "🏛️",
    "desc": "Limited jus soli: Children born in Turkey to unknown parents or stateless persons may acquire Turkish citizenship."
  },
  "Special Programs": {
    "icon": "💰",
    "desc": "Property investment and business investment programs may facilitate naturalization."
  }
}' WHERE name = 'Turkey';

-- MALTA
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Maltese parent(s) acquire Maltese citizenship automatically. EU citizenship through descent available."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence, Maltese or English language, good conduct, financial independence.\n\n**Processing:** Through Ministry for Justice, 6-12 months."
  },
  "Investment Citizenship": {
    "icon": "💰",
    "desc": "Individual Investor Programme (IIP) offers citizenship through property investment €320,000, government contribution €88,000, and donation €10,000."
  },
  "Birthright Citizenship": {
    "icon": "🏝️",
    "desc": "Children born in Malta to resident parents may acquire citizenship upon registration."
  }
}' WHERE name = 'Malta';

-- DENMARK
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Danish citizen parent(s) acquire Danish citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 9 years legal residence (EU/EEA: 7 years), Danish language, integration, knowledge of Danish culture, renunciation of previous nationality.\n\n**Processing:** Through Directorate of Immigration, 12-24 months. Very selective."
  },
  "Spouse of Danish Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 2 years marriage with continuous residence in Denmark."
  },
  "Birthright Citizenship": {
    "icon": "🇩🇰",
    "desc": "Very limited jus soli. Generally requires at least one Danish parent."
  }
}' WHERE name = 'Denmark';

-- SWEDEN
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Swedish citizen parent(s) acquire Swedish citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence (EU/EEA: 2 years for workers), Swedish language, stable income, good conduct.\n\n**Processing:** Through Swedish Migration Agency, 4-8 months."
  },
  "Spouse and Family": {
    "icon": "💍",
    "desc": "Spouses may apply after 2 years marriage, with EU/EEA spouses having simpler procedures."
  },
  "Birthright Citizenship": {
    "icon": "🇸🇪",
    "desc": "Children born in Sweden acquire citizenship if at least one parent is Swedish or permanent resident."
  }
}' WHERE name = 'Sweden';

-- FINLAND
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Finnish citizen parent(s) acquire Finnish citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 6 years legal residence (EU/EEA: 4 years), Finnish/Swedish language, stable income, security clearance.\n\n**Processing:** Through Immigration Service, 6-12 months."
  },
  "EU/EEA Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have preferential treatment and can naturalize after 4 years residence."
  },
  "Birthright Citizenship": {
    "icon": "🇫🇮",
    "desc": "Children born in Finland to Finnish parent(s) acquire citizenship automatically."
  }
}' WHERE name = 'Finland';

-- NORWAY
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Norwegian citizen parent(s) acquire Norwegian citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years legal residence (EU/EEA: 3-5 years depending on status), Norwegian language, integration, renunciation of previous nationality.\n\n**Processing:** Through Norwegian Directorate of Immigration, 8-12 months."
  },
  "Spouse of Norwegian Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 2 years marriage with reduced residence requirements."
  },
  "EU/EEA Citizens": {
    "icon": "🇪🇺",
    "desc": "EEA citizens have special status; naturalization available after fulfilling language and integration requirements."
  }
}' WHERE name = 'Norway';

-- CYPRUS
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Cypriot citizen parent(s) acquire Cypriot citizenship automatically at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years legal residence (EU/EEA: 5 years), Greek language, knowledge of Cypriot culture, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Investment Citizenship": {
    "icon": "💰",
    "desc": "Citizenship through investment: €2 million real estate investment plus €500,000 to economic development fund."
  },
  "EU Citizenship": {
    "icon": "🇪🇺",
    "desc": "Cypriot citizenship confers EU citizenship automatically, providing visa-free access across EU/EEA."
  }
}' WHERE name = 'Cyprus';

-- FRANCE
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of French citizen parent(s) acquire French citizenship automatically. Ancestry-based claims available through succession."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years legal residence (EU/EEA: 3 years for workers), French language B1 level, knowledge of French culture/constitution, stable income.\n\n**Processing:** Through Prefecture, 12-24 months. Selective process."
  },
  "Spouse of French Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 2 years marriage with reduction to 4 years total residence requirement."
  },
  "Birthright Citizenship": {
    "icon": "🇫🇷",
    "desc": "Children born in France to French parent(s) acquire citizenship. Limited jus soli for children of non-citizens."
  }
}' WHERE name = 'France';


-- Seed tax_advice for all 28 countries

UPDATE countries SET tax_advice = '- Malta has a favorable tax treaty network with 70+ countries
- Corporate tax rate is 35%, but can be reduced with tax credits
- Individuals receive a personal allowance of €8,500 annually
- VAT rate is 18% (reduced rates of 5% and 0% apply to certain goods/services)
- Non-resident individuals only taxed on Malta-sourced income
- Capital gains are generally not taxable in Malta
- Dividend withholding tax is 6/7 (effectively 0% for domestic dividends)
- Foreign tax credits available for taxes paid abroad' WHERE name = 'Malta';

UPDATE countries SET tax_advice = '- No VAT or sales tax on products and services
- Personal income tax ranges from 8.93% to 20.87%
- Corporate tax is a flat 20% on net profits
- Iceland has competitive withholding tax rates on dividends (6% if conditions met)
- Pension contributions are tax-deductible
- Foreign-sourced income may be exempt if criteria met
- Health insurance contributions are deductible
- Use tax residency carefully to optimize tax filing status' WHERE name = 'Iceland';

UPDATE countries SET tax_advice = '- Germany has progressive income tax rates (0% to 42%)
- Corporate tax (Körperschaftsteuer) is 30% plus trade tax
- VAT at 19% (reduced rates of 7% and 0% on essentials)
- Dual income taxation system between federal and state level
- Significant tax deductions available for business expenses
- Retirement and insurance contributions are tax-deductible
- Church tax of 8-9% applies if church member
- Wealth tax abolished, but inheritance tax applies' WHERE name = 'Germany';

UPDATE countries SET tax_advice = '- Peru offers a tiered income tax system (up to 30%)
- Corporate tax rate is 27%, but lower rates available for certain sectors
- VAT is 18% with some exemptions for essentials
- Non-residents taxed only on Peruvian-sourced income
- Foreign remittances to Peru can benefit from reduced tax treatment
- Export income may qualify for tax incentives
- Retirement contributions are tax-deductible
- Regional tax incentives available for businesses in designated zones' WHERE name = 'Peru';

UPDATE countries SET tax_advice = '- Chile has a progressive tax system (up to 37%)
- Corporate tax (impuesto a la renta) is a flat 27% on profits
- VAT at 19% (standard rate applies to most goods/services)
- Foreign-source income only taxed if remitted to Chile
- Generous tax deductions for personal expenses and business costs
- Pension contributions (up to 10%) are mandatory and tax-deductible
- Capital gains can be taxable depending on holding period and circumstances
- Mining industry receives special tax treatment and incentives' WHERE name = 'Chile';

UPDATE countries SET tax_advice = '- Morocco has income tax rates ranging from 0% to 38%
- Corporate tax rate is 30%, with preferential rates for certain activities
- VAT at 20% (reduced rates of 14%, 10%, 7%, and 0% on essentials)
- Non-residents taxed at flat 13% on investment income
- Foreign remittances are tax-exempt if formalized through official channels
- Business startups in technology receive tax holidays
- Regional free zones (Tangier) offer significant tax incentives
- Pension contributions and life insurance are tax-deductible' WHERE name = 'Morocco';

UPDATE countries SET tax_advice = '- Indonesia uses a progressive income tax system (up to 30%)
- Corporate tax rate is 22% (reduced to 17% for certain taxpayers)
- VAT at 10% with exemptions for essentials and financial services
- Foreign residents taxed on worldwide income if physically present 183+ days
- Tax amnesty programs periodically available for undeclared assets
- Capital gains generally not taxed if reinvested within 1 year
- R&D expenses receive enhanced deductions (150% for certain activities)
- Export-oriented businesses receive various tax incentives' WHERE name = 'Indonesia';

UPDATE countries SET tax_advice = '- UK income tax: 0% to 45% (depending on taxable income bracket)
- Corporation tax at 25% (lower rate of 19% for profits under £50k)
- VAT at 20% (reduced rates of 5% and 0% on essentials)
- Non-residents: only UK-sourced income is taxable
- Capital gains: annual exemption of £3,000, then 10-20% depending on asset type
- Dividend allowance of £500 per year for basic rate taxpayers
- ISAs allow up to £20,000 tax-free investment
- Tax residence status critical to determine tax liability' WHERE name = 'United Kingdom';

UPDATE countries SET tax_advice = '- Portugal has progressive income tax rates (14.5% to 48%)
- Corporate tax rate is 19% (15% for companies with turnover <25m euros)
- VAT at 23% (reduced rates of 13%, 6%, and 0%)
- Non-Habitual Resident (NHR) regime offers 10-year tax exemption on foreign income
- Golden Visa holders can benefit from NHR provisions
- Capital gains generally taxed at 28%
- Real estate property transfer tax at varying rates (0.8%-8%)
- Tax residency established if in Portugal 183+ days or have permanent home' WHERE name = 'Portugal';

UPDATE countries SET tax_advice = '- Spain uses progressive income tax (19% to 45%)
- Corporate tax rate is 25% (reduced rates for startups)
- VAT at 21% (reduced rates of 10%, 4%, and 0%)
- Expat tax relief (Beckham Law) offers 6-year tax break for certain income types
- Non-residents taxed at flat 19% on Spanish-sourced income
- Capital gains: 19% to 23% depending on holding period
- Wealth tax abolished in 2008, replaced with increased VAT
- Regional variations exist (Canary Islands, Balearic Islands offer incentives)' WHERE name = 'Spain';

UPDATE countries SET tax_advice = '- Estonia has unique digital-first tax system (20% corporate rate)
- Profits distributed are taxed; retained earnings tax-free
- Income tax for residents: 8% to 20% depending on bracket
- VAT at 20% (reduced rates of 9% and 0%)
- Non-residents taxed on Estonia-source income only
- Capital gains from securities exempt from tax
- Dividend tax deferred until withdrawal (encouraging reinvestment)
- E-Residency provides online tax filing and digital solutions' WHERE name = 'Estonia';

UPDATE countries SET tax_advice = '- Thailand has income tax rates from 0% to 37%
- Corporate tax rate is 20% with deductions available
- VAT at 7% (exemptions for essentials)
- Foreign nationals taxed on Thailand-source income only
- Remittance basis taxation available for non-residents
- Tax treaty benefits with 60+ countries available
- Retirement income can receive preferential tax treatment
- No capital gains tax on stock exchanges
- Investment incentive: Board of Investment (BOI) offers significant tax holidays' WHERE name = 'Thailand';

UPDATE countries SET tax_advice = '- Mexico has progressive income tax (1.92% to 35%)
- Corporate tax rate is 30% with deductions
- VAT at 16% (reduced rates of 0% and 8% in border regions)
- Non-residents taxed on Mexico-source income only
- Capital gains taxed at same rate as ordinary income
- Foreign tax credits available for taxes paid abroad
- Temporary resident status doesn''t automatically grant residency for tax purposes
- Export-oriented businesses receive various incentives' WHERE name = 'Mexico';

UPDATE countries SET tax_advice = '- Switzerland has one of the lowest tax rates in Europe
- Federal income tax: 0% to 11.5% (plus cantonal/municipal taxes)
- Corporate tax varies significantly by canton (11% to 21.6% effective)
- VAT at 8.1% (reduced rates of 3.8%, 2.5%, and 0%)
- Non-residents taxed on Swiss-source income only
- Foreign account tax compliance required
- Wealth tax exists in some cantons (not federal)
- Tax planning by canton selection is legitimate and common
- Capital gains generally not taxed at federal level' WHERE name = 'Switzerland';

UPDATE countries SET tax_advice = '- Italy has progressive income tax (23% to 43%)
- Corporate tax rate is 24% (lower rates available in special zones)
- VAT at 22% (reduced rates of 10%, 5%, and 4%)
- Non-residents taxed on Italy-source income only
- Capital gains: 26% flat tax for some assets, ordinary rates for others
- Property tax (IMU) based on cadastral value, varies by region
- Foreign tax credits available for taxes paid abroad
- Incentives for repatriated capital and foreign business income' WHERE name = 'Italy';

UPDATE countries SET tax_advice = '- Netherlands has progressive income tax (19.55% to 49.5%)
- Corporate tax rate is 23% (19% for profits up to €200k for small entities)
- VAT at 21% (reduced rates of 9%, 6%, and 0%)
- Non-residents taxed on Dutch-source income and worldwide Dutch-originating income
- Ruling system (APA/RULING) allows advance tax agreements
- Capital gains from regular investments may be exempt
- Substance requirements critical for tax residency determination
- Employer and employee social contributions required' WHERE name = 'Netherlands';

UPDATE countries SET tax_advice = '- Ireland has favorable 12.5% corporate tax rate (R&D tax credit added benefit)
- Personal income tax: 20% and 40% rates with credits
- VAT at 23% (reduced rates of 13.5%, 9%, and 0%)
- Extensive tax treaty network (70+ countries)
- Non-residents taxed on Ireland-source income only
- Capital gains: 33% tax rate with annual exemption of €1,270
- Double taxation relief available
- IP holding companies and R&D activities heavily incentivized' WHERE name = 'Ireland';

UPDATE countries SET tax_advice = '- Greece has progressive income tax (9% to 44%)
- Corporate tax rate is 22% (reduced rates available for certain sectors)
- VAT at 24% (reduced rates of 13%, 6%, and 0%)
- Non-residents taxed on Greece-source income only
- Golden Visa holders (€250k property purchase) receive residency without restrictions
- Capital gains taxed at 15% (under certain conditions)
- Foreign tax credits available
- Special incentive zones offer reduced corporate tax rates' WHERE name = 'Greece';

UPDATE countries SET tax_advice = '- Belgium has progressive income tax (up to 50%)
- Corporate tax rate is 25% (reduced rate of 20.9% for small enterprises)
- VAT at 21% (reduced rates of 12%, 6%, and 0%)
- Non-residents taxed on Belgium-source income only
- Patent box: 80% deduction on IP income (effective 6.25% tax rate)
- Ruling system (Advanced Pricing Agreements) available
- Capital gains taxed at ordinary rates or 16.5% depending on circumstances
- Higher earner withheld tax (précompte mobilier) requires careful planning' WHERE name = 'Belgium';

UPDATE countries SET tax_advice = '- Poland has personal income tax at 17% and 32%
- Corporate tax rate is 19% (reduced to 9% for small companies)
- VAT at 23% (reduced rates of 8%, 5%, and 0%)
- Non-residents taxed on Poland-source income only
- Capital gains can be partially tax-exempt (50% exemption available)
- CIT exemption available for reinvested profits (certain conditions)
- Foreign tax credits available
- IP box: preferential tax treatment for certain innovation income' WHERE name = 'Poland';

UPDATE countries SET tax_advice = '- Austria has progressive income tax (0% to 55%)
- Corporate tax rate is 24%
- VAT at 20% (reduced rates of 10%, 5%, and 0%)
- Non-residents taxed on Austria-source income only
- Capital gains: 27.5% flat tax (for securities/real property)
- Tax ruling system available for certainty on tax treatment
- Collective investment funds receive favorable treatment
- Substantial real estate held by non-residents triggers annual property tax' WHERE name = 'Austria';

UPDATE countries SET tax_advice = '- Turkey has progressive income tax (up to 40%)
- Corporate tax rate is 22% (reduced rates available for certain sectors)
- VAT at 18% (reduced rates of 8%, 1%, and 0%)
- Non-residents taxed on Turkey-source income and foreign income from Turkish business
- Capital gains from security transactions exempt if held 1+ years
- Real estate held 1+ year can exempt 50% of gain
- Special economic zones offer significantly reduced tax rates
- Tax residency established after 1 year of residence' WHERE name = 'Turkey';

UPDATE countries SET tax_advice = '- Denmark has progressive income tax (rates up to 55.8%)
- Corporate tax rate is 22%
- VAT at 25% (no reduced rates, only exemptions for essentials)
- Non-residents taxed on Denmark-source income only
- Capital gains on shares and securities exempt if certain conditions met
- High tax burden offset by excellent public services
- Tax deductions available for mortgage interest, pension contributions
- Significant employment tax credits available for certain employees' WHERE name = 'Denmark';

UPDATE countries SET tax_advice = '- Sweden has progressive income tax (up to 56.6%)
- Corporate tax rate is 20.6%
- VAT at 25% (reduced rates of 12% and 6%)
- Non-residents taxed on Sweden-source income only
- Capital gains: 30% flat tax (lower for primary residence - often exempt)
- Wealth tax abolished in 2007
- Tax deductions for mortgage interest and pension contributions
- Dividend tax: 30% for standard rate (varies for retirement accounts)' WHERE name = 'Sweden';

UPDATE countries SET tax_advice = '- Finland has progressive income tax (up to 56.95%)
- Corporate tax rate is 20.8%
- VAT at 24% (reduced rates of 14%, 10%, and 0%)
- Non-residents taxed on Finland-source income only
- Capital gains on shares and securities taxed at 30%
- Significant deductions for mortgage interest and pension contributions
- Tax-exempt income includes dividends from certain conditions
- Dividend taxation: varies by account type and residency status' WHERE name = 'Finland';

UPDATE countries SET tax_advice = '- Norway has progressive income tax (22% average, rates up to 48.84%)
- Corporate tax rate is 22%
- VAT at 25% (reduced rates of 15%, 11.1%, and 0%)
- Non-residents taxed on Norway-source income only
- Capital gains generally not taxed (with exceptions for real estate)
- Oil and energy sector has special tax regime
- Pensions and insurance contributions are tax-deductible
- Tax residency requires personal presence or economic ties
- Foreign tax credits available for taxes paid abroad' WHERE name = 'Norway';

UPDATE countries SET tax_advice = '- Cyprus has one of the lowest corporate tax rates in EU (0% for certain income)
- Regular corporate tax rate is 12.5%
- Personal income tax: 0% to 35% progressive
- VAT at 19% (reduced rates of 9%, 5%, and 0%)
- Non-residents taxed on Cyprus-source income only
- Dividends received can be exempt from taxation (participation exemption)
- Capital gains: 0% on shares (with holding requirements), 20% on real estate
- IP holding companies receive preferential treatment
- Non-dom individuals don''t pay tax on foreign income' WHERE name = 'Cyprus';

UPDATE countries SET tax_advice = '- France has progressive income tax (0% to 45%)
- Corporate tax rate is 25% (reduced to 15% for small/medium enterprises)
- VAT at 20% (reduced rates of 10%, 5.5%, and 2.1%)
- Non-residents taxed on France-source income only
- Capital gains: 19% flat tax (plus social levies)
- Extensive use of tax rulings to determine favorable treatment
- New France requirement: substantial economic activity needed for residency
- French residents required to file worldwide assets (declaration of foreign accounts)
- Wealth tax (ISF) applies to certain high-net-worth individuals' WHERE name = 'France';


-- Seed local_tips for all 28 countries

UPDATE countries SET local_tips = '- Learn basic Maltese and English are both official languages
- Apply for residency before 60 days if staying longer than 90 days
- Healthcare: Private insurance recommended; public system available for residents
- Cost of living highest in EU capitals; budget €1,500-2,000/month for comfortable living
- Buy property early if considering Golden Visa; prices rising quickly
- Network through local expat groups; tight community makes integration easier
- Public transport is cheap but limited; car recommended outside Valletta' WHERE name = 'Malta';

UPDATE countries SET local_tips = '- Embrace "hygge" culture - slow living and candlelit evenings are essential
- Winter is long and dark; prepare mentally and invest in quality outerwear
- High cost of living (food, alcohol, housing) but excellent public services justify it
- Learn Icelandic if staying long-term; English widely spoken but appreciated
- Rental market very competitive; start searching 2-3 months before move
- Expat communities in Reykjavík can help with bureaucratic processes
- Geothermal heating makes energy costs manageable' WHERE name = 'Iceland';

UPDATE countries SET local_tips = '- German bureaucracy is efficient but thorough; keep all documents organized
- Register with local government (Anmeldung) within 2 weeks of arrival
- Healthcare system excellent; mandatory public or private insurance required
- Learn German quickly; English common but German essential for integration
- Apprenticeship and vocational training (Ausbildung) widely available
- Punctuality and directness highly valued in German culture
- Recycling is mandatory with strict sorting requirements' WHERE name = 'Germany';

UPDATE countries SET local_tips = '- Spanish (not Portuguese) is primary language; learn regional dialects
- Bureaucracy can be slow; patience and connections essential
- Siesta culture still strong outside major cities; adjust schedule accordingly
- Healthcare: Public system (IMSS) good value; register quickly after arrival
- Visa runs to Bolivia/Chile easy if needed for long-term stays
- Cost of living reasonable outside Lima and major tourist zones
- Join local clubs/sports groups to build community quickly' WHERE name = 'Peru';

UPDATE countries SET local_tips = '- Spanish is essential; English limited outside Santiago and tourist areas
- Healthcare excellent public system; FONASA registration recommended
- High internet speeds and tech-forward infrastructure
- Cost of living rising rapidly; budget accordingly for Santiago
- Visa requirements can be navigated with tourism loop if needed
- Strong wine culture; explore local vineyards in Central Valley
- Weather varies dramatically by region; choose location carefully' WHERE name = 'Chile';

UPDATE countries SET local_tips = '- Arabic (Darija dialect) spoken; French also very useful, English limited
- Bureaucracy can be slow and require connections; patience essential
- Ramadan significantly affects business hours and social life
- Healthcare: Private clinics better quality than public system
- Haggling expected in markets; good opportunity to practice language
- Cost of living very reasonable; budget €600-800/month comfortably
- Expat communities in Marrakech and Tangier well-established' WHERE name = 'Morocco';

UPDATE countries SET local_tips = '- Indonesian (Bahasa) easier than it seems; locals appreciate effort to learn
- Bureaucracy requires patience and local knowledge; hire visa agent if needed
- Healthcare: Stick to private clinics in cities; international insurance recommended
- Cost of living very reasonable; expat lifestyle affordable on modest budget
- Visas often require visa runs; neighboring countries easily accessible
- Traffic in Jakarta chaotic; consider location carefully before moving
- Rainy season (November-March) affects daily life and infrastructure' WHERE name = 'Indonesia';

UPDATE countries SET local_tips = '- English widely spoken; no pressure to learn English but appreciated
- NHS (National Health Service) free; register with GP immediately after arrival
- Visa sponsorship essential for most work visas; plan well ahead
- Cost of living very high in London; consider regional alternatives
- Council tax, utilities, and council registration required; budget accordingly
- Driving left-hand side cars; international license required
- Weather grey and rainy; invest in good waterproof gear' WHERE name = 'United Kingdom';

UPDATE countries SET local_tips = '- Portuguese easy to learn if you know Spanish; locals appreciate effort
- NHR (Non-Habitual Resident) tax regime available for first 10 years
- Healthcare: Private insurance recommended though public system acceptable
- Cost of living reasonable outside Lisbon and Porto; rural areas very affordable
- Bureaucracy: Register with local authorities (junta de freguesia) immediately
- Golden Visa program well-established and widely understood
- Weather excellent; mild winters in most of country' WHERE name = 'Portugal';

UPDATE countries SET local_tips = '- Spanish essential; regional languages (Catalan, Basque) matter in some regions
- Bureaucracy less efficient than Germany but improving; patience required
- Healthcare excellent and affordable; register with local centro de salud
- Visa sponsorship needed for work; digital nomad visa available
- Siesta culture stronger south; adjust business schedule accordingly
- Labor market competitive; network heavily before moving
- Quality of life exceptionally high; integration easier than expected' WHERE name = 'Spain';

UPDATE countries SET local_tips = '- Estonian widely spoken; English very common among younger generations
- E-governance system excellent; most bureaucracy done online
- Cost of living reasonable outside Tallinn; budget €800-1,200/month
- Healthcare: Register with family doctor; system efficient and affordable
- Tech industry booming; e-residency useful for business formation
- Sauna culture important; explore traditional saunas for integration
- Winter dark and long but manageable; outdoor activities year-round' WHERE name = 'Estonia';

UPDATE countries SET local_tips = '- Thai language helpful but English common in tourist/expat areas
- Visa runs to Laos/Malaysia standard for extending stays
- Healthcare: Bangkok private hospitals world-class; affordable even without insurance
- Cost of living very low; comfortable expat lifestyle €500-800/month
- Thai culture values respect and formality; learn key etiquette
- Muay Thai gyms excellent for fitness and community building
- Monsoon season (May-October) affects weather; plan indoor activities' WHERE name = 'Thailand';

UPDATE countries SET local_tips = '- Spanish essential; English limited outside tourist areas and Mexico City
- Visa sponsorship needed for work; temporary resident visa renewable
- Healthcare: Private insurance recommended; IMSS public system adequate
- Cost of living very low outside Mexico City; budget €600-900/month
- Residency visa (temporary) renewable annually for several years
- Bureaucracy improving but still can be complicated; hire gestoria if needed
- Security situation varies dramatically by location; choose carefully' WHERE name = 'Mexico';

UPDATE countries SET local_tips = '- French helpful but German/Italian/Romansh also spoken regionally
- Bureaucracy efficient and well-organized; keep documents meticulously
- Extreme cost of living: budget CHF 4,000-6,000/month for comfortable living
- Healthcare mandatory; excellent quality but very expensive
- Cantons have significant autonomy; tax situation varies by location
- Integration requires effort; Swiss culture is reserved but respectful
- Public transport excellent; car optional in cities' WHERE name = 'Switzerland';

UPDATE countries SET local_tips = '- Italian essential; dialects vary significantly by region
- Bureaucracy can be slow; relationships and connections help significantly
- Healthcare excellent; register with local ASL (health authority)
- Cost of living reasonable outside major cities; north more expensive than south
- Regional differences dramatic; research specific region before moving
- Visa sponsorship needed for work; understand visa type carefully
- Labor market competitive; networking crucial for employment' WHERE name = 'Italy';

UPDATE countries SET local_tips = '- Dutch very widely spoken; English nearly universal but Dutch appreciated
- Bureaucracy efficient; register with gemeente (municipality) immediately
- Cycling culture dominant; invest in good bike and follow traffic laws
- Cost of living high but reasonable for quality of life; budget €1,500-2,000/month
- Rental market competitive; start searching early through established sites
- Healthcare: Mandatory insurance; deductible system common
- Weather cool and grey; embrace cycling and indoor culture' WHERE name = 'Netherlands';

UPDATE countries SET local_tips = '- English nearly universal; Irish accent takes time to understand
- Bureaucracy improving; PPS number (Personal Public Service) essential
- Healthcare: Private insurance recommended though public system available
- Cost of living high, especially Dublin; consider regional cities
- Tax rate low; double taxation treaties with many countries
- Visa sponsorship available for skilled workers; Critical Skills Employment Permit
- Weather rainy and cool; embrace pub culture for social integration' WHERE name = 'Ireland';

UPDATE countries SET local_tips = '- Greek helpful but English widely spoken in expat/tourist areas
- Bureaucracy can be slow; relationships matter; be patient
- Healthcare acceptable in major cities; private insurance recommended
- Cost of living very reasonable; budget €800-1,200/month comfortable
- Golden Visa program well-known; property investment pathway clear
- Island-specific regulations; research specific island before moving
- Summer extremely hot; adapt schedule to late nights and siestas' WHERE name = 'Greece';

UPDATE countries SET local_tips = '- French or Dutch essential depending on region (Brussels, Flanders, Wallonia)
- Bureaucracy complex due to regional differences; hire relocation specialist if possible
- Cost of living reasonable outside Brussels; budget €1,200-1,800/month
- Healthcare excellent; mandatory registration with mutuellе (health fund)
- Regional integration important; learn local language of region
- Tax brackets complicated; professional advice recommended
- Cycling infrastructure excellent especially in Flanders' WHERE name = 'Belgium';

UPDATE countries SET local_tips = '- Polish increasingly spoken among younger people; English growing
- Bureaucracy improving rapidly; digitalization making processes easier
- Cost of living low; budget €700-1,000/month comfortably
- Healthcare functional but slower than Western Europe; consider private insurance
- Job market improving for skilled workers; networking essential
- Visa sponsorship available for key specialists
- Weather cold winters (minus 10-15°C common); prepare appropriately' WHERE name = 'Poland';

UPDATE countries SET local_tips = '- German essential, especially outside Vienna; English spoken but limited
- Bureaucracy efficient; Austrians appreciate order and punctuality
- Cost of living reasonable; budget €1,400-1,800/month
- Healthcare excellent; mandatory insurance; register immediately
- Vienna''s music/culture scene world-class; integrate through cultural activities
- Skiing and outdoor activities central to lifestyle; embrace them
- Coffee culture strong; embrace Viennese coffee house tradition' WHERE name = 'Austria';

UPDATE countries SET local_tips = '- Turkish essential; English common in Istanbul but limited elsewhere
- Bureaucracy can be unpredictable; connections and flexibility important
- Healthcare: Private insurance recommended; good clinics in major cities
- Cost of living very low; budget €700-900/month for comfortable expat lifestyle
- Visa runs to nearby countries standard practice
- Entrepreneurship and business formation relatively straightforward
- Weather hot and dry in summer; prepare for significant heat' WHERE name = 'Turkey';

UPDATE countries SET local_tips = '- Danish useful but English nearly universal; Danes speak English very well
- Extreme cost of living; budget DKK 15,000-18,000/month (€2,000-2,400)
- "Hygge" and work-life balance central to Danish culture; embrace it
- Healthcare excellent; mandatory registration; efficient system
- Bureaucracy well-organized; CPR number essential (like SSN)
- Salary expectations high but cost of living absorbs most gains
- Cycling culture dominant; learn cycling etiquette' WHERE name = 'Denmark';

UPDATE countries SET local_tips = '- Swedish helpful but English universal among younger generations
- Cost of living very high; Stockholm especially expensive; budget SEK 20,000-25,000/month
- "Fika" (coffee break) culture important; embrace social/work integration
- Healthcare excellent; mandatory registration with region''s healthcare service
- Bureaucracy efficient; personnummer (personal ID number) essential
- Excellent work-life balance and parental leave; generous social benefits
- Winter long and dark; seasonal depression common; prepare mentally
- Outdoor culture strong year-round; invest in proper cold weather gear' WHERE name = 'Sweden';

UPDATE countries SET local_tips = '- Finnish helpful but English widely spoken; less critical than Scandinavian countries
- Cost of living high; budget €1,800-2,200/month
- Sauna culture essential to Finnish identity; participate actively
- Healthcare excellent; mandatory register with public system
- Winter dark 6+ months; seasonal affective disorder common; prepare
- Education system world-class; relevant for families
- Bureaucracy efficient; language support available for expats
- Outdoor activities (lakes, forests, skiing) central to lifestyle' WHERE name = 'Finland';

UPDATE countries SET local_tips = '- Norwegian helpful but English very widely spoken; Norwegians fluent
- Extreme cost of living; highest in Nordic region; budget NOK 20,000-25,000/month
- Work-life balance and outdoor culture core to Norwegian identity
- Healthcare excellent; mandatory registration; very efficient system
- Bureaucracy well-organized; get D-number immediately (temporary ID)
- Outdoor activities (hiking, skiing, fishing) define lifestyle
- Winter involves significant darkness; embrace hygge and prepare mentally
- Wages high; compensate for extreme living costs' WHERE name = 'Norway';

UPDATE countries SET local_tips = '- Greek essential; English common among younger people and expat community
- Cost of living very reasonable; budget €800-1,000/month comfortably
- Residency straightforward; UK pension holders popular demographic
- Healthcare adequate; private insurance recommended; EU coverage helps
- Bureaucratic processes slow; patience and connections valuable
- Island lifestyle: choose between quiet/developed depending on preference
- Community strong; join local groups quickly for integration
- Prepare for summer heat and variable winter weather' WHERE name = 'Cyprus';

UPDATE countries SET local_tips = '- French essential outside Paris; English limited outside major cities/expat areas
- Bureaucracy complex and slow; French love of paperwork real; patience critical
- Cost of living reasonable outside Paris; Paris very expensive; budget €1,500-2,000/month Paris
- Healthcare excellent; mandatory registration; Sécurité Sociale system complex
- Work visa sponsorship required; freelancer status available for self-employed
- French culture values pessimism and critical thinking; learn to appreciate it
- Regional integration important; Paris expats can live expat bubble if not careful' WHERE name = 'France';
-- =============================================================================
-- Additional countries (see migration 20260429000000_add_more_countries.sql)
-- =============================================================================-- Migration: add_more_countries
-- Countries added: Hungary, Croatia, United States, Japan, South Korea, UAE, Canada, Australia,
-- New Zealand, Singapore, Hong Kong, Czechia, Slovakia, Bulgaria, Romania, Luxembourg,
-- South Africa, Slovenia, Latvia, Lithuania, China, Mongolia, Liechtenstein, Saudi Arabia,
-- Vietnam, Argentina, Brazil, India, Malaysia, Moldova, Albania, Georgia, Israel, Bahamas,
-- Pakistan, Qatar, Bosnia and Herzegovina, Egypt, Maldives, Monaco, Seychelles
-- Also includes existing countries (on conflict do nothing): Estonia, Thailand, Morocco, Indonesia, Iceland, Mexico

insert into countries (continent, name, iso_code, flag_url, highlight_img_url, description, longdescription)
values
(
	'Europe', 'Hungary', 'HU',
	'https://flagcdn.com/hu.svg',
	'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=800&q=80',
	'A Central European gem on the Danube, Hungary enchants with its ornate Parliament, healing thermal baths, and vibrant Budapest nightlife. EU membership combined with affordable living makes it a top destination for expats and digital nomads.

## Key Highlights
- Stunning Budapest architecture and world-renowned thermal bath culture
- Affordable EU living with rich cultural heritage
- Growing tech ecosystem and welcoming digital nomad community',
	'Hungary is a Central European nation with a rich history spanning over a millennium, from the Magyar conquest of the Carpathian Basin to full European Union membership. Budapest, the capital, is consistently ranked among Europe''s most beautiful cities, dramatically split by the Danube with the ornate Parliament building, iconic Chain Bridge, and hilltop Buda Castle. The city is celebrated for its thermal bath culture, vibrant ruin bars, and world-class culinary scene that blends Hungarian tradition with modern creativity. Hungary joined the EU in 2004, providing residents and businesses access to the single market and freedom of movement across Europe. The cost of living is significantly lower than Western Europe while maintaining a strong quality of life, making it increasingly popular among remote workers, retirees, and entrepreneurs. Budapest''s startup ecosystem is growing rapidly, with coworking spaces and accelerators supporting innovation. English proficiency is growing rapidly among younger generations and professionals, though Hungarian — a famously unique Finno-Ugric language — remains dominant. Beyond Budapest, Hungary offers Lake Balaton (Central Europe''s largest lake), rolling wine regions like Tokaj and Eger, and the vast Great Hungarian Plain. The country punches above its weight in science, culture, and innovation, having produced numerous Nobel laureates and world-renowned artists.'
),
(
	'Europe', 'Croatia', 'HR',
	'https://flagcdn.com/hr.svg',
	'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
	'A stunning Adriatic jewel with medieval walled cities and over 1,200 crystalline islands. Croatia combines Mediterranean beauty with EU membership, affordable living, and a pioneering digital nomad visa program.

## Key Highlights
- Breathtaking Dalmatian coastline with crystal-clear Adriatic waters
- UNESCO-listed medieval cities including iconic Dubrovnik
- EU membership with one of Europe''s first digital nomad visas',
	'Croatia is a southeastern European country renowned for its stunning Adriatic coastline, featuring over 1,200 islands, medieval walled cities, and crystal-clear turquoise waters. Dubrovnik, the "Pearl of the Adriatic," is one of the world''s best-preserved medieval cities and a UNESCO World Heritage site, while Zagreb, the capital, offers Central European charm with excellent museums, cafe culture, and a growing tech scene. Croatia became an EU member in 2013 and adopted the Euro in 2023, cementing its integration into the European economic area. The country was a pioneer in digital nomad legislation, introducing one of Europe''s first purpose-built digital nomad visas, attracting remote workers from around the world. National parks like Plitvice Lakes, with its terraced waterfalls and turquoise pools, are among Europe''s most spectacular natural wonders. The country''s cost of living, while rising in tourist areas, remains reasonable compared to Western Europe. Dalmatian cuisine features excellent seafood, olive oil, and local wines. Croatia''s transformation from post-Yugoslav economic challenges to a popular EU member demonstrates remarkable resilience and development, and tourism has become a major economic driver supporting continued investment in infrastructure.'
),
(
	'North America', 'United States', 'US',
	'https://flagcdn.com/us.svg',
	'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
	'The world''s largest economy and global cultural powerhouse, the United States offers unparalleled career opportunities, diverse landscapes, and world-class universities. From Silicon Valley to New York City, innovation and ambition define the American experience.

## Key Highlights
- World''s largest economy with unmatched career opportunities
- World-class universities and technology innovation hubs
- Extraordinarily diverse landscapes and multicultural society',
	'The United States is the world''s largest economy and most globally influential nation, comprising 50 diverse states spanning an entire continent. From the technology corridors of Silicon Valley to the financial powerhouse of New York City, the US offers unparalleled professional opportunities across virtually every industry. The country is home to the world''s leading universities, including Harvard, MIT, and Stanford, which attract talent from every corner of the globe. American culture, entertainment, and innovation have shaped global society through technology, film, music, and media. The landscape is extraordinarily diverse, from the rocky coastlines of New England to the sunny beaches of Florida, the Rocky Mountains, the Great Plains, and Hawaii''s tropical islands. Immigration to the US is highly competitive and complex, with visa categories catering to skilled workers, investors, students, and family members. The H-1B visa is the primary pathway for skilled workers, while the EB-5 investor visa requires substantial capital. American healthcare is world-class but expensive, making health insurance essential. The cost of living varies dramatically by region, with major coastal cities being expensive but interior states offering more affordability. The American dream of opportunity and reinvention continues to attract millions of ambitious individuals seeking education, career advancement, and a better life in the world''s most powerful democracy.'
),
(
	'Asia', 'Japan', 'JP',
	'https://flagcdn.com/jp.svg',
	'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
	'An island nation where ancient tradition meets cutting-edge modernity, Japan captivates with its unique culture, world-renowned cuisine, and unmatched safety. Tokyo, Kyoto, and Osaka offer experiences unlike anywhere else on Earth.

## Key Highlights
- Unique blend of ancient culture and cutting-edge technology
- World-renowned cuisine, exceptional safety, and precision
- Extraordinary landscapes from Mount Fuji to sakura-lined streets',
	'Japan is an East Asian island nation of extraordinary cultural depth and technological sophistication, occupying a unique position as one of the world''s most ancient civilizations that has simultaneously embraced modernity completely. Tokyo, one of the world''s most dynamic megacities, blends ultramodern skyscrapers with traditional temples and cherry blossom parks. Japan''s economy is the third largest in the world, with global leadership in automotive, electronics, robotics, and manufacturing. Japanese culture emphasizes precision, craftsmanship, group harmony, and aesthetic beauty in everything from cuisine to architecture. The country offers extraordinary food culture, from world-class sushi and ramen to elaborate kaiseki dinners, with Tokyo having more Michelin-starred restaurants than any other city. Japan is exceptionally safe, efficient, and well-organized, with punctual public transportation, low crime, and immaculate public spaces. Learning Japanese is essential for long-term integration, as English proficiency outside tourist areas remains limited. Immigration has historically been strict, but recent years have seen expansion of work visas and a dedicated digital nomad visa program. The cost of living in Tokyo is high but manageable, while regional cities offer more affordable alternatives. Japan''s aging population is creating new opportunities for skilled foreign workers in healthcare, technology, and education sectors.'
),
(
	'Asia', 'South Korea', 'KR',
	'https://flagcdn.com/kr.svg',
	'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
	'A dynamic East Asian nation leading the world in technology, K-pop, and innovative culture. South Korea offers world-class infrastructure, a vibrant food scene, and growing opportunities for international talent in Seoul and beyond.

## Key Highlights
- Global leader in technology with Samsung, LG, and Hyundai
- Vibrant K-pop and K-drama culture with world-class street food
- Excellent infrastructure with strong career opportunities',
	'South Korea is a technologically advanced East Asian nation that transformed from post-war poverty to one of the world''s most dynamic economies within a single generation — an achievement known as the "Miracle on the Han River." Seoul, the capital and home to half the country''s population, is a sprawling ultramodern city with world-class infrastructure, excellent public transportation, and a vibrant cultural scene. South Korea is home to global technology and manufacturing giants including Samsung, LG, Hyundai, and SK, making it a significant innovation hub. The Korean Wave (Hallyu) has made Korean pop culture — K-pop, K-dramas, and Korean cinema — globally influential, bringing international attention to the language and culture. Korean cuisine is world-renowned for its bold flavors, fermentation techniques, and diverse street food culture including tteokbokki, Korean fried chicken, and bibimbap. South Korea offers excellent internet infrastructure (among the world''s fastest), modern healthcare, and a strong social safety net. For skilled foreign workers, the country has several visa pathways, including E-Series work visas and the D-10 job seeker visa. Learning Korean significantly improves integration and career opportunities. The cost of living in Seoul is high compared to other Asian cities but comparable to Western European capitals. The country faces challenges including intense work culture and competitive academic pressure.'
),
(
	'Asia', 'United Arab Emirates', 'AE',
	'https://flagcdn.com/ae.svg',
	'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
	'A gleaming Middle Eastern hub where ultramodern architecture meets ancient desert heritage. The UAE offers tax-free income, world-class infrastructure, and unmatched business opportunities as a strategic bridge connecting East and West.

## Key Highlights
- Zero personal income tax with business-friendly environment
- World-class infrastructure, luxury lifestyle, and global connectivity
- Strategic hub connecting Europe, Asia, and Africa',
	'The United Arab Emirates is a federation of seven emirates on the Arabian Peninsula, transforming from a pearl-diving economy to one of the world''s most modern and diversified economies in just a few decades. Dubai and Abu Dhabi are internationally recognized as global hubs for business, finance, tourism, and innovation, attracting millions of expatriates and tourists annually. The UAE offers zero personal income tax, making it highly attractive for high-earning professionals and entrepreneurs seeking to maximize their earnings while maintaining a luxurious lifestyle. Dubai''s skyline, featuring the world''s tallest building (Burj Khalifa), is a testament to the country''s extraordinary ambition. Abu Dhabi manages the country''s vast sovereign wealth fund through investments in renewable energy, culture, and technology. Expatriates make up approximately 88% of the UAE''s population, creating one of the world''s most international societies. The country has introduced various long-term residency options including Golden Visas for investors, entrepreneurs, and skilled professionals. Islamic law and conservative social norms apply, requiring expatriates to respect local customs. The desert climate features extreme summer heat, making outdoor activities largely seasonal. The UAE''s strategic location between Europe and Asia makes it a major logistics and travel hub, and its world-class airports offer connections to virtually every major city globally.'
),
(
	'North America', 'Canada', 'CA',
	'https://flagcdn.com/ca.svg',
	'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
	'One of the world''s most welcoming countries for immigrants, Canada offers exceptional quality of life, vast natural beauty, and strong opportunities across technology, healthcare, and natural resources.

## Key Highlights
- World-leading immigration pathways and genuinely multicultural society
- Exceptional quality of life with universal healthcare
- Stunning natural landscapes from the Rockies to the Arctic',
	'Canada is the world''s second largest country by land area, stretching from the Atlantic to the Pacific and north to the Arctic, offering extraordinary natural diversity from the Rocky Mountains to boreal forests, prairie grasslands, and thousands of lakes. Toronto, Vancouver, and Montreal are cosmopolitan cities consistently ranked among the world''s most livable, with strong economies, diverse populations, and excellent public services. Canada is widely regarded as having one of the world''s most welcoming immigration systems, with points-based Express Entry and Provincial Nominee Programs attracting hundreds of thousands of skilled workers annually. The country offers universal healthcare, strong labor protections, and excellent public education, making it particularly attractive for families. Canadian society is fundamentally multicultural, with the country''s identity built on diversity and inclusion. The technology sector is growing rapidly, with Toronto and Vancouver developing as major tech hubs attracting companies from Silicon Valley and beyond. Canada is bilingual at the federal level (English and French), with Quebec maintaining a distinct French-speaking culture. The natural environment is spectacular and easily accessible, with world-class ski resorts, hiking trails, and wildlife viewing opportunities. The cost of living varies dramatically by city, with Vancouver and Toronto expensive but other cities more affordable. Canada''s stable political system, rule of law, and social safety net make it one of the world''s most desirable migration destinations.'
),
(
	'Oceania', 'Australia', 'AU',
	'https://flagcdn.com/au.svg',
	'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
	'A sun-drenched continent of extraordinary natural wonders, from the Great Barrier Reef to the ancient outback. Australia offers an enviable outdoor lifestyle, world-class cities, and competitive immigration pathways for skilled workers.

## Key Highlights
- Iconic natural wonders including the Great Barrier Reef and Uluru
- High quality of life with year-round outdoor lifestyle
- Competitive points-based immigration for skilled workers',
	'Australia is a vast island continent in the southern hemisphere, offering a unique combination of world-class cities, extraordinary natural landscapes, and one of the highest standards of living globally. Sydney, Melbourne, Brisbane, and Perth are cosmopolitan cities with thriving economies, vibrant cultural scenes, and excellent infrastructure, while the vast outback contains ancient indigenous cultural sites, unique wildlife, and dramatic landscapes found nowhere else on Earth. The Great Barrier Reef, the world''s largest coral reef system, is one of the planet''s most irreplaceable natural wonders. Australia''s economy is diverse and resilient, with strengths in mining, agriculture, financial services, and a growing technology sector. The country operates a points-based immigration system that actively recruits skilled workers from around the world, with various visa pathways for professionals, students, and investors. English is the primary language, making integration straightforward for English speakers. Australia''s healthcare system combines universal coverage (Medicare) with private options. The cost of living, particularly in Sydney and Melbourne, is high, with housing being a major expense. Australian culture emphasizes outdoor living, sport, informality, and multiculturalism, creating a relaxed and welcoming society. The country''s unique wildlife, including kangaroos, koalas, and diverse marine life, adds to its extraordinary appeal.'
),
(
	'Oceania', 'New Zealand', 'NZ',
	'https://flagcdn.com/nz.svg',
	'https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=800&q=80',
	'A breathtaking land of fiords, volcanoes, and vast green landscapes made famous by The Lord of the Rings. New Zealand offers clean living, friendly immigration, and a superb quality of life in one of the world''s most pristine environments.

## Key Highlights
- Spectacular landscapes from fiords to volcanic plateaus
- Clean, safe environment with accessible immigration policies
- Rich Māori cultural heritage enriching national identity',
	'New Zealand is a Pacific island nation of extraordinary natural beauty, comprising two main islands with dramatically different characters: the North Island featuring volcanic plateaus and geothermal activity, and the South Island with the Southern Alps, fiords, glaciers, and vast plains. Wellington is the compact, creative capital, while Auckland is the largest city and economic hub. New Zealand consistently ranks among the world''s safest, most livable, and least corrupt nations. The country''s immigration system is relatively accessible, with various pathways for skilled workers, entrepreneurs, and investors through the points-based Skilled Migrant Category. New Zealand''s Māori culture is integral to national identity, with te reo Māori recognized as an official language. The economy is strong in agriculture, tourism, film production, and a growing technology sector. The country gained international fame as the filming location for The Lord of the Rings and The Hobbit trilogies. New Zealand''s clean environment, excellent outdoor recreation, and friendly people make it consistently popular with both visitors and immigrants. The cost of living is moderate to high, with Auckland particularly expensive for housing. The country''s geographic remoteness is both a challenge and a virtue, preserving its pristine environment and distinct culture while requiring long-haul flights for international travel.'
),
(
	'Asia', 'Singapore', 'SG',
	'https://flagcdn.com/sg.svg',
	'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
	'Asia''s premier financial hub and city-state, Singapore combines extraordinary efficiency, safety, and multicultural harmony. A global business gateway with world-class infrastructure and unparalleled strategic positioning between East and West.

## Key Highlights
- World-class financial hub with exceptional business environment
- Extraordinary safety, cleanliness, and operational efficiency
- Strategic location with multicultural English-speaking society',
	'Singapore is a city-state island nation at the southern tip of the Malay Peninsula, ranking as one of the world''s most efficient, prosperous, and livable places despite its tiny size. It serves as Asia''s premier financial hub, hosting major banks, investment firms, and regional headquarters for multinational corporations alongside one of the world''s busiest container ports. English is an official language alongside Malay, Mandarin Chinese, and Tamil, making it uniquely accessible for international professionals. Singapore consistently ranks at the top of global indices for ease of doing business, rule of law, and corruption-free governance. The country''s multicultural society — comprising Chinese, Malay, Indian, and expatriate communities — creates a uniquely cosmopolitan Asian environment. Singapore''s infrastructure is world-class, featuring an ultra-efficient MRT network, exceptional healthcare, and renowned educational institutions. The cost of living is among Asia''s highest, particularly for housing. The country offers multiple immigration pathways for skilled professionals, entrepreneurs, and investors through Employment Passes and EntrePass programs. Singapore''s strategic location as a hub between East and West makes it ideal for businesses serving both Asian and Western markets. The tiny country has almost no natural resources yet achieved extraordinary prosperity through human capital, smart governance, and strategic positioning.'
),
(
	'Asia', 'Hong Kong', 'HK',
	'https://flagcdn.com/hk.svg',
	'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=800&q=80',
	'A dynamic Special Administrative Region with one of the world''s most iconic skylines. Hong Kong blends East and West in a compact vertical city offering major financial opportunities, vibrant Cantonese culture, and unique historical heritage.

## Key Highlights
- World-class financial center with iconic Victoria Harbour skyline
- Unique blend of Chinese and international cultures
- Exceptional Cantonese cuisine and vibrant urban energy',
	'Hong Kong is a Special Administrative Region of China, situated on the southeastern coast of mainland China, known for its dramatic skyline, deep natural harbor, and unique position as a meeting point of Chinese and international cultures. Hong Kong operates under the "one country, two systems" framework, maintaining its own legal system based on English common law, currency, and immigration policies separate from mainland China. The city developed as a major British trading port and transformed into one of Asia''s leading financial centers, housing major banks, stock exchanges, and investment firms. Victoria Harbour provides one of the world''s most spectacular urban waterfronts. Cantonese is the primary language, though English is widely spoken in business, legal, and government contexts. Hong Kong''s cuisine, particularly dim sum and seafood, is world-renowned and considered among Asia''s finest. The city offers excellent transportation, world-class healthcare at private hospitals, and exceptional connectivity. Political changes since 2020 have affected the city''s governance and seen significant emigration waves to the UK, Canada, and Australia. Hong Kong remains an important financial hub with significant opportunities, though the evolving political situation requires careful consideration for those considering relocation. The cost of living, particularly housing, is among the world''s highest.'
),
(
	'Europe', 'Czechia', 'CZ',
	'https://flagcdn.com/cz.svg',
	'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
	'A Central European cultural gem centered on fairytale Prague, one of Europe''s most beautiful cities. Czechia combines EU membership, affordable living, world-class beer culture, and a growing technology sector.

## Key Highlights
- Fairytale Prague with world-class medieval architecture
- Affordable EU living with exceptional quality of life
- World-renowned beer culture and growing startup ecosystem',
	'Czechia (officially the Czech Republic) is a Central European nation landlocked between Germany, Austria, Slovakia, and Poland, with Prague as its capital and one of Europe''s most architecturally magnificent cities. Prague''s historic center, largely undamaged during World War II, features stunning Gothic, Baroque, and Art Nouveau architecture across its bridges, castles, and cobblestone old town. Czechia joined the EU in 2004, providing residents with access to the single market and freedom of movement, though the country retains its own currency (Czech Koruna). The cost of living is considerably lower than Western Europe, making it attractive for digital nomads and remote workers maintaining Western incomes. Czech beer is world-renowned as among the finest in the world, and the country has the highest per capita beer consumption globally. The economy is diversified with strong manufacturing, particularly automotive, alongside growing technology and startup sectors in Prague and Brno. Czech people are known for their directness, dry humor, and strong secular traditions. Learning Czech is helpful but English is widely spoken among younger generations and in business contexts. The country offers excellent public transportation, good healthcare, and a high quality of life relative to cost. Czechia''s cultural richness, historical depth, and central European location make it an increasingly popular destination for expats and digital nomads seeking affordable EU living.'
),
(
	'Europe', 'Slovakia', 'SK',
	'https://flagcdn.com/sk.svg',
	'https://images.unsplash.com/photo-1564689510742-4e9c7584c1f8?auto=format&fit=crop&w=800&q=80',
	'A Central European hidden gem with dramatic mountain landscapes and hundreds of medieval castles. Slovakia''s EU and Eurozone membership, combined with Bratislava''s unique tri-border location, makes it an underrated expat destination.

## Key Highlights
- Dramatic Tatra Mountains and hundreds of preserved medieval castles
- Affordable EU/Eurozone living with a growing economy
- Bratislava''s unique proximity to Vienna and Budapest',
	'Slovakia is a Central European nation that gained independence in 1993 following the peaceful "Velvet Divorce" from Czechoslovakia, and has since developed into a successful EU and Eurozone member. Bratislava, the compact capital, sits uniquely at the junction of three countries (Slovakia, Austria, and Hungary), with Vienna and Budapest each less than an hour away — making it ideal for those wishing to access multiple major European cities easily. Slovakia is characterized by dramatic natural landscapes including the High Tatra Mountains, offering some of Central Europe''s best skiing and hiking, alongside hundreds of medieval castles scattered across the countryside. The country has attracted significant foreign manufacturing investment, particularly in the automotive sector, with major plants operated by Volkswagen, Kia, and Stellantis. The cost of living is among the lowest in the Eurozone, making it extremely attractive for remote workers and digital nomads maintaining incomes in stronger currencies. Slovak people are known for warmth and hospitality, and English is growing among younger generations and professionals. Healthcare is adequate and the public education system is solid. Bratislava''s restaurant and bar scene is excellent, and the cultural scene is developing rapidly. The country''s proximity to Vienna also means residents have easy access to one of Europe''s greatest cultural capitals.'
),
(
	'Europe', 'Bulgaria', 'BG',
	'https://flagcdn.com/bg.svg',
	'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=800&q=80',
	'The EU''s most affordable country combines Black Sea beaches, ancient Thracian history, and Balkan mountain landscapes. Bulgaria offers some of Europe''s lowest living costs alongside EU membership and a rapidly growing technology sector.

## Key Highlights
- EU''s most affordable cost of living with flat 10% income tax
- Beautiful Black Sea coastline and world-class ski resorts
- Growing tech sector with strong IT talent pool',
	'Bulgaria is a Southeastern European nation and EU member state bordering Romania, Serbia, North Macedonia, Greece, and Turkey, with significant Black Sea coastline. Sofia, the capital, is a pleasant mid-sized city with Roman ruins beneath its streets, an impressive Alexander Nevsky Cathedral, and a growing tech scene. Bulgaria holds the distinction of being the EU''s most affordable country, with living costs dramatically lower than Western Europe, making it particularly attractive for retirees, remote workers, and entrepreneurs. The Black Sea coast features popular resort towns like Sunny Beach and Varna, attracting summer tourists from across Europe. The Balkan and Rila Mountains offer excellent skiing at world-class resorts, particularly Bansko, at a fraction of the cost of Western European alternatives. Bulgaria has a rapidly growing IT sector, with Sofia becoming an emerging tech hub with companies providing services across Europe. The country has a flat income tax rate of 10%, one of the lowest in the EU, and a flat corporate tax rate of 10%. Bulgarian is a South Slavic language using the Cyrillic alphabet, and English proficiency is growing rapidly among younger people in urban areas. Challenges include bureaucratic inefficiencies and variable service quality outside major cities. Bulgaria offers compelling value against a backdrop of Mediterranean-influenced climate and a rich cultural heritage from ancient Thracian, Greek, Roman, and Byzantine civilizations.'
),
(
	'Europe', 'Romania', 'RO',
	'https://flagcdn.com/ro.svg',
	'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
	'Home to Transylvania''s Gothic castles, the Carpathian Mountains, and vibrant Bucharest, Romania offers EU membership at some of Europe''s most affordable prices. A rapidly growing tech sector is turning it into Central Europe''s next startup destination.

## Key Highlights
- Iconic Transylvania with Bran Castle and Carpathian forests
- Affordable EU living with Europe''s fastest internet speeds
- Booming technology industry and rapidly modernizing economy',
	'Romania is a Southeastern European nation and EU member state with a rich cultural heritage blending Latin, Slavic, and Dacian traditions. The country is internationally famous for Transylvania, with its Gothic castles, medieval towns, and legends — Bran Castle near Brașov being the most visited landmark. Bucharest, the capital, earned the nickname "Little Paris" in the early 20th century for its grand boulevards and architecture, and today hosts a growing startup ecosystem and lively arts scene. Romania has some of Europe''s fastest internet speeds and highest broadband penetration, supporting a thriving IT and software development sector. The cost of living is among the lowest in the EU, making Bucharest and other cities extremely attractive for digital nomads who earn in stronger currencies. The Carpathian Mountains, Black Sea coast, and Danube Delta provide extraordinary natural diversity. The Danube Delta, one of Europe''s largest wetland areas, is a UNESCO World Heritage site of exceptional biodiversity. Romanian is a Romance language with significant Latin roots, making it more accessible to speakers of Spanish, French, Italian, or Portuguese. English proficiency is growing rapidly, particularly among younger generations, though it remains variable outside urban centers. Romania''s combination of history, natural beauty, affordability, and modernizing economy makes it one of Eastern Europe''s most compelling destinations.'
),
(
	'Europe', 'Luxembourg', 'LU',
	'https://flagcdn.com/lu.svg',
	'https://images.unsplash.com/photo-1548430395-ec39eaf2aa1a?auto=format&fit=crop&w=800&q=80',
	'Europe''s wealthiest nation per capita, Luxembourg punches far above its weight as a global financial center and EU institutional hub. This tiny Grand Duchy offers exceptional salaries, trilingual culture, and unparalleled access to the heart of Europe.

## Key Highlights
- Highest GDP per capita in the European Union
- Major global financial center and EU institutional hub
- Multilingual culture (Luxembourgish, French, German)',
	'Luxembourg is one of the world''s smallest and wealthiest nations, a Grand Duchy nestled between Belgium, France, and Germany in the heart of Western Europe. Luxembourg City, the capital, is a UNESCO World Heritage site built atop dramatic sandstone cliffs, featuring medieval fortifications alongside modern glass banking towers. The country boasts the highest GDP per capita in the EU, driven by its position as a leading European financial center hosting major banks, investment funds, and fintech companies. Luxembourg hosts several key European Union institutions, including the European Court of Justice and the European Court of Auditors, making it a hub for EU policy. The country is officially trilingual, with Luxembourgish, French, and German all recognized, and English very widely spoken in business. Luxembourg''s small size makes it extremely convenient to live and work, with excellent public transportation and connectivity to neighboring countries. The country''s tax policies have historically attracted international businesses, though regulations have tightened in response to EU directives. Despite high salaries, the cost of living — particularly housing — is extremely expensive. The country''s multicultural population (nearly half are non-Luxembourgish) creates a highly international environment. Luxembourg''s exceptional connectivity to Brussels, Paris, and Frankfurt makes it ideal for those working in European business and finance.'
),
(
	'Africa', 'South Africa', 'ZA',
	'https://flagcdn.com/za.svg',
	'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
	'Africa''s most developed economy combines Cape Town''s stunning natural beauty, world-class safari experiences, and remarkable cultural diversity. South Africa offers extraordinary wildlife, vibrant cities, and some of Africa''s best infrastructure.

## Key Highlights
- Iconic Cape Town beneath Table Mountain with vibrant culture
- World-class safari destinations and diverse Big Five wildlife
- Africa''s most developed infrastructure and economy',
	'South Africa is Africa''s most industrially developed nation, located at the southernmost tip of the African continent where the Atlantic and Indian Oceans meet. Cape Town is one of the world''s most dramatically beautiful cities, built below the iconic Table Mountain with stunning beaches and a vibrant cultural and culinary scene. Johannesburg is the economic powerhouse, while Pretoria serves as the administrative capital and Durban as the major coastal port city. South Africa is renowned for world-class safari experiences in Kruger National Park and numerous private game reserves offering encounters with the "Big Five." The country has 11 official languages reflecting its extraordinary cultural diversity, and is often called the "Rainbow Nation" following its peaceful transition from apartheid to democracy under Nelson Mandela in 1994. The economy is the most diversified on the continent, with mining, finance, tourism, manufacturing, and agriculture all significant. The cost of living is generally low compared to developed nations, making South Africa attractive for retirees and remote workers earning in foreign currencies. The country faces significant challenges including high unemployment, economic inequality, and variable safety standards in some urban areas. Excellent wine regions, particularly in the Western Cape, produce world-class vintages at very affordable prices. South Africa''s extraordinary natural beauty and cultural richness create an unparalleled quality of life for those who navigate its complexities.'
),
(
	'Europe', 'Slovenia', 'SI',
	'https://flagcdn.com/si.svg',
	'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
	'A tiny Central European gem with extraordinary natural beauty — from Lake Bled to the Julian Alps and Adriatic coast. Slovenia packs incredible diversity into a small territory with EU membership and exceptional sustainability credentials.

## Key Highlights
- Iconic Lake Bled surrounded by the Julian Alps
- EU member with excellent sustainability and green credentials
- Surprising diversity: Alps, caves, wine regions, and coastline in one country',
	'Slovenia is a small Central European nation that surprises visitors with how much it packs into its compact territory — just 20,000 square kilometers of stunning Alpine lakes, dramatic karst caves, wine regions, and a short but beautiful Adriatic coastline. Ljubljana, the charming capital, is consistently ranked among Europe''s most livable and sustainable cities, with a car-free center, vibrant cafe culture, and excellent quality of life. Lake Bled, with its island church and dramatic castle backdrop, is one of Europe''s most romantic and photographed landscapes. Slovenia was among the most prosperous republics of the former Yugoslavia and transitioned successfully to a market economy, joining both the EU and Eurozone in 2004 and 2007 respectively. The country consistently performs well in environmental sustainability rankings and has ambitious green energy goals. The economy is diversified with strengths in manufacturing, pharmaceuticals, and tourism. Slovenians have high English proficiency and are known for their outdoors-oriented, active lifestyle. The cost of living is moderate by EU standards, slightly lower than Western European countries. Slovenia''s geographic position makes it excellent for exploring neighboring Italy, Austria, Croatia, and Hungary. The country''s extraordinary natural landscapes, including Triglav National Park and the Škocjan Caves UNESCO World Heritage site, offer world-class outdoor pursuits across all seasons.'
),
(
	'Europe', 'Latvia', 'LV',
	'https://flagcdn.com/lv.svg',
	'https://images.unsplash.com/photo-1549614512-1a9fcb9a851b?auto=format&fit=crop&w=800&q=80',
	'The Baltic state with Europe''s finest Art Nouveau architecture in Riga, surrounded by amber Baltic beaches and ancient forests. Latvia offers EU membership, affordable living, and a growing fintech and digital economy.

## Key Highlights
- Riga''s UNESCO-listed Art Nouveau architecture quarter
- Affordable Baltic living with EU membership
- Growing fintech and IT sector',
	'Latvia is a Baltic state on the eastern shore of the Baltic Sea, sharing borders with Estonia, Lithuania, Russia, and Belarus. Riga, the capital and the Baltic''s largest city, is renowned for its extraordinary Art Nouveau architecture — with over 800 buildings in this style, one of the world''s most concentrated collections — alongside a beautifully preserved medieval old town designated as a UNESCO World Heritage site. Latvia joined the EU and NATO in 2004 and adopted the Euro in 2014, fully integrating into the Western political and economic community. The country has developed a significant fintech and IT sector, particularly in Riga, with companies providing financial technology services across Europe. The Baltic coastline features beautiful sandy beaches and amber-producing shores that gave the Baltic Sea its name. Latvian forests cover nearly 60% of the country''s territory, providing extraordinary natural environments. The cost of living is lower than Western Europe while maintaining solid quality of life. Latvian is the official language, though Russian is widely spoken by a significant minority population and English proficiency is high among younger generations. The country''s small population (under 2 million) creates a tight-knit society where networking is highly effective. Latvia has made significant investments in digital infrastructure and education, making it competitive in the knowledge economy and increasingly attractive to tech talent from across the EU.'
),
(
	'Europe', 'Lithuania', 'LT',
	'https://flagcdn.com/lt.svg',
	'https://images.unsplash.com/photo-1553408619-26c4abb4d22f?auto=format&fit=crop&w=800&q=80',
	'The Baltic state with a stunning baroque capital and the largest surviving medieval old town in Northern Europe. Lithuania combines EU membership, affordable living, and one of the EU''s fastest-growing fintech sectors.

## Key Highlights
- Vilnius: UNESCO-listed medieval old town with baroque architecture
- EU''s fastest growing fintech and licensed payments sector
- Affordable living with EU membership and a welcoming startup scene',
	'Lithuania is the southernmost and largest of the three Baltic states, with Vilnius as its capital and one of the best-preserved medieval old towns in Northern Europe, designated as a UNESCO World Heritage site for its extensive baroque architecture. Lithuania was the last European country to convert to Christianity in 1387, and its ancient pagan heritage continues to influence local culture and traditions. The country joined the EU and NATO in 2004 and adopted the Euro in 2015. Lithuania has emerged as a significant European fintech hub, with Vilnius hosting dozens of licensed payment institutions and electronic money firms that chose it as their EU passporting base. The city''s startup ecosystem is growing rapidly, supported by EU funding and government innovation programs. The cost of living is lower than Western Europe, making it attractive for remote workers and entrepreneurs. Lithuanian is the official language and one of the oldest living Indo-European languages. English is widely spoken among younger people and professionals. The country''s natural landscapes include the beautiful Curonian Spit (a UNESCO World Heritage site shared with Russia), extensive forests, and thousands of lakes. The Curonian Spit offers unique dune landscapes and traditional fishing culture. Lithuania''s relatively small size (under 3 million people) creates a close-knit business community where relationships matter greatly.'
),
(
	'Asia', 'China', 'CN',
	'https://flagcdn.com/cn.svg',
	'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
	'The world''s second largest economy and most populous nation offers unprecedented scale of opportunity alongside ancient cultural depth. From the Great Wall to Shanghai''s skyline, China presents a civilization of extraordinary complexity.

## Key Highlights
- World''s second largest economy with unparalleled market scale
- Extraordinary cultural heritage spanning 5,000 years
- Ultra-modern cities alongside ancient world wonders',
	'China is the world''s most populous nation and second largest economy, representing one of the oldest continuous civilizations on Earth with over 5,000 years of recorded history. Beijing, the capital, houses the Forbidden City, the world''s largest imperial palace complex, alongside Tiananmen Square and ancient temples. Shanghai is Asia''s premier financial and commercial hub, with a spectacular modern skyline along the Bund waterfront. China''s economic transformation over the past four decades has been historically remarkable, lifting hundreds of millions from poverty through manufacturing, technology, and trade. The country leads globally in internet users, electric vehicles, renewable energy capacity, and manufacturing. China operates an internet behind the "Great Firewall," requiring VPNs to access Google, Facebook, and many international websites. Mandarin Chinese is the official language, and learning it significantly opens professional and social opportunities. For foreigners, navigating China''s regulatory environment, visa system, and business culture requires patience and local knowledge. The country offers extraordinary regional diversity, from tropical Hainan Island to the Tibetan Plateau, the Gobi Desert, and the karst mountains of Guilin. China''s unique position as both an ancient civilization and ultramodern technological powerhouse makes it a fascinating but complex destination requiring significant preparation.'
),
(
	'Asia', 'Mongolia', 'MN',
	'https://flagcdn.com/mn.svg',
	'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
	'The world''s least densely populated country offers vast steppes, authentic nomadic culture, and the legacy of Genghis Khan''s legendary empire. Mongolia''s raw, untouched landscapes make it one of Earth''s last great wilderness frontiers.

## Key Highlights
- World''s least densely populated country with vast pristine steppe
- Rich nomadic heritage and authentic traditional culture
- Unique adventure opportunities from horseback riding to eagle hunting',
	'Mongolia is a landlocked country in Central and East Asia sandwiched between Russia and China, the world''s least densely populated nation with vast steppes, the Gobi Desert, and rugged mountains covering a territory larger than Western Europe. Ulaanbaatar, the capital, is home to nearly half the country''s population and sits at 1,350 meters altitude, making it one of the world''s coldest capital cities. Mongolian nomadic culture, with its tradition of moving with herds across the steppe and living in gers (yurts), remains alive and authentic. Genghis Khan founded the largest contiguous land empire in history from the Mongolian steppe in the 13th century, leaving a profound historical legacy visible in national pride and cultural traditions. Mongolia''s economy relies significantly on mining (coal, copper, gold, cashmere), with significant untapped mineral wealth attracting international investment. The country transitioned from a Soviet satellite state to democracy in 1990 and has been developing rapidly since. For adventurous travelers and expats, Mongolia offers extraordinary opportunities for horseback riding, eagle hunting with Kazakh eagle hunters, and experiencing nomadic hospitality. The extreme continental climate features brutal winters down to -40°C and hot summers. English is growing among younger people and those in the mining and tourism industries. Mongolia presents unique opportunities for those willing to embrace its challenges.'
),
(
	'Europe', 'Liechtenstein', 'LI',
	'https://flagcdn.com/li.svg',
	'https://images.unsplash.com/photo-1476929884616-23e8d302bc89?auto=format&fit=crop&w=800&q=80',
	'The world''s sixth smallest country, nestled between Switzerland and Austria in the Rhine Valley. Liechtenstein is a prosperous Alpine principality with a surprising industrial base, low tax rates, and stunning mountain scenery.

## Key Highlights
- Scenic Alpine principality with medieval Vaduz Castle
- Among Europe''s wealthiest nations per capita
- Low-tax environment with strong manufacturing and financial sector',
	'Liechtenstein is a tiny principality of just 160 square kilometers nestled between Switzerland and Austria in the Rhine Valley, yet it ranks among the world''s wealthiest nations per capita with a highly developed financial services sector and substantial manufacturing base. Vaduz, the capital, features the iconic Vaduz Castle on a hill overlooking the Rhine, alongside a small but impressive collection of museums and galleries. Despite its size, Liechtenstein has a remarkably diverse economy anchored in precision manufacturing (dental products, heating equipment, power tools), financial services, and ceramics. The country uses the Swiss franc as its currency and has a customs and monetary union with Switzerland. Liechtenstein is a member of the EEA and Schengen Area but not the EU, maintaining significant autonomy. It offers extremely low tax rates, attracting international businesses and wealthy residents. The principality''s small size (just 38,000 people) makes it exceptionally exclusive and intimate. The Alpine landscapes are beautiful, offering skiing, hiking, and outdoor activities across multiple seasons. Immigration and residency are strictly controlled, with very limited pathways for foreign nationals. Liechtenstein''s political stability, extraordinary prosperity, and natural beauty make it a fascinating if highly exclusive destination that deserves more attention from those exploring Central Europe.'
),
(
	'Asia', 'Saudi Arabia', 'SA',
	'https://flagcdn.com/sa.svg',
	'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
	'Rapidly transforming under Vision 2030, Saudi Arabia combines extraordinary ancient heritage with ultramodern development. The Kingdom offers tax-free income, world-class infrastructure investment, and an unprecedented national reinvention.

## Key Highlights
- Tax-free income with massive Vision 2030 infrastructure investment
- Extraordinary ancient heritage including UNESCO-listed AlUla
- Unprecedented modernization opening the Kingdom to the world',
	'Saudi Arabia is the largest country in the Middle East, occupying the majority of the Arabian Peninsula, and holds the world''s second largest proven oil reserves. Riyadh, the capital, is a modern metropolis undergoing rapid transformation under Crown Prince Mohammed bin Salman''s Vision 2030 program, which seeks to diversify the economy beyond oil through tourism, entertainment, technology, and finance. The country has undertaken remarkable social reforms since 2017, including allowing women to drive, opening cinemas, and developing a tourism industry that was previously nonexistent. Saudi Arabia offers zero personal income tax, attracting skilled expatriate workers across energy, finance, healthcare, education, and construction sectors. The country is developing extraordinary projects including NEOM, a planned futuristic city in the northwest, and Red Sea tourism developments on pristine coastline. Ancient heritage sites including AlUla, home to Nabataean tombs comparable to Petra in Jordan, are becoming major international attractions. Islamic law and customs shape public life, requiring respectful observance by expatriates. The weather is extremely hot, particularly in summer, with inland temperatures regularly exceeding 45°C. The Kingdom''s transformation from a largely closed society to one actively welcoming tourists and skilled workers represents one of the most significant changes in the region''s modern history, creating genuine opportunities for those willing to adapt.'
),
(
	'Asia', 'Vietnam', 'VN',
	'https://flagcdn.com/vn.svg',
	'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
	'A Southeast Asian gem of extraordinary beauty — from Ha Long Bay''s limestone karsts to the ancient streets of Hoi An. Vietnam offers unbeatable affordability, rich history, world-class street food, and one of Asia''s most vibrant expat communities.

## Key Highlights
- Breathtaking Ha Long Bay and UNESCO-listed ancient town of Hoi An
- Exceptional affordability making it a top digital nomad destination
- Rich culture, delicious cuisine, and genuinely warm hospitality',
	'Vietnam is a long, narrow Southeast Asian nation stretching 1,650 kilometers along the eastern edge of the Indochina Peninsula, offering extraordinary geographical diversity from the northern mountains and terraced rice fields of Sapa to the UNESCO-listed limestone karsts of Ha Long Bay, the ancient trading town of Hoi An, and the tropical beaches of Phu Quoc. Hanoi, the capital in the north, preserves colonial French architecture and ancient Old Quarter streets, while Ho Chi Minh City (Saigon) in the south is a bustling modern metropolis. Vietnam has undergone remarkable economic transformation since the Doi Moi reforms of 1986, emerging as one of Southeast Asia''s fastest growing economies. The cost of living is extraordinarily low by international standards, making Vietnam one of the world''s most popular digital nomad destinations, particularly Da Nang and Hoi An. Vietnamese cuisine is celebrated globally for its fresh herbs, complex broths, and regional diversity, with dishes like pho, banh mi, and fresh spring rolls having wide international recognition. The country offers excellent street food culture, vibrant cafe scenes, and a genuinely warm welcome to foreigners. Vietnamese is the official language, and English is growing especially in urban and tourist areas. Visa regulations have been easing, with e-visa available for many nationalities. Vietnam''s combination of natural beauty, cultural depth, affordability, and dynamism makes it exceptional for both short visits and long-term stays.'
),
(
	'South America', 'Argentina', 'AR',
	'https://flagcdn.com/ar.svg',
	'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
	'The land of tango, Malbec, and Patagonia offers one of South America''s richest cultural experiences. Despite economic challenges, Argentina''s sophisticated Buenos Aires, extraordinary natural landscapes, and warm people create an irresistible destination.

## Key Highlights
- World-class Malbec wine and legendary Argentine beef cuisine
- Dramatic Patagonia with glaciers and some of the world''s finest wilderness
- Vibrant Buenos Aires with world-class tango, culture, and nightlife',
	'Argentina is South America''s second largest country, extending from the subtropical north to the subarctic reaches of Patagonia and Tierra del Fuego, encompassing extraordinary natural diversity. Buenos Aires, the capital, is one of Latin America''s most sophisticated and European-influenced cities, with world-class restaurants, tango culture, vibrant nightlife, and a passionate football culture. Argentina is renowned globally for its premium Malbec wines from Mendoza and exceptional beef, with Argentine asado (barbecue) culture deeply embedded in national identity. Patagonia in the south offers some of the planet''s most dramatic landscapes: Perito Moreno Glacier, the jagged Fitz Roy massif, and pristine wilderness that draws adventurers from around the world. The country has a highly educated, largely European-descended population with strong cultural and intellectual traditions. Argentina has faced persistent economic challenges including chronic inflation and currency instability, which has paradoxically made it very affordable for those earning in foreign currencies — digital nomads and remote workers can live extremely well on modest US dollar incomes. Spanish is the official language, with the distinctive Rioplatense accent. Despite economic challenges, Argentina''s cultural richness, natural beauty, food culture, and warm people make it deeply appealing and one of South America''s most compelling destinations.'
),
(
	'South America', 'Brazil', 'BR',
	'https://flagcdn.com/br.svg',
	'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
	'South America''s giant captivates with Carnival, the Amazon, and Rio de Janeiro''s iconic beaches. Brazil offers the continent''s largest economy, extraordinary biodiversity, vibrant culture, and a warmth of spirit unmatched anywhere in the world.

## Key Highlights
- Iconic Rio de Janeiro, Carnival celebrations, and Copacabana
- The Amazon: world''s largest rainforest and greatest biodiversity
- Vibrant Brazilian culture and extraordinarily warm, welcoming people',
	'Brazil is South America''s largest and most populous nation, the world''s fifth largest country, and the dominant economic power of the continent. Rio de Janeiro, with its stunning natural setting between mountains and sea, is globally iconic for Carnival, the statue of Christ the Redeemer, Copacabana beach, and samba culture. São Paulo, the economic capital, is Latin America''s largest city and financial hub, with world-class restaurants, museums, and business opportunities. The Amazon Basin covers much of Brazil''s interior and represents the world''s largest tropical rainforest, containing approximately 10% of all species on Earth. Brazil is enormously diverse, with indigenous, European, African, and Asian influences creating a unique multicultural identity. The country has the 11th largest economy in the world, with significant sectors in agriculture, mining, manufacturing, and a rapidly growing technology sector. São Paulo''s tech scene and startup ecosystem is among Latin America''s most dynamic. Portuguese is Brazil''s official language, and the country is linguistically distinct from its Spanish-speaking neighbors. The cost of living varies dramatically by city and region. Brazil offers visa pathways for skilled workers, investors, and digital nomads through its Digital Nomad Visa program. The country''s extraordinary cultural richness, natural diversity, and the warmth of its people make it one of the world''s most captivating destinations.'
),
(
	'Asia', 'India', 'IN',
	'https://flagcdn.com/in.svg',
	'https://images.unsplash.com/photo-1524492412937-b28074a47d70?auto=format&fit=crop&w=800&q=80',
	'The world''s most populous democracy offers a civilization of extraordinary depth, diversity, and scale. From the Taj Mahal to Bangalore''s Silicon Valley, India''s combination of ancient culture and technological ambition is reshaping the 21st century.

## Key Highlights
- World''s largest democracy with extraordinary cultural diversity
- Bangalore and Hyderabad as global information technology hubs
- Iconic monuments including the Taj Mahal and thousands of ancient temples',
	'India is the world''s most populous country and largest democracy, a civilization of extraordinary depth spanning over 5,000 years of continuous history. The country is home to an astonishing diversity of languages (22 officially recognized), religions, cuisines, and cultural traditions across 28 states. New Delhi is the capital, while Mumbai is the financial and entertainment capital, and Bengaluru (Bangalore) has become one of the world''s major technology hubs — often called the "Silicon Valley of India." India is the world''s third largest startup ecosystem and a major force in global information technology, pharmaceuticals, finance, and manufacturing. The Taj Mahal in Agra, built by Emperor Shah Jahan in the 17th century, is arguably the world''s most recognizable monument, while Rajasthan''s palaces, Kerala''s backwaters, and the Himalayan peaks offer extraordinary additional attractions. Indian cuisine encompasses an astonishing variety of regional specialties, from the rich Mughal-influenced dishes of the north to the coconut-based curries of the south. The cost of living is very low by international standards, making India excellent for budget-conscious expats. English is widely spoken in business and education, a legacy of British colonial history, making India very accessible to English-speaking professionals. India''s rapid economic growth, young population, and tech-forward culture make it one of the 21st century''s most dynamic societies.'
),
(
	'Asia', 'Malaysia', 'MY',
	'https://flagcdn.com/my.svg',
	'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
	'A multiethnic Southeast Asian gem where Malay, Chinese, and Indian cultures create extraordinary cuisine and vibrant diversity. Kuala Lumpur offers modern infrastructure, affordable living, and the Malaysia My Second Home program.

## Key Highlights
- Extraordinary multicultural cuisine ranked among Asia''s finest
- Affordable modern living with the Malaysia My Second Home program
- Borneo''s ancient rainforests and world-class marine ecosystems',
	'Malaysia is a Southeast Asian nation of remarkable cultural diversity, split between the Malay Peninsula and the northern portion of the island of Borneo. Kuala Lumpur, the capital, is a modern metropolis dominated by the iconic Petronas Twin Towers, with excellent infrastructure, world-class shopping, and diverse food offerings at very affordable prices. Malaysia''s multicultural society — comprising Malay, Chinese, Indian, and indigenous communities — creates one of the world''s most diverse and celebrated food cultures, with hawker centers offering extraordinary variety. The country operates the MM2H (Malaysia My Second Home) program, one of Southeast Asia''s most established long-term residency programs for retirees and remote workers. Malaysian Borneo (Sabah and Sarawak) offers ancient rainforests, diverse wildlife including orangutans and pygmy elephants, and some of the world''s best diving at Sipadan. The cost of living is very reasonable, with quality meals available for a few dollars and comfortable accommodation at a fraction of Western prices. English is widely spoken as a business and educational language, making Malaysia very accessible to English speakers. The country is predominantly Muslim, and Islamic law applies to Muslim residents. Malaysia''s combination of modernity, affordability, natural beauty, and cultural richness makes it consistently popular among expats, particularly retirees and digital nomads.'
),
(
	'Europe', 'Moldova', 'MD',
	'https://flagcdn.com/md.svg',
	'https://images.unsplash.com/photo-1627408236286-3f36d5e0d9d7?auto=format&fit=crop&w=800&q=80',
	'Europe''s least visited country harbors a remarkable secret: thousands of cave wine cellars making it one of the world''s most surprising wine destinations. Moldova is modernizing rapidly with EU candidate status driving significant reform.

## Key Highlights
- World-class wine country with cave cellars holding millions of bottles
- Europe''s most affordable destination for budget travelers
- EU candidate status driving rapid modernization and reform',
	'Moldova is a small landlocked Eastern European nation sandwiched between Romania and Ukraine, often cited as Europe''s least visited country despite having genuine attractions for curious travelers. Chișinău, the capital, is a pleasant city with Soviet-era architecture, excellent restaurants, and an increasingly cosmopolitan atmosphere as the country modernizes. The country''s extraordinary wine culture is its most compelling draw — Cricova and Mileștii Mici operate the world''s largest wine cellars, with tens of kilometers of underground tunnels carved into limestone holding millions of bottles. Moldova consistently produces excellent wines, particularly from indigenous Fetească grape varieties, at astonishingly low prices. The country received EU candidate status in 2022, following Russia''s invasion of Ukraine, and is working toward reforms that may lead to EU membership within the next decade. This prospect is driving modernization across governance, infrastructure, and digital services. Moldova is home to the breakaway region of Transnistria, a Soviet-era enclave along the Dniester River that operates quasi-independently. The cost of living is among Europe''s lowest, and the country offers genuine hospitality. Romanian-speaking Moldovans can travel on Romanian passports, granting EU rights. The country faces challenges including poverty, significant emigration, and dependency on remittances from the diaspora, but offers remarkable character.'
),
(
	'Europe', 'Albania', 'AL',
	'https://flagcdn.com/al.svg',
	'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=800&q=80',
	'The Balkans'' hidden gem is emerging from decades of isolation to reveal stunning Adriatic and Ionian coastlines, preserved Ottoman old towns, and Europe''s most affordable lifestyle. Albania''s natural beauty and authentic hospitality are extraordinary.

## Key Highlights
- Pristine Ionian and Adriatic beaches at a fraction of European prices
- Preserved Ottoman old towns and dramatic mountain landscapes
- EU candidate country with very affordable and authentic lifestyle',
	'Albania is a small Southeastern European nation on the Balkan Peninsula, bordered by the Adriatic and Ionian Seas to the west, with a coastline increasingly recognized as one of Europe''s most beautiful and undiscovered. Tirana, the capital, has transformed from a grey Communist-era city into a colorful, dynamic metropolis with excellent restaurants, vibrant nightlife, and a growing cafe culture. Albania''s Riviera, stretching south along the Ionian coast, features crystal-clear turquoise waters, dramatic clifftop villages, and beaches that rival those of Croatia or Greece at a fraction of the cost. The country''s interior conceals remarkable treasures: Gjirokastër''s UNESCO-listed Ottoman old town, the ancient ruins of Butrint, and the Albanian Alps offering challenging trekking routes. Albania was one of the most isolated Communist states in the world until 1991 and is still working through its post-Communist transition, though progress has been significant. The country has EU candidate status, driving governance and institutional reforms. The cost of living is among Europe''s lowest, making it very attractive for budget-conscious digital nomads — Albania has become an increasingly popular nomad destination. Albanians are known for their extraordinary hospitality: the concept of "besa" (sacred guest protection) remains central to cultural identity. Albanian is the official language; Italian and English are widely spoken in tourism areas. Albania''s combination of beauty, affordability, and authenticity is genuinely exceptional.'
),
(
	'Asia', 'Georgia', 'GE',
	'https://flagcdn.com/ge.svg',
	'https://images.unsplash.com/photo-1565008887078-5e4f9a8cd5e8?auto=format&fit=crop&w=800&q=80',
	'The Caucasus crossroads of Europe and Asia offers the world''s oldest winemaking tradition, stunning mountain landscapes, and legendary hospitality. Tbilisi''s bohemian charm has made Georgia a global digital nomad hotspot.

## Key Highlights
- World''s oldest winemaking tradition with unique qvevri clay vessels
- Stunning Greater Caucasus mountains and ancient cave cities
- Extremely welcoming visa-free policy and flat 20% income tax',
	'Georgia is a small Caucasian nation at the crossroads of Europe and Asia, situated south of the Greater Caucasus mountains, bordering Russia, Armenia, Azerbaijan, and Turkey. Tbilisi, the capital, is a city of extraordinary bohemian charm with a strikingly diverse architectural heritage from ancient Persian to Soviet-era and contemporary design, a vibrant arts scene, and a world-class electronic music scene that has earned Tbilisi a reputation as one of Europe''s most exciting emerging cities. Georgia is widely recognized as the world''s oldest wine region, with evidence of winemaking dating back 8,000 years, using the unique qvevri clay vessels buried underground for fermentation and aging. The country harbors remarkable natural and cultural heritage including the cave city of Uplistsikhe, the ancient capital Mtskheta, and the spectacular Kazbegi region in the Greater Caucasus mountains. Georgia offers one of the world''s most welcoming visa policies, allowing citizens of most nations to stay for up to a year without a visa, alongside a very low flat tax rate, making it extremely attractive for remote workers and entrepreneurs. The cost of living is low, the food is exceptional (khinkali dumplings, khachapuri cheese bread), and Georgians have a legendary reputation for hospitality. English is growing rapidly among younger people and the significant expat community that has built up in Tbilisi in recent years.'
),
(
	'Asia', 'Israel', 'IL',
	'https://flagcdn.com/il.svg',
	'https://images.unsplash.com/photo-1544948982-5aabd0a81ce4?auto=format&fit=crop&w=800&q=80',
	'The "Startup Nation" is one of the world''s most innovative countries, punching far above its weight in technology, biotech, and venture capital. Israel offers ancient holy sites, Mediterranean beaches, and a dynamic society shaped by extraordinary cultural convergence.

## Key Highlights
- World-leading startup ecosystem and innovation culture
- Ancient holy sites sacred to three world religions
- Mediterranean beaches alongside vibrant modern Tel Aviv',
	'Israel is a small Middle Eastern nation on the eastern Mediterranean coast, occupying one of the world''s most historically and religiously significant territories. Jerusalem, home to the Western Wall, Church of the Holy Sepulchre, and al-Aqsa Mosque, is sacred to Judaism, Christianity, and Islam simultaneously. Tel Aviv, the modern commercial capital, is a sun-drenched Mediterranean city with excellent beaches, world-class restaurants, vibrant nightlife, and one of the world''s most dynamic startup ecosystems. Israel is nicknamed the "Startup Nation" for its extraordinarily high concentration of technology startups and venture capital investment relative to its size, with particular strengths in cybersecurity, agriculture technology, medical devices, and artificial intelligence. The country''s mandatory military service for most citizens creates a culture of resourcefulness and leadership that contributes to entrepreneurial success. Hebrew is the official language alongside Arabic; English is widely spoken in business and urban environments. The cost of living in Tel Aviv is among the world''s highest, particularly for housing. Israel''s geopolitical situation in the Middle East requires awareness of security considerations and regional dynamics. The country has excellent universities, world-class healthcare, and a high standard of living. Israeli society is diverse, comprising Jewish Israelis from many national backgrounds, Arab Israelis, and various religious communities, creating a uniquely complex and vibrant culture shaped by the world''s most ancient histories.'
),
(
	'North America', 'Bahamas', 'BS',
	'https://flagcdn.com/bs.svg',
	'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
	'A Caribbean paradise of 700 islands with crystal-clear waters and iconic pink sand beaches. The Bahamas offers zero income tax, an established offshore financial sector, and a luxury lifestyle just 50 miles from Miami.

## Key Highlights
- Crystal-clear turquoise waters and famous pink sand beaches
- Zero income, capital gains, and wealth taxes
- Strategic location just 50 miles from Florida with USD economy',
	'The Bahamas is an archipelago nation of approximately 700 islands and 2,400 cays stretching 760 miles southeast from Florida, offering some of the Caribbean''s most spectacular beaches and marine environments. Nassau, the capital on New Providence Island, is the commercial and financial hub, while Paradise Island hosts luxury resorts and Atlantis, one of the world''s largest resort complexes. The Bahamas is well-established as a tax-advantaged jurisdiction, with no personal income tax, no capital gains tax, no wealth tax, and no inheritance tax, making it attractive to high-net-worth individuals and international businesses. The country has developed a strong financial services sector alongside tourism. The Bahamas Permanent Residency is available to those purchasing property above certain thresholds, providing a pathway to long-term stays. The Out Islands (Family Islands) offer extraordinary off-the-beaten-track experiences with pristine reefs and the famous swimming pigs of Big Major Cay. The climate is warm and sunny year-round, though hurricane season (June-November) poses risks. The cost of living is high, particularly for food and consumer goods, which are largely imported. English is the official language, making the Bahamas very accessible to American and British expatriates seeking a Caribbean lifestyle without language barriers. The proximity to Miami provides excellent air connectivity and easy access to major US services.'
),
(
	'Asia', 'Pakistan', 'PK',
	'https://flagcdn.com/pk.svg',
	'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&w=800&q=80',
	'A South Asian nation of extraordinary contrasts — from the ancient ruins of Mohenjo-daro to the world''s highest mountain ranges. Pakistan offers remarkable landscapes, genuine hospitality, and K2''s dramatic peaks attracting mountaineers worldwide.

## Key Highlights
- K2 and the world''s greatest concentration of high mountains
- Ancient Indus Valley civilization sites (Mohenjo-daro, Harappa)
- Extraordinary hospitality and very affordable living costs',
	'Pakistan is a South Asian country of approximately 230 million people, the world''s fifth most populous nation, sharing borders with India, Afghanistan, Iran, and China. Islamabad, the planned capital, sits in a natural bowl between the Margalla Hills, while Lahore is the cultural heart of Punjab with extraordinary Mughal architecture including the Badshahi Mosque and Lahore Fort. Karachi on the Arabian Sea is the commercial and financial capital. Pakistan encompasses some of the world''s highest mountains — the Karakoram range includes K2 (the world''s second highest peak) alongside over 60 other peaks exceeding 7,000 meters, making it a premier destination for serious mountaineers. The Hunza Valley and Gilgit-Baltistan region offer some of the most spectacular mountain scenery on Earth. Pakistan''s history spans some of the earliest human civilizations, including Mohenjo-daro and Harappa, ancient cities of the Indus Valley Civilization dating to 3,000 BCE. The country faces significant challenges including political instability and variable infrastructure. However, the Pakistani people are extraordinarily hospitable, and travel in the northern mountain regions is considered safe and rewarding. The cost of living is very low by international standards. Urdu is the national language, though English has official status and is used in government, education, and business. Pakistan''s extraordinary natural landscapes remain among the world''s most undervisited and spectacular.'
),
(
	'Asia', 'Qatar', 'QA',
	'https://flagcdn.com/qa.svg',
	'https://images.unsplash.com/photo-1562832135-14a35d25edef?auto=format&fit=crop&w=800&q=80',
	'The world''s wealthiest country per capita, Qatar transformed from a pearl-diving backwater to a global powerhouse in just decades. Doha offers ultramodern architecture, tax-free salaries, and world-class cultural investment.

## Key Highlights
- World''s highest GDP per capita driven by natural gas wealth
- Ultramodern Doha with world-class museums and architecture
- Tax-free income with significant investment in expat lifestyle and culture',
	'Qatar is a small peninsular country in the Persian Gulf, transformed from a modest pearl-fishing economy to one of the world''s wealthiest nations through its vast natural gas reserves. Doha, the capital, is a showcase of ultramodern architecture and urban planning, with the striking Museum of Islamic Art, innovative Pearl-Qatar island development, and world-class cultural institutions. Qatar hosted the 2022 FIFA World Cup, accelerating a massive infrastructure investment program that built world-class stadiums, metro systems, and transformed the capital into a genuine global city. The country''s North Field gas reservoir contains the world''s largest single natural gas reserve, generating extraordinary sovereign wealth managed through the Qatar Investment Authority. Expatriates constitute approximately 88% of Qatar''s population, making it one of the world''s most international societies. The country offers zero personal income tax and excellent infrastructure, making it attractive for skilled workers in energy, finance, healthcare, education, and construction. Islamic law and conservative social norms apply, requiring respect for local customs. The climate is extremely hot in summer, with temperatures regularly exceeding 45°C. Qatar has made significant investments in education through Education City, hosting branches of major American universities. The country''s ambition and willingness to invest in world-class cultural and educational institutions distinguishes it from other Gulf states.'
),
(
	'Europe', 'Bosnia and Herzegovina', 'BA',
	'https://flagcdn.com/ba.svg',
	'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?auto=format&fit=crop&w=800&q=80',
	'A Balkan jewel where Ottoman, Austro-Hungarian, and Yugoslav heritages converge in stunning Sarajevo. Bosnia and Herzegovina offers medieval towns, mountain rivers, and some of Europe''s most affordable and authentic living.

## Key Highlights
- Sarajevo''s extraordinary multicultural Ottoman-era old town
- Stunning mountains with world-class rafting and adventure activities
- One of Europe''s most affordable destinations with EU candidate status',
	'Bosnia and Herzegovina is a Southeastern European nation in the western Balkans, sharing borders with Croatia, Serbia, and Montenegro. Sarajevo, the capital, is one of Europe''s most unique cities, where Ottoman minarets, Austro-Hungarian architecture, and socialist-era apartment blocks converge in a valley surrounded by mountains — a legacy of the city''s complex multicultural history as a meeting point of civilizations. The Old Town (Baščaršija) features cobblestoned streets, traditional craftsmen''s shops, and the central Gazi Husrev-beg mosque dating to the 16th century. Mostar, with its iconic reconstructed Stari Most (Old Bridge) over the Neretva River, is one of the Balkans'' most photographed sites. The country endured a devastating war between 1992 and 1995 but has rebuilt and is developing as an EU candidate, with accession aspirations driving reforms. Bosnia has stunning mountain landscapes for skiing in winter and hiking in summer, and dramatic river canyons for white-water adventures. The Una and Neretva rivers are exceptional for rafting and kayaking. The cost of living is among Europe''s lowest. The country''s three constituent peoples — Bosniaks, Serbs, and Croats — give it linguistic accessibility (mutually intelligible South Slavic languages) and rich cultural diversity. Bosnia''s combination of history, natural beauty, affordability, and authenticity make it one of Europe''s most underrated destinations.'
),
(
	'Africa', 'Egypt', 'EG',
	'https://flagcdn.com/eg.svg',
	'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80',
	'Home to one of humanity''s greatest civilizations, Egypt captivates with the Pyramids of Giza, Nile River culture, and ancient temples spanning thousands of years. A bridge between Africa and the Middle East offering extraordinary history at accessible prices.

## Key Highlights
- Pyramids of Giza and Sphinx: the sole surviving ancient world wonder
- Extraordinary Nile Valley temples and pharaonic heritage
- World-class Red Sea diving and Mediterranean beaches',
	'Egypt is a transcontinental country primarily located in northeastern Africa, with the Sinai Peninsula forming a land bridge into Asia. Cairo, Africa''s largest city, serves as the capital and gateway to ancient civilization. The Pyramids of Giza, just outside Cairo, represent one of humanity''s most extraordinary engineering achievements and the sole surviving wonder of the ancient world. The Nile River, the world''s longest river, flows through Egypt''s eastern desert creating the fertile valley that sustained one of history''s greatest civilizations for over 5,000 years. Luxor contains the world''s greatest concentration of ancient Egyptian monuments, including Karnak Temple, the Valley of the Kings, and dozens of other extraordinary archaeological sites. The Red Sea coast offers world-class diving and snorkeling in pristine coral reef ecosystems, with resorts at Hurghada and Sharm el-Sheikh attracting divers from around the world. Egypt''s economy has revenues from tourism, Suez Canal transit fees, oil, and remittances. Arabic is the official language; English is widely spoken in tourism and business contexts. The cost of living is very low by international standards. Egypt''s extraordinary historical depth, vibrant urban culture, and geographical diversity — from deserts to Mediterranean coast — make it one of the world''s most compelling destinations for both short visits and long-term stays, particularly for history enthusiasts.'
),
(
	'Asia', 'Maldives', 'MV',
	'https://flagcdn.com/mv.svg',
	'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
	'Paradise found — the Maldives is the world''s lowest-lying nation, a string of coral atolls with crystal-clear turquoise lagoons, overwater bungalows, and some of the finest tropical luxury on Earth.

## Key Highlights
- World''s most iconic overwater bungalows above turquoise lagoons
- Exceptional coral reef diving and world-class marine biodiversity
- Ultimate luxury tropical destination with unparalleled natural beauty',
	'The Maldives is an island nation in the Indian Ocean southwest of Sri Lanka, comprising approximately 1,200 coral islands organized into 26 atolls, with a total land area of just 298 square kilometers spread across 90,000 square kilometers of ocean. Malé, the tiny capital island, is one of the world''s most densely populated cities, contrasting dramatically with the resort islands that have made the Maldives globally synonymous with luxury tropical holidays. The country pioneered the overwater bungalow concept, offering guests accommodation directly above crystal-clear turquoise lagoons with immediate access to extraordinary coral gardens teeming with marine life. The Maldives'' underwater world is among the planet''s finest for diving and snorkeling, with whale sharks, manta rays, sea turtles, and brilliant coral formations in exceptionally clear visibility. The economy is almost entirely dependent on luxury tourism alongside fishing. The Maldives is one of the countries most vulnerable to climate change — its highest point is just 2.4 meters above sea level, making the entire nation potentially threatened by rising seas. Islamic law applies, and alcohol is prohibited for locals (though available in resort islands). The cost of resort stays is among the world''s highest, while local islands offer more budget-friendly experiences. Long-term residency opportunities are limited, primarily through employment with resorts or significant investment programs.'
),
(
	'Europe', 'Monaco', 'MC',
	'https://flagcdn.com/mc.svg',
	'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80',
	'The world''s second smallest country is synonymous with wealth, glamour, and the Formula 1 Grand Prix. Monaco offers zero income tax, extraordinary Mediterranean scenery, and the world''s highest concentration of millionaires.

## Key Highlights
- Zero personal income tax jurisdiction
- Formula 1 Grand Prix and Casino Monte-Carlo glamour
- Highest concentration of millionaires and billionaires globally',
	'Monaco is a sovereign city-state on the French Riviera, covering just 2.02 square kilometers — the world''s second smallest country — yet housing over 38,000 residents, making it the world''s most densely populated sovereign state. The principality is ruled by the Grimaldi family, one of Europe''s oldest royal dynasties. Monaco''s global reputation for wealth and glamour stems from its zero income tax policy, which attracts wealthy residents from across Europe and beyond, creating the world''s highest concentration of high-net-worth individuals per capita. The Casino Monte-Carlo, glamorized by James Bond and countless films, remains an active casino and iconic architectural landmark. The Formula 1 Monaco Grand Prix, held through the principality''s streets each May, is one of motorsport''s most prestigious and spectacular events. Monaco''s coastline offers excellent Mediterranean swimming, a well-equipped marina hosting some of the world''s most spectacular superyachts, and access to the broader Côte d''Azur region. Real estate is among the world''s most expensive, with apartment prices regularly exceeding €100,000 per square meter in prime locations. Residency in Monaco requires demonstrating sufficient financial means and maintaining accommodation in the principality. French is the official language. Monaco''s quality of life is exceptional, with low crime, excellent weather, world-class restaurants, and immediate access to the broader French and Italian Riviera.'
),
(
	'Africa', 'Seychelles', 'SC',
	'https://flagcdn.com/sc.svg',
	'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=800&q=80',
	'An Indian Ocean archipelago of extraordinary beauty — dramatic granite boulders, lush tropical forests, and pristine beaches. The Seychelles offers a stable island paradise with a welcoming visa policy and unique Creole culture.

## Key Highlights
- Stunning granite islands with unique prehistoric Coco de Mer palms
- World-class diving in UNESCO Biosphere Reserves
- Stable island economy with welcoming visitor permit system',
	'The Seychelles is an archipelago nation of 115 islands in the Indian Ocean, northeast of Madagascar. Victoria, located on the main island of Mahé, is the world''s smallest capital city. The Seychelles is famous for its unique geological character — many islands are granitic rather than coral, creating dramatic landscapes of massive rounded boulders, lush tropical vegetation, and pristine beaches unlike those found elsewhere in the Indian Ocean. Praslin and La Digue are the most popular outer islands, famous for Anse Source d''Argent (frequently listed among the world''s most beautiful beaches) and the Vallée de Mai palm forest, a UNESCO World Heritage site where the Coco de Mer palm — producing the world''s largest seed — grows in a primeval setting. The marine environment is exceptional, with pristine coral reefs, diverse fish populations, and nesting grounds for sea turtles. The country is politically stable and maintains a relatively high Human Development Index for Africa. The economy relies heavily on tourism and fishing, with the government promoting offshore financial services. The Seychellois Creole culture combines African, French, Indian, and Chinese influences, creating unique cuisine, music, and artistic traditions. The Seychelles Visitor Permit allows extended stays for nationals of most countries, making it very accessible. The cost of living is moderate to high, with the island''s pristine environment and biodiversity more than justifying the investment.'
)
on conflict (name) do nothing;
