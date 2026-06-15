import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Only bundle English in the main bundle
import en from "./locales/en.json";

const supported = [
  "en","es","es-419","fr","de","pt","pt-br","it","nl","pl","ru","uk",
  "tr","sv","da","nb","fi","cs","sk","ro","hu","bg","el","hr","bs",
  "sr","mk","sl","sq","lb","lt","lv","et","id","ms","tl","ja","ko",
  "zh","zh-hans","zh-hant","yue","ar","he","fa","ur","ps","prs","hi",
  "bn","pa","gu","mr","ta","te","ml","as","bho","mai","gom","sa","ne",
  "my","th","vi","jv","su","ace","ceb","pam","pag","ka","hy","az","kk",
  "ky","uz","tg","tk","mn","be","ba","tt","kmr","ckb","eu","ca","gl",
  "an","oc","br","cy","ga","mt","is","af","sw","ha","ig","xh","zu",
  "st","tn","ts","ln","mg","wo","om","mi","ht","gn","qu","ay","la",
  "eo","yi","lmo","scn",
];

const saved = localStorage.getItem("lang") ?? navigator.language.split("-")[0];
const lng = supported.includes(saved) ? saved : "en";

// Load language files from public assets (not bundled)
async function loadLanguage(lang: string) {
  if (lang === "en") return en;
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) throw new Error(`Failed to load ${lang}`);
    return await response.json();
  } catch (e) {
    console.warn(`Failed to load language: ${lang}`, e);
    return en;
  }
}

// Initialize with English only
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Load the current language if not English
if (lng !== "en") {
  loadLanguage(lng).then((translation) => {
    i18n.addResourceBundle(lng, "translation", translation, true, true);
    i18n.changeLanguage(lng);
  });
}

// Setup lazy loading for language changes
i18n.on("languageChanged", (lang: string) => {
  if (lang !== "en" && !i18n.hasResourceBundle(lang, "translation")) {
    loadLanguage(lang).then((translation) => {
      i18n.addResourceBundle(lang, "translation", translation, true, true);
      i18n.changeLanguage(lang);
    });
  }
});

export default i18n;
