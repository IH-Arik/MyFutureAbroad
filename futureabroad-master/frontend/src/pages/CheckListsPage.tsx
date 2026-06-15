import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-context";
import type { Checklist } from "@/lib/types";
import { useTranslation } from "react-i18next";

export const CheckListsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchChecklists = async () => {
      const { data } = await supabase.from("checklists").select("*").order("created_at", { ascending: false });
      setChecklists(data || []);
    };
    fetchChecklists();
  }, [user]);

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const payload: any = { user_id: user.id, name: name.trim() };
      const { data, error } = await supabase.from("checklists").insert(payload).select("*").single();
      if (error) throw error;
      setChecklists((s) => [data, ...s]);
      setName("");
      navigate(`/checklists/${data.id}`);
    } catch (err) {
      console.error("Error creating checklist:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-muted-foreground">{t("checklists.detail_loading")}</div>;

  return (
    <div className="min-h-screen px-3 lg:px-4 py-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/tools" className="inline-flex items-center gap-2 text-xs lg:text-sm text-muted-foreground hover:text-foreground mb-4 lg:mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t("tools.back")}
        </Link>
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-foreground">{t("checklists.title")}</h1>
          <p className="mt-2 text-sm lg:text-base xl:text-lg text-muted-foreground">{t("checklists.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base lg:text-lg font-semibold text-foreground">{t("checklists.create_card_title")}</h3>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">{t("checklists.create_card_desc")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto rounded-xl border border-[#8B6949]/30 dark:border-white/10 bg-white dark:bg-slate-800 text-[#8B6949] dark:text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              {t("budgets.create_btn")}
            </button>
            <Link
              to="/chats?feature=checklist"
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white px-4 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
            >
              Build with AI Chat
            </Link>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-white dark:bg-[#1f1f1f] px-4 lg:px-6 py-3 lg:py-4 rounded-t-2xl">
                <h2 className="text-base lg:text-lg font-semibold text-foreground">{t("checklists.modal_title")}</h2>
                <button onClick={() => setShowModal(false)} className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={async (e) => { await handleCreate(e); setShowModal(false); }} className="space-y-4 p-4 lg:p-6">
                <div>
                  <label className="block text-xs lg:text-sm font-medium text-foreground mb-1.5">{t("checklists.name_label")}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("checklists.name_placeholder")}
                    required
                    className="w-full rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6949]/40"
                  />
                </div>

                <div className="flex flex-col-reverse lg:flex-row items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="w-full lg:w-auto rounded-xl border border-border/50 bg-white dark:bg-[#1f1f1f] text-foreground px-4 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">{t("common.cancel")}</button>
                  <button type="submit" disabled={saving} className="w-full lg:w-auto rounded-xl bg-gradient-to-r from-[#8B6949] to-[#D4C2A1] text-white px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50">{saving ? t("common.creating") : t("checklists.create")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3">
          {checklists.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-6 lg:p-8 text-center">
              <p className="text-xs lg:text-sm text-muted-foreground">{t("checklists.empty")}</p>
            </div>
          ) : (
            checklists.map((c) => (
              <Link
                key={c.id}
                to={`/checklists/${c.id}`}
                className="block rounded-2xl border border-border/50 bg-white dark:bg-[#1f1f1f] p-4 hover:shadow-md hover:border-[#8B6949]/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-base xl:text-lg font-semibold text-foreground truncate">{c.name}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2">{c.notes || t("checklists.no_notes")}</p>
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                    <div className="text-xs text-muted-foreground">{new Date(c.created_at || "").toLocaleDateString()}</div>
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
