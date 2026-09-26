import { useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../i18n/LanguageProvider.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { Card } from "../components/ui/Card.jsx";
import { SocialProof, UserCountBadge } from "../components/landing/SocialProof.jsx";
import { DONATE_URL } from "../constants/donate.js";

export default function LandingPage() {
  const t = useT();
  const [userCount, setUserCount] = useState(null);

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink selection:bg-accent-soft selection:text-accent-strong">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
            title={t("app.name")}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-accent font-display text-xs font-bold text-accent-ink">
              F
            </span>
            <span className="font-display text-base font-bold tracking-tight text-ink">
              {t("app.name")}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-2">
            <a href="#cara-kerja" className="transition-colors hover:text-ink">
              {t("landing.navHowItWorks")}
            </a>
            <a href="#privasi" className="transition-colors hover:text-ink">
              {t("landing.navTransparency")}
            </a>
            <a href="#faq" className="transition-colors hover:text-ink">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <LangToggle />
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-btn bg-accent px-4 text-xs font-semibold text-accent-ink transition-colors hover:bg-accent-strong active:scale-[0.98]">
              {t("landing.navLogin")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-rule px-4 py-12 md:py-20 lg:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Value Prop & CTA */}
              <div className="text-left lg:col-span-6 xl:col-span-5">
                <p className="kbd text-[11px] text-accent">
                  {t("landing.heroKicker")}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.15]">
                  {t("landing.heroTitle")}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink-3 sm:text-lg">
                  {t("landing.heroSubtitle")}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    to="/login"
                    className="inline-flex h-12 items-center justify-center rounded-btn bg-accent px-7 text-sm font-semibold text-accent-ink transition-all hover:bg-accent-strong active:scale-[0.98]">
                    {t("landing.primaryCta")} →
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="inline-flex h-12 items-center justify-center rounded-btn border border-rule-2 bg-paper px-5 text-xs font-medium text-ink-2 transition-colors hover:bg-paper-2">
                    {t("landing.secondaryCta")}
                  </a>
                </div>

                <p className="mt-3 text-xs text-ink-3">
                  {t("landing.ctaNote")}
                </p>

                <div>
                  <UserCountBadge count={userCount} />
                </div>
              </div>

              {/* Right Column: Real Product Visual Preview */}
              <div className="lg:col-span-6 xl:col-span-7">
                <div className="relative rounded-card border border-rule bg-paper-2 p-2 sm:p-3 shadow-sm">
                  <img
                    src="/preview-dashboard.svg"
                    alt={t("landing.previewCaption")}
                    width="1200"
                    height="760"
                    className="w-full rounded-[8px] bg-paper shadow-sm"
                    fetchPriority="high"
                  />
                  <p className="mt-2 text-center font-mono text-[11px] text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features Section: Outcome-led */}
        <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t("landing.featuresTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-3 sm:text-base">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12 items-stretch">
              {/* Feature 1: Fast Ledger Entry */}
              <div className="rounded-card border border-rule bg-paper p-6 shadow-sm md:col-span-7 flex flex-col justify-between">
                <div>
                  <span className="kbd text-[10px] text-accent">01 · PENCATATAN</span>
                  <h3 className="mt-2 text-lg font-bold text-ink">
                    {t("landing.featQuickTitle")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-3">
                    {t("landing.featQuickBody")}
                  </p>
                </div>
                <div className="mt-6 overflow-hidden rounded border border-rule bg-paper-2 p-2">
                  <img
                    src="/preview-ledger.svg"
                    alt="Preview Pencatatan"
                    width="760"
                    height="520"
                    loading="lazy"
                    className="w-full rounded"
                  />
                </div>
              </div>

              {/* Feature 2 & 3: Allocation + Fund Targets */}
              <div className="space-y-6 md:col-span-5 flex flex-col justify-between">
                <div className="rounded-card border border-rule bg-paper p-6 shadow-sm flex-1">
                  <span className="kbd text-[10px] text-accent">02 · ANGGARAN</span>
                  <h3 className="mt-2 text-lg font-bold text-ink">
                    {t("landing.featAllocTitle")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-3">
                    {t("landing.featAllocBody")}
                  </p>
                  <div className="mt-4 space-y-2 pt-2 border-t border-rule font-mono text-xs">
                    <div className="flex justify-between items-center text-ink-2">
                      <span>Needs (Kebutuhan)</span>
                      <span className="text-accent font-semibold">50%</span>
                    </div>
                    <div className="flex justify-between items-center text-ink-2">
                      <span>Investments (Investasi)</span>
                      <span className="text-success font-semibold">30%</span>
                    </div>
                    <div className="flex justify-between items-center text-ink-2">
                      <span>Lifestyle (Gaya Hidup)</span>
                      <span className="text-warning font-semibold">20%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-card border border-rule bg-paper p-6 shadow-sm flex-1">
                  <span className="kbd text-[10px] text-accent">03 · PERENCANAAN</span>
                  <h3 className="mt-2 text-lg font-bold text-ink">
                    {t("landing.featFundsTitle")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-3">
                    {t("landing.featFundsBody")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="cara-kerja" className="border-y border-rule bg-paper-2 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t("landing.howTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-3 sm:text-base">
                {t("landing.howSubtitle")}
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card className="p-6 bg-paper">
                <p className="kbd mb-3 text-xs font-bold text-accent">01</p>
                <h3 className="text-base font-semibold text-ink">
                  {t("landing.howStep1Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep1Body")}
                </p>
              </Card>

              <Card className="p-6 bg-paper">
                <p className="kbd mb-3 text-xs font-bold text-accent">02</p>
                <h3 className="text-base font-semibold text-ink">
                  {t("landing.howStep2Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep2Body")}
                </p>
              </Card>

              <Card className="p-6 bg-paper">
                <p className="kbd mb-3 text-xs font-bold text-accent">03</p>
                <h3 className="text-base font-semibold text-ink">
                  {t("landing.howStep3Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep3Body")}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Data Ownership & Privacy Section */}
        <section id="privasi" className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-card border border-rule bg-paper p-8 sm:p-10 shadow-sm">
            <span className="kbd text-[11px] text-accent">KEPEMILIKAN DATA</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t("landing.privacyTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-3 sm:text-base">
              {t("landing.privacySubtitle")}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-ink-2">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-accent font-bold">✓</span>
                <span>{t("landing.privacyBullet1")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-accent font-bold">✓</span>
                <span>{t("landing.privacyBullet2")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 text-accent font-bold">✓</span>
                <span>{t("landing.privacyBullet3")}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t border-rule bg-paper-2 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t("landing.faqTitle")}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-rule bg-paper p-5">
                <h3 className="font-semibold text-ink text-sm">
                  {t("landing.faqQ1")}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                  {t("landing.faqA1")}
                </p>
              </div>

              <div className="rounded-card border border-rule bg-paper p-5">
                <h3 className="font-semibold text-ink text-sm">
                  {t("landing.faqQ2")}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                  {t("landing.faqA2")}
                </p>
              </div>

              <div className="rounded-card border border-rule bg-paper p-5">
                <h3 className="font-semibold text-ink text-sm">
                  {t("landing.faqQ3")}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                  {t("landing.faqA3")}
                </p>
              </div>

              <div className="rounded-card border border-rule bg-paper p-5">
                <h3 className="font-semibold text-ink text-sm">
                  {t("landing.faqQ4")}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                  {t("landing.faqA4")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8 text-center border-t border-rule bg-paper">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t("landing.ctaTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-3">
              {t("landing.ctaSubtitle")}
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center rounded-btn bg-accent px-8 text-sm font-semibold text-accent-ink transition-all hover:bg-accent-strong active:scale-[0.98]">
                {t("landing.primaryCta")} →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer with Donation Link embedded */}
      <footer className="border-t border-rule bg-paper py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 font-bold text-ink font-display transition-colors hover:text-accent"
              title={t("app.name")}>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-xs bg-accent text-[9px] font-bold text-accent-ink">
                F
              </span>
              <span>{t("app.name")}</span>
            </Link>
            <span>·</span>
            <span>{t("login.footer")}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-3">
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
            <span>·</span>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
              {t("nav.donate")}
            </a>
          </div>
        </div>
      </footer>

      {/* Subtle Community Social Proof Notification */}
      <SocialProof onCountLoaded={setUserCount} />
    </div>
  );
}
