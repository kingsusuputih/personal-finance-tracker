import { DEFAULT_SETTINGS } from "../constants/sheets.js";

export function serializeIncomeRow(month, amount) {
  return [month, Number(amount), new Date().toISOString()];
}

export function serializeExpenseRow(
  date,
  category,
  description,
  amount,
  createdAt = new Date().toISOString(),
) {
  return [
    date,
    category,
    description || "",
    Number(amount),
    createdAt || new Date().toISOString(),
  ];
}

export function serializeSettingsRow(settings = {}) {
  const mode = settings.timezone_mode === "manual" ? "manual" : "auto";
  const tz = settings.timezone || DEFAULT_SETTINGS.timezone;
  const cutoff = Number(settings.cutoff_day);
  const validCutoff = Number.isInteger(cutoff) && cutoff >= 1 && cutoff <= 28 ? cutoff : 25;
  return [mode, tz, validCutoff];
}

export function deserializeSettings(rawRows = []) {
  if (!rawRows || rawRows.length < 2) {
    return { ...DEFAULT_SETTINGS };
  }
  const [, valuesRow] = rawRows;
  if (!valuesRow || !valuesRow.length) {
    return { ...DEFAULT_SETTINGS };
  }
  const mode = String(valuesRow[0] || "").trim() === "manual" ? "manual" : "auto";
  const timezone = String(valuesRow[1] || "").trim() || DEFAULT_SETTINGS.timezone;
  const cutoffNum = Number(valuesRow[2]);
  const cutoff_day = Number.isInteger(cutoffNum) && cutoffNum >= 1 && cutoffNum <= 28 ? cutoffNum : 25;
  return { timezone_mode: mode, timezone, cutoff_day };
}

export function deserializeRows(headers, rawRows = []) {
  if (!rawRows.length) return [];
  const [headerRow, ...body] = rawRows;
  if (!headerRow || !headerRow.length) return [];
  return body
    .map((row, i) => {
      const record = { rowNumber: i + 2 };
      let hasData = false;
      headers.forEach((header, j) => {
        const value = row[j] ?? "";
        if (header === "amount") record[header] = Number(value) || 0;
        else record[header] = String(value);
        if (String(value).trim() !== "") hasData = true;
      });
      return hasData ? record : null;
    })
    .filter(Boolean);
}
