import { useState, useEffect, useRef, useMemo } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore } from "../store/financeStore.js";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { useFinanceCalc } from "../hooks/useFinanceCalc.js";
import { sendChatMessage } from "../api/chat.js";
import { SHEETS, EXPENSE_CATEGORIES } from "../constants/sheets.js";
import {
  serializeExpenseRow,
  serializeIncomeRow,
  serializeAdditionalIncomeRow,
} from "../utils/sheetsHelpers.js";
import { formatIDR, formatRupiah, parseRupiah } from "../utils/financeFormulas.js";
import { parseBoldSegments } from "../utils/chatFormatting.js";
import { listAvailableCycles } from "../utils/cycleInventory.js";
import { buildChatContext } from "../utils/chatContext.js";
import {
  getEffectiveCutoff,
  getEffectiveTimezone,
  getCycleInfo,
  getCycleBounds,
  formatDisplayDate,
} from "../utils/dateTime.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";

function ProposalCard({ proposal, onSaved }) {
  const t = useT();
  const toast = useToast();
  const { addTransaction } = useSpreadsheet();

  const type = proposal.type || "expense";
  const [date, setDate] = useState(proposal.date || new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(
    EXPENSE_CATEGORIES.includes(proposal.category) ? proposal.category : EXPENSE_CATEGORIES[0],
  );
  const [descOrSource, setDescOrSource] = useState(proposal.description || proposal.source || "");
  const [amountStr, setAmountStr] = useState(formatRupiah(String(proposal.amount || "")));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("pending");

  const handleConfirm = async () => {
    const value = parseRupiah(amountStr);
    if (!value || value <= 0) {
      toast.error(t("form.err.amount"));
      return;
    }
    setSaving(true);
    try {
      if (type === "expense") {
        await addTransaction(
          SHEETS.EXPENSES,
          serializeExpenseRow(date, category, descOrSource, value),
        );
      } else if (type === "additional_income") {
        await addTransaction(
          SHEETS.ADDITIONAL_INCOME,
          serializeAdditionalIncomeRow(date, descOrSource || "Tambahan", value),
        );
      } else {
        const monthKey = date.slice(0, 7);
        await addTransaction(SHEETS.INCOME, serializeIncomeRow(monthKey, value));
      }
      setStatus("saved");
      toast.success(t("chat.draftSaved"));
      if (onSaved) onSaved();
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setSaving(false);
    }
  };

  if (status === "discarded") {
    return (
      <div className="mt-2 rounded border border-rule/50 bg-paper-2/40 p-2.5 text-xs text-ink-3 italic">
        {t("chat.draftDiscard")}
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div className="mt-2 flex items-center gap-1.5 rounded border border-success/30 bg-success/10 p-3 text-xs font-medium text-success">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {t("chat.draftSaved")} ({descOrSource || type} - {amountStr})
      </div>
    );
  }

  return (
    <Card className="mt-3 border-accent/40 bg-accent-soft/20 p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-accent uppercase tracking-wide">
          {t("chat.draftTitle")} ({type.replace("_", " ")})
        </span>
        <Badge tone="accent">Review</Badge>
      </div>
      <p className="mb-3 text-[11px] text-ink-3">
        {t("chat.draftDesc")}
      </p>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[10px] text-ink-3">{t("expense.date")}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field mt-0.5 py-1 text-xs"
            />
          </label>
          {type === "expense" ? (
            <label className="block">
              <span className="text-[10px] text-ink-3">{t("expense.category")}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field mt-0.5 py-1 text-xs">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="text-[10px] text-ink-3">
                {type === "additional_income" ? t("income.source") : t("income.month")}
              </span>
              <input
                type="text"
                value={descOrSource}
                onChange={(e) => setDescOrSource(e.target.value)}
                className="field mt-0.5 py-1 text-xs"
              />
            </label>
          )}
        </div>

        {type === "expense" && (
          <label className="block">
            <span className="text-[10px] text-ink-3">{t("expense.description")}</span>
            <input
              type="text"
              value={descOrSource}
              onChange={(e) => setDescOrSource(e.target.value)}
              className="field mt-0.5 py-1 text-xs"
            />
          </label>
        )}

        <label className="block">
          <span className="text-[10px] text-ink-3">{t("expense.amount")}</span>
          <input
            type="text"
            inputMode="numeric"
            value={amountStr}
            onChange={(e) => setAmountStr(formatRupiah(e.target.value))}
            className="field mt-0.5 py-1 text-xs font-semibold"
          />
        </label>

        <div className="mt-3 flex gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStatus("discarded")}
            className="text-xs py-1 px-3">
            {t("chat.draftDiscard")}
          </Button>
          <Button
            type="button"
            loading={saving}
            onClick={handleConfirm}
            className="flex-1 text-xs py-1">
            {t("chat.draftConfirm")}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ChatPage() {
  const t = useT();
  const { lang } = useI18n();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { ensureSpreadsheet, loadData } = useSpreadsheet();

  const income = useFinanceStore((s) => s.income || []);
  const additionalIncome = useFinanceStore((s) => s.additionalIncome || []);
  const transactions = useFinanceStore((s) => s.transactions || []);
  const budgets = useFinanceStore((s) => s.budgets || []);
  const settings = useFinanceStore((s) => s.settings);

  const timeZone = getEffectiveTimezone(settings);
  const cutoffDay = getEffectiveCutoff(settings);
  const currentCycleInfo = getCycleInfo(new Date(), timeZone, cutoffDay);
  const currentCycle = currentCycleInfo.cycleKey;

  const [selectedCycle, setSelectedCycle] = useState("");
  const [compareCycle, setCompareCycle] = useState("");

  const activeCycle = selectedCycle || currentCycle;
  const activeBounds = getCycleBounds(activeCycle, cutoffDay) || currentCycleInfo;

  const availableCycles = useMemo(() => {
    return listAvailableCycles({
      income,
      additionalIncome,
      transactions,
      budgets,
      currentCycle,
      cutoffDay,
    });
  }, [income, additionalIncome, transactions, budgets, currentCycle, cutoffDay]);

  const { recap } = useFinanceCalc(activeCycle);

  const [consentGranted, setConsentGranted] = useState(() => {
    return localStorage.getItem("finance_ai_consent") === "true";
  });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: t("chat.defaultGreeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const messagesEndRef = useRef(null);

  const handleActiveCycleChange = (nextCycle) => {
    if (nextCycle === activeCycle) return;
    setSelectedCycle(nextCycle);
    if (compareCycle === nextCycle) {
      setCompareCycle("");
    }
    setMessages([
      {
        role: "assistant",
        text: t("chat.defaultGreeting"),
      },
    ]);
  };

  const handleCompareCycleChange = (nextCompare) => {
    if (nextCompare === compareCycle) return;
    setCompareCycle(nextCompare);
    setMessages([
      {
        role: "assistant",
        text: t("chat.defaultGreeting"),
      },
    ]);
  };

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData();
    });
  }, [ensureSpreadsheet, loadData]);

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleAgreeConsent = () => {
    localStorage.setItem("finance_ai_consent", "true");
    setConsentGranted(true);
  };

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading || cooldownSeconds > 0) return;

    setInput("");
    const newHistory = [...messages, { role: "user", text: textToSend }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const summary = buildChatContext({
        activeCycleKey: activeCycle,
        compareCycleKey: compareCycle || null,
        income,
        additionalIncome,
        transactions,
        settings,
        availableCycles,
      });

      const res = await sendChatMessage({
        accessToken,
        message: textToSend,
        history: newHistory,
        summary,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.reply,
          proposal: res.proposal,
        },
      ]);
    } catch (err) {
      if (err.retryAfter) {
        setCooldownSeconds(err.retryAfter);
      }
      toast.error(err.message || t("toast.error"));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err.message || t("chat.quotaExceeded"),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-5xl flex-col px-4 pb-24 pt-6 md:px-8 md:pt-10 md:pb-28 lg:pb-6">
            <header className="mb-8">
              <p className="kbd mb-1 text-[11px] text-ink-3">
                {t("chat.kicker")}
              </p>
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl lg:text-[clamp(1.75rem,4vw,2.5rem)]">
                {t("chat.title")}
              </h1>
              <p className="mt-2 text-sm text-ink-3">
                {t("chat.subtitle")}
              </p>
            </header>

            {!consentGranted ? (
              <Card className="my-auto p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-ink sm:text-lg">
                  {t("chat.consentTitle")}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-ink-3 sm:text-sm">
                  {t("chat.consentDesc")}
                </p>

                <div className="mx-auto my-4 max-w-md rounded-md bg-paper-2 p-3 text-left text-xs">
                  <span className="font-semibold text-ink-2">Ringkasan yang dibaca AI:</span>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-ink-3">
                    <li>· Total Pemasukan: {formatIDR(recap.totalIncome)}</li>
                    <li>· Pengeluaran Konsumsi: {formatIDR(recap.consumptionExpenses)}</li>
                    <li>· Surplus / Sisa: {formatIDR(recap.surplusBeforeInvestment)}</li>
                    <li>· Akumulasi Ditabung: {formatIDR(recap.cumulativeInvestments)}</li>
                  </ul>
                </div>

                <div className="mt-5 flex justify-center gap-3">
                  <Button type="button" onClick={handleAgreeConsent}>
                    {t("chat.consentAgree")}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex flex-1 flex-col overflow-hidden rounded-card border border-rule bg-paper shadow-sm">
                <div className="border-b border-rule bg-paper-2/40 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-1.5">
                      <span className="text-ink-3 font-medium">{t("chat.selectPeriod")}:</span>
                      <select
                        value={activeCycle}
                        onChange={(e) => handleActiveCycleChange(e.target.value)}
                        className="field py-1 px-2 text-xs h-7">
                        {availableCycles.map((c) => (
                          <option key={c} value={c}>
                            {c} {c === currentCycle ? `(${t("chat.activeBadge")})` : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-center gap-1.5">
                      <span className="text-ink-3 font-medium">{t("chat.comparePeriod")}:</span>
                      <select
                        value={compareCycle}
                        onChange={(e) => handleCompareCycleChange(e.target.value)}
                        className="field py-1 px-2 text-xs h-7">
                        <option value="">{t("chat.noCompare")}</option>
                        {availableCycles
                          .filter((c) => c !== activeCycle)
                          .map((c) => (
                            <option key={c} value={c}>
                              {c} {c === currentCycle ? `(${t("chat.activeBadge")})` : ""}
                            </option>
                          ))}
                      </select>
                    </label>
                  </div>

                  <div className="text-[11px] text-ink-3 font-medium">
                    {activeBounds && (
                      <span>
                        {formatDisplayDate(activeBounds.startDate, lang)} – {formatDisplayDate(activeBounds.endDate, lang)}
                      </span>
                    )}
                  </div>
                </div>

                {cooldownSeconds > 0 && (
                  <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-xs font-medium text-warning flex items-center justify-between">
                    <span>{t("chat.quotaExceeded")}</span>
                    <span className="font-mono">
                      {t("chat.cooldownTimer", { seconds: cooldownSeconds })}
                    </span>
                  </div>
                )}

                <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                          m.role === "user"
                            ? "bg-accent text-accent-ink"
                            : m.isError
                            ? "border border-danger/30 bg-danger/10 text-danger"
                            : "bg-paper-2 text-ink"
                        }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {m.role === "assistant" && !m.isError
                            ? parseBoldSegments(m.text).map((seg, i) =>
                                seg.bold ? (
                                  <strong key={i} className="font-semibold text-ink">
                                    {seg.text}
                                  </strong>
                                ) : (
                                  seg.text
                                ),
                              )
                            : m.text}
                        </div>
                        {m.proposal && (
                          <ProposalCard proposal={m.proposal} />
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-paper-2 px-4 py-2.5 text-ink-3 text-xs italic flex items-center gap-2">
                        <span className="inline-block h-2 w-2 animate-ping rounded-full bg-accent" />
                        AI sedang memproses...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-rule bg-paper-2/40 p-3">
                  <div className="mb-2 flex flex-wrap gap-1.5 text-[11px]">
                    <button
                      type="button"
                      disabled={loading || cooldownSeconds > 0}
                      onClick={() =>
                        handleSend(
                          compareCycle
                            ? `Bandingkan kondisi keuangan periode ${activeCycle} dengan periode ${compareCycle}.`
                            : `Bagaimana analisa kondisi keuangan saya pada periode ${activeCycle}?`,
                        )
                      }
                      className="rounded border border-rule bg-paper px-2 py-0.5 text-ink-2 hover:bg-paper-3 disabled:opacity-50">
                      {compareCycle
                        ? `Bandingkan ${activeCycle} vs ${compareCycle}`
                        : `Analisa periode ${activeCycle}`}
                    </button>
                    <button
                      type="button"
                      disabled={loading || cooldownSeconds > 0}
                      onClick={() =>
                        handleSend(`Berapa sisa uang yang bisa saya tabung pada periode ${activeCycle}?`)
                      }
                      className="rounded border border-rule bg-paper px-2 py-0.5 text-ink-2 hover:bg-paper-3 disabled:opacity-50">
                      Sisa tabungan {activeCycle}?
                    </button>
                    <button
                      type="button"
                      disabled={loading || cooldownSeconds > 0}
                      onClick={() => handleSend("Catat pengeluaran beli rokok 30rb masuk kategori lifestyle")}
                      className="rounded border border-rule bg-paper px-2 py-0.5 text-ink-2 hover:bg-paper-3 disabled:opacity-50">
                      + Draf beli rokok 30rb
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading || cooldownSeconds > 0}
                      placeholder={t("chat.inputPlaceholder")}
                      aria-label={t("chat.inputPlaceholder")}
                      className="field flex-1 text-xs sm:text-sm"
                    />
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={!input.trim() || cooldownSeconds > 0}
                      className="px-4">
                      {t("chat.send")}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
