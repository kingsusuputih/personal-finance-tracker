import { useMemo } from "react";
import { useFinanceStore } from "../store/financeStore.js";
import {
  calculateAllocations,
  calculateFundTargets,
} from "../utils/financeFormulas.js";
import {
  getEffectiveTimezone,
  getEffectiveCutoff,
  getCycleInfo,
} from "../utils/dateTime.js";

export function useFinanceCalc() {
  const income = useFinanceStore((s) => s.income);
  const transactions = useFinanceStore((s) => s.transactions);
  const settings = useFinanceStore((s) => s.settings);

  return useMemo(() => {
    const timeZone = getEffectiveTimezone(settings);
    const cutoffDay = getEffectiveCutoff(settings);
    const cycle = getCycleInfo(new Date(), timeZone, cutoffDay);
    const currentMonth = cycle.cycleKey;

    const monthIncomes = income.filter((r) => r.month === currentMonth);
    const monthlyIncome = monthIncomes.length
      ? monthIncomes[monthIncomes.length - 1].amount
      : 0;

    const cycleTransactions = transactions.filter(
      (t) => t.date >= cycle.startDate && t.date <= cycle.endDate,
    );
    const totalMonthlyExpenses = cycleTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0,
    );
    const allocations = calculateAllocations(monthlyIncome);
    const fundTargets = calculateFundTargets(totalMonthlyExpenses);
    const actualSpending = {
      needs: cycleTransactions
        .filter((t) => t.category === "Needs")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      investments: cycleTransactions
        .filter((t) => t.category === "Investment")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      lifestyle: cycleTransactions
        .filter((t) => t.category === "Lifestyle")
        .reduce((sum, t) => sum + (t.amount || 0), 0),
    };

    return {
      currentMonth,
      cycle,
      monthlyIncome,
      totalMonthlyExpenses,
      allocations,
      fundTargets,
      actualSpending,
      timeZone,
      cutoffDay,
    };
  }, [income, transactions, settings]);
}
