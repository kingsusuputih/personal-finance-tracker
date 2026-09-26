import { create } from "zustand";
import { DEFAULT_SETTINGS } from "../constants/sheets.js";

const initialState = {
  spreadsheetId: null,
  income: [],
  additionalIncome: [],
  transactions: [],
  budgets: [],
  settings: DEFAULT_SETTINGS,
  provisioning: false,
  loading: false,
  isReady: false,
  loadError: null,
};

export function isAccountEmpty(state) {
  if (!state || !state.isReady) return false;
  return (
    state.income.length === 0 &&
    state.additionalIncome.length === 0 &&
    state.transactions.length === 0 &&
    state.budgets.length === 0
  );
}

export const useFinanceStore = create((set) => ({
  ...initialState,
  setSpreadsheetId: (spreadsheetId) => set({ spreadsheetId }),
  setIncome: (income) => set({ income }),
  setAdditionalIncome: (additionalIncome) => set({ additionalIncome }),
  setTransactions: (transactions) => set({ transactions }),
  setBudgets: (budgets) => set({ budgets }),
  setSettings: (settings) => set({ settings }),
  setProvisioning: (provisioning) => set({ provisioning }),
  setLoading: (loading) => set({ loading }),
  setIsReady: (isReady) => set({ isReady }),
  setLoadError: (loadError) => set({ loadError }),
  reset: () => set(initialState),
}));
