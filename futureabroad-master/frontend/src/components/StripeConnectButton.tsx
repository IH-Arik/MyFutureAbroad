import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toast";
import { getStripeOnboardingUrl, getStripeAccountStatus } from "@/lib/api";
import type { StripeAccountStatus } from "@/lib/api";
import { useTranslation } from "react-i18next";

interface StripeConnectButtonProps {
  userId: string;
  providerId: string;
  onStatusChange?: (status: StripeAccountStatus) => void;
}

export const StripeConnectButton: React.FC<StripeConnectButtonProps> = ({
  userId: _userId,
  providerId,
  onStatusChange,
}) => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<StripeAccountStatus | null>(null);

  // Check status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const accountStatus = await getStripeAccountStatus(providerId);
      setStatus(accountStatus);
      onStatusChange?.(accountStatus);
    } catch (err) {
      console.error("Failed to check Stripe status:", err);
      setStatus({ status: "not_connected", charges_enabled: false, payouts_enabled: false });
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const onboardingUrl = await getStripeOnboardingUrl(providerId);
      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch (err) {
      addToast(`Failed to start onboarding: ${(err as Error).message}`, "error");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (status?.status === "connected") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            {t("stripe.connected")}
          </span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• {t("stripe.charges_enabled")}: {status.charges_enabled ? "✓" : "✗"}</p>
          <p>• {t("stripe.payouts_enabled")}: {status.payouts_enabled ? "✓" : "✗"}</p>
        </div>
        {status.requirements?.currently_due && status.requirements.currently_due.length > 0 ? (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">{t("stripe.action_required")}</p>
            <p>{t("stripe.complete_requirements")}</p>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="mt-2 text-amber-700 dark:text-amber-300 hover:underline font-medium"
            >
              {t("stripe.continue_setup")}
            </button>
          </div>
        ) : (
          <div className="pt-2">
            <Button
              onClick={handleConnect}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? t("stripe.redirecting") : t("stripe.manage")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="h-10 rounded-lg w-full sm:w-auto"
    >
      {loading ? t("stripe.redirecting") : t("stripe.connect")}
    </Button>
  );
};
