import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import BankAccountCard from "@/components/provider/BankAccountCard";
import DeleteCompanyModal from "@/components/provider/DeleteCompanyModal";
import BusinessesList from "@/components/provider/BusinessesList";
import JoinBusinessForm from "@/components/provider/JoinBusinessForm";
import type { Provider, ProviderMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MessagesPanel from "@/components/provider/MessagesPanel";
import OrdersPanel from "@/components/provider/OrdersPanel";
import BusinessInfoCard from "@/components/provider/BusinessInfoCard";
import ServicesPanel from "@/components/provider/ServicesPanel";
import CreateBusinessForm from "@/components/provider/CreateBusinessForm";
import DescriptionCard from "@/components/provider/DescriptionCard";
import JoinCodeCard from "@/components/provider/JoinCodeCard";
import DocumentsPanel from "@/components/provider/DocumentsPanel";

type Tab = "overview" | "orders" | "messages" | "services" | "documents";


// ── Provider Home ─────────────────────────────────────────────────────────────
export const ProviderHome: React.FC = () => {
  const { t } = useTranslation();
  const { user, isProvider, loading } = useAuth();
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<ProviderMember[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("provider_members")
      .select("*, provider:providers(*)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setMemberships((data as ProviderMember[]) ?? []);
        setFetching(false);
      });
  }, [user]);

  

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoinError(null);
    setJoining(true);

    const code = joinCode.trim().toUpperCase();
    const { data: providerRow, error: lookupError } = await supabase
      .from("providers")
      .select("id, company_name")
      .eq("join_code", code)
      .single();
    if (lookupError || !providerRow) {
      setJoinError(t("provider.join_not_found"));
      setJoining(false);
      return;
    }

    // Check not already a member
    const alreadyMember = memberships.some((m) => m.provider_id === providerRow.id);
    if (alreadyMember) {
      setJoinError(t("provider.already_member"));
      setJoining(false);
      return;
    }

    const { data: newMember, error: insertError } = await supabase
      .from("provider_members")
      .insert({ user_id: user!.id, provider_id: providerRow.id, role: "member" })
      .select("*, provider:providers(*)")
      .single();

    if (insertError || !newMember) {
      setJoinError(insertError?.message ?? "Failed to join business.");
      setJoining(false);
      return;
    }

    setMemberships((prev) => [...prev, newMember as ProviderMember]);
    setJoinCode("");
    setJoining(false);
  }

  if (loading) return null;

  if (!user || !isProvider) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b border-border/40 bg-white px-8 py-4 dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">{t("provider.portal_title")}</h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-8 py-10 space-y-8">
        {/* Your businesses */}
        <section>
          <BusinessesList
            memberships={memberships}
            fetching={fetching}
            onCreateClick={() => setShowCreate(true)}
            onSelect={(m) => navigate(`/provider/${m.provider_id}`)}
            showCreate={showCreate}
          />

          {showCreate && (
            <div className="mt-4">
              <CreateBusinessForm
                userId={user.id}
                userEmail={user.email ?? ""}
                onCreated={(member) => {
                  setMemberships((prev) => [...prev, member]);
                  setShowCreate(false);
                }}
                onCancel={() => setShowCreate(false)}
              />
            </div>
          )}
        </section>

        {/* Join with a code */}
        <JoinBusinessForm
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          onSubmit={handleJoin}
          joinError={joinError}
          joining={joining}
          t={t}
        />
      </div>
    </div>
  );
};

// ── Provider Business Dashboard ───────────────────────────────────────────────
export const ProviderBusinessDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, isProvider, loading } = useAuth();
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [membership, setMembership] = useState<ProviderMember | null | false>(null);
  const [provider, setProvider] = useState<(Provider & { join_code?: string }) | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user || !providerId) return;
    supabase
      .from("provider_members")
      .select("*, provider:providers(*)")
      .eq("user_id", user.id)
      .eq("provider_id", providerId)
      .single()
      .then(({ data }) => {
        if (data) {
          setMembership(data as ProviderMember);
          setProvider((data as ProviderMember).provider as (Provider & { join_code?: string }) ?? null);
        } else {
          setMembership(false);
        }
      });
  }, [user, providerId]);

  if (loading) return null;

  if (!user || !isProvider) {
    navigate("/");
    return null;
  }

  if (membership === null) return null;

  if (membership === false) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">{t("provider.no_access")}</p>
        <Button variant="outline" onClick={() => navigate("/provider")}>{t("provider.back_to_portal")}</Button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: t("provider.tab_overview") },
    { id: "orders", label: t("provider.tab_orders") },
    { id: "messages", label: t("provider.tab_messages") },
    { id: "services", label: t("provider.tab_services") },
    { id: "documents", label: t("provider.tab_documents") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b border-border/40 bg-white px-8 py-4 dark:bg-[#1a1a1a] dark:border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/provider"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t("provider.portal_title")}
            </Link>
            <span className="text-border/60">|</span>
            <h1 className="text-xl font-bold tracking-tight">{provider?.company_name || "Business Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-4">
         
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-6 flex gap-1 rounded-full border border-border/40 bg-white p-1.5 w-fit shadow-sm dark:bg-[#1a1a1a] dark:border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all",
                tab === t.id
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <BusinessInfoCard
              provider={provider}
              membership={membership}
              providerId={providerId}
              onProviderChange={(p) => setProvider(p)}
            />

            <DescriptionCard provider={provider} providerId={providerId} onProviderChange={(p) => setProvider(p)} />

            

            <JoinCodeCard provider={provider} />

            <BankAccountCard provider={provider} userId={user?.id} />

            {/* Delete Company */}
            {membership?.role === "owner" && (
              <div className="rounded-2xl border border-destructive/50 bg-red-50/50 dark:bg-red-950/20 p-6 shadow-sm dark:border-destructive/30 sm:col-span-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive mb-2">{t("provider.delete_company_title") || "Delete Company"}</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("provider.delete_company_desc") || "Permanently delete this company and all associated data. This action cannot be undone."}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setShowDeleteModal(true)}
                >
                  {t("provider.delete_company_btn") || "Delete Company"}
                </Button>
              </div>
            )}
          </div>
        )}

        {tab !== "overview" && (
          <div className="rounded-2xl border border-border/50 bg-white shadow-sm dark:bg-[#1a1a1a] dark:border-white/10 overflow-hidden">
            {tab === "orders" && <OrdersPanel providerId={providerId!} userId={user?.id || ""} />}
            {tab === "messages" && <MessagesPanel providerId={providerId!} userId={user.id} />}
            {tab === "services" && <ServicesPanel providerId={providerId!} providerStatus={provider?.status} />}
            {tab === "documents" && <DocumentsPanel />}
          </div>
        )}

        <DeleteCompanyModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          provider={provider}
          providerId={providerId}
          membership={membership}
        />
      </div>
    </div>
  );
};
