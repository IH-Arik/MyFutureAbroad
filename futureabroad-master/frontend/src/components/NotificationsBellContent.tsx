import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import NotificationsTrigger from "@/components/notifications/NotificationsTrigger";
import NotificationItem from "@/components/notifications/NotificationItem";

interface Notification {
  id: string;
  type: "message" | "order" | "payment" | "system";
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
  thread_id?: string;
}

export default function NotificationsBellContent() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || profile?.role === "provider") return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("message_threads")
        .select(
          `
          id,
          created_at,
          orders(id, status, amount),
          messages(count)
        `
        )
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        const notifs: Notification[] = [];

        data.forEach((thread) => {
          const threadDate = new Date(thread.created_at);
          const isRecent = Date.now() - threadDate.getTime() < 86400000;

          if (isRecent && (thread.messages as any).count > 0) {
            notifs.push({
              id: `msg-${thread.id}`,
              type: "message",
              title: t("notifications.new_message"),
              body: t("notifications.new_message_body"),
              link: `/messages?thread=${thread.id}`,
              thread_id: thread.id,
              read: false,
              created_at: thread.created_at,
            });
          }

          if (thread.orders && (thread.orders as any).status === "pending") {
            notifs.push({
              id: `order-${thread.id}`,
              type: "order",
              title: t("notifications.new_order"),
              body: t("notifications.new_order_body", { amount: (thread.orders as any).amount }),
              link: `/messages?thread=${thread.id}`,
              thread_id: thread.id,
              read: false,
              created_at: thread.created_at,
            });
          }
        });

        setNotifications(notifs);
      }
    };

    fetchNotifications();

    const subscription = supabase
      .channel(`messages:client:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=in.(select id from message_threads where client_id=eq.${user.id})`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setNotifications((prev) => [
            {
              id: `msg-${Date.now()}`,
              type: "message",
              title: t("notifications.new_message"),
              body: t("notifications.new_message_body"),
              link: `/messages?thread=${newMsg.thread_id}`,
              thread_id: newMsg.thread_id,
              read: false,
              created_at: new Date().toISOString(),
            },
            ...prev.slice(0, 9),
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, profile, t]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (profile?.role === "provider") return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <NotificationsTrigger unreadCount={unreadCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>{t("notifications.title")}</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                {t("notifications.new_count", { count: unreadCount })}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {t("notifications.empty")}
          </div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={`flex flex-col items-start gap-1 px-4 py-2 cursor-pointer ${
                !notif.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
              }`}
              asChild
            >
              <NotificationItem notif={notif} onClick={() => setOpen(false)} />
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
