import { NavLink } from "react-router-dom";
import { useT } from "../../i18n/LanguageProvider.jsx";
import { LangToggle } from "../ui/LangToggle.jsx";

const items = [
  {
    to: "/dashboard",
    labelKey: "nav.dashboard",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/ledger",
    labelKey: "nav.ledger",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13" />
        <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const t = useT();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch justify-around gap-1 px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex h-16 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-btn px-2 text-[10px] font-medium transition-colors duration-(--dur-fast) ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-ink-3 hover:text-ink"
              }`
            }>
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-0.5 ${isActive ? "scale-105" : ""}`}>
                {item.icon}
                <span className="truncate">{t(item.labelKey)}</span>
              </span>
            )}
          </NavLink>
        ))}
        <div className="flex h-16 min-w-0 flex-1 items-center justify-center">
          <LangToggle />
        </div>
      </div>
    </nav>
  );
}
