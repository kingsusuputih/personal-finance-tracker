import { useMemo, useState } from "react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { useI18n } from "../../i18n/LanguageProvider.jsx";
import { useToast } from "../ui/Toast.jsx";
import { useSpreadsheet } from "../../hooks/useSpreadsheet.js";
import { SHEETS } from "../../constants/sheets.js";
import { formatIDR } from "../../utils/financeFormulas.js";
import {
  getEffectiveTimezone,
  transactionSortTimestamp,
  formatTransactionTime,
} from "../../utils/dateTime.js";

const categoryTone = {
  Needs: "accent",
  Lifestyle: "warning",
  Investment: "success",
};

function ActionButton({ label, tone, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-btn p-2 text-ink-3 transition-colors hover:bg-paper-3 ${tone}`}>
      {children}
    </button>
  );
}

const PAGE_SIZE = 15;

export function TransactionTable({
  transactions = [],
  loading = false,
  onEdit,
}) {
  const [sortDir, setSortDir] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { lang, t } = useI18n();
  const toast = useToast();
  const { deleteTransaction, settings } = useSpreadsheet();
  const timeZone = getEffectiveTimezone(settings);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((row) => {
      const desc = (row.description || "").toLowerCase();
      const cat = (row.category || "").toLowerCase();
      const grp = (row.group_override || "").toLowerCase();
      const date = (row.date || "").toLowerCase();
      const amountStr = String(row.amount || "");
      return (
        desc.includes(q) ||
        cat.includes(q) ||
        grp.includes(q) ||
        date.includes(q) ||
        amountStr.includes(q)
      );
    });
  }, [transactions, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const diff =
        sortDir === "desc"
          ? transactionSortTimestamp(b) - transactionSortTimestamp(a)
          : transactionSortTimestamp(a) - transactionSortTimestamp(b);
      if (diff !== 0) return diff;
      const rowA = Number(a.rowNumber) || 0;
      const rowB = Number(b.rowNumber) || 0;
      return sortDir === "desc" ? rowB - rowA : rowA - rowB;
    });
  }, [filtered, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRows = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const confirmDelete = async () => {
    if (!deletingRow) return;
    setDeleting(true);
    try {
      await deleteTransaction(SHEETS.EXPENSES, deletingRow.rowNumber);
      toast.success(t("expense.deleted"));
      setDeletingRow(null);
    } catch (err) {
      toast.error(err.message || t("delete.title"));
    } finally {
      setDeleting(false);
    }
  };

  const actions = (row) => (
    <div className="flex shrink-0 items-center gap-1">
      <ActionButton
        label={t("common.edit")}
        tone="hover:text-accent"
        onClick={() => onEdit?.(row)}>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true">
          <path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </ActionButton>
      <ActionButton
        label={t("common.delete")}
        tone="hover:text-danger"
        onClick={() => setDeletingRow(row)}>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </ActionButton>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-ink">{t("table.title")}</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="kbd text-[10px] text-ink-3 transition-colors hover:text-accent">
            {sortDir === "desc" ? t("table.newest") : t("table.oldest")}
          </button>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="relative border-b border-rule px-5 py-3">
          <span className="pointer-events-none absolute inset-y-0 left-8 flex items-center text-ink-3">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t("table.searchPlaceholder")}
            className="field pl-9 pr-8 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-8 flex items-center text-xs text-ink-3 hover:text-ink"
              aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-ink">
            {t("table.empty.title")}
          </p>
          <p className="mt-1 text-sm text-ink-3">{t("table.empty.body")}</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-ink">
            {t("table.noSearchResults")}
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-rule sm:hidden">
            {paginatedRows.map((row) => (
              <li
                key={row.rowNumber}
                className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={categoryTone[row.category] || "neutral"}>
                      {row.category}
                    </Badge>
                    <span className="kbd text-[10px] text-ink-3">
                      {row.date}
                      {row.created_at && (
                        <span className="ml-1 text-ink-3/80">
                          · {formatTransactionTime(row.created_at, timeZone, lang)}
                        </span>
                      )}
                    </span>
                  </div>
                  {row.description && (
                    <p className="mt-1 truncate text-sm text-ink-2">
                      {row.description}
                      {row.group_override && (
                        <span className="ml-1.5 rounded bg-paper-3 px-1.5 py-0.5 text-[10px] text-ink-3">
                          {row.group_override}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="amount text-sm font-medium text-ink">
                    {formatIDR(row.amount)}
                  </span>
                  {actions(row)}
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="kbd border-b border-rule text-left text-[10px] text-ink-3">
                  <th className="px-5 py-2 font-medium">{t("table.date")}</th>
                  <th className="px-5 py-2 font-medium">
                    {t("table.category")}
                  </th>
                  <th className="px-5 py-2 font-medium">
                    {t("table.description")}
                  </th>
                  <th className="px-5 py-2 text-right font-medium">
                    {t("table.amount")}
                  </th>
                  <th className="px-5 py-2 text-right font-medium">
                    {t("table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => (
                  <tr
                    key={row.rowNumber}
                    className="border-b border-rule last:border-0 transition-colors hover:bg-paper-2/60">
                    <td className="kbd whitespace-nowrap px-5 py-3 text-xs text-ink-3">
                      <div>{row.date}</div>
                      {row.created_at && (
                        <div className="text-[10px] text-ink-3/80">
                          {formatTransactionTime(row.created_at, timeZone, lang)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={categoryTone[row.category] || "neutral"}>
                        {row.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-2">
                      {row.description || <span className="text-ink-3">-</span>}
                      {row.group_override && (
                        <span className="ml-2 rounded bg-paper-3 px-1.5 py-0.5 text-[10px] text-ink-3">
                          {row.group_override}
                        </span>
                      )}
                    </td>
                    <td className="amount whitespace-nowrap px-5 py-3 text-right font-medium text-ink">
                      {formatIDR(row.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">{actions(row)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-rule px-5 py-3 text-xs text-ink-3">
            <div>
              {t("table.paginationInfo", {
                start: startIndex + 1,
                end: Math.min(startIndex + PAGE_SIZE, sorted.length),
                total: sorted.length,
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="py-1 px-2.5 text-xs">
                  {t("table.prevPage")}
                </Button>
                <span className="kbd text-[11px] text-ink-2">
                  {t("table.pageOf", { page: safePage, totalPages })}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="py-1 px-2.5 text-xs">
                  {t("table.nextPage")}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        open={Boolean(deletingRow)}
        onClose={() => setDeletingRow(null)}
        title={t("delete.title")}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeletingRow(null)}
              disabled={deleting}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              {t("delete.confirm")}
            </Button>
          </>
        }>
        {t("delete.body")}
      </Modal>
    </Card>
  );
}
