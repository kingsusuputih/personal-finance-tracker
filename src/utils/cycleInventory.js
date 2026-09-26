import { getCycleKeyForDate } from "./dateTime.js";

export function listAvailableCycles({
  income = [],
  additionalIncome = [],
  transactions = [],
  budgets = [],
  currentCycle = "",
  cutoffDay = 25,
} = {}) {
  const set = new Set();
  if (currentCycle && /^\d{4}-\d{2}$/.test(currentCycle)) {
    set.add(currentCycle);
  }

  income.forEach((i) => {
    if (i?.month && /^\d{4}-\d{2}$/.test(i.month)) {
      set.add(i.month);
    }
  });

  additionalIncome.forEach((a) => {
    if (a?.date) {
      const k = getCycleKeyForDate(a.date, cutoffDay);
      if (k && /^\d{4}-\d{2}$/.test(k)) set.add(k);
    }
  });

  transactions.forEach((tx) => {
    if (tx?.date) {
      const k = getCycleKeyForDate(tx.date, cutoffDay);
      if (k && /^\d{4}-\d{2}$/.test(k)) set.add(k);
    }
  });

  budgets.forEach((b) => {
    if (b?.cycle_key && /^\d{4}-\d{2}$/.test(b.cycle_key)) {
      set.add(b.cycle_key);
    }
  });

  return Array.from(set).sort().reverse();
}
