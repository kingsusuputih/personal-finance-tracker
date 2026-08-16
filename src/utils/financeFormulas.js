export function calculateAllocations(monthlyIncome) {
  return {
    needs: monthlyIncome * 0.5,
    investments: monthlyIncome * 0.3,
    lifestyle: monthlyIncome * 0.2,
  }
}

export function calculateFundTargets(totalMonthlyExpenses) {
  return {
    emergencyFund: totalMonthlyExpenses * 6,
    retirementFund: totalMonthlyExpenses * 300,
  }
}

export function sumByCategory(transactions, category, month) {
  return transactions
    .filter((t) => t.category === category && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function sumForMonth(transactions, month) {
  return transactions
    .filter((t) => t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatRupiah(value) {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('id-ID')
}

export function parseRupiah(value) {
  return Number(String(value).replace(/\D/g, ''))
}

export function currentMonthKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function currentDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
