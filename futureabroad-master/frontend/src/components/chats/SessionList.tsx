import type React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon, AiChat02Icon } from "@hugeicons/core-free-icons";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  sessions: ChatSession[];
  activeSessionId: string | null;
  openSession: (id: string) => void;
  confirmDeleteSession: (id: string, e: React.MouseEvent) => void;
  newChat: () => void;
  mobileHistoryOpen: boolean;
  setMobileHistoryOpen: (open: boolean) => void;
}

export default function SessionList({
  sessions,
  activeSessionId,
  openSession,
  confirmDeleteSession,
  newChat,
  mobileHistoryOpen,
  setMobileHistoryOpen,
}: Props) {
  return (
    <aside className={`absolute md:static inset-y-0 left-0 w-64 z-50 flex flex-col border-r border-slate-100 dark:border-white/10 bg-white dark:bg-[#181818] transform transition-transform duration-300 md:transform-none ${mobileHistoryOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
      <div className="flex items-center justify-between px-4 py-3 md:py-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={AiChat02Icon} className="h-4 w-4 sm:h-5 sm:w-5 text-[#1f4865] dark:text-[#5b9abf]" strokeWidth={1.5} />
          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">Chat History</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={newChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg sm:rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#1f4865] hover:text-white dark:hover:bg-[#1f4865] transition-colors"
            title="New chat"
          >
            <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setMobileHistoryOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            title="Close"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1.5 sm:py-2">
        {sessions.length === 0 && (
          <p className="px-3 sm:px-4 py-6 sm:py-8 text-center text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">No previous chats</p>
        )}
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => openSession(s.id)}
            className={`group w-full flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors ${activeSessionId === s.id
                ? "bg-[#1f4865]/10 dark:bg-[#1f4865]/20"
                : "hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
          >
            <span className="flex-1 truncate text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-tight">
              {s.title.replace(/^(Budget|Checklist|VisaFinder|Chatbot):\s*/i, "")}
            </span>
            <span
              onClick={(e) => confirmDeleteSession(s.id, e)}
              className="opacity-0 group-hover:opacity-100 flex h-5.5 w-5.5 items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
              title="Delete chat"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3" strokeWidth={2} />
            </span>
          </button>
        ))}
      </div>

      <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-100 dark:border-white/10">
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">AI can make mistakes and may modify your checklists and budgets. Always verify important decisions.</p>
      </div>
    </aside>
  );
}
