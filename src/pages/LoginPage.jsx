import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginButton } from "../components/auth/LoginButton.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { useT } from "../i18n/LanguageProvider.jsx";

export default function LoginPage() {
  const { isAuthed } = useAuth();
  const t = useT();

  if (isAuthed) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent font-display text-xl font-bold text-accent-ink transition-colors hover:bg-accent-strong"
          >
            F
          </Link>
          <h1 className="font-bold leading-tight text-[clamp(1.75rem,6vw,2.5rem)]">
            {t("app.name")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            {t("login.tagline")}
          </p>
        </div>

        <Card className="p-6">
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
        </div>
      </div>
    </main>
  );
}
