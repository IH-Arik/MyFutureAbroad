import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import type { MessageThread } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";
import ChatArea from "@/components/messages/ChatArea";
import { useToast } from "@/components/Toast";

function formatDate(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesPageContent() {
  const { t } = useTranslation();
  const { user, profile, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();

  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      addToast("Payment successful! Thank you.", "success");
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setRefetchTrigger((p) => p + 1), 1000);
    } else if (paymentStatus === "cancelled") {
      addToast("Payment was cancelled.", "info");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, addToast]);

  useEffect(() => {
    if (!user || !profile) return;

    const fetchThreads = async () => {
      setLoadingThreads(true);
      try {
        let query = supabase
          .from("message_threads")
          .select(`
            *,
            orders(id, client_id, service_id, provider_id, status, amount, payment_status, notes, currency, created_at, updated_at, service:services(id, title, price_usd, price_type, currency, service_type)),
            service:services(id, title, price_usd, price_type, currency),
            provider:providers(id, company_name, logo_url, preferred_currency, verified)
          `)
          .order("created_at", { ascending: false });

        if (profile.role === "client") {
          query = query.eq("client_id", user.id);
        } else if (profile.role === "provider") {
          const { data: memberData } = await supabase
            .from("provider_members")
            .select("provider_id")
            .eq("user_id", user.id);

          const providerIds = memberData?.map((m: any) => m.provider_id) ?? [];
          if (providerIds.length > 0) {
            query = query.in("provider_id", providerIds);
          } else {
            setThreads([]);
            setLoadingThreads(false);
            return;
          }
        }

        const { data } = await query;

        const loaded = (data as any[])
          ?.map((thread) => {
            let order = thread.order;
            let provider = thread.provider;

            if (Array.isArray(thread.orders)) {
              order = thread.orders[0];
            } else if (thread.orders && typeof thread.orders === "object") {
              order = thread.orders;
            }

            return { ...thread, order, provider } as MessageThread;
          })
          .filter(Boolean) as MessageThread[];

        setThreads(loaded || []);
      } catch (err) {
        console.error("Failed to load threads", err);
        addToast("Failed to load conversations", "error");
      } finally {
        setLoadingThreads(false);
      }
    };

    fetchThreads();
  }, [user, profile, refetchTrigger, addToast]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">{t("messages.sign_in")}</p>
        <Link to="/login">
          <Button>{t("login.sign_in")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[80vw] py-4 sm:py-8 px-2 sm:px-0">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-tight">{t("messages.title")}</h1>

      <div className="flex h-screen sm:h-[70vh] -mx-2 sm:mx-0 overflow-hidden rounded-none sm:rounded-2xl border-t sm:border border-border/50 bg-white shadow-sm dark:bg-[#1a1a1a]">
        {/* Thread list */}
        <aside className={`${activeThread ? "hidden" : "w-full"} sm:w-72 sm:block shrink-0 overflow-y-auto border-r border-border/40 dark:border-white/10 sm:border-r`}>
          {loadingThreads ? (
            <div className="p-6 text-sm text-muted-foreground">{t("common.loading")}</div>
          ) : threads.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">{t("messages.no_conversations")}</div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`w-full cursor-pointer p-4 text-left transition-colors hover:bg-muted/60 dark:hover:bg-white/5 ${
                  activeThread?.id === thread.id ? "bg-muted dark:bg-white/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {thread.provider?.logo_url ? (
                    <img src={thread.provider.logo_url} alt={thread.provider.company_name} className="size-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold dark:bg-white/10">{thread.provider?.company_name?.charAt(0) ?? "D"}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold flex items-center gap-1">
                      {thread.provider?.company_name || t("messages.deleted_company") || "Deleted Company"}
                      {thread.provider?.verified && <VerifiedBadge verified={thread.provider.verified} size="sm" />}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{(thread.order as any)?.service?.title ?? t("messages.service")}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(thread.created_at)}</span>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Chat area */}
        <ChatArea activeThread={activeThread} user={user} profile={profile} onClose={() => setActiveThread(null)} />
      </div>
    </div>
  );
}
