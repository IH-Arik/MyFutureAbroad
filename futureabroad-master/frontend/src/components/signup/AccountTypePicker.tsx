import { Link } from "react-router-dom";

export default function AccountTypePicker({ setAccountType, t }: { setAccountType: (v: "client" | "provider" | null) => void; t: (k: string) => string; }) {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-lg border border-border/50 bg-white p-8 shadow-sm dark:bg-[#1f1f1f]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{t("signup.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("signup.role_question")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAccountType("client")}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary hover:bg-primary/5 focus:outline-none cursor-pointer"
            >
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold">{t("signup.user_role")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("signup.user_desc")}</p>
              </div>
            </button>

            <button
              onClick={() => setAccountType("provider")}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-border p-6 transition-all hover:border-primary hover:bg-primary/5 focus:outline-none cursor-pointer"
            >
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/40">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 21V12h6v9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold">{t("signup.provider_role")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("signup.provider_desc")}</p>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("signup.have_account")}{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">{t("signup.sign_in")}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
