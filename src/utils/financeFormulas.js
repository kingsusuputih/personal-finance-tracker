export function calculateAllocations(monthlyIncome) {
  return {
    needs: monthlyIncome * 0.5,
    investments: monthlyIncome * 0.3,
    lifestyle: monthlyIncome * 0.2,
  };
}

export function calculateFundTargets(totalMonthlyExpenses) {
  return {
    emergencyFund: totalMonthlyExpenses * 6,
    retirementFund: totalMonthlyExpenses * 300,
  };
}

export function calculateCycleRecap({
  cycleKey,
  cycleStartDate,
  cycleEndDate,
  income = [],
  additionalIncome = [],
  transactions = [],
  allTransactions = [],
}) {
  const monthIncomes = income.filter((r) => r.month === cycleKey);
  const mainIncome = monthIncomes.length
    ? Number(monthIncomes[monthIncomes.length - 1].amount) || 0
    : 0;
  const hasMainIncome = monthIncomes.length > 0;

  const cycleAddIncomes = additionalIncome.filter(
    (a) => a.date >= cycleStartDate && a.date <= cycleEndDate,
  );
  const totalAdditionalIncome = cycleAddIncomes.reduce(
    (sum, a) => sum + (Number(a.amount) || 0),
    0,
  );
  const totalIncome = mainIncome + totalAdditionalIncome;

  const cycleTransactions = transactions.filter(
    (t) => t.date >= cycleStartDate && t.date <= cycleEndDate,
  );

  const needsExpenses = cycleTransactions
    .filter((t) => t.category === "Needs")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const lifestyleExpenses = cycleTransactions
    .filter((t) => t.category === "Lifestyle")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const consumptionExpenses = needsExpenses + lifestyleExpenses;

  const investmentExpenses = cycleTransactions
    .filter((t) => t.category === "Investment")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalMonthlyExpenses = consumptionExpenses + investmentExpenses;

  const surplusBeforeInvestment = totalIncome - consumptionExpenses;
  const remainingAfterInvestment = totalIncome - consumptionExpenses - investmentExpenses;

  const targetAllTx = allTransactions && allTransactions.length ? allTransactions : transactions;
  const cumulativeInvestments = targetAllTx
    .filter((t) => t.category === "Investment" && t.date <= cycleEndDate)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return {
    cycleKey,
    hasMainIncome,
    mainIncome,
    totalAdditionalIncome,
    additionalIncomes: cycleAddIncomes,
    totalIncome,
    needsExpenses,
    lifestyleExpenses,
    consumptionExpenses,
    investmentExpenses,
    totalMonthlyExpenses,
    surplusBeforeInvestment,
    remainingAfterInvestment,
    cumulativeInvestments,
    cycleTransactions,
  };
}

export function sumByCategory(transactions, category, month) {
  return transactions
    .filter((t) => t.category === category && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function sumForMonth(transactions, month) {
  return transactions
    .filter((t) => t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function formatIDR(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiah(value) {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

export function parseRupiah(value) {
  return Number(String(value).replace(/\D/g, ""));
}

export function currentMonthKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function currentDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
