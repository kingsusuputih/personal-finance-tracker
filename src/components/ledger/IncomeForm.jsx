import { useState, useEffect } from "react";
import { useSpreadsheet } from "../../hooks/useSpreadsheet.js";
import { useToast } from "../ui/Toast.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { useT } from "../../i18n/LanguageProvider.jsx";
import { SHEETS } from "../../constants/sheets.js";
import {
  serializeIncomeRow,
  serializeAdditionalIncomeRow,
} from "../../utils/sheetsHelpers.js";
import {
  formatRupiah,
  parseRupiah,
  formatIDR,
} from "../../utils/financeFormulas.js";
import {
  getEffectiveTimezone,
  getEffectiveCutoff,
  getCycleInfo,
  currentZonedDateKey,
} from "../../utils/dateTime.js";

export function IncomeForm({ draft = null, onClearDraft = null }) {
  const { addTransaction, deleteTransaction, additionalIncome = [], settings } = useSpreadsheet();
  const toast = useToast();
  const t = useT();
  const timeZone = getEffectiveTimezone(settings);
  const cutoffDay = getEffectiveCutoff(settings);
  const cycleInfo = getCycleInfo(new Date(), timeZone, cutoffDay);
  const currentCycle = cycleInfo.cycleKey;
  const defaultDate = currentZonedDateKey(new Date(), timeZone);

  const [activeTab, setActiveTab] = useState(draft?.source ? "additional" : "main");
  const [month, setMonth] = useState(draft?.month || currentCycle);
  const [amount, setAmount] = useState(draft?.amount ? formatRupiah(String(draft.amount)) : "");
  const [date, setDate] = useState(draft?.date || defaultDate);
  const [source, setSource] = useState(draft?.source || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (draft) {
      if (draft.source) {
        setActiveTab("additional");
        setSource(draft.source || "");
        setDate(draft.date || defaultDate);
      } else {
        setActiveTab("main");
        setMonth(draft.month || currentCycle);
      }
      if (draft.amount) {
        setAmount(formatRupiah(String(draft.amount)));
      }
    }
  }, [draft, currentCycle, defaultDate]);

  const cycleAddIncomes = additionalIncome.filter(
    (a) => a.date >= cycleInfo.startDate && a.date <= cycleInfo.endDate,
  );

  const submit = async (e) => {
    e.preventDefault();
    const value = parseRupiah(amount);
    if (!value || value <= 0) {
      setError(t("form.err.amount"));
      return;
    }

    if (activeTab === "additional" && !source.trim()) {
      setError(t("income.source") + " " + t("form.err.category").toLowerCase());
      return;
    }

    setError("");
    setSaving(true);
    try {
      if (activeTab === "main") {
        await addTransaction(SHEETS.INCOME, serializeIncomeRow(month, value));
        toast.success(t("income.saved", { month }));
      } else {
        await addTransaction(
          SHEETS.ADDITIONAL_INCOME,
          serializeAdditionalIncomeRow(date, source.trim(), value),
        );
        toast.success(t("income.additionalSaved"));
        setSource("");
      }
      setAmount("");
      if (onClearDraft) onClearDraft();
    } catch (err) {
      toast.error(err.message || t("form.err.amount"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdditional = async (rowNumber) => {
    setDeletingId(rowNumber);
    try {
      await deleteTransaction(SHEETS.ADDITIONAL_INCOME, rowNumber);
      toast.success(t("income.additionalDeleted"));
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-paper flex flex-col justify-between">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink tracking-tight">
            {t("income.title")}
          </h2>
          <div className="flex rounded-btn bg-paper-2 p-0.5 border border-rule">
            <button
              type="button"
              onClick={() => { setActiveTab("main"); setError(""); }}
              className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "main" ? "bg-paper text-ink shadow-sm" : "text-ink-3 hover:text-ink"
              }`}>
              {t("income.tabMain")}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("additional"); setError(""); }}
              className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "additional" ? "bg-paper text-ink shadow-sm" : "text-ink-3 hover:text-ink"
              }`}>
              {t("income.tabAdditional")}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        {activeTab === "main" ? (
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">
              {t("income.month")}
            </span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="field"
              required
            />
          </label>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                {t("income.date")}
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="field"
                required
              />
            </label>
            <label className="block">
              <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                {t("income.source")}
              </span>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder={t("income.sourcePlaceholder")}
                className="field"
                required
              />
            </label>
          </div>
        )}

        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">
            {activeTab === "main" ? t("income.amount") : t("income.additionalAmount")}
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(formatRupiah(e.target.value))}
            placeholder={t("income.placeholder")}
            className="field"
            required
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" loading={saving} className="w-full">
          {activeTab === "main" ? t("income.save") : t("income.saveAdditional")}
        </Button>
      </form>

      {activeTab === "additional" && cycleAddIncomes.length > 0 && (
        <div className="mt-5 border-t border-rule pt-4">
          <h3 className="mb-2 text-xs font-semibold text-ink-2">
            {t("income.additionalListTitle")} ({cycleAddIncomes.length})
          </h3>
          <ul className="space-y-1.5 text-xs">
            {cycleAddIncomes.map((item) => (
              <li
                key={item.id || item.rowNumber}
                className="flex items-center justify-between rounded bg-paper-2/60 px-3 py-1.5">
                <div>
                  <span className="font-medium text-ink">{item.source}</span>
                  <span className="ml-2 text-ink-3">{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{formatIDR(item.amount)}</span>
                  <button
                    type="button"
                    disabled={deletingId === item.rowNumber}
                    onClick={() => handleDeleteAdditional(item.rowNumber)}
                    className="text-danger hover:underline">
                    {t("common.delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
