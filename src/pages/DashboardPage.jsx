import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { useFinanceCalc } from "../hooks/useFinanceCalc.js";
import { useBudgetProgress } from "../hooks/useBudgetProgress.js";
import { AllocationCard } from "../components/dashboard/AllocationCard.jsx";
import { FundTargetCard } from "../components/dashboard/FundTargetCard.jsx";
import { SpendingChart } from "../components/dashboard/SpendingChart.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { useI18n } from "../i18n/LanguageProvider.jsx";
import { formatIDR } from "../utils/financeFormulas.js";
import { formatDisplayDate, getCycleDayProgress } from "../utils/dateTime.js";
import { PublicationConsent } from "../components/auth/PublicationConsent.jsx";
import { registerUser } from "../api/registry.js";
import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore, isAccountEmpty } from "../store/financeStore.js";
import { ExpenseForm } from "../components/ledger/ExpenseForm.jsx";

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default function DashboardPage() {
  const { ensureSpreadsheet, loadData, provisioning, loading, isReady, loadError } =
    useSpreadsheet();
  const accessToken = useAuthStore((s) => s.accessToken);
  const calc = useFinanceCalc();
  const { lang, t } = useI18n();
  const budgetSummary = useBudgetProgress();
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [maskedName, setMaskedName] = useState("");
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const transactions = useFinanceStore((s) => s.transactions);
  const income = useFinanceStore((s) => s.income);
  const additionalIncome = useFinanceStore((s) => s.additionalIncome);
  const budgets = useFinanceStore((s) => s.budgets);

  useEffect(() => {
    ensureSpreadsheet()
      .then((id) => {
        if (id) return loadData();
      })
      .catch(() => {});
  }, [ensureSpreadsheet, loadData]);

  useEffect(() => {
    if (!accessToken) return;
    registerUser(accessToken)
      .then((res) => {
        if (res) {
          setMaskedName(res.maskedName || "");
          if (res.publishName) {
            localStorage.setItem("pft_consent_prompted", "true");
          }
        }
      })
      .catch(() => {});
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !isReady) return;
    if (localStorage.getItem("pft_consent_prompted")) return;

    const hasHistory =
      transactions.length > 0 || income.length > 0 || additionalIncome.length > 0;
    const isReturnVisit = sessionStorage.getItem("pft_dash_visited");

    if (hasHistory && isReturnVisit && maskedName) {
      setConsentOpen(true);
    } else {
      sessionStorage.setItem("pft_dash_visited", "true");
    }
  }, [
    accessToken,
    isReady,
    transactions.length,
    income.length,
    additionalIncome.length,
    maskedName,
  ]);

  const isEmptyAccount = isAccountEmpty({
    isReady,
    income,
    additionalIncome,
    transactions,
    budgets,
  });

  const showOnboarding = isEmptyAccount && !onboardingDismissed;

  const allocationCards = [
    {
      key: "needs",
      label: "Needs",
      percent: 50,
      targetAmount: calc.allocations.needs,
      actualAmount: calc.actualSpending.needs,
    },
    {
      key: "investments",
      label: "Investments",
      percent: 30,
      targetAmount: calc.allocations.investments,
      actualAmount: calc.actualSpending.investments,
    },
    {
      key: "lifestyle",
      label: "Lifestyle",
      percent: 20,
      targetAmount: calc.allocations.lifestyle,
      actualAmount: calc.actualSpending.lifestyle,
    },
  ];

  const chartData = [
    { name: "Needs", value: calc.actualSpending.needs },
    { name: "Lifestyle", value: calc.actualSpending.lifestyle },
    { name: "Investment", value: calc.actualSpending.investments },
  ];

  const dayProgress = getCycleDayProgress(
    calc.cycle?.startDate,
    calc.cycle?.endDate,
    calc.timeZone,
  );

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:pt-10 md:pb-32 lg:pb-12">
            <header className="mb-8">
              <div className="kbd mb-1 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-3">
                <span className="font-semibold text-ink-2">{calc.currentMonth}</span>
                {calc.cycle?.startDate && calc.cycle?.endDate && (
                  <>
                    <span>·</span>
                    <span>
                      {t("dash.activePeriod", {
                        start: formatDisplayDate(calc.cycle.startDate, lang),
                        end: formatDisplayDate(calc.cycle.endDate, lang),
                      })}
                    </span>
                    {dayProgress?.isCurrent && (
                      <>
                        <span>·</span>
                        <span className="font-medium text-accent">
                          {dayProgress.remainingDays === 0
                            ? t("dash.dayProgressZero", {
                                current: dayProgress.currentDay,
                                total: dayProgress.totalDays,
                              })
                            : t("dash.dayProgress", {
                                current: dayProgress.currentDay,
                                total: dayProgress.totalDays,
                                remaining: dayProgress.remainingDays,
                              })}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl lg:text-[clamp(1.75rem,4vw,2.5rem)]">
                {t("dash.title")}
              </h1>
            </header>

            {loadError && !isReady ? (
              <Card className="p-6 text-center">
                <p className="text-sm font-semibold text-danger">{loadError}</p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      ensureSpreadsheet()
                        .then((id) => {
                          if (id) return loadData();
                        })
                        .catch(() => {});
                    }}>
                    {t("common.retry")}
                  </Button>
                </div>
              </Card>
            ) : provisioning || (!isReady && loading) ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                {showOnboarding && (
                  <section className="mb-8 rounded-card border border-rule bg-paper p-5 sm:p-6 shadow-sm">
                    <div className="max-w-xl">
                      <p className="kbd text-[11px] text-accent">
                        {t("dash.firstTxKicker")}
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">
                        {t("dash.firstTxTitle")}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-ink-3">
                        {t("dash.firstTxDesc")}
                      </p>
                    </div>
                    <div className="mt-5 max-w-xl">
                      <ExpenseForm onSuccess={() => setOnboardingDismissed(true)} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-3">
                      <span>{t("dash.orIncome")}</span>
                      <Link
                        to="/ledger"
                        className="font-medium text-accent hover:underline">
                        {t("dash.recordIncomeFirst")} →
                      </Link>
                    </div>
                  </section>
                )}

                {/* Primary Financial Overview - Connected 3-Cell Command Hub */}
                <section className="mb-8">
                  <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
                    {/* Monthly Income */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <p className="kbd text-[10px] text-ink-3 uppercase tracking-wider">
                          {t("dash.monthlyIncome")}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowIncome((v) => !v)}
                          aria-label={t(showIncome ? "dash.hideIncome" : "dash.showIncome")}
                          title={t(showIncome ? "dash.hideIncome" : "dash.showIncome")}
                          aria-pressed={showIncome}
                          className="rounded p-1 text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink">
                          {showIncome ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="amount text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                          {showIncome ? formatIDR(calc.monthlyIncome) : "••••••••"}
                        </p>
                        {calc.monthlyIncome === 0 ? (
                          <p className="mt-1 text-xs text-ink-3">
                            {t("dash.incomeHint")}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-ink-3">
                            {calc.currentMonth}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Monthly Expenses */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <p className="kbd text-[10px] text-ink-3 uppercase tracking-wider">
                          {t("dash.monthlyExpenses")}
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowExpenses((v) => !v)}
                          aria-label={t(showExpenses ? "dash.hideExpenses" : "dash.showExpenses")}
                          title={t(showExpenses ? "dash.hideExpenses" : "dash.showExpenses")}
                          aria-pressed={showExpenses}
                          className="rounded p-1 text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink">
                          {showExpenses ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                      <div className="mt-3">
                        <p className="amount text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                          {showExpenses
                            ? formatIDR(calc.totalMonthlyExpenses)
                            : "••••••••"}
                        </p>
                        <p className="mt-1 text-xs text-ink-3">
                          {calc.monthlyIncome > 0 && showIncome && showExpenses
                            ? `${Math.round((calc.totalMonthlyExpenses / calc.monthlyIncome) * 100)}% of income`
                            : "Recorded spending"}
                        </p>
                      </div>
                    </div>

                    {/* Net Cashflow / Balance */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between bg-paper-2/30">
                      <div className="flex items-center justify-between gap-2">
                        <p className="kbd text-[10px] text-ink-3 uppercase tracking-wider">
                          Net Balance
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            calc.monthlyIncome - calc.totalMonthlyExpenses >= 0
                              ? "bg-success-soft text-success"
                              : "bg-danger-soft text-danger"
                          }`}>
                          {calc.monthlyIncome - calc.totalMonthlyExpenses >= 0
                            ? "Surplus"
                            : "Deficit"}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p
                          className={`amount text-2xl sm:text-3xl font-bold tracking-tight ${
                            calc.monthlyIncome - calc.totalMonthlyExpenses >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}>
                          {showIncome && showExpenses
                            ? formatIDR(calc.monthlyIncome - calc.totalMonthlyExpenses)
                            : "••••••••"}
                        </p>
                        <p className="mt-1 text-xs text-ink-3">
                          {calc.monthlyIncome - calc.totalMonthlyExpenses >= 0
                            ? "Available for investment/savings"
                            : "Spending exceeds income"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 50/30/20 Allocation - Connected 3-Cell Frame */}
                <section className="mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("dash.allocation")}
                    </h2>
                    <span className="kbd text-[10px] text-ink-3">50 / 30 / 20 Rule</span>
                  </div>
                  <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
                    {allocationCards.map((c) => (
                      <AllocationCard
                        key={c.key}
                        {...c}
                        showTarget={showIncome}
                        showSpent={showExpenses}
                      />
                    ))}
                  </div>
                </section>

                {budgetSummary.budgets.length > 0 && (
                  <section className="mb-8">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-base font-bold text-ink tracking-tight">
                        {t("budget.dashTitle")}
                      </h2>
                      <Link
                        to="/recap"
                        className="text-xs font-semibold text-accent hover:underline">
                        {t("budget.viewAll")}
                      </Link>
                    </div>
                    <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden divide-y divide-rule">
                      {budgetSummary.budgets.map((b) => {
                        const barWidth = Math.min(b.ratio * 100, 100);
                        const statusTone =
                          b.status === "exceeded" || b.status === "reached"
                            ? "danger"
                            : b.status === "near"
                            ? "warning"
                            : "success";
                        const statusLabel =
                          b.status === "exceeded"
                            ? t("budget.statusExceeded")
                            : b.status === "reached"
                            ? t("budget.statusReached")
                            : b.status === "near"
                            ? t("budget.statusNear")
                            : t("budget.statusSafe");

                        return (
                          <div key={b.id || b.rowNumber} className="p-4 sm:p-5 hover:bg-paper-2/30 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="truncate text-sm font-bold text-ink" title={b.name}>
                                {b.name}
                              </span>
                              <Badge tone={statusTone}>{statusLabel}</Badge>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-baseline justify-between text-xs">
                                <span className="text-ink-3">{t("budget.spent")}:</span>
                                <span className="amount font-semibold text-ink">
                                  {showExpenses ? formatIDR(b.spent) : "••••••••"}{" "}
                                  <span className="text-[10px] text-ink-3 font-normal">
                                    / {showExpenses ? formatIDR(b.amount) : "••••••••"}
                                  </span>
                                </span>
                              </div>
                              <div
                                role="progressbar"
                                aria-valuenow={b.spent}
                                aria-valuemin={0}
                                aria-valuemax={b.amount}
                                aria-label={b.name}
                                className="h-2 w-full overflow-hidden rounded-full bg-paper-3">
                                <div
                                  style={{ width: `${barWidth}%` }}
                                  className={`h-full transition-[width] duration-300 ${
                                    b.status === "exceeded" || b.status === "reached"
                                      ? "bg-danger"
                                      : b.status === "near"
                                      ? "bg-warning"
                                      : "bg-success"
                                  }`}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="kbd text-ink-3">{Math.round(b.ratio * 100)}%</span>
                                <span
                                  className={`amount font-medium ${
                                    b.over ? "text-danger" : "text-ink-2"
                                  }`}>
                                  {showExpenses
                                    ? b.over
                                      ? `${t("budget.over")} ${formatIDR(Math.abs(b.remaining))}`
                                      : `${t("budget.remaining")} ${formatIDR(b.remaining)}`
                                    : "••••••••"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Fund Targets - Connected 2-Cell Frame */}
                <section className="mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("dash.fundTargets")}
                    </h2>
                    <span className="kbd text-[10px] text-ink-3">6× & 300× Metrics</span>
                  </div>
                  <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-rule">
                    <FundTargetCard
                      label={t("dash.emergency")}
                      multiplier={6}
                      targetAmount={calc.fundTargets.emergencyFund}
                      showAmount={showExpenses}
                    />
                    <FundTargetCard
                      label={t("dash.retirement")}
                      multiplier={300}
                      targetAmount={calc.fundTargets.retirementFund}
                      showAmount={showExpenses}
                    />
                  </div>
                </section>

                <SpendingChart
                  data={chartData}
                  loading={loading}
                  showAmount={showExpenses}
                />
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
      <PublicationConsent
        open={consentOpen}
        maskedName={maskedName}
        onClose={() => {
          localStorage.setItem("pft_consent_prompted", "true");
          setConsentOpen(false);
        }}
        onSaved={() => {
          localStorage.setItem("pft_consent_prompted", "true");
          setConsentOpen(false);
        }}
      />
    </div>
  );
}
