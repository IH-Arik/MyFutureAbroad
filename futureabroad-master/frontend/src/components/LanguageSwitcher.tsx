import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en",      label: "English",                flag: "🇬🇧" },
  { code: "es",      label: "Español",                flag: "🇪🇸" },
  { code: "es-419",  label: "Español (Latinoamérica)", flag: "" },
  { code: "fr",      label: "Français",               flag: "🇫🇷" },
  { code: "de",      label: "Deutsch",                flag: "🇩🇪" },
  { code: "pt",      label: "Português (PT)",         flag: "🇵🇹" },
  { code: "pt-br",   label: "Português (BR)",         flag: "🇧🇷" },
  { code: "it",      label: "Italiano",               flag: "🇮🇹" },
  { code: "nl",      label: "Nederlands",             flag: "🇳🇱" },
  { code: "pl",      label: "Polski",                 flag: "🇵🇱" },
  { code: "ru",      label: "Русский",                flag: "🇷🇺" },
  { code: "uk",      label: "Українська",             flag: "🇺🇦" },
  { code: "tr",      label: "Türkçe",                 flag: "🇹🇷" },
  { code: "sv",      label: "Svenska",                flag: "🇸🇪" },
  { code: "da",      label: "Dansk",                  flag: "🇩🇰" },
  { code: "nb",      label: "Norsk",                  flag: "🇳🇴" },
  { code: "fi",      label: "Suomi",                  flag: "🇫🇮" },
  { code: "cs",      label: "Čeština",                flag: "🇨🇿" },
  { code: "sk",      label: "Slovenčina",             flag: "🇸🇰" },
  { code: "ro",      label: "Română",                 flag: "🇷🇴" },
  { code: "hu",      label: "Magyar",                 flag: "🇭🇺" },
  { code: "bg",      label: "Български",              flag: "🇧🇬" },
  { code: "el",      label: "Ελληνικά",               flag: "🇬🇷" },
  { code: "hr",      label: "Hrvatski",               flag: "🇭🇷" },
  { code: "bs",      label: "Bosanski",               flag: "🇧🇦" },
  { code: "sr",      label: "Српски",                 flag: "🇷🇸" },
  { code: "mk",      label: "Македонски",             flag: "🇲🇰" },
  { code: "sl",      label: "Slovenščina",            flag: "🇸🇮" },
  { code: "sq",      label: "Shqip",                  flag: "🇦🇱" },
  { code: "lb",      label: "Lëtzebuergesch",         flag: "🇱🇺" },
  { code: "lt",      label: "Lietuvių",               flag: "🇱🇹" },
  { code: "lv",      label: "Latviešu",               flag: "🇱🇻" },
  { code: "et",      label: "Eesti",                  flag: "🇪🇪" },
  { code: "id",      label: "Bahasa Indonesia",       flag: "🇮🇩" },
  { code: "ms",      label: "Bahasa Melayu",          flag: "🇲🇾" },
  { code: "tl",      label: "Filipino",               flag: "🇵🇭" },
  { code: "ja",      label: "日本語",                  flag: "🇯🇵" },
  { code: "ko",      label: "한국어",                  flag: "🇰🇷" },
  { code: "zh",      label: "中文",                   flag: "🇨🇳" },
  { code: "zh-hans", label: "简体中文",                flag: "🇨🇳" },
  { code: "zh-hant", label: "繁體中文",                flag: "🇹🇼" },
  { code: "yue",     label: "粵語",                   flag: "🇭🇰" },
  { code: "ar",      label: "العربية",                flag: "🇸🇦" },
  { code: "he",      label: "עברית",                  flag: "🇮🇱" },
  { code: "fa",      label: "فارسی",                  flag: "🇮🇷" },
  { code: "ur",      label: "اردو",                   flag: "🇵🇰" },
  { code: "ps",      label: "پښتو",                   flag: "🇦🇫" },
  { code: "prs",     label: "دری",                    flag: "🇦🇫" },
  { code: "hi",      label: "हिन्दी",                 flag: "🇮🇳" },
  { code: "bn",      label: "বাংলা",                  flag: "🇧🇩" },
  { code: "pa",      label: "ਪੰਜਾਬੀ",                 flag: "🇮🇳" },
  { code: "gu",      label: "ગુજરાતી",                flag: "🇮🇳" },
  { code: "mr",      label: "मराठी",                  flag: "🇮🇳" },
  { code: "ta",      label: "தமிழ்",                  flag: "🇮🇳" },
  { code: "te",      label: "తెలుగు",                 flag: "🇮🇳" },
  { code: "ml",      label: "മലയാളം",                 flag: "🇮🇳" },
  { code: "as",      label: "অসমীয়া",                flag: "🇮🇳" },
  { code: "bho",     label: "Bhojpuri",               flag: "🇮🇳" },
  { code: "mai",     label: "Maithili",               flag: "🇮🇳" },
  { code: "gom",     label: "Konkani",                flag: "🇮🇳" },
  { code: "sa",      label: "संस्कृत",                flag: "🇮🇳" },
  { code: "ne",      label: "नेपाली",                 flag: "🇳🇵" },
  { code: "my",      label: "မြန်မာ",                 flag: "🇲🇲" },
  { code: "th",      label: "ภาษาไทย",                flag: "🇹🇭" },
  { code: "vi",      label: "Tiếng Việt",             flag: "🇻🇳" },
  { code: "jv",      label: "Basa Jawa",              flag: "🇮🇩" },
  { code: "su",      label: "Basa Sunda",             flag: "🇮🇩" },
  { code: "ace",     label: "Acehnese",               flag: "🇮🇩" },
  { code: "ceb",     label: "Cebuano",                flag: "🇵🇭" },
  { code: "pam",     label: "Kapampangan",            flag: "🇵🇭" },
  { code: "pag",     label: "Pangasinan",             flag: "🇵🇭" },
  { code: "ka",      label: "ქართული",                flag: "🇬🇪" },
  { code: "hy",      label: "Հայերեն",                flag: "🇦🇲" },
  { code: "az",      label: "Azərbaycan",             flag: "🇦🇿" },
  { code: "kk",      label: "Қазақша",                flag: "🇰🇿" },
  { code: "ky",      label: "Кыргызча",               flag: "🇰🇬" },
  { code: "uz",      label: "Oʻzbekcha",              flag: "🇺🇿" },
  { code: "tg",      label: "Тоҷикӣ",                 flag: "🇹🇯" },
  { code: "tk",      label: "Türkmençe",              flag: "🇹🇲" },
  { code: "mn",      label: "Монгол",                 flag: "🇲🇳" },
  { code: "be",      label: "Беларуская",             flag: "🇧🇾" },
  { code: "ba",      label: "Башҡортса",              flag: "🇷🇺" },
  { code: "tt",      label: "Татарча",                flag: "🇷🇺" },
  { code: "kmr",     label: "Kurdî (Kurmanji)",       flag: "" },
  { code: "ckb",     label: "کوردی (Sorani)",         flag: "" },
  { code: "eu",      label: "Euskara",                flag: "🇪🇸" },
  { code: "ca",      label: "Català",                 flag: "🇪🇸" },
  { code: "gl",      label: "Galego",                 flag: "🇪🇸" },
  { code: "an",      label: "Aragonés",               flag: "🇪🇸" },
  { code: "oc",      label: "Occitan",                flag: "🇫🇷" },
  { code: "br",      label: "Brezhoneg",              flag: "🇫🇷" },
  { code: "cy",      label: "Cymraeg",                flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "ga",      label: "Gaeilge",                flag: "🇮🇪" },
  { code: "mt",      label: "Malti",                  flag: "🇲🇹" },
  { code: "is",      label: "Íslenska",               flag: "🇮🇸" },
  { code: "af",      label: "Afrikaans",              flag: "🇿🇦" },
  { code: "sw",      label: "Kiswahili",              flag: "🇰🇪" },
  { code: "ha",      label: "Hausa",                  flag: "🇳🇬" },
  { code: "ig",      label: "Igbo",                   flag: "🇳🇬" },
  { code: "xh",      label: "isiXhosa",               flag: "🇿🇦" },
  { code: "zu",      label: "isiZulu",                flag: "🇿🇦" },
  { code: "st",      label: "Sesotho",                flag: "🇿🇦" },
  { code: "tn",      label: "Setswana",               flag: "🇧🇼" },
  { code: "ts",      label: "Xitsonga",               flag: "🇿🇦" },
  { code: "ln",      label: "Lingála",                flag: "🇨🇩" },
  { code: "mg",      label: "Malagasy",               flag: "🇲🇬" },
  { code: "wo",      label: "Wolof",                  flag: "🇸🇳" },
  { code: "om",      label: "Afaan Oromoo",           flag: "🇪🇹" },
  { code: "mi",      label: "Māori",                  flag: "🇳🇿" },
  { code: "ht",      label: "Kreyòl ayisyen",         flag: "🇭🇹" },
  { code: "gn",      label: "Guaraní",                flag: "🇵🇾" },
  { code: "qu",      label: "Quechua",                flag: "🇵🇪" },
  { code: "ay",      label: "Aymara",                 flag: "🇧🇴" },
  { code: "la",      label: "Latina",                 flag: "" },
  { code: "eo",      label: "Esperanto",              flag: "" },
  { code: "yi",      label: "יידיש",                  flag: "" },
  { code: "lmo",     label: "Lombard",                flag: "🇮🇹" },
  { code: "scn",     label: "Sicilianu",              flag: "🇮🇹" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const change = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded-full px-2 xl:px-3 py-1 xl:py-1.5 text-xs xl:text-sm font-medium text-muted-foreground hover:bg-muted dark:hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
          <span className="text-xs font-bold uppercase">{current.code.split("-")[0].toUpperCase()}</span>
          <svg
            className="size-3 opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 text-base max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => change(code)}
            className={cn(
              "cursor-pointer py-2 text-base gap-2",
              i18n.language === code && "bg-accent font-medium"
            )}
          >
            <span className="w-8 shrink-0 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {code.split("-")[0].toUpperCase()}
            </span>
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
