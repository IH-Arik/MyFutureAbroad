import { HugeiconsIcon } from "@hugeicons/react";
import { AlertDiamondIcon } from "@hugeicons/core-free-icons";

export default function AIWarningBanner({ onAccept, accepted }: { onAccept: () => void; accepted: boolean }) {
  if (accepted) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl sm:rounded-3xl border border-amber-300 dark:border-amber-600 shadow-2xl max-w-lg w-full p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 shrink-0">
            <HugeiconsIcon icon={AlertDiamondIcon} className="h-5 sm:h-6 w-5 sm:w-6" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">AI Assistant Warning</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Please read before continuing</p>
          </div>
        </div>
        <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-6">
          <p>
            <strong>This AI assistant can make mistakes.</strong> Always verify important information (visa requirements, costs, legal advice) with official sources.
          </p>
          <p>
            <strong className="text-red-600 dark:text-red-400">Data modification risk:</strong> This AI has the ability to <em>add, edit, and update</em> your personal checklists and budgets directly. Once changes are made they may be difficult to reverse.
          </p>
          <p>
            By continuing you acknowledge that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>AI responses may be inaccurate or outdated</li>
            <li>The AI may modify your checklist and budget data</li>
            <li>You are solely responsible for any resulting data loss</li>
            <li>This is not legal, financial, or immigration advice</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="cursor-pointer flex-1 bg-[#1f4865] hover:bg-[#1a3d56] text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-colors text-sm sm:text-base"
          >
            I understand, continue
          </button>
        </div>
      </div>
    </div>
  );
}
