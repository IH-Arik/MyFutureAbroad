import type React from "react";
import { Button } from "@/components/ui/button";

const CreateBusinessFormActions: React.FC<any> = ({ saving, validatingKey, keyIsValid, onCancel, t }) => {
  return (
    <div className="flex gap-3 pt-1">
      <Button type="submit" disabled={saving || validatingKey || !keyIsValid} className="h-10 rounded-lg font-medium">{saving ? t("common.creating") : validatingKey ? t("common.verifying") : t("provider.create_business_btn")}</Button>
      <Button type="button" variant="outline" onClick={onCancel} className="h-10 rounded-lg">{t("common.cancel")}</Button>
    </div>
  );
};

export default CreateBusinessFormActions;
