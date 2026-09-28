import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginButton } from "../components/auth/LoginButton.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { useT } from "../i18n/LanguageProvider.jsx";

export default function LoginPage() {
  const { isAuthed } = useAuth();
  const t = useT();

  if (isAuthed) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 bg-paper">
      <div className="absolute top-4 right-4">
        <LangToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="group inline-flex flex-col items-center"
            title={t("app.name")}
          >
            <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-accent font-display text-lg font-bold text-accent-ink transition-colors group-hover:bg-accent-strong shadow-sm">
              F
            </span>
            <h1 className="font-bold leading-tight text-2xl sm:text-3xl text-ink transition-colors group-hover:text-accent font-display">
              {t("app.name")}
            </h1>
          </Link>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-3">
            {t("login.tagline")}
          </p>
        </div>

        <Card className="p-6 shadow-sm">
          <LoginButton />
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge>{t("login.badgeDrive")}</Badge>
            <Badge>{t("login.badgeMemory")}</Badge>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">
            {t("login.note")}
          </p>
        </Card>

        <p className="kbd mt-6 text-center text-[10px] text-ink-3">
          {t("login.footer")}
        </p>

        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-ink-3">
          <Link to="/privacy" className="transition-colors hover:text-accent">
            {t("legal.privacy")}
          </Link>
          <span>·</span>
          <Link to="/terms" className="transition-colors hover:text-accent">
            {t("legal.terms")}
          </Link>
          <span>·</span>
          <Link to="/changelog" className="transition-colors hover:text-accent">
            {t("legal.changelog")}
          </Link>
        </div>
      </div>
    </main>
  );
}
