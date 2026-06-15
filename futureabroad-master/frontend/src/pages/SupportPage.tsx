import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SupportPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "";
      const res = await fetch(`${backend}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message, email }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || res.statusText || "Failed to send message");
      }

      setSubmitted(true);
      setCategory("");
      setSubject("");
      setMessage("");
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[80vw] space-y-12 py-4 sm:px-4 sm:py-8 lg:px-6">
      <section className="rounded-[2rem] bg-slate-50 dark:bg-[#1a1a1a] px-8 py-16 lg:px-12">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {t("support.title")}
          </p>
          <h1 className="text-5xl leading-[0.95] font-medium tracking-[-0.03em] text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            {t("support.subtitle")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            {t("support.desc")}
          </p>
        </div>
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{t("support.form_title")}</h2>

          {submitted && (
            <div className="mb-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t("support.success_title")}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{t("support.success_desc")}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{t("support.error")}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                {t("support.category")} <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#2a2a2a] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8B6949] focus:outline-none focus:ring-2 focus:ring-[#8B6949]/20 dark:focus:ring-[#8B6949]/30"
              >
                <option value="">{t("support.category_placeholder")}</option>
                <option value="visa">{t("support.cat_visa")}</option>
                <option value="services">{t("support.cat_services")}</option>
                <option value="account">{t("support.cat_account")}</option>
                <option value="technical">{t("support.cat_technical")}</option>
                <option value="billing">{t("support.cat_billing")}</option>
                <option value="other">{t("support.cat_other")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                {t("support.subject")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder={t("support.subject_placeholder")}
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#2a2a2a] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8B6949] focus:outline-none focus:ring-2 focus:ring-[#8B6949]/20 dark:focus:ring-[#8B6949]/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                {t("support.message")} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                aria-label="Support message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={8}
                maxLength={2000}
                placeholder={t("support.message_placeholder")}
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#2a2a2a] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8B6949] focus:outline-none focus:ring-2 focus:ring-[#8B6949]/20 dark:focus:ring-[#8B6949]/30 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                {t("support.email")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("support.email_placeholder")}
                className="w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#2a2a2a] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#8B6949] focus:outline-none focus:ring-2 focus:ring-[#8B6949]/20 dark:focus:ring-[#8B6949]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg font-medium bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] hover:from-[#9c7a58] hover:to-[#e2d2b3] text-white disabled:opacity-60"
            >
              {loading ? t("support.sending") : t("support.send")}
            </button>
          </form>
        </div>

        {/* FAQ-style Support Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">{t("support.help_title")}</h2>

          <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("support.help_general_title")}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("support.help_general_desc")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("support.help_account_title")}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("support.help_account_desc")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("support.help_provider_title")}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("support.help_provider_desc")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("support.response_title")}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("support.response_desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SupportPage;
