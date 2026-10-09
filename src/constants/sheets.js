export const SPREADSHEET_NAME = "Finance_Tracker_Data";

export const SHEETS = {
  INCOME: "Income",
  ADDITIONAL_INCOME: "AdditionalIncome",
  EXPENSES: "Expenses",
  SETTINGS: "Settings",
  BUDGETS: "Budgets",
  CHAT_HISTORY: "ChatHistory",
};

export const INCOME_HEADERS = ["month", "amount", "created_at"];
export const ADDITIONAL_INCOME_HEADERS = [
  "date",
  "source",
  "amount",
  "created_at",
  "id",
];
export const EXPENSE_HEADERS = [
  "date",
  "category",
  "description",
  "amount",
  "created_at",
  "group_override",
  "id",
];
export const BUDGET_HEADERS = [
  "id",
  "cycle_key",
  "cutoff_day",
  "name",
  "category",
  "group_key",
  "amount",
  "created_at",
];
export const CHAT_HISTORY_HEADERS = [
  "id",
  "timestamp",
  "cycle_key",
  "role",
  "message",
  "proposal_json",
];
export const SETTINGS_HEADERS = ["timezone_mode", "timezone", "cutoff_day"];
export const DEFAULT_SETTINGS = {
  timezone_mode: "auto",
  timezone: "Asia/Jakarta",
  cutoff_day: 25,
};

export const EXPENSE_CATEGORIES = ["Needs", "Lifestyle", "Investment"];
