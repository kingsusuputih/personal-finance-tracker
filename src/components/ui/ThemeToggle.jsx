import { useTheme } from "../../theme/ThemeProvider.jsx";
import { useT } from "../../i18n/LanguageProvider.jsx";

export function ThemeToggle({ className = "", showLabels = false }) {
  const { theme, setTheme } = useTheme();
  const t = useT();

  const options = [
    {
      value: "system",
      labelKey: "theme.system",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      value: "light",
      labelKey: "theme.light",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ),
    },
    {
      value: "dark",
      labelKey: "theme.dark",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="group"
      aria-label={t("theme.title")}
      className={`inline-flex h-7 items-center rounded-btn border border-rule-2 p-0.5 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setTheme(opt.value)}
          aria-pressed={theme === opt.value}
          title={t(opt.labelKey)}
          className={`flex h-full items-center justify-center gap-1 rounded-sm px-2 text-[10px] transition-colors duration-(--dur-fast) ${
            theme === opt.value
              ? "bg-accent text-accent-ink"
              : "text-ink-3 hover:text-ink"
          }`}>
          {opt.icon}
          {showLabels && <span className="kbd text-[10px]">{t(opt.labelKey)}</span>}
        </button>
      ))}
    </div>
  );
}
