import { useMemo } from "react";
import { useFinanceStore } from "../store/financeStore.js";
import { calculateBudgetProgress } from "../utils/budgetCalculations.js";
import {
  getEffectiveCutoff,
  getEffectiveTimezone,
  getCycleInfo,
} from "../utils/dateTime.js";

export function useBudgetProgress(cycleKey = null) {
  const budgets = useFinanceStore((s) => s.budgets || []);
  const transactions = useFinanceStore((s) => s.transactions || []);
  const settings = useFinanceStore((s) => s.settings);

  const targetCycle = useMemo(() => {
    if (cycleKey) return cycleKey;
    const timeZone = getEffectiveTimezone(settings);
    const cutoffDay = getEffectiveCutoff(settings);
    return getCycleInfo(new Date(), timeZone, cutoffDay).cycleKey;
  }, [cycleKey, settings]);

  const cycleBudgets = useMemo(() => {
    return budgets.filter((b) => b.cycle_key === targetCycle);
  }, [budgets, targetCycle]);

  const progress = useMemo(() => {
    return calculateBudgetProgress(cycleBudgets, transactions);
  }, [cycleBudgets, transactions]);

  const summary = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let exceededCount = 0;
    let nearCount = 0;
    let reachedCount = 0;

    progress.forEach((p) => {
      totalBudget += p.amount;
      totalSpent += p.spent;
      if (p.status === "exceeded") exceededCount += 1;
      else if (p.status === "reached") reachedCount += 1;
      else if (p.status === "near") nearCount += 1;
    });

    return {
      targetCycle,
      budgets: progress,
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      exceededCount,
      nearCount,
      reachedCount,
      hasExceeded: exceededCount > 0,
      hasWarning: exceededCount > 0 || reachedCount > 0 || nearCount > 0,
    };
  }, [progress, targetCycle]);

  return summary;
}
