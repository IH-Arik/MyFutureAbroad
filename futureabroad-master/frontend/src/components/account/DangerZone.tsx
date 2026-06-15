import { Button } from "@/components/ui/button";

export default function DangerZone({ onDelete, loading, t }: { onDelete: () => void; loading: boolean; t: (k: string) => string; }) {
  return (
    <div className="bg-destructive/10 dark:bg-destructive/5 p-6 rounded-lg border border-destructive/20 shadow-sm">
      <h2 className="text-xl font-semibold text-destructive mb-2">{t("account.danger_title")}</h2>
      <p className="text-sm text-destructive/90 mb-4">{t("account.danger_desc")}</p>
      <Button
        variant="destructive"
        onClick={onDelete}
        disabled={loading}
        className="cursor-pointer"
      >
        {t("account.delete_account")}
      </Button>
    </div>
  );
}
