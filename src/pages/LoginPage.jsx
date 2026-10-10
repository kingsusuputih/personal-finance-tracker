import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { LoginButton } from "../components/auth/LoginButton.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { ThemeToggle } from "../components/ui/ThemeToggle.jsx";
import { SocialProof } from "../components/landing/SocialProof.jsx";
import { useT } from "../i18n/LanguageProvider.jsx";

export default function LoginPage() {
  const { isAuthed } = useAuth();
  const t = useT();

  if (isAuthed) return <Navigate to="/dashboard" replace />;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 bg-paper text-ink font-body relative">
      <SocialProof position="top-center" />
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <ThemeToggle />
        <LangToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden divide-y divide-rule">
          {/* Brand & Value Header */}
          <div className="p-6 text-center bg-paper">
            <Link
              to="/"
              className="group inline-flex flex-col items-center"
              title={t("app.name")}
            >
              <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-accent font-brand text-lg font-bold text-accent-ink transition-colors group-hover:bg-accent-strong shadow-sm">
                F
              </span>
              <h1 className="font-bold leading-tight text-2xl text-ink transition-colors group-hover:text-accent font-brand">
                {t("app.name")}
              </h1>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-ink-2 max-w-xs mx-auto">
              {t("login.tagline")}
            </p>
          </div>

          {/* Action Box */}
          <div className="p-6 text-center bg-paper">
            <LoginButton />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge>{t("login.badgeDrive")}</Badge>
              <Badge>{t("login.badgeMemory")}</Badge>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">
              {t("login.note")}
            </p>
          </div>

          {/* Footer & Legal Links */}
          <div className="p-4 text-center bg-paper-2/40 text-xs">
            <div className="flex items-center justify-center gap-3 text-ink-3">
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
            <p className="kbd mt-2 text-[10px] text-ink-3">
              {t("login.footer")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
