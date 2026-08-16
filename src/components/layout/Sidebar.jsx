import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { LangToggle } from "../ui/LangToggle.jsx";
import { useT } from "../../i18n/LanguageProvider.jsx";

const navItems = [
  { to: "/dashboard", labelKey: "nav.dashboard" },
  { to: "/ledger", labelKey: "nav.ledger" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-rule bg-paper-2 lg:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-rule px-5">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-accent font-display text-xs font-bold text-accent-ink">
          F
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-ink">
          {t("app.name")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium transition-colors duration-(--dur-fast) ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-ink-2 hover:bg-paper-3 hover:text-ink"
              }`
            }>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded bg-accent" />
                )}
                {t(item.labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-rule p-3">
        <div className="mb-2 flex justify-center">
          <LangToggle />
        </div>
        <div className="flex items-center gap-3 rounded-btn px-3 py-2">
          {user?.picture ? (
            <img
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
              className="h-8 w-8 shrink-0 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-full bg-paper-3" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {user?.name || "User"}
            </p>
            <p className="kbd truncate text-[10px] text-ink-3">{user?.email}</p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label={t("nav.signOut")}
            className="shrink-0 rounded p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-danger">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("signout.title")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={doLogout}>
              {t("signout.confirm")}
            </Button>
          </>
        }>
        {t("signout.body")}
      </Modal>
    </aside>
  );
}
