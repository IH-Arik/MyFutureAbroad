import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatWindow from "@/components/chats/ChatWindow";
import { useAuth } from "@/components/auth-context";
import { supabase } from "@/lib/supabase";
import SessionList from "@/components/chats/SessionList";
import AIWarningBanner from "@/components/chats/AIWarningBanner";
import { markdownComponents } from "@/components/chats/ChatMarkdownRenderers";

// Presentational markdown renderers and small chat helpers moved to components.

const TOOL_LABELS: Record<string, string> = {
  get_countries: "Looking up countries…",
  get_visas: "Fetching visa options…",
  get_visa_details: "Loading visa details…",
  get_services: "Searching services…",
  create_checklist: "Creating checklist…",
  update_checklist: "Updating checklist…",
  get_user_checklists: "Loading your checklists…",
  get_checklist_items: "Fetching checklist items…",
  update_checklist_item: "Updating checklist item…",
  create_checklist_item: "Adding checklist item…",
  create_budget: "Creating budget…",
  update_budget: "Updating budget…",
  get_user_budgets: "Loading your budgets…",
  get_budget_items: "Fetching budget items…",
  update_budget_item: "Updating budget item…",
  create_budget_item: "Adding budget item…",
};

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatsPageContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const feature = searchParams.get("feature") || "general";

  const [warningAccepted, setWarningAccepted] = useState(() =>
    localStorage.getItem("ai_chat_warning_accepted") === "true"
  );

  function acceptWarning() {
    localStorage.setItem("ai_chat_warning_accepted", "true");
    setWarningAccepted(true);
  }

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const filteredSessions = useMemo(() => {
    if (feature === "budget") {
      return sessions.filter((s) => s.title.startsWith("Budget:"));
    } else if (feature === "checklist") {
      return sessions.filter((s) => s.title.startsWith("Checklist:"));
    } else if (feature === "visa_finder") {
      return sessions.filter((s) => s.title.startsWith("VisaFinder:"));
    } else {
      return sessions.filter(
        (s) =>
          s.title.startsWith("Chatbot:") ||
          (!s.title.startsWith("Budget:") &&
            !s.title.startsWith("Checklist:") &&
            !s.title.startsWith("VisaFinder:"))
      );
    }
  }, [sessions, feature]);

  const budgetSuggestions = [
    "Help me build a budget for moving to Portugal",
    "I want to estimate my relocation costs to Spain",
    "Build a budget for a digital nomad visa in Italy",
    "What is the cost of living in Germany?",
  ];

  const checklistSuggestions = [
    "Help me create a checklist for moving to Portugal",
    "I need a relocation checklist for Spain",
    "Build a checklist for moving to Germany",
    "What are the steps to move to Italy?",
  ];

  const visaFinderSuggestions = [
    "What visas do I qualify for in Portugal?",
    "Help me find a visa for Spain based on remote work",
    "What are the digital nomad options in Europe?",
    "Can I retire in Italy? What visas are available?",
  ];

  const chatbotSuggestions = [
    "What is the best way to plan a relocation?",
    "How do I choose the right country to move to?",
    "How do I manage my checklist and budget with AI?",
    "What services can help me move abroad?",
  ];
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/signup", { replace: true });
  }, [loading, user, navigate]);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) return;

    const res = await fetch("/api/chat/sessions", {
      headers: { "x-user-id": user.id, "x-user-token": token },
    });
    if (res.ok) {
      const data: ChatSession[] = await res.json();
      setSessions(data);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadSessions();
  }, [user, loadSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function openSession(sessionId: string) {
    if (!user) return;
    setLoadingSession(true);
    setActiveSessionId(sessionId);
    setMessages([]);
    setMobileHistoryOpen(false);

    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) { setLoadingSession(false); return; }

    const res = await fetch(`/api/chat/sessions/${sessionId}`, {
      headers: { "x-user-id": user.id, "x-user-token": token },
    });
    if (res.ok) {
      const { messages: msgs } = await res.json();
      setMessages(msgs ?? []);
    }
    setLoadingSession(false);
  }

  function newChat() {
    setActiveSessionId(null);
    setMessages([]);
    setInput("");
    setMobileHistoryOpen(false);
    textareaRef.current?.focus();
  }

  function confirmDeleteSession(sessionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteConfirm(sessionId);
  }

  async function performDeleteSession(sessionId: string) {
    if (!user) return;
    setDeleting(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return;

      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id, "x-user-token": token },
      });

      if (activeSessionId === sessionId) newChat();
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || sending || !user) return;

    setSending(true);

    const currentSessionId = activeSessionId;

    const tempUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInput("");

    const thinkingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, role: "assistant", content: "__thinking__", created_at: new Date().toISOString() },
    ]);

    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      if (feature === "budget") {
        const res = await fetch("/api/chat/budget", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-token": token,
          },
          body: JSON.stringify({ sessionId: currentSessionId, message: trimmed }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const data = await res.json() as { sessionId: string; stage: string; message: string };

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId ? { ...m, content: data.message } : m
          )
        );

        if (data.sessionId && data.sessionId !== currentSessionId) {
          setActiveSessionId(data.sessionId);
          // Optimistically add the new session to the sidebar immediately
          setSessions((prev) => {
            const alreadyExists = prev.some((s) => s.id === data.sessionId);
            if (alreadyExists) return prev;
            const title = `Budget: ${trimmed.length > 50 ? trimmed.slice(0, 47) + "..." : trimmed}`;
            const now = new Date().toISOString();
            return [{ id: data.sessionId, title, created_at: now, updated_at: now }, ...prev];
          });
          // Then reload to get the real title from the server
          loadSessions();
        } else if (data.sessionId && data.sessionId === currentSessionId) {
          // Update updated_at on existing session to bubble it to top
          setSessions((prev) =>
            prev.map((s) =>
              s.id === data.sessionId ? { ...s, updated_at: new Date().toISOString() } : s
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          );
        }
      } else if (feature === "checklist") {
        const res = await fetch("/api/chat/checklist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-token": token,
          },
          body: JSON.stringify({ sessionId: currentSessionId, message: trimmed }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const data = await res.json() as { sessionId: string; stage: string; message: string };

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId ? { ...m, content: data.message } : m
          )
        );

        if (data.sessionId && data.sessionId !== currentSessionId) {
          setActiveSessionId(data.sessionId);
          // Optimistically add the new session to the sidebar immediately
          setSessions((prev) => {
            const alreadyExists = prev.some((s) => s.id === data.sessionId);
            if (alreadyExists) return prev;
            const title = `Checklist: ${trimmed.length > 50 ? trimmed.slice(0, 47) + "..." : trimmed}`;
            const now = new Date().toISOString();
            return [{ id: data.sessionId, title, created_at: now, updated_at: now }, ...prev];
          });
          // Then reload to get the real title from the server
          loadSessions();
        } else if (data.sessionId && data.sessionId === currentSessionId) {
          // Update updated_at on existing session to bubble it to top
          setSessions((prev) =>
            prev.map((s) =>
              s.id === data.sessionId ? { ...s, updated_at: new Date().toISOString() } : s
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          );
        }
      } else if (feature === "visa_finder") {
        const res = await fetch("/api/chat/visa-finder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-token": token,
          },
          body: JSON.stringify({ sessionId: currentSessionId, message: trimmed }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const data = await res.json() as { sessionId: string; stage: string; message: string };

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId ? { ...m, content: data.message } : m
          )
        );

        if (data.sessionId && data.sessionId !== currentSessionId) {
          setActiveSessionId(data.sessionId);
          // Optimistically add the new session to the sidebar immediately
          setSessions((prev) => {
            const alreadyExists = prev.some((s) => s.id === data.sessionId);
            if (alreadyExists) return prev;
            const title = `VisaFinder: ${trimmed.length > 50 ? trimmed.slice(0, 47) + "..." : trimmed}`;
            const now = new Date().toISOString();
            return [{ id: data.sessionId, title, created_at: now, updated_at: now }, ...prev];
          });
          // Then reload to get the real title from the server
          loadSessions();
        } else if (data.sessionId && data.sessionId === currentSessionId) {
          // Update updated_at on existing session to bubble it to top
          setSessions((prev) =>
            prev.map((s) =>
              s.id === data.sessionId ? { ...s, updated_at: new Date().toISOString() } : s
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          );
        }
      } else {
        const res = await fetch("/api/chat/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            "x-user-token": token,
          },
          body: JSON.stringify({ sessionId: currentSessionId, message: trimmed }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const data = await res.json() as { sessionId: string; message: string; redirect: string | null };

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId ? { ...m, content: data.message } : m
          )
        );

        if (data.redirect) {
          setTimeout(() => {
            navigate(data.redirect!);
          }, 1500);
        }

        if (data.sessionId && data.sessionId !== currentSessionId) {
          setActiveSessionId(data.sessionId);
          // Optimistically add the new session to the sidebar immediately
          setSessions((prev) => {
            const alreadyExists = prev.some((s) => s.id === data.sessionId);
            if (alreadyExists) return prev;
            const title = `Chatbot: ${trimmed.length > 50 ? trimmed.slice(0, 47) + "..." : trimmed}`;
            const now = new Date().toISOString();
            return [{ id: data.sessionId, title, created_at: now, updated_at: now }, ...prev];
          });
          // Then reload to get the real title from the server
          loadSessions();
        } else if (data.sessionId && data.sessionId === currentSessionId) {
          // Update updated_at on existing session to bubble it to top
          setSessions((prev) =>
            prev.map((s) =>
              s.id === data.sessionId ? { ...s, updated_at: new Date().toISOString() } : s
            ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          );
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      const message = err instanceof DOMException && err.name === "AbortError"
        ? "Chat request timed out after 30 seconds"
        : `Sorry, something went wrong: ${errorMsg}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId ? { ...m, content: message } : m
        )
      );
    } finally {
      setSending(false);
      setToolStatus(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  }

  const handleSuggestionClick = useCallback((text: string) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, []);

  if (loading) return null;

  return (
    <>
      <AIWarningBanner accepted={warningAccepted} onAccept={acceptWarning} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-sm w-full p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">Delete chat?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete this chat session and all its messages. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => performDeleteSession(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100dvh-80px)] sm:h-[calc(100dvh-100px)] overflow-hidden p-2 sm:p-4 lg:p-6">
        <div className="flex h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
          <SessionList
            sessions={filteredSessions}
            activeSessionId={activeSessionId}
            openSession={openSession}
            confirmDeleteSession={confirmDeleteSession}
            newChat={newChat}
            mobileHistoryOpen={mobileHistoryOpen}
            setMobileHistoryOpen={setMobileHistoryOpen}
          />

          <ChatWindow
            messages={messages}
            loadingSession={loadingSession}
            messagesEndRef={messagesEndRef}
            input={input}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            textareaRef={textareaRef}
            sending={sending}
            sendMessage={sendMessage}
            mobileHistoryOpen={mobileHistoryOpen}
            setMobileHistoryOpen={setMobileHistoryOpen}
            toolStatus={toolStatus}
            TOOL_LABELS={TOOL_LABELS}
            markdownComponents={markdownComponents}
            suggestions={
              feature === "budget"
                ? budgetSuggestions
                : feature === "checklist"
                ? checklistSuggestions
                : feature === "visa_finder"
                ? visaFinderSuggestions
                : chatbotSuggestions
            }
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>
    </>
  );
}
