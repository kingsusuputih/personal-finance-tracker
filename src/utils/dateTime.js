export function detectBrowserTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && isValidTimezone(tz)) return tz;
  } catch {
    // fallback below
  }
  return "Asia/Jakarta";
}

export function isValidTimezone(timeZone) {
  if (!timeZone || typeof timeZone !== "string") return false;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getSupportedTimezones() {
  const detected = detectBrowserTimezone();
  const set = new Set([detected, "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC"]);
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      Intl.supportedValuesOf("timeZone").forEach((z) => set.add(z));
    } catch {
      // ignore
    }
  }
  return Array.from(set).sort();
}

export function getEffectiveTimezone(settings) {
  if (settings?.timezone_mode === "manual" && isValidTimezone(settings.timezone)) {
    return settings.timezone;
  }
  return detectBrowserTimezone();
}

export function getEffectiveCutoff(settings) {
  const n = Number(settings?.cutoff_day);
  if (Number.isInteger(n) && n >= 1 && n <= 28) return n;
  return 25;
}

export function getZonedDateParts(date = new Date(), timeZone = "Asia/Jakarta") {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const find = (type) => parts.find((p) => p.type === type)?.value || "";
  const year = Number(find("year"));
  const month = Number(find("month"));
  const day = Number(find("day"));
  return { year, month, day };
}

export function currentZonedDateKey(date = new Date(), timeZone = "Asia/Jakarta") {
  const { year, month, day } = getZonedDateParts(date, timeZone);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getCycleInfo(date = new Date(), timeZone = "Asia/Jakarta", cutoffDay = 25) {
  const cutoff = Number.isInteger(cutoffDay) && cutoffDay >= 1 && cutoffDay <= 28 ? cutoffDay : 25;
  const { year, month, day } = getZonedDateParts(date, timeZone);

  if (cutoff === 1) {
    const cycleKey = `${year}-${String(month).padStart(2, "0")}`;
    const start = `${cycleKey}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${cycleKey}-${String(lastDay).padStart(2, "0")}`;
    return { cycleKey, startDate: start, endDate: end, cutoffDay: 1 };
  }

  if (day < cutoff) {
    const cycleKey = `${year}-${String(month).padStart(2, "0")}`;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonth = month === 1 ? 12 : month - 1;
    const startDate = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(cutoff).padStart(2, "0")}`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(cutoff - 1).padStart(2, "0")}`;
    return { cycleKey, startDate, endDate, cutoffDay: cutoff };
  }

  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const cycleKey = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
  const startDate = `${year}-${String(month).padStart(2, "0")}-${String(cutoff).padStart(2, "0")}`;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(cutoff - 1).padStart(2, "0")}`;
  return { cycleKey, startDate, endDate, cutoffDay: cutoff };
}

export function getCycleKeyForDate(dateStr, cutoffDay = 25) {
  if (!dateStr || typeof dateStr !== "string") return "";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const cutoff = Number.isInteger(cutoffDay) && cutoffDay >= 1 && cutoffDay <= 28 ? cutoffDay : 25;

  if (cutoff === 1) {
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  if (day < cutoff) {
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
}

export function formatTransactionTime(isoString, timeZone = "Asia/Jakarta", lang = "id") {
  if (!isoString) return "";
  const t = Date.parse(isoString);
  if (!Number.isFinite(t)) return "";
  try {
    return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(t));
  } catch {
    return "";
  }
}

export function formatTransactionDateTime(isoString, timeZone = "Asia/Jakarta", lang = "id") {
  if (!isoString) return "";
  const t = Date.parse(isoString);
  if (!Number.isFinite(t)) return "";
  try {
    return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
      timeZone,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(t));
  } catch {
    return "";
  }
}

export function transactionSortTimestamp(row) {
  if (row?.created_at) {
    const parsed = Date.parse(row.created_at);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (row?.date && /^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    const parsedDate = Date.parse(`${row.date}T00:00:00Z`);
    if (Number.isFinite(parsedDate)) return parsedDate;
  }
  return 0;
}
