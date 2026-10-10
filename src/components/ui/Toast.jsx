import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useT } from "../../i18n/LanguageProvider.jsx";

const ToastContext = createContext(null);
let nextId = 0;

const toneStyles = {
  success: "border-l-success",
  error: "border-l-danger",
  warning: "border-l-warning",
  info: "border-l-accent",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});
  const t = useT();

  const toneLabels = {
    success: t("toast.saved"),
    error: t("toast.error"),
    warning: t("toast.warning") || "Warning",
    info: t("toast.note"),
  };

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, tone) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, message, tone }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      warning: (m) => push(m, "warning"),
      info: (m) => push(m, "info"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed top-[max(1.25rem,env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-[60] mx-auto flex w-full max-w-sm px-4 flex-col items-center gap-2">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto flex w-full items-start gap-2 rounded-card border border-rule-2 border-l-4 bg-paper/95 dark:bg-paper/90 backdrop-blur-md px-4 py-3 text-left text-sm text-ink-2 shadow-xl transition-all duration-(--dur-base) ease-out hover:-translate-y-px animate-in fade-in slide-in-from-top-3 ${toneStyles[t.tone]}`}>
            <span className="kbd mt-0.5 shrink-0 text-[10px] text-ink-3">
              {toneLabels[t.tone]}
            </span>
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
              {t.message}
            </span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
