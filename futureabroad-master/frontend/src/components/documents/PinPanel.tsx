import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  hasDbKeys: boolean;
  pin: string;
  setPin: (s: string) => void;
  isProcessingKeys: boolean;
  attemptKeyUnlock: () => Promise<void>;
  attemptKeySetup: () => Promise<void>;
};

export default function PinPanel({ hasDbKeys, pin, setPin, isProcessingKeys, attemptKeyUnlock, attemptKeySetup }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 rounded-lg border border-border/50 bg-white p-8 dark:bg-[#1f1f1f]">
      <h2 className="text-xl font-semibold mb-4">{hasDbKeys ? t("documents.unlock_title") : t("documents.setup_title")}</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        {hasDbKeys ? t("documents.unlock_desc") : t("documents.setup_desc")}
      </p>
      <div className="flex gap-4 max-w-sm flex-col">
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder={hasDbKeys ? t("documents.pin_placeholder") : t("documents.pin_new_placeholder")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        />
        <Button onClick={hasDbKeys ? attemptKeyUnlock : attemptKeySetup} disabled={isProcessingKeys || !pin}>
          {isProcessingKeys ? t("common.processing") : (hasDbKeys ? t("documents.unlock_btn") : t("documents.setup_btn"))}
        </Button>
      </div>
    </div>
  );
}
