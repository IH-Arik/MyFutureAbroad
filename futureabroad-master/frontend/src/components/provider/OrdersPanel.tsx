import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { acceptOrder, rejectOrder, cancelOrder, getOrderInvoice, formatCurrency } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type { Order } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  active: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
};

export default function OrdersPanel({ providerId, userId }: { providerId: string; userId: string }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleViewInvoice = async (order: Order) => {
    if (!userId) return;
    setLoadingInvoiceId(order.id);
    try {
      const invoice = await getOrderInvoice(order.id);
      const url = invoice.invoiceUrl || invoice.receiptUrl;
      if (url) {
        window.open(url, "_blank");
      } else {
        addToast("Invoice URL not available", "warning");
      }
    } catch (err) {
      addToast(`Failed to get invoice: ${(err as Error).message}`, "error");
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, service:services(title, price_usd, price_type, currency)")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    };
    fetch();

    const subscription = supabase
      .channel(`orders-${providerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `provider_id=eq.${providerId}`,
        },
        (_payload: any) => {
          fetch();
        }
      )
      .subscribe(() => {});

    return () => {
      subscription.unsubscribe();
    };
  }, [providerId]);

  const handleAccept = async (order: Order) => {
    if (!order.amount || order.payment_status !== "paid") {
      addToast(t("provider.order_must_be_paid"), "error");
      return;
    }

    setProcessingOrder(order.id);
    try {
      await acceptOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "active" as const } : o)));
      addToast(t("provider.order_accepted"), "success");
    } catch (err) {
      addToast(`Failed to accept order: ${(err as Error).message}`, "error");
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancel = async (order: Order) => {
    if (order.payment_status !== "pending") {
      addToast("Only pending orders can be cancelled", "error");
      return;
    }

    if (!confirm("Cancel this payment request? The client will no longer be able to pay it.")) return;

    setProcessingOrder(order.id);
    try {
      await cancelOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" as const, payment_status: "cancelled" as const } : o)));
      addToast("Payment request cancelled", "success");
    } catch (err) {
      addToast(`Failed to cancel order: ${(err as Error).message}`, "error");
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleReject = async (order: Order) => {
    if (order.payment_status !== "paid") {
      addToast(t("provider.cannot_reject_unpaid"), "error");
      return;
    }

    setProcessingOrder(order.id);
    try {
      await rejectOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" as const, payment_status: "refunded" as const } : o)));
      addToast(t("provider.order_rejected"), "success");
    } catch (err) {
      addToast(`Failed to reject order: ${(err as Error).message}`, "error");
    } finally {
      setProcessingOrder(null);
    }
  };

  if (loading) return <div className="p-6 text-sm text-muted-foreground">{t("provider.loading_orders")}</div>;

  if (orders.length === 0) return <div className="p-6 text-sm text-muted-foreground">{t("provider.no_orders")}</div>;

  return (
    <div className="space-y-3 p-6">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-border/40 bg-white p-4 shadow-sm dark:bg-[#242424] dark:border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{(order as any).service?.title ?? "Service"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Order #{order.id.slice(0, 8)} &middot; {new Date(order.created_at || '').toLocaleDateString()}</p>
              {order.amount && (
                <p className="mt-1 text-sm font-medium text-foreground">{formatCurrency(order.amount, (order as any).currency || (order as any).service?.currency || "USD")}</p>
              )}
              {order.notes && <p className="mt-2 text-sm text-muted-foreground">{order.notes}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", STATUS_COLORS[order.status])}>{order.status}</span>
                {order.payment_status && (
                  <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium capitalize",
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : order.payment_status === "refunded"
                      ? "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                  )}>{order.payment_status}</span>
                )}
              </div>
              {order.status === "pending" && order.payment_status === "paid" && (
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 rounded-full px-3 text-xs" onClick={() => handleAccept(order)} disabled={processingOrder === order.id}>{processingOrder === order.id ? t("common.processing") : t("provider.accept")}</Button>
                  <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs" onClick={() => handleReject(order)} disabled={processingOrder === order.id}>{processingOrder === order.id ? t("common.processing") : t("provider.reject")}</Button>
                </div>
              )}
              {order.status === "pending" && order.payment_status === "pending" && (
                <div className="flex gap-2">
                  <p className="text-xs text-muted-foreground">{t("provider.waiting_for_payment")}</p>
                  <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleCancel(order)} disabled={processingOrder === order.id}>{processingOrder === order.id ? t("common.processing") : "Cancel"}</Button>
                </div>
              )}
              {order.payment_status === "paid" && (
                <Button size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs" onClick={() => handleViewInvoice(order)} disabled={loadingInvoiceId === order.id}>{loadingInvoiceId === order.id ? "Loading..." : "📄 View invoice"}</Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
