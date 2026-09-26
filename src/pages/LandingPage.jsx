import { useState } from "react";
import { Link } from "react-router-dom";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
import { SocialProof } from "../components/landing/SocialProof.jsx";
import { DONATE_URL } from "../constants/donate.js";
import "./LandingPage.css";

export default function LandingPage() {
  const t = useT();
  const { lang } = useI18n();
  const [userCount, setUserCount] = useState(null);

  const formattedUserCount =
    typeof userCount === "number" && userCount > 0
      ? new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(userCount)
      : null;

  return (
    <div className="landing-page selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation */}
      <header className="landing-nav-sticky">
        <div className="landing-container">
          <div className="landing-nav-inner">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
              title={t("app.name")}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#5434ED] text-sm font-bold text-white shadow-sm">
                F
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-[#14131B]">
                {t("app.name")}
              </span>
            </Link>

            <nav className="landing-nav-links">
              <a href="#fitur" className="landing-nav-link">
                {t("landing.featuresTitle")}
              </a>
              <a href="#cara-kerja" className="landing-nav-link">
                {t("landing.navHowItWorks")}
              </a>
              <a href="#privasi" className="landing-nav-link">
                {t("landing.navTransparency")}
              </a>
              <a href="#faq" className="landing-nav-link">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <LangToggle />
              <Link to="/login" className="landing-btn-primary">
                {t("landing.navLogin")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-container">
            <div className="landing-hero-grid">
              {/* Left Column: Headlines & CTA */}
              <div>
                <div className="landing-badge-new">
                  <span className="landing-badge-tag">NEW</span>
                  <span>{t("landing.heroKicker")}</span>
                </div>

                <h1 className="landing-hero-title">
                  {t("landing.heroTitleLead")}{" "}
                  <span className="landing-hero-accent">
                    {t("landing.heroTitleAccent")}
                  </span>
                </h1>

                <p className="landing-hero-subtitle">
                  {t("landing.heroSubtitle")}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-5">
                  <Link
                    to="/login"
                    className="landing-btn-primary landing-btn-hero">
                    {t("landing.primaryCta")} →
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="landing-btn-secondary">
                    {t("landing.secondaryCta")}
                  </a>
                </div>

                <p className="text-xs text-[#8F8B9F] flex items-center gap-1.5 mb-6">
                  <svg className="w-4 h-4 text-[#5434ED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t("landing.ctaNote")}
                </p>

                {formattedUserCount && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#EAE6F8] px-3.5 py-1.5 text-xs text-[#5D5A6F] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t("landing.userCount", { count: formattedUserCount })}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Tilted Dashboard Preview */}
              <div className="landing-preview-wrapper">
                <div className="landing-orb-1" aria-hidden="true" />
                <div className="landing-orb-2" aria-hidden="true" />

                <div className="landing-preview-canvas">
                  {/* Mockup Dashboard Header */}
                  <div className="flex items-center justify-between border-b border-[#F0EDFF] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5434ED]" />
                      <span className="text-xs font-bold text-[#14131B]">Personal Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8F8B9F]">
                      <span className="px-2 py-0.5 rounded-full bg-[#EFFDF5] text-emerald-700 font-semibold border border-emerald-200">
                        Google Sheets Connected
                      </span>
                    </div>
                  </div>

                  {/* 3 Metrics Cards */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    <div className="rounded-xl bg-[#F8F7FF] border border-[#EAE6F8] p-2.5 text-left">
                      <p className="text-[10px] text-[#8F8B9F] font-medium">Income</p>
                      <p className="text-xs sm:text-sm font-bold text-[#14131B] mt-0.5">Rp 12.500.000</p>
                      <span className="text-[9px] text-emerald-600 font-semibold">Active Cycle</span>
                    </div>
                    <div className="rounded-xl bg-[#F8F7FF] border border-[#EAE6F8] p-2.5 text-left">
                      <p className="text-[10px] text-[#8F8B9F] font-medium">Expenses</p>
                      <p className="text-xs sm:text-sm font-bold text-[#14131B] mt-0.5">Rp 7.850.000</p>
                      <span className="text-[9px] text-[#5434ED] font-semibold">62.8% used</span>
                    </div>
                    <div className="rounded-xl bg-[#EFFDF5] border border-emerald-100 p-2.5 text-left">
                      <p className="text-[10px] text-emerald-700 font-medium">Net Surplus</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-900 mt-0.5">+Rp 4.650.000</p>
                      <span className="text-[9px] text-emerald-600 font-semibold">On Track</span>
                    </div>
                  </div>

                  {/* 50/30/20 Allocation Meter */}
                  <div className="rounded-xl bg-white border border-[#EAE6F8] p-3 mb-4 text-left shadow-sm">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-[#14131B]">50 / 30 / 20 Budget Health</span>
                      <span className="text-[11px] text-[#5434ED] font-bold">Optimal</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0EDFF] overflow-hidden flex mb-2">
                      <div className="h-full bg-[#5434ED] w-[50%]" title="Needs: 50%" />
                      <div className="h-full bg-emerald-500 w-[30%]" title="Investments: 30%" />
                      <div className="h-full bg-amber-400 w-[20%]" title="Lifestyle: 20%" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8F8B9F]">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5434ED]" /> Needs (50%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Invest (30%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Lifestyle (20%)
                      </span>
                    </div>
                  </div>

                  {/* Mini Recent Transactions */}
                  <div className="rounded-xl bg-[#F8F7FF] border border-[#EAE6F8] p-3 text-left">
                    <p className="text-[11px] font-bold text-[#14131B] mb-2">Recent Transactions</p>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-[#F0EDFF]">
                        <span className="text-[#14131B] font-sans">Monthly Groceries</span>
                        <span className="text-rose-600 font-bold">-Rp 450.000</span>
                      </div>
                      <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-[#F0EDFF]">
                        <span className="text-[#14131B] font-sans">Mutual Fund Index</span>
                        <span className="text-emerald-600 font-bold">+Rp 1.000.000</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[10px] text-[#8F8B9F]">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Value Strip */}
            <div className="landing-strip">
              <div className="landing-strip-item">
                <span className="landing-strip-val">{t("landing.stripStorage")}</span>
                <span className="landing-strip-desc">{t("landing.stripStorageDesc")}</span>
              </div>
              <div className="landing-strip-item">
                <span className="landing-strip-val">{t("landing.stripBudget")}</span>
                <span className="landing-strip-desc">{t("landing.stripBudgetDesc")}</span>
              </div>
              <div className="landing-strip-item">
                <span className="landing-strip-val">{t("landing.stripFunds")}</span>
                <span className="landing-strip-desc">{t("landing.stripFundsDesc")}</span>
              </div>
              <div className="landing-strip-item">
                <span className="landing-strip-val">{t("landing.stripLang")}</span>
                <span className="landing-strip-desc">{t("landing.stripLangDesc")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Row (Pastel Bento Cards) */}
        <section id="fitur" className="py-12 md:py-20">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-badge">FEATURES</span>
              <h2 className="landing-section-title">
                {t("landing.featuresTitle")}
              </h2>
              <p className="landing-section-subtitle">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="landing-feature-grid">
              {/* Feature 1: Lavender */}
              <div className="landing-feature-card landing-feat-lavender text-left">
                <div className="landing-feat-icon-box text-[#5434ED]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#14131B] mb-1.5">
                  {t("landing.featQuickTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#5D5A6F]">
                  {t("landing.featQuickBody")}
                </p>
              </div>

              {/* Feature 2: Peach */}
              <div className="landing-feature-card landing-feat-peach text-left">
                <div className="landing-feat-icon-box text-[#EA580C]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#14131B] mb-1.5">
                  {t("landing.featAllocTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#5D5A6F]">
                  {t("landing.featAllocBody")}
                </p>
              </div>

              {/* Feature 3: Mint */}
              <div className="landing-feature-card landing-feat-mint text-left">
                <div className="landing-feat-icon-box text-[#16A34A]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#14131B] mb-1.5">
                  {t("landing.featChartTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#5D5A6F]">
                  {t("landing.featChartBody")}
                </p>
              </div>

              {/* Feature 4: Sky */}
              <div className="landing-feature-card landing-feat-sky text-left">
                <div className="landing-feat-icon-box text-[#0284C7]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#14131B] mb-1.5">
                  {t("landing.featFundsTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#5D5A6F]">
                  {t("landing.featFundsBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail 1: Pencatatan Transaksi */}
        <section className="py-12 md:py-20">
          <div className="landing-container">
            <div className="landing-detail-row">
              {/* Product Visual */}
              <div className="landing-detail-card">
                <img
                  src="/preview-ledger.svg"
                  alt="Preview Pencatatan Transaksi"
                  width="760"
                  height="520"
                  loading="lazy"
                  className="w-full rounded-xl"
                />
                <p className="mt-2 text-center text-[10px] text-[#8F8B9F]">
                  {t("landing.previewCaption")}
                </p>
              </div>

              {/* Text Info */}
              <div className="text-left">
                <span className="landing-section-badge">{t("landing.detailLedgerBadge")}</span>
                <h2 className="landing-section-title">
                  {t("landing.detailLedgerTitle")}
                </h2>
                <p className="landing-section-subtitle mb-6">
                  {t("landing.detailLedgerSubtitle")}
                </p>

                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailLedgerPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailLedgerPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailLedgerPoint3")}</span>
                  </li>
                </ul>

                <a href="#cara-kerja" className="landing-btn-secondary">
                  {t("landing.secondaryCta")} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail 2: Rekap & Target Dana */}
        <section className="py-12 md:py-20">
          <div className="landing-container">
            <div className="landing-detail-row">
              {/* Text Info (Left on desktop) */}
              <div className="text-left order-2 lg:order-1">
                <span className="landing-section-badge">{t("landing.detailRecapBadge")}</span>
                <h2 className="landing-section-title">
                  {t("landing.detailRecapTitle")}
                </h2>
                <p className="landing-section-subtitle mb-6">
                  {t("landing.detailRecapSubtitle")}
                </p>

                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailRecapPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailRecapPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#14131B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5434ED] text-white text-[11px] font-bold">✓</span>
                    <span>{t("landing.detailRecapPoint3")}</span>
                  </li>
                </ul>

                <Link to="/login" className="landing-btn-primary">
                  {t("landing.primaryCta")} →
                </Link>
              </div>

              {/* Visual (Right on desktop) */}
              <div className="landing-detail-card order-1 lg:order-2">
                <img
                  src="/preview-dashboard.svg"
                  alt="Preview Dashboard dan Rekap"
                  width="1200"
                  height="760"
                  loading="lazy"
                  className="w-full rounded-xl"
                />
                <p className="mt-2 text-center text-[10px] text-[#8F8B9F]">
                  {t("landing.previewCaption")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="cara-kerja" className="py-16 md:py-24">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-badge">ONBOARDING</span>
              <h2 className="landing-section-title">
                {t("landing.howTitle")}
              </h2>
              <p className="landing-section-subtitle">
                {t("landing.howSubtitle")}
              </p>
            </div>

            <div className="landing-step-grid">
              <div className="landing-step-card text-left">
                <div className="landing-step-num">1</div>
                <h3 className="font-bold text-base text-[#14131B] mb-2">
                  {t("landing.howStep1Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#5D5A6F]">
                  {t("landing.howStep1Body")}
                </p>
              </div>

              <div className="landing-step-card text-left">
                <div className="landing-step-num">2</div>
                <h3 className="font-bold text-base text-[#14131B] mb-2">
                  {t("landing.howStep2Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#5D5A6F]">
                  {t("landing.howStep2Body")}
                </p>
              </div>

              <div className="landing-step-card text-left">
                <div className="landing-step-num">3</div>
                <h3 className="font-bold text-base text-[#14131B] mb-2">
                  {t("landing.howStep3Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#5D5A6F]">
                  {t("landing.howStep3Body")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Ownership & FAQ Section */}
        <section id="privasi" className="py-16 md:py-24">
          <div className="landing-container">
            <div className="landing-faq-container">
              {/* Left Column: Data Transparency */}
              <div className="text-left bg-white border border-[#EAE6F8] rounded-3xl p-8 sm:p-10 shadow-sm">
                <span className="landing-section-badge">DATA OWNERSHIP</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14131B] mb-4">
                  {t("landing.privacyTitle")}
                </h2>
                <p className="text-sm text-[#5D5A6F] leading-relaxed mb-6">
                  {t("landing.privacySubtitle")}
                </p>

                <ul className="space-y-3.5 text-sm text-[#14131B]">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#5434ED] font-bold">✓</span>
                    <span>{t("landing.privacyBullet1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#5434ED] font-bold">✓</span>
                    <span>{t("landing.privacyBullet2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-[#5434ED] font-bold">✓</span>
                    <span>{t("landing.privacyBullet3")}</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: FAQ Accordion */}
              <div id="faq" className="text-left">
                <span className="landing-section-badge">FAQ</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14131B] mb-6">
                  {t("landing.faqTitle")}
                </h2>

                <details className="landing-faq-item">
                  <summary>{t("landing.faqQ1")}</summary>
                  <div className="landing-faq-content">{t("landing.faqA1")}</div>
                </details>

                <details className="landing-faq-item">
                  <summary>{t("landing.faqQ2")}</summary>
                  <div className="landing-faq-content">{t("landing.faqA2")}</div>
                </details>

                <details className="landing-faq-item">
                  <summary>{t("landing.faqQ3")}</summary>
                  <div className="landing-faq-content">{t("landing.faqA3")}</div>
                </details>

                <details className="landing-faq-item">
                  <summary>{t("landing.faqQ4")}</summary>
                  <div className="landing-faq-content">{t("landing.faqA4")}</div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Gradient Banner CTA */}
        <section className="py-12">
          <div className="landing-container">
            <div className="landing-banner-cta">
              <div>
                <h2 className="landing-banner-title">
                  {t("landing.ctaTitle")}
                </h2>
                <p className="text-purple-100 text-sm sm:text-base max-w-xl">
                  {t("landing.ctaSubtitle")}
                </p>
              </div>

              <div className="mt-6 lg:mt-0">
                <Link to="/login" className="landing-btn-banner">
                  {t("landing.primaryCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean White Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="landing-footer-brand">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#5434ED] text-xs font-bold text-white">
                  F
                </span>
                <span>{t("app.name")}</span>
              </Link>
              <p className="text-xs text-[#8F8B9F]">
                {t("login.footer")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#5D5A6F]">
              <Link to="/privacy" className="hover:text-[#5434ED] transition-colors">
                {t("legal.privacy")}
              </Link>
              <Link to="/terms" className="hover:text-[#5434ED] transition-colors">
                {t("legal.terms")}
              </Link>
              <Link to="/changelog" className="hover:text-[#5434ED] transition-colors">
                {t("legal.changelog")}
              </Link>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5434ED] hover:underline">
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
