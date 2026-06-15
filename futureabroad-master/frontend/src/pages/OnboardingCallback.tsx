import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/Toast";

/**
 * Handles Stripe onboarding callback and redirects to provider dashboard
 */
export const OnboardingCallback: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const providerId = searchParams.get("providerId");
    const status = searchParams.get("status");

    if (!providerId) {
      addToast("Invalid callback: missing provider ID", "error");
      navigate("/provider");
      return;
    }

    if (status === "complete") {
      addToast(t("onboarding.success"), "success");
      navigate(`/provider/${providerId}?tab=overview`);
    } else if (status === "error") {
      addToast(t("onboarding.error"), "error");
      navigate(`/provider/${providerId}?tab=overview`);
    } else {
      navigate(`/provider/${providerId}?tab=overview`);
    }
  }, [searchParams, navigate, addToast, t]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">{t("onboarding.completing")}</p>
      </div>
    </div>
  );
};
