import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { unreadCount?: number };

const NotificationsTrigger = React.forwardRef<HTMLButtonElement, Props>(function NotificationsTrigger(
  { unreadCount = 0, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      aria-label="Notifications"
      className={
        "relative rounded-full p-1 xl:p-1.5 text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer " +
        className
      }
      {...props}
    >
      <div className="relative flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-3 xl:size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
});

export default NotificationsTrigger;
