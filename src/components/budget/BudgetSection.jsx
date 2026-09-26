import { useState, useMemo } from "react";
import { useSpreadsheet } from "../../hooks/useSpreadsheet.js";
import { useBudgetProgress } from "../../hooks/useBudgetProgress.js";
import { useToast } from "../ui/Toast.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Modal } from "../ui/Modal.jsx";
import { useT, useI18n } from "../../i18n/LanguageProvider.jsx";
import { SHEETS, EXPENSE_CATEGORIES } from "../../constants/sheets.js";
import { serializeBudgetRow } from "../../utils/sheetsHelpers.js";
import { formatIDR, formatRupiah, parseRupiah } from "../../utils/financeFormulas.js";
import { getAvailableGroupChoices, ALIAS_RULES } from "../../utils/expenseGrouping.js";
import { getEffectiveCutoff, formatDisplayDate } from "../../utils/dateTime.js";

const categoryTone = {
  Needs: "accent",
  Lifestyle: "warning",
  Investment: "success",
};

const statusTone = {
  safe: "success",
  near: "warning",
  reached: "danger",
  exceeded: "danger",
};

export function BudgetSection({ selectedCycle }) {
  const t = useT();
  const { lang } = useI18n();
  const toast = useToast();
  const {
    budgets = [],
    transactions = [],
    settings,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useSpreadsheet();

  const { budgets: progressBudgets } = useBudgetProgress(selectedCycle);

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [selectedGroupKey, setSelectedGroupKey] = useState(ALIAS_RULES[0]?.id || "rokok");
  const [customGroupLabel, setCustomGroupLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingBudget, setEditingBudget] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingBudget, setDeletingBudget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const groupChoices = useMemo(() => {
    return getAvailableGroupChoices(transactions);
  }, [transactions]);

  const cutoffDay = getEffectiveCutoff(settings);

  const handleOpenAdd = () => {
    setName("");
    setCategory(EXPENSE_CATEGORIES[0]);
    setSelectedGroupKey(groupChoices[0]?.key || "rokok");
    setCustomGroupLabel("");
    setAmount("");
    setError("");
    setFormOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const value = parseRupiah(amount);
    if (!value || value <= 0) {
      setError(t("budget.errAmount"));
      return;
    }

    let finalGroupKey = selectedGroupKey;
    if (selectedGroupKey === "__custom__") {
      const cleanCustom = customGroupLabel.trim();
      if (!cleanCustom) {
        setError(t("form.err.category"));
        return;
      }
      finalGroupKey = `custom:${cleanCustom.toLowerCase()}`;
    }

    const duplicate = budgets.some(
      (b) =>
        b.cycle_key === selectedCycle &&
        b.category === category &&
        b.group_key === finalGroupKey,
    );

    if (duplicate) {
      setError(t("budget.errDuplicate"));
      return;
    }

    const finalName = name.trim() || groupChoices.find((c) => c.key === finalGroupKey)?.label || customGroupLabel.trim();

    setError("");
    setSaving(true);
    try {
      const rowValues = serializeBudgetRow(
        selectedCycle,
        cutoffDay,
        finalName,
        category,
        finalGroupKey,
        value,
      );
      await addTransaction(SHEETS.BUDGETS, rowValues);
      toast.success(t("budget.saved"));
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (b) => {
    setEditingBudget(b);
    setEditAmount(formatRupiah(String(b.amount)));
  };

  const handleSaveEdit = async () => {
    if (!editingBudget) return;
    const value = parseRupiah(editAmount);
    if (!value || value <= 0) {
      toast.error(t("budget.errAmount"));
      return;
    }

    setSavingEdit(true);
    try {
      const rowValues = serializeBudgetRow(
        editingBudget.cycle_key,
        editingBudget.cutoff_day,
        editingBudget.name,
        editingBudget.category,
        editingBudget.group_key,
        value,
        editingBudget.created_at,
        editingBudget.id,
      );
      await updateTransaction(SHEETS.BUDGETS, editingBudget.rowNumber, rowValues);
      toast.success(t("budget.saved"));
      setEditingBudget(null);
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBudget) return;
    setDeleting(true);
    try {
      await deleteTransaction(SHEETS.BUDGETS, deletingBudget.rowNumber);
      toast.success(t("budget.deleted"));
      setDeletingBudget(null);
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mb-8 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink sm:text-lg">
            {t("budget.title")}
          </h2>
          <p className="text-xs text-ink-3">
            {t("budget.subtitle")}
          </p>
        </div>
        {!formOpen && (
          <Button type="button" size="sm" onClick={handleOpenAdd}>
            + {t("budget.add")}
          </Button>
        )}
      </div>

      {formOpen && (
        <Card className="p-4 sm:p-5 border-accent/40 bg-paper-2/20">
          <form onSubmit={handleAddSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                  {t("budget.name")}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("budget.namePlaceholder")}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                  {t("budget.category")}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field"
                  required>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                  {t("budget.group")}
                </span>
                <select
                  value={selectedGroupKey}
                  onChange={(e) => setSelectedGroupKey(e.target.value)}
                  className="field"
                  required>
                  {groupChoices.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label} {g.builtin ? "" : "(Custom)"}
                    </option>
                  ))}
                  <option value="__custom__">+ Kelompok kustom baru...</option>
                </select>
              </label>

              {selectedGroupKey === "__custom__" ? (
                <label className="block">
                  <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                    Nama Kelompok Kustom
                  </span>
                  <input
                    type="text"
                    value={customGroupLabel}
                    onChange={(e) => setCustomGroupLabel(e.target.value)}
                    placeholder="mis. Gym, Internet Kantor"
                    className="field"
                    required
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                    {t("budget.amount")}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(formatRupiah(e.target.value))}
                    placeholder="mis. 500.000"
                    className="field"
                    required
                  />
                </label>
              )}
            </div>

            {selectedGroupKey === "__custom__" && (
              <label className="block sm:w-1/2">
                <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                  {t("budget.amount")}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(formatRupiah(e.target.value))}
                  placeholder="mis. 500.000"
                  className="field"
                  required
                />
              </label>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" size="sm" loading={saving}>
                {t("budget.save")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {progressBudgets.length === 0 ? (
        <Card className="p-4 sm:p-5 text-center text-xs text-ink-3">
          {t("budget.empty")}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {progressBudgets.map((b) => {
            const pct = Math.round(b.ratio * 100);
            const barWidth = Math.min(b.ratio * 100, 100);
            const statusLabel =
              b.status === "exceeded"
                ? t("budget.statusExceeded")
                : b.status === "reached"
                ? t("budget.statusReached")
                : b.status === "near"
                ? t("budget.statusNear")
                : t("budget.statusSafe");

            return (
              <Card key={b.id || b.rowNumber} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-rule pb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Badge tone={categoryTone[b.category] || "neutral"}>
                        {b.category}
                      </Badge>
                      <Badge tone={statusTone[b.status] || "neutral"}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(b)}
                        className="rounded p-1 text-ink-3 hover:bg-paper-2 hover:text-ink text-xs transition-colors"
                        title={t("common.edit")}>
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBudget(b)}
                        className="rounded p-1 text-ink-3 hover:bg-danger-soft hover:text-danger text-xs transition-colors"
                        title={t("common.delete")}>
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-ink truncate" title={b.name}>
                      {b.name}
                    </h3>
                    <p className="text-[11px] text-ink-3 mt-0.5">
                      {b.bounds
                        ? t("budget.cycleRange", {
                            start: formatDisplayDate(b.bounds.startDate, lang),
                            end: formatDisplayDate(b.bounds.endDate, lang),
                          })
                        : ""}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-ink-3">{t("budget.spent")}:</span>
                      <span className="amount font-semibold text-ink">
                        {formatIDR(b.spent)}{" "}
                        <span className="text-[10px] text-ink-3 font-normal">/ {formatIDR(b.amount)}</span>
                      </span>
                    </div>

                    <div
                      role="progressbar"
                      aria-valuenow={b.spent}
                      aria-valuemin={0}
                      aria-valuemax={b.amount}
                      aria-label={b.name}
                      className="h-2 w-full overflow-hidden rounded-full bg-paper-3">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className={`h-full transition-[width] duration-300 ${
                          b.status === "exceeded" || b.status === "reached"
                            ? "bg-danger"
                            : b.status === "near"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="kbd text-ink-3">{pct}%</span>
                      <span
                        className={`amount font-medium ${
                          b.over ? "text-danger" : "text-ink-2"
                        }`}>
                        {b.over
                          ? `${t("budget.over")} ${formatIDR(Math.abs(b.remaining))}`
                          : `${t("budget.remaining")} ${formatIDR(b.remaining)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {b.items && b.items.length > 0 && (
                  <details className="group mt-3 border-t border-rule/60 pt-2 text-xs">
                    <summary className="cursor-pointer list-none text-[11px] text-ink-3 hover:text-ink flex items-center justify-between">
                      <span>{t("recap.txCount", { count: b.items.length })}</span>
                      <span className="transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto pr-1">
                      {b.items.map((item) => (
                        <li
                          key={item.id || item.rowNumber}
                          className="flex items-center justify-between text-[11px] text-ink-2">
                          <span className="truncate pr-2">{item.date} {item.description}</span>
                          <span className="amount font-medium shrink-0">{formatIDR(item.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Budget Modal */}
      <Modal
        open={Boolean(editingBudget)}
        onClose={() => setEditingBudget(null)}
        title={`${t("common.edit")} ${editingBudget?.name || ""}`}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingBudget(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              loading={savingEdit}
              onClick={handleSaveEdit}>
              {t("common.edit")}
            </Button>
          </>
        }>
        <div className="space-y-3">
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">
              {t("budget.amount")}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={editAmount}
              onChange={(e) => setEditAmount(formatRupiah(e.target.value))}
              className="field"
              required
            />
          </label>
        </div>
      </Modal>

      {/* Delete Budget Modal */}
      <Modal
        open={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        title={t("budget.deleteConfirm")}
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDeletingBudget(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}>
              {t("common.delete")}
            </Button>
          </>
        }>
        <p className="text-sm text-ink-2">
          {deletingBudget?.name} ({formatIDR(deletingBudget?.amount || 0)})
        </p>
      </Modal>
    </section>
  );
}
