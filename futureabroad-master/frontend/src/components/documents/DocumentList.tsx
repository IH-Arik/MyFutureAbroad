import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type Doc = any;

type Props = {
  documents: Doc[];
  isUnlocked: boolean;
  isDecryptingId: string | null;
  downloadAndDecryptFile: (d: Doc) => Promise<void>;
  openEditModal: (d: Doc) => void;
};

export default function DocumentList({ documents, isUnlocked, isDecryptingId, downloadAndDecryptFile, openEditModal }: Props) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-border/50 bg-white p-8 text-center dark:bg-[#1f1f1f]">
      {documents.length === 0 ? (
        <p className="text-muted-foreground">{t("documents.empty")}</p>
      ) : (
        <div className="space-y-4">
          {documents.map((d) => (
            <div key={d.id} className="flex justify-between items-center text-left p-4 border rounded hover:border-primary/50 transition">
              <div>
                <h3 className="font-medium text-lg">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.document_categories?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => downloadAndDecryptFile(d)} disabled={!isUnlocked || isDecryptingId === d.id} className="cursor-pointer">
                  {isDecryptingId === d.id ? t("documents.decrypting") : t("documents.view")}
                </Button>
                <Button variant="outline" onClick={() => openEditModal(d)} className="cursor-pointer">
                  {t("common.edit")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
