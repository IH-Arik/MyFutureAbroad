import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/auth-context";
import { useTranslation } from "react-i18next";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none dark:bg-[#2a2a2a]";

interface BankAccountFormProps {
  providerId: string;
  onUpdate?: () => void;
}

export const BankAccountForm: React.FC<BankAccountFormProps> = ({ providerId, onUpdate }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountHolderName.trim() || !accountNumber.trim() || !routingNumber.trim()) {
      addToast("Please fill in all bank account fields", "error");
      return;
    }

    if (!user?.id) {
      addToast("User not authenticated", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/providers/${providerId}/bank-account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          accountHolderName,
          accountNumber,
          routingNumber,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save bank account");
      }

      addToast("Bank account saved successfully", "success");
      setAccountHolderName("");
      setAccountNumber("");
      setRoutingNumber("");
      onUpdate?.();
    } catch (err) {
      addToast(`Failed to save bank account: ${(err as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("bank.account_holder_name")} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          placeholder={t("bank.account_holder_placeholder")}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("bank.account_number")} <span className="text-destructive">*</span>
        </label>
        <input
          type="password"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="••••••••••••••••"
          required
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {t("bank.account_secure")}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("bank.routing_number")} <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={routingNumber}
          onChange={(e) => setRoutingNumber(e.target.value)}
          placeholder="021000021"
          required
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={saving} className="h-10 rounded-lg">
        {saving ? t("common.saving") : t("bank.save_btn")}
      </Button>
    </form>
  );
};
