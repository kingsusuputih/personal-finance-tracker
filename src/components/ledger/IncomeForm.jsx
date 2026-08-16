import { useState } from "react";
import { useSpreadsheet } from "../../hooks/useSpreadsheet.js";
import { useToast } from "../ui/Toast.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { useT } from "../../i18n/LanguageProvider.jsx";
import { SHEETS } from "../../constants/sheets.js";
import { serializeIncomeRow } from "../../utils/sheetsHelpers.js";
import {
  currentMonthKey,
  formatRupiah,
  parseRupiah,
} from "../../utils/financeFormulas.js";

export function IncomeForm() {
  const { addTransaction } = useSpreadsheet();
  const toast = useToast();
  const t = useT();
  const [month, setMonth] = useState(currentMonthKey());
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const value = parseRupiah(amount);
    if (!value || value <= 0) {
      setError(t("form.err.amount"));
      return;
    }
    setError("");
    setSaving(true);
    try {
      await addTransaction(SHEETS.INCOME, serializeIncomeRow(month, value));
      toast.success(t("income.saved", { month }));
      setAmount("");
    } catch (err) {
      toast.error(err.message || t("form.err.amount"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">
        {t("income.title")}
      </h2>
      <form onSubmit={submit} className="space-y-4" noValidate>
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
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">
            {t("income.amount")}
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
          {t("income.save")}
        </Button>
      </form>
    </Card>
  );
}
