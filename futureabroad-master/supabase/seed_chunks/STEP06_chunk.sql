-- =============================================================================
-- Citizenship Requirements
-- =============================================================================

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Hungarian citizens acquire citizenship automatically at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous residence, B1 Hungarian language proficiency, knowledge of Hungarian history and culture, clean criminal record, financial stability.\n\n**Processing:** Through Office of Immigration, typically 6-12 months."
  },
  "Spouse of Hungarian Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 3 years of marriage and 2 years continuous residence in Hungary."
  },
  "Ethnic Hungarians": {
    "icon": "🇭🇺",
    "desc": "Ethnic Hungarians living outside Hungary (particularly in Romania, Slovakia, Ukraine) may apply for Hungarian citizenship through simplified procedure with no residence requirement."
  }
}' WHERE name = 'Hungary';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Croatian citizens automatically acquire Croatian citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence, Croatian language proficiency, knowledge of Croatian culture and constitution, clean criminal record, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Spouse of Croatian Citizen": {
    "icon": "💍",
    "desc": "Spouses may apply after 3 years of marriage with reduced residence requirements."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU citizens have freedom of movement in Croatia but citizenship still requires meeting standard naturalization criteria."
  }
}' WHERE name = 'Croatia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Birth (Jus Soli)": {
    "icon": "🏛️",
    "desc": "Children born on US soil automatically acquire citizenship regardless of parents'' nationality. Birthright citizenship is enshrined in the 14th Amendment."
  },
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of US citizens may acquire citizenship at birth even if born abroad, subject to residency requirements of the citizen parent."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as Lawful Permanent Resident (3 years if married to US citizen), English language, US history and civics test, good moral character, no criminal record.\n\n**Processing:** 8-24 months depending on field office."
  },
  "Investor Pathway": {
    "icon": "💰",
    "desc": "EB-5 Immigrant Investor Program requires $800,000-$1,050,000 investment creating 10 full-time jobs, leading to Green Card and eventual citizenship."
  }
}' WHERE name = 'United States';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of at least one Japanese citizen parent acquire citizenship at birth. Children born out of wedlock to Japanese father require legal recognition."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence, ability to support oneself financially, good conduct, renunciation of previous nationality (dual citizenship not officially recognized).\n\n**Processing:** Through Ministry of Justice, 1-2 years. Very selective."
  },
  "Special Naturalization": {
    "icon": "⭐",
    "desc": "Reduced residence requirements (3 years) for spouses of Japanese nationals married for 3+ years. Reduced for those born in Japan with Japanese parent."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Japan does not officially recognize dual citizenship. Naturalized citizens must renounce previous citizenship. Children with dual citizenship must choose by age 22."
  }
}' WHERE name = 'Japan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of South Korean citizens automatically acquire citizenship. Overseas Koreans (ethnic Koreans with foreign citizenship) have special repatriation pathways."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (2 years if married to Korean citizen for 2+ years), Korean language proficiency, knowledge of Korean culture, financial stability.\n\n**Processing:** Through Ministry of Justice, 1-2 years."
  },
  "Special Naturalization": {
    "icon": "⭐",
    "desc": "Individuals with outstanding contributions to Korea may apply for special naturalization regardless of residence period. Overseas Koreans have expedited pathways."
  },
  "Dual Citizenship (Limited)": {
    "icon": "🇰🇷",
    "desc": "Limited dual citizenship permitted for those naturalized after age 65, spouses of Korean citizens in certain circumstances, and foreign nationals who become Korean citizens voluntarily."
  }
}' WHERE name = 'South Korea';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of UAE citizens acquire citizenship. Citizenship through paternal line only; children of UAE mothers and foreign fathers do not automatically qualify."
  },
  "Naturalization (Rare)": {
    "icon": "📋",
    "desc": "**Requirements:** 30 years continuous residence for Arabs, 20 years for non-Arabs with Arabic language fluency. Rarely granted in practice.\n\n**Note:** The UAE naturalization process is extremely selective and largely discretionary."
  },
  "Golden Visa": {
    "icon": "💰",
    "desc": "10-year renewable Golden Visa available for investors (AED 2 million+), entrepreneurs, scientists, outstanding students, and humanitarian workers. Provides residency but not citizenship."
  },
  "Birthright": {
    "icon": "🏙️",
    "desc": "No birthright citizenship. Children born in the UAE to non-citizen parents do not acquire Emirati citizenship, regardless of length of stay."
  }
}' WHERE name = 'United Arab Emirates';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Canadian citizens born abroad automatically acquire citizenship, though second-generation born abroad may face limitations."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 1,095 days physical presence in Canada in the past 5 years (as PR), English or French language (CLB 4), Canadian citizenship test (knowledge of rights/responsibilities, history, values), no prohibitions.\n\n**Processing:** 12-24 months."
  },
  "Permanent Residency Pathways": {
    "icon": "🍁",
    "desc": "Express Entry (Federal Skilled Worker, Canadian Experience Class), Provincial Nominee Programs, Family Sponsorship, and Atlantic Immigration Program are primary PR pathways before naturalization."
  },
  "Dual Citizenship": {
    "icon": "🇨🇦",
    "desc": "Canada permits dual citizenship. Canadian citizens do not need to renounce their previous citizenship and can hold multiple passports simultaneously."
  }
}' WHERE name = 'Canada';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of at least one Australian citizen parent acquire citizenship automatically at birth, whether born in Australia or abroad."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 4 years as permanent resident (last 12 months continuously), good character, basic English, Australian values and pledged commitment.\n\n**Processing:** Through Department of Home Affairs, 12-24 months."
  },
  "Points-Based PR Pathways": {
    "icon": "🦘",
    "desc": "SkillSelect/EOI points-based system for General Skilled Migration, Employer Sponsored visas, Business Innovation visas, and Regional visas lead to PR and eventual citizenship."
  },
  "Dual Citizenship": {
    "icon": "🇦🇺",
    "desc": "Australia permits dual citizenship. Applicants for Australian citizenship are not required to renounce their previous citizenship."
  }
}' WHERE name = 'Australia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of New Zealand citizens or permanent residents born in New Zealand acquire citizenship automatically. Those born abroad to NZ citizen parents may also qualify."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 1,350 days physical presence in NZ in the past 5 years as PR, good character, English language ability.\n\n**Processing:** Through Department of Internal Affairs, 3-6 months."
  },
  "Skilled Migrant & PR Pathways": {
    "icon": "🥝",
    "desc": "Skilled Migrant Category (points-based), Accredited Employer Work Visa, Investor visas, and various work-to-residence pathways lead to PR before citizenship."
  },
  "Māori Citizenship": {
    "icon": "🌿",
    "desc": "Māori people (tangata whenua) have specific constitutional status under the Treaty of Waitangi, recognizing their status as the indigenous people of New Zealand."
  }
}' WHERE name = 'New Zealand';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Singapore citizens acquire citizenship at birth. Children of Singapore PRs may register for citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 2-6 years as Permanent Resident, economic contribution, community integration, language ability in an official language.\n\n**Processing:** Highly selective; economic contribution is a key factor. 1-2 years typically."
  },
  "Permanent Residency First": {
    "icon": "🏙️",
    "desc": "Employment Pass holders typically apply for PR after 2+ years. PR is required before citizenship. PR through Employment Pass (EP), S Pass, and Entrepreneur Pass."
  },
  "Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Singapore does not permit dual citizenship. Citizens must renounce all other nationalities within one year of acquiring Singapore citizenship."
  }
}' WHERE name = 'Singapore';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Hong Kong permanent residents do not automatically acquire HK permanent resident status at birth outside HK. Residency must be established."
  },
  "Right of Abode": {
    "icon": "🏙️",
    "desc": "**Permanent Residency:** 7 years ordinary residence in HK with right to land. Right of abode holders have full residency and work rights.\n\n**Chinese National Path:** Chinese nationals residing continuously in HK for 7 years may acquire right of abode."
  },
  "BN(O) Status": {
    "icon": "🇬🇧",
    "desc": "Hong Kong British National (Overseas) passport holders and dependants may apply for British citizenship through a 5-year UK residence pathway following 2020 policy changes."
  },
  "Note on Changes": {
    "icon": "⚠️",
    "desc": "Political changes since the 2020 National Security Law have significantly altered the practical situation for many residents. Many have emigrated using UK, Canadian, and Australian pathways."
  }
}' WHERE name = 'Hong Kong';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Czech citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (3 years for EU citizens), Czech language A2 level, knowledge of Czech culture/history/political system, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have freedom of movement and can live and work in Czechia without a visa. Citizenship still requires meeting standard naturalization criteria."
  },
  "Dual Citizenship": {
    "icon": "🇨🇿",
    "desc": "Dual citizenship is permitted in Czechia. Applicants for Czech citizenship are not required to renounce their previous nationality."
  }
}' WHERE name = 'Czechia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Slovak citizens automatically acquire citizenship at birth regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence (5 years for EU citizens, 3 years for spouses of Slovak citizens), Slovak language B1, knowledge of Slovak culture/history, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Spouse of Slovak Citizen": {
    "icon": "💍",
    "desc": "Spouses of Slovak citizens may apply after 3 years of marriage with reduced residence of 3 years."
  },
  "Slovak Diaspora": {
    "icon": "🇸🇰",
    "desc": "Ethnic Slovaks living abroad may apply for Slovak citizenship under simplified conditions without residency requirements."
  }
}' WHERE name = 'Slovakia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Bulgarian citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous residence (3 years for EU citizens and spouses of Bulgarians), Bulgarian language A2 level, no criminal record, income stability.\n\n**Processing:** Through Ministry of Justice, 12-24 months."
  },
  "Investment Citizenship": {
    "icon": "💰",
    "desc": "Investment of BGN 2,000,000 (approx. €1,000,000) in Bulgarian businesses or government bonds can lead to accelerated permanent residency (not citizenship directly)."
  },
  "Bulgarian Descent": {
    "icon": "🇧🇬",
    "desc": "Persons of Bulgarian origin or descent may apply for citizenship through simplified procedures regardless of current residency."
  }
}' WHERE name = 'Bulgaria';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Romanian citizens automatically acquire citizenship regardless of birthplace. Diaspora Romanians can pass citizenship to their children indefinitely."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence (5 years for stateless persons/refugees, 4 years for EU citizens), Romanian language B1, knowledge of Romanian culture/constitution.\n\n**Processing:** Through National Citizenship Authority, 12-18 months."
  },
  "Re-acquisition for Former Citizens": {
    "icon": "🔄",
    "desc": "Former Romanian citizens (and their children/grandchildren) who lost citizenship involuntarily, particularly those from the Communist era or from Moldova, may re-acquire citizenship through simplified procedure."
  },
  "EU Citizenship Bonus": {
    "icon": "🇪🇺",
    "desc": "Romanian citizenship grants EU citizenship, providing visa-free access to 26 EU member states. Highly sought after by Moldovans due to shared cultural and linguistic heritage."
  }
}' WHERE name = 'Romania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Luxembourgish citizens automatically acquire citizenship. Ancestors who lost citizenship due to WWII-era laws may be eligible for re-acquisition."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Luxembourgish language A2 level (or French/German B1), civics test, integration contract.\n\n**Processing:** Through Ministry of Justice, 12-24 months."
  },
  "Dual Citizenship": {
    "icon": "🇱🇺",
    "desc": "Luxembourg permits dual/multiple citizenship. In 2008, Luxembourg changed its law to allow dual citizenship, making it possible to maintain existing nationality."
  },
  "Ancestral Recovery": {
    "icon": "⭐",
    "desc": "Persons of Luxembourg descent who lost citizenship or whose ancestors were deprived of citizenship under Nazi occupation may apply for citizenship recovery."
  }
}' WHERE name = 'Luxembourg';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of South African citizens acquire citizenship at birth regardless of birthplace, subject to registration requirements."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as permanent resident, 1 year married to SA citizen or 5 years ordinary residence with PR, English or other official language ability, good character, renouncing previous citizenship.\n\n**Processing:** Through DHA, 12-24 months."
  },
  "Permanent Residency First": {
    "icon": "🌍",
    "desc": "General Work PR, Relatives PR, Retirement PR, and Business/Investment PR pathways lead to permanent residency before citizenship can be applied for."
  },
  "Dual Citizenship (Limited)": {
    "icon": "⚠️",
    "desc": "South Africa generally does not permit dual citizenship. Citizens who voluntarily acquire another nationality must apply for permission to retain SA citizenship, or they may lose it."
  }
}' WHERE name = 'South Africa';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Slovenian citizens acquire citizenship automatically at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (6 years for EU citizens), Slovenian language A2 level, knowledge of Slovenian constitution/culture, financial stability, clean criminal record.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "EU Citizens": {
    "icon": "🇪🇺",
    "desc": "EU/EEA citizens have right of free movement and reduced residence requirements for naturalization after 6 years."
  },
  "Dual Citizenship": {
    "icon": "🇸🇮",
    "desc": "Dual citizenship is permitted in Slovenia. Applicants are not required to renounce their previous nationality."
  }
}' WHERE name = 'Slovenia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Latvian citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years as permanent resident, Latvian language B1, knowledge of Latvian history and constitution, Latvian national anthem, loyalty oath, clean criminal record.\n\n**Processing:** Through Office of Citizenship and Migration Affairs, 6-12 months."
  },
  "Non-Citizens (Historical)": {
    "icon": "⚠️",
    "desc": "Latvia has a unique category of ''Non-Citizens'' — former USSR citizens who settled during Soviet occupation and their descendants who did not qualify for automatic citizenship in 1991. They have special travel rights but are not citizens."
  },
  "Dual Citizenship (Limited)": {
    "icon": "🇱🇻",
    "desc": "Latvia permits dual citizenship only in limited cases: for citizens of EU/EEA/NATO countries and a few others. Generally requires renouncing previous citizenship."
  }
}' WHERE name = 'Latvia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Lithuanian citizens automatically acquire citizenship regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (5 years for stateless, 5 years for refugees, reduced for EU/EEA citizens), Lithuanian language B1, knowledge of Lithuanian constitution/history, renunciation of previous citizenship.\n\n**Processing:** Through Migration Department, 6-12 months."
  },
  "Ethnic Lithuanians": {
    "icon": "⭐",
    "desc": "Ethnic Lithuanians of Lithuanian descent living abroad may restore or acquire citizenship through simplified procedure without renouncing their current citizenship."
  },
  "Dual Citizenship": {
    "icon": "🇱🇹",
    "desc": "Dual citizenship is generally not permitted except for ethnic Lithuanians, persons who acquired foreign citizenship involuntarily, and citizens of certain EU/EEA member states in limited circumstances."
  }
}' WHERE name = 'Lithuania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Chinese citizens acquire citizenship through paternal line primarily. China does not officially recognize dual citizenship."
  },
  "Naturalization (Very Rare)": {
    "icon": "📋",
    "desc": "**Requirements:** 3 years continuous Chinese residence AND having close relatives who are Chinese citizens OR who have settled in China, or other legitimate reasons.\n\n**In Practice:** Naturalization is extremely rare and granted at government discretion. Foreigners overwhelmingly hold residence permits rather than citizenship."
  },
  "Residence Permits": {
    "icon": "📄",
    "desc": "Most foreigners in China hold temporary work, student, or family residence permits (Z, X, S visas). Permanent Residence (''Green Card'') is available to high-skilled talent and investors but very difficult to obtain."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "China does not recognize dual citizenship. Those who become Chinese citizens must renounce all other nationalities. Overseas Chinese who naturalize elsewhere technically lose Chinese citizenship."
  }
}' WHERE name = 'China';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Mongolian citizens automatically acquire citizenship. Children of one Mongolian and one foreign parent acquire citizenship if born in Mongolia or registered with authorities."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Mongolian language proficiency, respect for Mongolian law and culture, permanent source of income, clean criminal record.\n\n**Processing:** Through General Authority for Border Protection, 6-12 months."
  },
  "Limited Dual Citizenship": {
    "icon": "🇲🇳",
    "desc": "Mongolia generally does not permit dual citizenship. Foreign nationals who acquire Mongolian citizenship are expected to renounce their previous nationality."
  },
  "Investment Pathways": {
    "icon": "💰",
    "desc": "Long-term investment in Mongolia can facilitate permanent residency, with citizenship available after meeting standard naturalization requirements."
  }
}' WHERE name = 'Mongolia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Liechtenstein citizens automatically acquire citizenship. Citizenship passes through the paternal line; children of citizen mothers and foreign fathers require special application."
  },
  "Naturalization (Very Selective)": {
    "icon": "📋",
    "desc": "**Requirements:** 30 years of residence for ordinary naturalization (10 years if born in Liechtenstein), integration, language, clean record. Voted on by local municipality.\n\n**Processing:** Extremely long and selective. Voted by municipal council."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Parliament may grant citizenship to individuals with particular merit to Liechtenstein. Also available for those married 5+ years to a citizen with 5 years residence."
  },
  "No Dual Citizenship Generally": {
    "icon": "⚠️",
    "desc": "Liechtenstein generally does not permit dual citizenship. Naturalizing citizens must renounce their previous nationality."
  }
}' WHERE name = 'Liechtenstein';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Saudi nationals acquire citizenship through patrilineal descent. Children of Saudi mothers and foreign fathers must apply through naturalization process."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence, Arabic language proficiency, good conduct, financial stability, renunciation of previous nationality, Council of Ministers approval.\n\n**Processing:** Highly selective; large numbers of long-term residents are denied. Political and royal connections influence outcomes."
  },
  "Premium Residency (New)": {
    "icon": "💰",
    "desc": "Saudi Premium Residency (''Green Card'') launched in 2019: available through one-time fee (SAR 800,000 / ~$200k) or annual fee. Provides permanent residency with right to work, own business, and property — but not citizenship."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Saudi Arabia does not recognize dual citizenship. Saudis who naturalize elsewhere lose Saudi citizenship, and foreign nationals naturalizing as Saudi must renounce previous nationality."
  }
}' WHERE name = 'Saudi Arabia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Vietnamese citizens acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Vietnamese language proficiency, knowledge of Vietnamese history/culture, financial stability, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Justice, 1-2 years."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Individuals making significant contributions to Vietnam (investors, scientists, athletes, cultural figures) may be granted citizenship with reduced requirements by government decision."
  },
  "Overseas Vietnamese": {
    "icon": "🇻🇳",
    "desc": "Vietnamese overseas (Viet Kieu) who lost citizenship can re-apply for restoration. Vietnam has eased restrictions for diaspora seeking to reclaim roots and invest."
  }
}' WHERE name = 'Vietnam';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Argentine citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization (Very Accessible)": {
    "icon": "📋",
    "desc": "**Requirements:** Only 2 years continuous legal residence, evidence of ''good morals,'' means of legitimate livelihood, no criminal record.\n\n**Processing:** Through National Migration Authority, 3-12 months. One of the most accessible in the world."
  },
  "Spouse of Argentine Citizen": {
    "icon": "💍",
    "desc": "Spouses of Argentine citizens may apply immediately (no minimum residence) if they can demonstrate continuous cohabitation and marriage."
  },
  "Birthright Citizenship": {
    "icon": "🇦🇷",
    "desc": "Children born on Argentine soil acquire Argentine citizenship automatically (jus soli), regardless of parents'' nationality — one of the world''s most generous birthright citizenship policies."
  }
}' WHERE name = 'Argentina';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Brazilian citizens automatically acquire citizenship at birth regardless of birthplace, provided they are registered at a Brazilian consulate."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements (Ordinary):** 4 years continuous residence, Portuguese language.\n\n**Requirements (Facilitated):** 1 year if married to Brazilian citizen, 1 year if having Brazilian child, 3 years if from Portuguese-speaking country (PALOP).\n\n**Processing:** Through Ministry of Justice, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🇧🇷",
    "desc": "Children born in Brazil to foreign parents acquire Brazilian citizenship at birth (jus soli), with some exceptions for parents on official foreign government service."
  },
  "Digital Nomad Visa": {
    "icon": "💻",
    "desc": "Brazil launched a Digital Nomad Visa in 2022, providing a 1-year renewable residence permit for remote workers earning from abroad, potentially leading to permanent residency."
  }
}' WHERE name = 'Brazil';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Indian citizens (at least one parent must be Indian at time of birth) acquire citizenship at birth. Persons of Indian Origin (PIOs) have special OCI status."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 11 years total residence (last 12 months continuous), English or regional language knowledge, good character, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Home Affairs, 1-3 years."
  },
  "OCI Card": {
    "icon": "🇮🇳",
    "desc": "Overseas Citizen of India (OCI) is a lifetime multiple-entry visa for PIOs and foreign spouses of Indian citizens — not citizenship, but provides many benefits including no immigration reporting requirement."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "India does not permit dual citizenship. Persons who voluntarily acquire citizenship of another country cease to be Indian citizens automatically."
  }
}' WHERE name = 'India';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Malaysian citizens acquire citizenship at birth if born in Malaysia. Children born abroad to Malaysian fathers may register for citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 of the last 12 years residence in Malaysia (5 years in the last 7 for spouses), Malay language test, good character, intention to reside in Malaysia permanently.\n\n**Processing:** Through National Registration Department, 2-4 years. Selective."
  },
  "MM2H Pathway": {
    "icon": "🏙️",
    "desc": "Malaysia My Second Home (MM2H) provides long-term residence up to 10 years but does not directly lead to citizenship. It is a lifestyle visa, not a pathway to permanent residency."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Malaysia does not permit dual citizenship. Malaysian citizens who voluntarily acquire foreign citizenship lose Malaysian citizenship automatically."
  }
}' WHERE name = 'Malaysia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Moldovan citizens automatically acquire citizenship regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (8 years for stateless persons, 5 years for those with meritorious contributions), Romanian/Moldovan language competency, knowledge of constitution, financial stability.\n\n**Processing:** Through State Citizenship Agency, 12-24 months."
  },
  "Romanian Citizenship Option": {
    "icon": "🇷🇴",
    "desc": "Many ethnic Moldovans of Romanian heritage can apply for Romanian citizenship (and thus EU citizenship) under Romanian re-acquisition laws. This is widely used and provides EU freedom of movement."
  },
  "EU Aspirations": {
    "icon": "🇪🇺",
    "desc": "Moldova has EU candidate status. Future accession could automatically confer EU rights on Moldovan citizens, though this is still years away."
  }
}' WHERE name = 'Moldova';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Albanian citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Albanian language A2 level, knowledge of Albanian history and culture, clean criminal record, financial means, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Interior, 6-12 months."
  },
  "Exceptional Naturalization": {
    "icon": "⭐",
    "desc": "Individuals who have made exceptional contributions to Albania (scientists, artists, investors, athletes) may receive citizenship by presidential decree without meeting standard requirements."
  },
  "EU Aspirations": {
    "icon": "🇪🇺",
    "desc": "Albania has EU candidate status. Future EU accession would bring significant changes to freedom of movement and economic opportunity for Albanian citizens."
  }
}' WHERE name = 'Albania';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Georgian citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence (5 years for persons of Georgian descent, spouses of Georgian citizens), Georgian language proficiency, knowledge of Georgian history and law, financial stability.\n\n**Processing:** Through Agency of Civil Registry, 6-12 months."
  },
  "Citizenship by Exception": {
    "icon": "⭐",
    "desc": "Georgian President may grant citizenship to individuals of exceptional merit or those who make significant contributions to Georgia''s economic, cultural, or scientific development."
  },
  "Welcoming Visa Policy": {
    "icon": "🇬🇪",
    "desc": "Georgia offers 1-year visa-free stays to citizens of most countries (including EU/US/UK), making it exceptionally accessible for digital nomads before any formal visa or citizenship is needed."
  }
}' WHERE name = 'Georgia';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent (Aliyah)": {
    "icon": "⭐",
    "desc": "Under the Law of Return, any Jew, their spouse, children, and grandchildren (and their spouses) have the right to immigrate to Israel and acquire citizenship. This is one of the world''s broadest descent/return citizenship programs."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 3 years residence as immigrant (with declared intention to settle), Hebrew language, renunciation of previous citizenship in most cases, declaration of loyalty.\n\n**Processing:** Through Population and Immigration Authority, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🇮🇱",
    "desc": "Israel has limited jus soli citizenship. Children born in Israel to Israeli citizens acquire citizenship. Children of non-citizen parents must apply through other channels."
  },
  "Dual Citizenship": {
    "icon": "🌍",
    "desc": "Israel permits dual citizenship in many cases, particularly for those who acquire Israeli citizenship through the Law of Return while maintaining their original nationality."
  }
}' WHERE name = 'Israel';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Bahamian citizens (or born in The Bahamas to at least one citizen parent) acquire citizenship at birth."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous lawful residence, English language, good character, no criminal record, financial stability.\n\n**Processing:** Through Department of Immigration, 12-24 months."
  },
  "Permanent Residency": {
    "icon": "🏝️",
    "desc": "Permanent Residency available through property investment (BSD $500,000+), accelerated consideration for BSD $1.5 million+. Does not automatically lead to citizenship."
  },
  "Birthright Citizenship (Limited)": {
    "icon": "🌊",
    "desc": "Children born in The Bahamas to non-citizen parents do not automatically acquire citizenship but may apply for registration upon reaching age 18."
  }
}' WHERE name = 'Bahamas';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Pakistani citizens automatically acquire citizenship at birth regardless of birthplace."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 5 years continuous legal residence, Urdu or regional language proficiency, good character, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through NADRA/Ministry of Interior, 6-18 months."
  },
  "Birthright Citizenship": {
    "icon": "🏔️",
    "desc": "Children born in Pakistan to at least one Pakistani parent acquire citizenship. Foundlings (children of unknown parents) found in Pakistan are also considered citizens."
  },
  "Overseas Pakistanis": {
    "icon": "🌍",
    "desc": "Pakistan has made significant efforts to maintain connections with its diaspora. NICOP (National Identity Card for Overseas Pakistanis) allows dual nationals to access government services."
  }
}' WHERE name = 'Pakistan';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Qatari citizenship passes through the paternal line. Children of Qatari fathers automatically acquire citizenship."
  },
  "Naturalization (Very Selective)": {
    "icon": "📋",
    "desc": "**Requirements:** 25 years continuous legal residence (15 years for nationals of Arab countries), Arabic language, good conduct, financial stability, no criminal record, renunciation of previous nationality.\n\n**In Practice:** Extremely rare; citizenship is primarily reserved for founding families and select cases."
  },
  "Premium Residency": {
    "icon": "💰",
    "desc": "Qatar offers permanent and temporary residency visas for investors and highly skilled workers. These provide residency rights but not citizenship. Permanent residency available for those investing QAR 3.5 million+."
  },
  "No Dual Citizenship": {
    "icon": "⚠️",
    "desc": "Qatar does not permit dual citizenship. The citizenship process is highly discretionary and primarily serves the interests of the Qatari state."
  }
}' WHERE name = 'Qatar';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of citizens of Bosnia and Herzegovina (regardless of entity — Federation or Republika Srpska) automatically acquire citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 8 years continuous legal residence, Bosnian/Croatian/Serbian language (official languages), knowledge of constitutional order, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through Ministry of Civil Affairs, 12-24 months. Can be slow due to complex governance."
  },
  "EU Candidate Status": {
    "icon": "🇪🇺",
    "desc": "Bosnia and Herzegovina has EU candidate status. Future accession would significantly change the value of BiH citizenship in terms of freedom of movement and economic opportunity."
  },
  "Diaspora": {
    "icon": "🌍",
    "desc": "The Bosnian diaspora is large (particularly in Germany, Austria, Switzerland, and Scandinavia). Citizenship maintenance by diaspora varies based on individual circumstances."
  }
}' WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Egyptian citizens automatically acquire citizenship. Egyptian mothers can pass citizenship to their children born abroad if the father is stateless or unknown."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years continuous legal residence for most foreigners (3 years for Arab nationals, spouses of Egyptians after 2 years of marriage), Arabic language, good character, renunciation of previous citizenship.\n\n**Processing:** Presidential approval required; 2-4 years."
  },
  "Investment Naturalization": {
    "icon": "💰",
    "desc": "Investors making significant contributions to the Egyptian economy (USD 250,000+ in certain approved sectors) may apply for accelerated naturalization."
  },
  "Birthright Citizenship": {
    "icon": "🏺",
    "desc": "Limited birthright citizenship: children born in Egypt to unknown or stateless parents acquire Egyptian citizenship. Jus soli not broadly applied."
  }
}' WHERE name = 'Egypt';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Maldivian citizens acquire citizenship. However, children born abroad to Maldivian citizens must be registered with authorities to secure citizenship."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** Marriage to Maldivian citizen for 3 years (with conversion to Islam required), OR continuous legal residence of 12 years.\n\n**Note:** Non-Muslims cannot obtain Maldivian citizenship. Islam is constitutionally the state religion."
  },
  "Islamic Requirement": {
    "icon": "☪️",
    "desc": "The Constitution of the Maldives requires that all citizens be Muslim. Foreign nationals seeking citizenship must convert to Islam as part of the naturalization process."
  },
  "Limited Immigration": {
    "icon": "🏝️",
    "desc": "The Maldives has very limited permanent immigration programs. Long-term residency is primarily available through employment with resorts or investment. The small land area limits population capacity."
  }
}' WHERE name = 'Maldives';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Monégasque citizens acquire nationality. Nationality is transmitted through the paternal line; children of Monégasque mothers and foreign fathers require special application."
  },
  "Naturalization (Very Difficult)": {
    "icon": "📋",
    "desc": "**Requirements:** 10 years of authorized residence with at least 5 continuous years immediately preceding application, adequate means of support, moral integrity, and willingness to integrate.\n\n**In Practice:** Extremely selective; the Prince of Monaco grants nationality by sovereign ordinance at his discretion."
  },
  "Marriage to Monégasque": {
    "icon": "💍",
    "desc": "Foreign nationals married to Monégasque citizens for at least 5 years may apply for nationality after 10 years of authorized residence, subject to approval by the Prince."
  },
  "Residency Requirements": {
    "icon": "🏰",
    "desc": "Residency in Monaco requires demonstrating sufficient financial means, proof of accommodation, and good character. The waiting list for residency itself can be significant due to limited space."
  }
}' WHERE name = 'Monaco';

UPDATE countries SET citizenship_requirements = '{
  "Citizenship by Descent": {
    "icon": "👨‍👩‍👧",
    "desc": "Children of Seychellois citizens automatically acquire citizenship at birth regardless of where they are born."
  },
  "Naturalization": {
    "icon": "📋",
    "desc": "**Requirements:** 7 years legal residence (3 years for spouses of Seychellois citizens), English or French language (official languages), good character, financial stability, renunciation of previous citizenship.\n\n**Processing:** Through Civil Status Division, 12-24 months."
  },
  "Investment Residence": {
    "icon": "💰",
    "desc": "The Seychelles has investor residency programs that can provide long-term residence permits but do not automatically lead to citizenship."
  },
  "Visitor Permit System": {
    "icon": "🌴",
    "desc": "The Seychelles grants a Visitor''s Permit on arrival allowing stays of up to 3 months initially, extendable up to 12 months. This permit system is one of the world''s most welcoming for initial entry."
  }
}' WHERE name = 'Seychelles';

-- =============================================================================
-- Tax Advice
-- =============================================================================

UPDATE countries SET tax_advice = '- Hungary has a flat personal income tax rate of 15% — one of the EU''s lowest
- Corporate tax rate is 9%, the lowest flat corporate tax rate in the EU
- VAT rate is 27%, the highest in the EU (reduced rates of 18% and 5%)
- Non-residents taxed only on Hungary-sourced income
- Social security contributions total approximately 18.5% for employees
- Capital gains taxed at 15% flat rate for most assets
- No inheritance tax between direct family members
- SZÉP card system provides tax-advantaged employee benefits for leisure' WHERE name = 'Hungary';

UPDATE countries SET tax_advice = '- Croatia has progressive income tax rates (23.6% and 35.4%)
- Corporate tax is 18% (10% for annual revenues under HRK 7.5 million)
- VAT at 25% (reduced rates of 13%, 5%, and 0%)
- Extensive bilateral tax treaties reduce withholding taxes
- Digital nomads with approved status may benefit from simplified tax treatment
- Property transfer tax at 3%
- Non-residents taxed on Croatian-source income only
- Croatian Kuna replaced by Euro in 2023, simplifying cross-border financial planning' WHERE name = 'Croatia';

UPDATE countries SET tax_advice = '- US has progressive federal income tax (10% to 37%) plus state income taxes (0% to 13.3%)
- Corporate tax rate is 21% at federal level; state taxes vary
- Capital gains rates of 0%, 15%, or 20% depending on income
- US taxes citizens and permanent residents on worldwide income regardless of residence
- FBAR and FATCA require reporting of foreign bank accounts and assets
- Foreign Earned Income Exclusion (FEIE) allows up to ~$120k exclusion for abroad residents
- Sales tax varies by state (0% to over 10%); no federal sales tax
- Estate tax applies to estates over $13+ million; gift tax rules apply' WHERE name = 'United States';

UPDATE countries SET tax_advice = '- Japan has progressive income tax (5% to 45%) plus 10% local inhabitant tax
- Corporate tax effective rate approximately 30-34% including local taxes
- Consumption tax (VAT equivalent) at 10% (8% for food/beverages)
- Residents taxed on worldwide income; non-residents on Japan-source income only
- Capital gains on securities taxed at flat 20.315% (income + special restoration surtax)
- No inheritance tax exemption for non-residents inheriting from Japanese residents
- Japan-US tax treaty reduces double taxation for American expats
- Social insurance contributions mandatory; employer and employee split costs' WHERE name = 'Japan';

UPDATE countries SET tax_advice = '- Korea has progressive income tax (6% to 45%)
- Corporate tax 9%-24% depending on size and income
- VAT at 10% (one flat rate, minimal exemptions)
- Residents taxed on worldwide income; non-residents on Korea-source income only
- Capital gains on real estate can be taxed at up to 70% for short-term holdings
- Foreign tax credits available for taxes paid abroad
- National health insurance and pension contributions mandatory
- Cryptocurrency gains taxed as miscellaneous income at 20% over KRW 2.5 million' WHERE name = 'South Korea';

UPDATE countries SET tax_advice = '- UAE has zero personal income tax — none on salary, investments, or capital gains
- Corporate tax introduced in 2023 at 9% (0% for profits under AED 375,000)
- VAT at 5% (introduced 2018; limited in scope compared to other countries)
- No withholding tax on dividends or interest paid to individuals
- Free Zone companies may be exempt from corporate tax under certain conditions
- No inheritance tax or wealth tax
- Social security only mandatory for UAE national employees
- Non-residents employed in UAE pay no income tax; only social contributions if applicable' WHERE name = 'United Arab Emirates';

UPDATE countries SET tax_advice = '- Canada has progressive federal income tax (15% to 33%) plus provincial taxes (5% to 21%)
- Corporate tax at 26.5% combined federal/provincial (small business rate of 9%)
- GST/HST (goods and services/harmonized sales tax) 5%-15% depending on province
- Capital gains: 50% inclusion rate means half of capital gains added to income
- TFSA (Tax-Free Savings Account) and RRSP allow tax-advantaged saving
- Non-residents taxed at 25% withholding tax on Canadian income
- Foreign tax credits available for taxes paid abroad
- Provincial taxes vary significantly; Alberta has no provincial sales tax' WHERE name = 'Canada';

UPDATE countries SET tax_advice = '- Australia has progressive income tax (0% to 45%) plus 2% Medicare levy
- Corporate tax at 30% (25% for companies with turnover under AUD 50 million)
- GST (goods and services tax) at 10% flat
- Capital gains taxed at income tax rates; 50% discount for assets held 12+ months
- Superannuation (pension) contributions mandatory at 11%+ of salary
- Non-residents taxed at flat 32.5% on first AUD 120,000 (no tax-free threshold)
- PAYG withholding system for employment income
- Foreign residents may be exempt from capital gains on most assets' WHERE name = 'Australia';

UPDATE countries SET tax_advice = '- New Zealand has progressive income tax (10.5% to 39%)
- Corporate tax at 28%
- GST (goods and services tax) at 15%
- No capital gains tax (with some exceptions for property speculation)
- No inheritance or gift taxes
- KiwiSaver voluntary superannuation scheme with government contributions
- Non-residents taxed on NZ-source income only
- Foreign Investment Fund (FIF) rules apply to foreign investments above NZD 50,000
- Resident foreign trusts have complex disclosure requirements' WHERE name = 'New Zealand';

UPDATE countries SET tax_advice = '- Singapore has progressive personal income tax (0% to 24%)
- Corporate tax at 17% flat (effective rate often lower with exemptions for startups)
- GST (goods and services tax) at 9% (increased from 8% in 2024)
- No capital gains tax, inheritance tax, or wealth tax
- Dividends from Singapore companies are tax-exempt for individuals
- Foreign income not remitted to Singapore is generally not taxable for residents
- Startup Tax Exemption: new companies pay 0% on first SGD 100,000 profit
- Social security (CPF) mandatory for Singapore citizens and PRs only' WHERE name = 'Singapore';

UPDATE countries SET tax_advice = '- Hong Kong has low salaries tax (2% to 17%, capped at 16% of net income)
- Corporate profits tax at 16.5% (8.25% on first HKD 2 million for qualifying companies)
- No VAT, GST, sales tax, or capital gains tax
- No withholding tax on dividends or interest
- Source-based taxation: only income arising in or derived from HK is taxable
- Territorial tax system: foreign-source income exempt from HK tax
- Property rates (tax on rental value) instead of property purchase tax
- Stamp duty applies to stock and property transactions' WHERE name = 'Hong Kong';

UPDATE countries SET tax_advice = '- Czechia has 15% personal income tax (23% above 4× average salary)
- Corporate tax at 19%
- VAT at 21% (reduced rates of 12% and 0%)
- Non-residents taxed on Czech-source income only
- Social security contributions significant (~34% employer + ~11% employee)
- Capital gains from securities held 3+ years exempt from tax
- Dividend withholding tax of 15% (reduced under treaties)
- Czech Koruna (CZK) not in Eurozone; currency exposure for Euro earners' WHERE name = 'Czechia';

UPDATE countries SET tax_advice = '- Slovakia has 19% personal income tax (25% above 3× average wage threshold)
- Corporate tax at 21%
- VAT at 20% (reduced rate of 10%)
- Part of Eurozone since 2009 — no currency conversion needed for Euro earners
- Social security contributions approximately 44% total (split employer/employee)
- Capital gains generally taxed as ordinary income
- Tax residency established after 183 days or main center of life
- R&D tax super-deduction of 200% available for qualifying businesses' WHERE name = 'Slovakia';

UPDATE countries SET tax_advice = '- Bulgaria has a flat 10% personal income tax — lowest in the EU
- Corporate tax at 10% flat — also lowest in the EU
- VAT at 20% (reduced rates of 9% and 0%)
- Non-residents taxed on Bulgaria-source income only
- Capital gains from sale of personal property (one per year) may be exempt
- Dividend withholding tax of 5%
- No inheritance tax between direct family members
- Bulgaria is not in Schengen or Eurozone (uses Bulgarian Lev pegged to Euro)' WHERE name = 'Bulgaria';

UPDATE countries SET tax_advice = '- Romania has progressive income tax of 10% flat for most income
- Corporate tax at 16% (micro-enterprise revenue tax of 1-3% as alternative)
- VAT at 19% (reduced rates of 9%, 5%, and 0%)
- Non-residents taxed on Romania-source income only
- Social security contributions approximately 35% total
- Capital gains taxed at 10% for listed securities
- IT sector employees under 26 with software certifications are exempt from income tax
- Romania uses its own currency (Romanian Leu) — not in Eurozone yet' WHERE name = 'Romania';

UPDATE countries SET tax_advice = '- Luxembourg has progressive income tax (0% to 42%) plus solidarity surtax
- Corporate tax approximately 24.94% combined (15% CIT + 7% solidarity + 6.75% municipal)
- VAT at 17% (lowest standard rate in the EU), reduced rates of 14%, 8%, and 3%
- Participation exemption: dividends and capital gains from qualifying subsidiaries exempt
- Luxembourg investment vehicles (UCITS, SICAVs) widely used for EU fund management
- No wealth tax on individuals
- Significant double tax treaty network (80+ countries)
- Highly favorable for holding companies and EU fund structures' WHERE name = 'Luxembourg';

UPDATE countries SET tax_advice = '- South Africa has progressive income tax (18% to 45%)
- Corporate tax at 27%
- VAT at 15% (one of Africa''s lower standard rates)
- South African residents taxed on worldwide income
- Foreign income exemption available for those working abroad 183+ days (with some limits)
- Capital gains tax at effective rate of up to 18% for individuals
- Dividends withholding tax of 20%
- Estate duty of 20% on estates above ZAR 3.5 million (30% above ZAR 30 million)' WHERE name = 'South Africa';

UPDATE countries SET tax_advice = '- Slovenia has progressive income tax (16% to 50%)
- Corporate tax at 19%
- VAT at 22% (reduced rates of 9.5% and 5%)
- Part of Eurozone since 2007 — no currency conversion needed
- Capital gains taxed at 25% (reducing to 0% after 20 years of ownership)
- Dividend withholding tax of 27.5%
- Non-residents taxed on Slovenia-source income only
- Social contributions approximately 38% total (split employer/employee)' WHERE name = 'Slovenia';

UPDATE countries SET tax_advice = '- Latvia has progressive income tax (20% to 31%)
- Corporate tax at 20% on distributed profits (undistributed profits not taxed)
- VAT at 21% (reduced rates of 12% and 5%)
- Part of Eurozone since 2014
- Capital gains generally taxed as ordinary income
- No inheritance tax between direct family members
- Microenterprise tax regime (15%) available for small businesses
- Latvia''s distributed profit tax model (similar to Estonia) encourages reinvestment' WHERE name = 'Latvia';

UPDATE countries SET tax_advice = '- Lithuania has progressive income tax (20% and 32%)
- Corporate tax at 15% (5% for small companies and startups)
- VAT at 21% (reduced rates of 9% and 5%)
- Part of Eurozone since 2015
- Capital gains taxed at 15% flat for individuals
- No inheritance tax between direct family members
- Fintech businesses benefit from Bank of Lithuania regulatory sandbox
- Social insurance contributions approximately 30% total (split employer/employee)' WHERE name = 'Lithuania';

UPDATE countries SET tax_advice = '- China has progressive income tax (3% to 45%) for residents
- Corporate tax at 25% (15% for high-tech enterprises)
- VAT at 13% for goods, 9% for key sectors, 6% for services
- Non-residents taxed on China-source income only (with treaty benefits)
- Capital gains from listed securities generally exempt
- Real estate transfer gains taxed as income at up to 30%
- Annual individual tax return required for income above CNY 120,000
- China''s tax residency rules require 183+ days presence; long-term residents taxed on worldwide income' WHERE name = 'China';

UPDATE countries SET tax_advice = '- Mongolia has progressive income tax (10% to 25%)
- Corporate tax at 10% (for income below MNT 6 billion) or 25% above threshold
- VAT at 10%
- Non-residents taxed on Mongolia-source income only
- Mining sector has special royalty and tax regimes
- Capital gains from securities taxed at flat 10%
- Withholding tax of 20% on dividends paid to non-residents
- Double tax treaty network limited; check applicable treaties before investing' WHERE name = 'Mongolia';

UPDATE countries SET tax_advice = '- Liechtenstein has very low income tax (1.2% to 8% cantonal/communal rates + national tax)
- Effective combined income tax rate rarely exceeds 20% even for high earners
- Corporate tax at approximately 12.5% effective rate
- VAT at 7.7% (same as Switzerland, part of Swiss customs union)
- No inheritance tax for direct family members; modest rates for others
- No wealth tax exceeding modest annual base
- Participation exemption for qualifying dividends and capital gains at holding level
- High-net-worth individuals may negotiate lump-sum taxation agreements' WHERE name = 'Liechtenstein';

UPDATE countries SET tax_advice = '- Saudi Arabia has zero personal income tax for Saudi nationals and foreign employees
- Corporate income tax at 20% for foreign entities (Zakat — Islamic tax at 2.5% for Saudi entities)
- VAT at 15% (raised from 5% in 2020 to address oil revenue shortfall)
- No capital gains tax for individuals on most assets
- Withholding tax of 5-20% on payments to non-residents depending on type
- Real estate transaction tax of 5%
- GOSI (General Organization for Social Insurance) contributions for Saudi nationals
- Vision 2030 creating new economic activity and business registration opportunities' WHERE name = 'Saudi Arabia';

UPDATE countries SET tax_advice = '- Vietnam has progressive personal income tax (5% to 35%)
- Corporate tax at 20% (10% for certain high-tech and social enterprises)
- VAT at 10% (5% for essentials, 0% for exports)
- Non-residents taxed at flat 20% on Vietnam-source income
- Capital gains from securities taxed at 0.1% on gross proceeds or 20% on net gain
- Real estate transfer taxed at 2% of transfer price
- Withholding tax on dividends at 5% for individuals
- Vietnam-US tax treaty and extensive treaty network available' WHERE name = 'Vietnam';

UPDATE countries SET tax_advice = '- Argentina has progressive income tax (5% to 35%)
- Corporate tax at 35%
- VAT at 21% (reduced rates of 10.5% and 0%)
- Extraordinary inflation means real-terms calculations are complex
- Withholding taxes of 7-35% on payments to non-residents
- Wealth/assets tax (Bienes Personales) at 0.5-1.5% annually
- High effective tax burden for businesses but enforcement variable
- Official and informal exchange rates differ significantly; tax planning complex
- Digital nomads may qualify for special income tax treatment on foreign earnings' WHERE name = 'Argentina';

UPDATE countries SET tax_advice = '- Brazil has progressive income tax (7.5% to 27.5%) for residents
- Corporate tax at 15% (25% above BRL 20,000/month) plus 9% social contribution
- ICMS (state VAT) at 12-25%; federal taxes (PIS/COFINS) also apply; total tax burden on goods can exceed 40%
- Non-residents taxed at flat 25% on Brazil-source income
- Capital gains on assets held abroad taxed at 15-22.5%
- IOF (financial operations tax) applies to currency exchange and some financial transactions
- Brazil has a Digital Nomad Visa allowing tax-favorable treatment on foreign income
- Brazil''s complex tax system often requires local professional advice' WHERE name = 'Brazil';

UPDATE countries SET tax_advice = '- India has progressive income tax (0% to 30%) under new or old regime
- Corporate tax at 22% (new regime) or 25-30% (domestic companies old regime)
- GST at 5%, 12%, 18%, or 28% depending on goods/services
- Non-residents taxed on India-source income only
- Capital gains: STCG at 15% on listed equities (held <1 year); LTCG at 10% above INR 1 lakh
- TDS (Tax Deducted at Source) system means most income is pre-taxed
- India''s tax treaty network with 90+ countries
- Remote workers earning abroad while resident in India must declare worldwide income' WHERE name = 'India';

UPDATE countries SET tax_advice = '- Malaysia has progressive income tax (1% to 30%)
- Corporate tax at 24% (17% for SMEs on first MYR 600,000)
- GST abolished in 2018; replaced by SST (Sales and Services Tax) at 5-10%
- Non-residents taxed at flat 30% on Malaysia-source income
- Capital gains on shares generally exempt; RPGT applies to property (5-30% depending on holding period)
- Dividends from Malaysian companies received by individuals are tax-exempt (single-tier system)
- MM2H participants enjoy some preferential tax treatment on foreign pension income
- Double tax treaty with 70+ countries' WHERE name = 'Malaysia';

UPDATE countries SET tax_advice = '- Moldova has flat 12% personal income tax
- Corporate tax at 12%
- VAT at 20% (reduced rates of 12%, 8%, and 0%)
- Non-residents taxed on Moldova-source income only
- Capital gains generally taxed at standard 12% income tax rate
- No inheritance tax between direct family members
- Moldova has limited double tax treaty network
- EU association agreement provides some harmonization of tax rules
- Wine export sector receives certain preferential fiscal treatments' WHERE name = 'Moldova';

UPDATE countries SET tax_advice = '- Albania has flat 23% personal income tax (0% on income below ALL 30,000/month)
- Corporate tax at 15% (0% for agricultural businesses and SMEs under ALL 14 million)
- VAT at 20% (6% for tourism sector)
- Non-residents taxed on Albanian-source income only
- Capital gains at 15% flat rate
- Withholding tax of 15% on dividends
- Albania is not in the EU; different trade and customs rules apply
- Digital nomad-friendly visa available; income earned abroad may have favorable tax treatment' WHERE name = 'Albania';

UPDATE countries SET tax_advice = '- Georgia has a flat 20% personal income tax (one of Europe''s simplest and lowest)
- Corporate tax at 15% (20% on distributed profits in Estonia-style system)
- VAT at 18%
- Non-residents taxed on Georgia-source income only
- Virtual Zone Company (IT businesses) pay 0% corporate tax on foreign-source revenue
- No capital gains tax for individuals on securities held in qualifying accounts
- Free Industrial Zones offer further tax incentives for manufacturers
- Territorial tax system: foreign income of Georgia-resident companies not taxable if not Georgia-sourced' WHERE name = 'Georgia';

UPDATE countries SET tax_advice = '- Israel has progressive income tax (10% to 50%)
- Corporate tax at 23%
- VAT at 17%
- New immigrants (Olim) receive 10-year tax holiday on foreign-source income
- Long-term returnees (living abroad 6+ years) may also receive partial tax exemptions
- Capital gains on listed securities at 25% (or 30% for substantial shareholders)
- Non-residents taxed on Israel-source income only
- Dividend withholding tax of 25% (reduced to 15% for qualifying situations)
- National Insurance (Bituach Leumi) contributions mandatory for residents' WHERE name = 'Israel';

UPDATE countries SET tax_advice = '- The Bahamas has zero personal income tax, zero capital gains tax, zero inheritance tax
- No corporate income tax (businesses pay annual license fees instead)
- VAT at 10% (introduced 2015)
- No payroll tax for employers; National Insurance contribution of 3.9% employee + 5.9% employer
- Real property tax based on market value of land and improvements
- Business license fee typically 0.5-1.5% of annual turnover
- Stamp duty on real estate transactions at 2.5-10% depending on value
- No double tax treaties with major economies; US citizens still taxed on worldwide income' WHERE name = 'Bahamas';

UPDATE countries SET tax_advice = '- Pakistan has progressive income tax (5% to 35% for salaried, higher for business income)
- Corporate tax at 29% (reducing to 27% under ongoing reforms)
- GST at 17% (varies by province and category)
- Non-residents taxed on Pakistan-source income only
- Capital gains on securities at 12.5-15% depending on holding period
- Withholding tax system (advance tax) prevalent
- Super tax of 10% on high-income companies
- Pakistan-UK, Pakistan-US, and various other double tax treaties available
- Real estate gains taxed at 3-10% depending on holding period' WHERE name = 'Pakistan';

UPDATE countries SET tax_advice = '- Qatar has zero personal income tax — no taxes on individual salaries, dividends, or capital gains
- Corporate tax at 10% for non-Qatari entities (Qatari and GCC entities may be exempt)
- VAT not yet implemented (planned but not enacted as of 2026)
- No inheritance tax, wealth tax, or gift tax
- Withholding tax of 5% on services paid to non-residents
- Free Zone entities may be fully exempt from corporate tax
- Social security only for Qatari nationals
- Proof of legitimate income needed for residency but not taxed' WHERE name = 'Qatar';

UPDATE countries SET tax_advice = '- Bosnia and Herzegovina has flat 10% personal income tax (varies slightly by entity)
- Corporate tax at 10% (Federation BiH) or 10% (Republika Srpska)
- VAT at 17% (uniform across country — administered by Indirect Taxation Authority)
- Non-residents taxed on BiH-source income only
- Capital gains integrated into income tax base
- Social security contributions approximately 41.5% total (split employer/employee)
- Withholding tax on dividends at 5%
- Complex dual-entity system (Federation and Republika Srpska have separate tax administrations)' WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET tax_advice = '- Egypt has progressive income tax (0% to 25%)
- Corporate tax at 22.5%
- VAT at 14%
- Non-residents taxed on Egypt-source income only
- Capital gains from securities listed on Egyptian Stock Exchange exempt
- Dividend withholding tax of 10% for individuals
- Real estate transaction tax of 2.5%
- Free zone entities may be exempt from corporate tax
- Egypt-US and extensive treaty network available' WHERE name = 'Egypt';

UPDATE countries SET tax_advice = '- Maldives has no personal income tax for individuals
- Business Profit Tax (BPT) at 15% for businesses with revenue over MVR 1 million
- GST at 6% for tourism sector (16% for tourist establishments under GST Act)
- No capital gains tax, inheritance tax, or wealth tax
- Tourism Goods and Services Tax (TGST) is the primary revenue source
- Resort operators pay significant lease fees to the government
- Work permit fees apply for expatriate employees
- No double tax treaty network of significance' WHERE name = 'Maldives';

UPDATE countries SET tax_advice = '- Monaco has zero personal income tax for residents (except French citizens)
- No corporate income tax for most businesses (except financial activities)
- VAT at 20% (same rate as France under customs union)
- No capital gains tax, no inheritance tax between direct heirs, no wealth tax
- French citizens living in Monaco are subject to French income tax under the 1963 Franco-Monégasque Treaty
- Residency requires proof of financial means and accommodation
- Residency is not automatic even without tax considerations; must apply and qualify
- Monaco''s CRS (Common Reporting Standard) membership means financial info shared internationally' WHERE name = 'Monaco';

UPDATE countries SET tax_advice = '- Seychelles has progressive income tax (0% to 15%) under Social Security Act
- Corporate tax at 25% (15% for companies in International Business Companies regime)
- GST at 15%
- International Business Companies (IBCs) can be structured for low/zero tax on non-Seychelles income
- Capital gains generally not taxed for individuals
- Withholding tax of 15% on dividends for residents
- No inheritance tax
- Seychelles is a significant offshore financial center with special IBC and foundation legislation' WHERE name = 'Seychelles';

-- =============================================================================
-- Local Tips
-- =============================================================================

UPDATE countries SET local_tips = '- Hungarian (Magyar) is unique and difficult; learning basics shows respect but English is widely spoken among younger people
- Bureaucracy efficient but can be document-heavy; keep all paperwork organized
- Healthcare good quality; mandatory National Health Insurance (OEP) required for residents
- Cost of living low by EU standards; budget €800-1,200/month comfortably in Budapest
- Budapest neighborhood choice matters: Pest districts 5, 6, 7 central and vibrant; Buda quieter
- Thermal baths are a social institution; visit regularly to integrate into local culture
- Hungarian cuisine hearty and affordable; explore market halls (Nagyvásárcsarnok) for local produce
- Winters can be cold and grey; embrace the ruin bar and cafe culture during colder months' WHERE name = 'Hungary';

UPDATE countries SET local_tips = '- Croatian is the official language; English very common in cities and tourist areas
- Healthcare: register with chosen family doctor (izabrani liječnik) within 30 days of residency
- Cost of living rising in Dalmatia; budget €900-1,400/month in Split or Dubrovnik
- Seasonal economy: summer coastal towns crowded and expensive; off-season much quieter
- Digital nomad visa gives one year renewable stay with work-from-abroad income
- Bureaucracy improving but can be slow; get OIB number (tax ID) first on arrival
- Driving cars with foreign plates: rules around long-term use vary; seek local advice
- Adriatic food culture exceptional; fresh fish and local wine are genuinely world-class' WHERE name = 'Croatia';

UPDATE countries SET local_tips = '- English is the primary language but dialects, accents, and slang vary enormously by region
- Healthcare expensive and insurance critical; marketplace plans available for non-employer coverage
- Social Security Number (SSN) essential for banking, employment, and tax filing
- Cost of living varies dramatically: NYC/SF very expensive; midwest/south much more affordable
- US visa system complex; work with an immigration attorney for best outcomes
- Tipping culture expected: 18-25% at restaurants, 15-20% for taxis/Uber, $1-2/bag for hotel
- Credit score system important; build it carefully from arrival using secured cards
- State varies enormously in laws, taxes, climate, culture; research specific state before choosing where to live' WHERE name = 'United States';

UPDATE countries SET local_tips = '- Japanese language essential for daily life outside major tourist areas; even N4 level helps significantly
- Bureaucracy organized but requires My Number card registration within 14 days of arrival
- Healthcare: National health insurance mandatory; register at ward office immediately
- Cost of living manageable in regional cities; Tokyo expensive especially for housing
- Punctuality absolute; being even 1 minute late is considered rude in professional settings
- IC card (Suica/Pasmo) essential for transportation; buy at any train station
- Garbage sorting rules strict and taken very seriously; learn your ward''s system
- Japanese people indirect in communication; learn to read between the lines and avoid direct confrontation' WHERE name = 'Japan';

UPDATE countries SET local_tips = '- Korean language helpful but English increasingly spoken in Seoul among younger generations
- Alien Registration Card (ARC) required within 90 days; register at immigration office
- Healthcare excellent and affordable with National Health Insurance
- Internet fastest in the world; expect 1Gbps fiber connections standard
- Hierarchy and age-based respect central to social and professional interactions
- Download KakaoTalk app immediately; it''s the dominant communication platform
- Cost of living high in Seoul; consider Busan or Incheon for more affordable options
- Banking: open account with IBK or KEB Hana as foreigner-friendly options' WHERE name = 'South Korea';

UPDATE countries SET local_tips = '- Arabic language not required for expats; English and Hindi widely used in business and daily life
- Emirates ID required within 30 days of visa stamping; process through ICA (ICP)
- Healthcare excellent at private hospitals; medical insurance mandatory for residents
- Cost of living high, especially housing; budget AED 120,000+/year for comfortable expat life
- Ramadan affects business hours, restaurants, and social behavior; dress modestly and be respectful
- Alcohol available in licensed venues only; not sold in general supermarkets
- Summer (June-August) extreme heat (45°C+); most activity moves indoors or to cooler regions
- Summer electric bills high due to air conditioning; factor into budget' WHERE name = 'United Arab Emirates';

UPDATE countries SET local_tips = '- English and French official; French required in Quebec; learn basic French for courtesy nationwide
- SIN (Social Insurance Number) required immediately; apply at Service Canada center
- Healthcare provincial; wait times for specialists can be long; private clinics emerging
- Housing costs very high in Toronto and Vancouver; consider secondary cities
- Weather extreme by region; proper winter gear essential (especially outside BC coast)
- Tap water excellent and safe everywhere; save on bottled water
- Tim Hortons is more than a coffee shop — it''s a cultural institution
- PR process: maintain residency obligations carefully to protect permanent resident status' WHERE name = 'Canada';

UPDATE countries SET local_tips = '- English primary language; most bureaucracy, healthcare, and services in English
- Tax File Number (TFN) required for employment and banking; apply through ATO website
- Medicare (universal healthcare) available to residents; bulk billing eliminates out-of-pocket costs
- Housing crisis in Sydney and Melbourne; consider Brisbane, Adelaide, or Perth
- Skin cancer risk real; SPF 50 sunscreen and UV protective clothing strongly recommended
- Driving on left side; international driver''s license convertible to Australian license
- Public transport varies dramatically by city; car often needed outside major CBDs
- Bushfire and flood awareness essential; check local emergency alerts for your region' WHERE name = 'Australia';

UPDATE countries SET local_tips = '- English primary language; Māori (te reo) increasingly present in public life
- IRD number (tax ID) required before starting work; apply online immediately
- Healthcare good; enroll with a GP practice as soon as possible
- Housing expensive in Auckland and Wellington; consider Hamilton, Christchurch, or regional towns
- Car essential outside Auckland and Wellington; public transport limited in most areas
- Earthquakes common; register for civil defense alerts and know what to do
- Outdoor culture central: hiking (tramping), camping, and sport expected activities
- Kiwi culture values modesty and a fair go; avoid bragging or being seen to think you''re better' WHERE name = 'New Zealand';

UPDATE countries SET local_tips = '- English one of four official languages; communication generally easy for anglophones
- MyInfo/Singpass digital ID required for all government and many private services; set up first
- Healthcare world-class at public and private hospitals; Medishield Life insurance provided for PRs
- Housing expensive; HDB public flats affordable but requires PR/citizen status; private rentals steep
- Heat and humidity year-round; stay hydrated and wear breathable clothing
- Fine-heavy laws: no chewing gum (imported), no jaywalking, no littering; obey strictly
- Hawker centers and food courts offer extraordinary cuisine for SGD 3-5/meal
- ERP electronic road pricing discourages driving; MRT and bus system world-class' WHERE name = 'Singapore';

UPDATE countries SET local_tips = '- Cantonese primary language; Mandarin increasingly useful; English in business/official contexts
- Registration with Immigration Department required for long-term visa holders
- Healthcare excellent at public hospitals (subsidized for visa holders) and private facilities
- Housing extremely expensive; be prepared for very small living spaces even at high cost
- MTR (Mass Transit Railway) world-class and covers city efficiently; Octopus card essential
- Dim sum culture: Sunday yum cha with family is a cherished social institution
- Political situation fluid since 2020; follow news on visa policy and legal environment
- Air quality variable; check AQI daily and have N95 masks available during pollution spikes' WHERE name = 'Hong Kong';

UPDATE countries SET local_tips = '- Czech language helpful but English very common in Prague among professionals and younger people
- Residence registration required within 30 days at local Foreign Police (Cizinecká policie)
- Healthcare free for those contributing to Czech health insurance; register with health fund
- Cost of living low by EU standards; budget €800-1,100/month in Prague
- Beer culture ubiquitous: Czech pub (hospoda) central to social life; learn basic etiquette
- Czech koruna (CZK) not Euro; currency conversion needed for Euro-area travel
- Prague tourist areas saturated in summer; explore local neighborhoods (Žižkov, Vinohrady)
- Drivers and cyclists have different road priorities than UK/US; learn local traffic rules' WHERE name = 'Czechia';

UPDATE countries SET local_tips = '- Slovak language helpful; English widespread especially in Bratislava among young professionals
- Registration with Foreign Police required within 3 days for non-EU citizens
- Healthcare adequate; register with health insurance fund (VšZP, Dôvera, or Union)
- Cost of living lowest in Eurozone; budget €600-900/month comfortably in Bratislava
- Bratislava perfectly positioned between Vienna (45 min) and Budapest (1 hour by bus/train)
- Mountains very close; skiing in Jasná and Low Tatras accessible for weekend trips
- Slovak cuisine hearty and cheap; try bryndzové halušky (potato dumplings with sheep cheese)
- Expat community small but growing; coworking spaces concentrated in downtown Bratislava' WHERE name = 'Slovakia';

UPDATE countries SET local_tips = '- Bulgarian language uses Cyrillic script; learning alphabet helps navigation significantly
- Registration required within 3 months at local municipality for EU citizens, sooner for others
- Healthcare variable quality; supplement public system with private insurance
- Cost of living among EU''s lowest; budget €600-800/month in Sofia
- Bansko excellent ski resort town and growing digital nomad hub with low costs
- Headshaking means yes, head nodding means no — opposite of most cultures; memorize this
- Black Sea resorts crowded in July-August; shoulder seasons (May-June, Sept) ideal
- Sofia growing tech scene; monthly startup events and networking worth attending' WHERE name = 'Bulgaria';

UPDATE countries SET local_tips = '- Romanian language is Romance-based; Spanish or Italian speakers adapt quickly
- Registration with Population Records within 15 days of arrival (EU citizens: within 3 months)
- Healthcare improving but slow in public system; private insurance recommended
- Internet fastest in Europe; remote work infrastructure excellent
- Cost of living very low; budget €600-900/month in Bucharest or Brașov
- Transylvania and Carpathians easily accessible for weekend adventures
- Bucharest growing fast; gentrifying neighborhoods (Floreasca, Dorobanți, Pantelimon) worth exploring
- Tap water safe in Bucharest but bottled often preferred; check by city/town' WHERE name = 'Romania';

UPDATE countries SET local_tips = '- Luxembourgish, French, and German all used in daily life; English essential in business
- Registration with commune required within 3 months; get official residence certificate
- Healthcare excellent and mandatory insurance (CNS) required for all residents
- Extremely high cost of living; housing shortage severe; budget €2,500+/month
- Cross-border commuters (from France, Germany, Belgium) very common; understand commute options
- Free public transport (buses, trains, trams) for all since 2020 — a world first
- International expat community large; English-speaking social networks very established
- Luxembourg City small but culturally rich; proximity to surrounding countries unparalleled' WHERE name = 'Luxembourg';

UPDATE countries SET local_tips = '- English widely spoken in Cape Town and Johannesburg; Afrikaans and Zulu also common
- Smart ID and green barcoded ID book required; foreign residents need valid permit always on person
- Healthcare: private hospitals excellent (Discovery, Netcare); public system strained — get private insurance
- Load shedding (scheduled power cuts) affects daily life; invest in backup power/battery
- Personal security awareness important; avoid displaying valuables and research safe neighborhoods
- Cost of living very low by global standards; budget ZAR 15,000-25,000/month for comfortable life
- Wildlife within reach of Johannesburg and Cape Town; regular safari weekends possible
- South African food scene underrated: braai culture, Cape Malay cuisine, and Durban curry all exceptional' WHERE name = 'South Africa';

UPDATE countries SET local_tips = '- Slovenian language similar to Croatian/Serbian; English very widespread especially in Ljubljana
- Registration with Administrative Unit required within 8 days for non-EU citizens
- Healthcare excellent; mandatory health insurance registration on arrival
- Cost of living moderate by EU standards; budget €900-1,200/month in Ljubljana
- Lake Bled just 1 hour from Ljubljana; easily accessible for regular escapes
- Triglav National Park UNESCO World Heritage site; hiking and outdoor culture central to Slovenian identity
- Ljubljana car-free center; cycling very popular and infrastructure excellent
- Very safe and clean; consistently ranked top European country for quality of life' WHERE name = 'Slovenia';

UPDATE countries SET local_tips = '- Latvian and Russian both widely spoken; English very common especially in Riga
- Register with PMLP (Office of Citizenship and Migration Affairs) within 3 months
- Healthcare: register with family doctor; health insurance for non-EU residents recommended
- Cost of living low by EU standards; budget €700-1,000/month in Riga
- Riga Art Nouveau district genuinely world-class; best explored on foot
- Baltic summers short but beautiful; make the most of June-August outdoor season
- Jurmala (seaside resort 30 min from Riga) excellent for beach days
- Growing fintech sector; networking in startup and finance community productive' WHERE name = 'Latvia';

UPDATE countries SET local_tips = '- Lithuanian and Russian both spoken; English widespread among professionals and younger people
- Register at Migration Department within 3 months (EU) or within residency visa conditions
- Healthcare: register with State Patient Fund (VPSP); private clinics also excellent and affordable
- Cost of living low by Eurozone standards; budget €700-1,000/month in Vilnius
- Vilnius tech and fintech ecosystem growing fast; attend Vilnius Tech Park and LOGIN events
- Curonian Spit accessible for weekend trips from Vilnius; unique natural landscape
- Vilnius Old Town among Europe''s best preserved and least crowded; explore thoroughly
- Lithuanian amber considered world''s finest; great authentic souvenirs' WHERE name = 'Lithuania';

UPDATE countries SET local_tips = '- Mandarin Chinese (Putonghua) official and essential for daily life; regional dialects also common
- Residence permits required within 30 days of arrival; register at local Public Security Bureau
- VPN essential for accessing Google, Gmail, WhatsApp, Facebook, Instagram, and most Western sites
- Healthcare: large cities excellent private hospitals; expat health insurance strongly recommended
- WeChat is everything: payments, maps, ordering, messaging, and social life — set up immediately
- High-speed rail network extraordinary; travel between cities by HSR much faster than flying
- Cost of living very affordable outside Shanghai and Beijing; budget ¥8,000-15,000/month
- Air quality varies; check real-time AQI and use N95 masks during high pollution days' WHERE name = 'China';

UPDATE countries SET local_tips = '- Mongolian language Cyrillic-based; Russian and English basic phrases very helpful in Ulaanbaatar
- Extreme climate: prepare for -40°C winters and +35°C summers; appropriate gear essential
- Healthcare: private hospitals in Ulaanbaatar adequate; evacuate to Seoul or Tokyo for serious conditions
- Cost of living very low; budget ₮500,000-800,000/month for comfortable expat life
- Air pollution severe in Ulaanbaatar winter due to coal heating; N95 masks essential
- Nomadic hospitality rules: always accept offered food and drink (especially airag/fermented mare''s milk)
- Naadam festival (July) national celebration — extraordinary cultural experience for newcomers
- Travel in rural areas requires guide, spare tires, extra fuel; roads minimal outside cities' WHERE name = 'Mongolia';

UPDATE countries SET local_tips = '- German official language; English spoken in business but everyday German essential
- Residency permit application through Ausländeramt; requires appointment booked in advance
- Healthcare mandatory Swiss insurance (Grundversicherung) required within 3 months; very expensive
- Extremely high cost of living; budget CHF 4,000-6,000+/month even outside Zurich/Geneva
- Rhine Valley location very scenic; hiking and cycling from Vaduz excellent
- Swiss cross-border shopping common; residents regularly shop in Austria and Switzerland for staples
- Very small community; everyone knows everyone; discretion and respect for neighbors important
- Train connections to Zurich (1 hour) and Innsbruck easy for wider European travel' WHERE name = 'Liechtenstein';

UPDATE countries SET local_tips = '- Arabic essential in daily life; English widely spoken in business and major cities
- Iqama (residency permit) required for employment; sponsor/employer manages process
- Healthcare: excellent private hospitals (King Faisal, Johns Hopkins Arabia); mandatory health insurance
- Heat extreme in summer (50°C+); move outdoors to evenings only May-September
- Dress modestly; abaya required in some traditional areas; check current regulations
- Avoid all criticism of government, royal family, or religion; legal consequences severe
- Halal food only; alcohol completely prohibited throughout the Kingdom
- Vision 2030 creating rapid cultural shifts; entertainment, sports, and tourism expanding fast' WHERE name = 'Saudi Arabia';

UPDATE countries SET local_tips = '- Vietnamese language tonal and challenging; English increasingly common in cities and tourist areas
- Temporary residence registration required within 1 month at local police station
- Healthcare: private international hospitals (Vinmec, FV Hospital) excellent; health insurance recommended
- Cost of living extraordinary value; budget $500-800/month for comfortable expat lifestyle
- Motorbike culture dominates; traffic rules informal; hire experienced driver initially or take taxis
- Da Nang, Hoi An, and Ho Chi Minh City main digital nomad hubs with excellent coworking
- Cash dominant outside major cities; carry dong and USD for rural areas
- Rainy/typhoon season (October-December in north and centre) affects travel; plan accordingly' WHERE name = 'Vietnam';

UPDATE countries SET local_tips = '- Spanish official; Argentine Spanish distinct with vos usage and Italian-influenced accent
- DNI (national identity document) or cedula required; for long-term residents, obtain CUIL/CUIT
- Healthcare: private clinics excellent in Buenos Aires; OSDE insurance recommended
- Currency situation complex; blue dollar (informal) rate much better than official; seek local advice
- Cost of living very low in USD/EUR terms despite high local inflation
- Buenos Aires: research neighborhoods (Palermo, Belgrano, Recoleta) for best expat fit
- Safety variable by neighborhood and city; research before going to unfamiliar areas
- Argentines eat dinner very late (10pm-midnight); social life starts extremely late by most standards' WHERE name = 'Argentina';

UPDATE countries SET local_tips = '- Portuguese (Brazilian dialect) official; different from European Portuguese in accent and vocabulary
- CPF (Cadastro de Pessoas Físicas) number essential for banking, contracts, and tax — obtain first
- Healthcare: SUS public system free but often overcrowded; private insurance strongly recommended
- Cost of living varies dramatically; São Paulo expensive by South American standards; smaller cities affordable
- Safety awareness critical in major cities; research neighborhoods and apply common-sense precautions
- Traffic culture aggressive; Uber widely available and preferred over driving initially
- Digital nomad visa available; requires minimum $1,500/month income proof
- Brazilians very warm and social; participating in churrasco and futebol culture accelerates integration' WHERE name = 'Brazil';

UPDATE countries SET local_tips = '- English widely spoken in business, education, and urban India; regional languages helpful
- FRRO (Foreign Regional Registration Office) registration required within 14 days for most visas
- Healthcare: international hospitals (Apollo, Fortis, Manipal) excellent in major cities; insurance essential
- Extreme climate variation: monsoon (June-September), intense heat in plains, cold in mountains
- Cost of living very low; budget ₹50,000-80,000/month for comfortable expat life in major cities
- Traffic chaotic in all major cities; hire local driver initially rather than driving yourself
- Chai culture important social lubricant; participate genuinely in social customs
- India moves on relationship (jugaad) basis; building trust and personal connections essential for business' WHERE name = 'India';

UPDATE countries SET local_tips = '- Malay official language; English widely used in business and daily life — genuinely accessible
- Visa/residence permit through Immigration Department; MM2H requires financial proof and approvals
- Healthcare excellent at private hospitals (Prince Court, Pantai); Medic medical insurance recommended
- Cost of living very reasonable; budget RM 4,000-6,000/month for comfortable expat life
- Islamic customs respected; dress modestly at mosques and religious sites
- Heat and humidity year-round; air conditioning essential and universally available
- Grab app (like Uber) essential for transport; MRT excellent in KL
- Hawker food culture extraordinary; Jalan Alor, Chow Kit, and Chinatown food streets legendary' WHERE name = 'Malaysia';

UPDATE countries SET local_tips = '- Romanian/Moldovan is the official language; Russian widely spoken by minorities
- Registration required within 30 days at local Civil Records Office
- Healthcare: private clinics in Chișinău adequate; medical insurance for serious conditions needed
- Cost of living among Europe''s lowest; budget €400-600/month comfortably
- Wine experience genuinely extraordinary; Cricova winery tours world-class
- Power outages historically common; have backup solutions especially in winter
- Transnistria region interesting day trip from Chișinău; carry passport and be aware of unusual rules
- Romanian citizenship option widely pursued by eligible Moldovans for EU freedom of movement' WHERE name = 'Moldova';

UPDATE countries SET local_tips = '- Albanian is the official language; Italian widely understood; English growing rapidly
- Registration at local Civil Registration Office required within 30 days of residency
- Healthcare: private clinics in Tirana adequate for most needs; international insurance for serious conditions
- Cost of living among Europe''s absolute lowest; budget €400-600/month comfortably
- Tirana''s transformation rapid; Blloku district coffee culture excellent and trendy
- Albanian Riviera accessible by furgon (shared minibus) from Tirana; car hire more flexible
- Driving can be challenging; traffic rules loosely observed especially in cities
- Expat and digital nomad community growing quickly; Tirana ranked as emerging nomad hub' WHERE name = 'Albania';

UPDATE countries SET local_tips = '- Georgian language uses unique script (Mkhedruli); learn to recognize it but English widespread in Tbilisi
- Registration not required for up to 1-year stays; for longer, apply for residence permit
- Healthcare: private clinics in Tbilisi excellent and very affordable; international standard
- Cost of living very low; budget €600-900/month very comfortably in Tbilisi
- Wine culture pervasive; natural and qvevri wines fundamental to social life
- Supras (feasts) can last for hours with multiple toasts; pace yourself with the chacha (grape brandy)
- Tbilisi nightlife (especially techno scene) world-renowned; Bassiani and Khidi venues legendary
- Kazbegi mountain road stunning but sometimes closed in winter; check conditions before driving' WHERE name = 'Georgia';

UPDATE countries SET local_tips = '- Hebrew and Arabic official languages; English widely spoken especially in Tel Aviv and tech sector
- Population Registry (Ministry of Interior) registration required; Olim have dedicated Aliyah process
- Healthcare: universal Kupat Holim system excellent; join one of four health funds immediately
- Cost of living in Tel Aviv very high; one of world''s most expensive cities for housing
- Shabbat (Friday sunset to Saturday night) affects most services and transport — plan around it
- Security situation awareness important; follow government advisories and be aware of surroundings
- Startup ecosystem world-class; attend TechTLV, HUB:TLV events for networking
- Israeli directness (chutzpah) can feel abrasive; it is cultural, not personal — respond in kind' WHERE name = 'Israel';

UPDATE countries SET local_tips = '- English official language; Bahamian Creole spoken socially; very accessible for English speakers
- Immigration registration at Department of Immigration; carry visa documentation always
- Healthcare: Princess Margaret Hospital public; Doctors Hospital private and high quality; insurance essential
- Cost of living high; budget BSD 3,000-4,500/month for comfortable expat life
- Hurricane season June-November; hurricane shutters/preparedness essential; monitor weather closely
- Alcohol available but expensive; local Sands and Kalik beers most affordable
- Water activity culture central: sailing, diving, snorkeling key to social integration
- Banking: Nassau has international banking options; US banking also often maintained' WHERE name = 'Bahamas';

UPDATE countries SET local_tips = '- Urdu national language; English has official status and widely used in business and education
- NADRA registration and Pakistan Origin Card (POC) or National Identity Card for Overseas Pakistanis
- Healthcare: private hospitals in Islamabad and Karachi excellent (Shifa, Aga Khan); insurance recommended
- Cost of living very low; budget PKR 80,000-120,000/month very comfortably in major cities
- Northern areas (Gilgit-Baltistan, Hunza) extraordinarily beautiful and safe; highly recommended
- Security situation varies by region; research specific areas; avoid conflict zones near Afghan border
- Pakistani hospitality legendary; accept home invitations and participate in meals enthusiastically
- Mobile data excellent in cities; remote mountain areas limited connectivity' WHERE name = 'Pakistan';

UPDATE countries SET local_tips = '- Arabic official language; English widely used in business and hospitality sectors
- Residency permit (RP) required; employer typically manages for work visa holders
- Healthcare: Hamad Medical Corporation excellent public healthcare for residents
- Heat extremely intense May-September; outdoor activities only possible in evenings
- Alcohol available only in licensed hotels and restaurants; not widely available
- Islamic customs respected; dress modestly especially outside resort areas
- Qatar Foundation and Doha Institute offer excellent cultural programming in English
- Corniche waterfront and Katara cultural village excellent for outdoor activities in cooler months' WHERE name = 'Qatar';

UPDATE countries SET local_tips = '- Bosnian/Croatian/Serbian mutually intelligible; English growing especially in Sarajevo and among younger people
- Registration at Ministry of Civil Affairs required; process can be slow
- Healthcare: private clinics in Sarajevo adequate; insurance for serious conditions recommended
- Cost of living among Europe''s very lowest; budget €400-700/month comfortably
- Sarajevo food culture extraordinary; cevapi (grilled meat) and baklava iconic
- Warm hospitality culture; invitations to coffee (kafa) important social rituals
- Driving between entities requires attention; road quality varies; watch speed cameras
- Mostar day trip from Sarajevo (2.5 hours) absolutely worth it for the iconic bridge' WHERE name = 'Bosnia and Herzegovina';

UPDATE countries SET local_tips = '- Arabic (Egyptian dialect) most widely understood Arabic in the world due to media influence
- Registration with CAPMAS (immigration authorities) required; process varies by visa type
- Healthcare: private hospitals excellent in Cairo (Cairo American Medical Center); insurance strongly recommended
- Extremely hot April-September; avoid midday sun and schedule activities for morning/evening
- Traffic chaotic in Cairo; Uber/Careem safer than hailing taxis; metro efficient for city travel
- Cost of living very low; budget EGP 15,000-25,000/month for comfortable life
- Islamic hospitality culture; accepting tea/coffee offers important for building relationships
- Nile cruises between Luxor and Aswan (2-3 days) among world''s great travel experiences' WHERE name = 'Egypt';

UPDATE countries SET local_tips = '- Dhivehi (Maldivian) official; English universally spoken in tourism sectors
- Work permit and residency through employer (resort) manages all documentation
- Healthcare: Malé has limited hospital (ADK Hospital); serious cases evacuated to Sri Lanka or India
- Heat year-round (29-31°C) but cooling ocean breeze; sun protection critical (UV intensity extreme)
- Alcohol only on resort islands; local islands strictly dry; check policies before booking non-resort stays
- Muslim culture on local islands; dress modestly when visiting non-resort communities
- Speedboat or seaplane transfers between Malé airport and resorts; book in advance
- Coral bleaching a growing concern; check reef health at specific atolls before diving trips' WHERE name = 'Maldives';

UPDATE countries SET local_tips = '- French official language; widely spoken; English in business and international community
- Residency requires application to Direction de la Sûreté Publique; significant documentation required
- Healthcare: CHPG hospital public; private clinics also excellent; French health system accessible for some residents
- Extremely high cost of living; housing among world''s most expensive; parking spaces cost more than flats elsewhere
- Walking everywhere practical; Monaco is tiny (2km²) and very walkable with excellent elevator/escalator infrastructure
- Casino etiquette: dress code applies; Monégasques cannot enter Casino de Monte-Carlo
- Grand Prix week (May) transforms the principality; book far ahead and expect massive crowds
- Excellent train access to Nice (25 min), Cannes (50 min), and Italian Riviera for daily escapes' WHERE name = 'Monaco';

UPDATE countries SET local_tips = '- Seychellois Creole (Kreol Seselwa), English, and French all official languages; English most practical
- Visitor Permit issued on arrival; register with Immigration for longer stays
- Healthcare: Victoria Hospital public; private clinics available; evacuation insurance recommended for serious conditions
- Heat year-round (27-30°C); sun protection essential — UV very intense at Indian Ocean latitude
- Car hire on Mahé and Praslin essential as taxis expensive; drive on left (British colonial legacy)
- Cost of living high for groceries and imported goods; local fruit and fish affordable
- Boat charters from Mahé to inner islands essential for island-hopping; book in advance
- Cyclone season January-April; monitor warnings though Seychelles relatively well-protected geographically' WHERE name = 'Seychelles';

-- Seed test security keys for provider signup validation
INSERT INTO provider_security_keys (key, description, active)
VALUES
  ('TEST001', 'Test security key 1', true),
  ('TEST002', 'Test security key 2', true),
  ('DEMO001', 'Demo security key', true)
ON CONFLICT (key) DO NOTHING;

