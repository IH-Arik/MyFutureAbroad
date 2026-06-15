import { useTranslation } from "react-i18next";

export function TermsPage() {
    const { t } = useTranslation();
    return (
        <div className="mx-auto w-full max-w-3xl py-12 px-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">{t("terms.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">{t("terms.updated")}</p>

            <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s1_title")}</h2>
                    <p>{t("terms.s1_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s2_title")}</h2>
                    <p>{t("terms.s2_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s3_title")}</h2>
                    <p>{t("terms.s3_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s4_title")}</h2>
                    <p>{t("terms.s4_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s5_title")}</h2>
                    <p>{t("terms.s5_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s6_title")}</h2>
                    <p>{t("terms.s6_body")}</p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("terms.s7_title")}</h2>
                    <p>{t("terms.s7_body")}</p>
                </section>
            </div>
        </div>
    );
}
