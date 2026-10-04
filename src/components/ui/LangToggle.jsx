import { useI18n } from "../../i18n/LanguageProvider.jsx";

export function LangToggle({ className = "" }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex h-7 items-center rounded-btn border border-rule-2 p-0.5 ${className}`}>
      {["en", "id"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`kbd flex h-full items-center justify-center rounded-sm px-2 text-[10px] transition-colors duration-(--dur-fast) ${
            lang === code
              ? "bg-accent text-accent-ink"
              : "text-ink-3 hover:text-ink"
          }`}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
