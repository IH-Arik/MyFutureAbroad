import type React from "react";
import { VerifiedBadge } from "@/components/provider/VerifiedBadge";

const ChatHeader: React.FC<any> = ({ activeThread, onClose, t }) => {
  return (
    <div className="flex items-center justify-between border-b border-border/40 px-3 sm:px-6 py-3 sm:py-4 dark:border-white/10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button onClick={onClose} className="sm:hidden text-muted-foreground hover:text-foreground transition-colors" aria-label="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-sm dark:bg-white/10">
          {activeThread.provider?.company_name?.charAt(0) ?? "D"}
        </div>
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-semibold truncate flex items-center gap-2">
            {activeThread.provider?.company_name || (t("messages.deleted_company") || "Deleted Company")}
            {activeThread.provider?.verified && <VerifiedBadge verified={activeThread.provider.verified} size="md" />}
          </p>
          <p className="text-xs text-muted-foreground truncate">Re: {(activeThread.order as any)?.service?.title ?? t("messages.service")}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
