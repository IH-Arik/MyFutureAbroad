import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { initiateStripePayment, getOrderInvoice } from "@/lib/api";
import type { Order } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toast";
import { useTranslation } from "react-i18next";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrderCard from "@/components/orders/OrderCard";

export default function OrdersPageContent() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "failed">("all");
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Handle payment success callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      addToast(t("orders.payment_success"), "success");
      // Clean up the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Trigger refetch of orders to get updated payment status
      setTimeout(() => setRefetchTrigger(prev => prev + 1), 1000);
    } else if (paymentStatus === "cancelled") {
      addToast(t("orders.payment_cancelled"), "info");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, addToast, t]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, services(id, title, price_usd, price_type, currency), providers(id, company_name, preferred_currency, verified, status)")
          .order("created_at", { ascending: false });
        if (error) throw error;
        const active = (data as Order[]).filter((o) => !(o.providers as any) || (o.providers as any).status === "active");
        setOrders(active);
      } catch (err) {
        addToast(`Failed to load orders: ${(err as Error).message}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, addToast, refetchTrigger]);

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

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.payment_status === filterStatus);

  const handlePayment = async (order: Order) => {
    if (!user) return;
    
    setPayingOrderId(order.id);
    try {
      await initiateStripePayment(order.id);
    } catch (err) {
      addToast(`Payment initiation failed: ${(err as Error).message}`, "error");
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleViewInvoice = async (order: Order) => {
    if (!user) return;
    
    setLoadingInvoiceId(order.id);
    try {
      const invoice = await getOrderInvoice(order.id);
      
      // Prefer hosted invoice URL, fall back to receipt URL
      const invoiceUrl = invoice.invoiceUrl || invoice.receiptUrl;
      
      if (invoiceUrl) {
        window.open(invoiceUrl, "_blank");
        addToast("Opening invoice...", "info");
      } else {
        addToast("Invoice URL not available", "warning");
      }
    } catch (err) {
      addToast(`Failed to get invoice: ${(err as Error).message}`, "error");
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[80vw] py-8 px-4 sm:px-4 lg:px-6">
        <OrdersHeader filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

        {loading ? (
          <div className="rounded-lg border border-border/50 bg-white p-12 text-center dark:bg-[#1f1f1f]">
            <p className="text-muted-foreground">{t("orders.loading")}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-white p-12 text-center dark:bg-[#1f1f1f]">
            <p className="text-muted-foreground text-lg mb-6">{t("orders.empty_pre")} {filterStatus !== "all" ? filterStatus : ""} {t("orders.empty_post")}</p>
            <Link to="/messages">
              <Button className="cursor-pointer">{t("orders.go_messages")}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPay={handlePayment}
                onViewInvoice={handleViewInvoice}
                payingOrderId={payingOrderId}
                loadingInvoiceId={loadingInvoiceId}
              />
            ))}
          </div>
        )}
    </div>
  );
}
