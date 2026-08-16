import { create } from "zustand";

const initialState = {
  spreadsheetId: null,
  income: [],
  transactions: [],
  provisioning: false,
  loading: false,
};

export const useFinanceStore = create((set) => ({
  ...initialState,
  setSpreadsheetId: (spreadsheetId) => set({ spreadsheetId }),
  setIncome: (income) => set({ income }),
  setTransactions: (transactions) => set({ transactions }),
  setProvisioning: (provisioning) => set({ provisioning }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(initialState),
}));
