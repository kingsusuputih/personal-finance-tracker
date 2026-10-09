import { useState } from "react";
import { Link } from "react-router-dom";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { ThemeToggle } from "../components/ui/ThemeToggle.jsx";
import { SocialProof } from "../components/landing/SocialProof.jsx";
import { DONATE_URL } from "../constants/donate.js";

export default function LandingPage() {
  const t = useT();
  const { lang } = useI18n();
  const [userCount, setUserCount] = useState(null);

  const formattedUserCount =
    typeof userCount === "number" && userCount > 0
      ? new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(userCount)
      : null;

  return (
    <div className="min-h-dvh bg-paper text-ink font-body relative overflow-x-clip selection:bg-accent-soft selection:text-accent">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-rule">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
              title={t("app.name")}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-btn bg-accent text-xs font-bold text-accent-ink shadow-sm font-brand">
                F
              </span>
              <span className="font-brand text-base font-bold tracking-tight text-ink">
                {t("app.name")}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <a
                href="#fitur"
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navFeatures")}
              </a>
              <a
                href="#cara-kerja"
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navHowItWorks")}
              </a>
              <a
                href="#cerita"
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.storyKicker")}
              </a>
              <a
                href="#privasi"
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navTransparency")}
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <LangToggle />
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-btn bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-4 h-9 text-xs sm:text-sm shadow-sm hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                {t("landing.navLogin")}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation for Anchors */}
        <div className="flex md:hidden items-center justify-around border-t border-rule bg-paper-2/60 px-4 py-2 text-xs font-medium text-ink-3">
          <a href="#fitur" className="hover:text-accent transition-colors">
            {t("landing.navFeatures")}
          </a>
          <a href="#cara-kerja" className="hover:text-accent transition-colors">
            {t("landing.navHowItWorks")}
          </a>
          <a href="#cerita" className="hover:text-accent transition-colors">
            {t("landing.storyKicker")}
          </a>
          <a href="#privasi" className="hover:text-accent transition-colors">
            {t("landing.navTransparency")}
          </a>
          <a href="#faq" className="hover:text-accent transition-colors">
            FAQ
          </a>
        </div>
      </header>

      <main>
        {/* Connected Architectural Hero */}
        <section className="pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-16 lg:pb-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Ruled 2-Column Command Hero Frame */}
            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule">
              {/* Left Column: Headlines & CTA (Max 4 elements: kicker, title, subtitle, CTAs) */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between text-left bg-paper">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-btn bg-accent-soft border border-accent/20 text-xs font-semibold text-accent mb-6">
                    <span className="bg-accent text-accent-ink px-1.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold">
                      NEW
                    </span>
                    <span>{t("landing.heroKicker")}</span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12] text-ink mb-4">
                    {t("landing.heroTitleLead")}{" "}
                    <span className="text-accent">
                      {t("landing.heroTitleAccent")}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg leading-relaxed text-ink-2 mb-8 max-w-[480px]">
                    {t("landing.heroSubtitle")}
                  </p>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-btn bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-6 h-11 text-sm shadow-sm hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                      {t("landing.primaryCta")} →
                    </Link>
                    <a
                      href="#cara-kerja"
                      className="inline-flex items-center justify-center rounded-btn bg-paper hover:bg-paper-2 text-ink border border-rule-2 font-semibold px-5 h-11 text-sm shadow-sm hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                      {t("landing.secondaryCta")}
                    </a>
                  </div>
                  <p className="mt-4 text-[11px] text-ink-3">
                    {t("landing.ctaNote")}
                  </p>
                </div>
              </div>

              {/* Right Column: Live Interface Frame */}
              <div className="lg:col-span-6 p-4 sm:p-6 bg-paper-2/40 flex flex-col justify-center">
                <div className="rounded-btn border border-rule bg-paper p-2.5 shadow-md">
                  <img
                    src="/preview-dashboard.svg"
                    alt="Finance Tracker Dashboard Preview"
                    width="1200"
                    height="760"
                    loading="eager"
                    className="w-full rounded border border-rule object-cover"
                  />
                  <p className="mt-2 text-center text-[11px] text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>

            {/* Connected Product Value Strip */}
            <div className="mt-6 rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-rule">
              <div className="p-4 sm:p-5 flex flex-col items-start">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripStorage")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripStorageDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripBudget")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripBudgetDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripFunds")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripFundsDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripLang")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripLangDesc")}</span>
              </div>
            </div>

            {formattedUserCount && (
              <div className="mt-5 text-center">
                <div className="inline-flex items-center gap-2 rounded-btn border border-rule bg-paper px-3.5 py-1 text-xs text-ink-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span>{t("landing.userCount", { count: formattedUserCount })}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature Section - Connected Panel Matrix */}
        <section id="fitur" className="py-14 sm:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                {t("landing.featuresTitle")}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-ink-2">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-rule">
              {/* Feature 1 */}
              <div className="p-6 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-10 h-10 rounded-btn flex items-center justify-center mb-4 bg-accent-soft text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1.5">
                  {t("landing.featQuickTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-ink-3">
                  {t("landing.featQuickBody")}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-10 h-10 rounded-btn flex items-center justify-center mb-4 bg-accent-soft text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1.5">
                  {t("landing.featAllocTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-ink-3">
                  {t("landing.featAllocBody")}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-10 h-10 rounded-btn flex items-center justify-center mb-4 bg-accent-soft text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1.5">
                  {t("landing.featChartTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-ink-3">
                  {t("landing.featChartBody")}
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-10 h-10 rounded-btn flex items-center justify-center mb-4 bg-accent-soft text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1.5">
                  {t("landing.featFundsTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-ink-3">
                  {t("landing.featFundsBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Spotlight 1: Pencatatan Transaksi */}
        <section className="py-14 sm:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule">
              {/* Product Visual */}
              <div className="lg:col-span-7 p-5 sm:p-8 bg-paper-2/40 flex flex-col justify-center">
                <div className="rounded-btn border border-rule bg-paper p-2.5 shadow-sm">
                  <img
                    src="/preview-ledger.svg"
                    alt="Preview Pencatatan Transaksi"
                    width="760"
                    height="520"
                    loading="lazy"
                    className="w-full rounded border border-rule object-cover"
                  />
                  <p className="mt-2 text-center text-xs text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between text-left bg-paper">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                    {t("landing.detailLedgerTitle")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-6">
                    {t("landing.detailLedgerSubtitle")}
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint1")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint2")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint3")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <a
                    href="#cara-kerja"
                    className="inline-flex items-center justify-center rounded-btn bg-paper hover:bg-paper-2 text-ink border border-rule-2 font-semibold px-4 h-9 text-xs sm:text-sm shadow-sm hover:-translate-y-px transition-all duration-(--dur-base)">
                    {t("landing.secondaryCta")} →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Spotlight 2: Restored Detail Rekap & Target Dana */}
        <section className="py-14 sm:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule">
              {/* Text Info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between text-left bg-paper order-2 lg:order-1">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                    {t("landing.detailRecapTitle")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-6">
                    {t("landing.detailRecapSubtitle")}
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint1")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint2")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-btn bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint3")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-btn bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-6 h-10 text-xs sm:text-sm shadow-sm hover:-translate-y-px transition-all duration-(--dur-base)">
                    {t("landing.primaryCta")} →
                  </Link>
                </div>
              </div>

              {/* Visual Spotlight */}
              <div className="lg:col-span-7 p-5 sm:p-8 bg-paper-2/40 flex flex-col justify-center order-1 lg:order-2">
                <div className="rounded-btn border border-rule bg-paper p-2.5 shadow-sm">
                  <img
                    src="/preview-dashboard.svg"
                    alt="Preview Dashboard dan Rekap"
                    width="1200"
                    height="760"
                    loading="lazy"
                    className="w-full rounded border border-rule object-cover"
                  />
                  <p className="mt-2 text-center text-xs text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Connected 3-Step Sequence */}
        <section id="cara-kerja" className="py-14 sm:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                {t("landing.howTitle")}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-ink-2">
                {t("landing.howSubtitle")}
              </p>
            </div>

            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
              <div className="p-6 sm:p-8 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-9 h-9 rounded-btn bg-accent-soft text-accent font-bold flex items-center justify-center text-sm mb-4">
                  1
                </div>
                <h3 className="font-bold text-sm sm:text-base text-ink mb-2">
                  {t("landing.howStep1Title")}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep1Body")}
                </p>
              </div>

              <div className="p-6 sm:p-8 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-9 h-9 rounded-btn bg-accent-soft text-accent font-bold flex items-center justify-center text-sm mb-4">
                  2
                </div>
                <h3 className="font-bold text-sm sm:text-base text-ink mb-2">
                  {t("landing.howStep2Title")}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep2Body")}
                </p>
              </div>

                <div className="p-6 sm:p-8 text-left hover:bg-paper-2/30 transition-colors">
                <div className="w-9 h-9 rounded-btn bg-accent-soft text-accent font-bold flex items-center justify-center text-sm mb-4">
                  3
                </div>
                <h3 className="font-bold text-sm sm:text-base text-ink mb-2">
                  {t("landing.howStep3Title")}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-ink-3">
                  {t("landing.howStep3Body")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Story Section */}
        <section id="cerita" className="py-14 sm:py-20 border-b border-rule bg-paper-2/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-card border border-rule bg-paper p-6 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-btn bg-accent-soft border border-accent/20 text-xs font-semibold text-accent">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {t("landing.storyKicker")}
                </span>
                <span className="kbd text-[11px] text-ink-3 font-mono">
                  by @susuputih
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-2">
                {t("landing.storyTitle")}
              </h2>
              <p className="text-sm sm:text-base text-ink-3 mb-6">
                {t("landing.storySubtitle")}
              </p>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink-2 border-t border-rule pt-6">
                <p>{t("landing.storyP1")}</p>
                <p>{t("landing.storyP2")}</p>
                <p>{t("landing.storyP3")}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent text-accent-ink font-bold flex items-center justify-center text-sm shadow-sm font-brand">
                    SP
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">{t("landing.storyAuthor")}</h3>
                    <p className="text-xs text-ink-3">{t("landing.storyRole")}</p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-btn bg-paper hover:bg-paper-2 text-ink border border-rule-2 font-semibold px-4 h-9 text-xs sm:text-sm shadow-sm transition-all hover:-translate-y-px">
                  {t("landing.primaryCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Data Ownership & FAQ Section - Connected 2-Column Framework */}
        <section id="privasi" className="py-14 sm:py-20 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule">
              {/* Left Column: Data Transparency */}
              <div className="lg:col-span-5 p-6 sm:p-8 text-left bg-paper">
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mb-3">
                  {t("landing.privacyTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-ink-2 leading-relaxed mb-6">
                  {t("landing.privacySubtitle")}
                </p>

                <ul className="space-y-3.5 text-xs sm:text-sm text-ink-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent font-bold">✓</span>
                    <span>{t("landing.privacyBullet1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent font-bold">✓</span>
                    <span>{t("landing.privacyBullet2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent font-bold">✓</span>
                    <span>{t("landing.privacyBullet3")}</span>
                  </li>
                </ul>

                <p className="mt-8 text-[11px] text-ink-3 border-t border-rule pt-4">
                  {t("landing.ctaNote")}
                </p>
              </div>

              {/* Right Column: FAQ Accordion */}
              <div id="faq" className="lg:col-span-7 p-6 sm:p-8 text-left bg-paper-2/20">
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink mb-6">
                  {t("landing.faqTitle")}
                </h2>

                <div className="space-y-3">
                  <details className="group rounded-card border border-rule bg-paper transition-colors open:border-accent">
                    <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                      {t("landing.faqQ1")}
                    </summary>
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                      {t("landing.faqA1")}
                    </div>
                  </details>

                  <details className="group rounded-card border border-rule bg-paper transition-colors open:border-accent">
                    <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                      {t("landing.faqQ2")}
                    </summary>
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                      {t("landing.faqA2")}
                    </div>
                  </details>

                  <details className="group rounded-card border border-rule bg-paper transition-colors open:border-accent">
                    <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                      {t("landing.faqQ3")}
                    </summary>
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                      {t("landing.faqA3")}
                    </div>
                  </details>

                  <details className="group rounded-card border border-rule bg-paper transition-colors open:border-accent">
                    <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                      {t("landing.faqQ4")}
                    </summary>
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                      {t("landing.faqA4")}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Action Panel */}
        <section className="py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="rounded-card border border-rule bg-paper p-8 sm:p-12 shadow-sm">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                {t("landing.ctaTitle")}
              </h2>
              <p className="text-sm sm:text-base text-ink-2 max-w-lg mx-auto mb-8">
                {t("landing.ctaSubtitle")}
              </p>
              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-btn bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-7 h-11 text-sm shadow-sm hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                  {t("landing.primaryCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-rule bg-paper py-8 text-xs text-ink-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="font-brand font-bold text-sm text-ink flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-btn bg-accent text-[10px] font-bold text-accent-ink font-brand">
                  F
                </span>
                <span>{t("app.name")}</span>
              </Link>
              <span className="text-ink-3">·</span>
              <span>50/30/20</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 font-medium text-ink-2">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                {t("legal.privacy")}
              </Link>
              <Link to="/terms" className="hover:text-accent transition-colors">
                {t("legal.terms")}
              </Link>
              <Link to="/changelog" className="hover:text-accent transition-colors">
                {t("legal.changelog")}
              </Link>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline">
                {t("nav.donate")}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Community Social Proof Notification */}
      <SocialProof onCountLoaded={setUserCount} />
    </div>
  );
}
