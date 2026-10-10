import { useT } from "../../i18n/LanguageProvider.jsx";
import { DONATE_URL } from "../../constants/donate.js";

function HeartIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function FloatingSupport() {
  const t = useT();

  return (
    <aside aria-label="Support Project" className="fixed bottom-5 right-5 z-40 select-none">
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("floating.supportTitle")}
        className="group flex items-center gap-2.5 rounded-full border border-rule/80 bg-paper/95 dark:bg-paper/90 px-3.5 py-2 text-xs font-semibold text-ink shadow-lg backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-accent/40 hover:text-accent">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
          <HeartIcon className="h-3.5 w-3.5" />
        </span>
        <div className="flex flex-col text-left pr-0.5">
          <span className="text-[11px] font-bold leading-tight tracking-tight text-ink group-hover:text-accent transition-colors">
            {t("floating.supportBadge")}
          </span>
          <span className="text-[9px] text-ink-3 hidden sm:inline leading-none mt-0.5">
            {t("floating.supportSubtitle")}
          </span>
        </div>
        <span className="text-ink-3 text-[11px] group-hover:text-accent transition-transform group-hover:translate-x-0.5 font-mono">
          ↗
        </span>
      </a>
    </aside>
  );
}
