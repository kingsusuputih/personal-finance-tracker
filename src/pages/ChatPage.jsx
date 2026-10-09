import { useState, useEffect, useRef, useMemo } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useFinanceStore } from "../store/financeStore.js";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { useFinanceCalc } from "../hooks/useFinanceCalc.js";
import { sendChatMessage } from "../api/chat.js";
import { getRows, appendRow, clearSheetRows, deleteRows } from "../api/googleSheets.js";
import { SHEETS, EXPENSE_CATEGORIES, CHAT_HISTORY_HEADERS } from "../constants/sheets.js";
import {
  serializeExpenseRow,
  serializeIncomeRow,
  serializeAdditionalIncomeRow,
  serializeChatRow,
  deserializeRows,
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
  formatTransactionTime,
} from "../utils/dateTime.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
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

function createSessionId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
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

  const [rawChatRows, setRawChatRows] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(() => createSessionId());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingSession, setDeletingSession] = useState(null);
  const [deletingSessionLoading, setDeletingSessionLoading] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const messagesEndRef = useRef(null);
  const initialLoadedRef = useRef(false);

  const sessions = useMemo(() => {
    const map = new Map();
    rawChatRows.forEach((r) => {
      const sid = r.session_id || "legacy_session";
      if (!map.has(sid)) {
        map.set(sid, {
          id: sid,
          title: r.session_title || t("chat.untitledSession"),
          lastTimestamp: r.timestamp || "",
          cycleKey: r.cycle_key || "",
          rowNumbers: [],
          messageCount: 0,
        });
      }
      const s = map.get(sid);
      s.messageCount += 1;
      if (r.rowNumber) s.rowNumbers.push(r.rowNumber);
      if (r.timestamp && (!s.lastTimestamp || r.timestamp > s.lastTimestamp)) {
        s.lastTimestamp = r.timestamp;
      }
      if (r.session_title && r.session_title !== t("chat.untitledSession")) {
        s.title = r.session_title;
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      return (b.lastTimestamp || "").localeCompare(a.lastTimestamp || "");
    });
  }, [rawChatRows, t]);

  const activeSessionMessages = useMemo(() => {
    const sessionRows = rawChatRows.filter(
      (r) => (r.session_id || "legacy_session") === activeSessionId,
    );
    if (sessionRows.length === 0) {
      return [
        {
          role: "assistant",
          text: t("chat.defaultGreeting"),
        },
      ];
    }
    return sessionRows.map((r) => ({
      id: r.id,
      role: r.role,
      text: r.message,
      proposal: r.proposal,
      timestamp: r.timestamp,
      isError: r.isError,
    }));
  }, [rawChatRows, activeSessionId, t]);

  const handleActiveCycleChange = (nextCycle) => {
    if (nextCycle === activeCycle) return;
    setSelectedCycle(nextCycle);
    if (compareCycle === nextCycle) {
      setCompareCycle("");
    }
  };

  const handleCompareCycleChange = (nextCompare) => {
    if (nextCompare === compareCycle) return;
    setCompareCycle(nextCompare);
  };

  const handleNewChat = () => {
    const nextId = createSessionId();
    setActiveSessionId(nextId);
    setMobileDrawerOpen(false);
  };

  useEffect(() => {
    let active = true;
    ensureSpreadsheet().then(async (id) => {
      if (!id || !active) return;
      loadData();
      if (!accessToken) return;
      try {
        setHistoryLoading(true);
        const rawRows = await getRows(accessToken, id, SHEETS.CHAT_HISTORY).catch(() => []);
        if (!active) return;
        const rows = deserializeRows(CHAT_HISTORY_HEADERS, rawRows);
        if (rows.length > 0) {
          const loaded = rows.map((r) => {
            let proposal = null;
            if (r.proposal_json) {
              try {
                proposal = JSON.parse(r.proposal_json);
              } catch {
                proposal = null;
              }
            }
            return {
              rowNumber: r.rowNumber,
              id: r.id,
              session_id: r.session_id || "legacy_session",
              session_title: r.session_title || "",
              role: r.role,
              message: r.message,
              proposal,
              timestamp: r.timestamp,
              cycle_key: r.cycle_key,
            };
          });
          setRawChatRows(loaded);

          if (!initialLoadedRef.current) {
            const map = new Map();
            loaded.forEach((m) => {
              const sid = m.session_id || "legacy_session";
              if (!map.has(sid) || (m.timestamp && m.timestamp > map.get(sid))) {
                map.set(sid, m.timestamp || "");
              }
            });
            const sortedSessions = Array.from(map.entries()).sort((a, b) =>
              b[1].localeCompare(a[1]),
            );
            if (sortedSessions.length > 0) {
              setActiveSessionId(sortedSessions[0][0]);
            }
            initialLoadedRef.current = true;
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        if (active) setHistoryLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [ensureSpreadsheet, loadData, accessToken]);

  const handleDeleteSession = async () => {
    if (!deletingSession) return;
    const spreadsheetId = useFinanceStore.getState().spreadsheetId;
    if (!accessToken || !spreadsheetId) return;
    setDeletingSessionLoading(true);
    try {
      if (deletingSession.rowNumbers.length > 0) {
        await deleteRows(
          accessToken,
          spreadsheetId,
          SHEETS.CHAT_HISTORY,
          deletingSession.rowNumbers,
        );
      }
      setRawChatRows((prev) =>
        prev.filter((r) => (r.session_id || "legacy_session") !== deletingSession.id),
      );
      toast.success(t("chat.sessionDeleted"));
      if (activeSessionId === deletingSession.id) {
        const remaining = sessions.filter((s) => s.id !== deletingSession.id);
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : createSessionId());
      }
      setDeletingSession(null);
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setDeletingSessionLoading(false);
    }
  };

  const handleClearHistory = async () => {
    const spreadsheetId = useFinanceStore.getState().spreadsheetId;
    if (!accessToken || !spreadsheetId) return;
    setClearing(true);
    try {
      await clearSheetRows(accessToken, spreadsheetId, SHEETS.CHAT_HISTORY);
      setRawChatRows([]);
      setActiveSessionId(createSessionId());
      toast.success(t("chat.historyCleared"));
      setClearConfirmOpen(false);
      setMobileDrawerOpen(false);
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeSessionMessages]);

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

    const currentSession = sessions.find((s) => s.id === activeSessionId);
    const sessionTitle =
      currentSession?.title && currentSession.title !== t("chat.untitledSession")
        ? currentSession.title
        : textToSend.slice(0, 32) + (textToSend.length > 32 ? "..." : "");

    const msgId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    const timestamp = new Date().toISOString();

    const userRow = {
      id: msgId,
      session_id: activeSessionId,
      session_title: sessionTitle,
      role: "user",
      message: textToSend,
      cycle_key: activeCycle,
      timestamp,
    };

    setRawChatRows((prev) => [...prev, userRow]);
    setLoading(true);

    const spreadsheetId = useFinanceStore.getState().spreadsheetId;

    if (accessToken && spreadsheetId) {
      appendRow(
        accessToken,
        spreadsheetId,
        SHEETS.CHAT_HISTORY,
        serializeChatRow(
          activeSessionId,
          sessionTitle,
          "user",
          textToSend,
          activeCycle,
          null,
          timestamp,
          msgId,
        ),
      ).catch((e) => console.error("Failed to save user chat to sheet:", e));
    }

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

      const sessionHistory = [...activeSessionMessages, { role: "user", text: textToSend }]
        .filter((m) => !m.isError)
        .slice(-10);

      const res = await sendChatMessage({
        accessToken,
        message: textToSend,
        history: sessionHistory,
        summary,
      });

      const assistantMsgId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now() + 1);
      const assistantTimestamp = new Date().toISOString();

      const assistantRow = {
        id: assistantMsgId,
        session_id: activeSessionId,
        session_title: sessionTitle,
        role: "assistant",
        message: res.reply,
        proposal: res.proposal,
        cycle_key: activeCycle,
        timestamp: assistantTimestamp,
      };

      setRawChatRows((prev) => [...prev, assistantRow]);

      if (accessToken && spreadsheetId) {
        appendRow(
          accessToken,
          spreadsheetId,
          SHEETS.CHAT_HISTORY,
          serializeChatRow(
            activeSessionId,
            sessionTitle,
            "assistant",
            res.reply,
            activeCycle,
            res.proposal,
            assistantTimestamp,
            assistantMsgId,
          ),
        ).catch((e) => console.error("Failed to save assistant chat to sheet:", e));
      }
    } catch (err) {
      if (err.retryAfter) {
        setCooldownSeconds(err.retryAfter);
      }
      toast.error(err.message || t("toast.error"));
      setRawChatRows((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          session_id: activeSessionId,
          session_title: sessionTitle,
          role: "assistant",
          message: err.message || t("chat.quotaExceeded"),
          isError: true,
          cycle_key: activeCycle,
          timestamp: new Date().toISOString(),
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
              <div className="flex flex-1 overflow-hidden rounded-card border border-rule bg-paper shadow-sm">
                {/* Desktop Sessions Sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col border-r border-rule bg-paper-2/30">
                  <div className="p-3 border-b border-rule">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleNewChat}
                      className="w-full justify-center gap-1.5 text-xs font-semibold py-1.5 shadow-xs">
                      <span>+</span> {t("chat.newChat")}
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.length === 0 ? (
                      <p className="p-3 text-center text-xs text-ink-3">
                        {t("chat.noSessions")}
                      </p>
                    ) : (
                      sessions.map((sess) => (
                        <div
                          key={sess.id}
                          onClick={() => setActiveSessionId(sess.id)}
                          role="button"
                          tabIndex={0}
                          className={`group flex items-center justify-between rounded-btn p-2 text-xs transition-colors cursor-pointer ${
                            sess.id === activeSessionId
                              ? "bg-paper border border-rule font-medium text-ink shadow-xs"
                              : "text-ink-2 hover:bg-paper-2"
                          }`}>
                          <div className="min-w-0 flex-1 pr-1.5">
                            <p className="truncate">{sess.title}</p>
                            {sess.lastTimestamp && (
                              <p className="text-[10px] text-ink-3">
                                {formatTransactionTime(sess.lastTimestamp, timeZone, lang)}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingSession(sess);
                            }}
                            title={t("chat.deleteSession")}
                            className="opacity-0 group-hover:opacity-100 p-1 text-ink-3 hover:text-danger rounded transition-opacity">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {sessions.length > 0 && (
                    <div className="p-2 border-t border-rule">
                      <button
                        type="button"
                        onClick={() => setClearConfirmOpen(true)}
                        className="w-full text-center text-[10px] text-ink-3 hover:text-danger transition-colors py-1">
                        {t("chat.clearHistory")}
                      </button>
                    </div>
                  )}
                </aside>

                {/* Main Chat Content */}
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="border-b border-rule bg-paper-2/40 px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMobileDrawerOpen(true)}
                        className="md:hidden flex items-center gap-1.5 rounded-btn border border-rule bg-paper px-2 py-1 text-xs text-ink-2 hover:bg-paper-2">
                        <svg className="h-3.5 w-3.5 text-ink-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{t("chat.sessions")} ({sessions.length})</span>
                      </button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleNewChat}
                        className="md:hidden h-7 px-2 text-xs">
                        {t("chat.newChat")}
                      </Button>

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

                    <div className="flex items-center gap-2 text-[11px] text-ink-3 font-medium">
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
                    {historyLoading && (
                      <div className="space-y-2 p-2">
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="ml-auto h-8 w-1/2" />
                      </div>
                    )}
                    {activeSessionMessages.map((m, idx) => (
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
            </div>
          )}
        </div>
      </main>
    </div>

    <Modal
      open={clearConfirmOpen}
      onClose={() => setClearConfirmOpen(false)}
      title={t("chat.clearHistoryConfirm")}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => setClearConfirmOpen(false)}
            disabled={clearing}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            loading={clearing}
            onClick={handleClearHistory}>
            {t("common.delete")}
          </Button>
        </>
      }>
      {t("chat.clearHistoryDesc")}
    </Modal>

    <Modal
      open={Boolean(deletingSession)}
      onClose={() => setDeletingSession(null)}
      title={t("chat.deleteSessionConfirm")}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => setDeletingSession(null)}
            disabled={deletingSessionLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            loading={deletingSessionLoading}
            onClick={handleDeleteSession}>
            {t("common.delete")}
          </Button>
        </>
      }>
      {t("chat.deleteSessionDesc")}
    </Modal>

    <Modal
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      title={t("chat.sessions")}
      maxWidth="max-w-sm">
      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleNewChat}
          className="w-full justify-center gap-1.5 text-xs font-semibold py-2">
          <span>+</span> {t("chat.newChat")}
        </Button>
        <div className="max-h-64 overflow-y-auto space-y-1 py-1">
          {sessions.length === 0 ? (
            <p className="p-3 text-center text-xs text-ink-3">
              {t("chat.noSessions")}
            </p>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => {
                  setActiveSessionId(sess.id);
                  setMobileDrawerOpen(false);
                }}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between rounded-btn p-2 text-xs transition-colors cursor-pointer ${
                  sess.id === activeSessionId
                    ? "bg-paper-2 border border-rule font-medium text-ink"
                    : "text-ink-2 hover:bg-paper-2"
                }`}>
                <div className="min-w-0 flex-1 pr-1.5">
                  <p className="truncate">{sess.title}</p>
                  {sess.lastTimestamp && (
                    <p className="text-[10px] text-ink-3">
                      {formatTransactionTime(sess.lastTimestamp, timeZone, lang)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingSession(sess);
                  }}
                  title={t("chat.deleteSession")}
                  className="p-1 text-ink-3 hover:text-danger rounded">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        {sessions.length > 0 && (
          <div className="pt-2 border-t border-rule text-center">
            <button
              type="button"
              onClick={() => {
                setClearConfirmOpen(true);
              }}
              className="text-xs text-ink-3 hover:text-danger">
              {t("chat.clearHistory")}
            </button>
          </div>
        )}
      </div>
    </Modal>

    <BottomNav />
  </div>
);
}
