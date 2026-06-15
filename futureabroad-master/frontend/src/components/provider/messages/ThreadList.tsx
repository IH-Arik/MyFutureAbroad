import type React from "react";
import { Link } from "react-router-dom";

function formatDate(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

export function getServiceLink(thread: any): { path: string; title: string } | null {
  const svc =
    (Array.isArray(thread?.orders) ? thread.orders[0]?.service : null) ||
    (thread as any)?.service;
  if (!svc || !svc.id || !svc.service_type || !svc.title) return null;
  return { path: `/services/${svc.service_type}/${svc.id}`, title: svc.title };
}

const ThreadList: React.FC<any> = ({ loading, threads, activeThread, setActiveThread, t }) => {
  return (
    <aside className="w-64 shrink-0 overflow-y-auto border-r border-border/40 dark:border-white/10">
      {loading ? (
        <div className="p-4 text-sm text-muted-foreground">{t("common.loading")}</div>
      ) : threads.length === 0 ? (
        <div className="p-4 text-sm text-muted-foreground">{t("messages.no_conversations")}</div>
      ) : (
        threads.map((thread: any) => {
          console.log("[ThreadList] Rendering thread:", { id: thread.id, client: thread.client, client_full_name: thread.client?.full_name, orders: Array.isArray(thread.orders) ? thread.orders.length : typeof thread.orders, order0_service: Array.isArray(thread.orders) ? thread.orders[0]?.service?.title : 'N/A', service_title: thread.service?.title });
          return (<button
            key={thread.id}
            onClick={() => setActiveThread(thread)}
            className={"w-full cursor-pointer p-4 text-left transition-colors hover:bg-muted/60 dark:hover:bg-white/5 " + (activeThread?.id === thread.id ? "bg-muted dark:bg-white/10" : "")}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold dark:bg-white/10">
                {(thread.client as any)?.full_name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{(thread.client as any)?.full_name || t("provider.client")}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {(() => {
                    const sl = getServiceLink(thread);
                    if (sl) {
                      return <Link to={sl.path} className="hover:underline underline-offset-2">{sl.title}</Link>;
                    }
                    return t("provider.order");
                  })()}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(thread.created_at)}</span>
            </div>
          </button>);
        }))}
    </aside>
  );
};

export default ThreadList;
