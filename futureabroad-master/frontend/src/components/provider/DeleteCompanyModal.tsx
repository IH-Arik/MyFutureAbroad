import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Provider, ProviderMember } from "@/lib/types";

export default function DeleteCompanyModal({
  open,
  onClose,
  provider,
  providerId,
  membership,
}: {
  open: boolean;
  onClose: () => void;
  provider: (Provider & { join_code?: string }) | null;
  providerId?: string | undefined;
  membership: ProviderMember | null | false;
}) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function deleteProvider() {
    if (!providerId || !membership || membership.role !== "owner") {
      addToast(t("provider.delete_permission_denied") || "You don't have permission to delete this company", "error");
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("providers")
        .delete()
        .eq("id", providerId);

      if (error) throw error;

      addToast(t("provider.company_deleted") || "Company deleted successfully", "success");
      onClose();
      navigate("/provider");
    } catch (err) {
      addToast(`Failed to delete company: ${(err as Error).message}`, "error");
    } finally {
      setDeleting(false);
      setDeleteConfirmation("");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => !deleting && onClose()}>
      <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-destructive">{t("provider.delete_company_title") || "Delete Company"}</h2>
          <button
            onClick={() => !deleting && onClose()}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("provider.delete_company_warning") || "This will permanently delete your company and all associated data including orders, services, and messages. This action cannot be undone."}
          </p>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
              {t("provider.delete_company_confirm_text") || "Type the company name to confirm deletion:"}
            </p>
            <p className="text-xs font-mono text-foreground mt-1 font-semibold">{provider?.company_name}</p>
          </div>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder={t("provider.delete_confirmation_placeholder") || "Type company name to confirm"}
            className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:bg-[#2a2a2a]"
            disabled={deleting}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="cursor-pointer"
            disabled={deleting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={deleteProvider}
            disabled={deleteConfirmation !== provider?.company_name || deleting}
            className="cursor-pointer"
          >
            {deleting ? t("common.deleting") || "Deleting..." : t("provider.delete_confirm_btn") || "Delete Company"}
          </Button>
        </div>
      </div>
    </div>
  );
}
