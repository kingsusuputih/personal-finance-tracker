import assert from "node:assert/strict";
import {
  detectBrowserTimezone,
  isValidTimezone,
  getEffectiveTimezone,
  getEffectiveCutoff,
  getZonedDateParts,
  currentZonedDateKey,
  getCycleInfo,
  getCycleBounds,
  getCycleKeyForDate,
  formatTransactionTime,
  formatDisplayDate,
  transactionSortTimestamp,
} from "../src/utils/dateTime.js";

assert(isValidTimezone("Asia/Jakarta"));
assert(isValidTimezone("America/New_York"));
assert(!isValidTimezone("Invalid/Zone_Name"));

assert.equal(
  getEffectiveTimezone({ timezone_mode: "manual", timezone: "America/New_York" }),
  "America/New_York",
);
assert.equal(
  getEffectiveTimezone({ timezone_mode: "manual", timezone: "Invalid/Zone" }),
  detectBrowserTimezone(),
);
assert.equal(getEffectiveCutoff({ cutoff_day: "25" }), 25);
assert.equal(getEffectiveCutoff({ cutoff_day: "0" }), 25);
assert.equal(getEffectiveCutoff({ cutoff_day: "29" }), 25);
assert.equal(getEffectiveCutoff({ cutoff_day: 15 }), 15);

const crossingInstant = new Date("2026-09-06T23:30:00Z");
assert.equal(currentZonedDateKey(crossingInstant, "UTC"), "2026-09-06");
assert.equal(currentZonedDateKey(crossingInstant, "Asia/Jakarta"), "2026-09-07");

assert.equal(getCycleKeyForDate("2026-08-24", 25), "2026-07");
assert.equal(getCycleKeyForDate("2026-08-25", 25), "2026-08");
assert.equal(getCycleKeyForDate("2026-09-24", 25), "2026-08");
assert.equal(getCycleKeyForDate("2026-09-25", 25), "2026-09");

const midPeriod = new Date("2026-09-10T05:00:00Z");
const infoMid = getCycleInfo(midPeriod, "Asia/Jakarta", 25);
assert.equal(infoMid.cycleKey, "2026-08");
assert.equal(infoMid.startDate, "2026-08-25");
assert.equal(infoMid.endDate, "2026-09-24");

const postCutoff = new Date("2026-09-26T05:00:00Z");
const infoPost = getCycleInfo(postCutoff, "Asia/Jakarta", 25);
assert.equal(infoPost.cycleKey, "2026-09");
assert.equal(infoPost.startDate, "2026-09-25");
assert.equal(infoPost.endDate, "2026-10-24");

const decDate = new Date("2026-12-28T05:00:00Z");
const infoDec = getCycleInfo(decDate, "Asia/Jakarta", 25);
assert.equal(infoDec.cycleKey, "2026-12");
assert.equal(infoDec.startDate, "2026-12-25");
assert.equal(infoDec.endDate, "2027-01-24");

const janPreCutoff = new Date("2027-01-10T05:00:00Z");
const infoJanPre = getCycleInfo(janPreCutoff, "Asia/Jakarta", 25);
assert.equal(infoJanPre.cycleKey, "2026-12");
assert.equal(infoJanPre.startDate, "2026-12-25");
assert.equal(infoJanPre.endDate, "2027-01-24");

assert.equal(getCycleKeyForDate("2026-09-05", 1), "2026-09");
const infoCalendar = getCycleInfo(new Date("2026-09-15T00:00:00Z"), "UTC", 1);
assert.equal(infoCalendar.cycleKey, "2026-09");
assert.equal(infoCalendar.startDate, "2026-09-01");
assert.equal(infoCalendar.endDate, "2026-09-30");

const bounds25 = getCycleBounds("2026-08", 25);
assert.equal(bounds25.startDate, "2026-08-25");
assert.equal(bounds25.endDate, "2026-09-24");

const boundsDec = getCycleBounds("2026-12", 25);
assert.equal(boundsDec.startDate, "2026-12-25");
assert.equal(boundsDec.endDate, "2027-01-24");

const bounds1 = getCycleBounds("2026-02", 1);
assert.equal(bounds1.startDate, "2026-02-01");
assert.equal(bounds1.endDate, "2026-02-28");

const dispId = formatDisplayDate("2026-08-25", "id");
assert(dispId.includes("25") && dispId.includes("2026"));
const dispEn = formatDisplayDate("2026-08-25", "en");
assert(dispEn.includes("Aug") && dispEn.includes("2026"));

const t1 = { created_at: "2026-09-06T10:00:00Z", date: "2026-09-06", rowNumber: 2 };
const t2 = { created_at: "2026-09-06T11:00:00Z", date: "2026-09-06", rowNumber: 3 };
const tLegacy = { created_at: "", date: "2026-09-05", rowNumber: 4 };

assert(transactionSortTimestamp(t2) > transactionSortTimestamp(t1));
assert(transactionSortTimestamp(t1) > transactionSortTimestamp(tLegacy));

const formattedTime = formatTransactionTime("2026-09-06T10:30:00Z", "Asia/Jakarta", "id");
assert.equal(formattedTime, "17.30");

import {
  serializeExpenseRow,
  serializeAdditionalIncomeRow,
  serializeBudgetRow,
  serializeSettingsRow,
  deserializeSettings,
  deserializeRows,
} from "../src/utils/sheetsHelpers.js";
import {
  EXPENSE_HEADERS,
  ADDITIONAL_INCOME_HEADERS,
  BUDGET_HEADERS,
} from "../src/constants/sheets.js";

const oldCreatedAt = "2026-09-01T08:00:00.000Z";
const editedRow = serializeExpenseRow("2026-09-02", "Needs", "Edit test", 50000, oldCreatedAt, "Custom Group", "uuid-123");
assert.equal(editedRow[4], oldCreatedAt);
assert.equal(editedRow[5], "Custom Group");
assert.equal(editedRow[6], "uuid-123");

const bRow = serializeBudgetRow("2026-09", 25, "Bensin", "Needs", "bensin-bbm", 500000, oldCreatedAt, "b-uuid-1");
assert.deepEqual(bRow, ["b-uuid-1", "2026-09", 25, "Bensin", "Needs", "bensin-bbm", 500000, oldCreatedAt]);

const rawBudgetData = [
  ["id", "cycle_key", "cutoff_day", "name", "category", "group_key", "amount", "created_at"],
  ["b-uuid-1", "2026-09", "25", "Bensin", "Needs", "bensin-bbm", "500000", oldCreatedAt],
];
const parsedBudgets = deserializeRows(BUDGET_HEADERS, rawBudgetData);
assert.equal(parsedBudgets.length, 1);
assert.equal(parsedBudgets[0].amount, 500000);
assert.equal(parsedBudgets[0].name, "Bensin");
assert.equal(parsedBudgets[0].group_key, "bensin-bbm");
assert.equal(parsedBudgets[0].cutoff_day, "25");

const addIncRow = serializeAdditionalIncomeRow("2026-09-03", "Bonus", 250000, oldCreatedAt, "inc-uuid-456");
assert.equal(addIncRow[0], "2026-09-03");
assert.equal(addIncRow[1], "Bonus");
assert.equal(addIncRow[2], 250000);
assert.equal(addIncRow[3], oldCreatedAt);
assert.equal(addIncRow[4], "inc-uuid-456");

const legacyExpenseRaw = [
  ["date", "category", "description", "amount", "created_at"],
  ["2026-09-01", "Needs", "Groceries", "150000", oldCreatedAt],
];
const parsedLegacy = deserializeRows(EXPENSE_HEADERS, legacyExpenseRaw);
assert.equal(parsedLegacy.length, 1);
assert.equal(parsedLegacy[0].amount, 150000);
assert.equal(parsedLegacy[0].group_override, "");
assert.equal(parsedLegacy[0].id, "");

const modernExpenseRaw = [
  ["date", "category", "description", "amount", "created_at", "group_override", "id"],
  ["2026-09-02", "Lifestyle", "Rokok Surya", "30000", oldCreatedAt, "Rokok", "exp-789"],
];
const parsedModern = deserializeRows(EXPENSE_HEADERS, modernExpenseRaw);
assert.equal(parsedModern.length, 1);
assert.equal(parsedModern[0].group_override, "Rokok");
assert.equal(parsedModern[0].id, "exp-789");

const sRow = serializeSettingsRow({ timezone_mode: "manual", timezone: "America/New_York", cutoff_day: "15" });
assert.deepEqual(sRow, ["manual", "America/New_York", 15]);

const parsedSettings = deserializeSettings([
  ["timezone_mode", "timezone", "cutoff_day"],
  ["manual", "America/New_York", 15],
]);
assert.deepEqual(parsedSettings, {
  timezone_mode: "manual",
  timezone: "America/New_York",
  cutoff_day: 15,
});

const defaultParsed = deserializeSettings([]);
assert.deepEqual(defaultParsed, {
  timezone_mode: "auto",
  timezone: "Asia/Jakarta",
  cutoff_day: 25,
});

function maskTestName(name) {
  if (!name || typeof name !== "string") return "Anonymous";
  const clean = name.normalize("NFKC").trim();
  if (!clean) return "Anonymous";
  const words = clean.split(/\s+/).filter(Boolean).slice(0, 2);
  if (!words.length) return "Anonymous";
  return words
    .map((w) => {
      const firstChar = Array.from(w)[0]?.toUpperCase() || "";
      return `${firstChar}***`;
    })
    .join(" ");
}

assert.equal(maskTestName("Harsa Aditya"), "H*** A***");
assert.equal(maskTestName("John Doe Smith"), "J*** D***");
assert.equal(maskTestName("Budi"), "B***");
assert.equal(maskTestName(""), "Anonymous");

import { calculateCycleRecap } from "../src/utils/financeFormulas.js";
import {
  resolveExpenseGroup,
  resolveExpenseGroupKey,
  getAvailableGroupChoices,
  groupExpenses,
} from "../src/utils/expenseGrouping.js";
import {
  getBudgetStatus,
  calculateBudgetProgress,
} from "../src/utils/budgetCalculations.js";

assert.equal(resolveExpenseGroup("beli rokok"), "Rokok");
assert.equal(resolveExpenseGroup("rokok surya"), "Rokok");
assert.equal(resolveExpenseGroup("sampoerna mild"), "Rokok");
assert.equal(resolveExpenseGroup("kopi susu"), "Kopi");
assert.equal(resolveExpenseGroup("beli rokok dan kopi"), "beli rokok dan kopi");
assert.equal(resolveExpenseGroup("beli rokok", "__separate__"), "beli rokok");
assert.equal(resolveExpenseGroup("beli rokok", "Kebutuhan Khusus"), "Kebutuhan Khusus");

// Tests for resolveExpenseGroupKey
assert.equal(resolveExpenseGroupKey("beli rokok"), "rokok");
assert.equal(resolveExpenseGroupKey("rokok surya"), "rokok");
assert.equal(resolveExpenseGroupKey("kopi susu"), "kopi");
assert.equal(resolveExpenseGroupKey("pertamax 92"), "bensin-bbm");
assert.equal(resolveExpenseGroupKey("beli apa", "Rokok"), "rokok");
assert.equal(resolveExpenseGroupKey("beli apa", "kopi"), "kopi");
assert.equal(resolveExpenseGroupKey("beli apa", "Kebutuhan Khusus"), "custom:kebutuhan khusus");
assert.equal(resolveExpenseGroupKey("rokok surya", "__separate__"), "custom:rokok surya");
assert.equal(resolveExpenseGroupKey("", "__separate__"), "tanpa-keterangan");
assert.equal(resolveExpenseGroupKey(""), "lain-lain");
assert.equal(resolveExpenseGroupKey("rokok dan kopi"), "custom:rokok dan kopi");

// Test getAvailableGroupChoices
const availableChoices = getAvailableGroupChoices([
  { description: "bensin pertalite", group_override: "" },
  { description: "service laptop", group_override: "Servis" },
]);
assert(availableChoices.some((c) => c.key === "bensin-bbm" && c.builtin === true));
assert(availableChoices.some((c) => c.key === "custom:servis" && c.builtin === false));

// Test getBudgetStatus
assert.equal(getBudgetStatus(0, 100000), "safe");
assert.equal(getBudgetStatus(79999, 100000), "safe");
assert.equal(getBudgetStatus(80000, 100000), "near");
assert.equal(getBudgetStatus(99999, 100000), "near");
assert.equal(getBudgetStatus(100000, 100000), "reached");
assert.equal(getBudgetStatus(100001, 100000), "exceeded");

// Test calculateBudgetProgress
const testBudgets = [
  {
    id: "b-1",
    cycle_key: "2026-08",
    cutoff_day: 25,
    name: "Bensin Agustus",
    category: "Needs",
    group_key: "bensin-bbm",
    amount: 100000,
  },
  {
    id: "b-2",
    cycle_key: "2026-08",
    cutoff_day: 25,
    name: "Rokok Agustus",
    category: "Lifestyle",
    group_key: "rokok",
    amount: 50000,
  },
  {
    id: "b-3",
    cycle_key: "2026-08",
    cutoff_day: 25,
    name: "Rokok Needs (should not match lifestyle)",
    category: "Needs",
    group_key: "rokok",
    amount: 50000,
  },
];
const testTxForBudget = [
  { date: "2026-08-26", category: "Needs", description: "pertalite", amount: 40000 },
  { date: "2026-08-28", category: "Needs", description: "pertamax", amount: 45000 },
  { date: "2026-08-29", category: "Lifestyle", description: "rokok surya", amount: 60000 },
  { date: "2026-07-20", category: "Needs", description: "pertalite", amount: 50000 }, // outside bounds
];
const budgetRes = calculateBudgetProgress(testBudgets, testTxForBudget);
assert.equal(budgetRes.length, 3);
assert.equal(budgetRes[0].spent, 85000);
assert.equal(budgetRes[0].remaining, 15000);
assert.equal(budgetRes[0].status, "near");
assert.equal(budgetRes[1].spent, 60000);
assert.equal(budgetRes[1].remaining, -10000);
assert.equal(budgetRes[1].over, true);
assert.equal(budgetRes[1].status, "exceeded");
assert.equal(budgetRes[2].spent, 0); // Strict category check: no Needs rokok
assert.equal(budgetRes[2].status, "safe");

const sampleTx = [
  { date: "2026-08-26", category: "Lifestyle", description: "beli rokok", amount: 25000 },
  { date: "2026-08-28", category: "Lifestyle", description: "rokok surya", amount: 30000 },
  { date: "2026-08-29", category: "Needs", description: "beras", amount: 65000 },
  { date: "2026-08-30", category: "Investment", description: "Bibit Reksadana", amount: 500000 },
];
const grouped = groupExpenses(sampleTx);
assert.equal(grouped.Lifestyle["Rokok"].total, 55000);
assert.equal(grouped.Lifestyle["Rokok"].count, 2);
assert.equal(grouped.Needs["beras"].total, 65000);
assert.equal(grouped.Investment["Bibit Reksadana"].total, 500000);

const recap = calculateCycleRecap({
  cycleKey: "2026-08",
  cycleStartDate: "2026-08-25",
  cycleEndDate: "2026-09-24",
  income: [{ month: "2026-08", amount: 5000000 }],
  additionalIncome: [
    { date: "2026-08-27", source: "Bonus", amount: 500000 },
    { date: "2026-09-01", source: "Ngojek", amount: 300000 },
  ],
  transactions: sampleTx,
  allTransactions: [
    { date: "2026-07-20", category: "Investment", amount: 1000000 },
    ...sampleTx,
  ],
});

assert.equal(recap.mainIncome, 5000000);
assert.equal(recap.totalAdditionalIncome, 800000);
assert.equal(recap.totalIncome, 5800000);
assert.equal(recap.needsExpenses, 65000);
assert.equal(recap.lifestyleExpenses, 55000);
assert.equal(recap.consumptionExpenses, 120000);
assert.equal(recap.investmentExpenses, 500000);
assert.equal(recap.surplusBeforeInvestment, 5680000);
assert.equal(recap.remainingAfterInvestment, 5180000);
assert.equal(recap.cumulativeInvestments, 1500000);

const unrecordedMainRecap = calculateCycleRecap({
  cycleKey: "2026-09",
  cycleStartDate: "2026-09-25",
  cycleEndDate: "2026-10-24",
  income: [],
  additionalIncome: [
    { date: "2026-10-01", source: "Side project", amount: 1200000 },
  ],
  transactions: [
    { date: "2026-09-26", category: "Needs", amount: 1500000 },
  ],
  allTransactions: [
    { date: "2026-08-30", category: "Investment", amount: 500000 },
    { date: "2026-10-02", category: "Investment", amount: 200000 },
    { date: "2026-11-01", category: "Investment", amount: 999999 },
  ],
});
assert.equal(unrecordedMainRecap.hasMainIncome, false);
assert.equal(unrecordedMainRecap.mainIncome, 0);
assert.equal(unrecordedMainRecap.totalIncome, 1200000);
assert.equal(unrecordedMainRecap.consumptionExpenses, 1500000);
assert.equal(unrecordedMainRecap.surplusBeforeInvestment, -300000);
assert.equal(unrecordedMainRecap.cumulativeInvestments, 700000);

import { changelogEntries } from "../src/constants/changelog.js";
import { privacy, terms } from "../src/constants/legalContent.js";

assert(Array.isArray(changelogEntries) && changelogEntries.length >= 4);
const seenVersions = new Set();
changelogEntries.forEach((entry) => {
  assert(entry.version && typeof entry.version === "string");
  assert(!seenVersions.has(entry.version), `Duplicate changelog version: ${entry.version}`);
  seenVersions.add(entry.version);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(entry.date), `Invalid changelog date: ${entry.date}`);
  assert(entry.en && entry.en.title && Array.isArray(entry.en.items));
  assert(entry.id && entry.id.title && Array.isArray(entry.id.items));
  if (entry.en.sections) {
    assert(Array.isArray(entry.en.sections));
    entry.en.sections.forEach((s) => {
      assert(["added", "changed", "fixed", "deprecated", "removed", "security"].includes(s.type));
      assert(s.label && typeof s.label === "string");
      assert(Array.isArray(s.items) && s.items.length > 0);
    });
  }
  if (entry.id.sections) {
    assert(Array.isArray(entry.id.sections));
    entry.id.sections.forEach((s) => {
      assert(["added", "changed", "fixed", "deprecated", "removed", "security"].includes(s.type));
      assert(s.label && typeof s.label === "string");
      assert(Array.isArray(s.items) && s.items.length > 0);
    });
  }
});

assert(Array.isArray(privacy.en) && privacy.en.length > 5);
assert(Array.isArray(privacy.id) && privacy.id.length === privacy.en.length);
assert(Array.isArray(terms.en) && terms.en.length > 5);
assert(Array.isArray(terms.id) && terms.id.length === terms.en.length);

console.log("self-check passed");
