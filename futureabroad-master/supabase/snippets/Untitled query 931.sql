
-- Seed tax_advice for all 28 countries

UPDATE countries SET tax_advice = $$- Malta has a favorable tax treaty network with 70+ countries
- Corporate tax rate is 35%, but can be reduced with tax credits
- Individuals receive a personal allowance of €8,500 annually
- VAT rate is 18% (reduced rates of 5% and 0% apply to certain goods/services)
- Non-resident individuals only taxed on Malta-sourced income
- Capital gains are generally not taxable in Malta
- Dividend withholding tax is 6/7 (effectively 0% for domestic dividends)
- Foreign tax credits available for taxes paid abroad$$ WHERE name = 'Malta';

UPDATE countries SET tax_advice = $$- No VAT or sales tax on products and services
- Personal income tax ranges from 8.93% to 20.87%
- Corporate tax is a flat 20% on net profits
- Iceland has competitive withholding tax rates on dividends (6% if conditions met)
- Pension contributions are tax-deductible
- Foreign-sourced income may be exempt if criteria met
- Health insurance contributions are deductible
- Use tax residency carefully to optimize tax filing status$$ WHERE name = 'Iceland';

UPDATE countries SET tax_advice = $$- Germany has progressive income tax rates (0% to 42%)
- Corporate tax (Körperschaftsteuer) is 30% plus trade tax
- VAT at 19% (reduced rates of 7% and 0% on essentials)
- Dual income taxation system between federal and state level
- Significant tax deductions available for business expenses
- Retirement and insurance contributions are tax-deductible
- Church tax of 8-9% applies if church member
- Wealth tax abolished, but inheritance tax applies$$ WHERE name = 'Germany';

UPDATE countries SET tax_advice = $$- Peru offers a tiered income tax system (up to 30%)
- Corporate tax rate is 27%, but lower rates available for certain sectors
- VAT is 18% with some exemptions for essentials
- Non-residents taxed only on Peruvian-sourced income
- Foreign remittances to Peru can benefit from reduced tax treatment
- Export income may qualify for tax incentives
- Retirement contributions are tax-deductible
- Regional tax incentives available for businesses in designated zones$$ WHERE name = 'Peru';

UPDATE countries SET tax_advice = $$- Chile has a progressive tax system (up to 37%)
- Corporate tax (impuesto a la renta) is a flat 27% on profits
- VAT at 19% (standard rate applies to most goods/services)
- Foreign-source income only taxed if remitted to Chile
- Generous tax deductions for personal expenses and business costs
- Pension contributions (up to 10%) are mandatory and tax-deductible
- Capital gains can be taxable depending on holding period and circumstances
- Mining industry receives special tax treatment and incentives$$ WHERE name = 'Chile';

UPDATE countries SET tax_advice = $$- Morocco has income tax rates ranging from 0% to 38%
- Corporate tax rate is 30%, with preferential rates for certain activities
- VAT at 20% (reduced rates of 14%, 10%, 7%, and 0% on essentials)
- Non-residents taxed at flat 13% on investment income
- Foreign remittances are tax-exempt if formalized through official channels
- Business startups in technology receive tax holidays
- Regional free zones (Tangier) offer significant tax incentives
- Pension contributions and life insurance are tax-deductible$$ WHERE name = 'Morocco';

UPDATE countries SET tax_advice = $$- Indonesia uses a progressive income tax system (up to 30%)
- Corporate tax rate is 22% (reduced to 17% for certain taxpayers)
- VAT at 10% with exemptions for essentials and financial services
- Foreign residents taxed on worldwide income if physically present 183+ days
- Tax amnesty programs periodically available for undeclared assets
- Capital gains generally not taxed if reinvested within 1 year
- R&D expenses receive enhanced deductions (150% for certain activities)
- Export-oriented businesses receive various tax incentives$$ WHERE name = 'Indonesia';

UPDATE countries SET tax_advice = $$- UK income tax: 0% to 45% (depending on taxable income bracket)
- Corporation tax at 25% (lower rate of 19% for profits under £50k)
- VAT at 20% (reduced rates of 5% and 0% on essentials)
- Non-residents: only UK-sourced income is taxable
- Capital gains: annual exemption of £3,000, then 10-20% depending on asset type
- Dividend allowance of £500 per year for basic rate taxpayers
- ISAs allow up to £20,000 tax-free investment
- Tax residence status critical to determine tax liability$$ WHERE name = 'United Kingdom';

UPDATE countries SET tax_advice = $$- Portugal has progressive income tax rates (14.5% to 48%)
- Corporate tax rate is 19% (15% for companies with turnover <25m euros)
- VAT at 23% (reduced rates of 13%, 6%, and 0%)
- Non-Habitual Resident (NHR) regime offers 10-year tax exemption on foreign income
- Golden Visa holders can benefit from NHR provisions
- Capital gains generally taxed at 28%
- Real estate property transfer tax at varying rates (0.8%-8%)
- Tax residency established if in Portugal 183+ days or have permanent home$$ WHERE name = 'Portugal';

UPDATE countries SET tax_advice = $$- Spain uses progressive income tax (19% to 45%)
- Corporate tax rate is 25% (reduced rates for startups)
- VAT at 21% (reduced rates of 10%, 4%, and 0%)
- Expat tax relief (Beckham Law) offers 6-year tax break for certain income types
- Non-residents taxed at flat 19% on Spanish-sourced income
- Capital gains: 19% to 23% depending on holding period
- Wealth tax abolished in 2008, replaced with increased VAT
- Regional variations exist (Canary Islands, Balearic Islands offer incentives)$$ WHERE name = 'Spain';

UPDATE countries SET tax_advice = $$- Estonia has unique digital-first tax system (20% corporate rate)
- Profits distributed are taxed; retained earnings tax-free
- Income tax for residents: 8% to 20% depending on bracket
- VAT at 20% (reduced rates of 9% and 0%)
- Non-residents taxed on Estonia-source income only
- Capital gains from securities exempt from tax
- Dividend tax deferred until withdrawal (encouraging reinvestment)
- E-Residency provides online tax filing and digital solutions$$ WHERE name = 'Estonia';

UPDATE countries SET tax_advice = $$- Thailand has income tax rates from 0% to 37%
- Corporate tax rate is 20% with deductions available
- VAT at 7% (exemptions for essentials)
- Foreign nationals taxed on Thailand-source income only
- Remittance basis taxation available for non-residents
- Tax treaty benefits with 60+ countries available
- Retirement income can receive preferential tax treatment
- No capital gains tax on stock exchanges
- Investment incentive: Board of Investment (BOI) offers significant tax holidays$$ WHERE name = 'Thailand';

UPDATE countries SET tax_advice = $$- Mexico has progressive income tax (1.92% to 35%)
- Corporate tax rate is 30% with deductions
- VAT at 16% (reduced rates of 0% and 8% in border regions)
- Non-residents taxed on Mexico-source income only
- Capital gains taxed at same rate as ordinary income
- Foreign tax credits available for taxes paid abroad
- Temporary resident status doesn't automatically grant residency for tax purposes
- Export-oriented businesses receive various incentives$$ WHERE name = 'Mexico';

UPDATE countries SET tax_advice = $$- Switzerland has one of the lowest tax rates in Europe
- Federal income tax: 0% to 11.5% (plus cantonal/municipal taxes)
- Corporate tax varies significantly by canton (11% to 21.6% effective)
- VAT at 8.1% (reduced rates of 3.8%, 2.5%, and 0%)
- Non-residents taxed on Swiss-source income only
- Foreign account tax compliance required
- Wealth tax exists in some cantons (not federal)
- Tax planning by canton selection is legitimate and common
- Capital gains generally not taxed at federal level$$ WHERE name = 'Switzerland';

UPDATE countries SET tax_advice = $$- Italy has progressive income tax (23% to 43%)
- Corporate tax rate is 24% (lower rates available in special zones)
- VAT at 22% (reduced rates of 10%, 5%, and 4%)
- Non-residents taxed on Italy-source income only
- Capital gains: 26% flat tax for some assets, ordinary rates for others
- Property tax (IMU) based on cadastral value, varies by region
- Foreign tax credits available for taxes paid abroad
- Incentives for repatriated capital and foreign business income$$ WHERE name = 'Italy';

UPDATE countries SET tax_advice = $$- Netherlands has progressive income tax (19.55% to 49.5%)
- Corporate tax rate is 23% (19% for profits up to €200k for small entities)
- VAT at 21% (reduced rates of 9%, 6%, and 0%)
- Non-residents taxed on Dutch-source income and worldwide Dutch-originating income
- Ruling system (APA/RULING) allows advance tax agreements
- Capital gains from regular investments may be exempt
- Substance requirements critical for tax residency determination
- Employer and employee social contributions required$$ WHERE name = 'Netherlands';

UPDATE countries SET tax_advice = $$- Ireland has favorable 12.5% corporate tax rate (R&D tax credit added benefit)
- Personal income tax: 20% and 40% rates with credits
- VAT at 23% (reduced rates of 13.5%, 9%, and 0%)
- Extensive tax treaty network (70+ countries)
- Non-residents taxed on Ireland-source income only
- Capital gains: 33% tax rate with annual exemption of €1,270
- Double taxation relief available
- IP holding companies and R&D activities heavily incentivized$$ WHERE name = 'Ireland';

UPDATE countries SET tax_advice = $$- Greece has progressive income tax (9% to 44%)
- Corporate tax rate is 22% (reduced rates available for certain sectors)
- VAT at 24% (reduced rates of 13%, 6%, and 0%)
- Non-residents taxed on Greece-source income only
- Golden Visa holders (€250k property purchase) receive residency without restrictions
- Capital gains taxed at 15% (under certain conditions)
- Foreign tax credits available
- Special incentive zones offer reduced corporate tax rates$$ WHERE name = 'Greece';

UPDATE countries SET tax_advice = $$- Belgium has progressive income tax (up to 50%)
- Corporate tax rate is 25% (reduced rate of 20.9% for small enterprises)
- VAT at 21% (reduced rates of 12%, 6%, and 0%)
- Non-residents taxed on Belgium-source income only
- Patent box: 80% deduction on IP income (effective 6.25% tax rate)
- Ruling system (Advanced Pricing Agreements) available
- Capital gains taxed at ordinary rates or 16.5% depending on circumstances
- Higher earner withheld tax (précompte mobilier) requires careful planning$$ WHERE name = 'Belgium';

UPDATE countries SET tax_advice = $$- Poland has personal income tax at 17% and 32%
- Corporate tax rate is 19% (reduced to 9% for small companies)
- VAT at 23% (reduced rates of 8%, 5%, and 0%)
- Non-residents taxed on Poland-source income only
- Capital gains can be partially tax-exempt (50% exemption available)
- CIT exemption available for reinvested profits (certain conditions)
- Foreign tax credits available
- IP box: preferential tax treatment for certain innovation income$$ WHERE name = 'Poland';

UPDATE countries SET tax_advice = $$- Austria has progressive income tax (0% to 55%)
- Corporate tax rate is 24%
- VAT at 20% (reduced rates of 10%, 5%, and 0%)
- Non-residents taxed on Austria-source income only
- Capital gains: 27.5% flat tax (for securities/real property)
- Tax ruling system available for certainty on tax treatment
- Collective investment funds receive favorable treatment
- Substantial real estate held by non-residents triggers annual property tax$$ WHERE name = 'Austria';

UPDATE countries SET tax_advice = $$- Turkey has progressive income tax (up to 40%)
- Corporate tax rate is 22% (reduced rates available for certain sectors)
- VAT at 18% (reduced rates of 8%, 1%, and 0%)
- Non-residents taxed on Turkey-source income and foreign income from Turkish business
- Capital gains from security transactions exempt if held 1+ years
- Real estate held 1+ year can exempt 50% of gain
- Special economic zones offer significantly reduced tax rates
- Tax residency established after 1 year of residence$$ WHERE name = 'Turkey';

UPDATE countries SET tax_advice = $$- Denmark has progressive income tax (rates up to 55.8%)
- Corporate tax rate is 22%
- VAT at 25% (no reduced rates, only exemptions for essentials)
- Non-residents taxed on Denmark-source income only
- Capital gains on shares and securities exempt if certain conditions met
- High tax burden offset by excellent public services
- Tax deductions available for mortgage interest, pension contributions
- Significant employment tax credits available for certain employees$$ WHERE name = 'Denmark';

UPDATE countries SET tax_advice = $$- Sweden has progressive income tax (up to 56.6%)
- Corporate tax rate is 20.6%
- VAT at 25% (reduced rates of 12% and 6%)
- Non-residents taxed on Sweden-source income only
- Capital gains: 30% flat tax (lower for primary residence - often exempt)
- Wealth tax abolished in 2007
- Tax deductions for mortgage interest and pension contributions
- Dividend tax: 30% for standard rate (varies for retirement accounts)$$ WHERE name = 'Sweden';

UPDATE countries SET tax_advice = $$- Finland has progressive income tax (up to 56.95%)
- Corporate tax rate is 20.8%
- VAT at 24% (reduced rates of 14%, 10%, and 0%)
- Non-residents taxed on Finland-source income only
- Capital gains on shares and securities taxed at 30%
- Significant deductions for mortgage interest and pension contributions
- Tax-exempt income includes dividends from certain conditions
- Dividend taxation: varies by account type and residency status$$ WHERE name = 'Finland';

UPDATE countries SET tax_advice = $$- Norway has progressive income tax (22% average, rates up to 48.84%)
- Corporate tax rate is 22%
- VAT at 25% (reduced rates of 15%, 11.1%, and 0%)
- Non-residents taxed on Norway-source income only
- Capital gains generally not taxed (with exceptions for real estate)
- Oil and energy sector has special tax regime
- Pensions and insurance contributions are tax-deductible
- Tax residency requires personal presence or economic ties
- Foreign tax credits available for taxes paid abroad$$ WHERE name = 'Norway';

UPDATE countries SET tax_advice = $$- Cyprus has one of the lowest corporate tax rates in EU (0% for certain income)
- Regular corporate tax rate is 12.5%
- Personal income tax: 0% to 35% progressive
- VAT at 19% (reduced rates of 9%, 5%, and 0%)
- Non-residents taxed on Cyprus-source income only
- Dividends received can be exempt from taxation (participation exemption)
- Capital gains: 0% on shares (with holding requirements), 20% on real estate
- IP holding companies receive preferential treatment
- Non-dom individuals don't pay tax on foreign income$$ WHERE name = 'Cyprus';

UPDATE countries SET tax_advice = $$- France has progressive income tax (0% to 45%)
- Corporate tax rate is 25% (reduced to 15% for small/medium enterprises)
- VAT at 20% (reduced rates of 10%, 5.5%, and 2.1%)
- Non-residents taxed on France-source income only
- Capital gains: 19% flat tax (plus social levies)
- Extensive use of tax rulings to determine favorable treatment
- New France requirement: substantial economic activity needed for residency
- French residents required to file worldwide assets (declaration of foreign accounts)
- Wealth tax (ISF) applies to certain high-net-worth individuals$$ WHERE name = 'France';


-- Seed local_tips for all 28 countries

UPDATE countries SET local_tips = $$- Learn basic Maltese and English are both official languages
- Apply for residency before 60 days if staying longer than 90 days
- Healthcare: Private insurance recommended; public system available for residents
- Cost of living highest in EU capitals; budget €1,500-2,000/month for comfortable living
- Buy property early if considering Golden Visa; prices rising quickly
- Network through local expat groups; tight community makes integration easier
- Public transport is cheap but limited; car recommended outside Valletta$$ WHERE name = 'Malta';

UPDATE countries SET local_tips = $$- Embrace "hygge" culture - slow living and candlelit evenings are essential
- Winter is long and dark; prepare mentally and invest in quality outerwear
- High cost of living (food, alcohol, housing) but excellent public services justify it
- Learn Icelandic if staying long-term; English widely spoken but appreciated
- Rental market very competitive; start searching 2-3 months before move
- Expat communities in Reykjavík can help with bureaucratic processes
- Geothermal heating makes energy costs manageable$$ WHERE name = 'Iceland';

UPDATE countries SET local_tips = $$- German bureaucracy is efficient but thorough; keep all documents organized
- Register with local government (Anmeldung) within 2 weeks of arrival
- Healthcare system excellent; mandatory public or private insurance required
- Learn German quickly; English common but German essential for integration
- Apprenticeship and vocational training (Ausbildung) widely available
- Punctuality and directness highly valued in German culture
- Recycling is mandatory with strict sorting requirements$$ WHERE name = 'Germany';

UPDATE countries SET local_tips = $$- Spanish (not Portuguese) is primary language; learn regional dialects
- Bureaucracy can be slow; patience and connections essential
- Siesta culture still strong outside major cities; adjust schedule accordingly
- Healthcare: Public system (IMSS) good value; register quickly after arrival
- Visa runs to Bolivia/Chile easy if needed for long-term stays
- Cost of living reasonable outside Lima and major tourist zones
- Join local clubs/sports groups to build community quickly$$ WHERE name = 'Peru';

UPDATE countries SET local_tips = $$- Spanish is essential; English limited outside Santiago and tourist areas
- Healthcare excellent public system; FONASA registration recommended
- High internet speeds and tech-forward infrastructure
- Cost of living rising rapidly; budget accordingly for Santiago
- Visa requirements can be navigated with tourism loop if needed
- Strong wine culture; explore local vineyards in Central Valley
- Weather varies dramatically by region; choose location carefully$$ WHERE name = 'Chile';

UPDATE countries SET local_tips = $$- Arabic (Darija dialect) spoken; French also very useful, English limited
- Bureaucracy can be slow and require connections; patience essential
- Ramadan significantly affects business hours and social life
- Healthcare: Private clinics better quality than public system
- Haggling expected in markets; good opportunity to practice language
- Cost of living very reasonable; budget €600-800/month comfortably
- Expat communities in Marrakech and Tangier well-established$$ WHERE name = 'Morocco';

UPDATE countries SET local_tips = $$- Indonesian (Bahasa) easier than it seems; locals appreciate effort to learn
- Bureaucracy requires patience and local knowledge; hire visa agent if needed
- Healthcare: Stick to private clinics in cities; international insurance recommended
- Cost of living very reasonable; expat lifestyle affordable on modest budget
- Visas often require visa runs; neighboring countries easily accessible
- Traffic in Jakarta chaotic; consider location carefully before moving
- Rainy season (November-March) affects daily life and infrastructure$$ WHERE name = 'Indonesia';

UPDATE countries SET local_tips = $$- English widely spoken; no pressure to learn English but appreciated
- NHS (National Health Service) free; register with GP immediately after arrival
- Visa sponsorship essential for most work visas; plan well ahead
- Cost of living very high in London; consider regional alternatives
- Council tax, utilities, and council registration required; budget accordingly
- Driving left-hand side cars; international license required
- Weather grey and rainy; invest in good waterproof gear$$ WHERE name = 'United Kingdom';

UPDATE countries SET local_tips = $$- Portuguese easy to learn if you know Spanish; locals appreciate effort
- NHR (Non-Habitual Resident) tax regime available for first 10 years
- Healthcare: Private insurance recommended though public system acceptable
- Cost of living reasonable outside Lisbon and Porto; rural areas very affordable
- Bureaucracy: Register with local authorities (junta de freguesia) immediately
- Golden Visa program well-established and widely understood
- Weather excellent; mild winters in most of country$$ WHERE name = 'Portugal';

UPDATE countries SET local_tips = $$- Spanish essential; regional languages (Catalan, Basque) matter in some regions
- Bureaucracy less efficient than Germany but improving; patience required
- Healthcare excellent and affordable; register with local centro de salud
- Visa sponsorship needed for work; digital nomad visa available
- Siesta culture stronger south; adjust business schedule accordingly
- Labor market competitive; network heavily before moving
- Quality of life exceptionally high; integration easier than expected$$ WHERE name = 'Spain';

UPDATE countries SET local_tips = $$- Estonian widely spoken; English very common among younger generations
- E-governance system excellent; most bureaucracy done online
- Cost of living reasonable outside Tallinn; budget €800-1,200/month
- Healthcare: Register with family doctor; system efficient and affordable
- Tech industry booming; e-residency useful for business formation
- Sauna culture important; explore traditional saunas for integration
- Winter dark and long but manageable; outdoor activities year-round$$ WHERE name = 'Estonia';

UPDATE countries SET local_tips = $$- Thai language helpful but English common in tourist/expat areas
- Visa runs to Laos/Malaysia standard for extending stays
- Healthcare: Bangkok private hospitals world-class; affordable even without insurance
- Cost of living very low; comfortable expat lifestyle €500-800/month
- Thai culture values respect and formality; learn key etiquette
- Muay Thai gyms excellent for fitness and community building
- Monsoon season (May-October) affects weather; plan indoor activities$$ WHERE name = 'Thailand';

UPDATE countries SET local_tips = $$- Spanish essential; English limited outside tourist areas and Mexico City
- Visa sponsorship needed for work; temporary resident visa renewable
- Healthcare: Private insurance recommended; IMSS public system adequate
- Cost of living very low outside Mexico City; budget €600-900/month
- Residency visa (temporary) renewable annually for several years
- Bureaucracy improving but still can be complicated; hire gestoria if needed
- Security situation varies dramatically by location; choose carefully$$ WHERE name = 'Mexico';

UPDATE countries SET local_tips = $$- French helpful but German/Italian/Romansh also spoken regionally
- Bureaucracy efficient and well-organized; keep documents meticulously
- Extreme cost of living: budget CHF 4,000-6,000/month for comfortable living
- Healthcare mandatory; excellent quality but very expensive
- Cantons have significant autonomy; tax situation varies by location
- Integration requires effort; Swiss culture is reserved but respectful
- Public transport excellent; car optional in cities$$ WHERE name = 'Switzerland';

UPDATE countries SET local_tips = $$- Italian essential; dialects vary significantly by region
- Bureaucracy can be slow; relationships and connections help significantly
- Healthcare excellent; register with local ASL (health authority)
- Cost of living reasonable outside major cities; north more expensive than south
- Regional differences dramatic; research specific region before moving
- Visa sponsorship needed for work; understand visa type carefully
- Labor market competitive; networking crucial for employment$$ WHERE name = 'Italy';

UPDATE countries SET local_tips = $$- Dutch very widely spoken; English nearly universal but Dutch appreciated
- Bureaucracy efficient; register with gemeente (municipality) immediately
- Cycling culture dominant; invest in good bike and follow traffic laws
- Cost of living high but reasonable for quality of life; budget €1,500-2,000/month
- Rental market competitive; start searching early through established sites
- Healthcare: Mandatory insurance; deductible system common
- Weather cool and grey; embrace cycling and indoor culture$$ WHERE name = 'Netherlands';

UPDATE countries SET local_tips = $$- English nearly universal; Irish accent takes time to understand
- Bureaucracy improving; PPS number (Personal Public Service) essential
- Healthcare: Private insurance recommended though public system available
- Cost of living high, especially Dublin; consider regional cities
- Tax rate low; double taxation treaties with many countries
- Visa sponsorship available for skilled workers; Critical Skills Employment Permit
- Weather rainy and cool; embrace pub culture for social integration$$ WHERE name = 'Ireland';

UPDATE countries SET local_tips = $$- Greek helpful but English widely spoken in expat/tourist areas
- Bureaucracy can be slow; relationships matter; be patient
- Healthcare acceptable in major cities; private insurance recommended
- Cost of living very reasonable; budget €800-1,200/month comfortable
- Golden Visa program well-known; property investment pathway clear
- Island-specific regulations; research specific island before moving
- Summer extremely hot; adapt schedule to late nights and siestas$$ WHERE name = 'Greece';

UPDATE countries SET local_tips = $$- French or Dutch essential depending on region (Brussels, Flanders, Wallonia)
- Bureaucracy complex due to regional differences; hire relocation specialist if possible
- Cost of living reasonable outside Brussels; budget €1,200-1,800/month
- Healthcare excellent; mandatory registration with mutuellе (health fund)
- Regional integration important; learn local language of region
- Tax brackets complicated; professional advice recommended
- Cycling infrastructure excellent especially in Flanders$$ WHERE name = 'Belgium';

UPDATE countries SET local_tips = $$- Polish increasingly spoken among younger people; English growing
- Bureaucracy improving rapidly; digitalization making processes easier
- Cost of living low; budget €700-1,000/month comfortably
- Healthcare functional but slower than Western Europe; consider private insurance
- Job market improving for skilled workers; networking essential
- Visa sponsorship available for key specialists
- Weather cold winters (minus 10-15°C common); prepare appropriately$$ WHERE name = 'Poland';

UPDATE countries SET local_tips = $$- German essential, especially outside Vienna; English spoken but limited
- Bureaucracy efficient; Austrians appreciate order and punctuality
- Cost of living reasonable; budget €1,400-1,800/month
- Healthcare excellent; mandatory insurance; register immediately
- Vienna's music/culture scene world-class; integrate through cultural activities
- Skiing and outdoor activities central to lifestyle; embrace them
- Coffee culture strong; embrace Viennese coffee house tradition$$ WHERE name = 'Austria';

UPDATE countries SET local_tips = $$- Turkish essential; English common in Istanbul but limited elsewhere
- Bureaucracy can be unpredictable; connections and flexibility important
- Healthcare: Private insurance recommended; good clinics in major cities
- Cost of living very low; budget €700-900/month for comfortable expat lifestyle
- Visa runs to nearby countries standard practice
- Entrepreneurship and business formation relatively straightforward
- Weather hot and dry in summer; prepare for significant heat$$ WHERE name = 'Turkey';

UPDATE countries SET local_tips = $$- Danish useful but English nearly universal; Danes speak English very well
- Extreme cost of living; budget DKK 15,000-18,000/month (€2,000-2,400)
- "Hygge" and work-life balance central to Danish culture; embrace it
- Healthcare excellent; mandatory registration; efficient system
- Bureaucracy well-organized; CPR number essential (like SSN)
- Salary expectations high but cost of living absorbs most gains
- Cycling culture dominant; learn cycling etiquette$$ WHERE name = 'Denmark';

UPDATE countries SET local_tips = $$- Swedish helpful but English universal among younger generations
- Cost of living very high; Stockholm especially expensive; budget SEK 20,000-25,000/month
- "Fika" (coffee break) culture important; embrace social/work integration
- Healthcare excellent; mandatory registration with region's healthcare service
- Bureaucracy efficient; personnummer (personal ID number) essential
- Excellent work-life balance and parental leave; generous social benefits
- Winter long and dark; seasonal depression common; prepare mentally
- Outdoor culture strong year-round; invest in proper cold weather gear$$ WHERE name = 'Sweden';

UPDATE countries SET local_tips = $$- Finnish helpful but English widely spoken; less critical than Scandinavian countries
- Cost of living high; budget €1,800-2,200/month
- Sauna culture essential to Finnish identity; participate actively
- Healthcare excellent; mandatory register with public system
- Winter dark 6+ months; seasonal affective disorder common; prepare
- Education system world-class; relevant for families
- Bureaucracy efficient; language support available for expats
- Outdoor activities (lakes, forests, skiing) central to lifestyle$$ WHERE name = 'Finland';

UPDATE countries SET local_tips = $$- Norwegian helpful but English very widely spoken; Norwegians fluent
- Extreme cost of living; highest in Nordic region; budget NOK 20,000-25,000/month
- Work-life balance and outdoor culture core to Norwegian identity
- Healthcare excellent; mandatory registration; very efficient system
- Bureaucracy well-organized; get D-number immediately (temporary ID)
- Outdoor activities (hiking, skiing, fishing) define lifestyle
- Winter involves significant darkness; embrace hygge and prepare mentally
- Wages high; compensate for extreme living costs$$ WHERE name = 'Norway';

UPDATE countries SET local_tips = $$- Greek essential; English common among younger people and expat community
- Cost of living very reasonable; budget €800-1,000/month comfortably
- Residency straightforward; UK pension holders popular demographic
- Healthcare adequate; private insurance recommended; EU coverage helps
- Bureaucratic processes slow; patience and connections valuable
- Island lifestyle: choose between quiet/developed depending on preference
- Community strong; join local groups quickly for integration
- Prepare for summer heat and variable winter weather$$ WHERE name = 'Cyprus';

UPDATE countries SET local_tips = $$- French essential outside Paris; English limited outside major cities/expat areas
- Bureaucracy complex and slow; French love of paperwork real; patience critical
- Cost of living reasonable outside Paris; Paris very expensive; budget €1,500-2,000/month Paris
- Healthcare excellent; mandatory registration; Sécurité Sociale system complex
- Work visa sponsorship required; freelancer status available for self-employed
- French culture values pessimism and critical thinking; learn to appreciate it
- Regional integration important; Paris expats can live expat bubble if not careful$$ WHERE name = 'France';
