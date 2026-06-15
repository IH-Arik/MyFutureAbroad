import type React from "react";
import { Button } from "@/components/ui/button";

const ServiceFormActions: React.FC<any> = ({ saving, service, onClose, t }) => {
  return (
    <div className="flex gap-3 pt-1">
      <Button type="submit" disabled={saving} className="h-10 rounded-lg font-medium">
        {saving ? t("common.saving") : service ? t("common.save") : t("provider.create_service")}
      </Button>
      <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-lg">{t("common.cancel")}</Button>
    </div>
  );
};

export default ServiceFormActions;
