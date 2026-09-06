import assert from "node:assert/strict";
import {
  detectBrowserTimezone,
  isValidTimezone,
  getEffectiveTimezone,
  getEffectiveCutoff,
  getZonedDateParts,
  currentZonedDateKey,
  getCycleInfo,
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
  serializeSettingsRow,
  deserializeSettings,
} from "../src/utils/sheetsHelpers.js";

const oldCreatedAt = "2026-09-01T08:00:00.000Z";
const editedRow = serializeExpenseRow("2026-09-02", "Needs", "Edit test", 50000, oldCreatedAt);
assert.equal(editedRow[4], oldCreatedAt);

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

console.log("self-check passed");
