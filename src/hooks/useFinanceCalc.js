import { useMemo } from "react";
import { useFinanceStore } from "../store/financeStore.js";
import {
  calculateAllocations,
  calculateFundTargets,
  calculateCycleRecap,
} from "../utils/financeFormulas.js";
import {
  getEffectiveTimezone,
  getEffectiveCutoff,
  getCycleInfo,
  getCycleBounds,
} from "../utils/dateTime.js";

export function useFinanceCalc(selectedCycleKey = null) {
  const income = useFinanceStore((s) => s.income);
  const additionalIncome = useFinanceStore((s) => s.additionalIncome || []);
  const transactions = useFinanceStore((s) => s.transactions);
  const settings = useFinanceStore((s) => s.settings);

  return useMemo(() => {
    const timeZone = getEffectiveTimezone(settings);
    const cutoffDay = getEffectiveCutoff(settings);
    const currentCycle = getCycleInfo(new Date(), timeZone, cutoffDay);
    const cycle = selectedCycleKey ? (getCycleBounds(selectedCycleKey, cutoffDay) || currentCycle) : currentCycle;
    const currentMonth = cycle.cycleKey;

    const recap = calculateCycleRecap({
      cycleKey: currentMonth,
      cycleStartDate: cycle.startDate,
      cycleEndDate: cycle.endDate,
      income,
      additionalIncome,
      transactions,
    });

    const monthlyIncome = recap.totalIncome;
    const totalMonthlyExpenses = recap.totalMonthlyExpenses;
    const allocations = calculateAllocations(monthlyIncome);
    const fundTargets = calculateFundTargets(recap.consumptionExpenses);
    const actualSpending = {
      needs: recap.needsExpenses,
      investments: recap.investmentExpenses,
      lifestyle: recap.lifestyleExpenses,
    };

    return {
      currentMonth,
      cycle,
      monthlyIncome,
      mainIncome: recap.mainIncome,
      additionalIncome: recap.totalAdditionalIncome,
      hasMainIncome: recap.hasMainIncome,
      totalMonthlyExpenses,
      allocations,
      fundTargets,
      actualSpending,
      timeZone,
      cutoffDay,
      recap,
    };
  }, [income, additionalIncome, transactions, settings, selectedCycleKey]);
}
