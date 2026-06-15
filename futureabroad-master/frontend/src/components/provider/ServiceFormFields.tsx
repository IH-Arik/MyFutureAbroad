import type React from "react";
import { CURRENCY_SYMBOLS } from "@/components/currency/CurrencyProvider";
import { LANGUAGES } from "./LanguagesCard";

const ServiceFormFields: React.FC<any> = ({
  t,
  serviceTypes,
  PRICE_TYPES,
  title,
  setTitle,
  description,
  setDescription,
  serviceType,
  setServiceType,
  priceUsd,
  setPriceUsd,
  serviceCurrency,
  setServiceCurrency,
  priceType,
  setPriceType,
  deliveryDays,
  setDeliveryDays,
  includesText,
  setIncludesText,
  requirementsText,
  setRequirementsText,
  allCountries,
  applicableCountries,
  setApplicableCountries,
  serviceLanguages,
  setServiceLanguages,
}) => {
  const ic = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]";

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1.5">{t("provider.svc_title")} <span className="text-destructive">*</span></label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={ic} placeholder="e.g. Portugal Digital Nomad Visa Application" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t("provider.svc_description")}</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className={ic + " resize-none"} placeholder={t("provider.svc_desc_placeholder")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("provider.svc_type")} <span className="text-destructive">*</span></label>
          <select value={serviceType} onChange={e => setServiceType(e.target.value)} required className={ic}>
            <option value="">{t("provider.svc_select_type")}</option>
            {serviceTypes.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("provider.svc_delivery")}</label>
          <input type="number" min={1} value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} className={ic} placeholder="e.g. 30" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("provider.svc_price")} <span className="text-destructive">*</span></label>
          <input type="number" min={0} step="0.01" value={priceUsd} onChange={e => setPriceUsd(e.target.value)} required className={ic} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Currency</label>
          <select value={serviceCurrency} onChange={e => setServiceCurrency(e.target.value)} className={ic}>
            {Object.entries(CURRENCY_SYMBOLS).map(([code, meta]) => (
              <option key={code} value={code}>{meta.symbol} {code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("provider.svc_price_type")}</label>
          <select value={priceType} onChange={e => setPriceType(e.target.value)} className={ic}>
            {PRICE_TYPES.map((p: any) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t("provider.svc_includes")} <span className="text-xs font-normal text-muted-foreground">({t("provider.one_per_line")})</span></label>
        <textarea value={includesText} onChange={e => setIncludesText(e.target.value)} rows={4} className={ic + " resize-none"} placeholder={"Document review\nApplication submission\nStatus updates"} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">{t("provider.svc_requirements")} <span className="text-xs font-normal text-muted-foreground">({t("provider.one_per_line")})</span></label>
        <textarea value={requirementsText} onChange={e => setRequirementsText(e.target.value)} rows={3} className={ic + " resize-none"} placeholder={"Valid passport\nProof of income"} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Countries Served</label>
        <p className="text-xs text-muted-foreground mb-2">Select countries where you offer this service (optional).</p>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search countries…"
            className={ic}
            id="country-search-input-service"
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              const el = document.getElementById("country-checkbox-list-service");
              if (!el) return;
              Array.from(el.children).forEach((child) => {
                const label = (child as HTMLElement).textContent?.toLowerCase() ?? "";
                (child as HTMLElement).style.display = label.includes(q) ? "" : "none";
              });
            }}
          />
          <div id="country-checkbox-list-service" className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1 border border-border rounded-lg p-2">
            {allCountries.length === 0 ? (
              <p className="text-xs text-muted-foreground col-span-2 p-2">{t("common.loading")}</p>
            ) : (
              allCountries.map((country: any) => (
                <label key={country.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground py-0.5">
                  <input
                    type="checkbox"
                    checked={applicableCountries.includes(country.id)}
                    onChange={(e) => {
                      setApplicableCountries((prev: number[]) =>
                        e.target.checked ? [...prev, country.id] : prev.filter(id => id !== country.id)
                      );
                    }}
                    className="rounded"
                  />
                  <span>{country.name}</span>
                </label>
              ))
            )}
          </div>
          {applicableCountries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {applicableCountries.map((id: number) => {
                const c = allCountries.find((c: any) => c.id === id);
                return c ? (
                  <span key={id} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {c.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1.5">Languages Offered</label>
        <p className="text-xs text-muted-foreground mb-2">Select languages you offer for this service (optional).</p>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1 border border-border rounded-lg p-2">
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground py-0.5">
                <input
                  type="checkbox"
                  checked={serviceLanguages?.includes(lang.code)}
                  onChange={(e) => {
                    setServiceLanguages((prev: string[]) =>
                      e.target.checked ? [...(prev || []), lang.code] : (prev || []).filter(c => c !== lang.code)
                    );
                  }}
                  className="rounded"
                />
                <span>{lang.name}</span>
              </label>
            ))}
          </div>
          {serviceLanguages && serviceLanguages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {serviceLanguages.map((code: string) => (
                <span key={code} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {LANGUAGES.find(l => l.code === code)?.name ?? code.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceFormFields;
