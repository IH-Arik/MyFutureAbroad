-- Add the 10 countries missing from all migrations
-- DE=Germany, EE=Estonia, ES=Spain, ID=Indonesia, IS=Iceland,
-- MA=Morocco, MX=Mexico, PL=Poland, PT=Portugal, TH=Thailand
-- Safe to run multiple times (ON CONFLICT DO NOTHING)

INSERT INTO countries (continent, name, iso_code, flag_url, highlight_img_url, description, longdescription)
VALUES

('Europe', 'Germany', 'DE',
 'https://flagcdn.com/de.svg',
 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
 'Europe''s largest economy combines industrial powerhouses like BMW, Siemens, and SAP with world-class cultural cities, medieval castles, and stunning landscapes. Germany offers excellent quality of life, a strong social safety net, and an open, skilled-worker immigration system.

## Key Highlights
- Europe''s largest economy with global leadership in engineering and manufacturing
- Strong job market with the EU Blue Card for skilled non-EU workers
- Excellent public services, healthcare, and free university education',
 'Germany is the European Union''s most populous nation and largest economy, occupying a central position on the continent and acting as the engine of European economic and political integration. Berlin, the capital, is a dynamic global city famed for its arts scene, startup ecosystem, and turbulent 20th-century history — from the Brandenburg Gate to remnants of the Berlin Wall. Munich in Bavaria combines world-class engineering companies with Alpine scenery, Oktoberfest, and one of Germany''s highest qualities of life. Hamburg is a major port and media hub, while Frankfurt serves as the country''s financial capital and home to the European Central Bank. Germany''s economy is deeply integrated globally, with particular strength in automotive (Volkswagen, BMW, Mercedes-Benz), engineering (Siemens, Bosch), chemicals (BASF), and a rapidly growing tech and startup sector. The country offers universal healthcare, excellent public education (universities are largely tuition-free, even for international students), and comprehensive social welfare. Germany has reformed its skilled-worker immigration under the Fachkräfteeinwanderungsgesetz (Skilled Workers Immigration Act), making it significantly more accessible for qualified non-EU nationals. The EU Blue Card provides an attractive pathway for high-skilled workers. German is the official language and learning it substantially improves integration and career prospects. Germany''s cultural richness spans Beethoven and Bach to modern art, and its holiday infrastructure of Christmas markets, regional festivals, and outdoor recreation is exceptional.'
),

('Europe', 'Estonia', 'EE',
 'https://flagcdn.com/ee.svg',
 'https://images.unsplash.com/photo-1599833975787-5c143f373c30?auto=format&fit=crop&w=800&q=80',
 'The world''s most digital country is a Baltic EU member that offers e-Residency for global entrepreneurs, a thriving tech ecosystem, and the medieval charm of Tallinn''s UNESCO-listed old town. Estonia punches far above its weight in innovation.

## Key Highlights
- World''s first digital state with e-Residency for global entrepreneurs
- Tallinn: beautifully preserved medieval old town and EU''s most vibrant startup hub per capita
- EU and Eurozone member with a flat 20% income tax',
 'Estonia is the northernmost of the three Baltic states, a small nation of 1.3 million people that has achieved extraordinary international recognition as the world''s most digitally advanced society. Tallinn, the capital, houses a UNESCO-listed medieval old town of remarkable preservation alongside a thriving technology and startup district. Estonia was among the first countries to offer internet voting, digital tax filing, and e-governance services, and pioneered the concept of e-Residency — allowing non-Estonians anywhere in the world to establish an EU-based digital identity and company. Skype was founded in Estonia, and the country has produced an extraordinary number of unicorn startups per capita including TransferWise (Wise), Pipedrive, and Bolt. The country joined the EU and NATO in 2004 and adopted the Euro in 2011, fully integrating into the Western political and economic community. Estonia''s flat 20% income tax (with a basic exemption) and business-friendly regulatory environment make it very attractive for entrepreneurs and remote workers. The cost of living is moderate by Western European standards, lower than Nordic neighbors. Estonian language is a Finno-Ugric language related to Finnish and challenging for English speakers, but English proficiency among younger Estonians and professionals is very high. Tallinn''s Old Town with its intact Gothic town hall, limestone towers, and medieval merchant houses is one of Northern Europe''s finest, and the surrounding Baltic coast and forests provide excellent outdoor recreation across all seasons.'
),

('Europe', 'Spain', 'ES',
 'https://flagcdn.com/es.svg',
 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?auto=format&fit=crop&w=800&q=80',
 'A sun-drenched Mediterranean paradise combining world-class cuisine, vibrant cities, and an exceptional quality of life. Spain''s Golden Visa, Digital Nomad Visa, and Non-Lucrative Visa make it one of Europe''s most accessible expat destinations with over 350 days of sunshine per year.

## Key Highlights
- Multiple residency pathways: Golden Visa, Digital Nomad Visa, Non-Lucrative Visa
- World-class cuisine, beaches, and nightlife at affordable European prices
- Excellent healthcare and high quality of life',
 'Spain is a southwestern European nation occupying most of the Iberian Peninsula, the EU''s fourth largest economy and one of the world''s most visited countries. Madrid, the capital, is a cosmopolitan city of world-class museums (Prado, Reina Sofía, Thyssen), vibrant nightlife, and exceptional cuisine. Barcelona, the Catalan capital, is one of Europe''s most beautiful and dynamic cities, blending Gaudí''s extraordinary architecture with Mediterranean beaches and a thriving design and tech scene. Spain''s diverse regions — Andalucía, the Basque Country, Valencia, Galicia — each offer distinct cultures, languages, and landscapes. The country enjoys over 300 days of sunshine annually in many regions, and the Mediterranean diet, tapas culture, and siesta lifestyle contribute to its legendary quality of life. Spain has developed an attractive suite of visa options for international residents: the Golden Visa (property investment from €500,000), the Digital Nomad Visa for remote workers earning income abroad, and the Non-Lucrative Visa for those with sufficient passive income. The Beckham Law offers reduced flat-rate income tax for qualifying foreign workers for the first six years. Spanish is one of the world''s most widely spoken languages, and learning it significantly enriches the experience. The cost of living is lower than France, Germany, or the UK, with excellent Mediterranean food at very reasonable prices. Spain''s healthcare system consistently ranks among the world''s best.'
),

('Asia', 'Indonesia', 'ID',
 'https://flagcdn.com/id.svg',
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
 'The world''s largest archipelago nation spans 17,000 islands with extraordinary cultural diversity and natural wonders from Bali''s temples to Komodo''s dragons. Indonesia''s Second Home Visa and growing digital nomad scene make it a top expat destination in Southeast Asia.

## Key Highlights
- Bali: the world''s most popular digital nomad destination with world-class surf and culture
- Second Home Visa for up to 10 years of long-term residence
- Extraordinary biodiversity: rainforests, volcanoes, coral reefs, and unique wildlife',
 'Indonesia is the world''s largest archipelago, comprising over 17,000 islands stretching 5,000 kilometers across the equator between Asia and Australia. With 270+ million people, it is the fourth most populous nation and the world''s largest Muslim-majority country, yet maintains a constitutionally secular state. Jakarta, the capital (being replaced by the new capital Nusantara in Borneo), is a massive megacity and Southeast Asia''s most dynamic economic hub. Bali is Indonesia''s most internationally famous island, a Hindu enclave celebrated for its rice terraces, temple ceremonies, world-class surf, and extraordinary spa culture — it consistently ranks as the world''s most popular destination for digital nomads. Indonesia introduced its Second Home Visa in 2022, allowing foreigners to stay for up to 10 years. The country is extraordinarily biodiverse, with Borneo''s ancient rainforests, Komodo dragons, orangutans, and some of the world''s finest coral reef diving at Raja Ampat and the Banda Sea. Bahasa Indonesia is the national language and remarkably easy to learn basics of; English is widely spoken in tourism and business. The cost of living is very affordable, with excellent local food available for a dollar or two. Indonesia''s rapidly growing economy, vast natural resources, and young population make it one of Asia''s most dynamic nations. Religious and cultural diversity across 300+ ethnic groups creates extraordinary richness.'
),

('Europe', 'Iceland', 'IS',
 'https://flagcdn.com/is.svg',
 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80',
 'The land of fire and ice offers Northern Lights, geysers, volcanic landscapes, and the world''s most geothermally powered society. Iceland consistently ranks as one of the world''s most peaceful, gender-equal, and happiest nations.

## Key Highlights
- Northern Lights, geysers, volcanic landscapes, and midnight sun
- World''s most gender-equal and peaceful country
- EEA member with accessible skilled worker immigration',
 'Iceland is a Nordic island nation in the North Atlantic, positioned astride the Mid-Atlantic Ridge where the Eurasian and North American tectonic plates meet, creating extraordinary volcanic and geothermal activity that powers nearly 100% of the country with renewable energy. Reykjavík, the capital and home to two-thirds of Iceland''s 370,000 population, is the world''s northernmost capital city of a sovereign state. Iceland consistently ranks at the top of global indices for peace (Global Peace Index #1 multiple years), gender equality (World Economic Forum Global Gender Gap), human development, and happiness. The country''s landscapes are unlike anywhere else: the Golden Circle featuring Þingvellir National Park (a UNESCO site where you can walk between tectonic plates), the Geysir hot spring area, and Gullfoss waterfall. The Northern Lights are visible from September to March, while the midnight sun in summer creates 24-hour daylight. Iceland is a member of the EEA and Schengen Area but not the EU, maintaining its own currency (Icelandic Króna). Skilled workers from EEA countries can work freely; non-EEA nationals need work permits. The Icelandic language is notoriously difficult but most Icelanders speak excellent English. The cost of living is very high by European standards. Iceland''s extraordinary natural phenomena, progressive society, and exceptional quality of life create a unique living experience that attracts a significant international community despite the remote location and expense.'
),

('Africa', 'Morocco', 'MA',
 'https://flagcdn.com/ma.svg',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80',
 'A North African kingdom bridging Europe and Africa, Morocco enchants with ancient medinas, Saharan landscapes, and Atlantic and Mediterranean coasts. Affordable living, a welcoming culture, and direct flights to Europe make it a top expat destination.

## Key Highlights
- Ancient UNESCO-listed medinas of Marrakech, Fez, and Chefchaouen
- Very affordable living with easy access to Europe
- Diverse landscapes: Sahara Desert, Atlas Mountains, Atlantic, and Mediterranean',
 'Morocco is a North African kingdom occupying the northwestern corner of the African continent, with both Atlantic and Mediterranean coastlines and a southern border that extends into the Sahara Desert. Rabat is the capital, while Marrakech, Casablanca, and Fez are larger cities with international profiles. Morocco''s imperial cities — Marrakech, Fez, Meknès, and Rabat — house extraordinary UNESCO-listed medinas where medieval Islamic architecture, souks, and traditional craft workshops have survived largely unchanged for centuries. Fez''s medieval medina is considered the world''s largest urban car-free zone. The Sahara Desert, accessible from the south, offers extraordinary dune landscapes and camel trekking. The High Atlas Mountains, including Mount Toubkal (the highest peak in North Africa), provide excellent trekking and skiing. Morocco has developed a significant expat community, particularly in Marrakech and the coastal cities, attracted by the warm climate, very affordable cost of living, and proximity to Europe (just 14km from Spain at the Strait of Gibraltar). Direct flights connect Morocco to most major European cities. Arabic and Amazigh (Berber) are official languages; French is widely used in business and government, and Spanish is spoken in the north. The cost of living is very low by European standards. Morocco''s blend of ancient culture, diverse landscapes, excellent cuisine (tagine, couscous), and easy European accessibility makes it one of Africa''s most popular expat destinations.'
),

('North America', 'Mexico', 'MX',
 'https://flagcdn.com/mx.svg',
 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
 'The world''s largest Spanish-speaking country combines ancient Aztec and Maya civilizations with vibrant modern cities, Caribbean and Pacific beaches, and some of the world''s finest cuisine. Mexico City is a world-class metropolis and increasingly popular with digital nomads.

## Key Highlights
- Mexico City: a world-class cultural capital with extraordinary food and nightlife
- Temporary Resident Visa accessible with modest income requirements
- Extraordinary beaches: Riviera Maya, Oaxaca coast, Baja California',
 'Mexico is the most populous Spanish-speaking country in the world and Latin America''s second largest economy, situated at the crossroads of North and Central America with both Pacific and Caribbean coastlines. Mexico City, one of the Western Hemisphere''s largest and most culturally rich metropolitan areas, offers world-class museums (including the National Museum of Anthropology), extraordinary culinary diversity, and a vibrant arts and nightlife scene that has made it increasingly popular with digital nomads and creative professionals. Mexico''s extraordinary pre-Columbian heritage — Teotihuacán, Chichén Itzá, Monte Albán, Palenque — ranks alongside the world''s greatest archaeological sites. The Riviera Maya along the Caribbean coast features world-class beach resorts and Tulum''s archaeological ruins above turquoise waters. Oaxaca, Guadalajara, and San Miguel de Allende have developed significant expat communities attracted by the climate, culture, and very affordable living. Mexico''s Temporary Resident Visa requires proof of monthly income (approximately $2,100 USD) or savings, making it accessible. The country uses the Mexican peso, and those earning in dollars or euros benefit from a very favorable exchange rate. Mexican cuisine is a UNESCO Intangible Cultural Heritage, featuring extraordinary regional diversity from Oaxacan mole to Yucatecan cochinita pibil. Safety varies significantly by region; expat-popular cities like Mexico City''s nicer neighborhoods, San Miguel de Allende, Oaxaca, and Puerto Vallarta are generally safe for residents.'
),

('Europe', 'Poland', 'PL',
 'https://flagcdn.com/pl.svg',
 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=800&q=80',
 'Central Europe''s largest economy combines beautifully preserved medieval cities, a rapidly growing tech sector, and EU membership at very affordable prices. Warsaw and Kraków are world-class cities increasingly attracting international talent and investment.

## Key Highlights
- EU member with one of Europe''s fastest growing economies
- Kraków''s stunning medieval old town and Warsaw''s remarkable resurrection
- Very affordable living with growing tech and startup ecosystem',
 'Poland is Central Europe''s largest country and most populous EU member outside of Germany and France, with 38 million people and an economy that has shown remarkable resilience and growth since EU accession in 2004. Warsaw, the capital, is a modern metropolis rebuilt from near-total wartime destruction and now home to a thriving financial and technology sector, impressive architecture mixing reconstructed historical buildings with contemporary skyscrapers, and a vibrant cultural and restaurant scene. Kraków, the former royal capital, preserves one of Europe''s finest medieval old towns — a UNESCO World Heritage site of extraordinary completeness centered on the vast Rynek Główny (Main Square). Poland has developed a significant technology sector, with Warsaw and Kraków hosting offices of major international tech companies alongside a growing startup ecosystem. The IT and business process outsourcing sectors are particularly strong. The cost of living is considerably lower than Western Europe, making it very attractive for digital nomads and remote workers earning in foreign currencies. Polish is the official language; English proficiency is growing rapidly among younger generations and professionals. The country joined the EU in 2004 and while it retains the Polish złoty, euro adoption discussions continue. Poland''s extraordinary historical depth — encompassing the medieval Jagiellonian period, Jewish heritage, and WWII monuments — alongside natural diversity from Tatra Mountains to Baltic beaches makes it one of Central Europe''s most rewarding destinations.'
),

('Europe', 'Portugal', 'PT',
 'https://flagcdn.com/pt.svg',
 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
 'Europe''s westernmost nation captivates with Lisbon''s fado music and pastel de nata, the Algarve''s golden beaches, and Porto''s wine cellars. Portugal''s NHR/IFICI tax regime, Golden Visa, and Digital Nomad Visa make it Europe''s most popular expat destination.

## Key Highlights
- NHR/IFICI tax regime offering significant tax advantages for new residents
- Multiple residency pathways: Golden Visa, Digital Nomad Visa, D7 Passive Income Visa
- Lisbon and Porto: world-class cities at affordable European prices',
 'Portugal is a Western European nation occupying the southwestern corner of the Iberian Peninsula, with a 1,794 km Atlantic coastline and the Azores and Madeira island territories in the Atlantic Ocean. Lisbon, the hilly capital, is one of Europe''s oldest and most atmospheric cities, with Moorish castle, colorful tiled facades, fado music emanating from ancient Alfama alleys, and world-class restaurants serving bacalhau (salt cod) and pastéis de nata (custard tarts). Porto, the northern city, combines the historic Ribeira waterfront district with the Douro Valley''s wine country producing world-famous Port wine. The Algarve in the south offers some of Europe''s finest beaches, dramatic golden limestone cliffs, and excellent golf. Portugal has positioned itself as Europe''s premier expat destination through an exceptional package of tax incentives and visa options. The NHR (Non-Habitual Resident) regime, now replaced by IFICI, offers significant tax advantages for qualifying new residents on foreign-sourced income. The D7 Passive Income Visa, Golden Visa, Digital Nomad Visa, and the newer Tech Visa provide multiple pathways to residency. Portuguese is the official language and shares significant vocabulary with Spanish, making it moderately accessible for Romance language speakers. The cost of living, while rising in Lisbon and Porto, remains lower than Northern and Western European countries. Portugal''s warm Atlantic climate, exceptional food and wine culture, low crime rate, and welcoming people create an outstanding quality of life.'
),

('Asia', 'Thailand', 'TH',
 'https://flagcdn.com/th.svg',
 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
 'The "Land of Smiles" combines ancient Buddhist temples, tropical islands, world-class street food, and exceptional affordability. Thailand''s Long-Term Resident Visa, retirement visa, and Thailand Elite program make it Southeast Asia''s most popular expat destination.

## Key Highlights
- Long-Term Resident (LTR) Visa and Thailand Elite for 10-20 year residency
- World-renowned cuisine, islands, and temples at very affordable prices
- Bangkok: a dynamic global city with world-class infrastructure',
 'Thailand is a Southeast Asian kingdom of extraordinary diversity — from the ruined temples of ancient Sukhothai and Chiang Mai''s mountain culture to Bangkok''s ultramodern skyline, the limestone karst islands of Krabi and Ko Phi Phi, and the beaches of Ko Samui and Phuket. Bangkok, the capital, is one of Asia''s most dynamic and visited cities, renowned for its ornate temples (Wat Pho, Wat Arun), world-class street food, legendary nightlife, excellent infrastructure, and extraordinary pace of development. Thailand is the world''s most visited country in Southeast Asia and has developed a sophisticated expat infrastructure across decades of international tourism. The country offers multiple long-term residency pathways: the Long-Term Resident (LTR) Visa for skilled professionals, wealthy global citizens, and retirees earning above threshold incomes; the Thailand Retirement Visa for those over 50; and the Thailand Elite membership program offering stays of 5-20 years with extensive privileges. The cost of living is very affordable by international standards — excellent food is available for $1-3, and comfortable accommodation and quality healthcare cost a fraction of Western prices. Thai language is tonal and requires significant study, but English is widely spoken in Bangkok and tourist areas. Buddhism shapes daily life and cultural practices in profound ways. Thailand''s extraordinary culinary tradition — tom yum, pad thai, green curry, mango sticky rice — ranks among the world''s finest. The country''s combination of affordability, infrastructure, climate, and culture makes it consistently the most popular expat destination in Southeast Asia.'
)

ON CONFLICT (name) DO NOTHING;
