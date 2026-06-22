-- ============================================================
-- Citizenship Requirements & Tax Advice for new countries
-- Run in Supabase SQL Editor
-- ============================================================

-- ── BAHRAIN ──────────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 25 years continuous legal residence for non-Arabs; 15 years for Arab nationals. Must renounce previous nationality, demonstrate Arabic language ability, and have no criminal record.\n\n**Processing:** Through Ministry of Interior, 12-24 months."
  },
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Bahraini fathers automatically acquire citizenship. Citizenship through Bahraini mother is more restricted and requires special application."
  },
  "Spouse of Bahraini Citizen": {
    "icon": "💍",
    "desc": "Foreign wives of Bahraini men may apply after 7 years of marriage. Foreign husbands of Bahraini women face significantly higher hurdles."
  },
  "Investment / Special Merit": {
    "icon": "⭐",
    "desc": "The King may grant citizenship by royal decree to investors and individuals of exceptional merit or service to Bahrain."
  }
}' WHERE name = 'Bahrain';

UPDATE countries SET tax_advice = '- No personal income tax for individuals in Bahrain
- Corporate tax applies only to oil companies (46% on oil profits)
- VAT introduced at 10% (increased from 5% in 2022)
- No capital gains tax, wealth tax, or inheritance tax
- Social insurance contributions required for employed residents
- Free trade agreements reduce import duties on many goods
- Financial sector benefits from a favorable regulatory environment
- Foreign companies may face withholding taxes on certain payments' WHERE name = 'Bahrain';

-- ── BANGLADESH ───────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children born to Bangladeshi citizen parents automatically acquire citizenship at birth, regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, renunciation of previous citizenship, Bengali language proficiency, good moral character, financial stability.\n\n**Processing:** Through Ministry of Home Affairs, 12-18 months. Dual citizenship not generally allowed."
  },
  "Birthright Citizenship": {
    "icon": "🏙️",
    "desc": "Children born in Bangladesh to at least one Bangladeshi parent acquire citizenship automatically."
  },
  "Special Provisions": {
    "icon": "⭐",
    "desc": "Persons of Bangladeshi origin living abroad (especially UK, USA, Canada) may hold a NRB (Non-Resident Bangladeshi) card for investment and banking privileges, but not full citizenship."
  }
}' WHERE name = 'Bangladesh';

UPDATE countries SET tax_advice = '- Personal income tax rates range from 0% to 25% depending on income level
- Corporate tax rate is 27.5% for publicly listed companies; 30% for others
- VAT at 15% (standard rate) with some reduced rates for essentials
- Non-residents taxed only on Bangladesh-sourced income
- Tax treaty network with 35+ countries for double taxation relief
- Export-oriented industries (especially garments) receive significant tax incentives
- Capital gains on securities listed on stock exchange taxed at reduced rates
- Tax-free income threshold updated regularly; check current limit' WHERE name = 'Bangladesh';

-- ── BARBADOS ─────────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children born to Barbadian citizen parents acquire citizenship automatically at birth regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years lawful residence (5 years for CARICOM nationals), English language, good character, intention to remain in Barbados.\n\n**Processing:** Through Ministry of Home Affairs, 6-12 months."
  },
  "Spouse of Barbadian Citizen": {
    "icon": "💍",
    "desc": "Foreign spouses may apply after 3 years of marriage with continuous residence in Barbados."
  },
  "CARICOM Citizens": {
    "icon": "🌍",
    "desc": "Citizens of CARICOM member states enjoy freedom of movement within the Caribbean Community, with simplified residency and shorter naturalization timelines."
  }
}' WHERE name = 'Barbados';

UPDATE countries SET tax_advice = '- Personal income tax: 12.5% on first BBD $50,000; 28.5% above that
- Corporate tax rate: 5.5% to 1% on a sliding scale (reduced for larger companies)
- VAT at 17.5% standard rate
- No capital gains tax in Barbados
- Welcome Stamp holders: income earned from foreign sources is not taxed in Barbados
- Barbados has tax treaties with Canada, USA, UK, and several others
- Non-resident income from Barbados sources subject to withholding tax
- Property transfer tax applies on sale of real estate' WHERE name = 'Barbados';

-- ── CAMBODIA ─────────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of at least one Cambodian citizen parent acquire citizenship automatically at birth, regardless of country of birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years lawful residence, Khmer language ability, renunciation of previous nationality, good moral character, financial stability.\n\n**Processing:** Royal Decree required; through Ministry of Interior, can take several years."
  },
  "Birthright Citizenship": {
    "icon": "🏛️",
    "desc": "Children born in Cambodia to Cambodian parents acquire citizenship. Foundlings discovered in Cambodia may also be granted citizenship."
  },
  "Investment Citizenship": {
    "icon": "💰",
    "desc": "Cambodia does not have a formal citizenship-by-investment program. However, significant investors may petition for citizenship via special government consideration."
  }
}' WHERE name = 'Cambodia';

UPDATE countries SET tax_advice = '- Personal income tax: 0% to 20% progressive rates
- Corporate tax: flat 20% on profits (reduced rates for small enterprises)
- VAT at 10% (standard rate); exports are zero-rated
- Non-residents taxed on Cambodia-sourced income only at 14% withholding
- No capital gains tax on most assets (real estate gains taxed separately)
- USD widely accepted; tax can be paid in either USD or Khmer Riel
- Special Economic Zones offer tax holidays of up to 9 years
- Limited tax treaty network; check for your home country agreement' WHERE name = 'Cambodia';

-- ── COLOMBIA ─────────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children born to at least one Colombian parent are Colombian citizens automatically, regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence (2 years for nationals of Latin American and Caribbean countries, Spain, and Ibero-American countries), Spanish language ability, good conduct, knowledge of Colombian history and constitution.\n\n**Processing:** Through Ministry of Foreign Affairs, 6-12 months."
  },
  "Spouse of Colombian Citizen": {
    "icon": "💍",
    "desc": "Foreign spouses may apply after 1 year of marriage with continuous legal residence in Colombia."
  },
  "Latin American / Spanish Nationals": {
    "icon": "🌍",
    "desc": "Nationals of Latin American, Caribbean, and Spanish-speaking countries benefit from reduced residence requirements (2 years) due to regional integration agreements."
  }
}' WHERE name = 'Colombia';

UPDATE countries SET tax_advice = '- Personal income tax: 0% to 39% progressive scale
- Corporate tax: 35% (plus 10% surcharge for some sectors like oil)
- VAT at 19% standard rate; essential goods exempt or taxed at 5%
- Non-residents taxed on Colombia-sourced income at flat 35%
- Digital nomad visa holders: income earned abroad not taxed in Colombia
- Capital gains taxed at 10% flat rate (separate from ordinary income)
- Wealth tax applies to net assets above COP 3 billion (~$750,000)
- Tax treaties with 9+ countries including Spain, Canada, Chile, Mexico, India' WHERE name = 'Colombia';

-- ── COSTA RICA ───────────────────────────────────────────────
UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children born to at least one Costa Rican parent acquire citizenship at birth, regardless of country of birth."
  },
  "Birthright Citizenship (Jus Soli)": {
    "icon": "🏔️",
    "desc": "All children born in Costa Rica acquire citizenship at birth, regardless of the parents'' nationality — one of the strongest birthright citizenship laws in the region."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years lawful residence (5 years for Central Americans and Spaniards; 2 years for married spouses of Costa Ricans), Spanish language test, knowledge of Costa Rican history and constitution, good conduct.\n\n**Processing:** Through Civil Registry (Tribunal Supremo de Elecciones), 6-18 months."
  },
  "Spouse of Costa Rican Citizen": {
    "icon": "💍",
    "desc": "Foreign spouses married to Costa Ricans may apply for naturalization after just 2 years of marriage, with continuous legal residence."
  }
}' WHERE name = 'Costa Rica';

UPDATE countries SET tax_advice = '- Personal income tax: 0% to 25% progressive (on Costa Rica-sourced income only)
- Territorial tax system: foreign-sourced income generally not taxed
- Corporate tax: 30% on profits for large companies; reduced rates for small/medium
- VAT at 13% standard rate; food staples and medicines exempt
- No capital gains tax on most assets (introduced in 2019 for certain property sales at 15%)
- Pensionado/Rentista visa holders: foreign pension and investment income not taxed in CR
- Digital nomad visa: foreign income not subject to Costa Rican tax
- Real estate transfer tax at 1.5% applies on property purchases' WHERE name = 'Costa Rica';

-- ============================================================
-- Citizenship & Tax for new countries (Dominican Republic,
-- Ecuador, Fiji, Ghana, Guyana, Honduras, Jamaica, Jordan,
-- Kazakhstan, Kenya, Kyrgyzstan, Kuwait, Laos)
-- ============================================================

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Dominican citizen parents acquire citizenship automatically at birth regardless of country of birth."},
  "Birthright Citizenship": {"icon": "🏝️", "desc": "All children born in the Dominican Republic to Dominican parents acquire citizenship automatically. Limited jus soli for children of non-citizens."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 2 years legal residency, Spanish language ability, good conduct, renunciation of previous nationality.\n\n**Processing:** Through Ministry of Interior, 6-12 months."},
  "Spouse of Dominican Citizen": {"icon": "💍", "desc": "Foreign spouses may apply after 2 years of marriage with continuous legal residence."}
}', tax_advice = '- Personal income tax: progressive rates from 0% to 25%
- Corporate tax: flat 27% on net profits
- VAT (ITBIS) at 18%; some essential goods exempt
- Law 171-07: major tax exemptions for qualifying retirees
- No capital gains tax on primary residence sales
- Tax incentives for tourism zone investments (CONFOTUR law)
- Foreign-sourced income generally not taxed for retirees
- Property transfer tax at 3% applies on real estate purchases' WHERE name = 'Dominican Republic';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Ecuadorian citizen parents acquire citizenship automatically at birth regardless of where they are born."},
  "Birthright Citizenship": {"icon": "🌎", "desc": "Ecuador applies jus soli broadly: children born in Ecuador are citizens by birth, regardless of parents'' nationality — one of the most open policies in the region."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 3 years lawful residence, Spanish language ability, renunciation of other citizenship, good conduct.\n\n**Processing:** Through Ministry of Foreign Affairs, 6-12 months."},
  "Spouse of Ecuadorian Citizen": {"icon": "💍", "desc": "Foreign spouses may apply after 2 years of marriage with residence in Ecuador."}
}', tax_advice = '- Ecuador uses the US dollar — no currency exchange concerns
- Personal income tax: 0% to 37% progressive scale
- Corporate tax: 25% standard rate
- VAT at 12%; basic food and medicine exempt
- Territorial tax system: only Ecuador-sourced income taxed for residents
- Retirement visa holders: foreign pension income not taxed in Ecuador
- Capital gains on real estate taxed at 10%
- Significant tax incentives in designated investment zones' WHERE name = 'Ecuador';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Fijian citizen parents automatically acquire citizenship at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years continuous lawful residence, English or Fijian language, good character, intention to remain in Fiji.\n\n**Processing:** Through Department of Immigration, 6-12 months."},
  "Birthright Citizenship": {"icon": "🏝️", "desc": "Children born in Fiji to at least one Fijian parent acquire citizenship. Foundlings discovered in Fiji may also be granted citizenship."},
  "iTaukei (Indigenous) Provisions": {"icon": "⭐", "desc": "Indigenous iTaukei Fijians have specific land and citizenship rights distinct from other citizens."}
}', tax_advice = '- Personal income tax: 18% to 20% flat rates
- Corporate tax: 20% standard rate
- VAT at 15% standard rate
- Non-residents taxed on Fiji-sourced income only
- No capital gains tax in Fiji
- Tourism and investment zones offer significant tax holidays
- Withholding tax on dividends: 9% for residents, 17% for non-residents
- Property transfer tax applies on real estate transactions' WHERE name = 'Fiji';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Ghanaian citizen parents acquire citizenship automatically at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years continuous lawful residence, English language ability (or a Ghanaian language), good conduct, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 12-18 months."},
  "Right of Abode": {"icon": "🌍", "desc": "Persons of African descent may qualify for Right of Abode in Ghana under the Joseph Project and Year of Return initiative, allowing indefinite stay without need to naturalize."},
  "Birthright Citizenship": {"icon": "🏛️", "desc": "Children born in Ghana to Ghanaian parents acquire citizenship automatically."}
}', tax_advice = '- Personal income tax: 0% to 35% progressive rates
- Corporate tax: 25% standard rate
- VAT at 15% standard rate; some essentials exempt
- Non-residents taxed on Ghana-sourced income only
- Withholding tax on dividends: 8% for residents, 8% for non-residents
- Capital gains on property taxed at 15%
- Mining and petroleum sectors have special tax regimes
- Double taxation agreements with several countries including UK and Germany' WHERE name = 'Ghana';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Guyanese citizen parents acquire citizenship at birth regardless of country of birth."},
  "Birthright Citizenship": {"icon": "🌿", "desc": "Children born in Guyana to at least one Guyanese parent acquire citizenship automatically."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years lawful residence, English language, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Home Affairs, 6-12 months."},
  "CARICOM Citizens": {"icon": "🌍", "desc": "Citizens of CARICOM member states enjoy freedom of movement within the Caribbean Community with simplified residency procedures."}
}', tax_advice = '- Personal income tax: 28% flat rate above the personal allowance
- Corporate tax: 25% for non-oil companies; 55% for oil/gas companies
- VAT at 14%; essential goods zero-rated
- Booming oil sector: significant tax revenue being reinvested in infrastructure
- Non-residents taxed on Guyana-sourced income only
- No capital gains tax on most assets
- Double taxation treaties with Canada, UK, and CARICOM members
- Rapidly evolving tax framework as economy expands' WHERE name = 'Guyana';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Honduran citizen parents acquire citizenship automatically at birth regardless of country of birth."},
  "Birthright Citizenship": {"icon": "🏔️", "desc": "All children born in Honduras acquire citizenship at birth, regardless of parents'' nationality (strong jus soli)."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 3 years lawful residence (1 year for Central Americans and Spaniards), Spanish language ability, good conduct.\n\n**Processing:** Through General Directorate of Migration, 6-12 months."},
  "Spouse of Honduran Citizen": {"icon": "💍", "desc": "Foreign spouses may apply after 1 year of marriage with residence in Honduras."}
}', tax_advice = '- Personal income tax: 15% to 25% progressive rates
- Corporate tax: 25% standard rate; 30% for financial institutions
- VAT (ISV) at 15%; 18% on alcohol and tobacco
- Non-residents taxed on Honduras-sourced income only
- No capital gains tax on most assets
- ZEDE (Special Development Zones) offer major tax incentives for investors
- Bay Islands have special tax-free status for certain transactions
- Double taxation treaties limited; check for your home country' WHERE name = 'Honduras';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Jamaican citizen parents acquire citizenship automatically at birth regardless of country of birth."},
  "Birthright Citizenship": {"icon": "🏝️", "desc": "Children born in Jamaica to at least one Jamaican parent acquire citizenship. Limited jus soli for children of non-citizens."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years lawful residence (3 years for CARICOM nationals), English language, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of National Security, 6-12 months."},
  "CARICOM Citizens": {"icon": "🌍", "desc": "Citizens of CARICOM member states benefit from freedom of movement agreements with simplified residency and naturalization pathways."}
}', tax_advice = '- Personal income tax: 25% above the annual threshold (~JMD 1.5 million)
- Corporate tax: 25% standard; 33% for regulated entities
- GCT (General Consumption Tax) at 15%
- Global Work or Holiday visa holders: foreign income not taxed in Jamaica
- No capital gains tax in Jamaica
- Special Economic Zones offer significant tax holidays for investors
- Jamaica has tax treaties with several countries including UK, USA, Canada
- Withholding tax on dividends: 15% for non-residents' WHERE name = 'Jamaica';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Jordanian fathers acquire citizenship automatically. Citizenship through Jordanian mothers is more restricted for children born to non-Jordanian fathers."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 15 years continuous lawful residence for non-Arabs; 4 years for Arab nationals. Arabic language, good conduct, financial independence, renunciation of previous nationality.\n\n**Processing:** Through Ministry of Interior, 12-24 months. Very selective."},
  "Spouse of Jordanian Citizen": {"icon": "💍", "desc": "Foreign wives of Jordanian men may apply after 5 years of marriage. Foreign husbands of Jordanian women face additional restrictions."},
  "Investment Citizenship": {"icon": "💰", "desc": "Investors meeting specific criteria may be eligible for accelerated residency through Ministry of Investment."}
}', tax_advice = '- Personal income tax: 7% to 20% progressive rates
- Corporate tax: 20% standard; higher rates for banks and telecoms
- GST (General Sales Tax) at 16%; essentials taxed at lower rates
- Non-residents taxed on Jordan-sourced income only
- No capital gains tax on most assets (real estate gains taxable)
- Special economic zones (Aqaba) offer significant tax exemptions
- Jordan has tax treaties with 30+ countries
- Withholding tax on dividends: 10% for non-residents' WHERE name = 'Jordan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Kazakhstani citizen parents acquire citizenship automatically at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years continuous residence, Kazakh or Russian language ability, renunciation of previous citizenship, good conduct, financial stability.\n\n**Processing:** Through Ministry of Internal Affairs, 12-18 months."},
  "Birthright Citizenship": {"icon": "🏔️", "desc": "Children born in Kazakhstan to at least one Kazakhstani parent acquire citizenship automatically."},
  "Special Merit": {"icon": "⭐", "desc": "Individuals with outstanding achievements or significant investment may be considered for citizenship by presidential decree."}
}', tax_advice = '- Personal income tax: flat 10% rate on all income
- Corporate tax: flat 20% on profits
- VAT at 12%; some essentials exempt
- Non-residents taxed on Kazakhstan-sourced income only
- Tax residence requires 183+ days presence in Kazakhstan
- Special Economic Zones (SEZs) offer 0% corporate tax for qualifying activities
- No inheritance or gift tax
- Kazakhstan has tax treaties with 50+ countries' WHERE name = 'Kazakhstan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Kenyan citizen parents acquire citizenship automatically at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 7 years continuous lawful residence, English or Swahili language, good conduct, renunciation of previous citizenship.\n\n**Processing:** Through Department of Immigration, 12-24 months."},
  "East African Community": {"icon": "🌍", "desc": "EAC partner state citizens (Uganda, Tanzania, Rwanda, Burundi, South Sudan, DRC) benefit from freedom of movement and may have simplified residency procedures."},
  "Investment Residency": {"icon": "💰", "desc": "Investors committing $100,000+ in Kenya may qualify for Class G permit, a pathway to long-term residence."}
}', tax_advice = '- Personal income tax: 10% to 30% progressive rates
- Corporate tax: 30% standard; 15% for new manufacturers for first 5 years
- VAT at 16%; essential goods zero-rated or exempt
- Non-residents taxed on Kenya-sourced income only
- Digital nomad visa holders: foreign income not taxed in Kenya
- Capital gains tax at 15% on property and shares
- Withholding tax on dividends: 15% for non-residents
- Special Economic Zones offer significant tax incentives for qualifying investors' WHERE name = 'Kenya';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Kyrgyzstani citizen parents acquire citizenship automatically at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 5 years continuous lawful residence, Kyrgyz or Russian language ability, good conduct, renunciation of previous nationality.\n\n**Processing:** Through Ministry of Internal Affairs, 6-12 months."},
  "Former Soviet Citizens": {"icon": "🤝", "desc": "Citizens of former Soviet Union states may benefit from simplified naturalization procedures under existing bilateral agreements."},
  "Birthright Citizenship": {"icon": "🏔️", "desc": "Children born in Kyrgyzstan to at least one Kyrgyzstani parent acquire citizenship automatically."}
}', tax_advice = '- Personal income tax: flat 10% rate on all income
- Corporate tax: 10% flat rate (very competitive)
- VAT at 12%; some essentials zero-rated
- Non-residents taxed on Kyrgyzstan-sourced income only
- No capital gains tax on securities
- Very low tax burden overall — one of the lowest in Central Asia
- Small business tax regimes available with even lower rates
- Limited double taxation treaty network; check for your home country' WHERE name = 'Kyrgyzstan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Kuwaiti fathers acquire citizenship automatically. Citizenship through Kuwaiti mothers is more restricted and requires special government approval."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 20 years continuous legal residence for non-Arabs; 15 years for Arab nationals. Arabic language, good conduct, no criminal record, renunciation of previous citizenship.\n\n**Processing:** By Amiri decree only; extremely selective. Granted to very few foreigners each year."},
  "Bedoon Status": {"icon": "📋", "desc": "Stateless long-term residents (Bedoon) have a separate administrative status and limited pathway to citizenship under special review processes."},
  "Merit Recognition": {"icon": "⭐", "desc": "Citizenship may be granted by royal decree to individuals of exceptional achievement or service to Kuwait, at the discretion of the Amir."}
}', tax_advice = '- No personal income tax in Kuwait — zero for all residents
- No corporate income tax for Kuwaiti-owned businesses
- Foreign companies operating in Kuwait pay 15% KNET tax on profits
- No VAT currently (though GCC VAT framework may be implemented)
- No capital gains tax, inheritance tax, or wealth tax
- Zakat: obligatory for Muslim business owners on eligible assets
- Oil sector operated by government; private sector largely tax-free
- Kuwait has double taxation treaties with select countries' WHERE name = 'Kuwait';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {"icon": "👨‍👩‍👧", "desc": "Children of Laotian citizen parents acquire citizenship automatically at birth, regardless of country of birth."},
  "Naturalization": {"icon": "📋", "desc": "**Requirements:** 10 years continuous lawful residence, Lao language ability, good conduct, renunciation of previous citizenship, government approval.\n\n**Processing:** Through Ministry of Interior, 12-24 months. Rarely granted to Westerners."},
  "Birthright Citizenship": {"icon": "🏯", "desc": "Children born in Laos to Laotian parents acquire citizenship automatically."},
  "Investment Considerations": {"icon": "💰", "desc": "Laos does not offer investment citizenship programs. Long-term residency through business investment is the most common route for foreign nationals."}
}', tax_advice = '- Personal income tax: 0% to 24% progressive rates
- Corporate tax: 24% standard rate; 5% for qualifying investment projects
- VAT at 10%; some essentials exempt
- Non-residents taxed on Laos-sourced income only
- No capital gains tax for individuals on most assets
- Special Economic Zones offer 10-year corporate tax holidays
- Limited double taxation treaties; check for your home country
- Business environment improving but administrative processes can be slow' WHERE name = 'Laos';
