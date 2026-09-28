import { useEffect, useRef } from "react";

export function Modal({ open, onClose, title, children, footer }) {
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocusedRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey);
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-graphite/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card border border-rule bg-paper p-6 outline-none shadow-2xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-ink-2">
          {children}
        </div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
