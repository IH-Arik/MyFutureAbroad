import type React from "react";
import ReactMarkdown from "react-markdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailSend01Icon, AiChat02Icon, SparklesIcon } from "@hugeicons/core-free-icons";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

interface Props {
  messages: ChatMessage[];
  loadingSession: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  sending: boolean;
  sendMessage: () => void;
  mobileHistoryOpen: boolean;
  setMobileHistoryOpen: (open: boolean) => void;
  toolStatus: string | null;
  TOOL_LABELS: Record<string, string>;
  markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"];
  suggestions?: string[];
  onSuggestionClick?: (text: string) => void;
}

function formatTime(ts?: string) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({
  messages,
  loadingSession,
  messagesEndRef,
  input,
  onInputChange,
  onKeyDown,
  textareaRef,
  sending,
  sendMessage,
  mobileHistoryOpen,
  setMobileHistoryOpen,
  toolStatus,
  TOOL_LABELS,
  markdownComponents,
  suggestions,
  onSuggestionClick,
}: Props) {
  const defaultSuggestions = [
    "What visas are available for Portugal?",
    "Show me my checklists",
    "What services are available for visa help?",
    "Summarise my budgets",
  ];
  const activeSuggestions = suggestions || defaultSuggestions;

  return (
    <main className="flex flex-1 flex-col min-w-0 bg-slate-50 dark:bg-[#141414] overflow-hidden relative">
      {mobileHistoryOpen && (
        <div className="md:hidden absolute inset-0 bg-black/30 z-40" onClick={() => setMobileHistoryOpen(false)} />
      )}

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2.5 sm:space-y-3">
        {messages.length === 0 && !loadingSession && (
          <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4 pb-24 sm:pb-20">
            <div className="mb-3 sm:mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-[#1f4865]/10 dark:bg-[#1f4865]/20">
              <HugeiconsIcon icon={SparklesIcon} className="h-6 sm:h-8 w-6 sm:w-8 text-[#1f4865] dark:text-[#5b9abf]" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-1.5 sm:mb-2">How can I help you?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-xs sm:max-w-sm">Ask me about visas, countries, services, or let me help manage your checklists and budgets.</p>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 max-w-xs sm:max-w-md">
              {activeSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                  className="cursor-pointer text-left text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1f1f1f] text-slate-700 dark:text-slate-300 hover:border-[#1f4865] dark:hover:border-[#5b9abf] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {loadingSession && (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 rounded-full border-2 border-[#1f4865] border-t-transparent animate-spin" />
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-1.5 sm:gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="mt-0.5 flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#1f4865]/10 dark:bg-[#1f4865]/20">
                <HugeiconsIcon icon={AiChat02Icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1f4865] dark:text-[#5b9abf]" strokeWidth={1.5} />
              </div>
            )}
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl sm:rounded-3xl px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed ${msg.role === "user" ? "bg-[#1f4865] text-white rounded-tr-none" : "bg-white dark:bg-[#1f1f1f] text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-white/10 rounded-tl-none"}`}>
              {msg.content === "__thinking__" ? (
                <div className="flex flex-col gap-1.5 sm:gap-2 py-0.5">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:300ms]" />
                  </div>
                  {toolStatus && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500">
                      <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-[#1f4865] dark:border-[#5b9abf] border-t-transparent animate-spin shrink-0" />
                      <span className="truncate">{TOOL_LABELS[toolStatus] ?? toolStatus.replace(/_/g, " ") + "…"}</span>
                    </div>
                  )}
                </div>
              ) : msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                  <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              <p className={`mt-1 text-xs ${msg.role === "user" ? "text-background/60" : "text-muted-foreground"}`}>{formatTime(msg.created_at)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 sm:px-6 py-1 sm:py-1.5 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-100 dark:border-amber-900/30">
        <p className="text-[9px] sm:text-[11px] text-amber-700 dark:text-amber-400 text-center">AI can make mistakes and may modify your data. Not legal or immigration advice.</p>
      </div>

      <div className="px-2.5 sm:px-4 pb-3 sm:pb-4 pt-2 bg-white dark:bg-[#181818] border-t border-slate-100 dark:border-white/10">
        <div className="flex items-end gap-2 sm:gap-3 max-w-3xl mx-auto">
          <button onClick={() => setMobileHistoryOpen(!mobileHistoryOpen)} className="md:hidden flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#1f4865] hover:text-white transition-colors" title="Chat history">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Ask about visas, countries…"
              disabled={sending}
              className="w-full resize-none rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1f1f] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1f4865]/40 disabled:opacity-50 transition-all"
              style={{ minHeight: "40px", maxHeight: "140px" }}
            />
          </div>

          <button onClick={sendMessage} disabled={sending || !input.trim()} className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-[#1f4865] text-white hover:bg-[#1a3d56] disabled:opacity-40 disabled:cursor-not-allowed transition-all" title="Send (Enter)">
            {sending ? (
              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <HugeiconsIcon icon={MailSend01Icon} className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            )}
          </button>
        </div>
        <p className="text-center text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-600 mt-1.5 sm:mt-2">⏎ send · shift+⏎ new line</p>
      </div>
    </main>
  );
}
