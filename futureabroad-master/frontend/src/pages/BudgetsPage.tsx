import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-context";
import type { Budget } from "@/lib/types";
import { useTranslation } from "react-i18next";

export const BudgetsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchBudgets = async () => {
      const { data } = await supabase.from("budgets").select("*").order("created_at", { ascending: false });
      setBudgets(data || []);
    };
    fetchBudgets();
  }, [user]);

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const payload: any = { user_id: user.id, name: name.trim() };
      const { data, error } = await supabase.from("budgets").insert(payload).select("*").single();
      if (error) throw error;
      setBudgets((s) => [data, ...s]);
      setName("");
      navigate(`/budgets/${data.id}`);
    } catch (err) {
      console.error("Error creating budget:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-muted-foreground">{t("budgets.detail_loading")}</div>;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/tools" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t("tools.back")}
        </Link>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{t("budgets.title")}</h1>
          <p className="mt-2 text-sm sm:text-base lg:text-lg text-muted-foreground">{t("budgets.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">{t("budgets.create_card_title")}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("budgets.create_card_desc")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto rounded-xl border border-[#8B6949]/30 dark:border-white/10 bg-white dark:bg-slate-800 text-[#8B6949] dark:text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              {t("budgets.create_btn")}
            </button>
            <Link
              to="/chats?feature=budget"
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
            >
              Build with AI Chat
            </Link>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-white dark:bg-[#1f1f1f] px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">{t("budgets.modal_title")}</h2>
                <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={async (e) => { await handleCreate(e); setShowModal(false); }} className="space-y-4 p-4 sm:p-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">{t("budgets.name_label")}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("budgets.name_placeholder")}
                    required
                    className="w-full rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto rounded-xl border border-border/50 bg-white dark:bg-[#1f1f1f] text-foreground px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">{t("common.cancel")}</button>
                  <button type="submit" disabled={saving} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 active:scale-95">{saving ? t("common.creating") : t("budgets.create")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3">
          {budgets.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-6 sm:p-8 text-center">
              <p className="text-sm text-muted-foreground">{t("budgets.empty")}</p>
            </div>
          ) : (
            budgets.map((b) => (
              <Link
                key={b.id}
                to={`/budgets/${b.id}`}
                className="block rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 hover:shadow-md hover:border-[#8B6949]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{b.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{b.notes || t("budgets.no_notes")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{new Date(b.created_at || "").toLocaleDateString()}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
