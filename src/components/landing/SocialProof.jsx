import { useEffect, useRef, useState } from "react";
import { fetchCommunityProof } from "../../api/registry.js";
import { useI18n } from "../../i18n/LanguageProvider.jsx";

export function SocialProof({ onCountLoaded }) {
  const { t } = useI18n();
  const [recentList, setRecentList] = useState([]);
  const [activeToast, setActiveToast] = useState(null);
  const toastIndexRef = useRef(0);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { userCount, recent } = await fetchCommunityProof();
      if (!mounted) return;
      if (typeof userCount === "number" && onCountLoaded) {
        onCountLoaded(userCount);
      }
      if (recent && recent.length > 0) {
        setRecentList(recent);
      }
    }

    load();

    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        load();
      }
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, [onCountLoaded]);

  useEffect(() => {
    if (!recentList.length) return;

    function showNext() {
      if (document.hidden) return;
      const item = recentList[toastIndexRef.current % recentList.length];
      toastIndexRef.current += 1;
      if (item && item.maskedName) {
        setActiveToast(item.maskedName);
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setActiveToast(null);
        }, 7000);
      }
    }

    const initialTimer = setTimeout(showNext, 4000);
    const rotationInterval = setInterval(showNext, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(rotationInterval);
      clearTimeout(hideTimerRef.current);
    };
  }, [recentList]);

  if (!activeToast) return null;

  return (
    <aside
      aria-live="polite"
      role="status"
      className="pointer-events-auto fixed bottom-5 left-5 z-40 max-w-[calc(100vw-2.5rem)] sm:max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-[#EAE6F8] bg-white/95 backdrop-blur-md px-4 py-3 text-left shadow-[0_12px_32px_-8px_rgba(84,52,237,0.18)]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] text-xs font-bold text-[#5434ED]">
          ✓
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#5434ED]">
            {t("landing.toastTag")}
          </p>
          <p className="truncate text-xs font-semibold text-[#14131B]">
            {t("landing.joinedToast", { name: activeToast })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveToast(null)}
          aria-label={t("common.cancel")}
          className="shrink-0 rounded p-1 text-[#8F8B9F] transition-colors hover:text-[#14131B] hover:bg-black/5">
          ✕
        </button>
      </div>
    </aside>
  );
}

export function UserCountBadge({ count }) {
  const { t, lang } = useI18n();
  if (typeof count !== "number" || count <= 0) return null;

  const formattedCount = new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(count);

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#EAE6F8] bg-white px-3.5 py-1 text-xs text-[#5D5A6F] shadow-sm">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>{t("landing.userCount", { count: formattedCount })}</span>
    </div>
  );
}
