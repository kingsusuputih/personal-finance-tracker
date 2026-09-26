import { getCycleBounds } from "./dateTime.js";
import { resolveExpenseGroupKey } from "./expenseGrouping.js";

export function getBudgetStatus(spent, amount) {
  const cap = Number(amount) || 0;
  const current = Number(spent) || 0;
  if (cap <= 0) return current > 0 ? "exceeded" : "safe";
  if (current > cap) return "exceeded";
  if (current === cap) return "reached";
  if (current / cap >= 0.8) return "near";
  return "safe";
}

export function calculateBudgetProgress(budgets = [], transactions = []) {
  if (!Array.isArray(budgets) || budgets.length === 0) return [];
  const txList = Array.isArray(transactions) ? transactions : [];

  return budgets.map((b) => {
    const cutoff = Number(b.cutoff_day) || 25;
    const bounds = getCycleBounds(b.cycle_key, cutoff);
    const amount = Number(b.amount) || 0;

    const matchingTx = bounds
      ? txList.filter((t) => {
          if (t.category !== b.category) return false;
          if (!t.date || t.date < bounds.startDate || t.date > bounds.endDate) return false;
          const groupKey = resolveExpenseGroupKey(t.description, t.group_override);
          return groupKey === b.group_key;
        })
      : [];

    const spent = matchingTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const remaining = amount - spent;
    const ratio = amount > 0 ? spent / amount : 0;
    const status = getBudgetStatus(spent, amount);

    return {
      ...b,
      amount,
      cutoff_day: cutoff,
      spent,
      remaining,
      ratio,
      over: spent > amount,
      status,
      items: matchingTx,
      bounds,
    };
  });
}
