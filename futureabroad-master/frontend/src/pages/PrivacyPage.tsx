import { useTranslation } from "react-i18next";

export function PrivacyPage() {
    const { t } = useTranslation();
    return (
        <div className="mx-auto w-full max-w-3xl py-12 px-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">{t("privacy.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">{t("privacy.updated")}</p>

            <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s1_title")}</h2>
                    <p>{t("privacy.s1_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s2_title")}</h2>
                    <p>{t("privacy.s2_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s3_title")}</h2>
                    <p>{t("privacy.s3_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s4_title")}</h2>
                    <p>{t("privacy.s4_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s5_title")}</h2>
                    <p>{t("privacy.s5_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s6_title")}</h2>
                    <p>{t("privacy.s6_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s7_title")}</h2>
                    <p>{t("privacy.s7_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("privacy.s8_title")}</h2>
                    <p>{t("privacy.s8_body")}</p>
                </section>
            </div>
        </div>
    );
}
