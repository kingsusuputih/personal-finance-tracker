import { useState } from "react";
import { useI18n } from "../../i18n/LanguageProvider.jsx";
import { useTheme } from "../../theme/ThemeProvider.jsx";
import { ThemeToggle } from "../ui/ThemeToggle.jsx";
import { LangToggle } from "../ui/LangToggle.jsx";

export function FloatingPreferences() {
  const { lang } = useI18n();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="Preferences"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 select-none">
      <div
        className={`flex items-center rounded-l-2xl border border-r-0 border-rule bg-paper/95 dark:bg-paper/90 backdrop-blur-md shadow-xl transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 p-4 shadow-2xl border-rule-2 ring-1 ring-accent/15"
            : "translate-x-0.5 hover:translate-x-0 py-3.5 px-2.5 cursor-pointer hover:shadow-2xl"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}>
        {/* Collapsed Pill View */}
        {!isOpen ? (
          <div className="flex flex-col items-center gap-2.5 text-ink-2">
            <span className="text-[10px] font-bold text-accent font-brand py-0.5">
              {lang.toUpperCase()}
            </span>
            <div className="h-px w-3.5 bg-rule" />
            <span className="text-ink-3">
              {theme === "dark" ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : theme === "light" ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
            </span>
            <span className="text-[9px] font-bold text-ink-3 transition-transform duration-200">
              ‹
            </span>
          </div>
        ) : (
          /* Expanded Panel View */
          <div
            className="flex flex-col items-start gap-3 w-44 animate-in fade-in slide-in-from-right-3 duration-200"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between w-full border-b border-rule pb-1.5 mb-0.5">
              <span className="text-[10px] font-bold tracking-wider text-ink uppercase font-brand">
                {lang === "id" ? "Pengaturan" : "Preferences"}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-ink-3 hover:text-ink leading-none px-1 py-0.5 rounded transition-colors"
                title="Tutup">
                ✕
              </button>
            </div>

            <div className="flex flex-col items-start gap-1 w-full">
              <span className="text-[9px] font-semibold text-ink-3 uppercase tracking-wider">
                {lang === "id" ? "Tema" : "Theme"}
              </span>
              <ThemeToggle className="w-full" />
            </div>

            <div className="flex flex-col items-start gap-1 w-full">
              <span className="text-[9px] font-semibold text-ink-3 uppercase tracking-wider">
                {lang === "id" ? "Bahasa" : "Language"}
              </span>
              <LangToggle className="w-full justify-center" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
