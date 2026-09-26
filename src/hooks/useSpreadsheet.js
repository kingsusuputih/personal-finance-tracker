import { useCallback } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore } from "../store/financeStore.js";
import { getOrCreateSpreadsheet } from "../api/googleDrive.js";
import {
  getRows,
  appendRow,
  updateRow,
  deleteRow,
} from "../api/googleSheets.js";
import {
  SHEETS,
  INCOME_HEADERS,
  ADDITIONAL_INCOME_HEADERS,
  EXPENSE_HEADERS,
  SETTINGS_HEADERS,
  BUDGET_HEADERS,
} from "../constants/sheets.js";
import {
  deserializeRows,
  deserializeSettings,
  serializeSettingsRow,
} from "../utils/sheetsHelpers.js";

export function useSpreadsheet() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const {
    spreadsheetId,
    income,
    additionalIncome,
    transactions,
    budgets,
    settings,
    provisioning,
    loading,
    isReady,
    loadError,
    setSpreadsheetId,
    setIncome,
    setAdditionalIncome,
    setTransactions,
    setBudgets,
    setSettings,
    setProvisioning,
    setLoading,
    setIsReady,
    setLoadError,
  } = useFinanceStore();

  const ensureSpreadsheet = useCallback(async () => {
    if (!accessToken) return null;
    const cached = useFinanceStore.getState().spreadsheetId;
    if (cached) return cached;
    setProvisioning(true);
    setLoadError(null);
    try {
      const id = await getOrCreateSpreadsheet(accessToken);
      setSpreadsheetId(id);
      return id;
    } catch (err) {
      setLoadError(err?.message || "Failed to connect spreadsheet");
      throw err;
    } finally {
      setProvisioning(false);
    }
  }, [accessToken, setProvisioning, setSpreadsheetId, setLoadError]);

  const loadData = useCallback(async () => {
    const id = useFinanceStore.getState().spreadsheetId;
    if (!id || !accessToken) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [incomeRows, addIncomeRows, expenseRows, settingsRows, budgetRows] = await Promise.all([
        getRows(accessToken, id, SHEETS.INCOME),
        getRows(accessToken, id, SHEETS.ADDITIONAL_INCOME),
        getRows(accessToken, id, SHEETS.EXPENSES),
        getRows(accessToken, id, SHEETS.SETTINGS).catch(() => []),
        getRows(accessToken, id, SHEETS.BUDGETS).catch(() => []),
      ]);
      setIncome(deserializeRows(INCOME_HEADERS, incomeRows));
      setAdditionalIncome(deserializeRows(ADDITIONAL_INCOME_HEADERS, addIncomeRows));
      setTransactions(deserializeRows(EXPENSE_HEADERS, expenseRows));
      setSettings(deserializeSettings(settingsRows));
      setBudgets(deserializeRows(BUDGET_HEADERS, budgetRows));
      setIsReady(true);
      setLoadError(null);
    } catch (err) {
      const errMsg = err?.message || "Failed to load data";
      setLoadError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accessToken, setIncome, setAdditionalIncome, setTransactions, setSettings, setBudgets, setLoading, setIsReady, setLoadError]);

  const addTransaction = useCallback(
    async (sheetName, rowValues) => {
      const id = useFinanceStore.getState().spreadsheetId;
      if (!id || !accessToken) throw new Error("Spreadsheet not ready");
      await appendRow(accessToken, id, sheetName, rowValues);
      let refreshError = null;
      try {
        await loadData();
      } catch (err) {
        refreshError = err?.message || "Failed to refresh data";
      }
      return { success: true, refreshError };
    },
    [accessToken, loadData],
  );

  const updateTransaction = useCallback(
    async (sheetName, rowNumber, rowValues) => {
      const id = useFinanceStore.getState().spreadsheetId;
      if (!id || !accessToken) throw new Error("Spreadsheet not ready");
      await updateRow(accessToken, id, sheetName, rowNumber, rowValues);
      await loadData();
    },
    [accessToken, loadData],
  );

  const deleteTransaction = useCallback(
    async (sheetName, rowNumber) => {
      const id = useFinanceStore.getState().spreadsheetId;
      if (!id || !accessToken) throw new Error("Spreadsheet not ready");
      await deleteRow(accessToken, id, sheetName, rowNumber);
      await loadData();
    },
    [accessToken, loadData],
  );

  const saveSettings = useCallback(
    async (newSettings) => {
      const id = useFinanceStore.getState().spreadsheetId;
      if (!id || !accessToken) throw new Error("Spreadsheet not ready");
      const rowValues = serializeSettingsRow(newSettings);
      await updateRow(accessToken, id, SHEETS.SETTINGS, 2, rowValues);
      setSettings(deserializeSettings([SETTINGS_HEADERS, rowValues]));
    },
    [accessToken, setSettings],
  );

  return {
    ensureSpreadsheet,
    loadData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveSettings,
    spreadsheetId,
    income,
    additionalIncome,
    transactions,
    budgets,
    settings,
    provisioning,
    loading,
    isReady,
    loadError,
  };
}
