import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { useFinanceStore } from "../store/financeStore.js";
import { useFinanceCalc } from "../hooks/useFinanceCalc.js";
import { groupExpenses } from "../utils/expenseGrouping.js";
import { formatIDR } from "../utils/financeFormulas.js";
import { getCycleKeyForDate, getEffectiveCutoff, getEffectiveTimezone, getCycleInfo, formatDisplayDate } from "../utils/dateTime.js";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { BudgetSection } from "../components/budget/BudgetSection.jsx";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";

const categoryTone = {
  Needs: "accent",
  Lifestyle: "warning",
  Investment: "success",
};

export default function RecapPage() {
  const t = useT();
  const { lang } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const { ensureSpreadsheet, loadData, provisioning, loading, settings } = useSpreadsheet();
  const income = useFinanceStore((s) => s.income);
  const additionalIncome = useFinanceStore((s) => s.additionalIncome || []);
  const transactions = useFinanceStore((s) => s.transactions);

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData();
    });
  }, [ensureSpreadsheet, loadData]);

  const timeZone = getEffectiveTimezone(settings);
  const cutoffDay = getEffectiveCutoff(settings);
  const currentCycleInfo = getCycleInfo(new Date(), timeZone, cutoffDay);
  const currentCycle = currentCycleInfo.cycleKey;

  const cycleParam = searchParams.get("cycle");
  const selectedCycle = cycleParam || currentCycle;

  const availableCycles = useMemo(() => {
    const set = new Set();
    set.add(currentCycle);
    income.forEach((i) => {
      if (i.month) set.add(i.month);
    });
    additionalIncome.forEach((a) => {
      if (a.date) {
        const k = getCycleKeyForDate(a.date, cutoffDay);
        if (k) set.add(k);
      }
    });
    transactions.forEach((tx) => {
      if (tx.date) {
        const k = getCycleKeyForDate(tx.date, cutoffDay);
        if (k) set.add(k);
      }
    });
    return Array.from(set).sort().reverse();
  }, [income, additionalIncome, transactions, currentCycle, cutoffDay]);

  const { recap, cycle } = useFinanceCalc(selectedCycle);

  const isActivePeriod = selectedCycle === currentCycle;

  const grouped = useMemo(() => {
    return groupExpenses(recap.cycleTransactions);
  }, [recap.cycleTransactions]);

  const handleCycleChange = (e) => {
    const val = e.target.value;
    if (val === currentCycle) {
      searchParams.delete("cycle");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cycle: val });
    }
  };

  const isSurplus = recap.surplusBeforeInvestment >= 0;
  const isRemainingPositive = recap.remainingAfterInvestment >= 0;

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:py-10">
            <header className="mb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="kbd mb-1 text-[11px] text-ink-3">
                    {t("recap.kicker")}
                  </p>
                  <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold">
                    {t("recap.title")}
                  </h1>
                  <p className="mt-2 text-sm text-ink-3">
                    {t("recap.subtitle")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="recap-period-select" className="sr-only">
                    {t("recap.selectPeriod")}
                  </label>
                  <select
                    id="recap-period-select"
                    value={selectedCycle}
                    onChange={handleCycleChange}
                    className="field text-xs font-medium sm:text-sm">
                    {availableCycles.map((c) => (
                      <option key={c} value={c}>
                        {c} {c === currentCycle ? `(${t("recap.activeBadge")})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-ink-2">
                  {t("recap.dateRange", {
                    start: formatDisplayDate(cycle.startDate, lang),
                    end: formatDisplayDate(cycle.endDate, lang),
                  })}
                </span>
                {isActivePeriod && (
                  <Badge tone="accent">{t("recap.activeBadge")}</Badge>
                )}
                {!recap.hasMainIncome && (
                  <Badge tone="warning">{t("recap.noMainIncome")}</Badge>
                )}
              </div>
            </header>

            {provisioning || loading ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                  ))}
                </div>
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <>
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="p-4 sm:p-5">
                    <div className="text-xs font-medium text-ink-3">
                      {t("recap.totalIncome")}
                    </div>
                    <div className="amount mt-1 text-xl font-bold text-ink sm:text-2xl">
                      {formatIDR(recap.totalIncome)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {t("recap.incomeBreakdown", {
                        main: formatIDR(recap.mainIncome),
                        additional: formatIDR(recap.totalAdditionalIncome),
                      })}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="text-xs font-medium text-ink-3">
                      {t("recap.consumption")}
                    </div>
                    <div className="amount mt-1 text-xl font-bold text-ink sm:text-2xl">
                      {formatIDR(recap.consumptionExpenses)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {t("recap.consumptionHint", {
                        needs: formatIDR(recap.needsExpenses),
                        lifestyle: formatIDR(recap.lifestyleExpenses),
                      })}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="text-xs font-medium text-ink-3">
                      {t("recap.periodInvest")}
                    </div>
                    <div className="amount mt-1 text-xl font-bold text-success sm:text-2xl">
                      {formatIDR(recap.investmentExpenses)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {t("allocation.target")}: {formatIDR(recap.totalIncome * 0.3)} (30%)
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="text-xs font-medium text-ink-3">
                      {isSurplus ? t("recap.statusSurplus") : t("recap.statusDeficit")}
                    </div>
                    <div
                      className={`amount mt-1 text-xl font-bold sm:text-2xl ${
                        isSurplus ? "text-success" : "text-danger"
                      }`}>
                      {formatIDR(recap.surplusBeforeInvestment)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {isSurplus ? "Pemasukan melebihi pengeluaran konsumsi" : "Pengeluaran melebihi pemasukan"}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5">
                    <div className="text-xs font-medium text-ink-3">
                      {t("recap.remainingToInvest")}
                    </div>
                    <div
                      className={`amount mt-1 text-xl font-bold sm:text-2xl ${
                        isRemainingPositive ? "text-accent" : "text-danger"
                      }`}>
                      {formatIDR(recap.remainingAfterInvestment)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {t("recap.remainingDesc")}
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-5 bg-paper-2/40">
                    <div className="text-xs font-medium text-ink-3">
                      {t("recap.cumulativeSaved")}
                    </div>
                    <div className="amount mt-1 text-xl font-bold text-ink sm:text-2xl">
                      {formatIDR(recap.cumulativeInvestments)}
                    </div>
                    <div className="mt-2 text-[11px] text-ink-3">
                      {t("recap.cumulativeSavedHint")}
                    </div>
                  </Card>
                </section>

                <BudgetSection selectedCycle={selectedCycle} />

                <section className="space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-ink sm:text-lg">
                      {t("recap.groupTitle")}
                    </h2>
                    <p className="text-xs text-ink-3">
                      {t("recap.groupDesc")}
                    </p>
                  </div>

                  {["Needs", "Lifestyle", "Investment"].map((cat) => {
                    const catGroups = Object.values(grouped[cat] || {});
                    const catTotal = catGroups.reduce((acc, g) => acc + g.total, 0);

                    return (
                      <Card key={cat} className="overflow-hidden p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between border-b border-rule pb-2">
                          <div className="flex items-center gap-2">
                            <Badge tone={categoryTone[cat] || "neutral"}>{cat}</Badge>
                            <span className="text-xs text-ink-3">
                              ({catGroups.length} kelompok)
                            </span>
                          </div>
                          <div className="amount text-sm font-semibold text-ink sm:text-base">
                            {formatIDR(catTotal)}
                          </div>
                        </div>

                        {catGroups.length === 0 ? (
                          <p className="py-2 text-xs text-ink-3">{t("recap.emptyCategory")}</p>
                        ) : (
                          <div className="divide-y divide-rule/60">
                            {catGroups.map((g) => (
                              <details key={g.name} className="group py-2.5">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 hover:bg-paper-2/40 rounded px-1 py-1 transition-colors">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <svg
                                      className="h-3.5 w-3.5 shrink-0 text-ink-3 transition-transform group-open:rotate-90"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2">
                                      <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                    <span className="text-sm font-medium text-ink truncate">
                                      {g.name}
                                    </span>
                                    <span className="kbd text-[10px] text-ink-3">
                                      {t("recap.txCount", { count: g.count })}
                                    </span>
                                  </div>
                                  <span className="amount text-sm font-semibold text-ink shrink-0">
                                    {formatIDR(g.total)}
                                  </span>
                                </summary>

                                <div className="mt-2 pl-6 pr-2">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-rule text-left text-[10px] text-ink-3">
                                        <th className="py-1 font-medium">{t("table.date")}</th>
                                        <th className="py-1 font-medium">{t("table.description")}</th>
                                        <th className="py-1 text-right font-medium">{t("table.amount")}</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-rule/40">
                                      {g.items.map((item) => (
                                        <tr key={item.id || item.rowNumber} className="text-ink-2">
                                          <td className="py-1.5 whitespace-nowrap text-ink-3">{item.date}</td>
                                          <td className="py-1.5">{item.description || "—"}</td>
                                          <td className="py-1.5 text-right font-medium text-ink">
                                            {formatIDR(item.amount)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </details>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </section>

                <div className="pt-4 text-center">
                  <Link
                    to="/ledger"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t("recap.goToLedger")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
