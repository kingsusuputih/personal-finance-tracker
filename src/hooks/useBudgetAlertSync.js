import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore } from "../store/financeStore.js";
import { calculateBudgetProgress } from "../utils/budgetCalculations.js";
import { syncAlertState } from "../api/notifications.js";
import {
  getEffectiveCutoff,
  getEffectiveTimezone,
  getCycleInfo,
} from "../utils/dateTime.js";

export function useBudgetAlertSync() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const budgets = useFinanceStore((s) => s.budgets || []);
  const transactions = useFinanceStore((s) => s.transactions || []);
  const settings = useFinanceStore((s) => s.settings);
  const lastPayloadRef = useRef("");

  useEffect(() => {
    if (!accessToken || budgets.length === 0) return;

    const timeZone = getEffectiveTimezone(settings);
    const cutoffDay = getEffectiveCutoff(settings);
    const cycleKey = getCycleInfo(new Date(), timeZone, cutoffDay).cycleKey;

    const currentBudgets = budgets.filter((b) => b.cycle_key === cycleKey);
    if (currentBudgets.length === 0) return;

    const progress = calculateBudgetProgress(currentBudgets, transactions);
    const alerts = progress.map((p) => ({
      budgetId: p.id,
      name: p.name,
      status: p.status,
    }));

    const payloadStr = JSON.stringify({ cycleKey, alerts });
    if (lastPayloadRef.current === payloadStr) return;
    lastPayloadRef.current = payloadStr;

    syncAlertState(accessToken, { cycleKey, alerts }).catch(() => {
      // Fire-and-forget; push sync failures never block client finance workflows
    });
  }, [accessToken, budgets, transactions, settings]);
}
