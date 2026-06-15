export default function VisaHeader({ t }: { t: (k: string) => string }) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-semibold text-foreground mb-2">{t("visa_finder.title")}</h1>
      <p className="text-muted-foreground">{t("visa_finder.subtitle")}</p>
    </div>
  );
}
