import type React from "react";

const CreateBusinessFormFields: React.FC<any> = ({
  t,
  PROVIDER_TYPES,
  companyName,
  setCompanyName,
  providerType,
  setProviderType,
  description,
  setDescription,
  contactEmail,
  setContactEmail,
  userEmail,
  website,
  setWebsite,
  securityKey,
  setSecurityKey,
  setKeyIsValid,
  validateSecurityKey,
  validatingKey,
  preferredCurrency,
  setPreferredCurrency,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("provider.business_name")} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder={t("provider.business_name_placeholder")}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("provider.business_type")}</label>
        <select
          value={providerType}
          onChange={(e) => setProviderType(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        >
          <option value="">{t("provider.select_type")}</option>
          {PROVIDER_TYPES.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("provider.svc_description")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("provider.business_desc_placeholder")}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("provider.contact_email")}</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder={userEmail}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t("provider.website")}</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yoursite.com"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("provider.security_key")} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={securityKey}
          onChange={(e) => {
            setSecurityKey(e.target.value);
            setKeyIsValid(false);
          }}
          onBlur={() => {
            if (securityKey.trim()) validateSecurityKey(securityKey);
          }}
          placeholder={t("provider.security_key_placeholder")}
          required
          disabled={validatingKey}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        />
        <p className="mt-1 text-xs text-muted-foreground">{t("provider.security_key_hint")}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("provider.preferred_currency")}</label>
        <select
          value={preferredCurrency}
          onChange={(e) => setPreferredCurrency(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]"
        >
          <option value="">{t("provider.default_usd")}</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">{t("provider.preferred_currency_hint")}</p>
      </div>
    </>
  );
};

export default CreateBusinessFormFields;
