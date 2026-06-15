import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import type { Visa, Country } from "@/lib/types";
import { CountryVisaGroup } from "@/components/visa/CountryVisaGroup";
import { translateTexts } from "@/lib/deepl";
import VisasHero from "@/components/visas/VisasHero";
import VisasInfo from "@/components/visas/VisasInfo";

const travelImages = [
	{ img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Historic yellow trams in Lisbon", location: "Portugal", size: "large" },
	{ img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80", alt: "Barcelona architecture", location: "Spain", size: "small" },
	{ img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80", alt: "Swiss Alps", location: "Switzerland", size: "medium" },
	{ img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80", alt: "London Eye", location: "United Kingdom", size: "large" },
];

export default function VisasPageContent() {
	const { t, i18n } = useTranslation();
	const [countriesWithVisas, setCountriesWithVisas] = useState<Country[]>([]);
	const [visasByCountry, setVisasByCountry] = useState<{ [key: string]: Visa[] }>({});
	const [translatedCountryNames, setTranslatedCountryNames] = useState<Record<number, string>>({});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	useEffect(() => {
		const lang = i18n.language ?? "en";
		if (lang === "en" || countriesWithVisas.length === 0) { setTranslatedCountryNames({}); return; }
		let cancelled = false;
		translateTexts(countriesWithVisas.map(c => c.name), lang).then(translated => {
			if (cancelled) return;
			const map: Record<number, string> = {};
			countriesWithVisas.forEach((c, i) => { map[c.id] = translated[i] ?? c.name; });
			setTranslatedCountryNames(map);
		});
		return () => { cancelled = true; };
	}, [countriesWithVisas, i18n.language]);

	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			const el = document.getElementById(location.hash.slice(1));
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	}, [location.hash, loading]);

	useEffect(() => {
		const fetchCountriesWithVisas = async () => {
			try {
				const { data: allVisas } = await supabase
					.from("visas")
					.select("id, name, visa_type, description, application_fee_usd, application_fee_currency, application_fee_amount, base_currency, processing_time_days, renewable, country_id");

				const countryIds = [...new Set((allVisas || []).map(v => v.country_id))];

				if (countryIds.length === 0) {
					setCountriesWithVisas([]);
					setVisasByCountry({});
					setLoading(false);
					return;
				}

				const { data: countries, error: countriesError } = await supabase
					.from("countries")
					.select("id, name, iso_code, flag_url, highlight_img_url")
					.in("id", countryIds);

				if (countriesError) throw countriesError;

				const visasMap: { [key: string]: Visa[] } = {};
				(allVisas || []).forEach(visa => {
					const country = countries?.find(c => c.id === visa.country_id);
					if (country) {
						if (!visasMap[country.name]) visasMap[country.name] = [];
						visasMap[country.name].push(visa);
					}
				});

				setCountriesWithVisas(countries || []);
				setVisasByCountry(visasMap);
			} catch (error) {
				console.error("Error fetching countries with visas:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCountriesWithVisas();
	}, []);

	return (
		<div className="mx-auto w-full max-w-[80vw] space-y-16 py-4 sm:px-4 sm:py-8 lg:px-6">
			<VisasHero stat={t("visas.stat")} title1={t("visas.hero_title_1")} title2={t("visas.hero_title_2")} />

			<VisasInfo title1={t("visas.info_title_1")} title2={t("visas.info_title_2")} subtitle={t("visas.info_subtitle")} ctaLabel={t("visas.info_cta")} images={travelImages} />

			{/* Explore section */}
			<section id="world-of-possibilities" className="py-20">
				<div className="mb-8 flex items-end justify-between">
					<div>
						<h2 className="text-4xl font-medium leading-[0.9] tracking-[-0.02em] text-foreground sm:text-5xl">
							{t("visas.explore_title")}
						</h2>
						<p className="mt-2 text-muted-foreground">{t("visas.explore_subtitle")}</p>
					</div>
				</div>

				<div className="relative mb-8">
					<svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
					</svg>
					<input
						type="text"
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder={t("visas.search_placeholder")}
						className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40"
					/>
					{search && (
						<button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{loading ? (
						<div className="col-span-full text-center py-20 text-muted-foreground">{t("visas.loading")}</div>
					) : (() => {
						const q = search.trim().toLowerCase();
						const filtered = countriesWithVisas.filter(country => {
							const visas = visasByCountry[country.name] || [];
							if (!q) return true;
							if (country.name.toLowerCase().includes(q)) return true;
							return visas.some(v =>
								v.name?.toLowerCase().includes(q) ||
								v.visa_type?.toLowerCase().includes(q)
							);
						}).map(country => ({
							country,
							visas: q
								? (visasByCountry[country.name] || []).filter(v =>
									country.name.toLowerCase().includes(q) ||
									v.name?.toLowerCase().includes(q) ||
									v.visa_type?.toLowerCase().includes(q)
								)
								: visasByCountry[country.name] || []
						}));

						if (filtered.length === 0) return (
							<div className="col-span-full text-center py-20 text-muted-foreground">{t("visas.no_results")} "{search}"</div>
						);

						return filtered.map(({ country, visas }) => (
							<CountryVisaGroup key={country.id} country={{ ...country, name: translatedCountryNames[country.id] ?? country.name }} visas={visas} loading={false} />
						));
					})()}
				</div>
			</section>
		</div>
	);
}
