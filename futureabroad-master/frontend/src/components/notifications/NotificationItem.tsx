import * as React from "react";
import { Link } from "react-router-dom";

type Notif = {
  id: string;
  type: "message" | "order" | "payment" | "system";
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
};

type Props = {
  notif: Notif;
  onClick?: () => void;
} & Omit<React.ComponentProps<typeof Link>, "to">;

const NotificationItem = React.forwardRef<HTMLAnchorElement, Props>(function NotificationItem({ notif, onClick, ...props }, ref) {
  return (
    <Link ref={ref} to={notif.link || "#"} onClick={onClick} {...props}>
      <div className="flex items-start justify-between w-full gap-2">
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">{notif.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
        </div>
        {notif.type === "message" && <span>💬</span>}
        {notif.type === "order" && <span>📦</span>}
        {notif.type === "payment" && <span>💰</span>}
        {notif.type === "system" && <span>⚙️</span>}
      </div>
      <p className="text-xs text-muted-foreground/60 mt-1">
        {new Date(notif.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </Link>
  );
});

export default NotificationItem;
