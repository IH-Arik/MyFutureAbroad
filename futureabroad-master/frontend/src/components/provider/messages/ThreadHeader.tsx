import type React from "react";
import { Link } from "react-router-dom";
import { getServiceLink } from "./ThreadList";

const ThreadHeader: React.FC<any> = ({ activeThread, t }) => {
  console.log("[ThreadHeader] activeThread:", {
    id: activeThread?.id,
    client: activeThread?.client,
    client_full_name: (activeThread as any)?.client?.full_name,
    orders: Array.isArray(activeThread?.orders) ? activeThread.orders.length : typeof activeThread?.orders,
    order0_service: Array.isArray(activeThread?.orders) ? activeThread.orders[0]?.service?.title : undefined,
    service_title: (activeThread as any)?.service?.title,
  });
  const serviceLink = getServiceLink(activeThread);
  return (
    <div className="border-b border-border/40 px-5 py-3 dark:border-white/10">
      <p className="font-semibold">{(activeThread.client as any)?.full_name || t("provider.client")}</p>
      {serviceLink ? (
        <Link to={serviceLink.path} className="text-xs text-[#1f4865] hover:text-[#173b55] dark:text-[#5b9abf] dark:hover:text-[#7bb5d0] underline underline-offset-2 transition-colors">
          {serviceLink.title}
        </Link>
      ) : (
        <p className="text-xs text-muted-foreground">{t("provider.order")}</p>
      )}
    </div>
  );
};

export default ThreadHeader;
