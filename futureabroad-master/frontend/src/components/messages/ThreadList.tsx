import { useTranslation } from "react-i18next";
import type { MessageThread } from "@/lib/types";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";

function formatDate(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ThreadList({
  threads,
  loading,
  activeThread,
  onSelect,
}: {
  threads: MessageThread[];
  loading: boolean;
  activeThread: MessageThread | null;
  onSelect: (t: MessageThread) => void;
}) {
  const { t } = useTranslation();

  return (
    <aside className={`${activeThread ? "hidden" : "w-full"} sm:w-72 sm:block shrink-0 overflow-y-auto border-r border-border/40 dark:border-white/10 sm:border-r`}>
      {loading ? (
        <div className="p-6 text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : threads.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">{t("messages.no_conversations")}</div>
      ) : (
        threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread)}
            className={`w-full cursor-pointer p-4 text-left transition-colors hover:bg-muted/60 dark:hover:bg-white/5 ${
              activeThread?.id === thread.id ? "bg-muted dark:bg-white/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {thread.provider?.logo_url ? (
                <img src={thread.provider.logo_url} alt={thread.provider.company_name} className="size-10 rounded-full object-cover" />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold dark:bg-white/10">
                  {thread.provider?.company_name?.charAt(0) ?? "P"}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold flex items-center gap-1">
                  {thread.provider?.company_name}
                  <VerifiedBadge verified={thread.provider?.verified ?? false} size="sm" />
                </p>
                <p className="truncate text-xs text-muted-foreground">{(thread.order as any)?.service?.title ?? t("messages.service")}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(thread.created_at)}</span>
            </div>
          </button>
        ))
      )}
    </aside>
  );
}
