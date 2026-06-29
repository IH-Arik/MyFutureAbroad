-- Add missing countries to reach the full 109-country list
-- Run in Supabase Dashboard → SQL Editor
-- Safe to run multiple times (ON CONFLICT DO NOTHING)

INSERT INTO countries (continent, name, iso_code, flag_url, highlight_img_url, description)
VALUES

-- ===== EUROPE =====
('Europe', 'Austria', 'AT', 'https://flagcdn.com/at.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'A Central European gem of imperial grandeur, Austria enchants with Vienna''s world-class music, museums, and coffee house culture alongside the Alps. EU membership, excellent infrastructure, and high quality of life make it a premier European destination.

## Key Highlights
- Vienna: imperial palaces, world-class opera, and legendary coffee house culture
- Stunning Alpine landscapes with world-class skiing
- High quality of life with excellent healthcare and education'),

('Europe', 'Belgium', 'BE', 'https://flagcdn.com/be.svg',
 'https://images.unsplash.com/photo-1559060017-445fb9722b5b?auto=format&fit=crop&w=800&q=80',
 'The heart of Europe and home to EU institutions, Belgium surprises with world-class chocolate, beer, and medieval cities. Brussels, Bruges, and Ghent offer extraordinary cultural depth alongside convenient access to all of Western Europe.

## Key Highlights
- Home to EU headquarters and NATO making it a truly international hub
- World-renowned chocolate, waffles, and extraordinary beer culture
- Beautiful medieval cities including Bruges and Ghent'),

('Europe', 'Cyprus', 'CY', 'https://flagcdn.com/cy.svg',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
 'The easternmost EU island combines year-round sunshine, beautiful beaches, and ancient history. Cyprus offers attractive tax incentives, a non-domicile regime for high-net-worth individuals, and a relaxed Mediterranean lifestyle.

## Key Highlights
- EU member with one of Europe''s most attractive non-dom tax regimes
- Year-round Mediterranean sunshine with beautiful beaches
- Rich history with ancient ruins, Crusader castles, and Byzantine churches'),

('Europe', 'Denmark', 'DK', 'https://flagcdn.com/dk.svg',
 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80',
 'Consistently ranked the world''s happiest country, Denmark pioneered hygge — the art of cozy living. Copenhagen is a world-class capital of design, cycling culture, and New Nordic cuisine with excellent quality of life.

## Key Highlights
- Consistently ranked world''s happiest country with strong work-life balance
- Copenhagen: world leader in design, sustainability, and gastronomy
- Excellent welfare state with free education and universal healthcare'),

('Europe', 'Finland', 'FI', 'https://flagcdn.com/fi.svg',
 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&q=80',
 'The land of a thousand lakes, Northern Lights, and the world''s best education system. Finland combines deep nature immersion with a thriving technology sector and one of the world''s most innovative economies.

## Key Highlights
- World''s best education system and consistently top happiness rankings
- Extraordinary nature: Northern Lights, midnight sun, and pristine forests
- Thriving tech scene including Nokia, Rovio, and a strong startup ecosystem'),

('Europe', 'France', 'FR', 'https://flagcdn.com/fr.svg',
 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
 'The world''s most visited country captivates with the Eiffel Tower, world-class cuisine, and extraordinary cultural heritage. France''s diverse regions offer Mediterranean beaches, Alpine skiing, Atlantic wine country, and unmatched joie de vivre.

## Key Highlights
- World''s most visited country with iconic Paris and extraordinary cultural depth
- World-leading cuisine, wine regions, and gastronomic heritage (UNESCO listed)
- Excellent healthcare, education, and quality of life'),

('Europe', 'Greece', 'GR', 'https://flagcdn.com/gr.svg',
 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
 'The cradle of Western civilization combines ancient ruins, whitewashed island villages, and Mediterranean cuisine. Greece''s Golden Visa program and sunny lifestyle attract retirees and investors from across the globe.

## Key Highlights
- Birthplace of democracy with extraordinary ancient ruins including the Acropolis
- Stunning island archipelagos: Santorini, Mykonos, Crete, and hundreds more
- Golden Visa program offering residency through property investment'),

('Europe', 'Ireland', 'IE', 'https://flagcdn.com/ie.svg',
 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=800&q=80',
 'The Emerald Isle combines vibrant pub culture, wild Atlantic landscapes, and a booming technology economy. Dublin hosts European headquarters for Google, Facebook, and Apple, making it a major tech hub with English-speaking EU access.

## Key Highlights
- English-speaking EU member and European headquarters for major US tech companies
- Vibrant pub culture, live music, and warm Irish hospitality
- Stunning landscapes from the Cliffs of Moher to the Wild Atlantic Way'),

('Europe', 'Italy', 'IT', 'https://flagcdn.com/it.svg',
 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
 'A living museum of art, architecture, and cuisine, Italy captivates with Rome, Florence, Venice, and the Amalfi Coast. Italy offers flat-tax regimes for foreign income, special visa programs for digital nomads and retirees, and an incomparable lifestyle.

## Key Highlights
- World''s largest collection of UNESCO World Heritage sites
- World-renowned cuisine, wine, and "la dolce vita" lifestyle
- Attractive flat-tax and digital nomad visa programs'),

('Europe', 'Malta', 'MT', 'https://flagcdn.com/mt.svg',
 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=800&q=80',
 'A tiny Mediterranean archipelago with a mighty history and attractive residency programs. Malta offers English as an official language, EU membership, a non-domicile tax regime, and year-round sunshine.

## Key Highlights
- English-speaking EU island with attractive non-dom tax regime
- Extraordinary history: Megalithic temples older than Stonehenge
- Year-round Mediterranean sunshine with crystal-clear diving waters'),

('Europe', 'Montenegro', 'ME', 'https://flagcdn.com/me.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'A dramatic Adriatic country of fjords, medieval walled towns, and rapidly developing infrastructure. Montenegro combines European ambitions (EU candidate) with very affordable living and stunning natural beauty.

## Key Highlights
- Stunning Kotor Bay: one of Europe''s most beautiful fjords
- Very affordable living with EU candidate status
- Dramatic combination of Adriatic coastline and Dinaric Alps'),

('Europe', 'Netherlands', 'NL', 'https://flagcdn.com/nl.svg',
 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80',
 'A progressive society of windmills, tulips, and world-class museums. The Netherlands offers one of Europe''s most international business environments, excellent English proficiency, and the 30% tax ruling for skilled international workers.

## Key Highlights
- Highest English proficiency in continental Europe
- 30% ruling tax advantage for skilled expat workers
- Amsterdam: world-class museums, cycling culture, and liberal society'),

('Europe', 'North Macedonia', 'MK', 'https://flagcdn.com/mk.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'A small Balkan nation of ancient history and affordable living. North Macedonia offers very low living costs, a flat 10% income tax, and EU candidate status with Ohrid Lake among Europe''s most beautiful destinations.

## Key Highlights
- UNESCO-listed Lake Ohrid: one of Europe''s oldest and deepest lakes
- Very affordable living with flat 10% income tax
- EU candidate status with growing infrastructure'),

('Europe', 'Norway', 'NO', 'https://flagcdn.com/no.svg',
 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
 'A breathtaking Nordic nation of dramatic fjords, Northern Lights, and extraordinary natural wealth. Norway consistently ranks among the world''s best countries for quality of life, offering excellent wages and work-life balance.

## Key Highlights
- Stunning fjords, Northern Lights, and midnight sun natural wonders
- Among the world''s highest salaries and strongest social safety nets
- Exceptional outdoor lifestyle year-round'),

('Europe', 'Serbia', 'RS', 'https://flagcdn.com/rs.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'An emerging Balkan destination with a thriving Belgrade nightlife scene, affordable living, and growing tech sector. Serbia offers visa-free access to 90+ countries and an increasingly entrepreneurial environment.

## Key Highlights
- Belgrade: one of Europe''s most vibrant and affordable nightlife capitals
- Very affordable living with a growing tech and startup ecosystem
- EU candidate status with excellent location in Central Europe'),

('Europe', 'Sweden', 'SE', 'https://flagcdn.com/se.svg',
 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80',
 'A Scandinavian leader in innovation, design, and quality of life. Sweden is home to Spotify, IKEA, and Volvo, and offers an exceptional welfare state, gender equality, and extraordinary access to nature.

## Key Highlights
- Home to Spotify, IKEA, H&M, and a world-class startup ecosystem
- Exceptional welfare state with generous parental leave and free education
- Stunning archipelagos, forests, and Northern Lights access'),

('Europe', 'Switzerland', 'CH', 'https://flagcdn.com/ch.svg',
 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
 'The world''s most stable and prosperous country, Switzerland offers extraordinary quality of life, political neutrality, and exceptional banking. Geneva and Zurich are global hubs for finance, diplomacy, and international organizations.

## Key Highlights
- World''s highest standard of living with exceptional quality and precision
- Global financial center and home to major international organizations
- Spectacular Alpine scenery with world-class skiing and outdoor activities'),

('Europe', 'Turkey', 'TR', 'https://flagcdn.com/tr.svg',
 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
 'A transcontinental country bridging Europe and Asia, Turkey captivates with Istanbul''s extraordinary history, Cappadocia''s fairy chimneys, and beautiful Mediterranean and Aegean coasts. Very affordable living with a vibrant culture.

## Key Highlights
- Istanbul: the only city spanning two continents with extraordinary history
- Cappadocia''s unique lunar landscapes and hot air balloon flights
- Very affordable living with rich cuisine and warm hospitality'),

('Europe', 'United Kingdom', 'GB', 'https://flagcdn.com/gb.svg',
 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
 'A global cultural powerhouse with one of the world''s most diverse and dynamic economies. The UK offers world-class universities, a major financial center in London, and extraordinary cultural heritage from the Beatles to Shakespeare.

## Key Highlights
- World-class universities including Oxford, Cambridge, and Imperial College
- London: global financial capital and one of the world''s most diverse cities
- Rich cultural heritage, vibrant arts scene, and exceptional sporting culture'),

-- ===== ASIA =====
('Asia', 'Bahrain', 'BH', 'https://flagcdn.com/bh.svg',
 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
 'A progressive Gulf island nation offering zero income tax, a thriving financial sector, and one of the Middle East''s most liberal social environments. Bahrain''s small size and welcoming attitude make it ideal for expats.

## Key Highlights
- Zero personal income tax with liberal social environment for the Gulf
- Major financial services hub with Formula 1 Grand Prix
- Gateway to Saudi Arabia with significantly more relaxed lifestyle'),

('Asia', 'Bangladesh', 'BD', 'https://flagcdn.com/bd.svg',
 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&w=800&q=80',
 'A South Asian nation of extraordinary density and resilience, Bangladesh has achieved remarkable economic growth driven by garment exports. Dhaka is a chaotic but vibrant megacity with a very affordable cost of living.

## Key Highlights
- Very affordable living in a rapidly developing economy
- Rich cultural heritage from ancient Mughal architecture to Bengal literature
- Home to the Sundarbans, the world''s largest mangrove forest'),

('Asia', 'Cambodia', 'KH', 'https://flagcdn.com/kh.svg',
 'https://images.unsplash.com/photo-1516368260636-bec0f2af0e44?auto=format&fit=crop&w=800&q=80',
 'Home to Angkor Wat — one of humanity''s greatest architectural achievements — Cambodia offers extremely affordable living and a welcoming expat community. Siem Reap, Phnom Penh, and the coast attract digital nomads and retirees.

## Key Highlights
- Angkor Wat: world''s largest religious monument complex
- Very affordable living popular with digital nomads and retirees
- Warm climate and welcoming people with US dollar economy'),

('Asia', 'Jordan', 'JO', 'https://flagcdn.com/jo.svg',
 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?auto=format&fit=crop&w=800&q=80',
 'A stable Middle Eastern oasis combining the ancient city of Petra, the Dead Sea, and Wadi Rum''s desert landscapes. Jordan is one of the safest countries in the region with a welcoming culture and rich history.

## Key Highlights
- Petra: the rose-red city carved into rock and one of the New Seven Wonders
- Dead Sea: lowest point on Earth with extraordinary mineral-rich waters
- One of the Middle East''s most stable and welcoming countries'),

('Asia', 'Kazakhstan', 'KZ', 'https://flagcdn.com/kz.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'Central Asia''s largest and most prosperous nation, Kazakhstan blends the ultramodern capital Astana with vast steppes and ancient Silk Road heritage. Growing oil wealth has created significant infrastructure investment.

## Key Highlights
- Astana: futuristic new capital with extraordinary modern architecture
- Vast natural landscapes from steppes to the Tian Shan mountains
- Growing economy driven by oil wealth and diversification'),

('Asia', 'Kuwait', 'KW', 'https://flagcdn.com/kw.svg',
 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
 'One of the Gulf''s wealthiest nations with zero income tax and significant oil revenues. Kuwait City is a modern metropolis offering generous expat packages particularly in energy, healthcare, and education sectors.

## Key Highlights
- Zero personal income tax with high salaries particularly in energy sector
- One of the world''s highest GDP per capita from oil revenues
- Modern infrastructure with easy access to the wider Gulf region'),

('Asia', 'Kyrgyzstan', 'KG', 'https://flagcdn.com/kg.svg',
 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80',
 'A Central Asian gem of dramatic Tian Shan mountains, pristine alpine lakes, and authentic nomadic culture. Kyrgyzstan offers visa-free access for many nationalities and extremely affordable living.

## Key Highlights
- Dramatic Tian Shan mountains with pristine alpine lakes and glaciers
- Authentic nomadic culture with yurt stays on the steppe
- Very affordable living and welcoming visa-free policy for many nationalities'),

('Asia', 'Laos', 'LA', 'https://flagcdn.com/la.svg',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
 'The laid-back "Land of a Million Elephants" offers Buddhist temples, the Mekong River, and an unhurried pace of life. Luang Prabang and Vang Vieng attract those seeking Southeast Asia at a slower pace.

## Key Highlights
- Luang Prabang: UNESCO-listed town with French colonial architecture and Buddhist temples
- Mekong River lifestyle with excellent outdoor adventures
- Very affordable and peaceful with authentic Southeast Asian culture'),

('Asia', 'Nepal', 'NP', 'https://flagcdn.com/np.svg',
 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
 'Home to eight of the world''s ten highest mountains including Everest, Nepal offers some of the planet''s most spectacular trekking. Kathmandu''s ancient temples and spiritual atmosphere attract pilgrims, trekkers, and adventure seekers.

## Key Highlights
- Mount Everest and eight of the world''s ten highest peaks
- World-class trekking in the Himalayas including the Annapurna Circuit
- Ancient Hindu and Buddhist cultural heritage in the Kathmandu Valley'),

('Asia', 'Oman', 'OM', 'https://flagcdn.com/om.svg',
 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
 'The Gulf''s hidden gem combines dramatic desert landscapes, ancient forts, and a genuinely welcoming culture. Oman''s zero income tax, safe environment, and Muscat''s growing expat community make it increasingly popular.

## Key Highlights
- Zero personal income tax in one of the Gulf''s safest countries
- Dramatic landscapes: fjords, deserts, and pristine beaches
- Warm, traditional Omani hospitality without Saudi Arabia''s social restrictions'),

('Asia', 'Philippines', 'PH', 'https://flagcdn.com/ph.svg',
 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
 'A Southeast Asian archipelago of 7,600+ islands with extraordinary beaches, world-class diving, and a large English-speaking population. The Philippines'' SRRV and retirement visa make it one of Asia''s most accessible destinations for long-term stays.

## Key Highlights
- 7,600+ islands with world-class beaches and diving in the Coral Triangle
- Large English-speaking population making integration easy
- SRRV Retirement Visa providing accessible long-term residency options'),

('Asia', 'Sri Lanka', 'LK', 'https://flagcdn.com/lk.svg',
 'https://images.unsplash.com/photo-1586167932750-4a23c21ec3e2?auto=format&fit=crop&w=800&q=80',
 'The "Pearl of the Indian Ocean" packs extraordinary diversity into a small island: ancient ruins, tea plantations, wildlife, and pristine beaches. Affordable living and a welcoming culture make it a growing expat destination.

## Key Highlights
- Ancient ruins of Sigiriya, Polonnaruwa, and Anuradhapura
- World-renowned tea country with stunning central highlands
- Excellent affordability with incredible wildlife including wild elephants'),

('Asia', 'Taiwan', 'TW', 'https://flagcdn.com/tw.svg',
 'https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=800&q=80',
 'A dynamic island democracy leading the world in semiconductor manufacturing and known for extraordinary food culture, hiking, and efficient modern infrastructure. Taiwan offers excellent healthcare and a welcoming attitude toward international residents.

## Key Highlights
- World leader in semiconductor technology with a thriving tech sector
- Extraordinary food culture with world-class night markets
- Excellent healthcare, infrastructure, and safety with beautiful mountainous landscapes'),

('Asia', 'Uzbekistan', 'UZ', 'https://flagcdn.com/uz.svg',
 'https://images.unsplash.com/photo-1554723006-52d79a6ad1fb?auto=format&fit=crop&w=800&q=80',
 'Ancient Silk Road cities of Samarkand, Bukhara, and Khiva rank among Central Asia''s greatest treasures. Uzbekistan has reformed significantly since 2016, opening to tourism and investment with stunning Islamic architecture.

## Key Highlights
- Samarkand, Bukhara, and Khiva: ancient Silk Road cities of extraordinary beauty
- Significant economic reforms opening the country to foreign investment
- Very affordable living in a rapidly modernizing country'),

-- ===== AMERICAS =====
('North America', 'Barbados', 'BB', 'https://flagcdn.com/bb.svg',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
 'A sophisticated Caribbean island nation combining world-class beaches, vibrant Bajan culture, and the Welcome Stamp digital nomad visa. Barbados offers English language, political stability, and a laid-back island lifestyle.

## Key Highlights
- Welcome Stamp program: one of the Caribbean''s first digital nomad visas
- English-speaking British Commonwealth nation with political stability
- World-class beaches, cricket culture, and rum distilleries'),

('South America', 'Chile', 'CL', 'https://flagcdn.com/cl.svg',
 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80',
 'South America''s most economically stable and developed nation stretches 4,300 km from the Atacama Desert to Patagonia. Santiago is a world-class capital with strong business infrastructure and a high quality of life.

## Key Highlights
- South America''s most stable economy with OECD membership
- Extraordinary geographic diversity: Atacama Desert, Andes, Patagonia, Easter Island
- Santiago: modern capital with excellent infrastructure and growing startup scene'),

('South America', 'Colombia', 'CO', 'https://flagcdn.com/co.svg',
 'https://images.unsplash.com/photo-1527527082842-0c3c3e6bec5d?auto=format&fit=crop&w=800&q=80',
 'A transformed South American nation offering year-round spring weather in Medellín, Caribbean beaches, Amazon rainforest, and coffee country. Colombia''s digital nomad visa and affordable living attract a growing international community.

## Key Highlights
- Medellín: "City of Eternal Spring" and transformed urban success story
- Digital nomad visa available for remote workers
- Extraordinary biodiversity with Caribbean, Pacific, Andes, and Amazon regions'),

('North America', 'Costa Rica', 'CR', 'https://flagcdn.com/cr.svg',
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
 'A Central American paradise of rainforests, volcanoes, and Pacific and Caribbean beaches. Costa Rica''s "Pura Vida" ethos, stable democracy, and pensionado visa make it one of Latin America''s most popular expat destinations.

## Key Highlights
- Pura Vida lifestyle in one of Latin America''s most stable democracies
- Extraordinary biodiversity: 5% of the world''s species in 0.03% of its land
- Pensionado and Rentista retirement visas with attractive benefits'),

('North America', 'Dominican Republic', 'DO', 'https://flagcdn.com/do.svg',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
 'The Caribbean''s most visited destination offers world-class resort beaches, affordable living, and territorial taxation. Punta Cana and Santo Domingo attract both tourists and expats seeking Caribbean lifestyle at reasonable cost.

## Key Highlights
- World-class resort beaches at Punta Cana and the Samaná Peninsula
- Territorial tax system and accessible residency programs
- Affordable Caribbean lifestyle with a large expat community'),

('South America', 'Ecuador', 'EC', 'https://flagcdn.com/ec.svg',
 'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=800&q=80',
 'A dollarized South American nation with extraordinary geographic diversity — the Galápagos Islands, Amazon rainforest, Andean highlands, and Pacific coast all in one compact country. Quito and Cuenca are popular expat cities.

## Key Highlights
- Galápagos Islands: one of the world''s greatest natural wonders
- Very affordable USD economy popular with retirees
- Year-round spring climate in Quito with extraordinary biodiversity'),

('South America', 'Guyana', 'GY', 'https://flagcdn.com/gy.svg',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
 'The Caribbean''s only English-speaking country on the South American mainland, Guyana is experiencing an oil boom transforming the economy. The interior holds Kaieteur Falls and pristine Amazon rainforest largely unexplored.

## Key Highlights
- Fastest growing economy in the Western Hemisphere due to oil discoveries
- Kaieteur Falls: one of the world''s most powerful waterfalls
- English-speaking Caribbean culture on the South American mainland'),

('North America', 'Honduras', 'HN', 'https://flagcdn.com/hn.svg',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
 'A Central American nation with the Bay Islands'' world-class diving, ancient Mayan ruins at Copán, and very affordable living costs. Honduras offers accessible residency programs and budget-friendly Caribbean beaches.

## Key Highlights
- Bay Islands: Roatán and Utila among the world''s most affordable dive destinations
- Ancient Mayan ruins at Copán Ruinas
- Very affordable living with accessible residency programs'),

('North America', 'Jamaica', 'JM', 'https://flagcdn.com/jm.svg',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
 'The birthplace of reggae and Rastafarian culture, Jamaica is the Caribbean''s most globally recognized island. Bob Marley, Blue Mountains coffee, and vibrant beach culture define this English-speaking island nation.

## Key Highlights
- Birthplace of reggae, Bob Marley, and Rastafarian culture
- English-speaking with blue mountain coffee and world-class beaches
- Welcoming LGBTQ-friendly residency options and growing remote worker community'),

('North America', 'Panama', 'PA', 'https://flagcdn.com/pa.svg',
 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
 'A Central American hub connecting the Pacific and Atlantic, Panama City is a surprising metropolis with a world-class financial center, territorial tax system, and the renowned Pensionado retirement visa offering exceptional discounts.

## Key Highlights
- Territorial tax system with excellent banking and financial services
- Pensionado retirement visa with extraordinary discounts on goods and services
- Panama City: the only city in the world with a rainforest within city limits'),

('South America', 'Paraguay', 'PY', 'https://flagcdn.com/py.svg',
 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
 'South America''s most overlooked country offers some of the continent''s most attractive tax conditions: a 10% flat tax on Paraguay-sourced income only, very affordable living, and accessible permanent residency.

## Key Highlights
- Territorial tax system: 10% flat rate on Paraguay-sourced income only
- Very affordable cost of living with accessible permanent residency
- Asunción: affordable, safe, and increasingly cosmopolitan capital'),

('South America', 'Peru', 'PE', 'https://flagcdn.com/pe.svg',
 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
 'The heart of the Inca Empire, Peru captivates with Machu Picchu, the Amazon, and Lima''s world-class cuisine scene. Peru''s diverse geography, rich culture, and very affordable living attract a growing expat community.

## Key Highlights
- Machu Picchu: the iconic Inca citadel and one of the New Seven Wonders
- Lima: South America''s gastronomic capital with world-class restaurants
- Extraordinary biodiversity from Andes to Amazon to Pacific coast'),

('South America', 'Uruguay', 'UY', 'https://flagcdn.com/uy.svg',
 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
 'South America''s most progressive nation offers political stability, accessible residency, and a high quality of life. Montevideo consistently ranks as South America''s most livable city, with an attractive tax system for new residents.

## Key Highlights
- South America''s most stable democracy with excellent quality of life
- Tax exoneration on foreign income for first 5 years of residency
- Montevideo: consistently ranked South America''s most livable city'),

('South America', 'Venezuela', 'VE', 'https://flagcdn.com/ve.svg',
 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
 'Despite significant political and economic challenges, Venezuela harbors extraordinary natural beauty including Angel Falls (world''s highest waterfall), the Orinoco Delta, and Caribbean islands. For adventurous travelers, opportunities exist.

## Key Highlights
- Angel Falls: world''s highest uninterrupted waterfall in Gran Sabana
- Extraordinary Caribbean coastline and Los Roques archipelago
- Rich natural resources and significant cultural heritage'),

-- ===== AFRICA =====
('Africa', 'Ghana', 'GH', 'https://flagcdn.com/gh.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'West Africa''s most stable democracy and economic hub, Ghana offers excellent English proficiency, a welcoming diaspora policy, and a rapidly growing tech ecosystem in Accra. The "Year of Return" program has strengthened diaspora ties.

## Key Highlights
- West Africa''s most stable democracy with strong GDP growth
- Accra: growing tech hub and increasingly cosmopolitan capital
- Ghana Beyond Aid policy and welcoming diaspora programs'),

('Africa', 'Kenya', 'KE', 'https://flagcdn.com/ke.svg',
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
 'East Africa''s economic powerhouse combines world-class safari in the Masai Mara, pristine Indian Ocean beaches, and Nairobi''s growing tech scene. Kenya''s Hustle Visa and welcoming policy toward talent attract digital nomads.

## Key Highlights
- Masai Mara: arguably Africa''s greatest wildlife destination
- Nairobi: East Africa''s tech and innovation hub ("Silicon Savannah")
- Pristine Indian Ocean coast at Mombasa and Lamu'),

('Africa', 'Madagascar', 'MG', 'https://flagcdn.com/mg.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'The world''s fourth largest island holds extraordinary biodiversity found nowhere else on Earth — 90% of its wildlife is endemic. Madagascar offers unique natural experiences for adventurous visitors and researchers.

## Key Highlights
- 90% of wildlife found nowhere else on Earth including ring-tailed lemurs
- Extraordinary baobab avenues and diverse landscapes
- Very affordable living in one of the world''s most unique ecosystems'),

('Africa', 'Mauritius', 'MU', 'https://flagcdn.com/mu.svg',
 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=800&q=80',
 'A stable Indian Ocean island nation combining luxury beach resorts, strong financial services, and an attractive Premium Visa for remote workers and retirees. Mauritius offers political stability and a multicultural society.

## Key Highlights
- Premium Visa and Occupation Permit for remote workers and investors
- Political stability and strong financial services sector
- Beautiful beaches, multicultural society, and year-round warm climate'),

('Africa', 'Mozambique', 'MZ', 'https://flagcdn.com/mz.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'A southern African nation with stunning Indian Ocean coastline, Bazaruto Archipelago, and Quirimbas Islands offering some of Africa''s finest diving. Portuguese-speaking with a growing economy.

## Key Highlights
- Bazaruto Archipelago and Quirimbas Islands: world-class diving destinations
- Portuguese-speaking African nation with diverse cultural heritage
- Very affordable living and pristine Indian Ocean beaches'),

('Africa', 'Namibia', 'NA', 'https://flagcdn.com/na.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'A vast, sparsely populated southern African nation of extraordinary desert landscapes — Sossusvlei''s red dunes, the Skeleton Coast, and Etosha''s wildlife. Namibia offers political stability, English as an official language, and spectacular nature.

## Key Highlights
- Sossusvlei: towering red sand dunes among the world''s most dramatic landscapes
- Etosha National Park with abundant wildlife viewing
- English-speaking with political stability and very low population density'),

('Africa', 'Nigeria', 'NG', 'https://flagcdn.com/ng.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'Africa''s largest economy and most populous nation is a continental powerhouse with extraordinary cultural output — Nollywood, Afrobeats, and a massive entrepreneurial diaspora. Lagos is increasingly a significant tech hub.

## Key Highlights
- Africa''s largest economy with significant Nollywood and Afrobeats cultural influence
- Lagos: one of Africa''s fastest growing tech and startup ecosystems
- Extraordinary cultural diversity with 250+ ethnic groups and languages'),

('Africa', 'Rwanda', 'RW', 'https://flagcdn.com/rw.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'Africa''s most impressive governance success story, Rwanda has transformed remarkably since the 1994 genocide. Kigali is Africa''s cleanest city, the country has excellent infrastructure, and gorilla trekking in Volcanoes National Park is world-class.

## Key Highlights
- Africa''s cleanest and best-governed city in Kigali
- Mountain gorilla trekking in Volcanoes National Park
- Extraordinary transformation and good governance model for Africa'),

('Africa', 'Senegal', 'SN', 'https://flagcdn.com/sn.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'West Africa''s most stable democracy and gateway to the region, Senegal offers the cosmopolitan capital Dakar, beautiful beaches, and a vibrant music and arts scene. French-speaking with excellent West African cuisine.

## Key Highlights
- Dakar: West Africa''s most cosmopolitan city with excellent food and music scene
- Political stability making it West Africa''s safest major country
- Beautiful beaches and islands including Casamance and Sine-Saloum Delta'),

('Africa', 'Tunisia', 'TN', 'https://flagcdn.com/tn.svg',
 'https://images.unsplash.com/photo-1555990538-c0b0e91f4c8e?auto=format&fit=crop&w=800&q=80',
 'A North African nation bridging Europe and Africa, Tunisia combines ancient Carthage and Medina cities with Mediterranean beaches and Saharan landscapes. One of Africa''s most educated populations and affordable living attract expats.

## Key Highlights
- Ancient Carthage ruins and UNESCO-listed Medina of Tunis
- Mediterranean beaches alongside Saharan desert landscapes
- Very affordable living with a highly educated population'),

('Africa', 'Uganda', 'UG', 'https://flagcdn.com/ug.svg',
 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
 'The Pearl of Africa offers gorilla trekking in Bwindi Impenetrable Forest, source of the Nile at Jinja, and Lake Victoria. Uganda''s affordable costs, English language, and extraordinary wildlife make it compelling.

## Key Highlights
- Mountain gorilla trekking in Bwindi Impenetrable Forest
- Source of the Nile at Jinja with excellent white-water rafting
- English-speaking with very affordable cost of living'),

-- ===== OCEANIA =====
('Oceania', 'Fiji', 'FJ', 'https://flagcdn.com/fj.svg',
 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80',
 'A South Pacific archipelago of 300+ islands renowned for pristine coral reefs, crystal-clear lagoons, and genuine Fijian hospitality. Fiji''s Bula spirit, accessible residency programs, and natural beauty attract retirees and investors.

## Key Highlights
- 300+ islands with pristine coral reefs and world-class diving
- Genuine Fijian "Bula" hospitality and relaxed Pacific lifestyle
- Accessible retirement and investment residency programs')

ON CONFLICT (name) DO NOTHING;
