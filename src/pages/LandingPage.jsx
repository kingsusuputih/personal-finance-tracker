import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";
import { SocialProof } from "../components/landing/SocialProof.jsx";
import { FloatingPreferences } from "../components/landing/FloatingPreferences.jsx";
import { FloatingSupport } from "../components/landing/FloatingSupport.jsx";
import {
  DashboardMockup,
  GoogleDriveIcon,
  GoogleSheetsIcon,
} from "../components/landing/DashboardMockup.jsx";

function GoogleMark({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.87-3c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export default function LandingPage() {
  const t = useT();
  const { lang } = useI18n();
  const [userCount, setUserCount] = useState(null);

  const formattedUserCount =
    typeof userCount === "number" && userCount > 0
      ? new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(userCount)
      : null;

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler for anchor navigation
  const handleNavScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  };

  return (
    <div className="min-h-dvh bg-paper text-ink font-body relative overflow-x-clip selection:bg-accent-soft selection:text-accent">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-rule transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => handleNavScroll(e, "top")}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
              title={t("app.name")}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-btn bg-accent text-xs font-bold text-accent-ink shadow-sm font-brand">
                F
              </span>
              <span className="font-brand text-base font-bold tracking-tight text-ink">
                Finance Tracker
              </span>
            </Link>

            {/* Nav Links with Smooth Scrolling */}
            <nav className="hidden md:flex items-center gap-7">
              <a
                href="#"
                onClick={(e) => handleNavScroll(e, "top")}
                className="text-sm font-medium text-ink hover:text-accent transition-colors">
                {lang === "id" ? "Beranda" : "Home"}
              </a>
              <a
                href="#fitur"
                onClick={(e) => handleNavScroll(e, "fitur")}
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navFeatures")}
              </a>
              <a
                href="#cara-kerja"
                onClick={(e) => handleNavScroll(e, "cara-kerja")}
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navHowItWorks")}
              </a>
              <a
                href="#cerita"
                onClick={(e) => handleNavScroll(e, "cerita")}
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.storyKicker")}
              </a>
              <a
                href="#privasi"
                onClick={(e) => handleNavScroll(e, "privasi")}
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                {t("landing.navTransparency")}
              </a>
              <a
                href="#faq"
                onClick={(e) => handleNavScroll(e, "faq")}
                className="text-sm font-medium text-ink-2 hover:text-accent transition-colors">
                FAQ
              </a>
            </nav>

            {/* Right Action Button */}
            <div className="flex items-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-4 sm:px-5 h-9 sm:h-10 text-xs sm:text-sm shadow-sm hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs">
                  <GoogleMark className="h-3.5 w-3.5" />
                </span>
                <span>{t("landing.googleCta")}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section (Tone: bg-paper) */}
        <section className="pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 overflow-hidden bg-paper border-b border-rule/60 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Headline & CTA */}
              <div className="lg:col-span-6 text-left reveal-on-scroll">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-6 shadow-xs hover:border-accent/40 transition-colors">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>{t("landing.badgeFree")}</span>
                </div>

                {/* Main Heading */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12] text-ink mb-6">
                  {t("landing.heroTitleLead")}{" "}
                  <span className="text-accent">
                    {t("landing.heroTitleAccent")}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg leading-relaxed text-ink-2 mb-8 max-w-[500px]">
                  {t("landing.heroSubtitle")}
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-6 sm:px-7 h-12 text-sm sm:text-base shadow-md hover:-translate-y-px active:translate-y-0 transition-all duration-(--dur-base) whitespace-nowrap">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs">
                      <GoogleMark className="h-4 w-4" />
                    </span>
                    <span>{t("landing.googleCta")}</span>
                    <span>→</span>
                  </Link>
                  <a
                    href="#cara-kerja"
                    onClick={(e) => handleNavScroll(e, "cara-kerja")}
                    className="inline-flex items-center justify-center rounded-full bg-paper hover:bg-paper-2 text-ink border border-rule font-semibold px-5 h-12 text-sm shadow-xs hover:-translate-y-px transition-all">
                    {t("landing.secondaryCta")}
                  </a>
                </div>

                {/* Trust guarantee */}
                <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-ink-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/20 text-success text-[10px] font-bold">
                    ✓
                  </span>
                  <span>{t("landing.heroCheck")}</span>
                </div>
              </div>

              {/* Right Column: High-Fidelity Dashboard Mockup with Ambient Glow & Floating Badge */}
              <div className="lg:col-span-6 relative flex justify-center lg:justify-end reveal-on-scroll stagger-2">
                <DashboardMockup />
              </div>
            </div>

            {/* Connected Product Value Strip (4 Real Pillars) */}
            <div className="mt-14 rounded-2xl border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-rule reveal-on-scroll stagger-3">
              <div className="p-4 sm:p-5 flex flex-col items-start hover:bg-paper-2/40 transition-colors">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripStorage")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripStorageDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start hover:bg-paper-2/40 transition-colors">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripBudget")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripBudgetDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start hover:bg-paper-2/40 transition-colors">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripFunds")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripFundsDesc")}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col items-start hover:bg-paper-2/40 transition-colors">
                <span className="font-display text-base sm:text-lg font-bold text-ink tabular-nums">
                  {t("landing.stripLang")}
                </span>
                <span className="text-xs text-ink-3 mt-0.5">{t("landing.stripLangDesc")}</span>
              </div>
            </div>

            {/* Real Registered Users Dynamic Badge */}
            {formattedUserCount && (
              <div className="mt-5 text-center reveal-on-scroll">
                <div className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-4 py-1.5 text-xs font-medium text-ink-2 shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span>{t("landing.userCount", { count: formattedUserCount })}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Fitur Unggulan (Tone: bg-paper-2/45, with subtle visual variance) */}
        <section id="fitur" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 border-b border-rule bg-paper-2/45">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
                {t("landing.featuresHeading")}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-ink-2">
                {t("landing.featuresSubheading")}
              </p>
            </div>

            {/* 6 Feature Cards with Staggered Cascading Reveals & Hover Physics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1: Private & Yours */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat1Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat1Desc")}
                </p>
              </div>

              {/* Feature 2: Google Login */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <GoogleMark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat2Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat2Desc")}
                </p>
              </div>

              {/* Feature 3: 50 / 30 / 20 Allocation */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat3Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat3Desc")}
                </p>
              </div>

              {/* Feature 4: Fund Targets (6x & 300x) */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat4Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat4Desc")}
                </p>
              </div>

              {/* Feature 5: Ledger & Payday Cutoff Cycles */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat5Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat5Desc")}
                </p>
              </div>

              {/* Feature 6: Private AI Assistant in Sheets */}
              <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-7 shadow-xs hover:-translate-y-1.5 hover:shadow-lg hover:border-rule-2 transition-all duration-300 ease-out reveal-on-scroll stagger-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-ink mb-2">
                  {t("landing.feat6Title")}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {t("landing.feat6Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Cara Kerja (Tone: bg-paper) */}
        <section id="cara-kerja" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 border-b border-rule bg-paper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: 3 Steps */}
              <div className="lg:col-span-5 text-left reveal-on-scroll">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
                  {t("landing.stepsBadge")}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-4">
                  {t("landing.stepsTitle")}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-8">
                  {t("landing.stepsSubtitle")}
                </p>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink font-bold text-sm shadow-xs">
                      1
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-ink mb-1">
                        {t("landing.step1Title")}
                      </h3>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {t("landing.step1Desc")}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink font-bold text-sm shadow-xs">
                      2
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-ink mb-1">
                        {t("landing.step2Title")}
                      </h3>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {t("landing.step2Desc")}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink font-bold text-sm shadow-xs">
                      3
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-ink mb-1">
                        {t("landing.step3Title")}
                      </h3>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {t("landing.step3Desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Flow Cards matching actual app architecture */}
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-3xl bg-paper-2/40 border border-rule reveal-on-scroll stagger-2">
                {/* Step 1 Card: Google OAuth */}
                <div className="w-full sm:w-44 rounded-2xl border border-rule bg-paper p-4 text-center shadow-xs hover:-translate-y-1 transition-transform">
                  <div className="flex justify-center mb-2">
                    <GoogleMark className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-bold text-ink mb-1">
                    {t("landing.step1Title")}
                  </h4>
                  <p className="text-[10px] text-ink-3 mb-2 font-mono">Google OAuth</p>
                  <div className="w-full rounded-md bg-accent text-accent-ink text-[11px] font-semibold py-1">
                    {t("landing.flowStep1Btn")}
                  </div>
                </div>

                {/* Arrow */}
                <span className="text-emerald-500 font-bold text-xl rotate-90 sm:rotate-0">
                  →
                </span>

                {/* Step 2 Card: Private Spreadsheet */}
                <div className="w-full sm:w-44 rounded-2xl border border-rule bg-paper p-4 text-center shadow-xs hover:-translate-y-1 transition-transform">
                  <div className="flex justify-center mb-2">
                    <GoogleSheetsIcon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xs font-bold text-ink mb-1">
                    {t("landing.flowStep2Title")}
                  </h4>
                  <p className="text-[10px] text-ink-3">
                    {t("landing.flowStep2Desc")}
                  </p>
                </div>

                {/* Arrow */}
                <span className="text-emerald-500 font-bold text-xl rotate-90 sm:rotate-0">
                  →
                </span>

                {/* Step 3 Card: 50/30/20 Dashboard */}
                <div className="w-full sm:w-44 rounded-2xl border border-rule bg-paper p-4 text-center shadow-xs hover:-translate-y-1 transition-transform">
                  <div className="flex justify-center mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-bold text-xs font-mono">
                      50/30/20
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-ink leading-tight">
                    {t("landing.flowStep3Title")}
                  </h4>
                  <p className="text-[10px] text-ink-3 mt-1">
                    {lang === "id" ? "Target Terukur" : "Measured Targets"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Product Spotlight 1: Pencatatan Transaksi (Tone: bg-paper-2/30) */}
        <section className="py-14 sm:py-20 border-b border-rule bg-paper-2/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule reveal-on-scroll">
              {/* Product Visual */}
              <div className="lg:col-span-7 p-5 sm:p-8 bg-paper-2/40 flex flex-col justify-center">
                <div className="rounded-xl border border-rule bg-paper p-2.5 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src="/preview-ledger.svg"
                    alt="Preview Pencatatan Transaksi"
                    width="760"
                    height="520"
                    loading="lazy"
                    className="w-full rounded-lg border border-rule object-cover"
                  />
                  <p className="mt-2 text-center text-xs text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>

              {/* Text Info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between text-left bg-paper">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
                    {t("landing.detailLedgerBadge")}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                    {t("landing.detailLedgerTitle")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-6">
                    {t("landing.detailLedgerSubtitle")}
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint1")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint2")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailLedgerPoint3")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-paper hover:bg-paper-2 text-ink border border-rule font-semibold px-5 h-10 text-xs sm:text-sm shadow-xs transition-all hover:-translate-y-px">
                    {t("landing.primaryCta")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Product Spotlight 2: Rekap Finansial & Target Dana (Tone: bg-paper) */}
        <section className="py-14 sm:py-20 border-b border-rule bg-paper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-rule reveal-on-scroll">
              {/* Text Info */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between text-left bg-paper order-2 lg:order-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
                    {t("landing.detailRecapBadge")}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-3">
                    {t("landing.detailRecapTitle")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-ink-2 mb-6">
                    {t("landing.detailRecapSubtitle")}
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint1")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint2")}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink text-[11px] font-bold">
                        ✓
                      </span>
                      <span>{t("landing.detailRecapPoint3")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-6 h-10 text-xs sm:text-sm shadow-sm hover:-translate-y-px transition-all">
                    {t("landing.primaryCta")} →
                  </Link>
                </div>
              </div>

              {/* Visual Spotlight */}
              <div className="lg:col-span-7 p-5 sm:p-8 bg-paper-2/40 flex flex-col justify-center order-1 lg:order-2">
                <div className="rounded-xl border border-rule bg-paper p-2.5 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src="/preview-dashboard.svg"
                    alt="Preview Dashboard dan Rekap"
                    width="1200"
                    height="760"
                    loading="lazy"
                    className="w-full rounded-lg border border-rule object-cover"
                  />
                  <p className="mt-2 text-center text-xs text-ink-3">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Jaminan Privasi & Keamanan (Tone: bg-paper-2/20 with Emerald Container) */}
        <section id="privasi" className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 border-b border-rule bg-paper-2/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll shadow-sm hover:border-emerald-500/40 transition-colors">
              {/* Left Info */}
              <div className="flex items-start gap-4 sm:gap-6 text-left max-w-xl">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mb-2">
                    {t("landing.privacyBannerTitle")}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-2 mb-4">
                    {t("landing.privacyBannerDesc")}
                  </p>
                  <ul className="space-y-1.5 text-xs text-ink-3">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t("landing.privacyBullet1")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t("landing.privacyBullet2")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t("landing.privacyBullet3")}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Badges */}
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <GoogleDriveIcon className="h-8 w-8" />
                  <div>
                    <h4 className="text-sm font-bold text-ink">{t("landing.privacyGdriveTitle")}</h4>
                    <p className="text-xs text-ink-3">{t("landing.privacyGdriveDesc")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-ink">{t("landing.privacySecurityTitle")}</h4>
                    <p className="text-xs text-ink-3">{t("landing.privacySecurityDesc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Founder Story Section (Tone: bg-paper-2/50, warm editorial feeling) */}
        <section id="cerita" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 border-b border-rule bg-paper-2/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-10 shadow-xs relative overflow-hidden reveal-on-scroll">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
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
                  <div className="h-10 w-10 rounded-full bg-accent text-accent-ink font-bold flex items-center justify-center text-sm shadow-xs font-brand">
                    SP
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">{t("landing.storyAuthor")}</h3>
                    <p className="text-xs text-ink-3">{t("landing.storyRole")}</p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-strong text-accent-ink font-semibold px-5 h-9 text-xs sm:text-sm shadow-xs transition-all hover:-translate-y-px">
                  {t("landing.primaryCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ Accordion Section (Tone: bg-paper) */}
        <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 border-b border-rule bg-paper">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-8 text-center reveal-on-scroll">
              {t("landing.faqTitle")}
            </h2>

            <div className="space-y-3">
              <details className="group rounded-2xl border border-rule bg-paper transition-all open:border-accent shadow-xs reveal-on-scroll stagger-1">
                <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                  {t("landing.faqQ1")}
                </summary>
                <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                  {t("landing.faqA1")}
                </div>
              </details>

              <details className="group rounded-2xl border border-rule bg-paper transition-all open:border-accent shadow-xs reveal-on-scroll stagger-2">
                <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                  {t("landing.faqQ2")}
                </summary>
                <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                  {t("landing.faqA2")}
                </div>
              </details>

              <details className="group rounded-2xl border border-rule bg-paper transition-all open:border-accent shadow-xs reveal-on-scroll stagger-3">
                <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                  {t("landing.faqQ3")}
                </summary>
                <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                  {t("landing.faqA3")}
                </div>
              </details>

              <details className="group rounded-2xl border border-rule bg-paper transition-all open:border-accent shadow-xs reveal-on-scroll stagger-4">
                <summary className="px-5 py-4 font-semibold text-sm text-ink cursor-pointer list-none flex justify-between items-center select-none after:content-['+'] after:text-lg after:text-accent after:transition-transform group-open:after:rotate-45">
                  {t("landing.faqQ4")}
                </summary>
                <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-rule/40 pt-3">
                  {t("landing.faqA4")}
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 10. Bottom CTA Banner (Tone: bg-paper-2/30 containing high-impact card) */}
        <section className="py-14 sm:py-20 bg-paper-2/30 border-b border-rule">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll hover:shadow-indigo-500/10 transition-shadow">
              {/* Left Info */}
              <div className="text-left max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white font-bold text-xs font-brand">
                    F
                  </span>
                  <span className="font-brand font-bold text-sm text-white/90">
                    Finance Tracker
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  {t("landing.bannerTitle")}
                </h2>
                <p className="text-sm sm:text-base text-white/70">
                  {t("landing.bannerSubtitle")}
                </p>
              </div>

              {/* Right CTA */}
              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 sm:px-7 h-12 text-sm sm:text-base shadow-lg transition-transform hover:-translate-y-px active:translate-y-0 whitespace-nowrap">
                  <GoogleMark className="h-4 w-4" />
                  <span>{t("landing.googleCta")}</span>
                  <span>→</span>
                </Link>
                <span className="text-xs text-white/60">
                  {t("landing.bannerJoinNote")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. Footer (Tone: bg-paper-2/70) */}
      <footer className="bg-paper-2/70 py-10 text-xs text-ink-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => handleNavScroll(e, "top")}
              className="font-brand font-bold text-base text-ink flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-btn bg-accent text-[11px] font-bold text-accent-ink font-brand">
                F
              </span>
              <span>Finance Tracker</span>
            </Link>

            {/* Nav Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-ink-2 text-sm">
              <a
                href="#"
                onClick={(e) => handleNavScroll(e, "top")}
                className="hover:text-accent transition-colors">
                {lang === "id" ? "Beranda" : "Home"}
              </a>
              <a
                href="#fitur"
                onClick={(e) => handleNavScroll(e, "fitur")}
                className="hover:text-accent transition-colors">
                {t("landing.navFeatures")}
              </a>
              <a
                href="#cara-kerja"
                onClick={(e) => handleNavScroll(e, "cara-kerja")}
                className="hover:text-accent transition-colors">
                {t("landing.navHowItWorks")}
              </a>
              <a
                href="#cerita"
                onClick={(e) => handleNavScroll(e, "cerita")}
                className="hover:text-accent transition-colors">
                {t("landing.storyKicker")}
              </a>
              <a
                href="#privasi"
                onClick={(e) => handleNavScroll(e, "privasi")}
                className="hover:text-accent transition-colors">
                {t("landing.navTransparency")}
              </a>
              <a
                href="#faq"
                onClick={(e) => handleNavScroll(e, "faq")}
                className="hover:text-accent transition-colors">
                FAQ
              </a>
            </div>
          </div>

          <div className="border-t border-rule pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ink-3">
            <p>{t("landing.footerTagline")}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                {t("legal.privacy")}
              </Link>
              <Link to="/terms" className="hover:text-accent transition-colors">
                {t("legal.terms")}
              </Link>
              <Link to="/changelog" className="hover:text-accent transition-colors">
                {t("legal.changelog")}
              </Link>
              <span>{t("landing.footerCopyright")}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Community Social Proof Notification (Real dynamic events) */}
      <SocialProof onCountLoaded={setUserCount} position="top-center" />

      {/* Floating Edge Preferences Dock (Theme & Language with hover expansion) */}
      <FloatingPreferences />

      {/* Floating Support/Donation Pill Widget */}
      <FloatingSupport />
    </div>
  );
}
