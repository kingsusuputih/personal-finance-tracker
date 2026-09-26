import {
  getEffectiveCutoff,
  getEffectiveTimezone,
  getCycleInfo,
  getCycleBounds,
  currentZonedDateKey,
} from "./dateTime.js";
import { calculateCycleRecap } from "./financeFormulas.js";

function safeDiffPercent(current, previous) {
  const c = Number(current) || 0;
  const p = Number(previous) || 0;
  if (p === 0) return null;
  return Number((((c - p) / Math.abs(p)) * 100).toFixed(1));
}

function extractCycleScalars(recap, bounds, isCurrent = false) {
  return {
    cycleKey: recap.cycleKey,
    startDate: bounds.startDate,
    endDate: bounds.endDate,
    isCurrentCycle: isCurrent,
    hasMainIncome: recap.hasMainIncome,
    mainIncome: recap.mainIncome,
    additionalIncome: recap.totalAdditionalIncome,
    totalIncome: recap.totalIncome,
    needsExpenses: recap.needsExpenses,
    lifestyleExpenses: recap.lifestyleExpenses,
    consumptionExpenses: recap.consumptionExpenses,
    investmentExpenses: recap.investmentExpenses,
    totalMonthlyExpenses: recap.totalMonthlyExpenses,
    surplusBeforeInvestment: recap.surplusBeforeInvestment,
    remainingAfterInvestment: recap.remainingAfterInvestment,
    cumulativeInvestmentsAsOf: recap.cumulativeInvestments,
  };
}

export function buildChatContext({
  activeCycleKey,
  compareCycleKey = null,
  income = [],
  additionalIncome = [],
  transactions = [],
  settings = {},
  availableCycles = [],
}) {
  const timeZone = getEffectiveTimezone(settings);
  const cutoffDay = getEffectiveCutoff(settings);
  const now = new Date();
  const currentCycleInfo = getCycleInfo(now, timeZone, cutoffDay);
  const resolvedActiveKey = activeCycleKey || currentCycleInfo.cycleKey;
  const activeBounds = getCycleBounds(resolvedActiveKey, cutoffDay) || currentCycleInfo;

  const activeRecap = calculateCycleRecap({
    cycleKey: resolvedActiveKey,
    cycleStartDate: activeBounds.startDate,
    cycleEndDate: activeBounds.endDate,
    income,
    additionalIncome,
    transactions,
  });

  const active = extractCycleScalars(
    activeRecap,
    activeBounds,
    resolvedActiveKey === currentCycleInfo.cycleKey,
  );

  let compare = null;
  let comparison = null;

  if (compareCycleKey && compareCycleKey !== resolvedActiveKey) {
    const compareBounds = getCycleBounds(compareCycleKey, cutoffDay);
    if (compareBounds) {
      const compareRecap = calculateCycleRecap({
        cycleKey: compareCycleKey,
        cycleStartDate: compareBounds.startDate,
        cycleEndDate: compareBounds.endDate,
        income,
        additionalIncome,
        transactions,
      });

      compare = extractCycleScalars(
        compareRecap,
        compareBounds,
        compareCycleKey === currentCycleInfo.cycleKey,
      );

      comparison = {
        incomeDiff: active.totalIncome - compare.totalIncome,
        incomeDiffPercent: safeDiffPercent(active.totalIncome, compare.totalIncome),
        consumptionDiff: active.consumptionExpenses - compare.consumptionExpenses,
        consumptionDiffPercent: safeDiffPercent(
          active.consumptionExpenses,
          compare.consumptionExpenses,
        ),
        investmentDiff: active.investmentExpenses - compare.investmentExpenses,
        investmentDiffPercent: safeDiffPercent(
          active.investmentExpenses,
          compare.investmentExpenses,
        ),
        surplusDiff: active.surplusBeforeInvestment - compare.surplusBeforeInvestment,
      };
    }
  }

  return {
    // Legacy top-level keys for backwards compatibility
    totalIncome: active.totalIncome,
    mainIncome: active.mainIncome,
    additionalIncome: active.additionalIncome,
    consumptionExpenses: active.consumptionExpenses,
    needsExpenses: active.needsExpenses,
    lifestyleExpenses: active.lifestyleExpenses,
    investmentExpenses: active.investmentExpenses,
    surplusBeforeInvestment: active.surplusBeforeInvestment,
    remainingAfterInvestment: active.remainingAfterInvestment,
    cumulativeSaved: active.cumulativeInvestmentsAsOf,
    cycleKey: active.cycleKey,

    // Structured multi-period context
    metadata: {
      todayDate: currentZonedDateKey(now, timeZone),
      timeZone,
      cutoffDay,
      currentPaydayCycle: currentCycleInfo.cycleKey,
      availableCycles: (availableCycles || []).slice(0, 12),
    },
    active,
    compare,
    comparison,
  };
}
