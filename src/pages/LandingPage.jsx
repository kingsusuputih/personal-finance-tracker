import { useState } from "react";
import { Link } from "react-router-dom";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";
import { LangToggle } from "../components/ui/LangToggle.jsx";
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
    <div className="min-h-dvh bg-[#F8FAFF] text-[#586174] font-body relative overflow-x-clip selection:bg-blue-100 selection:text-blue-900 before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:h-[650px] before:bg-[radial-gradient(circle_at_65%_20%,rgba(37,99,235,0.12)_0%,rgba(248,250,255,0)_70%)] before:pointer-events-none before:z-0">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#F8FAFF]/85 backdrop-blur-md border-b border-blue-50/80 transition-all">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex items-center justify-between h-[4.25rem]">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
              title={t("app.name")}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white shadow-sm">
                F
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-[#141824]">
                {t("app.name")}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-sm font-medium text-[#586174] hover:text-accent transition-colors">
                {t("landing.navFeatures")}
              </a>
              <a href="#cara-kerja" className="text-sm font-medium text-[#586174] hover:text-accent transition-colors">
                {t("landing.navHowItWorks")}
              </a>
              <a href="#privasi" className="text-sm font-medium text-[#586174] hover:text-accent transition-colors">
                {t("landing.navTransparency")}
              </a>
              <a href="#faq" className="text-sm font-medium text-[#586174] hover:text-accent transition-colors">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <LangToggle />
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-strong text-white font-semibold px-6 text-sm h-11 shadow-[0_4px_14px_-2px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_20px_-3px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                {t("landing.navLogin")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-12 pb-20 lg:pt-18 lg:pb-28">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[11fr_13fr] items-center gap-14 lg:gap-10">
              {/* Left Column: Headlines & CTA */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0E7FF] shadow-[0_2px_6px_rgba(37,99,235,0.06)] text-xs font-semibold text-accent mb-6">
                  <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[0.65rem] uppercase tracking-wider font-bold">
                    NEW
                  </span>
                  <span>{t("landing.heroKicker")}</span>
                </div>

                <h1 className="font-display text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-extrabold tracking-tight leading-[1.1] text-[#141824] mb-5">
                  {t("landing.heroTitleLead")}{" "}
                  <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
                    {t("landing.heroTitleAccent")}
                  </span>
                </h1>

                <p className="text-base sm:text-[1.125rem] leading-relaxed text-[#586174] mb-8 max-w-[500px]">
                  {t("landing.heroSubtitle")}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-5">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-strong text-white font-semibold px-8 text-[0.9375rem] h-[3.25rem] shadow-[0_4px_14px_-2px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_20px_-3px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                    {t("landing.primaryCta")} →
                  </Link>
                  <a
                    href="#cara-kerja"
                    className="inline-flex items-center justify-center rounded-full bg-white hover:bg-[#F3F7FF] text-[#141824] border border-[#E2E8F0] hover:border-[#BFDBFE] font-semibold px-7 text-[0.9375rem] h-[3.25rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                    {t("landing.secondaryCta")}
                  </a>
                </div>

                <p className="text-xs text-[#8B93A7] flex items-center gap-1.5 mb-6">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t("landing.ctaNote")}
                </p>

                {formattedUserCount && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E2E8F8] px-3.5 py-1.5 text-xs text-[#586174] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t("landing.userCount", { count: formattedUserCount })}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Tilted Dashboard Preview */}
              <div className="relative w-full">
                <div
                  className="absolute -top-6 -right-6 w-18 h-18 rounded-full bg-[radial-gradient(circle_at_35%_35%,#60A5FA_0%,#2563EB_75%,#1D4ED8_100%)] shadow-[0_12px_28px_rgba(37,99,235,0.35)] z-20 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-5 -left-5 w-14 h-14 rounded-full bg-[radial-gradient(circle_at_35%_35%,#93C5FD_0%,#3B82F6_80%)] shadow-[0_10px_24px_rgba(59,130,246,0.3)] z-20 pointer-events-none"
                  aria-hidden="true"
                />

                <div className="bg-white rounded-3xl border border-[#E2E8F8] shadow-[0_25px_50px_-12px_rgba(37,99,235,0.15),0_8px_24px_rgba(0,0,0,0.04)] p-6 relative z-10 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:[transform:perspective(1200px)_rotateY(-4deg)_rotateX(3deg)_scale(1.02)] lg:hover:[transform:perspective(1200px)_rotateY(-1deg)_rotateX(1deg)_scale(1.03)] lg:hover:shadow-[0_35px_65px_-15px_rgba(37,99,235,0.22)]">
                  {/* Mockup Dashboard Header */}
                  <div className="flex items-center justify-between border-b border-[#F0F4FF] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                      <span className="text-xs font-bold text-[#141824]">Personal Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8B93A7]">
                      <span className="px-2 py-0.5 rounded-full bg-[#EFFDF5] text-emerald-700 font-semibold border border-emerald-200">
                        Google Sheets Connected
                      </span>
                    </div>
                  </div>

                  {/* 3 Metrics Cards */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    <div className="rounded-xl bg-[#F8FAFF] border border-[#E2E8F8] p-2.5 text-left">
                      <p className="text-[10px] text-[#8B93A7] font-medium">Income</p>
                      <p className="text-xs sm:text-sm font-bold text-[#141824] mt-0.5 amount">Rp 12.500.000</p>
                      <span className="text-[9px] text-emerald-600 font-semibold">Active Cycle</span>
                    </div>
                    <div className="rounded-xl bg-[#F8FAFF] border border-[#E2E8F8] p-2.5 text-left">
                      <p className="text-[10px] text-[#8B93A7] font-medium">Expenses</p>
                      <p className="text-xs sm:text-sm font-bold text-[#141824] mt-0.5 amount">Rp 7.850.000</p>
                      <span className="text-[9px] text-accent font-semibold">62.8% used</span>
                    </div>
                    <div className="rounded-xl bg-[#EFFDF5] border border-emerald-100 p-2.5 text-left">
                      <p className="text-[10px] text-emerald-700 font-medium">Net Surplus</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-900 mt-0.5 amount">+Rp 4.650.000</p>
                      <span className="text-[9px] text-emerald-600 font-semibold">On Track</span>
                    </div>
                  </div>

                  {/* 50/30/20 Allocation Meter */}
                  <div className="rounded-xl bg-white border border-[#E2E8F8] p-3 mb-4 text-left shadow-sm">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-bold text-[#141824]">50 / 30 / 20 Budget Health</span>
                      <span className="text-[11px] text-accent font-bold">Optimal</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#EFF6FF] overflow-hidden flex mb-2">
                      <div className="h-full bg-accent w-[50%]" title="Needs: 50%" />
                      <div className="h-full bg-emerald-500 w-[30%]" title="Investments: 30%" />
                      <div className="h-full bg-amber-400 w-[20%]" title="Lifestyle: 20%" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8B93A7]">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Needs (50%)
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
                  <div className="rounded-xl bg-[#F8FAFF] border border-[#E2E8F8] p-3 text-left">
                    <p className="text-[11px] font-bold text-[#141824] mb-2">Recent Transactions</p>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-[#EFF6FF]">
                        <span className="text-[#141824] font-body">Monthly Groceries</span>
                        <span className="text-rose-600 font-bold amount">-Rp 450.000</span>
                      </div>
                      <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-[#EFF6FF]">
                        <span className="text-[#141824] font-body">Mutual Fund Index</span>
                        <span className="text-emerald-600 font-bold amount">+Rp 1.000.000</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[10px] text-[#8B93A7]">
                    {t("landing.previewCaption")}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Value Strip */}
            <div className="bg-white rounded-3xl border border-[#E2E8F8] shadow-[0_4px_16px_-2px_rgba(37,99,235,0.06)] px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-4 mb-20">
              <div className="flex flex-col items-start">
                <span className="font-display text-[1.25rem] font-bold text-[#141824] tabular-nums mb-0.5">
                  {t("landing.stripStorage")}
                </span>
                <span className="text-xs text-[#8B93A7]">{t("landing.stripStorageDesc")}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-display text-[1.25rem] font-bold text-[#141824] tabular-nums mb-0.5">
                  {t("landing.stripBudget")}
                </span>
                <span className="text-xs text-[#8B93A7]">{t("landing.stripBudgetDesc")}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-display text-[1.25rem] font-bold text-[#141824] tabular-nums mb-0.5">
                  {t("landing.stripFunds")}
                </span>
                <span className="text-xs text-[#8B93A7]">{t("landing.stripFundsDesc")}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-display text-[1.25rem] font-bold text-[#141824] tabular-nums mb-0.5">
                  {t("landing.stripLang")}
                </span>
                <span className="text-xs text-[#8B93A7]">{t("landing.stripLangDesc")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Row (Pastel Bento Cards) */}
        <section id="fitur" className="py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="text-center max-w-[640px] mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                FEATURES
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141824] mb-4">
                {t("landing.featuresTitle")}
              </h2>
              <p className="text-base leading-relaxed text-[#586174]">
                {t("landing.featuresSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1: Soft Blue / Cobalt */}
              <div className="rounded-2xl p-7 flex flex-col justify-start transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.08)] border border-black/[0.03] bg-[#EFF6FF] text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] text-accent">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-1.5">
                  {t("landing.featQuickTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#586174]">
                  {t("landing.featQuickBody")}
                </p>
              </div>

              {/* Feature 2: Peach / Orange */}
              <div className="rounded-2xl p-7 flex flex-col justify-start transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.08)] border border-black/[0.03] bg-[#FFF6ED] text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] text-[#EA580C]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-1.5">
                  {t("landing.featAllocTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#586174]">
                  {t("landing.featAllocBody")}
                </p>
              </div>

              {/* Feature 3: Mint / Green */}
              <div className="rounded-2xl p-7 flex flex-col justify-start transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.08)] border border-black/[0.03] bg-[#F0FDF4] text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] text-[#16A34A]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-1.5">
                  {t("landing.featChartTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#586174]">
                  {t("landing.featChartBody")}
                </p>
              </div>

              {/* Feature 4: Sky / Cyan */}
              <div className="rounded-2xl p-7 flex flex-col justify-start transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(37,99,235,0.08)] border border-black/[0.03] bg-[#F0F9FF] text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] text-[#0284C7]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-1.5">
                  {t("landing.featFundsTitle")}
                </h3>
                <p className="text-xs leading-relaxed text-[#586174]">
                  {t("landing.featFundsBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail 1: Pencatatan Transaksi */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
              {/* Product Visual */}
              <div className="bg-white rounded-3xl border border-[#E2E8F8] shadow-[0_16px_36px_-8px_rgba(37,99,235,0.1),0_4px_12px_rgba(0,0,0,0.03)] p-7 relative">
                <img
                  src="/preview-ledger.svg"
                  alt="Preview Pencatatan Transaksi"
                  width="760"
                  height="520"
                  loading="lazy"
                  className="w-full rounded-xl"
                />
                <p className="mt-2 text-center text-[10px] text-[#8B93A7]">
                  {t("landing.previewCaption")}
                </p>
              </div>

              {/* Text Info */}
              <div className="text-left">
                <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                  {t("landing.detailLedgerBadge")}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141824] mb-4">
                  {t("landing.detailLedgerTitle")}
                </h2>
                <p className="text-base leading-relaxed text-[#586174] mb-6">
                  {t("landing.detailLedgerSubtitle")}
                </p>

                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailLedgerPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailLedgerPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailLedgerPoint3")}</span>
                  </li>
                </ul>

                <a
                  href="#cara-kerja"
                  className="inline-flex items-center justify-center rounded-full bg-white hover:bg-[#F3F7FF] text-[#141824] border border-[#E2E8F0] hover:border-[#BFDBFE] font-semibold px-7 text-[0.9375rem] h-[3.25rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                  {t("landing.secondaryCta")} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Product Detail 2: Rekap & Target Dana */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
              {/* Text Info (Left on desktop) */}
              <div className="text-left order-2 lg:order-1">
                <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                  {t("landing.detailRecapBadge")}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141824] mb-4">
                  {t("landing.detailRecapTitle")}
                </h2>
                <p className="text-base leading-relaxed text-[#586174] mb-6">
                  {t("landing.detailRecapSubtitle")}
                </p>

                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailRecapPoint1")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailRecapPoint2")}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#141824]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white text-[11px] font-bold">
                      ✓
                    </span>
                    <span>{t("landing.detailRecapPoint3")}</span>
                  </li>
                </ul>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-accent hover:bg-accent-strong text-white font-semibold px-8 text-[0.9375rem] h-[3.25rem] shadow-[0_4px_14px_-2px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_20px_-3px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap">
                  {t("landing.primaryCta")} →
                </Link>
              </div>

              {/* Visual (Right on desktop) */}
              <div className="bg-white rounded-3xl border border-[#E2E8F8] shadow-[0_16px_36px_-8px_rgba(37,99,235,0.1),0_4px_12px_rgba(0,0,0,0.03)] p-7 relative order-1 lg:order-2">
                <img
                  src="/preview-dashboard.svg"
                  alt="Preview Dashboard dan Rekap"
                  width="1200"
                  height="760"
                  loading="lazy"
                  className="w-full rounded-xl"
                />
                <p className="mt-2 text-center text-[10px] text-[#8B93A7]">
                  {t("landing.previewCaption")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="cara-kerja" className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="text-center max-w-[640px] mx-auto mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                ONBOARDING
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141824] mb-4">
                {t("landing.howTitle")}
              </h2>
              <p className="text-base leading-relaxed text-[#586174]">
                {t("landing.howSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F8] shadow-[0_4px_16px_-2px_rgba(37,99,235,0.05)] p-8 relative transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_16px_36px_-8px_rgba(37,99,235,0.12)] text-left">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-accent font-bold flex items-center justify-center text-lg mb-6">
                  1
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-2">
                  {t("landing.howStep1Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#586174]">
                  {t("landing.howStep1Body")}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F8] shadow-[0_4px_16px_-2px_rgba(37,99,235,0.05)] p-8 relative transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_16px_36px_-8px_rgba(37,99,235,0.12)] text-left">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-accent font-bold flex items-center justify-center text-lg mb-6">
                  2
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-2">
                  {t("landing.howStep2Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#586174]">
                  {t("landing.howStep2Body")}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F8] shadow-[0_4px_16px_-2px_rgba(37,99,235,0.05)] p-8 relative transition-all duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_16px_36px_-8px_rgba(37,99,235,0.12)] text-left">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-accent font-bold flex items-center justify-center text-lg mb-6">
                  3
                </div>
                <h3 className="font-bold text-base text-[#141824] mb-2">
                  {t("landing.howStep3Title")}
                </h3>
                <p className="text-sm leading-relaxed text-[#586174]">
                  {t("landing.howStep3Body")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Ownership & FAQ Section */}
        <section id="privasi" className="py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 items-start">
              {/* Left Column: Data Transparency */}
              <div className="text-left bg-white border border-[#E2E8F8] rounded-3xl p-8 sm:p-10 shadow-sm">
                <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                  DATA OWNERSHIP
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141824] mb-4">
                  {t("landing.privacyTitle")}
                </h2>
                <p className="text-sm text-[#586174] leading-relaxed mb-6">
                  {t("landing.privacySubtitle")}
                </p>

                <ul className="space-y-3.5 text-sm text-[#141824]">
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

              {/* Right Column: FAQ Accordion */}
              <div id="faq" className="text-left">
                <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
                  FAQ
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141824] mb-6">
                  {t("landing.faqTitle")}
                </h2>

                <details className="group bg-white border border-[#E2E8F8] hover:border-[#BFDBFE] rounded-2xl mb-3.5 overflow-hidden transition-colors">
                  <summary className="px-6 py-5 font-semibold text-[#141824] cursor-pointer list-none flex justify-between items-center select-none [&::-webkit-details-marker]:hidden after:content-['+'] after:text-xl after:font-normal after:text-accent after:transition-transform after:duration-200 group-open:after:rotate-45">
                    {t("landing.faqQ1")}
                  </summary>
                  <div className="px-6 pb-5 text-[0.9375rem] leading-relaxed text-[#586174]">
                    {t("landing.faqA1")}
                  </div>
                </details>

                <details className="group bg-white border border-[#E2E8F8] hover:border-[#BFDBFE] rounded-2xl mb-3.5 overflow-hidden transition-colors">
                  <summary className="px-6 py-5 font-semibold text-[#141824] cursor-pointer list-none flex justify-between items-center select-none [&::-webkit-details-marker]:hidden after:content-['+'] after:text-xl after:font-normal after:text-accent after:transition-transform after:duration-200 group-open:after:rotate-45">
                    {t("landing.faqQ2")}
                  </summary>
                  <div className="px-6 pb-5 text-[0.9375rem] leading-relaxed text-[#586174]">
                    {t("landing.faqA2")}
                  </div>
                </details>

                <details className="group bg-white border border-[#E2E8F8] hover:border-[#BFDBFE] rounded-2xl mb-3.5 overflow-hidden transition-colors">
                  <summary className="px-6 py-5 font-semibold text-[#141824] cursor-pointer list-none flex justify-between items-center select-none [&::-webkit-details-marker]:hidden after:content-['+'] after:text-xl after:font-normal after:text-accent after:transition-transform after:duration-200 group-open:after:rotate-45">
                    {t("landing.faqQ3")}
                  </summary>
                  <div className="px-6 pb-5 text-[0.9375rem] leading-relaxed text-[#586174]">
                    {t("landing.faqA3")}
                  </div>
                </details>

                <details className="group bg-white border border-[#E2E8F8] hover:border-[#BFDBFE] rounded-2xl mb-3.5 overflow-hidden transition-colors">
                  <summary className="px-6 py-5 font-semibold text-[#141824] cursor-pointer list-none flex justify-between items-center select-none [&::-webkit-details-marker]:hidden after:content-['+'] after:text-xl after:font-normal after:text-accent after:transition-transform after:duration-200 group-open:after:rotate-45">
                    {t("landing.faqQ4")}
                  </summary>
                  <div className="px-6 pb-5 text-[0.9375rem] leading-relaxed text-[#586174]">
                    {t("landing.faqA4")}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Gradient Banner CTA */}
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-[2rem] px-8 py-14 sm:py-16 sm:px-14 text-white relative overflow-hidden shadow-[0_24px_50px_-10px_rgba(37,99,235,0.38)] mb-24 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-6">
              <div>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                  {t("landing.ctaTitle")}
                </h2>
                <p className="text-blue-100 text-sm sm:text-base max-w-xl">
                  {t("landing.ctaSubtitle")}
                </p>
              </div>

              <div className="mt-4 lg:mt-0">
                <Link
                  to="/login"
                  className="bg-white text-accent hover:bg-blue-50 font-bold rounded-full px-9 h-[3.25rem] inline-flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition-all duration-200 whitespace-nowrap">
                  {t("landing.primaryCta")} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean White Footer */}
      <footer className="border-t border-[#E2E8F8] bg-white py-12 text-sm text-[#586174]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="font-display font-bold text-lg text-[#141824] flex items-center gap-2 mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
                  F
                </span>
                <span>{t("app.name")}</span>
              </Link>
              <p className="text-xs text-[#8B93A7]">
                {t("login.footer")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#586174]">
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
