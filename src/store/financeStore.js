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
};

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
  reset: () => set(initialState),
}));
