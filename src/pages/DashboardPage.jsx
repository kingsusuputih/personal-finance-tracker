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
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { useI18n } from "../i18n/LanguageProvider.jsx";
import { formatIDR } from "../utils/financeFormulas.js";
import { formatDisplayDate } from "../utils/dateTime.js";
import { PublicationConsent } from "../components/auth/PublicationConsent.jsx";
import { registerUser } from "../api/registry.js";
import { useAuthStore } from "../store/authStore.js";

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
  const { ensureSpreadsheet, loadData, provisioning, loading } =
    useSpreadsheet();
  const accessToken = useAuthStore((s) => s.accessToken);
  const calc = useFinanceCalc();
  const { lang, t } = useI18n();
  const budgetSummary = useBudgetProgress();
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [maskedName, setMaskedName] = useState("");

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData();
    });
  }, [ensureSpreadsheet, loadData]);

  useEffect(() => {
    if (accessToken && !localStorage.getItem("pft_consent_prompted")) {
      registerUser(accessToken).then((res) => {
        if (res) {
          setMaskedName(res.maskedName || "");
          if (!res.publishName) {
            setConsentOpen(true);
          } else {
            localStorage.setItem("pft_consent_prompted", "true");
          }
        }
      });
    }
  }, [accessToken]);

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

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:py-10">
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
                  </>
                )}
              </div>
              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold">
                {t("dash.title")}
              </h1>
            </header>

            {provisioning ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <section className="mb-8 grid gap-4 sm:grid-cols-2">
                  <Card className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="kbd text-[10px] text-ink-3">
                        {t("dash.monthlyIncome")}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowIncome((v) => !v)}
                        aria-label={t(
                          showIncome ? "dash.hideIncome" : "dash.showIncome",
                        )}
                        title={t(
                          showIncome ? "dash.hideIncome" : "dash.showIncome",
                        )}
                        aria-pressed={showIncome}
                        className="rounded p-1 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink">
                        {showIncome ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    <p className="amount mt-2 text-2xl font-semibold text-ink">
                      {showIncome ? formatIDR(calc.monthlyIncome) : "••••••••"}
                    </p>
                    {calc.monthlyIncome === 0 && (
                      <p className="mt-1 text-xs text-ink-3">
                        {t("dash.incomeHint")}
                      </p>
                    )}
                  </Card>
                  <Card className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="kbd text-[10px] text-ink-3">
                        {t("dash.monthlyExpenses")}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowExpenses((v) => !v)}
                        aria-label={t(
                          showExpenses
                            ? "dash.hideExpenses"
                            : "dash.showExpenses",
                        )}
                        title={t(
                          showExpenses
                            ? "dash.hideExpenses"
                            : "dash.showExpenses",
                        )}
                        aria-pressed={showExpenses}
                        className="rounded p-1 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink">
                        {showExpenses ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    <p className="amount mt-2 text-2xl font-semibold text-ink">
                      {showExpenses
                        ? formatIDR(calc.totalMonthlyExpenses)
                        : "••••••••"}
                    </p>
                  </Card>
                </section>

                <section className="mb-8">
                  <h2 className="mb-3 text-base font-semibold text-ink">
                    {t("dash.allocation")}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3">
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
                      <h2 className="text-base font-semibold text-ink">
                        {t("budget.dashTitle")}
                      </h2>
                      <Link
                        to="/recap"
                        className="text-xs font-medium text-accent hover:underline">
                        {t("budget.viewAll")}
                      </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                          <Card key={b.id || b.rowNumber} className="p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-2 border-b border-rule pb-2">
                              <span className="truncate text-sm font-semibold text-ink" title={b.name}>
                                {b.name}
                              </span>
                              <Badge tone={statusTone}>{statusLabel}</Badge>
                            </div>
                            <div className="mt-3 space-y-1.5">
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
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="mb-8">
                  <h2 className="mb-3 text-base font-semibold text-ink">
                    {t("dash.fundTargets")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
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
