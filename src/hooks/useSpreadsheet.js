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
  EXPENSE_HEADERS,
  SETTINGS_HEADERS,
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
    transactions,
    settings,
    provisioning,
    loading,
    setSpreadsheetId,
    setIncome,
    setTransactions,
    setSettings,
    setProvisioning,
    setLoading,
  } = useFinanceStore();

  const ensureSpreadsheet = useCallback(async () => {
    if (!accessToken) return null;
    const cached = useFinanceStore.getState().spreadsheetId;
    if (cached) return cached;
    setProvisioning(true);
    try {
      const id = await getOrCreateSpreadsheet(accessToken);
      setSpreadsheetId(id);
      return id;
    } finally {
      setProvisioning(false);
    }
  }, [accessToken, setProvisioning, setSpreadsheetId]);

  const loadData = useCallback(async () => {
    const id = useFinanceStore.getState().spreadsheetId;
    if (!id || !accessToken) return;
    setLoading(true);
    try {
      const [incomeRows, expenseRows, settingsRows] = await Promise.all([
        getRows(accessToken, id, SHEETS.INCOME),
        getRows(accessToken, id, SHEETS.EXPENSES),
        getRows(accessToken, id, SHEETS.SETTINGS).catch(() => []),
      ]);
      setIncome(deserializeRows(INCOME_HEADERS, incomeRows));
      setTransactions(deserializeRows(EXPENSE_HEADERS, expenseRows));
      setSettings(deserializeSettings(settingsRows));
    } finally {
      setLoading(false);
    }
  }, [accessToken, setIncome, setTransactions, setSettings, setLoading]);

  const addTransaction = useCallback(
    async (sheetName, rowValues) => {
      const id = useFinanceStore.getState().spreadsheetId;
      if (!id || !accessToken) throw new Error("Spreadsheet not ready");
      await appendRow(accessToken, id, sheetName, rowValues);
      await loadData();
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
    transactions,
    settings,
    provisioning,
    loading,
  };
}
